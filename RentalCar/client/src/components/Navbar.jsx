import { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext.js";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import CurrencyPicker from "./CurrencyPicker";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } =
    useAppContext();

  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const changeRole = async () => {
    closeMenu();

    if (!user) {
      setShowLogin(true);
      return;
    }

    if (isOwner) {
      navigate("/owner");
      return;
    }

    try {
      const { data } = await axios.post("/api/owner/change-role");

      if (data.success) {
        setIsOwner(true);
        toast.success(data.message || "You are now an owner");
        navigate("/owner");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        setShowLogin(true);
        return;
      }

      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleAuth = () => {
    closeMenu();

    if (user) {
      logout();
    } else {
      setShowLogin(true);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4
      text-gray-600 border-b border-borderColor relative transition-all
      ${location.pathname === "/" ? "bg-light" : "bg-white"}`}
    >
      <Link to="/" onClick={closeMenu}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-8"
        />
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
        max-sm:border-t border-borderColor right-0
        flex flex-col sm:flex-row items-start sm:items-center
        gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50
        ${location.pathname === "/" ? "bg-light" : "bg-white"}
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {/* MENU LINKS */}
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} onClick={closeMenu}>
            {link.name}
          </Link>
        ))}

        {/* COUNTRIES PAGE */}
        <Link to="/countries" onClick={closeMenu}>
          Countries
        </Link>

        <CurrencyPicker />

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          <button onClick={changeRole} className="cursor-pointer">
            {isOwner ? "Dashboard" : "List cars"}
          </button>

          <button
            onClick={handleAuth}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* HAMBURGER */}
      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.div>
  );
};

export default Navbar;