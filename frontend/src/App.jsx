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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Unprotected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/intrusion-detection" element={<IntrusionDetection />} />
        <Route path="/hash" element={<HashGenerator />} />
        <Route path="/signature" element={<DigitalSignature />} />
        <Route path="/message" element={<SecureMessage />} />
        <Route path="/blockchain" element={<BlockchainLogs />} />
        <Route path="/tls" element={<TLSSimulator />} />
        <Route path="/ipsec" element={<IPSecSimulator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;