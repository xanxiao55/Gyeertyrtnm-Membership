import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, ArrowLeft, Star, Trophy, Target } from 'lucide-react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import marathonsData from '../data/marathons.json';
import toast from 'react-hot-toast';

export default function MarathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marathon, setMarathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    additionalInfo: ''
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundMarathon = marathonsData.find(m => m.id === id);
      setMarathon(foundMarathon);
      setLoading(false);
    }, 1000);
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isRegistrationOpen = () => {
    if (!marathon) return false;
    const now = new Date();
    const startDate = new Date(marathon.startRegistrationDate);
    const endDate = new Date(marathon.endRegistrationDate);
    return now >= startDate && now <= endDate;
  };

  const getTimeUntilMarathon = () => {
    if (!marathon) return 0;
    const marathonDate = new Date(marathon.marathonStartDate);
    const now = new Date();
    return Math.max(0, Math.floor((marathonDate - now) / 1000));
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send data to backend
    toast.success('Registration successful!');
    setShowRegistrationForm(false);
    // Update registration count (simulate)
    setMarathon(prev => ({
      ...prev,
      totalRegistrationCount: prev.totalRegistrationCount + 1
    }));
  };

  const handleInputChange = (e) => {
    setRegistrationData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-lg">Loading marathon details...</p>
        </div>
      </div>
    );
  }

  if (!marathon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Marathon Not Found</h2>
          <button
            onClick={() => navigate('/marathons')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Marathons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/marathons')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marathons
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 sm:h-80 lg:h-96">
            <img
              src={marathon.image}
              alt={marathon.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {marathon.runningDistance}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                {marathon.title}
              </h1>
              <div className="flex items-center text-base sm:text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                {marathon.location}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Key Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600 mb-1">Registration Period</p>
                <p className="font-semibold text-gray-900">
                  {formatDateShort(marathon.startRegistrationDate)} - {formatDateShort(marathon.endRegistrationDate)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-gray-600 mb-1">Marathon Date</p>
                <p className="font-semibold text-gray-900">
                  {formatDateShort(marathon.marathonStartDate)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-gray-600 mb-1">Participants</p>
                <p className="font-semibold text-gray-900">
                  {marathon.totalRegistrationCount}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-sm text-gray-600 mb-1">Distance</p>
                <p className="font-semibold text-gray-900">
                  {marathon.runningDistance}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Marathon Description */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Marathon</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{marathon.description}</p>
                
                {/* Additional Details */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Registration Opens:</span>
                      <p className="text-gray-600">{formatDate(marathon.startRegistrationDate)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Registration Closes:</span>
                      <p className="text-gray-600">{formatDate(marathon.endRegistrationDate)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Marathon Date:</span>
                      <p className="text-gray-600">{formatDate(marathon.marathonStartDate)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Distance:</span>
                      <p className="text-gray-600">{marathon.runningDistance}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-6 text-center text-gray-900">
                  Time Until Marathon
                </h3>
                <CountdownCircleTimer
                  isPlaying
                  duration={getTimeUntilMarathon()}
                  colors={['#3B82F6', '#F59E0B', '#EF4444', '#DC2626']}
                  colorsTime={[7, 5, 2, 0]}
                  size={140}
                  strokeWidth={8}
                >
                  {({ remainingTime }) => {
                    const days = Math.floor(remainingTime / 86400);
                    const hours = Math.floor((remainingTime % 86400) / 3600);
                    const minutes = Math.floor((remainingTime % 3600) / 60);
                    
                    return (
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{days}</div>
                        <div className="text-sm text-gray-600">days</div>
                        <div className="text-xs text-gray-500">{hours}h {minutes}m</div>
                      </div>
                    );
                  }}
                </CountdownCircleTimer>
              </div>
            </div>

            {/* Registration Section */}
            <div className="text-center bg-gray-50 p-6 sm:p-8 rounded-lg">
              {isRegistrationOpen() ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Join?</h3>
                  <p className="text-gray-600 mb-6">Registration is currently open for this marathon event.</p>
                  <button
                    onClick={() => setShowRegistrationForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Register Now
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Closed</h3>
                  <p className="text-gray-600 mb-6">Registration for this marathon is currently closed.</p>
                  <button
                    disabled
                    className="bg-gray-400 text-white px-8 py-3 rounded-lg text-lg font-semibold cursor-not-allowed"
                  >
                    Registration Closed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        {showRegistrationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Register for {marathon.title}</h3>
                
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marathon Title
                    </label>
                    <input
                      type="text"
                      value={marathon.title}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marathon Date
                    </label>
                    <input
                      type="text"
                      value={formatDate(marathon.marathonStartDate)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={registrationData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={registrationData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={registrationData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={registrationData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={registrationData.additionalInfo}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Any special requirements or comments..."
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-200"
                    >
                      Register
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegistrationForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-semibold transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}