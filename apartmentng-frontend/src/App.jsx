import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import ApartmentDetailsPage from './pages/ApartmentDetailsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AgentLogin from './pages/AgentLogin';
import AgentRegister from './pages/AgentRegister';
import AgentDashboard from './pages/AgentDashboard';
import AgentProfileView from './components/admin/AgentProfileView';
import StickyBrowseButton from './components/common/StickyBrowseButton';
import AgentProfile from './pages/AgentProfile';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/apartments/:id" element={<ApartmentDetailsPage />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/agents/:id" 
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-1 container-custom py-12">
                  <AgentProfileView />
                </main>
                <Footer />
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* Agent routes */}
        <Route path="/agent/login" element={<AgentLogin />} />
        <Route path="/agent/register" element={<AgentRegister />} />
        <Route 
          path="/agent/dashboard" 
          element={
            <ProtectedRoute requiredRole="agent">
              <AgentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
            path="/agent/profile" 
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentProfile />
              </ProtectedRoute>
            } 
          />
      </Routes>

      {/* Sticky Browse Button - shows on all pages */}
      <StickyBrowseButton />
    </>
  );
}

export default App;

