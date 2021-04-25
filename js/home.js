const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

formSignUp.onsubmit = async (event) => {
  event.preventDefault();
  let message;
  let user = new FormData(formSignUp);
  user = Object.fromEntries(user.entries());

  if (!user.name) message = "Ingresa tu nombre de cuenta";
  else if (!user.email) message = "Ingresa tu cuenta de correo";
  else if (!user.password) message = "Ingresa tu contraseña";
  else if (!user.password2) message = "Ingresa la verificación de tu contraseña";
  else if (user.password !== user.password2) message = "Las contraseñas ingresadas no coinciden";
  if (message) { alert(message); return; }
  delete user.password2;

  try {
    alert("Por favor espera mientras procesamos tu información");

    const result = await axios.post(
      'https://wowlithium.herokuapp.com/api/v1/users',
      { user: user }
    );

    formSignUp.reset();
    alert("Registro Completo");
  }

  catch (error) {
    if (!error.response) alert("Sin comunicación con el servicio de registro de cuentas");
    error.message = error.response.data.data.error;

    if (error.message.includes("Duplicate entry"))
      if (error.message.includes("username"))
        error.message = "Esta cuenta ya ha sido registrada, intenta con otro nombre para tu cuenta";
      else if (error.message.includes("email"))
        error.message = "Esta cuenta de correo ya ha sido registrada, intenta con otra cuenta de correo";

    alert(error.message);
  }
}

formSignIn.onsubmit = async (event) => {
  event.preventDefault();
  let message;
  let login = new FormData(formSignIn);
  login = Object.fromEntries(login.entries());

  if (!login.username) message = "Ingresa tu usuario";
  else if (!login.password) message = "Ingresa tu contraseña";
  if (message) { alert(message); return; }

  try {
    alert("Por favor espera mientras procesamos tu información");

    const result = await axios.post(
      // 'https://wowlithium.herokuapp.com/api/v1/auth',
      'http://localhost:3000/api/v1/auth',
      { login: login }
    );

    if (result?.status == 200) {
      // alert("Credenciales Correctas");
      container.addEventListener('webkitAnimationEnd', (event) => {
        container.style.display = 'none';
      });

      container.style.animationPlayState = 'running';
    }

    else alert("No hay información disponible para procesar");
    formSignIn.reset();
  }

  catch (error) {
    if (!error.response) alert("Sin comunicación con el servicio de autenticación");

    error.message = error.response.data.data.error;
    console.log(error.message);
    alert(error.message);
  }
}