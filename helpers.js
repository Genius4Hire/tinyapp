//  ##################################################################
// ####################### Helper Functions ###########################
//  ##################################################################

const generateRandomString = function() {
  const letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (x = 0; x < 6; x++) {
    randomIndex = Math.round(Math.random() * (letters.length - 1));
    shortCode += letters.slice(randomIndex, randomIndex + 1);
  }
  return shortCode;
};

const isLoggedin = function(userID, users) {
  if (users[userID]) {
    return true;
  }
  return false;
};

const getUserByEmail = function(email, database) {
  console.log("database:",database);
  console.log("email:",email);
  for (let user in database) {
    console.log("database[user]:", database[user]);
    if (database[user].email === email) {
      console.log("found:")
      console.log(database[user]);
      return database[user];
    }
  }
  return;
};


module.exports = {generateRandomString, isLoggedin, getUserByEmail}