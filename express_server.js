const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

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

//  ##################################################################
// ########################### ROUTES #################################
//  ##################################################################

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortRando = generateRandomString();
  urlDatabase[shortRando] = req.body.longURL;
  res.redirect(`/urls/${shortRando}`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//  ##################################################################
// ###################### ROUTES WITH PARAMETERS ###################### 
//  ##################################################################

app.get("/urls/:id", (req, res) => {
  let shortName = req.params.id;
  let longName = urlDatabase[shortName];
  const templateVars = { 
    id: shortName, 
    longURL: longName 
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortName = req.params.id;
  const longURL = urlDatabase[shortName];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

process.on('SIGTERM', () => {
  shutdownManager.terminate(() => {
    console.log('Server is gracefully terminated');
  });
}); 