const cassandra = require("cassandra-driver");
const bcrypt = require("bcrypt");

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
  .then(() => console.log("Connected to Cassandra in USER SERVICE"))
  .catch((err) => console.error("Error connecting to Cassandra", err));

const User = {
  async addUser(newUser) {
    const query =
      'INSERT INTO "user" (username, email, password, photo) VALUES (?, ?, ?, ?)';
    const { username, email, password, photo } = newUser;

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = [username, email, hashedPassword, photo];

    try {
      await client.execute(query, params, { prepare: true });
      console.log("User added successfully:", newUser);
      return { success: true, message: "User added successfully" };
    } catch (error) {
      console.error("Error adding user:", error);
      return { success: false, message: "Error adding user" };
    }
  },
  async deleteUser(email) {
    const query = 'DELETE FROM "user" WHERE user_id=? IF EXISTS';
    const params = [email];

    try {
      await client.execute(query, params, { prepare: true });
      console.log("User " + params.username + " successfully deleted!");
      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, message: "Error deleting user" };
    }
  },
  async getUserByEmail(email) {
    const query = 'SELECT * FROM "user" WHERE email=?';
    const params = [email];

    try {
      const result = await client.execute(query, params, { prepare: true });

      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log("User found:", user);
        return { success: true, user };
      } else {
        console.error("User not found");
        return { success: false, message: "User not found" };
      }
    } catch (error) {
      console.error("Error getting user:", error);
      return { success: false, message: "Error getting user" };
    }
  },
  async getUserByUsername(username) {
    const query = 'SELECT * FROM "user" WHERE username=?';
    const params = [username];

    try {
      const result = await client.execute(query, params, { prepare: true });

      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log("User found:", user);
        return { success: true, user };
      } else {
        console.error("User not found");
        return { success: false, message: "User not found" };
      }
    } catch (error) {
      console.error("Error getting user:", error);
      return { success: false, message: "Error getting user" };
    }
  },
  async updateUser(newUser) {
    const query = 'UPDATE  "user" SET username=?,photo=? WHERE email=?';
    const params = [newUser.username, newUser.photo, newUser.email];
    try {
      await client.execute(query, params, { prepare: true });
      console.log("User updated successfully:", newUser);
      return { success: true, message: "User updated successfully" };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, message: "Error updating user" };
    }
  },

  async loginUser(email, password) {
    const getUserQuery = 'SELECT * FROM "user" WHERE email=?';
    const params = [email];

    try {
      const result = await client.execute(getUserQuery, params, {
        prepare: true,
      });

      if (result.rows.length > 0) {
        const user = result.rows[0];

        // Compare passwords using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          console.log("User logged in successfully:", user);
          return { success: true, user };
        } else {
          console.error("Incorrect password");
          return { success: false, message: "Incorrect email or password" };
        }
      } else {
        console.error("User not found");
        return { success: false, message: "Incorrect email or password" };
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      return { success: false, message: "Error logging in user" };
    }
  },
};

module.exports = User;
