
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
