import { useNavigate } from "react-router-dom";
import { useSetGuestMode } from "../../../store/appStore";

export default function GuestButton() {
  const navigate = useNavigate();
  const setGuestMode = useSetGuestMode();

const handleGuestMode = () => {
  setGuestMode(true);
  navigate("/");
};

  return (
    <div className="mx-6 mt-6">
      <button
        onClick={handleGuestMode}
        className="w-full rounded-2xl border-2 border-blue-600 py-4 text-lg font-semibold text-blue-600 transition active:scale-95"
      >
        🚀 Try Clara
      </button>
    </div>
  );
}