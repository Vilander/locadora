let foto = document.getElementById("fotoVeic");
let btn_salvar = document.getElementById("btn-salvar-veiculo");

function fnAlterarFoto() {
  if (foto.value != "") {
    document.getElementById("fundo-imagem").style.backgroundImage =
      `url('${foto.value}')`;
  } else {
    document.getElementById("fundo-imagem").style.backgroundImage =
      `url('../imagens/renault-kwid.png')`;
  }
}

function fnLimparCampos() {
  document.getElementById("form-veiculos").reset();
  document.getElementById("fundo-imagem").style.backgroundImage =
    `url('../imagens/renault-kwid.png')`;
}

function fnMensagemSalvar() {
  let toastElList = [].slice.call(document.querySelectorAll(".toast"));
  let toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());
}

function fnCadastrarVeiculo() {
  // Ajustado para bater exatamente com as colunas do banco
  let formDados = {
    modeloVei: document.getElementById("modeloVeic").value,
    marcaVei: document.getElementById("marcaVeic").value,
    placaVei: document.getElementById("placaVeic").value,
    diariaVei: document.getElementById("diariaVeic").value,
    idCatVei: document.getElementById("categoriaVeic").value,
    statusVei: "Disponivel",
  };

  fetch("http://localhost:3000/site-locadora/veiculos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formDados),
  })
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error("Erro na resposta da rede");
      }
      return resposta.json();
    })
    .then((dados) => {
      console.log("Inserido com ID:", dados);
      fnLimparCampos();
      fnMensagemSalvar();
    })
    .catch((erro) => console.log("Erro ao cadastrar:", erro.message));
}

foto.addEventListener("blur", function () {
  fnAlterarFoto();
});

btn_salvar.addEventListener("click", () => {
  fnCadastrarVeiculo();
});
