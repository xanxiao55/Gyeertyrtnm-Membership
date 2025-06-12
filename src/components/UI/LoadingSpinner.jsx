import { useAuth } from '../../contexts/AuthContext';

export default function LoadingSpinner() {
  const { loading } = useAuth();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}