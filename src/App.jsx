import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marathons from './pages/Marathons';
import MarathonDetails from './pages/MarathonDetails';
import AddMarathon from './pages/AddMarathon';
import MyMarathons from './pages/MyMarathons';
import MyApplications from './pages/MyApplications';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { useDocumentTitle } from './hooks/useDocumentTitle';

function AppContent() {
  useDocumentTitle();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marathons" element={
            <PrivateRoute>
              <Marathons />
            </PrivateRoute>
          } />
          <Route path="/marathon/:id" element={
            <PrivateRoute>
              <MarathonDetails />
            </PrivateRoute>
          } />
          <Route path="/add-marathon" element={
            <PrivateRoute>
              <AddMarathon />
            </PrivateRoute>
          } />
          <Route path="/my-marathons" element={
            <PrivateRoute>
              <MyMarathons />
            </PrivateRoute>
          } />
          <Route path="/my-applications" element={
            <PrivateRoute>
              <MyApplications />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <LoadingSpinner />
      </Router>
    </AuthProvider>
  );
}

export default App;