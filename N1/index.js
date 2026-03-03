const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());
app.use(express.json());

let mysql = require("mysql");
let conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_locadora",
});

conexao.connect(function (erro) {
  if (erro) {
    console.log("Não foi possível estabelecer conexão \n");
    throw erro;
  } else {
    console.log("Sucesso na Conexão \n");
  }
});

// 1. ROTA PARA BUSCAR OS VEÍCULOS (Para preencher o Select)
app.get("/site-locadora/home", function (req, res) {
  conexao.query("SELECT * FROM rac_veiculos", function (erro, lista_veiculos) {
    if (erro) {
      res.json(erro);
    } else {
      res.send(lista_veiculos);
    }
  });
});

// 2. ROTA PARA SALVAR O AGENDAMENTO (Formulário)
app.post("/site-locadora/agendamento/", function (req, res) {
  const data = req.body;

  // Data e hora atual do servidor para salvar no banco
  data.dataAg = new Date();

  conexao.query(
    "INSERT INTO rac_agendamento set ?",
    [data],
    function (erro, resultado) {
      if (erro) {
        res.json(erro);
      } else {
        res.send(resultado.insertId.toString());
      }
    },
  );
});

//3. ROTA PARA BUSCAR OS VEÍCULOS (Showroom)
app.get("/site-locadora/showroom", function (req, res) {
  const categoria = req.query.categoria;

  let sql = "SELECT * FROM rac_veiculos";
  let parametros = [];

  if (categoria && categoria !== "todas") {
    sql += " WHERE categoriaVeic = ?";
    parametros.push(categoria);
  }

  conexao.query(sql, parametros, function (erro, lista_veiculos) {
    if (erro) {
      console.error("Erro ao buscar veículos para o showroom:", erro);
      res
        .status(500)
        .json({ erro: "Erro interno no servidor ao buscar veículos." });
    } else {
      res.json(lista_veiculos);
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
