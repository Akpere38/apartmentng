import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

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

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullScreen) return;
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') setIsFullScreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const CarouselContent = () => (
    <>
      {/* Main Image */}
      <div 
        className="relative w-full h-full group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[currentIndex].image_url}
          alt={`Apartment ${currentIndex + 1}`}
          className="w-full h-full object-cover select-none"
          draggable="false"
        />
        
        {/* Navigation Arrows - Hidden on mobile, visible on hover for desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-medium items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>
            <button
              onClick={goToNext}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-medium items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <ChevronRight className="w-6 h-6 text-slate-800" />
            </button>
          </>
        )}

        {/* Swipe Indicator for Mobile */}
        <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium animate-pulse">
          ← Swipe →
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Fullscreen Button */}
        {!isFullScreen && (
          <button
            onClick={() => setIsFullScreen(true)}
            className="absolute top-4 right-4 px-4 py-2 bg-black/70 hover:bg-black/80 backdrop-blur-sm rounded-full text-white text-sm font-medium opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity duration-200"
          >
            View Fullscreen
          </button>
        )}
      </div>

      {/* Dot Indicators for Mobile */}
      {images.length > 1 && (
        <div className="md:hidden flex justify-center gap-2 py-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-teal-500 w-6' 
                  : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails - Desktop Only */}
      {images.length > 1 && !isFullScreen && (
        <div className="hidden md:flex gap-2 overflow-x-auto py-4 px-2 scrollbar-hide">
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