const cassandra = require("cassandra-driver");

const Favorite = cassandra.mapping.Model.extend({
  tableName: "Favorite",
  columns: {
    user_id: "uuid",
    recipe_id: "uuid",
  },
  key: ["user_id", "recipe_id"],
});

module.exports = Favorite;
