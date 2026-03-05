function fnCarregarCategorias() {
  fetch("http://localhost:3000/site-locadora/home")
    .then((resposta) => resposta.json())
    .then((dados) => {
      let select = document.getElementById("veiculo");

      select.innerHTML = '<option value="">Selecione a categoria...</option>';

      dados.forEach((categoria) => {
        // Agora passando o nomeCat como value, pois o seu backend filtra pelo nome
        select.innerHTML += `<option value="${categoria.nomeCat}">${categoria.nomeCat}</option>`;
      });
    })
    .catch((erro) =>
      console.log("Erro ao carregar categorias: " + erro.message),
    );
}

function fnSalvarAgendamento() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const categoria = document.getElementById("veiculo").value;
  const data_reserva = document.getElementById("data_reserva").value;

  if (!nome || !email || !categoria || !data_reserva) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  fetch(`http://localhost:3000/site-locadora/showroom?categoria=${categoria}`)
    .then((res) => res.json())
    .then((veiculos) => {
      // Ajuste para verificar statusVei
      const veiculoDisponivel = veiculos.find(
        (v) => v.statusVei === "Disponivel",
      );
      if (!veiculoDisponivel) {
        alert("Nenhum veículo disponível nesta categoria!");
        return;
      }

      const agendamento = {
        nome_cliente: nome,
        email_cliente: email,
        veiculo_id: veiculoDisponivel.idVei, // Pegando o ID do veículo correto
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

function fnIrParaShowroom() {
  const cat = document.getElementById("veiculo").value;
  if (cat == "") {
    alert("Por favor, selecione uma categoria de veículo!");
    return;
  }
  window.location.href = `showroom.html?categoria=${cat}`;
}

document.addEventListener("DOMContentLoaded", () => {
  fnCarregarCategorias();
});

let btnReservar = document.getElementById("btn-reservar");
if (btnReservar) {
  btnReservar.addEventListener("click", () => {
    fnSalvarAgendamento();
  });
}
