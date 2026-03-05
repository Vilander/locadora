// 1. Configuração de Eventos ao Carregar a Página
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario_login");
  const botaoLogin = document.getElementById("botao_login");

  botaoLogin.addEventListener("click", () => {
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    fnVerificarLogin();
  });
});

// 2. Função de Verificação de Login
function fnVerificarLogin() {
  const formLogin = {
    login: document.getElementById("email_login").value, // Usando como login
    senha: document.getElementById("senha_login").value,
  };

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formLogin),
  })
    .then((resposta) => {
      if (resposta.status === 200) {
        localStorage.setItem("logado", "true");

        alert("Login realizado com sucesso!");
        window.location.href = "usuarios.html";
      } else if (resposta.status === 401) {
        alert("Usuário ou senha incorretos.");
      } else {
        alert("Erro inesperado no servidor. Tente novamente mais tarde.");
      }
    })
    .catch((erro) => {
      console.error("Erro de conexão:", erro.message);
      alert("Não foi possível conectar ao servidor.");
    });
}
