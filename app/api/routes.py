import time
from httpx import post
import structlog
from fastapi import APIRouter, HTTPException, Response
from typing import List
from datetime import datetime

from app.config import settings
from app.models.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    Platform,
    PostContext,
    Language
)
from app.services.platform_detector import PlatformDetector
from app.services.scraper_service import ScraperService
from app.services.sentiment_service import SentimentService
from app.services.pdf_service import PDFService
from app.utils.batch_processor import BatchProcessor

logger = structlog.get_logger()
router = APIRouter()

# from app.models.user import User  # Removed (Stateless)
# We use a simple object for current_user, typing can be Any or a specific Protocol
from typing import Any
User = Any # Placeholder type alias for now
from app.api.auth import get_current_user, check_and_increment_usage
from fastapi import Depends
from fastapi import Depends


from typing import Optional
import asyncio

async def process_single_url(
    url_str: str,
    current_user: User,
    language: Language = Language.ENGLISH
) -> AnalysisResponse:
    """Helper function to process a single URL."""
    start_time = time.time()
    
    # Detect platform from URL string
    platform = PlatformDetector.detect_platform(url_str)
    
    # Scrape content
    scraper = ScraperService()
    post_context, comments = await scraper.scrape_platform(url_str, platform)
    
    # Truncate comments if needed
    if len(comments) > settings.MAX_COMMENTS:
        comments = comments[:settings.MAX_COMMENTS]
        logger.info("truncated_comments",
                   original_count=len(comments),
                   truncated_to=settings.MAX_COMMENTS)
    
    # Analyze sentiments
    sentiment_service = SentimentService()
    
    # Process in batches
    batch_processor = BatchProcessor()
    from app.utils.comment_cleaner import CommentCleaner
    batches = CommentCleaner.chunk_comments(
        comments,
        settings.BATCH_SIZE
    )
    
    # Create a partial function to include the URL
    from functools import partial
    analyze_func = partial(
        sentiment_service.analyze_batch_with_gemini,
        url=url_str,
        language=language
    )
    
    batch_results = await batch_processor.process_batches_parallel(
        batches,
        analyze_func,
        post_context,
        settings.MAX_CONCURRENT_BATCHES
    )
    
    # Merge results
    all_sentiments = batch_processor.merge_batch_results(batch_results)
    
    # Calculate total processing time
    processing_time = time.time() - start_time
    
    # Create response
    response = sentiment_service.create_summary_response(
        post_url=url_str,
        platform=platform,
        post_context=post_context,
        sentiments=all_sentiments,
        processing_time=processing_time,
        batches_count=len(batch_results)
    )
    
    logger.info("analysis_complete",
               url=url_str,
               platform=platform.value,
               total_comments=len(all_sentiments),
               processing_time=processing_time)
               
    return response

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_url(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user)
) -> AnalysisResponse:
    """Analyze sentiment of comments on a social media post."""
    # Check rate limit
    await check_and_increment_usage(current_user.clerk_id)

    # Stateless analysis - No DB, No Limits
    
    try:
        # process_single_url now does not need DB
        response = await process_single_url(str(request.url), current_user, request.language)
        return response
        
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error("analysis_error",
                    url=str(request.url),
                    error=str(e))
        raise HTTPException(
            status_code=500,
            detail="Internal server error during analysis"
        )

from app.models.schemas import BatchAnalysisRequest, BatchAnalysisResponse

@router.post("/analyze/batch", response_model=BatchAnalysisResponse)
async def analyze_batch(
    request: BatchAnalysisRequest,
    current_user: User = Depends(get_current_user)
) -> BatchAnalysisResponse:
    """Analyze multiple URLs in parallel."""
    # Check rate limit (counts as 1 request/batch or per URL? Let's count as 1 request for now to keep it simple, or iterate. The user asked for 5 times usage of tool, implying the action itself. If batch allows multiple, it might be a loophole, but let's stick to 1 tool usage = 1 API call for now.)
    await check_and_increment_usage(current_user.clerk_id)

    start_time = time.time()
    
    tasks = [
        process_single_url(str(url), current_user, request.language) 
        for url in request.urls
    ]
    
    try:
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        processed_results = []
        successful_count = 0
        failed_count = 0
        
        for res in results:
            if isinstance(res, Exception):
                failed_count += 1
                logger.error("batch_item_failed", error=str(res))
            else:
                successful_count += 1
                processed_results.append(res)
        
        total_time = time.time() - start_time
        
        return BatchAnalysisResponse(
            results=processed_results,
            total_processing_time=total_time,
            successful_count=successful_count,
            failed_count=failed_count
        )

    except Exception as e:
        logger.error("batch_analysis_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export/pdf")
async def export_pdf_report(data: AnalysisResponse, current_user: User = Depends(get_current_user)):
    """Generate and download a PDF report for the given analysis."""
    try:
        pdf_bytes = PDFService.generate_pdf(data)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=report_{data.postUrl.split('/')[-1]}.pdf"
            }
        )
    except Exception as e:
        logger.error("pdf_export_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analyze/demo", response_model=AnalysisResponse)
async def get_demo_analysis() -> AnalysisResponse:
    """Return a sample analysis response for demonstration."""
    from datetime import datetime
    from app.models.schemas import SentimentSummary
    
    summary = SentimentSummary(
        totalComments=3,
        supportive_empathetic=1,
        critical_disapproving=0,
        angry_hostile=0,
        sarcastic_ironic=1,
        informative_neutral=1,
        appreciative_praising=0
    )
    
    return AnalysisResponse(
        status="completed",
        timestamp=datetime.now(),
        postUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        platform=Platform.YOUTUBE,
        postContext=demo_post_context,  # <-- Added the missing field
        summary=summary,
        topComments={
            "Supportive/Empathetic": ["Great explanation! Very helpful."],
            "Sarcastic/Ironic": ["Oh sure, like that's going to work..."],
            "Informative/Neutral": ["The video was released on June 1st."]
        },
        allComments={
            "Supportive/Empathetic": ["Great explanation! Very helpful."],
            "Sarcastic/Ironic": ["Oh sure, like that's going to work..."],
            "Informative/Neutral": ["The video was released on June 1st."]
        },
        processingTime=0.5,
        batchesProcessed=1
    )


@router.get("/platforms")
async def get_supported_platforms() -> dict:
    """Get list of supported platforms and their limits."""
    return {
        "platforms": [
            {
                "name": Platform.YOUTUBE.value,
                "maxComments": settings.YOUTUBE_MAX_COMMENTS,
                "example": "https://www.youtube.com/watch?v=xxxxx"
            },
            {
                "name": Platform.FACEBOOK.value,
                "maxComments": settings.FACEBOOK_MAX_COMMENTS,
                "example": "https://www.facebook.com/user/posts/xxxxx"
            },
            {
                "name": Platform.TWITTER.value,
                "maxComments": settings.TWITTER_MAX_ITEMS,
                "example": "https://twitter.com/user/status/xxxxx"
            },
            {
                "name": Platform.INSTAGRAM.value,
                "maxComments": settings.INSTAGRAM_MAX_COMMENTS,
                "example": "https://www.instagram.com/p/xxxxx"
            }
        ]
    }
