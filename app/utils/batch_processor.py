import asyncio
import structlog
from typing import List, Callable, TypeVar
from app.models.schemas import CleanedComment, BatchResult, PostContext, CommentSentiment

logger = structlog.get_logger()

T = TypeVar('T')

class BatchProcessor:
    @staticmethod
    async def process_batches_parallel(
        batches: List[List[CleanedComment]],
        processor_func: Callable,
        post_context: PostContext,
        max_concurrent: int
    ) -> List[BatchResult]:
        """Process batches of comments in parallel with rate limiting."""
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def process_with_semaphore(batch: List[CleanedComment], batch_number: int) -> BatchResult:
            async with semaphore:
                try:
                    return await processor_func(post_context, batch, batch_number)
                except Exception as e:
                    logger.error("batch_processing_error", 
                               batch_number=batch_number, 
                               error=str(e))
                    return BatchResult(
                        batchNumber=batch_number,
                        sentiments=[],
                        processingTime=0.0,
                        error=str(e)
                    )

        # Create tasks for all batches
        tasks = [
            process_with_semaphore(batch, idx)
            for idx, batch in enumerate(batches)
        ]
        
        # Process all batches and collect results
        batch_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out any unexpected exceptions
        valid_results = [
            result for result in batch_results
            if isinstance(result, BatchResult)
        ]
        
        logger.info("batch_processing_complete",
                   total_batches=len(batches),
                   successful_batches=len(valid_results))
                   
        return valid_results

    @staticmethod
    def merge_batch_results(batch_results: List[BatchResult]) -> List[CommentSentiment]:
        """Merge results from successful batches."""
        # Filter out failed batches
        successful_batches = [
            result for result in batch_results
            if not result.error
        ]
        
        # Flatten all sentiments from successful batches
        all_sentiments = []
        for batch in successful_batches:
            all_sentiments.extend(batch.sentiments)
        
        # Log summary
        logger.info("batch_results_merged",
                   total_batches=len(batch_results),
                   successful_batches=len(successful_batches),
                   failed_batches=len(batch_results) - len(successful_batches),
                   total_sentiments=len(all_sentiments))
                   
        return all_sentiments