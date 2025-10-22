const bcrypt = require("bcrypt");

// Replace with the password you want to hash
const password = "test123123";

// Define how many salt rounds (10 is standard and secure)
const saltRounds = 10;

bcrypt
	.hash(password, saltRounds)
	.then((hashedPassword) => {
		console.log("Plain Password:", password);
		console.log("Hashed Password:", hashedPassword);
	})
	.catch((err) => {
		console.error("Error hashing password:", err);
	});
