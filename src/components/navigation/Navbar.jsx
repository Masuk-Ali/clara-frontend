import { supabase } from "../supabase";

export default function Navbar() {
  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div className="flex justify-between items-center p-4 shadow">
      <h1 className="text-xl font-bold">Clara Dashboard</h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}