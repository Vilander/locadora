// 1. Busca as categorias no banco e preenche o <select>
function fnCarregarCategorias() {
  fetch("http://localhost:3000/site-locadora/home")
    .then((resposta) => resposta.json())
    .then((dados) => {
      let select = document.getElementById("veiculo");

      select.innerHTML = '<option value="">Selecione a categoria...</option>';

      dados.forEach((categoria) => {
        select.innerHTML += `<option value="${categoria.idCat}">${categoria.nomeCat}</option>`;
      });
    })
    .catch((erro) =>
      console.log("Erro ao carregar categorias: " + erro.message),
    );
}

// 2. Função para salvar agendamento
function fnSalvarAgendamento() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const categoria = document.getElementById("veiculo").value;
  const data_reserva = document.getElementById("data_reserva").value;

  if (!nome || !email || !categoria || !data_reserva) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Primeiro, buscar um veículo disponível da categoria selecionada
  fetch(`http://localhost:3000/site-locadora/showroom?categoria=${categoria}`)
    .then((res) => res.json())
    .then((veiculos) => {
      const veiculoDisponivel = veiculos.find((v) => v.status === "Disponível");
      if (!veiculoDisponivel) {
        alert("Nenhum veículo disponível nesta categoria!");
        return;
      }

      const agendamento = {
        nome_cliente: nome,
        email_cliente: email,
        veiculo_id: veiculoDisponivel.id,
        data_reserva: data_reserva,
      };

      fetch("http://localhost:3000/site-locadora/agendamento/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamento),
      })
        .then((res) => {
          if (res.status === 409) {
            return res.json().then((data) => {
              throw new Error(data.erro);
            });
          }
          return res.text();
        })
        .then((resultado) => {
          alert("Agendamento realizado com sucesso!");
          // Redirecionar para showroom
          window.location.href = `showroom.html?categoria=${categoria}`;
        })
        .catch((erro) => {
          alert("Erro: " + erro.message);
        });
    })
    .catch((erro) => {
      console.log("Erro ao buscar veículos:", erro);
    });
}

// 3. Redireciona para o showroom filtrado pela categoria selecionada (para consultar sem agendar)
function fnIrParaShowroom() {
  const idCat = document.getElementById("veiculo").value;

  if (idCat == "") {
    alert("Por favor, selecione uma categoria de veículo!");
    return;
  }

  // Redireciona para o showroom com o parametro de categoria
  window.location.href = `showroom.html?categoria=${idCat}`;
}

document.addEventListener("DOMContentLoaded", () => {
  fnCarregarCategorias();
});

let btnReservar = document.getElementById("btn-reservar");
btnReservar.addEventListener("click", () => {
  fnSalvarAgendamento();
});
