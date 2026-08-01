import { useState } from "react";
import { Link } from "react-router-dom";

function TLSSimulator() {
  const [selectedVersion, setSelectedVersion] = useState("tls13");
  const [currentStep, setCurrentStep] = useState(0);

  const tls12Steps = [
    {
      title: "Client Hello",
      description:
        "Client sends supported TLS versions, cipher suites, random number, and session information to the server.",
      actor: "Client → Server",
    },
    {
      title: "Server Hello",
      description:
        "Server selects TLS 1.2, chooses a cipher suite, and sends its random number.",
      actor: "Server → Client",
    },
    {
      title: "Certificate",
      description:
        "Server sends its digital certificate so the client can verify the server identity.",
      actor: "Server → Client",
    },
    {
      title: "Key Exchange",
      description:
        "Client and server exchange key material to create a shared session key.",
      actor: "Client ↔ Server",
    },
    {
      title: "Finished Messages",
      description:
        "Both sides confirm that the handshake was successful and encrypted communication can start.",
      actor: "Client ↔ Server",
    },
    {
      title: "Encrypted Data",
      description:
        "Application data is now protected using the negotiated session key.",
      actor: "Client ↔ Server",
    },
  ];

  const tls13Steps = [
    {
      title: "Client Hello",
      description:
        "Client sends supported cipher suites and key share immediately in the first message.",
      actor: "Client → Server",
    },
    {
      title: "Server Hello",
      description:
        "Server selects TLS 1.3 parameters and sends its key share.",
      actor: "Server → Client",
    },
    {
      title: "Encrypted Extensions",
      description:
        "Server sends extra handshake information, mostly encrypted earlier than TLS 1.2.",
      actor: "Server → Client",
    },
    {
      title: "Certificate + Verify",
      description:
        "Server sends certificate and proves ownership of the private key.",
      actor: "Server → Client",
    },
    {
      title: "Finished",
      description:
        "Handshake completes faster with fewer round trips than TLS 1.2.",
      actor: "Client ↔ Server",
    },
    {
      title: "Encrypted Data",
      description:
        "Secure application data transfer starts quickly using modern encryption.",
      actor: "Client ↔ Server",
    },
  ];

  const steps = selectedVersion === "tls12" ? tls12Steps : tls13Steps;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetSimulation = () => {
    setCurrentStep(0);
  };

  const changeVersion = (version) => {
    setSelectedVersion(version);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/dashboard" className="text-cyan-400">
          ← Back Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">TLS Simulator</h1>

        <p className="text-slate-400 mb-6">
          Simulate and compare how TLS 1.2 and TLS 1.3 establish a secure
          connection between a client and a server.
        </p>

        {/* Version Selector */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select TLS Version</h2>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => changeVersion("tls12")}
              className={`px-5 py-2 rounded font-semibold ${
                selectedVersion === "tls12"
                  ? "bg-cyan-500"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              TLS 1.2
            </button>

            <button
              onClick={() => changeVersion("tls13")}
              className={`px-5 py-2 rounded font-semibold ${
                selectedVersion === "tls13"
                  ? "bg-cyan-500"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              TLS 1.3
            </button>
          </div>
        </div>

        {/* Simulator */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Client */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">💻</div>
            <h2 className="text-xl font-bold text-cyan-300">Client</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Browser or application requesting a secure connection.
            </p>
          </div>

          {/* Current Step */}
          <div className="bg-slate-900 border border-cyan-600 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-400 mb-2">
              Step {currentStep + 1} of {steps.length}
            </p>

            <h2 className="text-2xl font-bold mb-3">
              {steps[currentStep].title}
            </h2>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4">
              <p className="text-cyan-300 font-semibold">
                {steps[currentStep].actor}
              </p>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {steps[currentStep].description}
            </p>

            <div className="flex justify-center gap-3 mt-5">
              <button
                onClick={previousStep}
                disabled={currentStep === 0}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 px-4 py-2 rounded"
              >
                Previous
              </button>

              <button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 px-4 py-2 rounded"
              >
                Next
              </button>
            </div>

            <button
              onClick={resetSimulation}
              className="mt-3 text-sm text-slate-400 hover:text-white"
            >
              Reset Simulation
            </button>
          </div>

          {/* Server */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🖥️</div>
            <h2 className="text-xl font-bold text-emerald-300">Server</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Website server proving identity and creating secure session.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Handshake Progress</h2>

          <div className="w-full bg-slate-800 rounded-full h-3">
            <div
              className="bg-cyan-500 h-3 rounded-full transition-all"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>

          <div className="grid md:grid-cols-6 gap-2 mt-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`text-xs p-2 rounded border ${
                  index === currentStep
                    ? "bg-cyan-950 border-cyan-500 text-cyan-300"
                    : index < currentStep
                    ? "bg-emerald-950 border-emerald-600 text-emerald-300"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {index + 1}. {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* TLS Comparison */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-3">TLS 1.2</h2>

            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Older but widely used TLS version.</li>
              <li>Usually needs more handshake messages.</li>
              <li>Slower connection setup than TLS 1.3.</li>
              <li>Supports older cipher suites.</li>
              <li>Some handshake parts are less protected.</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-3">TLS 1.3</h2>

            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Newer and more secure TLS version.</li>
              <li>Fewer handshake round trips.</li>
              <li>Faster secure connection setup.</li>
              <li>Removes weak/old cryptographic algorithms.</li>
              <li>Encrypts more handshake information.</li>
            </ul>
          </div>
        </div>

        {/* Concept Covered */}
        <div className="mt-6 bg-slate-900 border border-slate-700 p-5 rounded-xl">
          <h2 className="font-semibold mb-2">Concept Covered</h2>

          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>TLS protects data between client and server.</li>
            <li>Handshake negotiates encryption parameters.</li>
            <li>Certificates verify server identity.</li>
            <li>Session keys are used for encrypted communication.</li>
            <li>TLS 1.3 improves speed and security over TLS 1.2.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TLSSimulator;