import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowUpDown, Search, Filter, Users, Clock } from 'lucide-react';
import marathonsData from '../data/marathons.json';

export default function Marathons() {
  const [marathons, setMarathons] = useState([]);
  const [filteredMarathons, setFilteredMarathons] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistance, setFilterDistance] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMarathons(marathonsData);
      setFilteredMarathons(marathonsData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...marathons];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(marathon =>
        marathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marathon.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply distance filter
    if (filterDistance !== 'all') {
      filtered = filtered.filter(marathon => marathon.runningDistance === filterDistance);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'popular') {
        return b.totalRegistrationCount - a.totalRegistrationCount;
      } else if (sortBy === 'date') {
        return new Date(a.marathonStartDate) - new Date(b.marathonStartDate);
      }
      return 0;
    });

    setFilteredMarathons(filtered);
  }, [marathons, searchTerm, filterDistance, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRegistrationStatus = (marathon) => {
    const now = new Date();
    const startDate = new Date(marathon.startRegistrationDate);
    const endDate = new Date(marathon.endRegistrationDate);
    
    if (now < startDate) {
      return { status: 'upcoming', text: 'Registration Opens Soon', color: 'text-blue-600 bg-blue-50' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'open', text: 'Registration Open', color: 'text-green-600 bg-green-50' };
    } else {
      return { status: 'closed', text: 'Registration Closed', color: 'text-red-600 bg-red-50' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-lg">Loading marathons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            All Marathons
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Discover amazing marathon events from around the world and find your next challenge.
          </p>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search marathons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Distance Filter */}
              <div className="relative">
                <select
                  value={filterDistance}
                  onChange={(e) => setFilterDistance(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Distances</option>
                  <option value="3k">3K Run</option>
                  <option value="10k">10K Run</option>
                  <option value="25k">25K Run</option>
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="date">By Marathon Date</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-center sm:justify-start">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  {filteredMarathons.length} marathon{filteredMarathons.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
          </div>
        </div>

        {filteredMarathons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500 text-lg mb-4">
              {searchTerm || filterDistance !== 'all' 
                ? 'No marathons found matching your criteria' 
                : 'No marathons available'
              }
            </div>
            {(searchTerm || filterDistance !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDistance('all');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
            {!searchTerm && filterDistance === 'all' && (
              <Link
                to="/add-marathon"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Create Your First Marathon
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredMarathons.map((marathon) => {
              const registrationStatus = getRegistrationStatus(marathon);
              
              return (
                <div key={marathon.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img
                      src={marathon.image}
                      alt={marathon.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {marathon.runningDistance}
                    </div>
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${registrationStatus.color}`}>
                      {registrationStatus.text}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {marathon.title}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">{marathon.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                          Registration: {formatDate(marathon.startRegistrationDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                          Marathon: {formatDate(marathon.marathonStartDate)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {marathon.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{marathon.totalRegistrationCount} registered</span>
                      </div>
                      <Link
                        to={`/marathon/${marathon.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center"
                      >
                        See Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}