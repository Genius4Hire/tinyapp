//  ##################################################################
// ######################## Global Constants ##########################
//  ##################################################################

const express = require("express");
const morgan = require("morgan"); 
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const app = express();
const PORT = 8080; // default port 8080

const {urlDatabase, users}                                              = require('./database');
const {urlsForUser, generateRandomString, isLoggedin, getUserByEmail}   = require('./helpers');


//  ##################################################################
// ########################## Global Setup ############################
//  ##################################################################

app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieSession({
  name: "session",
  keys: ["This is super secure and a great hashing phrase!"],
  maxAge: 24 * 60 * 60 * 1000,
}));

//  ##################################################################
// ########################### GET ROUTES #############################
//  ##################################################################

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  if (isLoggedin(userID, users)) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: '',
    };
    res.render("login", templateVars);
  }
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (isLoggedin(userID, users)) {
    const user = users[userID];
    const urls = urlsForUser(user);
    const templateVars = {
      user: user,
      urls: urls,
      urlDatabase: urlDatabase,
    };
    res.render("urls_index", templateVars);
  } else {
    res.status(401).send(`Only logged-in users may view URL's! Please <a href="/login">Log in..</a>`);
  }
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  if (isLoggedin(userID, users)) {
    const user = users[userID];
    const urls = urlsForUser(user);
    const templateVars = {
      user: user,
      urls: urls,
      urlDatabase: urlDatabase,
    };
    res.render("urls_new", templateVars);
  } else {
    res.status(401).send(`Only logged-in users may add URL's! Please <a href="/login">Log in..</a>`);
  }
});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  if (isLoggedin(userID, users)) {
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
  const templateVars = {
    user: "",
  };
  res.render("index", templateVars);
});

//  ##################################################################
// ########################## POST ROUTES #############################
//  ##################################################################

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (isLoggedin(userID, users)) {
    const shortRando = generateRandomString();
    const userID = req.session.user_id;
    urlDatabase[shortRando] = {
      longURL : req.body.longURL,
      userID : userID,
    };
    res.redirect(`/urls`);
  } else {
    res.status(401).send(`Only logged-in users may add URL's! Please <a href="/login">Log in..</a>`);

  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let passwordCorrect = false;
  for (const user in users) {
    if (users[user].email === email) {
      if (bcrypt.compareSync(password, users[user].hashedPassword)) {
        passwordCorrect = true;
        req.session.user_id = users[user].id;
        res.redirect('/urls');
        
      }
    }
  }
  if (!passwordCorrect) {
    res.redirect(403, "/login");
  }
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  if (!getUserByEmail(email, users) && !(email === '' || password === '')) {
    const newUser = {
      id: userID,
      email: email,
      hashedPassword: hashedPassword,
    };
    users[userID] = newUser;
    req.session.user_id = userID;
    res.redirect(`/urls`);
  } else {
    res.redirect(400, "/login");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = '';
  res.redirect("login");
});

app.get("/logout", (req, res) => {
  req.session.user_id = '';
  res.redirect("login");
});


//  ##################################################################
// ###################### ROUTES WITH PARAMETERS ######################
//  ##################################################################

app.post("/urls/:id", (req,res) => {
  const userID = req.session.user_id;
  const id = req.params.id;
  urlDatabase[id].longURL = req.body.newLongName;
  res.redirect(`/urls`);
}); 

app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const id = req.params.id;
  if (isLoggedin(userID, users)) {
    if (!urlDatabase[id]) {
      res.status(400).send(`Sorry, that URL does not exist. You can create it <a href="/urls/new">here!</a>`);
      return;
    }
    const user = users[userID];
    const urls = urlsForUser(user);
    const templateVars = {
      urlID : id,
      user: user,
      urls: urls,
      urlDatabase: urlDatabase,
    };
    

    res.render("urls_show", templateVars);
  } else {
    res.status(400).send(`Only logged-in users may edit URL's! Please <a href="/login">Log in..</a>`);
  }
});

app.get("/u/:id", (req, res) => {
  if (urlDatabase[req.params.id]) {
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL);
  } else {
    res.redirect(404, "/login");
  }
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});

process.on('SIGTERM', () => {
  shutdownManager.terminate(() => {
    console.log('Server is gracefully terminated');
  });
});