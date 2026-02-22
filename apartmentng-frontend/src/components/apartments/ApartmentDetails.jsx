import { MapPin, Bed, Bath, User, CheckCircle, XCircle, Star, Phone, Mail, MessageCircle, Wifi, Car, Utensils, Tv, Wind, Dumbbell, Shield, Coffee, Gamepad2 } from 'lucide-react';
import MapDisplay from '../common/MapDisplay';
import { useAuth } from "../../context/AuthContext";


const ApartmentDetails = ({ apartment }) => {

  const { isAdmin } = useAuth();

  const {
    id,
    title,
    description,
    location,
    bedrooms,
    bathrooms,
    price_per_night,
    is_available,
    is_featured,
    amenities,
  } = apartment;

  // Parse amenities
  let parsedAmenities = [];
  if (amenities) {
    try {
      parsedAmenities = JSON.parse(amenities);
    } catch (e) {
      parsedAmenities = [];
    }
  }

  // Amenity icons mapping
  const amenityIcons = {
    wifi: { icon: Wifi, label: 'WiFi' },
    parking: { icon: Car, label: 'Parking' },
    kitchen: { icon: Utensils, label: 'Kitchen' },
    tv: { icon: Tv, label: 'TV' },
    ac: { icon: Wind, label: 'Air Conditioning' },
    gym: { icon: Dumbbell, label: 'Gym' },
    security: { icon: Shield, label: '24/7 Security' },
    generator: { icon: Coffee, label: 'Generator' },
    ps5: {icon: Gamepad2, label: 'PS5'}
  };

  const generateWhatsAppMessage = () => {
    const apartmentUrl = window.location.href;
    const message = `Hi! I'm interested in this apartment:\n\n*${title}*\nLocation: ${location}\nPrice: ₦${price_per_night?.toLocaleString()}/night\nBedrooms: ${bedrooms || 0} | Bathrooms: ${bathrooms || 0}\n\nLink: ${apartmentUrl}\n\nCan you provide more information?`;
    return encodeURIComponent(message);
  };

  const whatsappNumber = '23490157627819';
  const phoneNumber = '+234 901 5762 7819';
  const email = 'info@apartmentng.com';
  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {is_featured === 1 && (
            <span className="badge bg-gradient-to-r from-amber-500 to-amber-600 text-white">
              <Star className="w-3 h-3 mr-1 fill-white" />
              Featured Property
            </span>
          )}
          {is_available === 1 ? (
          <span className="badge badge-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Available Now
          </span>
        ) : (
          <span className="badge badge-danger">
            <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Currently Booked
          </span>
        )}
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
          {title}
        </h1>

        <div className="flex items-center text-slate-600 mb-6">
          <MapPin className="w-5 h-5 mr-2 text-teal-500" />
          <span className="text-lg">{location}</span>
        </div>

        <div className="card-glass inline-block px-8 py-4">
          <p className="text-4xl font-bold text-gradient mb-1">
            ₦{price_per_night?.toLocaleString()}
          </p>
          <p className="text-slate-600 font-medium">per night</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="card p-6 text-center">
          <Bed className="w-8 h-8 text-teal-500 mx-auto mb-3" />
          <p className="text-2xl font-bold text-slate-900">{bedrooms || 0}</p>
          <p className="text-sm text-slate-600">Bedrooms</p>
        </div>

        <div className="card p-6 text-center">
          <Bath className="w-8 h-8 text-teal-500 mx-auto mb-3" />
          <p className="text-2xl font-bold text-slate-900">{bathrooms || 0}</p>
          <p className="text-sm text-slate-600">Bathrooms</p>
        </div>

        <div className="card p-6 text-center">
          <User className="w-8 h-8 text-teal-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-900">Managed by</p>
          <p className="text-xs text-slate-600">Apartment NG</p>
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">
          About This Property
        </h2>
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {description || 'No description available for this property.'}
        </p>
      </div>

                      {/* Agent Contact Card - Admin Only */}
                      {isAdmin && apartment.created_by === 'agent' && apartment.agent_name && (                  <div className="card-elevated bg-gradient-to-br from-navy-50 via-white to-teal-50 p-8 border-2 border-navy-200">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-medium">
                        <span className="text-white font-bold text-2xl">
                          {apartment.agent_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-navy-600 mb-1">Property Managed By</p>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{apartment.agent_name}</h3>
                        {apartment.agent_company && (
                          <p className="text-slate-600">{apartment.agent_company}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {apartment.agent_phone && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-600">Phone</p>
                            <p className="font-semibold text-slate-900 truncate">{apartment.agent_phone}</p>
                          </div>
                        </div>
                      )}

                      {apartment.agent_email && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-600">Email</p>
                            <p className="font-semibold text-slate-900 truncate text-sm">{apartment.agent_email}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {apartment.agent_phone && (
                        
                         <a href={`tel:${apartment.agent_phone}`}
                          className="btn-primary"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call Agent
                        </a>
                      )}
                      {apartment.agent_email && (
                        
                         <a href={`mailto:${apartment.agent_email}?subject=Client Inquiry - ${apartment.title}&body=Hi ${apartment.agent_name},%0D%0A%0D%0AI have a client interested in your property:%0D%0A${apartment.title}%0D%0ALocation: ${apartment.location}%0D%0APrice: ₦${apartment.price_per_night?.toLocaleString()}/night%0D%0A%0D%0APlease contact them as soon as possible.%0D%0A%0D%0ARegards,%0D%0AApartment NG Admin`}
                          className="btn-secondary"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email Agent
                        </a>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                      <p className="text-xs text-teal-800">
                        💡 <strong>Admin Only:</strong> This contact card is only visible to admins. Use these buttons to quickly reach the agent when clients inquire.
                      </p>
                    </div>
                  </div>
                )}

                {isAdmin && apartment.created_by === 'admin' && (
                  <div className="card p-6 bg-gradient-to-r from-teal-50 to-teal-100 border-2 border-teal-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-teal-700">Platform Listing</p>
                        <p className="font-bold text-teal-900">Managed Directly by Apartment NG</p>
                      </div>
                    </div>
                  </div>
                )}

      {parsedAmenities.length > 0 && (
        <div className="card p-8">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
            Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {parsedAmenities.map((amenityId) => {
              const amenity = amenityIcons[amenityId];
              if (!amenity) return null;
              const Icon = amenity.icon;
              return (
                <div key={amenityId} className="flex items-center space-x-3 p-4 bg-teal-50 rounded-xl">
                  <Icon className="w-6 h-6 text-teal-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-900">{amenity.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* // openstreetmap component, after amenities: */}
      <MapDisplay address={location} title={title} />


      <div className="card-elevated bg-gradient-to-br from-teal-50 to-navy-50 p-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">
            Interested in this property?
          </h2>
          <p className="text-slate-700 mb-6">
            Get in touch with us to schedule a viewing or learn more about availability and booking details.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <a href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`} target="_blank" rel="noopener noreferrer" className="btn-primary bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600">
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
            <a href={`tel:${phoneNumber}`} className="btn-primary">
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </a>
            <a href={`mailto:${email}?subject=Inquiry about ${title}`} className="btn-secondary">
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </a>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Contact Information:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-slate-700">
                <Phone className="w-4 h-4 mr-2 text-teal-600" />
                <a href={`tel:${phoneNumber}`} className="hover:text-teal-600 transition-colors">
                  {phoneNumber}
                </a>
              </div>
              <div className="flex items-center text-slate-700">
                <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">
                  WhatsApp: {phoneNumber}
                </a>
              </div>
              <div className="flex items-center text-slate-700">
                <Mail className="w-4 h-4 mr-2 text-teal-600" />
                <a href={`mailto:${email}`} className="hover:text-teal-600 transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-3">Share this property:</p>
            <div className="flex gap-3">
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }} className="btn-ghost text-sm">
                📋 Copy Link
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent('Check out this amazing apartment: ' + title + ' - ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm text-green-600 hover:bg-green-50">
                <MessageCircle className="w-4 h-4 mr-1" />
                Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Sticky Call Button */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-slate-200 shadow-strong">
      <div className="flex gap-3">
        
        <a  href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`}
          className="btn-primary flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600">
        
          <MessageCircle className="w-5 h-5 mr-2" />
          WhatsApp
        </a>
        
          <a href={`tel:${phoneNumber}`}
          className="btn-primary flex-1">
          <Phone className="w-5 h-5 mr-2" />
          Call Now
        </a>
      </div>
    </div>
    <div className="space-y-8 pb-24 md:pb-8">
  {/* All your existing content */}
    </div>      
    </div>
  );
};

export default ApartmentDetails;