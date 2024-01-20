const cassandra = require("cassandra-driver");

const Product = cassandra.mapping.Model.extend({
  tableName: "Product",
  columns: {
    product_id: "uuid",
    name: "text",
    photo: "text",
    calories: "int",
    proteins: "int",
    fats: "int",
  },
  key: ["product_id"],
});

module.exports = Product;
