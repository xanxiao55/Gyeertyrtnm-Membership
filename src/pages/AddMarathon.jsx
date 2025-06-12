import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Clock, FileText, Image, Trophy, ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

export default function AddMarathon() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startRegistrationDate: null,
    endRegistrationDate: null,
    marathonStartDate: null,
    location: '',
    runningDistance: '10k',
    description: '',
    image: ''
  });

  const distanceOptions = [
    { value: '3k', label: '3K Run' },
    { value: '10k', label: '10K Run' },
    { value: '25k', label: '25K Run' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.description || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.startRegistrationDate || !formData.endRegistrationDate || !formData.marathonStartDate) {
      toast.error('Please select all dates');
      return;
    }

    if (formData.startRegistrationDate >= formData.endRegistrationDate) {
      toast.error('End registration date must be after start registration date');
      return;
    }

    if (formData.endRegistrationDate >= formData.marathonStartDate) {
      toast.error('Marathon start date must be after registration end date');
      return;
    }

    try {
      setLoading(true);
      
      const marathonData = {
        ...formData,
        createdAt: new Date(),
        totalRegistrationCount: 0,
        createdBy: currentUser.uid
      };

      // Here you would normally send data to backend
      console.log('Marathon data:', marathonData);
      
      toast.success('Marathon created successfully!');
      navigate('/my-marathons');
    } catch (error) {
      console.error('Error creating marathon:', error);
      toast.error('Failed to create marathon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/marathons')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marathons
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Marathon</h1>
            <p className="text-gray-600">Fill in the details to create your marathon event</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Marathon Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Marathon Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter marathon title"
                />
                <Trophy className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Registration Date *
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.startRegistrationDate}
                    onChange={(date) => handleDateChange(date, 'startRegistrationDate')}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholderText="Select start date"
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                  />
                  <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Registration Date *
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.endRegistrationDate}
                    onChange={(date) => handleDateChange(date, 'endRegistrationDate')}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholderText="Select end date"
                    minDate={formData.startRegistrationDate || new Date()}
                    dateFormat="MMMM d, yyyy"
                  />
                  <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marathon Start Date *
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.marathonStartDate}
                    onChange={(date) => handleDateChange(date, 'marathonStartDate')}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholderText="Select marathon date"
                    minDate={formData.endRegistrationDate || new Date()}
                    dateFormat="MMMM d, yyyy"
                  />
                  <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Location and Distance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter marathon location"
                  />
                  <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="runningDistance" className="block text-sm font-medium text-gray-700 mb-2">
                  Running Distance *
                </label>
                <div className="relative">
                  <select
                    id="runningDistance"
                    name="runningDistance"
                    value={formData.runningDistance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    {distanceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Marathon Image URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter image URL"
                />
                <Image className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Provide a high-quality image URL that represents your marathon event
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your marathon event in detail..."
                />
                <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Provide detailed information about the marathon route, facilities, and what participants can expect
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Marathon...' : 'Create Marathon'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/marathons')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}