// 1. Busca os veículos no banco e preenche o <select>
function fnCarregarVeiculos() {
  fetch("http://localhost:3000/site-locadora/home")
    .then((resposta) => resposta.json())
    .then((dados) => {
      let select = document.getElementById("veiculo");

      select.innerHTML = '<option value="">Selecione o veículo...</option>';

      dados.forEach((veiculo) => {
        select.innerHTML += `<option value="${veiculo.idVeic}">${veiculo.categoriaVeic} - ${veiculo.modeloVeic}</option>`;
      });
    })
    .catch((erro) => console.log("Erro ao carregar veículos: " + erro.message));
}

function fnFazerReserva() {
  let formDados = {
    clienteAg: document.getElementById("nome").value,
    emailAg: document.getElementById("email").value,
    veiculoAg: document.getElementById("veiculo").value,
  };

  if (
    formDados.clienteAg == "" ||
    formDados.emailAg == "" ||
    formDados.veiculoAg == ""
  ) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  fetch("http://localhost:3000/site-locadora/agendamento/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formDados),
  })
    .then((resposta) => resposta.json())
    .then((dados) => {
      alert("Reserva realizada com sucesso!");
      document.getElementById("form-agendamento").reset(); // Limpa o formulário
    })
    .catch((erro) => console.log("Erro ao salvar: " + erro.message));
}

document.addEventListener("DOMContentLoaded", () => {
  fnCarregarVeiculos();
});

let btnReservar = document.getElementById("btn-reservar");
btnReservar.addEventListener("click", () => {
  fnFazerReserva();
});
