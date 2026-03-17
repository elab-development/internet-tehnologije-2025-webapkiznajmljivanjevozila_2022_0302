import React, { useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/useAppContext.js";
import toast from "react-hot-toast";

const AddCar = () => {
  const { axios, currency, user } = useAppContext();

  const [image, setImage] = useState(null);

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return null;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pt-6 md:px-10 flex-1 bg-white text-black">
      <div className="-mx-4 md:-mx-10 px-2 md:px-10 w-auto flex justify-end items-center mb-6 pt-1 pb-5 border-b border-primary">
        <p className="text-sm text-black">
          Welcome,{" "}
          <span className="text-primary font-semibold">
            {user?.name || "Owner"}
          </span>
        </p>
      </div>

      {/* TITLE (NE DIRAMO) */}
      <div className="pt-0 pb-6 [&_h1]:text-primary [&_*]:text-gray-800 [&_p]:text-gray-600">
        <Title
          title="Add New Car"
          subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
        />
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-700 text-sm mt-6 max-w-xl"
      >
        {/* IMAGE */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt=""
              className="h-14 rounded cursor-pointer"
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="text-sm text-gray-500">Upload a picture of your car</p>
        </div>

        {/* BRAND + MODEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label className="text-gray-700 font-medium">Brand</label>
            <input
              type="text"
              placeholder="e.g. BMW, Mercedes, Audi..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black placeholder:text-gray-400 bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-gray-700 font-medium">Model</label>
            <input
              type="text"
              placeholder="e.g. X5, E-Class, M4..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black placeholder:text-gray-400 bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* YEAR / PRICE / CATEGORY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label className="text-gray-700 font-medium">Year</label>
            <input
              type="number"
              placeholder="2026"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black placeholder:text-gray-400 bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-gray-700 font-medium">
              Daily Price ({currency})
            </label>
            <input
              type="number"
              placeholder="100"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black placeholder:text-gray-400 bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-gray-700 font-medium">Category</label>
            <select
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              value={car.category}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
            >
              <option value="">Select a category</option>
              <option value="Coupe">Coupe</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Sedan">Sedan</option>
              <option value="Convertible">Convertible</option>
              <option value="Van">Van</option>
              <option value="Grand Tourer">Grand Tourer</option>
            </select>
          </div>
        </div>

        {/* TRANSMISSION / FUEL / SEATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label className="text-gray-700 font-medium">Transmission</label>
            <select
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
            >
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-gray-700 font-medium">Fuel Type</label>
            <select
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
            >
              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-gray-700 font-medium">
              Seating Capacity
            </label>
            <input
              type="number"
              placeholder="4"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black placeholder:text-gray-400 bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({ ...car, seating_capacity: e.target.value })
              }
            />
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex flex-col w-full">
          <label className="text-gray-700 font-medium">Location</label>
          <select
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            value={car.location}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
          >
            <option value="">Select a location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Houston">Houston</option>
            <option value="Chicago">Chicago</option>
            <option value="Miami">Miami</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Las Vegas">Las Vegas</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col w-full">
          <label className="text-gray-700 font-medium">Description</label>
          <textarea
            rows={5}
            placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine."
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black placeholder:text-gray-400 bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          ></textarea>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer">
          <img src={assets.tick_icon} alt="" />
          {isLoading ? "Listing..." : "List Your Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
