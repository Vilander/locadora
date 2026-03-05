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

// 2. Redireciona para o showroom filtrado pela categoria selecionada
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
  fnIrParaShowroom();
});
