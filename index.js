const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/question", require("./routes/question"));
app.use("/api/user", require("./routes/user"));


async function start() {
  try {
    await mongoose.connect(
      "mongodb+srv://xsoft2020:xsoft2020@cluster0.4ba0m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    );
    app.listen(5000);
  } catch (error) {
    console.log(error);
  }
}

start().then(() => {
    console.log("App has been started on port 5000");
});
