
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function BlockchainLogs() {
  const [activity, setActivity] = useState("");
  const [data, setData] = useState("");
  const [logs, setLogs] = useState([]);
  const [chainStatus, setChainStatus] = useState(null);

  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [validateLoading, setValidateLoading] = useState(false);

  const loadLogs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/blockchain/logs");
      setLogs(res.data.chain || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load blockchain logs. Make sure Flask backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const addLog = async () => {
    if (!activity.trim()) {
      alert("Please enter activity name");
      return;
    }

    if (!data.trim()) {
      alert("Please enter log data");
      return;
    }

    try {
      setAddLoading(true);
      setChainStatus(null);

      await API.post("/blockchain/add-log", {
        activity,
        data,
      });

      setActivity("");
      setData("");
      await loadLogs();
    } catch (error) {
      console.error(error);
      alert("Failed to add log. Make sure Flask backend is running.");
    } finally {
      setAddLoading(false);
    }
  };

  const validateChain = async () => {
    try {
      setValidateLoading(true);

      const res = await API.get("/blockchain/validate");

      setChainStatus({
        valid: res.data.valid,
        message: res.data.message,
      });
    } catch (error) {
      console.error(error);
      alert("Validation failed. Make sure Flask backend is running.");
    } finally {
      setValidateLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/dashboard" className="text-cyan-400">
          ← Back Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">Blockchain Logs</h1>

        <p className="text-slate-400 mb-6">
          Store security activities in a simple hash-chain where each block is
          linked with the previous block hash.
        </p>

        {/* Add Log */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Add Activity Log</h2>

          <label className="block mb-2 text-sm text-slate-300">
            Activity Name
          </label>

          <input
            className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
            placeholder="Example: Hash Generated"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />

          <label className="block mt-4 mb-2 text-sm text-slate-300">
            Log Data
          </label>

          <textarea
            className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
            rows="4"
            placeholder="Example: User generated SHA-256 hash for message: I am amad"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <button
            onClick={addLog}
            disabled={addLoading}
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
          >
            {addLoading ? "Adding Log..." : "Add Log to Chain"}
          </button>
        </div>

        {/* Validate */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mb-6">
          <h2 className="text-xl font-semibold mb-4">2. Validate Chain</h2>

          <p className="text-slate-400 mb-4">
            Validation checks whether every block hash is correct and whether
            each block is properly linked to the previous block.
          </p>

          <button
            onClick={validateChain}
            disabled={validateLoading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
          >
            {validateLoading ? "Validating..." : "Validate Blockchain"}
          </button>

          {chainStatus && (
            <div
              className={`mt-4 p-4 rounded-xl border ${
                chainStatus.valid
                  ? "bg-emerald-950 border-emerald-600"
                  : "bg-red-950 border-red-600"
              }`}
            >
              <h3 className="font-bold">
                {chainStatus.valid ? "✅ Chain Valid" : "❌ Chain Invalid"}
              </h3>

              <p className="text-sm text-slate-300 mt-1">
                {chainStatus.message}
              </p>
            </div>
          )}
        </div>

        {/* Logs */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">3. Blockchain Log History</h2>

            <button
              onClick={loadLogs}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 px-4 py-2 rounded text-sm"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {logs.length === 0 ? (
            <p className="text-slate-400">No logs found.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((block) => (
                <div
                  key={block.index}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4"
                >
                  <div className="flex justify-between gap-4 mb-2">
                    <h3 className="font-bold text-cyan-300">
                      Block #{block.index} — {block.activity}
                    </h3>

                    <span className="text-xs text-slate-400">
                      {block.timestamp}
                    </span>
                  </div>

                  <p className="text-slate-300 mb-3">{block.data}</p>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400">Previous Hash:</span>
                      <p className="break-all bg-slate-950 p-2 rounded mt-1">
                        {block.previous_hash}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400">Current Hash:</span>
                      <p className="break-all bg-slate-950 p-2 rounded mt-1 text-emerald-300">
                        {block.hash}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-slate-900 border border-slate-700 p-5 rounded-xl">
          <h2 className="font-semibold mb-2">Concept Covered</h2>

          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Each block stores activity data and timestamp.</li>
            <li>Each block has its own SHA-256 hash.</li>
            <li>Each new block stores the previous block hash.</li>
            <li>If any block changes, the chain becomes invalid.</li>
            <li>This demonstrates tamper-detectable logging.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BlockchainLogs;