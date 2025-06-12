import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <div className="text-2xl md:text-3xl font-semibold text-gray-900 mt-4">
            Page Not Found
          </div>
          <p className="text-gray-600 mt-4 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <Link
            to="/marathons"
            className="inline-flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors duration-200"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Marathons
          </Link>
        </div>

        <div className="mt-12 text-gray-500">
          <p className="text-sm">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-500">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}