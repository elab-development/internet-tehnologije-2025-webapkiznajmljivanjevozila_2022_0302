module.exports = {
  async up(db) {
    await db.collection("users").updateMany(
      { phone: { $exists: false } },
      { $set: { phone: null } }
    );
  },

  async down(db) {
    await db.collection("users").updateMany(
      {},
      { $unset: { phone: "" } }
    );
  }
};
