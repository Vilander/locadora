const express = require("express");
const app = express();

let mysql = require("mysql");
const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_locadora",
});

app.get("/", (req, res) => {
  res.send("Servidor rodando");
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
