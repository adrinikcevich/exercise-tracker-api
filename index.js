const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const { query } = require("express");

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const body = req.body.username;

  let search = users.find((user) => user.username === body);
  if (!search) {
    let newUser = {
      username: body,
      count: 0,
      _id: lastId.toString(),
      log: [],
    };
    lastId++;
    users.push(newUser);

    res.json({
      _id: newUser._id,
      username: newUser.username,
    });
  } else {
    res.json({
      _id: search._id,
      username: search.username,
    });
  }
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const id = req.params._id;
  const { duration, date, description } = req.body;

  let search = users.find((user) => user._id == id);

  let newDate = date
    ? new Date(date).toDateString()
    : new Date().toDateString();

  if (search) {
    search.count++;
    search.log.push({
      description: description,
      duration: parseInt(duration),
      date: newDate,
    });

    res.json({
      _id: id,
      username: search.username,
      description: description,
      duration: parseInt(duration),
      date: newDate,
    });
  } else {
    res.send({ error: "Invalid ID" });
  }
});

app.get("/api/users", (req, res) => {
  let array = [];
  for (const user of users) {
    array.push({
      _id: user._id,
      username: user.username,
    });
  }
  res.json(array);
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { from, to, limit } = req.query;

  const id = req.params._id;
  let search = users.find((user) => user._id == id);
  if (search) {
    let fromDate = new Date(from).getTime();
    let toDate = new Date(to).getTime();
    const compareDates = (date1, date2) => {
      let d1 = date1.getTime();
      let d2 = date2.getTime();
      if (d1 > d2) return d1;
    };
    const filteredLogs = search.log.filter((log) => {
      const originalDate = new Date(log.date).getTime();

      if (fromDate && toDate) return originalDate > fromDate && originalDate < toDate;
      if (fromDate) return originalDate > fromDate;
      if (toDate) return originalDate < toDate;
      return log;
    });

    
    
    res.send({ ...search, log: limit ? filteredLogs.slice(0,limit) : filteredLogs });
    
   
  } else {
    res.json({ error: "Invalid ID" });
  }
});

let users = [];

let lastId = 0;

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
