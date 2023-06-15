const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//  ##################################################################
// ######################## Functions #################################
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

const findKeyByValue = function(object, value) {
  // run through each key-value pair in the object...
  for (let key in object){
    // if we found a key...
    if (value === object[key]) {
      // stop the show, and return the value associated with the key we found
      return key;
    }
  }
}

//  ##################################################################
// ########################### GET ROUTES #############################
//  ##################################################################

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  userName = req.cookies["userID"];
  const templateVars = {
    userName: userName,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  userName = req.cookies["userID"];
  const templateVars = {
    userName: userName,
  };  
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  email = req.params.email;
  password = req.params.password;
  userName = req.cookies["userID"];
  const templateVars = {
    userName: userName,
    email: email,
    password: password,
  };  
  res.render("users_reg", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//  ##################################################################
// ########################## POST ROUTES #############################
//  ##################################################################

app.post("/urls", (req, res) => {
  const shortRando = generateRandomString();
  urlDatabase[shortRando] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  const userName = req.body.userName;
  res.cookie("userID", userName);
  res.redirect(`/urls`);
});

// app.post("/register", (req, res) => {
//   const userName = req.body.userName;
//   res.cookie("userID", userName);
//   res.redirect(`/urls`);
// });

app.post("/logout", (req, res) => {
  const userName = req.body.userName;
  //res.cookie("userID", userName);
  res.clearCookie("userID");
  res.redirect(`/urls`);
});


//  ##################################################################
// ###################### ROUTES WITH PARAMETERS ###################### 
//  ##################################################################

app.post("/urls/:id", (req,res) => {
  const shortName = req.params.id;
  urlDatabase[shortName] = req.body.newLongName;
  res.redirect(`/urls`);
});

app.get("/urls/:id", (req, res) => {
  const shortName = req.params.id;
  const longName = urlDatabase[shortName];
  const userName = req.cookies["userID"];

  const templateVars = { 
    id: shortName, 
    longURL: longName,
    userName: userName,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortName = req.params.id;
  const longURL = urlDatabase[shortName];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

process.on('SIGTERM', () => {
  shutdownManager.terminate(() => {
    console.log('Server is gracefully terminated');
  });
}); 