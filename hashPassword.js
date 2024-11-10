const bcrypt = require('bcrypt');

// Replace 'yourPassword' with the password you want to hash
const password = 'test123123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed password:', hash);
    }
});