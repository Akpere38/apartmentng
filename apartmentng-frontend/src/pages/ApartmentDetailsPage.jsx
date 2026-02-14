import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApartmentById } from '../services/apartmentService';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ImageCarousel from '../components/common/ImageCarousel';
import ApartmentDetails from '../components/apartments/ApartmentDetails';
import VideoPlayer from '../components/apartments/VideoPlayer';
import { ArrowLeft } from 'lucide-react';

const ApartmentDetailsPage = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);
        const data = await getApartmentById(id);
        setApartment(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load apartment details');
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner fullScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Apartment Not Found</h2>
            <p className="text-slate-600 mb-8">{error}</p>
            <Link to="/" className="btn-primary">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Back Button */}
        <div className="bg-white border-b border-slate-200">
          <div className="container-custom py-4">
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-teal-600 transition-colors font-medium">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to all apartments
            </Link>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="space-y-12">
            {/* Image Gallery */}
            {apartment.images && apartment.images.length > 0 && (
              <ImageCarousel images={apartment.images} />
            )}

            {/* Apartment Details */}
            <ApartmentDetails apartment={apartment} />

            {/* Video Tour */}
            {apartment.videos && apartment.videos.length > 0 && (
              <VideoPlayer videos={apartment.videos} />
            )}

            {/* Similar Properties Placeholder */}
            <div className="card p-8 bg-gradient-to-br from-teal-50 to-slate-50">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">
                Looking for more options?
              </h2>
              <p className="text-slate-700 mb-6">
                Explore our other premium properties that might interest you.
              </p>
              <Link to="/" className="btn-primary">
                View All Apartments
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApartmentDetailsPage;