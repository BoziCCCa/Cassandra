const cassandra = require("cassandra-driver");

const Recipe = cassandra.mapping.Model.extend({
  tableName: "Recipe",
  columns: {
    recipe_id: "uuid",
    title: "text",
    photo: "text",
    ingredients: { type: "list", typeDef: "<text>" },
    instructions: "text",
  },
  key: ["recipe_id"],
});

module.exports = Recipe;
