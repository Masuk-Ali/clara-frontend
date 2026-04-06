import { useState } from "react";
import { supabase } from "../../services/supabase";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const login = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) alert(error.message);
};

const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) alert(error.message);
};

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-4">Clara Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-64"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-64"
      />

      <button
        onClick={login}
        className="bg-blue-500 text-white px-4 py-2 w-64"
      >
        Login
      </button>
      <button
  onClick={loginWithGoogle}
  className="bg-red-500 text-white px-4 py-2 w-64 mt-2"
>
  Continue with Google
</button>

      <p className="mt-3">
        No account? <Link to="/signup" className="text-blue-500">Sign up</Link>
      </p>
    </div>
  );
}