import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Intrusion Detection",
    desc: "Random Forest model classifies network traffic as normal or attack.",
    icon: "📡",
  },
  {
    title: "Blockchain Logs",
    desc: "Security activities are stored in a tamper-detectable hash-chain.",
    icon: "⛓️",
  },
  {
    title: "Cryptographic Tools",
    desc: "Hashing, digital signature, and secure message encryption modules.",
    icon: "🔐",
  },
  {
    title: "Protocol Simulators",
    desc: "Interactive TLS and IPSec simulations for network security learning.",
    icon: "🌐",
  },
];

const modules = [
  "AI Intrusion Detection",
  "Hash & Verify",
  "Digital Signature",
  "Secure Message",
  "TLS Simulator",
  "IPSec Simulator",
  "Blockchain Logs",
];

function Home() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100">
      {/* Soft Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-140px] top-[-140px] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-48 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Navbar */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl">
              🛡️
            </div>

            <div>
              <h2 className="font-black tracking-tight text-white">
                SecureWebChain
              </h2>
              <p className="text-xs text-slate-500">
                Network Security Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Login
            </Link>

            <Link
              to="/dashboard"
              className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-200 sm:inline-flex"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="grid min-h-[calc(100vh-120px)] items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              Web & Network Security Project
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              SecureWebChain
              <span className="block text-slate-400">
                Security Monitoring Suite
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              A complete cybersecurity demonstration platform that combines
              intrusion detection, cryptographic verification, secure
              communication, network protocol simulation, and blockchain-based
              activity logging.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-black text-slate-950 transition hover:bg-slate-200"
              >
                Login to Continue
              </Link>

              <Link
                to="/dashboard"
                className="rounded-full border border-slate-700 bg-slate-900/70 px-7 py-3.5 text-sm font-bold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Explore Dashboard
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {modules.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Project Summary Card */}
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="rounded-[24px] border border-slate-800 bg-slate-950/50 p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div>
                  <p className="text-sm text-slate-500">Project Type</p>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    Cybersecurity Platform
                  </h3>
                </div>

                <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                  Active
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <InfoRow
                  label="Core Engine"
                  value="Random Forest Intrusion Detection"
                />
                <InfoRow
                  label="Dataset"
                  value="UNSW-NB15 Network Traffic"
                />
                <InfoRow
                  label="Security Layer"
                  value="Hashing, Signature, Encryption"
                />
                <InfoRow
                  label="Evidence Layer"
                  value="Tamper-Detectable Blockchain Logs"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-sm font-semibold text-slate-300">
                  Main Workflow
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span>Traffic Input</span>
                  <span className="text-slate-600">→</span>
                  <span>IDS Prediction</span>
                  <span className="text-slate-600">→</span>
                  <span>Risk Analysis</span>
                  <span className="text-slate-600">→</span>
                  <span>Blockchain Log</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="pb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-white">
              What this project demonstrates
            </h2>
            <p className="mt-2 text-slate-500">
              The platform connects machine learning, cryptography, and network
              security concepts in one practical interface.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:border-slate-600 hover:bg-slate-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
                  {item.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section */}
        <section className="mb-8 rounded-[28px] border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Research Base</p>
              <h3 className="mt-2 font-bold text-slate-100">
                Anomaly-Based Network Intrusion Detection
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">Main Model</p>
              <h3 className="mt-2 font-bold text-slate-100">
                Random Forest trained on UNSW-NB15
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">Goal</p>
              <h3 className="mt-2 font-bold text-slate-100">
                Detect, protect, verify, and preserve security evidence
              </h3>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="max-w-[220px] text-right text-sm font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

export default Home;