import { z } from "zod";

// YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createBookingSchema = z
  .object({
    car: z.string().min(1, "car is required"),
    pickupDate: z.string().regex(dateRegex, "pickupDate must be YYYY-MM-DD"),
    returnDate: z.string().regex(dateRegex, "returnDate must be YYYY-MM-DD"),
  })
  .refine((data) => data.returnDate >= data.pickupDate, {
    message: "returnDate must be after or equal to pickupDate",
    path: ["returnDate"],
  });

export const changeStatusSchema = z.object({
  bookingId: z.string().min(1, "bookingId is required"),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
});
