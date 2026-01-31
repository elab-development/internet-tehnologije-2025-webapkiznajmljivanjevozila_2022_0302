module.exports = {
  async up(db) {
    const users = await db.collection("users").find().toArray();

    for (const u of users) {
      const [firstName, lastName] = u.name?.split(" ") || ["", ""];
      await db.collection("users").updateOne(
        { _id: u._id },
        { $set: { firstName, lastName }, $unset: { name: "" } }
      );
    }
  },

  async down(db) {
    const users = await db.collection("users").find().toArray();

    for (const u of users) {
      await db.collection("users").updateOne(
        { _id: u._id },
        { $set: { name: `${u.firstName} ${u.lastName}` }, $unset: { firstName: "", lastName: "" } }
      );
    }
  }
};
