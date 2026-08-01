import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function IntrusionDetection() {
  const [metadata, setMetadata] = useState(null);
  const [samples, setSamples] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [inputData, setInputData] = useState({});
  const [prediction, setPrediction] = useState(null);

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [predictLoading, setPredictLoading] = useState(false);

  const loadMetadata = async () => {
    try {
      setLoadingMeta(true);
      const res = await API.get("/ids/metadata");
      setMetadata(res.data);

      if (res.data.example_input) {
        setInputData(res.data.example_input);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load IDS metadata. Make sure Flask backend is running.");
    } finally {
      setLoadingMeta(false);
    }
  };

  const loadSamples = async () => {
    try {
      setLoadingSamples(true);
      const res = await API.get("/ids/sample");
      setSamples(res.data.samples || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load sample traffic data.");
    } finally {
      setLoadingSamples(false);
    }
  };

  const selectSample = (index) => {
    setSelectedIndex(index);

    if (index === "") return;

    const sample = samples[Number(index)];
    setInputData(sample);
    setPrediction(null);
  };

  const updateField = (key, value) => {
    setInputData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPrediction(null);
  };

  const predictTraffic = async () => {
    try {
      setPredictLoading(true);

      const res = await API.post("/ids/predict", inputData);
      setPrediction(res.data);
    } catch (error) {
      console.error(error);
      alert("Prediction failed. Check backend and input data.");
    } finally {
      setPredictLoading(false);
    }
  };

  useEffect(() => {
    loadMetadata();
    loadSamples();
  }, []);

  const metrics = metadata?.metrics || {};
  const featureColumns = metadata?.feature_columns || Object.keys(inputData || {});
  const topFeatures = metadata?.top_features || [];

  const formatPercent = (value) => {
    if (value === null || value === undefined) return "N/A";
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/dashboard" className="text-cyan-400">
          ← Back Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-2">
          AI Intrusion Detection
        </h1>

        <p className="text-slate-400 mb-6">
          Random Forest based anomaly detection system trained on UNSW-NB15
          network traffic data.
        </p>

        {/* Model Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <p className="text-slate-400 text-sm">Model</p>
            <h2 className="text-xl font-bold text-cyan-300">
              {metadata?.model_name || "Random Forest IDS"}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <p className="text-slate-400 text-sm">Dataset</p>
            <h2 className="text-xl font-bold text-cyan-300">
              {metadata?.dataset || "UNSW-NB15"}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <p className="text-slate-400 text-sm">Accuracy</p>
            <h2 className="text-xl font-bold text-emerald-300">
              {formatPercent(metrics.accuracy)}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <p className="text-slate-400 text-sm">F1 Score</p>
            <h2 className="text-xl font-bold text-emerald-300">
              {formatPercent(metrics.f1_score)}
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              1. Select / Edit Traffic Sample
            </h2>

            <div className="mb-4">
              <label className="block mb-2 text-sm text-slate-300">
                Load Sample Traffic
              </label>

              <select
                className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
                value={selectedIndex}
                onChange={(e) => selectSample(e.target.value)}
              >
                <option value="">
                  {loadingSamples ? "Loading samples..." : "Use example input"}
                </option>

                {samples.map((_, index) => (
                  <option key={index} value={index}>
                    Sample #{index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="max-h-[520px] overflow-y-auto pr-2 space-y-3">
              {featureColumns.map((feature) => (
                <div key={feature}>
                  <label className="block mb-1 text-xs text-slate-400">
                    {feature}
                  </label>

                  <input
                    className="w-full p-2 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400 text-sm"
                    value={inputData?.[feature] ?? ""}
                    onChange={(e) => updateField(feature, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={predictTraffic}
              disabled={predictLoading || loadingMeta}
              className="mt-5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
            >
              {predictLoading ? "Predicting..." : "Predict Traffic"}
            </button>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                2. Prediction Result
              </h2>

              {!prediction ? (
                <p className="text-slate-400">
                  Select a traffic sample and click Predict Traffic.
                </p>
              ) : (
                <div
                  className={`p-5 rounded-xl border ${
                    prediction.prediction === "Attack"
                      ? "bg-red-950 border-red-600"
                      : "bg-emerald-950 border-emerald-600"
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">
                    {prediction.prediction === "Attack"
                      ? "⚠️ Attack Detected"
                      : "✅ Normal Traffic"}
                  </h3>

                  <p className="text-slate-300 mb-4">
                    Risk Level:{" "}
                    <span className="font-bold">{prediction.risk_level}</span>
                  </p>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3 rounded">
                      <p className="text-xs text-slate-400">Confidence</p>
                      <p className="font-bold">
                        {formatPercent(prediction.confidence)}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded">
                      <p className="text-xs text-slate-400">Normal Probability</p>
                      <p className="font-bold text-emerald-300">
                        {formatPercent(prediction.normal_probability)}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded">
                      <p className="text-xs text-slate-400">Attack Probability</p>
                      <p className="font-bold text-red-300">
                        {formatPercent(prediction.attack_probability)}
                      </p>
                    </div>
                  </div>

                  {prediction.missing_features_count > 0 && (
                    <div className="mt-4 bg-yellow-950 border border-yellow-700 p-3 rounded">
                      <p className="text-sm">
                        Missing features: {prediction.missing_features_count}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Top Features */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Important Model Features
              </h2>

              {topFeatures.length === 0 ? (
                <p className="text-slate-400">No feature importance available.</p>
              ) : (
                <div className="space-y-3">
                  {topFeatures.slice(0, 10).map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">
                          {index + 1}. {item.feature_clean}
                        </span>
                        <span className="text-cyan-300">
                          {(item.importance * 100).toFixed(2)}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(item.importance * 1000, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Concept */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3">Concept Covered</h2>

              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Network intrusion detection</li>
                <li>Anomaly-based classification</li>
                <li>Random Forest machine learning model</li>
                <li>Normal vs Attack traffic prediction</li>
                <li>Confidence and risk-level analysis</li>
                <li>Feature importance for interpretability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntrusionDetection;