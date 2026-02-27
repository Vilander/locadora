function fnMontarCardProduto(produto) {
  let cartao = `
        <div class="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                <div class="card">
                    <img src="${produto.foto}"
                        class="card-img-top" alt="${produto.nome}">
                    <div class="card-body">
                        <h5 class="card-title">${produto.titulo}</h5>
                        <p class="card-text">${produto.descricao}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 mb-0">R$ ${produto.preco}</span>
                            <div>
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star text-warning"></i>
                                <small class="text-muted">(${produto.avaliacao})</small>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between bg-light">
                        <button class="btn btn-primary btn-sm">Comprar</button>
                        <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-heart"></i></button>
                    </div>
                </div>
            </div>
    `;
  document.querySelector(".lista-produtos").innerHTML += cartao;
}

function fnMontarOrdem(produto) {
  let ordem_produto = `
        <div class="ordenarPor">
            <select onchange="selectOrdem(this.value)" class="form-select" id="sortSelect" aria-label="Default select example">
                <option selected disabled>Ordenar por:</option>
                <option value="produtos.html?categoria=${produto.categoria}&ordem=preco">Preço</option>
                <option value="produtos.html?categoria=${produto.categoria}&ordem=titulo">Título</option>
            </select>
        </div>
    `;
  document.querySelector("#ordemProduto").innerHTML = ordem_produto;
}

function selectOrdem(url) {
  window.location.href = url;
}

function fnCarregarDados() {
  const parametros = new URLSearchParams(window.location.search);
  const existeCategoria = parametros.has("categoria");
  const existeOrdem = parametros.has("ordem");

  let rotaCategoria = "";
  if (existeCategoria) {
    rotaCategoria = parametros.get("categoria") + "/";
  }

  let rotaOrdem = "";
  if (existeOrdem) {
    rotaOrdem = parametros.get("ordem") + "/";
  }

  fetch("http://localhost:3000/produtos/" + rotaCategoria + rotaOrdem, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((produtos) => {
      produtos.forEach((produto) => {
        fnMontarCardProduto(produto);
        fnMontarOrdem(produto);
      });
    })
    .catch((erro) => console.log(erro.message));
}

fnCarregarDados();
