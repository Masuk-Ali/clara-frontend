export default function GuestAccessPrompt({ onClose, onSignUp }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Icon */}
        <div className="mb-4 text-center text-4xl">
          🔒
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Create your free Clara account
        </h2>

        {/* Message */}
        <p className="mb-6 text-center text-gray-600">
          You've reached the free guest limit for this activity.
          Sign up for free to continue learning with Clara.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onSignUp}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          >
            Sign Up Free
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-600 transition hover:bg-gray-50 active:scale-95"
          >
            Maybe Later
          </button>
        </div>

      </div>
      
    </div>
  );
}