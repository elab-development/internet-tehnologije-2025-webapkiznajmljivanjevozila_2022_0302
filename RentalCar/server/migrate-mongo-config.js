module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: "car_rental",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
};
