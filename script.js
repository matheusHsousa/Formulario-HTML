var dataAtual = new Date().toISOString().slice(0, 10);
document.getElementById("dataAtual").value = dataAtual;

var numeroAleatorio = Math.floor(Math.random() * 1e16)
  .toString()
  .padStart(16, "0");
document.getElementById("numero").value = numeroAleatorio;

//Consumir API

function pegarDados() {
  var cpf = document.getElementById("personCPF").value;
  const personName = document.getElementById("name").value;
  const dataNasc = document.getElementById("dataNascimento").value;
  const genero = document.getElementById("genero").value;
  const email = document.getElementById("email").value;

  const data = {
    cpf: cpf,
    personName: personName,
    dataNasc: dataNasc,
    genero: genero,
    email: email,
  };

  return data;
}


function cadastrarDados() {
  const dados = pegarDados();
  console.log(dados)

  fetch('https://api.github.com/users/octocat', {
    method: 'POST',
    body: JSON.stringify(dados),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Erro ao fazer a solicitação.');
    }
  })
    .then((dados) => {
      console.log(dados);
    })
    .catch((error) => {
      console.error(error);
      showToast("Deu merda!");
    });
}

//tabela

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

function showTab(tabIndex) {
  tabButtons.forEach((button) => button.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));

  tabButtons[tabIndex].classList.add("active");
  tabContents[tabIndex].classList.add("active");
}

tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    showTab(index);
  });
});

showTab(0);

//CEP

const cepInput = document.getElementById("cep");
const ruaInput = document.getElementById("rua");
const bairroInput = document.getElementById("bairro");
const estadoInput = document.getElementById("estado");
const municipioInput = document.getElementById("municipio");

cepInput.addEventListener("blur", () => {
  const cep = cepInput.value.replace(/\D/g, "");
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((response) => response.json())
    .then((data) => {
      ruaInput.value = data.logradouro;
      bairroInput.value = data.bairro;
      estadoInput.value = data.uf;
      municipioInput.value = data.localidade;
    })
    .catch((error) => {
      console.error(error);
    });
});

//validar cpf

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf == "") return false;
  // Elimina CPFs invalidos conhecidos
  if (
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  )
    return false;
  // Valida 1o digito
  add = 0;
  for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(9))) return false;
  // Valida 2o digito
  add = 0;
  for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(10))) return false;
  return true;
}

const cpfInput = document.getElementById("cpf");
const cpfError = document.getElementById("cpf-error");

cpfInput.addEventListener("blur", () => {
  const cpfValue = cpfInput.value;
  if (validarCPF(cpfValue)) {
    cpfError.textContent = "";
  } else {
    alert("CPF INVALIDO");
  }
});

//arrumar CPF

function formatarCPF(cpf) {
  const cpfRegex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
  return cpf.replace(cpfRegex, "$1.$2.$3-$4");
}

//calcula nascimento

var inputIdade = document.getElementById("idade");

inputIdade.addEventListener("blur", function () {
  var idade = inputIdade.value;
  if (idade < 18 && idade > 0) {
    showToast("Menor de idade!");
    inputIdade.disabled = true;
  } else if (idade <= 0) {
    showToast("Idade invalida!");
  }
});

function showToast(message) {
  var toast = document.createElement("div");
  toast.className = "toast-bar";

  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
  }, 100);
}
