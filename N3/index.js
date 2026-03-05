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

// 1. ROTA PARA BUSCAR AS CATEGORIAS (Para preencher o Select no Home)
app.get("/site-locadora/home", function (req, res) {
  conexao.query(
    "SELECT * FROM rac_categoria",
    function (erro, lista_categorias) {
      if (erro) {
        res.json(erro);
      } else {
        res.send(lista_categorias);
      }
    },
  );
});

// 2. ROTA PARA SALVAR O AGENDAMENTO (Formulário) - Com validação de conflitos
app.post("/site-locadora/agendamento/", function (req, res) {
  const { nome_cliente, email_cliente, veiculo_id, data_reserva } = req.body;

  // Validação básica
  if (!nome_cliente || !email_cliente) {
    return res.status(400).json({ erro: "Nome e e-mail são obrigatórios." });
  }

  // Verificar conflitos de data/veículo
  const sqlConflito =
    "SELECT * FROM rac_agendamentos WHERE veiculoAge = ? AND dataAge = ?";
  conexao.query(
    sqlConflito,
    [veiculo_id, data_reserva],
    function (erro, conflitos) {
      if (erro) {
        return res.status(500).json(erro);
      }

      if (conflitos.length > 0) {
        return res
          .status(409)
          .json({ erro: "Veículo já reservado para esta data." });
      }

      // Inserir agendamento
      const sqlInsert =
        "INSERT INTO rac_agendamentos (clienteAge, emailAge, veiculoAge, dataAge) VALUES (?, ?, ?, ?)";
      conexao.query(
        sqlInsert,
        [nome_cliente, email_cliente, veiculo_id, data_reserva],
        function (erro, resultado) {
          if (erro) {
            return res.status(500).json(erro);
          }

          // Atualizar status do veículo para "Reservado"
          const sqlUpdate =
            "UPDATE rac_veiculos SET statusVei = 'Reservado' WHERE idVei = ?";
          conexao.query(sqlUpdate, [veiculo_id], function (erro) {
            if (erro) {
              console.log("Erro ao atualizar status do veículo:", erro);
            }
          });

          res.send(resultado.insertId.toString());
        },
      );
    },
  );
});

//3. ROTA PARA BUSCAR OS VEÍCULOS (Showroom) - Filtrado por categoria
app.get("/site-locadora/showroom", function (req, res) {
  const categoria = req.query.categoria;

  let sql =
    "SELECT v.*, c.nomeCat as categoriaVeic FROM rac_veiculos v INNER JOIN rac_categoria c ON v.idCatVei = c.idCat";
  let parametros = [];

  if (categoria && categoria !== "todas") {
    sql += " WHERE c.nomeCat = ?";
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

// ROTA PARA LISTAR VEÍCULOS (Estoque)
app.get("/site-locadora/veiculos", function (req, res) {
  const sql =
    "SELECT v.*, c.nomeCat as categoriaVeic FROM rac_veiculos v INNER JOIN rac_categoria c ON v.idCatVei = c.idCat";
  conexao.query(sql, function (erro, lista) {
    if (erro) res.status(500).json(erro);
    else res.send(lista);
  });
});

// ROTA PARA DELETAR AGENDAMENTO
app.delete("/site-locadora/agendamento/:id", function (req, res) {
  const id = req.params.id;
  conexao.query(
    "DELETE FROM rac_agendamentos WHERE idAge = ?",
    [id],
    function (erro, resultado) {
      if (erro) res.status(500).json(erro);
      else res.json({ mensagem: "Agendamento cancelado" });
    },
  );
});

// ROTA PARA LISTAR AGENDAMENTOS
app.get("/site-locadora/agendamentos", function (req, res) {
  const sql = `
    SELECT a.*, v.modeloVei, v.marcaVei, v.placaVei
    FROM rac_agendamentos a
    INNER JOIN rac_veiculos v ON a.veiculoAge = v.idVei
  `;
  conexao.query(sql, function (erro, lista) {
    if (erro) res.status(500).json(erro);
    else res.send(lista);
  });
});

//login

// ROTA DE LOGIN (User Story 4)
const bcrypt = require("bcrypt");
app.post("/login", function (req, res) {
  const { login, senha } = req.body;

  const sql = "SELECT * FROM rac_usuarios WHERE loginUsu = ?";
  conexao.query(sql, [login], async function (erro, resultados) {
    if (erro) return res.status(500).json(erro);

    if (resultados.length > 0) {
      const usuario = resultados[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senhaUsu);

      if (senhaValida) {
        res.status(200).json({
          id: usuario.idUsu,
          login: usuario.loginUsu,
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
  conexao.query(
    "SELECT idUsu, loginUsu, nivelAcessoUsu FROM rac_usuarios",
    function (erro, lista) {
      if (erro) res.status(500).json(erro);
      else res.send(lista);
    },
  );
});

// ROTA PARA CADASTRAR USUÁRIO COM CRIPTOGRAFIA
app.post("/usuario", async function (req, res) {
  const { login, senha, nivel_acesso } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  const sql =
    "INSERT INTO rac_usuarios (loginUsu, senhaUsu, nivelAcessoUsu) VALUES (?, ?, ?)";
  conexao.query(sql, [login, hash, nivel_acesso], function (erro, resultado) {
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

// ROTA PARA RELATÓRIO DE CATEGORIAS MAIS PROCURADAS
app.get("/site-locadora/relatorio", function (req, res) {
  const sql = `
    SELECT c.nomeCat, COUNT(a.idAge) as total_reservas
    FROM rac_veiculos v
    LEFT JOIN rac_agendamentos a ON v.idVei = a.veiculoAge
    INNER JOIN rac_categoria c ON v.idCatVei = c.idCat
    GROUP BY c.nomeCat
    ORDER BY total_reservas DESC
  `;
  conexao.query(sql, function (erro, lista) {
    if (erro) res.status(500).json(erro);
    else res.send(lista);
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
