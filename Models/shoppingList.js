const cassandra = require("cassandra-driver");

const ShoppingList = cassandra.mapping.Model.extend({
  tableName: "Shoppinglist",
  columns: {
    user_id: "uuid",
    list_id: "uuid",
    products: { type: "list", typeDef: "<uuid>" },
  },
  key: ["user_id", "list_id"],
});

module.exports = ShoppingList;
