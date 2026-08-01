import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function SecureMessage() {
  const [message, setMessage] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [messageHash, setMessageHash] = useState("");

  const [decryptInput, setDecryptInput] = useState("");
  const [decryptKey, setDecryptKey] = useState("");
  const [decryptHash, setDecryptHash] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [integrityValid, setIntegrityValid] = useState(null);

  const [encryptLoading, setEncryptLoading] = useState(false);
  const [decryptLoading, setDecryptLoading] = useState(false);

  const encryptMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message to encrypt");
      return;
    }

    try {
      setEncryptLoading(true);
      setDecryptedMessage("");
      setIntegrityValid(null);

      const res = await API.post("/message/encrypt", {
        message,
      });

      setEncryptedMessage(res.data.encrypted_message);
      setSecretKey(res.data.secret_key);
      setMessageHash(res.data.message_hash);

      // Auto-fill decrypt section
      setDecryptInput(res.data.encrypted_message);
      setDecryptKey(res.data.secret_key);
      setDecryptHash(res.data.message_hash);
    } catch (error) {
      console.error(error);
      alert("Encryption failed. Make sure Flask backend is running.");
    } finally {
      setEncryptLoading(false);
    }
  };

  const decryptMessage = async () => {
    if (!decryptInput.trim()) {
      alert("Please enter encrypted message");
      return;
    }

    if (!decryptKey.trim()) {
      alert("Please enter secret key");
      return;
    }

    try {
      setDecryptLoading(true);

      const res = await API.post("/message/decrypt", {
        encrypted_message: decryptInput,
        secret_key: decryptKey,
        message_hash: decryptHash,
      });

      setDecryptedMessage(res.data.decrypted_message);
      setIntegrityValid(res.data.integrity_valid);
    } catch (error) {
      console.error(error);
      setDecryptedMessage("");
      setIntegrityValid(false);
      alert("Decryption failed. Invalid encrypted message or secret key.");
    } finally {
      setDecryptLoading(false);
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

        <h1 className="text-3xl font-bold mt-6 mb-2">Secure Message</h1>

        <p className="text-slate-400 mb-6">
          Encrypt a message, generate a secret key, and decrypt it back with
          integrity verification.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Encrypt Section */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">1. Encrypt Message</h2>

            <label className="block mb-2 text-sm text-slate-300">
              Plain Message
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
              rows="5"
              placeholder="Example: I am amad"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={encryptMessage}
              disabled={encryptLoading}
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
            >
              {encryptLoading ? "Encrypting..." : "Encrypt Message"}
            </button>

            {encryptedMessage && (
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Encrypted Message:</h3>

                    <button
                      onClick={() =>
                        copyText(encryptedMessage, "Encrypted message")
                      }
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
                    >
                      Copy
                    </button>
                  </div>

                  <p className="break-all bg-slate-800 p-3 rounded border border-slate-700 text-cyan-300 text-sm">
                    {encryptedMessage}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Secret Key:</h3>

                    <button
                      onClick={() => copyText(secretKey, "Secret key")}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
                    >
                      Copy
                    </button>
                  </div>

                  <p className="break-all bg-slate-800 p-3 rounded border border-slate-700 text-yellow-300 text-sm">
                    {secretKey}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Message Hash:</h3>

                    <button
                      onClick={() => copyText(messageHash, "Message hash")}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
                    >
                      Copy
                    </button>
                  </div>

                  <p className="break-all bg-slate-800 p-3 rounded border border-slate-700 text-emerald-300 text-sm">
                    {messageHash}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Decrypt Section */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">2. Decrypt Message</h2>

            <label className="block mb-2 text-sm text-slate-300">
              Encrypted Message
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400 text-sm"
              rows="5"
              placeholder="Paste encrypted message here..."
              value={decryptInput}
              onChange={(e) => {
                setDecryptInput(e.target.value);
                setDecryptedMessage("");
                setIntegrityValid(null);
              }}
            />

            <label className="block mt-4 mb-2 text-sm text-slate-300">
              Secret Key
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400 text-sm"
              rows="3"
              placeholder="Paste secret key here..."
              value={decryptKey}
              onChange={(e) => {
                setDecryptKey(e.target.value);
                setDecryptedMessage("");
                setIntegrityValid(null);
              }}
            />

            <label className="block mt-4 mb-2 text-sm text-slate-300">
              Original Message Hash
            </label>

            <textarea
              className="w-full p-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400 text-sm"
              rows="3"
              placeholder="Paste original message hash here..."
              value={decryptHash}
              onChange={(e) => {
                setDecryptHash(e.target.value);
                setDecryptedMessage("");
                setIntegrityValid(null);
              }}
            />

            <button
              onClick={decryptMessage}
              disabled={decryptLoading}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 px-5 py-2 rounded font-semibold"
            >
              {decryptLoading ? "Decrypting..." : "Decrypt Message"}
            </button>

            {decryptedMessage && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Decrypted Message:</h3>

                <p className="break-all bg-slate-800 p-3 rounded border border-slate-700 text-emerald-300">
                  {decryptedMessage}
                </p>
              </div>
            )}

            {integrityValid !== null && (
              <div
                className={`mt-4 p-4 rounded-xl border ${
                  integrityValid
                    ? "bg-emerald-950 border-emerald-600"
                    : "bg-red-950 border-red-600"
                }`}
              >
                <h3 className="font-bold">
                  {integrityValid
                    ? "✅ Integrity Verified — Message Unchanged"
                    : "❌ Integrity Failed — Message Modified or Invalid"}
                </h3>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-slate-900 border border-slate-700 p-5 rounded-xl">
          <h2 className="font-semibold mb-2">Concept Covered</h2>

          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Encryption hides the original message.</li>
            <li>Secret key is required to decrypt the message.</li>
            <li>Hash is used to verify message integrity.</li>
            <li>Wrong key or modified encrypted data will fail decryption.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SecureMessage;