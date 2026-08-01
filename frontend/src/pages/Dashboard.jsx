import { Link } from "react-router-dom";

const modules = [
  {
    title: "Intrusion Detection",
    path: "/intrusion-detection",
    desc: "Classify network traffic as normal or attack using Random Forest.",
    category: "Detection",
    icon: "📡",
    featured: true,
  },
  {
    title: "Blockchain Logs",
    path: "/blockchain",
    desc: "Store security activities in a tamper-detectable hash-chain.",
    category: "Logging",
    icon: "⛓️",
  },
  {
    title: "Hash & Verify",
    path: "/hash",
    desc: "Generate hashes and verify whether data was modified.",
    category: "Integrity",
    icon: "🔐",
  },
  {
    title: "Digital Signature",
    path: "/signature",
    desc: "Sign messages and verify authenticity with public/private keys.",
    category: "Authenticity",
    icon: "✍️",
  },
  {
    title: "Secure Message",
    path: "/message",
    desc: "Encrypt, decrypt, and verify secure messages.",
    category: "Encryption",
    icon: "✉️",
  },
  {
    title: "TLS Simulator",
    path: "/tls",
    desc: "Understand TLS 1.2 and TLS 1.3 handshakes step by step.",
    category: "Protocol",
    icon: "🌐",
  },
  {
    title: "IPSec Simulator",
    path: "/ipsec",
    desc: "Explore ESP, AH, tunnel mode, and transport mode concepts.",
    category: "Network",
    icon: "🛡️",
  },
];

const metrics = [
  {
    label: "Model",
    value: "Random Forest",
  },
  {
    label: "Dataset",
    value: "UNSW-NB15",
  },
  {
    label: "Accuracy",
    value: "94.98%",
  },
  {
    label: "Modules",
    value: "7",
  },
];

function Dashboard() {
  const featuredModule = modules.find((item) => item.featured);
  const regularModules = modules.filter((item) => !item.featured);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100">
      {/* Soft Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-[-160px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Header Nav */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            ← Back Home
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Backend Ready
          </div>
        </div>

        {/* Hero */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-5 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              SecureWebChain Platform
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">
              Network Security
              <span className="block text-slate-400">
                Monitoring Dashboard
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
              A modern cybersecurity project combining intrusion detection,
              cryptographic verification, secure messaging, protocol simulation,
              and tamper-detectable activity logging.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/intrusion-detection"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
              >
                Start Detection
              </Link>

              <Link
                to="/blockchain"
                className="rounded-full border border-slate-700 bg-slate-950/40 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                View Activity Logs
              </Link>
            </div>
          </div>

          {/* Featured */}
          {featuredModule && (
            <Link
              to={featuredModule.path}
              className="group rounded-[28px] border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-7 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-blue-500/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
                  {featuredModule.icon}
                </div>

                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                  {featuredModule.category}
                </span>
              </div>

              <h2 className="mt-8 text-3xl font-black text-white">
                {featuredModule.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                {featuredModule.desc}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs text-slate-500">Prediction</p>
                  <p className="mt-1 font-bold text-slate-100">
                    Normal / Attack
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs text-slate-500">Output</p>
                  <p className="mt-1 font-bold text-slate-100">
                    Risk + Confidence
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5 text-sm">
                <span className="text-slate-500">Open module</span>
                <span className="text-blue-300 transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          )}
        </section>

        {/* Metrics */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-black text-white">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* Modules */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-white">
                Security Modules
              </h2>
              <p className="mt-2 text-slate-500">
                Choose a module to test or demonstrate.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {regularModules.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
                    {item.icon}
                  </div>

                  <span className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-xs text-slate-400">
                    {item.category}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 min-h-[52px] text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="text-sm text-slate-500">Open console</span>
                  <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-300">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer Summary */}
        <section className="mt-10 rounded-[28px] border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Workflow</p>
              <h3 className="mt-2 font-bold text-slate-100">
                Traffic Analysis → Prediction → Security Log
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">Research Base</p>
              <h3 className="mt-2 font-bold text-slate-100">
                Anomaly-Based Intrusion Detection
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">Project Goal</p>
              <h3 className="mt-2 font-bold text-slate-100">
                Detect, protect, verify, and preserve evidence
              </h3>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;