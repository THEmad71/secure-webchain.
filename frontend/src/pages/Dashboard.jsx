import { Link } from "react-router-dom";

const modules = [
  {
    title: "Hash Generator",
    path: "/hash",
    desc: "SHA-256 and SHA-3 hashing demo",
  },
  {
    title: "Digital Signature",
    path: "/signature",
    desc: "Sign and verify messages",
  },
  {
    title: "Secure Message",
    path: "/message",
    desc: "PGP/S-MIME inspired communication",
  },
  {
    title: "IPSec Simulator",
    path: "/ipsec",
    desc: "Transport mode, tunnel mode, AH and ESP",
  },
  {
    title: "TLS Simulator",
    path: "/tls",
    desc: "TLS 1.2 vs TLS 1.3 comparison",
  },
  {
    title: "Blockchain Logs",
    path: "/blockchain",
    desc: "Tamper-resistant hash-chain log",
  },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-cyan-400">
          ← Back Home
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">
          SecureWebChain Dashboard
        </h1>

        <p className="text-slate-400 mb-8">
          Select a security module to demonstrate.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="bg-slate-900 border border-slate-700 p-6 rounded-xl hover:border-cyan-400 transition"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-slate-400 mt-2">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;