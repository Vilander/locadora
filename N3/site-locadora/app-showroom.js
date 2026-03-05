function fnMontarCardVeiculo(veiculo) {
  const imagem = "https://via.placeholder.com/300x200?text=Sem+Foto";

  const statusClass =
    veiculo.statusVei === "Disponivel" ? "text-success" : "text-danger";
  const statusText =
    veiculo.statusVei === "Disponivel" ? "Disponível" : "Reservado";

  let cartao = `
        <div  class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
            <div id="cardVeic" class="card h-100 shadow-sm">
                <img src="${imagem}" class="card-img-top" alt="${veiculo.modeloVei}">
                <div class="card-body">
                    <h5 class="card-title">${veiculo.marcaVei} ${veiculo.modeloVei}</h5>
                    <p class="card-text text-muted">
                        <i class="bi bi-tag"></i> Categoria: ${veiculo.nomeCat} <br>
                        <i class="bi bi-card-text"></i> Placa: ${veiculo.placaVei} <br>
                        <i class="bi bi-check-circle"></i> Status: <span class="${statusClass}">${statusText}</span>
                    </p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="h4 text-success mb-0">R$ ${veiculo.diariaVei}<small class="fs-6 text-muted">/dia</small></span>
                    </div>
                    <div class="mt-2">
                        <label>Número de dias:</label>
                        <input type="number" class="form-control dias-input" min="1" value="1" onchange="fnCalcularTotal(this, ${veiculo.diariaVei})">
                        <div class="mt-1">Total: R$ <span class="total-preco">${veiculo.diariaVei}</span></div>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between bg-white border-top-0 pb-3">
                    <button class="btn btn-primary w-100" ${veiculo.statusVei !== "Disponivel" ? "disabled" : ""}>Alugar Agora</button>
                </div>
            </div>
        </div>
    `;

  document.querySelector("#lista-veiculos").innerHTML += cartao;
}

function fnCalcularTotal(input, diaria) {
  const dias = parseInt(input.value) || 1;
  const total = dias * diaria;
  input.parentElement.querySelector(".total-preco").textContent = total;
}

function fnCarregarDados(categoriaId = "todas") {
  document.querySelector("#lista-veiculos").innerHTML = "";

  let url = "http://localhost:3000/site-locadora/showroom";

  // Transforma o ID selecionado no HTML no nome em texto esperado pelo backend
  let categoriaFiltro = "todas";
  if (categoriaId === "1") categoriaFiltro = "Basico";
  if (categoriaId === "2") categoriaFiltro = "Familia";
  if (categoriaId === "3") categoriaFiltro = "Luxo";
  // Caso venha o nome direto do app.js
  if (isNaN(categoriaId) && categoriaId !== "todas")
    categoriaFiltro = categoriaId;

  if (categoriaFiltro !== "todas") {
    url += `?categoria=${categoriaFiltro}`;
  }

  fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((veiculos) => {
      veiculos.forEach((veiculo) => {
        fnMontarCardVeiculo(veiculo);
      });
    })
    .catch((erro) => {
      console.log("Erro na requisição:", erro.message);
      document.querySelector("#lista-veiculos").innerHTML =
        `<div class="alert alert-danger w-100">Não foi possível carregar os veículos.</div>`;
    });
}

function fnFiltrarCategoria(categoria) {
  fnCarregarDados(categoria);
}

function fnObterParametroURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("categoria") || "todas";
}

document.addEventListener("DOMContentLoaded", () => {
  const categoriaParametro = fnObterParametroURL();

  if (categoriaParametro !== "todas" && !isNaN(categoriaParametro)) {
    document.getElementById("categoria-veiculo").value = categoriaParametro;
  }

  fnCarregarDados(categoriaParametro);
});
