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
  fnListarAgendamentos();

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

// 2. Função de Listar
function fnListarAgendamentos() {
  fetch("http://localhost:3000/site-locadora/agendamentos")
    .then((resposta) => resposta.json())
    .then((agendamentos) => {
      const corpoTabela = document.querySelector(".corpo_tabelaAgendamento");
      corpoTabela.innerHTML = "";
      agendamentos.forEach((agendamento) =>
        fnMontarLinhaAgendamento(agendamento),
      );
    });
}

// 3. Função de Montar a Tabela (Visual)
function fnMontarLinhaAgendamento(agendamento) {
  let linha = `
     <tr>
        <td>${agendamento.nome_cliente}</td>
        <td>${agendamento.email_cliente}</td>
        <td>${agendamento.marca} ${agendamento.modelo} (${agendamento.placa})</td>
        <td>${new Date(agendamento.data_reserva).toLocaleDateString("pt-BR")}</td>
        <td class="text-center">
            <button class="btn btn-danger btn-sm" onclick="fnConfirmarCancelamento(${agendamento.id})">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        </td>
    </tr>`;
  document.querySelector(".corpo_tabelaAgendamento").innerHTML += linha;
}

// 4. Função de Cancelar
function fnConfirmarCancelamento(id) {
  if (confirm("Deseja realmente cancelar este agendamento?")) {
    fetch(`http://localhost:3000/site-locadora/agendamento/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        alert("Agendamento cancelado!");
        window.location.reload();
      }
    });
  }
}
