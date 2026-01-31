import { z } from "zod";

// YYYY-MM-DD (za Vite input type="date")
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createBookingSchema = z
  .object({
    carId: z.string().min(1, "carId is required"),
    pickupLocation: z.string().min(2, "pickupLocation is required").max(100),
    pickupDate: z.string().regex(dateRegex, "pickupDate must be YYYY-MM-DD"),
    returnDate: z.string().regex(dateRegex, "returnDate must be YYYY-MM-DD"),
  })
  .refine(
    (data) => {
      // poređenje radi jer je format YYYY-MM-DD
      return data.returnDate >= data.pickupDate;
    },
    {
      message: "returnDate must be after or equal to pickupDate",
      path: ["returnDate"],
    }
  );

// status enum prilagodi tvom projektu
export const changeStatusSchema = z.object({
  bookingId: z.string().min(1, "bookingId is required"),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
});
