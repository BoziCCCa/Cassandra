const express = require("express");
const app = express();
const cassandra = require("cassandra-driver");
const userRoutes = require("./Controllers/userController");
const recipeRoutes = require("./Controllers/recipeController");
const productRoutes = require("./Controllers/productController");
const shoppingListRoutes = require("./Controllers/shoppingListController");
const favoriteRoutes = require("./Controllers/favoriteController");
const cors = require("cors");

const client = new cassandra.Client({
  contactPoints: ["127.0.0.1:4444"],
  localDataCenter: "datacenter1",
  keyspace: "recipe_app",
  authProvider: new cassandra.auth.PlainTextAuthProvider(
    "cassandra",
    "cassandra"
  ),
});

client
  .connect()
  .then(() => console.log("Connected to Cassandra"))
  .catch((err) => console.error("Error connecting to Cassandra", err));

app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/products", productRoutes);
app.use("/shopping-lists", shoppingListRoutes);
app.use("/favorites", favoriteRoutes);

app.listen(3000, () => {
  console.log("Api running on port 3000!");
});

module.exports = client;
