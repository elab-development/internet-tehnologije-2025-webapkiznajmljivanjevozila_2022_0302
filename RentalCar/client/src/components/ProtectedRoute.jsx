import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext.js";
import Loader from "./Loader.jsx";

/**
 * ProtectedRoute — štiti rute od neovlašćenog pristupa.
 *
 * Props:
 *   - requireAuth: true  → korisnik mora biti ulogovan
 *   - requireOwner: true → korisnik mora imati role "owner"
 *   - fallback: kuda da preusmeri (default "/")
 */
const ProtectedRoute = ({
  children,
  requireAuth = false,
  requireOwner = false,
  fallback = "/",
}) => {
  const { token, user, isOwner } = useAppContext();

  // Token postoji ali user još nije učitan → čekamo
  if (token && !user) {
    return <Loader />;
  }

  // Zahteva login a nema tokena
  if (requireAuth && !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0f14] text-white gap-4">
        <p className="text-2xl font-semibold text-[#c6a96b]">
          401 — Not Authorized
        </p>
        <p className="text-gray-400">
          You must be logged in to access this page.
        </p>
        <a
          href="/"
          className="mt-4 px-6 py-2 border border-[#c6a96b] text-[#c6a96b] rounded-lg hover:bg-[#c6a96b]/10 transition"
        >
          Go Home
        </a>
      </div>
    );
  }

  // Zahteva owner rolu
  if (requireOwner && !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0f14] text-white gap-4">
        <p className="text-2xl font-semibold text-[#c6a96b]">403 — Forbidden</p>
        <p className="text-gray-400">
          You don't have permission to access this page.
        </p>
        <a
          href="/"
          className="mt-4 px-6 py-2 border border-[#c6a96b] text-[#c6a96b] rounded-lg hover:bg-[#c6a96b]/10 transition"
        >
          Go Home
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
