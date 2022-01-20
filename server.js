const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const SneaksAPI = require("sneaks-api");
const sneaks = new SneaksAPI();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 5000 | process.env.PORT;

app.get("/", (req, res) => {
  res.send(`API on ${port}`);
});

app.post("/body", (req, res) => {
  console.log(req.body);
  try {
    if (!req.body.length) {
      res.send("no body attached");
    } else {
      res.json({ body: req.body });
    }
  } catch (error) {
    res.send(error);
  }
});

app.post("/auth", async (req, res) => {
  try {
    console.log("server resp ", JSON.stringify(req.body));

    const addUserDB = () => {
      const create = new users({
        userName: req.body.name,
        userPwd: req.body.pwd,
        userEmail: req.body.mail,
        CreatedOn: Date.now(),
      });
      create.save().then(() => {
        console.log("success");
        res.json("user added");
      });
    };

    async function availability(mail) {
      users
        .find({ userEmail: mail })
        .exec()
        .then((x) => {
          response(x);
        });
    }
    const response = (resp) => {
      console.log(resp);
      if (!resp.length) {
        addUserDB();
      } else {
        res.json("user already exists please sign in");
      }
    };
    await availability(req.body.mail);
  } catch (error) {
    res.send(error);
  }
});

app.get("/enter", async (req, res) => {
  async function availability(pwd, mail) {
    users
      .find({ userPwd: pwd, userEmail: mail })
      .exec()
      .then((x) => {
        response(x);
      });
  }

  const response = (resp) => {
    console.log(resp);
    if (!resp.length) {
      // addUserDB();
      res.json("Not registered");
    } else {
      res.json({ found: resp });
    }
  };

  await availability(req.body.pwd, req.body.mail);
});

app.get("/trending", (req, res) => {
  sneaks.getMostPopular(10, function (err, products) {
    console.log(products);

    err ? res.send(err) : res.send(products);
  });
});

app.get("/shop/:item", (req, res) => {
  const item = req.params.item;
  console.log(item);
  sneaks.getProducts(item, 10, function List(err, products) {
    console.log(products);
    err ? res.send(err) : res.send(products);
  });
});

app.get("/shopitem/:styleid", (req, res) => {
  const styleid = req.params.styleid;
  console.log(styleid);
  sneaks.getProductPrices(styleid, function (err, resp) {
    console.log(resp);

    err ? res.send(err) : res.send(resp);
  });
});

app.listen(port, () => {
  console.log(`API on ${port}`);
});
