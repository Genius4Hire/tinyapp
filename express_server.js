const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser())

//  ##################################################################
// ######################## Global Constants ##########################
//  ##################################################################

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "w9tm3e",
  },
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "u1@a.com",
    password: "p",
  },
  w9tm3e: {
    id: "w9tm3e",
    email: "u2@a.com",
    password: "d",
  },
};

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

const findKeyByValue = function(object, value) {
  // run through each key-value pair in the object...
  for (let key in object){
    // if we found a key...
    if (value === object[key]) {
      // stop the show, and return the value associated with the key we found
      return key;
    }
  }
};

const isLoggedin = function(userID) {
  if (users[userID]) {
    return true;
  }
  return false;
};

const userExists = function(email) {
  let exists = false;
  for (const user in users) {
    if (users[user].email === email) {
      exists = true;
    }
  }
  return exists;
}

const urlsForUser = function(userID) {
  const urls = [];
  let found = false;
  for (const url in urlDatabase) {
    const currentURL = urlDatabase[url];
    //  console.log("looking in", );
    //  console.log("  └─► ", )
    // console.log("URL:",url);
    // console.log("userID.id", userID.id)
    // console.log("urlDatabase[url].userID", urlDatabase[url].userID)

    if (urlDatabase[url].userID === userID.id) {
      console.log(`found url for ${userID}!`)
      urls.push(url);
      found = true;
    };
    // }
  }
  // console.log("urls: ",urls);
  if (found) {
    return urls;
  } else {
    return null;
  }
};

//  ##################################################################
// ########################### GET ROUTES #############################
//  ##################################################################

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/login", (req, res) => {
  const userID = req.cookies["TinyAppSessionCookie"];
  if (isLoggedin(userID)) {
    res.redirect("/urls")
  } else {
    const templateVars = {
      user: '',
    };
    res.render("login", templateVars);
  }
});

app.get("/urls", (req, res) => {
  const userID = req.cookies["TinyAppSessionCookie"];
  if (isLoggedin(userID)) {
    const user = users[userID];
    const urls = urlsForUser(user);
    const templateVars = {
      user: user,
      urls: urls,
      urlDatabase: urlDatabase,
    };
    console.log(urls);
    console.log(urlDatabase)
    res.render("urls_index", templateVars);
  } else {
    res.redirect(401,"login");
    //could be better..
  }
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies["TinyAppSessionCookie"];
  if (isLoggedin(userID)) {
    const user = users[userID];
    const urls = urlsForUser(user);
    console.log("User id:", user.id)
    console.log("List of current urls",urls);
    const templateVars = {
      user: user,
      urls: urls,
      urlDatabase: urlDatabase,
    };  
    res.render("urls_new", templateVars);
  } else {
    res.redirect(401, "/login");
    
  }
});

app.get("/register", (req, res) => {
  const userID = req.cookies["TinyAppSessionCookie"];
  if (isLoggedin(userID)) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: '',
    };
    res.render("users_reg", templateVars);
  }
});

app.get("/urls.json", (req, res) => {
  res.json(null);
});

app.get("/", (req, res) => {
  templateVars = {
    user: "",
  }
  res.render("index", templateVars)
});


//  ##################################################################
// ########################## POST ROUTES #############################
//  ##################################################################

app.post("/urls", (req, res) => {
  const userID = req.cookies["TinyAppSessionCookie"];
  if (isLoggedin(userID)) {
    const shortRando = generateRandomString();
    const userID = req.cookies["TinyAppSessionCookie"];
    urlDatabase[shortRando] = {
      longURL : req.body.longURL,
      userID : userID,
    }
    console.log(urlDatabase);
    res.redirect(`/urls`);
  } else {
    res.statusMessage = "Only logged-in users may add URL's!"
    res.status(403);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let userFound = false;
  let passwordCorrect = false;
  //console.log("Attempt: ",email, password);
  for (const user in users) {
    //console.log(users[user].email)
    if (users[user].email === email) {
      userFound = true;
      //console.log("Good email")
      if (users[user].password === password) {
        passwordCorrect = true;
        //console.log("Good password")
        res.cookie("TinyAppSessionCookie", users[user].id); 
        res.redirect('/urls');
        
      }
    }
  }
  if (!passwordCorrect){
    res.redirect(403, "/login");
  }
});

// const users = {
//   userRandomID: {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur",
//   }
// };

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!userExists(email) && !(email === '' || password === '')) {
    const newUser = {
      id: userID,
      email: email,
      password: password,
    }
    users[userID] = newUser;
    console.log("Adding new user:",users);
    res.cookie("TinyAppSessionCookie", userID);
  } else {
    res.redirect(400, "/login");
  }
//  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("TinyAppSessionCookie");
  res.redirect("login");
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
  const userID = req.cookies["TinyAppSessionCookie"];
  const user = users.userID;
  const shortName = req.params.id;
  const longName = urlDatabase[shortName];
  const templateVars = { 
    user: user, 
    id: shortName, 
    longURL: longName,
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