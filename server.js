const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5050;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "quiz";

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      console.log("not connected to dataBase");
    }

    const db = client.db(databaseName);

    const createUser = ({ name, pass, food, drink }) => {
      db.collection("users").insertOne(
        {
          name: name,
          pass: pass,
          food: food,
          drink: drink,
        },
        (error, result) => {
          if (error) {
            return console.log("Unable to insert user");
          }
          console.log(result.ops);
        }
      );
    };

    app.post("/create", (req, res) => {
      const newUser = {
        name: req.body.name,
        pass: req.body.pass,
        food: req.body.food,
        drink: req.body.drink,
      };
      if (!newUser.food || !newUser.drink) {
        return res.status(400).json({ msg: "Pleas include a drink and food" });
      }
      createUser(newUser);

      res.send(newUser);
    });

    const deleteUser = ({ name, pass }) => {
      db.collection("users").deleteOne({ name: name, pass: pass });
    };

    app.delete("/delete", (req, res) => {
      console.log(req);
      const newUser = {
        name: req.body.name,
        pass: req.body.pass,
      };
      console.log(newUser);
      db.collection("users").findOne(
        { name: req.body.name, pass: req.body.pass },
        (error, user) => {
          if (user === null || error) {
            return console.log("Unable to fetch");
          }

          deleteUser(newUser);
        }
      );

      res.send(newUser);
    });
  }
);
