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
  // Volta a imagem de fundo para a padrão após limpar o form
  document.getElementById("fundo-imagem").style.backgroundImage =
    `url('../imagens/renault-kwid.png')`;
}

//========================toast===================================//

function fnMensagemSalvar() {
  let toastElList = [].slice.call(document.querySelectorAll(".toast"));
  let toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());
}

//===================////===================////===================//

function fnCadastrarVeiculo() {
  let formDados = {
    modeloVeic: document.getElementById("modeloVeic").value,
    marcaVeic: document.getElementById("marcaVeic").value,
    placaVeic: document.getElementById("placaVeic").value,
    diariaVeic: document.getElementById("diariaVeic").value,
    categoriaVeic: document.getElementById("categoriaVeic").value,
    fotoVeic: document.getElementById("fotoVeic").value,
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
