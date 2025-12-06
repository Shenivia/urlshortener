var express = require("express");
var cors = require("cors");
var dns = require("dns");
var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express. json());

app.get("/", function (req, res) {
  res.send('<h1>URL Shortener</h1><form action="/api/shorturl" method="POST"><input name="url" placeholder="https://example.com"><button>Shorten</button></form>');
});

var urlDatabase = [];
var idCounter = 1;

app.post("/api/shorturl", function (req, res) {
  var originalUrl = req.body.url;
  if (!/^https?:\/\//.test(originalUrl))
    return res. json({ error: "invalid url" });

  try {
    var hostname = new URL(originalUrl). hostname;
    dns.lookup(hostname, function (err) {
      if (err) return res.json({ error: "invalid url" });
      var newEntry = { original_url: originalUrl, short_url: idCounter++ };
      urlDatabase.push(newEntry);
      res. json(newEntry);
    });
  } catch (e) {
    res. json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", function (req, res) {
  var entry = urlDatabase.find((x) => x.short_url === parseInt(req.params. id));
  entry ?  res.redirect(entry.original_url) : res. json({ error: "not found" });
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log("Running on port " + port));
