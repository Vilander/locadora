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

// ROTA PARA CADASTRAR VEÍCULO (Formulário de cadastro)
// app.post("/cadastrar-veiculo/", function (req, res) {
//   const data = req.body;
//   conexao.query(
//     `INSERT INTO rac_veiculos set ?`,
//     [data],
//     function (erro, resultado) {
//       if (erro) {
//         res.json(erro);
//       }
//       res.send(resultado.insertId);
//     },
//   );
// });

// ROTA PARA CADASTRAR VEÍCULO (Formulário de cadastro)
app.post("/site-locadora/veiculos", function (req, res) {
  const data = req.body;

  conexao.query(
    "INSERT INTO rac_veiculos set ?",
    [data],
    function (erro, resultado) {
      if (erro) {
        console.log("Erro ao cadastrar veículo:", erro);
        return res.status(500).json(erro);
      }

      res.send(resultado.insertId.toString());
    },
  );
});

//login

// ROTA DE LOGIN (User Story 4)
app.post("/login", function (req, res) {
  const { email, senha } = req.body; // Recebe 'email' do frontend

  const sql = "SELECT * FROM rac_usuarios WHERE emailUsu = ?"; // Usa emailUsu
  conexao.query(sql, [email], async function (erro, resultados) {
    if (erro) return res.status(500).json(erro);

    if (resultados.length > 0) {
      const usuario = resultados[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senhaUsu);

      if (senhaValida) {
        res.status(200).json({
          id: usuario.idUsu,
          nome: usuario.nomeUsu,
          nivel: usuario.nivelAcessoUsu,
        });
      } else {
        res.status(401).send("Senha incorreta.");
      }
    } else {
      res.status(401).send("Usuário não encontrado.");
    }
  });
});

app.get("/usuarios", function (req, res) {
  const sql = `
        SELECT u.idUsu, u.nomeUsu, u.emailUsu, n.nomeNivel 
        FROM rac_usuarios u
        INNER JOIN rac_niveis n ON u.nivelAcessoUsu = n.idNivel
    `;

  conexao.query(sql, function (erro, lista) {
    if (erro) res.status(500).json(erro);
    else res.send(lista);
  });
});

// ROTA PARA CADASTRAR USUÁRIO COM CRIPTOGRAFIA
const bcrypt = require("bcrypt");
app.post("/usuario", async function (req, res) {
  const { nome, email, senha, nivel } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  const sql =
    "INSERT INTO rac_usuarios (nomeUsu, emailUsu, senhaUsu, nivelAcessoUsu) VALUES (?, ?, ?, ?)";
  conexao.query(sql, [nome, email, hash, nivel], function (erro, resultado) {
    if (erro) res.status(500).json(erro);
    else res.sendStatus(200);
  });
});

// ROTA PARA DELETAR USUÁRIO
app.delete("/usuario/:id", function (req, res) {
  const id = req.params.id;
  conexao.query(
    "DELETE FROM rac_usuarios WHERE idUsu = ?",
    [id],
    function (erro, resultado) {
      if (erro) res.status(500).json(erro);
      else res.json({ mensagem: "Usuário removido" });
    },
  );
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
