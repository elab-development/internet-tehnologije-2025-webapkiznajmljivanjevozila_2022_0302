import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { useLocation, NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Sidebar = () => {

  const {user, axios, fetchUser} = useAppContext()
  const location = useLocation();
  const [image, setImage] = useState(null);
//com
  const updateImage = async () => {
  try {
    if (!image) return toast.error("Select an image first");

    const formData = new FormData();
    formData.append("image", image);

    const { data } = await axios.post("/api/owner/update-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (data.success) {
      fetchUser();
      toast.success(data.message);
      setImage(null);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};


  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="relative group w-28 h-28 rounded-full overflow-hidden">
          <label htmlFor="image" className="block w-full h-full cursor-pointer">
            <img
              className="w-full h-full object-cover rounded-full"
              src={
                image
                  ? URL.createObjectURL(image)
                  : user?.image ||
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"
              }
              alt=""
            />

            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div className="absolute inset-0 hidden bg-black/20 rounded-full group-hover:flex items-center justify-center">
              <img src={assets.edit_icon} alt="" className="w-5 h-5" />
            </div>
          </label>
        </div>

        {image && (
          <button
            onClick={updateImage}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition cursor-pointer"
          >
            Save <img src={assets.check_icon} width={13} alt="" />
          </button>
        )}
      </div>

      {/* NAME */}
      <p className="mt-2 text-base max-md:hidden">
        {user?.name || "Owner"}
      </p>

      {/* MENU */}
      <div className="w-full">
        {(ownerMenuLinks || []).map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? "bg-primary/10 text-primary"
                : "text-gray-600"
            }`}
          >
            <img
              src={
                link.path === location.pathname ? link.coloredIcon : link.icon
              }
              alt="car icon"
            />
            <span className="max-md:hidden">{link.name}</span>

            <div
              className={`${
                link.path === location.pathname ? "bg-primary" : ""
              } w-1.5 h-8 rounded-l right-0 absolute`}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
