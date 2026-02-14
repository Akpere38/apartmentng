import { Play } from 'lucide-react';
import { useState } from 'react';

const VideoPlayer = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(0);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
        Property Video Tour
      </h2>

      {/* Main Video */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 mb-4">
        <video
          src={videos[selectedVideo].video_url}
          controls
          className="w-full aspect-video"
          poster=""
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Thumbnails (if multiple) */}
      {videos.length > 1 && (
        <div className="flex gap-4 overflow-x-auto">
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(index)}
              className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedVideo
                  ? 'border-teal-500 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="w-32 h-20 bg-slate-800 flex items-center justify-center">
                <Play className="w-8 h-8 text-white/80" />
              </div>
              <div className="absolute inset-0 bg-black/20" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;