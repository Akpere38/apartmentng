import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-200 rounded-2xl flex items-center justify-center">
        <p className="text-slate-500">No images available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const CarouselContent = () => (
    <>
      {/* Main Image */}
      <div className="relative w-full h-full group">
        <img
          src={images[currentIndex].image_url}
          alt={`Apartment ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight className="w-6 h-6 text-slate-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Fullscreen Button */}
        {!isFullScreen && (
          <button
            onClick={() => setIsFullScreen(true)}
            className="absolute top-4 right-4 px-4 py-2 bg-black/70 hover:bg-black/80 backdrop-blur-sm rounded-full text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            View Fullscreen
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && !isFullScreen && (
        <div className="flex gap-2 overflow-x-auto py-4 px-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-teal-500 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <img
                src={image.image_url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Normal View */}
      <div className="w-full">
        <div className="w-full h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-slate-200">
          <CarouselContent />
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Fullscreen Image */}
          <div className="flex-1 flex items-center justify-center p-4">
            <CarouselContent />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;