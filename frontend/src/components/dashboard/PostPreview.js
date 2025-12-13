import React from 'react';
import Card from '../ui/Card';
import { Youtube, Instagram, Facebook, Twitter } from 'lucide-react';

// Helper function to get the YouTube video ID from a URL
const getYouTubeId = (url) => {
  // --- FIX: Add a safety check to ensure the URL is a valid string ---
  if (typeof url !== 'string') {
    return null;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ... (YouTubePreview, ImagePostPreview, and GenericPreview components remain the same)
const YouTubePreview = ({ postContext, url }) => {
    const videoId = getYouTubeId(url);
    if (!videoId) return <GenericPreview url={url} platform="YouTube" />;

    return (
        <div>
            <div className="aspect-video mb-4">
                <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <h3 className="text-xl font-bold">{postContext.title || 'YouTube Video'}</h3>
            <p className="text-gray-400 mt-2 line-clamp-3">{postContext.description || 'No description available.'}</p>
        </div>
    );
};

const ImagePostPreview = ({ postContext, url, platform }) => {
    const imageUrl =
        postContext.images?.[0] ||
        postContext.media?.[0]?.thumbnail ||
        postContext.media?.[0]?.url;

    const text = postContext.text || postContext.caption || 'No text content.';

    return (
        <div className="flex flex-col md:flex-row md:space-x-4">
            {imageUrl && (
                <img src={imageUrl} alt="Post media" className="w-full md:w-48 h-48 object-cover rounded-lg mb-4 md:mb-0 flex-shrink-0"/>
            )}
            <div>
                <h4 className="text-lg font-semibold capitalize mb-2">{platform} Post</h4>
                <p className="text-gray-300 line-clamp-6">{text}</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mt-3 inline-block">
                    View Original Post
                </a>
            </div>
        </div>
    );
};

const GenericPreview = ({ url, platform }) => (
    <div>
        <h4 className="text-lg font-semibold capitalize mb-2">{platform} Post</h4>
        <p className="text-gray-400">Preview not available for this post.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mt-3 inline-block">
            View Original Post
        </a>
    </div>
);


// --- FIX: Accept `postUrl` as a prop here ---
const PostPreview = ({ postContext, postUrl }) => {
  if (!postContext) {
    return (
      <Card title="Analyzed Post">
        <p className="text-gray-400">Post information is loading or unavailable.</p>
      </Card>
    );
  }

  // Use the platform from postContext, but the URL from the new prop
  const { platform } = postContext;

  const renderPreview = () => {
    switch (platform.toUpperCase()) {
      case 'YOUTUBE':
        // Pass the correct `postUrl` to the child component
        return <YouTubePreview postContext={postContext} url={postUrl} />;
      case 'FACEBOOK':
      case 'INSTAGRAM':
      case 'TWITTER':
        return <ImagePostPreview postContext={postContext} url={postUrl} platform={platform} />;
      default:
        return <GenericPreview url={postUrl} platform={platform} />;
    }
  };

  return <Card title="Analyzed Post">{renderPreview()}</Card>;
};

export default PostPreview;