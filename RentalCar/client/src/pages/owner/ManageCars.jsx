import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/useAppContext.js";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, axios, currency, user } = useAppContext();

  const [cars, setCars] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCar = (carId) => {
    setCarToDelete(carId);
    setShowDeleteModal(true);
  };

  const confirmDeleteCar = async () => {
    try {
      const { data } = await axios.post("/api/owner/delete-car", {
        carId: carToDelete,
      });

      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
      setCarToDelete(null);
    }
  };

  useEffect(() => {
    if (!isOwner) return;

    const run = async () => {
      await fetchOwnerCars();
    };

    run();
  }, [isOwner]);

  return (
    <div className="px-4 pt-6 md:px-10 flex-1 bg-white text-black">
      {/* TOP BAR */}
      <div className="-mx-4 md:-mx-10 px-4 md:px-10 w-auto flex justify-end items-center mb-6 pt-1 pb-5 border-b border-primary">
        <p className="text-sm text-black">
          Welcome,{" "}
          <span className="text-primary font-semibold">
            {user?.name || "Owner"}
          </span>
        </p>
      </div>

      <div className="pt-0 pb-6 [&_h1]:text-primary [&_*]:text-gray-800 [&_p]:text-gray-600">
        <Title
          title="Manage Cars"
          subTitle="View all listed cars, update their details, or remove them from the booking platform."
          className="text-primary"
        />
      </div>

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white">
        <table className="w-full border-collapse text-left text-sm text-gray-700">
          <thead className="text-primary font-semibold">
            <tr>
              <th className="p-3">Car</th>
              <th className="p-3 max-md:hidden">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3 max-md:hidden">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium text-black">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} • {car.transmission}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden text-gray-700">
                  {car.category}
                </td>

                <td className="p-3 text-black">
                  {currency}
                  {car.pricePerDay}/day
                </td>

                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      car.isAvailable
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="flex items-center p-3 gap-2">
                  <img
                    onClick={() => toggleAvailability(car._id)}
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt=""
                    className="cursor-pointer opacity-80 hover:opacity-100"
                  />
                  <img
                    onClick={() => deleteCar(car._id)}
                    src={assets.delete_icon}
                    alt=""
                    className="cursor-pointer opacity-80 hover:opacity-100"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
              <h2 className="text-lg font-semibold text-black">Delete car</h2>

              <p className="text-sm text-gray-600 mt-2">
                Are you sure you want to delete this car?
                <br />
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCarToDelete(null);
                  }}
                  className="px-4 py-2 text-sm rounded-md border border-borderColor text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteCar}
                  className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCars;
