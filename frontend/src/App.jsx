import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import HashGenerator from "./pages/HashGenerator";
import DigitalSignature from "./pages/DigitalSignature";
import SecureMessage from "./pages/SecureMessage";
import IPSecSimulator from "./pages/IPSecSimulator";
import TLSSimulator from "./pages/TLSSimulator";
import BlockchainLogs from "./pages/BlockchainLogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IntrusionDetection from "./pages/IntrusionDetection";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intrusion-detection"
          element={
            <ProtectedRoute>
              <IntrusionDetection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hash"
          element={
            <ProtectedRoute>
              <HashGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/signature"
          element={
            <ProtectedRoute>
              <DigitalSignature />
            </ProtectedRoute>
          }
        />

        <Route
          path="/message"
          element={
            <ProtectedRoute>
              <SecureMessage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blockchain"
          element={
            <ProtectedRoute>
              <BlockchainLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tls"
          element={
            <ProtectedRoute>
              <TLSSimulator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ipsec"
          element={
            <ProtectedRoute>
              <IPSecSimulator />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;