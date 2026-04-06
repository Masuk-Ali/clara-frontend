import { useState } from "react";
import { supabase } from "../supabase";

export default function Signup() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    class: "",
    institution: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) return alert(error.message);

    // Save extra data
    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        ...form,
      },
    ]);

    alert("Account created!");
  };

  return (
    <div className="flex flex-col items-center p-4 gap-2">
      <h1 className="text-2xl">Sign Up</h1>

      <input name="first_name" placeholder="First Name" onChange={handleChange} />
      <input name="last_name" placeholder="Last Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="class" placeholder="Class" onChange={handleChange} />
      <input name="institution" placeholder="Institution" onChange={handleChange} />

      <button onClick={signup} className="bg-blue-500 text-white px-4 py-2">
        Create Account
      </button>
    </div>
  );
}