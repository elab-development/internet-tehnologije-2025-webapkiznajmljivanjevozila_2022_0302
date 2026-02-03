import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CarTeh API",
      version: "1.0.0",
      description:
        "API specifikacija za web aplikaciju za iznajmljivanje vozila (CarTeh).",
    },
    servers: [
      {
        url:
          process.env.BASE_URL ||
          `http://localhost:${process.env.PORT || 3000}`,
        description: "Local/Default server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
          },
        },

        // --- AUTH / USER ---
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Mina" },
            email: { type: "string", example: "mina@mail.com" },
            password: { type: "string", example: "StrongPass123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "mina@mail.com" },
            password: { type: "string", example: "StrongPass123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            token: { type: "string", example: "jwt-token-here" },
            message: { type: "string" },
          },
        },

        // --- CAR ---
        Car: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65f1a..." },
            brand: { type: "string", example: "BMW" },
            model: { type: "string", example: "X5" },
            pricePerDay: { type: "number", example: 120 },
            seats: { type: "number", example: 5 },
            fuelType: { type: "string", example: "diesel" },
            transmission: { type: "string", example: "automatic" },
            countryOfOrigin: { type: "string", example: "Germany" },
            available: { type: "boolean", example: true },
            image: { type: "string", example: "https://..." },
          },
        },

        // --- BOOKING ---
        AvailabilityRequest: {
          type: "object",
          required: ["carId", "pickupDate", "returnDate", "pickupLocation"],
          properties: {
            carId: { type: "string", example: "65f1a..." },
            pickupDate: { type: "string", example: "2026-02-01" },
            returnDate: { type: "string", example: "2026-02-07" },
            pickupLocation: { type: "string", example: "New York" },
          },
        },
        CreateBookingRequest: {
          type: "object",
          required: ["carId", "pickupDate", "returnDate", "pickupLocation"],
          properties: {
            carId: { type: "string", example: "65f1a..." },
            pickupDate: { type: "string", example: "2026-02-01" },
            returnDate: { type: "string", example: "2026-02-07" },
            pickupLocation: { type: "string", example: "New York" },
            currency: { type: "string", example: "USD" },
          },
        },
        ChangeBookingStatusRequest: {
          type: "object",
          required: ["bookingId", "status"],
          properties: {
            bookingId: { type: "string", example: "65f1b..." },
            status: {
              type: "string",
              example: "CONFIRMED",
              description: "PENDING | CONFIRMED | CANCELED | COMPLETED",
            },
          },
        },

        // --- DOCUMENT ---
        DocumentUploadResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Document uploaded" },
          },
        },

        // --- PAYMENT ---
        CreatePaymentRequest: {
          type: "object",
          required: ["bookingId", "amount", "currency", "method"],
          properties: {
            bookingId: { type: "string", example: "65f1b..." },
            amount: { type: "number", example: 240 },
            currency: { type: "string", example: "USD" },
            method: { type: "string", example: "CARD" },
          },
        },
      },
    },
  },

  apis: [path.join(__dirname, "..", "routes", "*.js")],
});
