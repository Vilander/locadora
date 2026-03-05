document
  .getElementById("btn-finalizar-cadastro")
  .addEventListener("click", () => {
    const form = document.getElementById("formulario_autoCadastro");

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const dados = {
      nome: document.getElementById("cad_nome").value,
      email: document.getElementById("cad_email").value,
      senha: document.getElementById("cad_senha").value,
      nivel_acesso: 3, // Backend espera nivel_acesso
    };

    fetch("http://localhost:3000/usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
      .then((res) => {
        if (res.ok) {
          alert("Cadastro realizado! Agora você pode fazer login.");
          window.location.href = "login.html";
        }
      })
      .catch((err) => alert("Erro ao cadastrar: " + err.message));
  });
