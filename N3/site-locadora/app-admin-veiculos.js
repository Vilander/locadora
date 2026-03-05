function fnMontarLinhaVeiculos(veiculo) {
  const imagem = "https://via.placeholder.com/50?text=Carro";

  const valorDiaria = Number(veiculo.diariaVei).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const linha = `
    <tr>
      <td><img src="${imagem}" class="img-thumbnail" width="60" alt="${veiculo.modeloVei}"></td>
      <td class="align-middle">${veiculo.idVei}</td>
      <td class="align-middle">${veiculo.marcaVei}</td>
      <td class="align-middle">${veiculo.modeloVei}</td>
      <td class="align-middle">${veiculo.placaVei}</td>
      <td class="align-middle"><span class="badge bg-secondary">${veiculo.nomeCat}</span></td>
      <td class="align-middle">${valorDiaria}</td>
      <td class="acoes align-middle">
        <a href="veiculo.html?id=${veiculo.idVei}" class="btn btn-sm btn-outline-info" title="Ver">
            <i class="bi bi-eye"></i>
        </a>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="fnExcluirVeiculo(${veiculo.idVei}, this)" title="Excluir">
            <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `;

  document.querySelector("#lista-veiculos").innerHTML += linha;
}

function fnCarregarDados() {
  fetch("http://localhost:3000/site-locadora/veiculos", {
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
