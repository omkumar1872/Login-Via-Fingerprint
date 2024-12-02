// if (window.PublicKeyCredential) {
//   console.log('supports fingerprint')
//   // do your webauthn stuff
// } else {
//   // wah-wah, back to passwords for you
// }
//
// const addFingerPrintButton = document.getElementById('addFingerPrintButton');
//
// addFingerPrintButton.addEventListener('click', async () => {
//   console.log('Inside addFingerPrintButton event listener');
//   const data = await navigator.credentials.create(options);
//   console.log(data);
// });
const registerForm = document.querySelector('.register');

const addFingerPrintButton = document.getElementById('addFingerPrintButton');

addFingerPrintButton.addEventListener('click', async () => {
  console.log('Inside addFingerPrintButton event listener');
  const options = {
    publicKey: {
      rp: { id: "localhost" , name: ""},
      user: {
        id: new Uint8Array(16),
        name: "carina.p.anand@example.com",
        displayName: "Carina P. Anand",
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7,
        },
        {
          type: "public-key",
          alg: -257,
        }
      ],
      timeout: 60000,
      challenge: new Uint8Array([
        // must be a cryptographically random number sent from a server
        0x8c, 0x0a, 0x26, 0xff, 0x22, 0x91, 0xc1, 0xe9, 0xb9, 0x4e, 0x2e, 0x17, 0x1a,
        0x98, 0x6a, 0x73, 0x71, 0x9d, 0x43, 0x48, 0xd5, 0xa7, 0x6a, 0x15, 0x7e, 0x38,
        0x94, 0x52, 0x77, 0x97, 0x0f, 0xef,
      ]).buffer,
      authenticatorSelection: {}
    }
  };

  const data = await navigator.credentials.create(options);
  console.log(data);
});

async function loginFingerprint(e) {
  e.preventDefault();
  const data = {
    name: this.name.value,
    email: this.email.value,
    password: this.password.value,
    about: this.about.value
  };
  const repeatPassoword = this.repeatPassword.value;
  const agreement = this.agreement.value;
  removeValidation();
  document.querySelector('.authentication').style.display = 'none';
  document.querySelector('.register-alert').style.display = 'none';
  document.querySelector('.spinner-grow').classList.remove('hidden');
  const response = await fetch('/api/public/register?repeatPassword=' + repeatPassoword + '&agreement=' + agreement, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(res => { return res });
  console.log(response);
  const message = await response.json();


  setTimeout(() => {
    document.querySelector('.authentication').style.display = 'block';
    document.querySelector('.spinner-grow').classList.add('hidden');
  }, 1500);



  if (response.status >= 301 || response.status <= 399) {
    document.querySelector('.register-alert').style.display = 'block';
    document.querySelector('.register-alert').classList.add('alert-success');
    document.querySelector('.register-alert').textContent = "Registered Succesfully :)";
    setTimeout(() => { location.href = message[0].content }, 1000);
  } else if (response.status === 416) {
    document.querySelector('.register-alert').style.display = 'block';
    document.querySelector('.register-alert').classList.add('alert-warning');
    document.querySelector('.register-alert').textContent = message[0].content;
  } else if (response.status === 400) {
    message.forEach(msg => {
      document.forms['loginFingerprint'][msg.name].classList.add('is-invalid');
      document.querySelector('#invalid-' + msg.name).innerHTML = msg.content;
    })
  } else {
    document.querySelector('.register-alert').style.display = 'block';
    document.querySelector('.register-alert').classList.add('alert-danger');
    document.querySelector('.register-alert').textContent = message[0].content;
  }
}

registerForm?.addEventListener('submit', loginFingerprint);
registerForm?.addEventListener('reset', removeValidation);



