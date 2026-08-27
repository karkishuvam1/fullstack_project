import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import Compare from "./pages/Compare";
import About from "./pages/About";
import BookTestDrive from "./pages/BookTestDrive";
import Configurator from "./pages/Configurator";
import Dealers from "./pages/Dealers";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:slug" element={<CarDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={<About />} />
          <Route path="/book-test-drive" element={<BookTestDrive />} />
          <Route path="/book-test-drive/:slug" element={<BookTestDrive />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/configurator/:slug" element={<Configurator />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;