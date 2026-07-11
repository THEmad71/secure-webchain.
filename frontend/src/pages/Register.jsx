import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!form.name || !form.email || !form.password) {
      setErrorMessage("Name, email and password required");
      return;
    }

    try {
      setLoading(true);

      console.log("Register data:", form);

      const res = await API.post("/auth/register", form);

      console.log("Register response:", res.data);

      setSuccessMessage("Registration successful. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);

      setErrorMessage(
        error.response?.data?.error ||
        error.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-slate-900 p-6 rounded-xl border border-slate-700"
      >
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {errorMessage && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-300 p-3 rounded">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-500/10 border border-green-500 text-green-300 p-3 rounded">
            {successMessage}
          </div>
        )}

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
          placeholder="Name"
          type="text"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
          placeholder="Email"
          type="email"
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-slate-800 border border-slate-600 outline-none focus:border-cyan-400"
          placeholder="Password"
          type="password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 py-3 rounded font-semibold"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-slate-400 mt-4">
          Already have account?{" "}
          <Link to="/login" className="text-cyan-400">
            Login
          </Link>
        </p>

        <Link to="/" className="block text-slate-400 mt-3">
          ← Back Home
        </Link>
      </form>
    </div>
  );
}

export default Register;