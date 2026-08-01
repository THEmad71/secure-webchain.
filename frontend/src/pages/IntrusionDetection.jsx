import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const featureLabels = {
  dur: "Duration (dur)",
  proto: "Protocol (proto)",
  service: "Network Service (service)",
  state: "Connection State (state)",

  spkts: "Source Packets (spkts)",
  dpkts: "Destination Packets (dpkts)",
  sbytes: "Source Bytes (sbytes)",
  dbytes: "Destination Bytes (dbytes)",

  rate: "Packet Rate (rate)",
  sttl: "Source Time To Live (sttl)",
  dttl: "Destination Time To Live (dttl)",

  sload: "Source Load / Bits per Second (sload)",
  dload: "Destination Load / Bits per Second (dload)",

  sloss: "Source Packet Loss (sloss)",
  dloss: "Destination Packet Loss (dloss)",

  sinpkt: "Source Inter-Packet Arrival Time (sinpkt)",
  dinpkt: "Destination Inter-Packet Arrival Time (dinpkt)",

  sjit: "Source Jitter (sjit)",
  djit: "Destination Jitter (djit)",

  swin: "Source TCP Window Size (swin)",
  dwin: "Destination TCP Window Size (dwin)",

  stcpb: "Source TCP Base Sequence Number (stcpb)",
  dtcpb: "Destination TCP Base Sequence Number (dtcpb)",

  tcprtt: "TCP Round Trip Time (tcprtt)",
  synack: "SYN-ACK Time (synack)",
  ackdat: "ACK Data Time (ackdat)",

  smean: "Mean Source Packet Size (smean)",
  dmean: "Mean Destination Packet Size (dmean)",

  trans_depth: "HTTP Transaction Depth (trans_depth)",
  response_body_len: "HTTP Response Body Length (response_body_len)",

  ct_srv_src: "Connection Count: Same Service and Source (ct_srv_src)",
  ct_state_ttl: "Connection Count: Same State and TTL (ct_state_ttl)",
  ct_dst_ltm:
    "Connection Count: Same Destination, Last Time Window (ct_dst_ltm)",
  ct_src_dport_ltm:
    "Connection Count: Same Source and Destination Port, Last Time Window (ct_src_dport_ltm)",
  ct_dst_sport_ltm:
    "Connection Count: Same Destination and Source Port, Last Time Window (ct_dst_sport_ltm)",
  ct_dst_src_ltm:
    "Connection Count: Same Destination and Source, Last Time Window (ct_dst_src_ltm)",

  is_ftp_login: "Is FTP Login Session (is_ftp_login)",
  ct_ftp_cmd: "FTP Command Count (ct_ftp_cmd)",
  ct_flw_http_mthd: "HTTP Method Count (ct_flw_http_mthd)",

  ct_src_ltm: "Connection Count: Same Source, Last Time Window (ct_src_ltm)",
  ct_srv_dst: "Connection Count: Same Service and Destination (ct_srv_dst)",

  is_sm_ips_ports:
    "Is Same Source and Destination IP/Port Pair (is_sm_ips_ports)",
};

const featureHints = {
  dur: "How long the network connection lasted.",
  proto: "Communication protocol such as TCP, UDP, or ICMP.",
  service: "Application service such as HTTP, DNS, FTP, SSH, or '-'.",
  state: "Connection status such as FIN, CON, INT, REQ, or RST.",

  spkts: "Number of packets sent by the source.",
  dpkts: "Number of packets sent by the destination.",
  sbytes: "Total bytes sent by the source.",
  dbytes: "Total bytes sent by the destination.",

  rate: "Overall packet transfer rate.",
  sttl: "Time To Live value from source side.",
  dttl: "Time To Live value from destination side.",

  sload: "Source-side traffic load in bits per second.",
  dload: "Destination-side traffic load in bits per second.",

  sloss: "Number of packets lost from source side.",
  dloss: "Number of packets lost from destination side.",

  sinpkt: "Average time between source packets.",
  dinpkt: "Average time between destination packets.",

  sjit: "Variation in packet timing from source side.",
  djit: "Variation in packet timing from destination side.",

  tcprtt: "Round-trip time for TCP communication.",
  synack: "Time between SYN and SYN-ACK.",
  ackdat: "Time between ACK and data transfer.",

  trans_depth: "Depth of HTTP transaction.",
  response_body_len: "Length of HTTP response body.",
};

