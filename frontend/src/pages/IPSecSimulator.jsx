import { useState } from "react";
import { Link } from "react-router-dom";

function IPSecSimulator() {
  const [mode, setMode] = useState("tunnel");
  const [protocol, setProtocol] = useState("esp");
  const [trafficType, setTrafficType] = useState("sensitive");
  const [currentStep, setCurrentStep] = useState(0);

  const getPolicyDecision = () => {
    if (trafficType === "blocked") {
      return {
        action: "BLOCK",
        color: "red",
        title: "Traffic Blocked",
        description:
          "The security policy blocks this traffic. The packet will not be sent.",
      };
    }

    if (trafficType === "normal") {
      return {
        action: "BYPASS",
        color: "yellow",
        title: "Traffic Bypassed",
        description:
          "The policy allows this traffic without IPSec protection.",
      };
    }

    return {
      action: "PROTECT",
      color: "emerald",
      title: "Traffic Protected",
      description:
        "The policy requires IPSec protection before sending this packet.",
    };
  };

  const policyDecision = getPolicyDecision();

  const steps = [
    {
      title: "Packet Created",
      actor: "Host",
      description:
        "A packet is created by the sender application and prepared for network transmission.",
    },
    {
      title: "Security Policy Check",
      actor: "IPSec Policy Engine",
      description:
        "IPSec checks the Security Policy Database to decide whether the packet should be protected, bypassed, or blocked.",
    },
    {
      title: "Security Association",
      actor: "IKE / SA Manager",
      description:
        "If protection is required, IPSec uses or creates a Security Association that defines keys, algorithms, and tunnel parameters.",
    },
    {
      title: protocol === "esp" ? "ESP Protection" : "AH Protection",
      actor: "IPSec Processor",
      description:
        protocol === "esp"
          ? "ESP protects the packet by providing encryption, integrity, and authentication."
          : "AH protects the packet by providing authentication and integrity, but it does not encrypt the payload.",
    },
    {
      title: mode === "tunnel" ? "Tunnel Mode Encapsulation" : "Transport Mode Processing",
      actor: "IPSec Mode Handler",
      description:
        mode === "tunnel"
          ? "Tunnel mode encapsulates the entire original IP packet inside a new IP packet. This is common in VPNs."
          : "Transport mode protects only the payload of the original IP packet. This is usually used for host-to-host communication.",
    },
    {
      title: "Secure Packet Sent",
      actor: "Network",
      description:
        "The protected packet is sent through the network. The receiver uses the matching IPSec settings to verify and process it.",
    },
  ];

  const visibleSteps =
    policyDecision.action === "PROTECT" ? steps : steps.slice(0, 2);

  const nextStep = () => {
    if (currentStep < visibleSteps.length - 1) {
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

  const updateTrafficType = (value) => {
    setTrafficType(value);
    setCurrentStep(0);
  };

  const updateMode = (value) => {
    setMode(value);
    setCurrentStep(0);
  };

  const updateProtocol = (value) => {
    setProtocol(value);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/dashboard" className="text-cyan-400">
          ← Back Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">IPSec Simulator</h1>

        <p className="text-slate-400 mb-6">
          Simulate how IPSec checks traffic policy and protects packets using
          ESP/AH in tunnel or transport mode.
        </p>

        {/* Configuration */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h2 className="font-semibold mb-3">Traffic Type</h2>

            <select
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              value={trafficType}
              onChange={(e) => updateTrafficType(e.target.value)}
            >
              <option value="sensitive">Sensitive Traffic</option>
              <option value="normal">Normal Traffic</option>
              <option value="blocked">Blocked Traffic</option>
            </select>

            <p className="text-sm text-slate-400 mt-3">
              Determines whether IPSec should protect, bypass, or block the
              packet.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h2 className="font-semibold mb-3">IPSec Protocol</h2>

            <select
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              value={protocol}
              onChange={(e) => updateProtocol(e.target.value)}
              disabled={policyDecision.action !== "PROTECT"}
            >
              <option value="esp">ESP</option>
              <option value="ah">AH</option>
            </select>

            <p className="text-sm text-slate-400 mt-3">
              ESP provides encryption and integrity. AH provides integrity and
              authentication only.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h2 className="font-semibold mb-3">IPSec Mode</h2>

            <select
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              value={mode}
              onChange={(e) => updateMode(e.target.value)}
              disabled={policyDecision.action !== "PROTECT"}
            >
              <option value="tunnel">Tunnel Mode</option>
              <option value="transport">Transport Mode</option>
            </select>

            <p className="text-sm text-slate-400 mt-3">
              Tunnel mode is common in VPNs. Transport mode is common for
              host-to-host protection.
            </p>
          </div>
        </div>

        {/* Policy Result */}
        <div
          className={`mb-6 p-5 rounded-xl border ${
            policyDecision.color === "emerald"
              ? "bg-emerald-950 border-emerald-600"
              : policyDecision.color === "yellow"
              ? "bg-yellow-950 border-yellow-600"
              : "bg-red-950 border-red-600"
          }`}
        >
          <h2 className="text-xl font-bold mb-2">
            Policy Decision: {policyDecision.action}
          </h2>

          <p className="text-slate-200">{policyDecision.description}</p>
        </div>

        {/* Simulator */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">💻</div>
            <h2 className="text-xl font-bold text-cyan-300">Sender</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Creates packet and sends traffic.
            </p>
          </div>

          <div className="bg-slate-900 border border-cyan-600 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-400 mb-2">
              Step {currentStep + 1} of {visibleSteps.length}
            </p>

            <h2 className="text-2xl font-bold mb-3">
              {visibleSteps[currentStep].title}
            </h2>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4">
              <p className="text-cyan-300 font-semibold">
                {visibleSteps[currentStep].actor}
              </p>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {visibleSteps[currentStep].description}
            </p>

            {currentStep === 1 && (
              <div className="mt-4 bg-slate-950 rounded-lg p-3 border border-slate-700">
                <p className="text-sm font-semibold">
                  Result: {policyDecision.title}
                </p>
              </div>
            )}

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
                disabled={currentStep === visibleSteps.length - 1}
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

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🖥️</div>
            <h2 className="text-xl font-bold text-emerald-300">Receiver</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Receives and verifies protected packet.
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Traffic Processing Progress</h2>

          <div className="w-full bg-slate-800 rounded-full h-3">
            <div
              className="bg-cyan-500 h-3 rounded-full transition-all"
              style={{
                width: `${((currentStep + 1) / visibleSteps.length) * 100}%`,
              }}
            />
          </div>

          <div className="grid md:grid-cols-6 gap-2 mt-4">
            {visibleSteps.map((step, index) => (
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

        {/* Comparison */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-3">ESP</h2>

            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Full form: Encapsulating Security Payload.</li>
              <li>Provides encryption.</li>
              <li>Provides integrity and authentication.</li>
              <li>Most commonly used IPSec protocol.</li>
              <li>Protects packet payload from being read.</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-3">AH</h2>

            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Full form: Authentication Header.</li>
              <li>Provides authentication and integrity.</li>
              <li>Does not encrypt the packet payload.</li>
              <li>Less common than ESP.</li>
              <li>Useful when confidentiality is not required.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-3">Tunnel Mode</h2>

            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Encapsulates the entire original IP packet.</li>
              <li>Adds a new outer IP header.</li>
              <li>Commonly used in VPN gateway-to-gateway communication.</li>
              <li>Hides original source and destination from outside network.</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-3">Transport Mode</h2>

            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Protects only the payload of the original IP packet.</li>
              <li>Original IP header remains visible.</li>
              <li>Commonly used for host-to-host communication.</li>
              <li>Has lower overhead than tunnel mode.</li>
            </ul>
          </div>
        </div>

        {/* Concept Covered */}
        <div className="mt-6 bg-slate-900 border border-slate-700 p-5 rounded-xl">
          <h2 className="font-semibold mb-2">Concept Covered</h2>

          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>IPSec protects IP packets at the network layer.</li>
            <li>Security policy decides protect, bypass, or block.</li>
            <li>Security Association stores keys and algorithms.</li>
            <li>ESP provides confidentiality, integrity, and authentication.</li>
            <li>AH provides integrity and authentication but no encryption.</li>
            <li>Tunnel mode is common in VPNs.</li>
            <li>Transport mode is common in host-to-host security.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default IPSecSimulator;