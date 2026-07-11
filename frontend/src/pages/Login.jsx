import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (!form.email || !form.password) {
      setErrorMessage("Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        error.response?.data?.error ||
        error.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-slate-900 p-6 rounded-xl border border-slate-700"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {errorMessage && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-300 p-3 rounded">
            {errorMessage}
          </div>
        )}

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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-slate-400 mt-4">
          No account?{" "}
          <Link to="/register" className="text-cyan-400">
            Register
          </Link>
        </p>

        <Link to="/" className="block text-slate-400 mt-3">
          ← Back Home
        </Link>
      </form>
    </div>
  );
}

export default Login;