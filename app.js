const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbpath = path.join(__dirname, "todoApplication.db");
app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, async () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
  }
};

initializeDBAndServer();

app.post("/add", async (request, response) => {
  const { people } = request.body;
  console.log(people);
  for (let each of people) {
    const { email, name } = each;
    const query = `select email from employee where email=${email};`;
    const queryCheck = await db.get(query);

    if (queryCheck === undefined) {
      const queryInsert = `insert into employee(email,name)values(${email},${name});`;
      const queryRun = await db.run(queryInsert);
    } else {
      const queryUpdate = `update employee set name=${name} where email=${email};`;
      const queryRun = await db.run(queryUpdate);
    }
  }
  response.send("Successfully updated");
});
