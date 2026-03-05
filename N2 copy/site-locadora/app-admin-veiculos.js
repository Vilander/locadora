function fnMontarLinhaVeiculos(veiculo) {
  const imagem =
    veiculo.fotoVeic !== ""
      ? veiculo.fotoVeic
      : "https://via.placeholder.com/50?text=Carro";

  const valorDiaria = Number(veiculo.diariaVeic).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const linha = `
    <tr>
      <td><img src="${imagem}" class="img-thumbnail" width="60" alt="${veiculo.modeloVeic}"></td>
      <td class="align-middle">${veiculo.idVeic}</td>
      <td class="align-middle">${veiculo.marcaVeic}</td>
      <td class="align-middle">${veiculo.modeloVeic}</td>
      <td class="align-middle">${veiculo.placaVeic}</td>
      <td class="align-middle"><span class="badge bg-secondary">${veiculo.categoriaVeic}</span></td>
      <td class="align-middle">${valorDiaria}</td>
      <td class="acoes align-middle">
        <a href="veiculo.html?id=${veiculo.idVeic}" class="btn btn-sm btn-outline-info" title="Ver">
            <i class="bi bi-eye"></i>
        </a>
        <a href="editar-veiculo.html?id=${veiculo.idVeic}" class="btn btn-sm btn-outline-warning" title="Editar">
            <i class="bi bi-pencil"></i>
        </a>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="fnExcluirVeiculo(${veiculo.idVeic}, this)" title="Excluir">
            <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `;

  document.querySelector("#lista-veiculos").innerHTML += linha;
}

function fnCarregarDados() {
  // ATENÇÃO: Verifique se essa é a rota correta no seu Node.js (index.js) que faz o SELECT * FROM rac_veiculos
  fetch("http://localhost:3000/site-locadora/showroom", {
    method: "GET",
  })
    .then((resposta) => resposta.json())
    .then((veiculos) => {
      document.querySelector("#lista-veiculos").innerHTML = "";

      veiculos.forEach((veiculo) => {
        fnMontarLinhaVeiculos(veiculo);
      });
    })
    .catch((erro) => console.log("Erro na requisição:", erro.message));
}

fnCarregarDados();
