function fnMontarLinhaVeiculos(veiculo) {
  const imagem = "https://via.placeholder.com/50?text=Carro";

  const valorDiaria = Number(veiculo.valor_diaria).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const linha = `
    <tr>
      <td><img src="${imagem}" class="img-thumbnail" width="60" alt="${veiculo.modelo}"></td>
      <td class="align-middle">${veiculo.id}</td>
      <td class="align-middle">${veiculo.marca}</td>
      <td class="align-middle">${veiculo.modelo}</td>
      <td class="align-middle">${veiculo.placa}</td>
      <td class="align-middle"><span class="badge bg-secondary">${veiculo.categoria}</span></td>
      <td class="align-middle">${valorDiaria}</td>
      <td class="acoes align-middle">
        <a href="veiculo.html?id=${veiculo.id}" class="btn btn-sm btn-outline-info" title="Ver">
            <i class="bi bi-eye"></i>
        </a>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="fnExcluirVeiculo(${veiculo.id}, this)" title="Excluir">
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