const featureGroups = [
  {
    title: "Basic Connection",
    keys: ["dur", "proto", "service", "state"],
  },
  {
    title: "Packet & Byte Counts",
    keys: ["spkts", "dpkts", "sbytes", "dbytes", "rate"],
  },
  {
    title: "TTL, Load & Loss",
    keys: ["sttl", "dttl", "sload", "dload", "sloss", "dloss"],
  },
  {
    title: "Timing & TCP",
    keys: [
      "sinpkt",
      "dinpkt",
      "sjit",
      "djit",
      "swin",
      "dwin",
      "stcpb",
      "dtcpb",
      "tcprtt",
      "synack",
      "ackdat",
    ],
  },
  {
    title: "Packet Size & HTTP",
    keys: ["smean", "dmean", "trans_depth", "response_body_len"],
  },
  {
    title: "Connection Statistics",
    keys: [
      "ct_srv_src",
      "ct_state_ttl",
      "ct_dst_ltm",
      "ct_src_dport_ltm",
      "ct_dst_sport_ltm",
      "ct_dst_src_ltm",
      "ct_src_ltm",
      "ct_srv_dst",
    ],
  },
  {
    title: "FTP / Special Flags",
    keys: ["is_ftp_login", "ct_ftp_cmd", "ct_flw_http_mthd", "is_sm_ips_ports"],
  },
];

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
  const topFeatures = metadata?.top_features || [];

  const featureColumns = useMemo(() => {
    const fromMetadata = metadata?.feature_columns || [];
    const fromInput = Object.keys(inputData || {});
    const columns = fromMetadata.length ? fromMetadata : fromInput;

    return columns.filter((col) => col !== "label" && col !== "attack_cat" && col !== "id");
  }, [metadata, inputData]);

  const groupedFeatures = useMemo(() => {
    const used = new Set();

    const groups = featureGroups
      .map((group) => {
        const fields = group.keys.filter((key) => featureColumns.includes(key));
        fields.forEach((field) => used.add(field));

        return {
          ...group,
          fields,
        };
      })
      .filter((group) => group.fields.length > 0);

    const remaining = featureColumns.filter((feature) => !used.has(feature));

    if (remaining.length > 0) {
      groups.push({
        title: "Other Features",
        fields: remaining,
      });
    }

    return groups;
  }, [featureColumns]);

  const formatPercent = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return `${(Number(value) * 100).toFixed(2)}%`;
  };

  const formatSeconds = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return `${Number(value).toFixed(2)}s`;
  };

  const getInputType = (feature) => {
    if (["proto", "service", "state"].includes(feature)) return "text";
    return "number";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.10),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-300 backdrop-blur-xl transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
        >
          <span>←</span>
          <span>Back Dashboard</span>
        </Link>

        {/* Header */}
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-950/20">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            <span>🧠</span>
            Random Forest IDS
          </div>

          <div className="mt-5 grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-end">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                AI Intrusion
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Detection Console
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-slate-300 leading-relaxed">
                Analyze UNSW-NB15 network traffic features and classify each
                flow as <b>Normal</b> or <b>Attack</b> using a trained Random
                Forest model.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Model</p>
                <p className="mt-1 font-bold text-cyan-300">
                  {metadata?.model_name || "Random Forest IDS"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Dataset</p>
                <p className="mt-1 font-bold text-cyan-300">
                  {metadata?.dataset || "UNSW-NB15"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Accuracy</p>
                <p className="mt-1 font-bold text-emerald-300">
                  {formatPercent(metrics.accuracy)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">F1 Score</p>
                <p className="mt-1 font-bold text-emerald-300">
                  {formatPercent(metrics.f1_score)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <section className="mt-8 grid xl:grid-cols-[1.15fr_0.85fr] gap-6">
          {/* Input Panel */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black">
                  1. Traffic Feature Input
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Select a sample traffic record or edit feature values manually.
                </p>
              </div>

              <div className="min-w-[240px]">
                <label className="block mb-2 text-xs text-slate-400">
                  Load Sample Traffic
                </label>

                <select
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
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
            </div>

            <div className="max-h-[700px] overflow-y-auto pr-2 space-y-5">
              {groupedFeatures.map((group) => (
                <div
                  key={group.title}
                  className="rounded-3xl border border-white/10 bg-slate-950/35 p-5"
                >
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
                    {group.title}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {group.fields.map((feature) => (
                      <div key={feature}>
                        <label className="block mb-1 text-xs font-semibold text-slate-300">
                          {featureLabels[feature] || feature}
                        </label>

                        <input
                          type={getInputType(feature)}
                          step="any"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                          value={inputData?.[feature] ?? ""}
                          onChange={(e) => updateField(feature, e.target.value)}
                        />

                        {featureHints[feature] && (
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                            {featureHints[feature]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={predictTraffic}
              disabled={predictLoading || loadingMeta}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] hover:shadow-cyan-500/35 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-300"
            >
              {predictLoading ? "Analyzing Traffic..." : "Predict Traffic"}
            </button>
          </div>

          {/* Result Panel */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
              <h2 className="text-2xl font-black mb-4">2. Prediction Result</h2>

              {!prediction ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 text-center">
                  <div className="text-5xl mb-4">🔎</div>
                  <p className="text-slate-300 font-semibold">
                    No prediction yet
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Select a sample traffic record and click Predict Traffic.
                  </p>
                </div>
              ) : (
                <div
                  className={`rounded-3xl border p-6 ${
                    prediction.prediction === "Attack"
                      ? "border-red-500/50 bg-red-950/50"
                      : "border-emerald-500/50 bg-emerald-950/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">
                        Classification
                      </p>
                      <h3 className="mt-1 text-3xl font-black">
                        {prediction.prediction === "Attack"
                          ? "⚠️ Attack Detected"
                          : "✅ Normal Traffic"}
                      </h3>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${
                        prediction.prediction === "Attack"
                          ? "bg-red-500/20 text-red-200"
                          : "bg-emerald-500/20 text-emerald-200"
                      }`}
                    >
                      {prediction.risk_level} Risk
                    </span>
                  </div>

                  <div className="mt-6 grid sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <p className="text-xs text-slate-400">Confidence</p>
                      <p className="mt-1 text-xl font-black">
                        {formatPercent(prediction.confidence)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <p className="text-xs text-slate-400">
                        Normal Probability
                      </p>
                      <p className="mt-1 text-xl font-black text-emerald-300">
                        {formatPercent(prediction.normal_probability)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <p className="text-xs text-slate-400">
                        Attack Probability
                      </p>
                      <p className="mt-1 text-xl font-black text-red-300">
                        {formatPercent(prediction.attack_probability)}
                      </p>
                    </div>
                  </div>

                  {prediction.missing_features_count > 0 && (
                    <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-950/40 p-4 text-sm text-yellow-100">
                      Missing features: {prediction.missing_features_count}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Performance */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
              <h2 className="text-xl font-black mb-4">Model Performance</h2>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Precision" value={formatPercent(metrics.precision)} />
                <MetricCard label="Recall" value={formatPercent(metrics.recall)} />
                <MetricCard label="ROC-AUC" value={metrics.roc_auc?.toFixed?.(3) || "N/A"} />
                <MetricCard
                  label="Train Time"
                  value={formatSeconds(metrics.train_time_seconds)}
                />
              </div>
            </div>

            {/* Top Features */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
              <h2 className="text-xl font-black mb-4">
                Important Model Features
              </h2>

              {topFeatures.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No feature importance available.
                </p>
              ) : (
                <div className="space-y-4">
                  {topFeatures.slice(0, 10).map((item, index) => {
                    const featureName = item.feature_clean || item.feature;
                    const importance = Number(item.importance || 0);

                    return (
                      <div key={`${featureName}-${index}`}>
                        <div className="flex justify-between gap-4 text-sm mb-1">
                          <span className="text-slate-300">
                            {index + 1}. {featureLabels[featureName] || featureName}
                          </span>
                          <span className="text-cyan-300">
                            {(importance * 100).toFixed(2)}%
                          </span>
                        </div>

                        <div className="h-2 w-full rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                            style={{
                              width: `${Math.min(importance * 1000, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Concept */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
              <h2 className="text-xl font-black mb-3">Concept Covered</h2>

              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                <li>Network intrusion detection</li>
                <li>Anomaly-based classification</li>
                <li>Random Forest machine learning model</li>
                <li>Normal vs Attack traffic prediction</li>
                <li>Confidence and risk-level analysis</li>
                <li>Feature importance for interpretability</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-cyan-300">{value}</p>
    </div>
  );
}

export default IntrusionDetection;