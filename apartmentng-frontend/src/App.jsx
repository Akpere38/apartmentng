import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ApartmentDetailsPage from './pages/ApartmentDetailsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AgentLogin from './pages/AgentLogin';
import AgentRegister from './pages/AgentRegister';
import AgentDashboard from './pages/AgentDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import StickyBrowseButton from './components/common/StickyBrowseButton';
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
    </Routes>

     {/* Sticky Browse Button - shows on all pages */}
      <StickyBrowseButton />

      </>
  );
}

export default App;