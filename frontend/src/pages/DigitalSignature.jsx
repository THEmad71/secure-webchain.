import { Link } from "react-router-dom";

function DigitalSignature() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <Link to="/dashboard" className="text-cyan-400">← Back Dashboard</Link>
      <h1 className="text-3xl font-bold mt-6">Digital Signature</h1>
      <p className="text-slate-400 mt-3">Sign and verify message module coming soon.</p>
    </div>
  );
}

export default DigitalSignature;