import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function HashGenerator() {
  const [text, setText] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);

  const generateHash = async () => {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/hash/generate", {
        text,
        algorithm,
      });

      setHash(res.data.hash);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed. Make sure Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="text-cyan-400">
          ← Back Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">Hash Generator</h1>

        <p className="text-slate-400 mb-6">
          Generate SHA-256 or SHA3-256 hash for message integrity verification.
        </p>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
          <label className="block mb-2 text-sm text-slate-300">
            Input Message
          </label>

          <textarea
            className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
            rows="5"
            placeholder="Enter message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <label className="block mt-4 mb-2 text-sm text-slate-300">
            Hash Algorithm
          </label>

          <select
            className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="sha256">SHA-256</option>
            <option value="sha3_256">SHA3-256</option>
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
              <h2 className="font-semibold mb-2">Hash Output:</h2>
              <p className="break-all bg-slate-800 p-3 rounded border border-slate-700">
                {hash}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-slate-900 border border-slate-700 p-5 rounded-xl">
          <h2 className="font-semibold mb-2">Concept Covered</h2>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Hashing</li>
            <li>Application of Hashing</li>
            <li>SHA-3</li>
            <li>Data Integrity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HashGenerator;