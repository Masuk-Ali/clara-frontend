import { Link } from "react-router-dom";

export default function AuthLinks() {
  return (
    <div className="mt-8 mb-8 text-center">
      <p className="text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Log in
        </Link>
      </p>

      <p className="mt-3 text-gray-600">
        New here?{" "}
        <Link
          to="/signup"
          className="font-semibold text-blue-600 hover:underline"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}