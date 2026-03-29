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
    <motion.nav
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="
      fixed top-0 left-0 w-full z-50
      backdrop-blur-xl
      bg-[#0f1115]/70
      hover:bg-[#14161c] hover:backdrop-blur-0
      border-b border-white/5
      shadow-[0_6px_18px_rgba(0,0,0,0.25)]
      px-6 md:px-16 lg:px-24 xl:px-32 py-4
      flex items-center justify-between
      transition-all duration-300
      "
    >
      {/* LOGO */}
      <Link to="/" onClick={closeMenu}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-9"
        />
      </Link>

      {/* MENU */}
      <div
        className={`
        max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
        max-sm:left-0
        flex flex-col sm:flex-row
        items-start sm:items-center
        gap-6 sm:gap-8
        max-sm:p-8
        transition-all duration-300
        bg-[#0f1115]
        sm:bg-transparent
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}
        `}
      >
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={closeMenu}
            className="
            text-white
            relative
            hover:text-[#c6a96b]
            transition
            after:absolute
            after:left-0
            after:-bottom-1
            after:w-0
            after:h-[2px]
            after:bg-[#c6a96b]
            hover:after:w-full
            after:transition-all
            "
          >
            {link.name}
          </Link>
        ))}

        <Link
          to="/countries"
          onClick={closeMenu}
          className="text-white hover:text-[#c6a96b] transition"
        >
          Countries
        </Link>

        {/* CURRENCY */}
        <div className="text-white">
          <CurrencyPicker />
        </div>

        {/* ACTIONS */}
        <div className="flex max-sm:flex-col items-start sm:items-center gap-4">
          {/* LIST CARS BUTTON */}
          <button
            onClick={changeRole}
            className="
            text-white
            border border-[#c6a96b]
            px-5 py-2
            rounded-full
            bg-transparent
            hover:scale-105
            hover:shadow-[0_0_15px_rgba(198,169,107,0.45)]
            transition
            "
          >
            {isOwner ? "Dashboard" : "List cars"}
          </button>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleAuth}
            className="
            bg-[#c6a96b]
            text-white
            px-7 py-2
            rounded-full
            hover:bg-[#d8b46b]
            hover:scale-105
            hover:shadow-[0_0_18px_rgba(198,169,107,0.55)]
            transition
            "
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="sm:hidden cursor-pointer outline-none focus:outline-none"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.nav>
  );
};

export default Navbar;
