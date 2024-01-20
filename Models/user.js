const cassandra = require("cassandra-driver");

const User = cassandra.mapping.Model.extend({
  tableName: "User",
  columns: {
    user_id: "uuid",
    username: "text",
    email: "text",
    password: "text",
    photo: "text",
  },
  key: ["user_id"],
});

module.exports = User;
