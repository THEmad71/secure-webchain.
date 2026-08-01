import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function DigitalSignature() {
  const [message, setMessage] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [signature, setSignature] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const [keyLoading, setKeyLoading] = useState(false);
  const [signLoading, setSignLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const generateKeys = async () => {
    try {
      setKeyLoading(true);
      setVerifyResult(null);

      const res = await API.get("/signature/generate-keys");

      setPrivateKey(res.data.private_key);
      setPublicKey(res.data.public_key);
    } catch (error) {
      console.error(error);
      alert("Key generation failed. Make sure Flask backend is running.");
    } finally {
      setKeyLoading(false);
    }
  };

  const signMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message to sign");
      return;
    }

    if (!privateKey.trim()) {
      alert("Please generate keys first");
      return;
    }

    try {
      setSignLoading(true);
      setVerifyResult(null);

      const res = await API.post("/signature/sign", {
        message,
        private_key: privateKey,
      });

      setSignature(res.data.signature);
      setVerifyMessage(message);
    } catch (error) {
      console.error(error);
      alert("Signing failed. Check backend connection and private key.");
    } finally {
      setSignLoading(false);
    }
  };

  const verifySignature = async () => {
    if (!verifyMessage.trim()) {
      alert("Please enter message to verify");
      return;
    }

    if (!signature.trim()) {
      alert("Please generate or paste a signature");
      return;
    }

    if (!publicKey.trim()) {
      alert("Please generate or paste public key");
      return;
    }

    try {
      setVerifyLoading(true);

      const res = await API.post("/signature/verify", {
        message: verifyMessage,
        signature,
        public_key: publicKey,
      });

      setVerifyResult({
        valid: res.data.valid,
        message: res.data.message,
      });
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        setVerifyResult({
          valid: false,
          message: error.response.data.message || "Signature is invalid.",
        });
      } else {
        alert("Verification failed. Make sure Flask backend is running.");
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  const copyText = async (value, label) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      alert(`${label} copied!`);
    } catch (error) {
      console.error(error);
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/dashboard" className="text-cyan-400">
          ← Back Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">Digital Signature</h1>

        <p className="text-slate-400 mb-6">
          Generate RSA keys, sign a message with a private key, and verify it
          with a public key.
        </p>

        {/* Step 1: Generate Keys */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Generate Key Pair</h2>

          <p className="text-slate-400 mb-4">
            A private key is used to sign the message. A public key is used to
            verify the signature.
          </p>

          <button
            onClick={generateKeys}
            disabled={keyLoading}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
          >
            {keyLoading ? "Generating Keys..." : "Generate RSA Keys"}
          </button>

          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-slate-300">Private Key</label>

                <button
                  onClick={() => copyText(privateKey, "Private key")}
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
                >
                  Copy
                </button>
              </div>

              <textarea
                className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400 text-xs"
                rows="8"
                placeholder="Private key will appear here..."
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-slate-300">Public Key</label>

                <button
                  onClick={() => copyText(publicKey, "Public key")}
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
                >
                  Copy
                </button>
              </div>

              <textarea
                className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400 text-xs"
                rows="8"
                placeholder="Public key will appear here..."
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Step 2: Sign Message */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">2. Sign Message</h2>

            <label className="block mb-2 text-sm text-slate-300">
              Message
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              rows="5"
              placeholder="Example: I am amad"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={signMessage}
              disabled={signLoading}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
            >
              {signLoading ? "Signing..." : "Sign Message"}
            </button>

            {signature && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Digital Signature:</h3>

                  <button
                    onClick={() => copyText(signature, "Signature")}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
                  >
                    Copy
                  </button>
                </div>

                <p className="break-all bg-slate-800 p-3 rounded border border-slate-700 text-emerald-300 text-sm">
                  {signature}
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Verify Signature */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">3. Verify Signature</h2>

            <label className="block mb-2 text-sm text-slate-300">
              Message to Verify
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              rows="5"
              placeholder="Enter same or modified message..."
              value={verifyMessage}
              onChange={(e) => {
                setVerifyMessage(e.target.value);
                setVerifyResult(null);
              }}
            />

            <label className="block mt-4 mb-2 text-sm text-slate-300">
              Signature
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400 text-xs"
              rows="4"
              placeholder="Signature will appear here..."
              value={signature}
              onChange={(e) => {
                setSignature(e.target.value);
                setVerifyResult(null);
              }}
            />

            <button
              onClick={verifySignature}
              disabled={verifyLoading}
              className="mt-4 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
            >
              {verifyLoading ? "Verifying..." : "Verify Signature"}
            </button>

            {verifyResult && (
              <div
                className={`mt-6 p-4 rounded-xl border ${
                  verifyResult.valid
                    ? "bg-emerald-950 border-emerald-600"
                    : "bg-red-950 border-red-600"
                }`}
              >
                <h3 className="text-lg font-bold mb-2">
                  {verifyResult.valid
                    ? "✅ Signature Valid"
                    : "❌ Signature Invalid"}
                </h3>

                <p className="text-sm text-slate-300">
                  {verifyResult.message}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-slate-900 border border-slate-700 p-5 rounded-xl">
          <h2 className="font-semibold mb-2">Concept Covered</h2>

          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Private key is used for signing.</li>
            <li>Public key is used for verification.</li>
            <li>If the message changes, the signature becomes invalid.</li>
            <li>Digital signature provides authenticity and integrity.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DigitalSignature;