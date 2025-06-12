import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Clock, FileText, Image, Trophy } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Marathon</h1>
            <p className="text-gray-600">Fill in the details to create your marathon event</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter marathon title"
                />
                <Trophy className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Registration Date *
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.startRegistrationDate}
                    onChange={(date) => handleDateChange(date, 'startRegistrationDate')}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="Select start date"
                    minDate={new Date()}
                  />
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="Select end date"
                    minDate={formData.startRegistrationDate || new Date()}
                  />
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="Select marathon date"
                    minDate={formData.endRegistrationDate || new Date()}
                  />
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

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
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter marathon location"
                />
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {distanceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

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
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL"
                />
                <Image className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

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
                  rows="4"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your marathon event"
                />
                <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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