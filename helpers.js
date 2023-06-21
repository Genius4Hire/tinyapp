//  ##################################################################
// ####################### Helper Functions ###########################
//  ##################################################################

const {urlDatabase, users} = require('./database');

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
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return;
};


const urlsForUser = function(userID) {
  const urls = [];
  let found = false;
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === userID.id) {
      urls.push(url);
      found = true;
    }
  }
  if (found) {
    return urls;
  } else {
    return null;
  }
};


module.exports = {urlsForUser, generateRandomString, isLoggedin, getUserByEmail}