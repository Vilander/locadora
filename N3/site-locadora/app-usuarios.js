function fnChecarAcesso() {
  const estaLogado = localStorage.getItem("logado");

  if (estaLogado !== "true") {
    alert("Acesso restrito! Por favor, identifique-se.");
    window.location.href = "login.html";
  }
}

fnChecarAcesso();

// 1. Configuração Inicial
document.addEventListener("DOMContentLoaded", () => {
  fnListarUsuarios(); // Agora essa função existe de verdade!

  const form = document.getElementById("formulario_cadUsuario");
  const botaoCadUsuario = document.getElementById("botao_cadUsuario");

  botaoCadUsuario.addEventListener("click", () => {
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    fnCadastrarUsuario();
  });

  const btnSair = document.getElementById("btn-sair");
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      if (confirm("Deseja realmente encerrar sua sessão?")) {
        localStorage.removeItem("logado");
        window.location.href = "login.html";
      }
    });
  }
});

// 2. Função de Cadastrar
function fnCadastrarUsuario() {
  // Pegamos o valor do input de login para usar como Nome e E-mail,
  // já que o backend exige os dois para preencher a tabela rac_usuarios
  const valorLogin = document.getElementById("cadastroNomeUsuario").value;

  let formDadosUsuario = {
    nome: valorLogin,
    email: valorLogin,
    senha: document.getElementById("cadastroSenhaUsuario").value,
    nivel_acesso: document.getElementById("cadastroNivelAcessoUsuario").value,
  };

  fetch("http://localhost:3000/usuario", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(formDadosUsuario),
  })
    .then((resposta) => {
      if (resposta.ok) {
        alert("Usuário cadastrado com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao cadastrar usuário. Verifique se o login já existe.");
      }
    })
    .catch((erro) => alert("Erro ao cadastrar: " + erro.message));
}

// 3. Função de Listar (Restaurada)
function fnListarUsuarios() {
  fetch("http://localhost:3000/usuarios")
    .then((resposta) => resposta.json())
    .then((usuarios) => {
      const corpoTabela = document.querySelector(".corpo_tabelaUsuario");
      corpoTabela.innerHTML = "";
      usuarios.forEach((usuario) => fnMontarLinhaUsuario(usuario));
    });
}

// 4. Função de Montar a Tabela (Visual)
function fnMontarLinhaUsuario(usuario) {
  let linha = `
     <tr>
        <td>${usuario.emailUsu}</td>
        <td>${usuario.nivelAcessoUsu == 1 ? "Admin" : "Operador"}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="fnConfirmarDelecao(${usuario.idUsu})">
                <i class="bi bi-trash"></i> Deletar
            </button>
        </td>
    </tr>`;
  document.querySelector(".corpo_tabelaUsuario").innerHTML += linha;
}

// 5. Função de Deletar
function fnConfirmarDelecao(id) {
  if (confirm("Deseja realmente excluir este usuário?")) {
    fetch(`http://localhost:3000/usuario/${id}`, { method: "DELETE" }).then(
      (res) => {
        if (res.ok) {
          alert("Usuário removido!");
          window.location.reload();
        }
      },
    );
  }
}
