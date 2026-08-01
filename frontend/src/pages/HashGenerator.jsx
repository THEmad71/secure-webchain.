import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function HashGenerator() {
  const [text, setText] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [hash, setHash] = useState("");

  const [verifyText, setVerifyText] = useState("");
  const [expectedHash, setExpectedHash] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const generateHash = async () => {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }

    try {
      setLoading(true);
      setVerifyResult(null);

      const res = await API.post("/hash/generate", {
        text,
        algorithm,
      });

      setHash(res.data.hash);

      // Auto-fill verify section
      setVerifyText(text);
      setExpectedHash(res.data.hash);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed. Make sure Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

  const verifyHash = async () => {
    if (!verifyText.trim()) {
      alert("Please enter text to verify");
      return;
    }

    if (!expectedHash.trim()) {
      alert("Please enter expected hash");
      return;
    }

    try {
      setVerifyLoading(true);

      const res = await API.post("/hash/generate", {
        text: verifyText,
        algorithm,
      });

      const newHash = res.data.hash;
      const matched =
        newHash.toLowerCase() === expectedHash.trim().toLowerCase();

      setVerifyResult({
        matched,
        newHash,
      });
    } catch (error) {
      console.error(error);
      alert("Backend connection failed. Make sure Flask server is running.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const copyHash = async () => {
    if (!hash) return;

    try {
      await navigator.clipboard.writeText(hash);
      alert("Hash copied!");
    } catch (error) {
      console.error(error);
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="text-cyan-400">
          ← Back Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">Hash & Verify</h1>

        <p className="text-slate-400 mb-6">
          Generate a digital fingerprint of a message and verify whether the
          message was changed or not.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Generate Hash Section */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">1. Generate Hash</h2>

            <label className="block mb-2 text-sm text-slate-300">
              Original Message
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              rows="5"
              placeholder="Example: I am amad"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <label className="block mt-4 mb-2 text-sm text-slate-300">
              Hash Algorithm
            </label>

            <select
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value);
                setVerifyResult(null);
              }}
            >
              <option value="sha256">SHA-256</option>
              <option value="sha3_256">SHA3-256</option>
              <option value="sha512">SHA-512</option>
              <option value="md5">MD5</option>
            </select>

            <button
              onClick={generateHash}
              disabled={loading}
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
            >
              {loading ? "Generating..." : "Generate Hash"}
            </button>

            {hash && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Hash Output:</h3>

                  <button
                    onClick={copyHash}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
                  >
                    Copy
                  </button>
                </div>

                <p className="break-all bg-slate-800 p-3 rounded border border-slate-700 text-cyan-300">
                  {hash}
                </p>
              </div>
            )}
          </div>

          {/* Verify Hash Section */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">2. Verify Hash</h2>

            <label className="block mb-2 text-sm text-slate-300">
              Text to Verify
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              rows="5"
              placeholder="Enter same or modified message..."
              value={verifyText}
              onChange={(e) => {
                setVerifyText(e.target.value);
                setVerifyResult(null);
              }}
            />

            <label className="block mt-4 mb-2 text-sm text-slate-300">
              Expected / Previous Hash
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              rows="3"
              placeholder="Paste previous hash here..."
              value={expectedHash}
              onChange={(e) => {
                setExpectedHash(e.target.value);
                setVerifyResult(null);
              }}
            />

            <button
              onClick={verifyHash}
              disabled={verifyLoading}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
            >
              {verifyLoading ? "Verifying..." : "Verify Hash"}
            </button>

            {verifyResult && (
              <div
                className={`mt-6 p-4 rounded-xl border ${
                  verifyResult.matched
                    ? "bg-emerald-950 border-emerald-600"
                    : "bg-red-950 border-red-600"
                }`}
              >
                <h3 className="text-lg font-bold mb-2">
                  {verifyResult.matched
                    ? "✅ Hash Matched — Data Unchanged"
                    : "❌ Hash Not Matched — Data Modified"}
                </h3>

                <p className="text-sm text-slate-300 mb-2">
                  Newly generated hash:
                </p>

                <p className="break-all bg-slate-950 p-3 rounded text-sm">
                  {verifyResult.newHash}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-slate-900 border border-slate-700 p-5 rounded-xl">
          <h2 className="font-semibold mb-2">Concept Covered</h2>

          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Hashing creates a one-way digital fingerprint.</li>
            <li>Hash cannot be decrypted back to the original text.</li>
            <li>Same input creates the same hash.</li>
            <li>Even one character change creates a different hash.</li>
            <li>Hash verification is used for data integrity checking.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HashGenerator;