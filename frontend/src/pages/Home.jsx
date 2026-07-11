import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <p className="text-cyan-400 font-semibold mb-3">
          Web Security Project
        </p>

        <h1 className="text-5xl font-bold mb-6">
          SecureWebChain
        </h1>

        <p className="text-lg text-slate-300 mb-8">
          A Web Security Demonstration Platform using Hashing, Digital Signature,
          IPSec, TLS, PGP, S/MIME and Blockchain.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/dashboard"
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/login"
            className="border border-slate-600 hover:border-cyan-400 px-6 py-3 rounded-lg font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;