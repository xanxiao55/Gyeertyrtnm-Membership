import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/marathons')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marathons
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img
              src={marathon.image}
              alt={marathon.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{marathon.title}</h1>
              <div className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                {marathon.location}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Registration Period</p>
                    <p className="text-sm">
                      {formatDate(marathon.startRegistrationDate)} - {formatDate(marathon.endRegistrationDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Marathon Date</p>
                    <p className="text-sm">{formatDate(marathon.marathonStartDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Total Registrations</p>
                    <p className="text-sm">{marathon.totalRegistrationCount} participants</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Time Until Marathon</h3>
                  <CountdownCircleTimer
                    isPlaying
                    duration={getTimeUntilMarathon()}
                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                    colorsTime={[7, 5, 2, 0]}
                    size={120}
                  >
                    {({ remainingTime }) => {
                      const days = Math.floor(remainingTime / 86400);
                      const hours = Math.floor((remainingTime % 86400) / 3600);
                      const minutes = Math.floor((remainingTime % 3600) / 60);
                      
                      return (
                        <div className="text-center">
                          <div className="text-lg font-bold">{days}d</div>
                          <div className="text-sm">{hours}h {minutes}m</div>
                        </div>
                      );
                    }}
                  </CountdownCircleTimer>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Marathon</h2>
              <p className="text-gray-600 leading-relaxed">{marathon.description}</p>
            </div>

            <div className="flex justify-center">
              {isRegistrationOpen() ? (
                <button
                  onClick={() => setShowRegistrationForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
                >
                  Register Now
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Registration is currently closed</p>
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
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold"
                    >
                      Register
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegistrationForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-semibold"
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