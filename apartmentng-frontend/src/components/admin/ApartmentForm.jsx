import { useState, useEffect } from 'react';
import { createApartment, updateApartment, uploadImages, uploadVideo, deleteImage, deleteVideo } from '../../services/apartmentService';
import Button from '../common/Button';
import { Home, MapPin, Bed, Bath, DollarSign, FileText, Upload, X, Image, Video, Wifi, Car, Utensils, Tv, Wind, Dumbbell, Shield, Coffee, Gamepad2} from 'lucide-react';

const ApartmentForm = ({ onSuccess, onCancel, editData = null }) => {
  const isEditMode = !!editData;
  
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    location: editData?.location || '',
    bedrooms: editData?.bedrooms || '',
    bathrooms: editData?.bathrooms || '',
    price_per_night: editData?.price_per_night || '',
    amenities: editData?.amenities ? JSON.parse(editData.amenities) : [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [existingImages, setExistingImages] = useState(editData?.images || []);
  const [existingVideos, setExistingVideos] = useState(editData?.videos || []);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const availableAmenities = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'kitchen', label: 'Kitchen', icon: Utensils },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'ac', label: 'Air Conditioning', icon: Wind },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'generator', label: 'Generator', icon: Coffee },
    { id: 'ps5', label: 'PS5', icon: Gamepad2}

  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const toggleAmenity = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length > 10) {
      setError('Maximum 10 images allowed in total');
      return;
    }

    setSelectedImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('Video file size must be less than 50MB');
        return;
      }
      setSelectedVideo(file);
      setVideoPreviews(URL.createObjectURL(file));
    }
  };

  const removeNewImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = async (imageId) => {
    if (window.confirm('Delete this image?')) {
      try {
        await deleteImage(editData.id, imageId);
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
      } catch (err) {
        setError('Failed to delete image');
      }
    }
  };

  const removeExistingVideo = async (videoId) => {
    if (window.confirm('Delete this video?')) {
      try {
        await deleteVideo(editData.id, videoId);
        setExistingVideos(prev => prev.filter(vid => vid.id !== videoId));
      } catch (err) {
        setError('Failed to delete video');
      }
    }
  };

  const removeNewVideo = () => {
    setSelectedVideo(null);
    setVideoPreviews(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apartmentData = {
        ...formData,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        price_per_night: parseFloat(formData.price_per_night) || 0,
        amenities: JSON.stringify(formData.amenities),
      };

      let apartmentId;

      if (isEditMode) {
        // Update existing apartment
        setUploadProgress('Updating apartment...');
        await updateApartment(editData.id, apartmentData);
        apartmentId = editData.id;
      } else {
        // Create new apartment
        setUploadProgress('Creating apartment...');
        const response = await createApartment(apartmentData);
        apartmentId = response.apartment.id;
      }

      // Upload new images if selected
      if (selectedImages.length > 0) {
        setUploadProgress(`Uploading ${selectedImages.length} images to Cloudinary...`);
        await uploadImages(apartmentId, selectedImages);
      }

      // Upload new video if selected
      if (selectedVideo) {
        setUploadProgress('Uploading video to Cloudinary...');
        await uploadVideo(apartmentId, selectedVideo);
      }

      setUploadProgress('Success!');
      
      if (!isEditMode) {
        // Clear form only for new apartment
        setFormData({
          title: '',
          description: '',
          location: '',
          bedrooms: '',
          bathrooms: '',
          price_per_night: '',
          amenities: [],
        });
        setSelectedImages([]);
        setSelectedVideo(null);
        setImagePreviews([]);
        setVideoPreviews(null);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} apartment`);
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {uploadProgress && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
          <p className="text-teal-700 text-sm flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {uploadProgress}
          </p>
        </div>
      )}

      {/* Basic Information */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2 text-teal-600" />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Property Title *
            </label>
            <div className="relative">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Luxury 3-Bedroom Apartment in Lekki"
                required
                className="input-field pl-12"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Lekki Phase 1, Lagos"
                required
                className="input-field pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Bedrooms
            </label>
            <div className="relative">
              <Bed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="input-field pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Bathrooms
            </label>
            <div className="relative">
              <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="input-field pl-12"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Price per Night (₦) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={handleChange}
                placeholder="50000"
                required
                min="0"
                step="1000"
                className="input-field pl-12"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the apartment, amenities, nearby attractions, etc."
                rows="5"
                className="input-field pl-12 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Amenities
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableAmenities.map((amenity) => {
            const Icon = amenity.icon;
            const isSelected = formData.amenities.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                <p className={`text-sm font-medium ${isSelected ? 'text-teal-700' : 'text-slate-600'}`}>
                  {amenity.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Images */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Image className="w-5 h-5 mr-2 text-teal-600" />
          Property Images
        </h3>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Current Images</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_url}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {image.is_primary === 1 && (
                    <span className="absolute bottom-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            {existingImages.length > 0 ? 'Add More Images' : 'Upload Images'}
          </p>
          <label className="cursor-pointer">
            <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-8 text-center transition-colors">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-medium mb-1">
                Click to upload images
              </p>
              <p className="text-sm text-slate-500">
                PNG, JPG, WEBP (Max {10 - existingImages.length} more images)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              disabled={existingImages.length >= 10}
            />
          </label>
        </div>

        {/* New Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Video className="w-5 h-5 mr-2 text-teal-600" />
          Property Video (Optional)
        </h3>

        {/* Existing Videos */}
        {existingVideos.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Current Video</p>
            {existingVideos.map((video) => (
              <div key={video.id} className="relative mb-4">
                <video
                  src={video.video_url}
                  controls
                  className="w-full h-64 rounded-lg bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => removeExistingVideo(video.id)}
                  className="absolute top-2 right-2 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload New Video */}
        {!videoPreviews && existingVideos.length === 0 && (
          <div>
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-8 text-center transition-colors">
                <Video className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-700 font-medium mb-1">
                  Click to upload video
                </p>
                <p className="text-sm text-slate-500">
                  MP4, MOV, AVI (Max 50MB)
                </p>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* New Video Preview */}
        {videoPreviews && (
          <div className="relative">
            <video
              src={videoPreviews}
              controls
              className="w-full h-64 rounded-lg bg-slate-900"
            />
            <button
              type="button"
              onClick={removeNewVideo}
              className="absolute top-2 right-2 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Apartment' : 'Create Apartment')}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ApartmentForm;