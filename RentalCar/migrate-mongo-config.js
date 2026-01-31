import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "server", ".env") });

export default {
  mongodb: {
    url: process.env.MONGODB_URL,
    databaseName: "car-rental"
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog"
};
