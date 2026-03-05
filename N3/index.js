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
    console.log("Sucesso na Conexão com db_locadora \n");
  }
});

// 1. ROTA PARA BUSCAR AS CATEGORIAS (Select no Home)
app.get("/site-locadora/home", function (req, res) {
  conexao.query(
    "SELECT * FROM rac_categoria",
    function (erro, lista_categorias) {
      if (erro) return res.status(500).json(erro);
      res.send(lista_categorias);
    },
  );
});

// 2. ROTA PARA SALVAR O AGENDAMENTO (Com validação)
app.post("/site-locadora/agendamento/", function (req, res) {
  const { nome_cliente, email_cliente, veiculo_id, data_reserva } = req.body;

  if (!nome_cliente || !email_cliente) {
    return res.status(400).json({ erro: "Nome e e-mail são obrigatórios." });
  }

  const sqlConflito =
    "SELECT * FROM rac_agendamentos WHERE veiculoAge = ? AND dataAge = ?";
  conexao.query(
    sqlConflito,
    [veiculo_id, data_reserva],
    function (erro, conflitos) {
      if (erro) return res.status(500).json(erro);

      if (conflitos.length > 0) {
        return res
          .status(409)
          .json({ erro: "Veículo já reservado para esta data." });
      }

      const sqlInsert =
        "INSERT INTO rac_agendamentos (clienteAge, emailAge, veiculoAge, dataAge) VALUES (?, ?, ?, ?)";
      conexao.query(
        sqlInsert,
        [nome_cliente, email_cliente, veiculo_id, data_reserva],
        function (erro, resultado) {
          if (erro) return res.status(500).json(erro);
          res.send(resultado.insertId.toString());
        },
      );
    },
  );
});

// 3. ROTA PARA BUSCAR OS VEÍCULOS (Showroom)
app.get("/site-locadora/showroom", function (req, res) {
  const categoria = req.query.categoria;

  // Consulta atualizada com os nomes corretos do banco (idCatVei)
  let sql =
    "SELECT rac_veiculos.*, rac_categoria.nomeCat FROM rac_veiculos INNER JOIN rac_categoria ON rac_veiculos.idCatVei = rac_categoria.idCat";
  let parametros = [];

  if (categoria && categoria !== "todas") {
    sql += " WHERE rac_categoria.nomeCat = ?";
    parametros.push(categoria);
  }

  conexao.query(sql, parametros, function (erro, lista_veiculos) {
    if (erro) {
      console.error("Erro no showroom:", erro);
      return res
        .status(500)
        .json({ erro: "Erro interno no servidor ao buscar veículos." });
    }
    res.json(lista_veiculos);
  });
});

// 4. ROTA PARA CADASTRAR VEÍCULO
app.post("/site-locadora/veiculos", function (req, res) {
  const data = req.body;
  conexao.query(
    "INSERT INTO rac_veiculos SET ?",
    [data],
    function (erro, resultado) {
      if (erro) return res.status(500).json(erro);
      res.send(resultado.insertId.toString());
    },
  );
});

// 5. ROTA PARA LISTAR VEÍCULOS (Estoque)
app.get("/site-locadora/veiculos", function (req, res) {
  const sql =
    "SELECT rac_veiculos.*, rac_categoria.nomeCat FROM rac_veiculos INNER JOIN rac_categoria ON rac_veiculos.idCatVei = rac_categoria.idCat";
  conexao.query(sql, function (erro, lista) {
    if (erro) return res.status(500).json(erro);
    res.send(lista);
  });
});

// 6. ROTA PARA LISTAR AGENDAMENTOS
app.get("/site-locadora/agendamentos", function (req, res) {
  const sql = `
    SELECT rac_agendamentos.*, rac_veiculos.modeloVei, rac_veiculos.marcaVei, rac_veiculos.placaVei
    FROM rac_agendamentos
    INNER JOIN rac_veiculos ON rac_agendamentos.veiculoAge = rac_veiculos.idVei
  `;
  conexao.query(sql, function (erro, lista) {
    if (erro) return res.status(500).json(erro);
    res.send(lista);
  });
});

// 7. ROTA PARA DELETAR AGENDAMENTO
app.delete("/site-locadora/agendamento/:id", function (req, res) {
  const id = req.params.id;
  conexao.query(
    "DELETE FROM rac_agendamentos WHERE idAge = ?",
    [id],
    function (erro, resultado) {
      if (erro) return res.status(500).json(erro);
      res.json({ mensagem: "Agendamento cancelado" });
    },
  );
});

// ==========================================
// ROTAS DE USUÁRIO E LOGIN
// ==========================================

const bcrypt = require("bcrypt");

// ROTA DE LOGIN
app.post("/login", function (req, res) {
  const { email, senha } = req.body;

  // Consulta usando o novo campo emailUsu
  const sql = "SELECT * FROM rac_usuarios WHERE emailUsu = ?";

  conexao.query(sql, [email], async function (erro, resultados) {
    if (erro) {
      console.error("Erro no login:", erro);
      return res.status(500).json(erro);
    }

    if (resultados.length > 0) {
      const usuario = resultados[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senhaUsu);

      if (senhaValida) {
        res.status(200).json({
          id: usuario.idUsu,
          nome: usuario.nomeUsu,
          email: usuario.emailUsu,
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

// ROTA PARA BUSCAR USUÁRIOS
app.get("/usuarios", function (req, res) {
  conexao.query(
    "SELECT idUsu, nomeUsu, emailUsu, nivelAcessoUsu FROM rac_usuarios",
    function (erro, lista) {
      if (erro) return res.status(500).json(erro);
      res.send(lista);
    },
  );
});

// ROTA PARA CADASTRAR USUÁRIO
app.post("/usuario", async function (req, res) {
  const { nome, email, senha, nivel_acesso } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);
    const sql =
      "INSERT INTO rac_usuarios (nomeUsu, emailUsu, senhaUsu, nivelAcessoUsu) VALUES (?, ?, ?, ?)";

    conexao.query(
      sql,
      [nome, email, hash, nivel_acesso],
      function (erro, resultado) {
        if (erro) return res.status(500).json(erro);
        res.sendStatus(200);
      },
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

// ROTA PARA DELETAR USUÁRIO
app.delete("/usuario/:id", function (req, res) {
  const id = req.params.id;
  conexao.query(
    "DELETE FROM rac_usuarios WHERE idUsu = ?",
    [id],
    function (erro, resultado) {
      if (erro) return res.status(500).json(erro);
      res.json({ mensagem: "Usuário removido" });
    },
  );
});

// ROTA PARA RELATÓRIO DE CATEGORIAS MAIS PROCURADAS
app.get("/site-locadora/relatorio", function (req, res) {
  const sql = `
    SELECT rac_categoria.nomeCat, COUNT(rac_agendamentos.idAge) as total_reservas
    FROM rac_veiculos
    LEFT JOIN rac_agendamentos ON rac_veiculos.idVei = rac_agendamentos.veiculoAge
    INNER JOIN rac_categoria ON rac_veiculos.idCatVei = rac_categoria.idCat
    GROUP BY rac_categoria.nomeCat
    ORDER BY total_reservas DESC
  `;
  conexao.query(sql, function (erro, lista) {
    if (erro) return res.status(500).json(erro);
    res.send(lista);
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000!");
});
