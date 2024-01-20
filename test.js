const User = require("./Services/userService");

// Function to run the test
async function runTest() {
  const newUser = {
    username: "JohnDoeeee",
    email: "john.doe@example.comeee",
    password: "hashed_passwordeee",
    photo: "path/to/profile_photo.jpgeee",
  };

  // Call the addUser method from the userService
  const result = await User.addUser(newUser);

  // Print the result
  console.log(result);
}

// Run the test
runTest();
