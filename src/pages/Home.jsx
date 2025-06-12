import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Trophy, Target, Heart } from 'lucide-react';
import marathonsData from '../data/marathons.json';
import upcomingEventsData from '../data/upcomingEvents.json';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [marathons, setMarathons] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // Simulate API call - later replace with actual API
    setMarathons(marathonsData.slice(0, 6));
    setUpcomingEvents(upcomingEventsData);
  }, []);

  const bannerSlides = [
    {
      image: "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Join the Ultimate Marathon Experience",
      subtitle: "Connect with runners worldwide and discover amazing marathon events in your area"
    },
    {
      image: "https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Create and Manage Your Events",
      subtitle: "Organize professional marathon events with our comprehensive management tools"
    },
    {
      image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Track Your Running Journey",
      subtitle: "Monitor your progress, set goals, and achieve your personal best times"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Banner Carousel */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`
            }}
          >
            <div
              className="h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
                  <Link
                    to="/marathons"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
                  >
                    Explore Marathons
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Marathons */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Marathons</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover exciting marathon events happening around the world. Join thousands of runners in these amazing challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marathons.map((marathon) => (
              <div key={marathon.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={marathon.image}
                    alt={marathon.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {marathon.runningDistance}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{marathon.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{marathon.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {formatDate(marathon.startRegistrationDate)} - {formatDate(marathon.endRegistrationDate)}
                    </span>
                  </div>
                  <Link
                    to={`/marathon/${marathon.id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 inline-block text-center"
                  >
                    See Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Marathon Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't miss these exciting upcoming marathon events. Mark your calendars and start your training!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.distance}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Growing Community</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Be part of the world's largest marathon community with runners from every corner of the globe.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Active Runners</div>
            </div>
            <div className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">1,200+</div>
              <div className="text-blue-200">Events Organized</div>
            </div>
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-blue-200">Countries</div>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Marathon Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a seasoned runner or just starting out, Marathon Hub has everything you need to achieve your running goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Join Now
            </Link>
            <Link
              to="/marathons"
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}