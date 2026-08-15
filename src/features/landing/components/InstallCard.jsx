import usePWAInstall from "../../../hooks/usePWAInstall";

export default function InstallCard() {
  const { isInstallable, install } = usePWAInstall();
          console.log("Installable:", isInstallable);

        if (!isInstallable) return null;

  return (
    <div className="mx-6 mt-6 rounded-2xl bg-blue-600 p-5 text-white shadow-lg">
      <h2 className="text-xl font-semibold">
        📲 Install Clara
      </h2>

      <p className="mt-2 text-sm text-blue-100">
        Install Clara for a faster, app-like learning experience.
      </p>

      <button
        onClick={install}
        className="mt-4 w-full rounded-xl bg-white py-3 font-semibold text-blue-600 active:scale-95 transition"
      >
        Install Clara
      </button>
    </div>
  );
}