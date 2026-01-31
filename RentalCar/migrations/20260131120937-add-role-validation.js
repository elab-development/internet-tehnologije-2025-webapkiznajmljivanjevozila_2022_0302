module.exports = {
  async up(db) {
    await db.command({
      collMod: "users",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["role"],
          properties: {
            role: {
              enum: ["owner", "user", "guest"]
            }
          }
        }
      }
    });
  },

  async down(db) {
    await db.command({
      collMod: "users",
      validator: {}
    });
  }
};
