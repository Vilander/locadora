function fnMontarCardVeiculo(veiculo) {
  const imagem =
    veiculo.fotoVeic !== ""
      ? veiculo.fotoVeic
      : "https://via.placeholder.com/300x200?text=Sem+Foto";

  let cartao = `
        <div class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${imagem}" class="card-img-top" alt="${veiculo.modeloVeic}">
                <div class="card-body">
                    <h5 class="card-title">${veiculo.marcaVeic} ${veiculo.modeloVeic}</h5>
                    <p class="card-text text-muted">
                        <i class="bi bi-tag"></i> Categoria: ${veiculo.categoriaVeic} <br>
                        <i class="bi bi-card-text"></i> Placa: ${veiculo.placaVeic}
                    </p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="h4 text-success mb-0">R$ ${veiculo.diariaVeic}<small class="fs-6 text-muted">/dia</small></span>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between bg-white border-top-0 pb-3">
                    <button class="btn btn-primary w-100">Alugar Agora</button>
                </div>
            </div>
        </div>
    `;

  document.querySelector("#lista-veiculos").innerHTML += cartao;
}

function fnCarregarDados(categoria = "todas") {
  document.querySelector("#lista-veiculos").innerHTML = "";

  let url = "http://localhost:3000/site-locadora/showroom";

  if (categoria !== "todas") {
    url += `?categoria=${categoria}`;
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

fnCarregarDados();
