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
  fnCarregarRelatorio();

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

// 2. Função de Carregar Relatório
function fnCarregarRelatorio() {
  fetch("http://localhost:3000/site-locadora/relatorio")
    .then((resposta) => resposta.json())
    .then((dados) => {
      const corpoTabela = document.querySelector(".corpo_relatorio");
      corpoTabela.innerHTML = "";
      dados.forEach((item) => fnMontarLinhaRelatorio(item));
    });
}

// 3. Função de Montar a Tabela
function fnMontarLinhaRelatorio(item) {
  let linha = `
     <tr>
        <td>${item.categoria}</td>
        <td>${item.total_reservas}</td>
    </tr>`;
  document.querySelector(".corpo_relatorio").innerHTML += linha;
}
