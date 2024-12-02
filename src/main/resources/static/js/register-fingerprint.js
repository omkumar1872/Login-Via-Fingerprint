const utf8Decoder = new TextDecoder('utf-8');

const registerForm = document.querySelector('.register');
const addFingerPrintButton = document.getElementById('addFingerPrintButton');
const fingerprintDiv = document.getElementById('fingerprintDiv');
var publicKeyBytesData, credentialIdData, correspondingCredentialId, uuidGenerated;

//This string must be passed as an env variable and also use the same string on server end
const challengeString = 'challengeString';

function uint8ArrayToBase64(uint8Array) {
  return btoa(String.fromCharCode.apply(null, uint8Array));
}

function removeFingerprint(e) {
  e.preventDefault();
  addFingerPrintButton.disabled = false;
  addFingerPrintButton.classList.remove('disabled');
  publicKeyBytesData = null;
  credentialIdData = null;
  correspondingCredentialId = null;
  uuidGenerated = null;
}

function addFingerPrintIdentifierOnUi(id) {
  const div = document.createElement('div');
  const span = document.createElement('span');
  const button = document.createElement('button');

  div.classList.add('d-flex', 'justify-content-between');
  span.classList.add('col-6', 'text-truncate');
  button.classList.add('btn','alert-danger', 'btn-sm', 'py-0', 'px-2');

  span.innerHTML = id;
  span.name = "fingerprint";
  button.id="removeFingerprintButton";
  button.textContent = "x";

  button.addEventListener('click', removeFingerprint);

  div.insertAdjacentElement('beforeend', span);
  div.insertAdjacentElement('beforeend', button);
  fingerprintDiv?.insertAdjacentElement('beforeend', div);
}


async function askForFingerprint() {
  const email = document.getElementById('registerEmail');
  const name = document.getElementById('registerName');
  
  if (!window.PublicKeyCredential) {
    alert('Fingerprint is not supported')
    return;
  }

  if(!name || !name.value) {
    alert('Please enter name');
    return;
  }

  if(!email || !email.value) {
    alert('Please enter email address');
    return;
  }

  //disabling add button
  this.disabled = true;
  this.classList.add('disabled');

  uuidGenerated = self.crypto.randomUUID();

  const options = {
    publicKey: {
      rp: {id: "localhost", name: ""},
      user: {
        id: Uint8Array.from(uuidGenerated, c => c.charCodeAt(0)),
        name: email?.value,
        displayName: name?.value,
      },
      pubKeyCredParams: [{
        type: "public-key", alg: -7,
      }, {
        type: "public-key", alg: -257,
      }],
      timeout: 60000,
      challenge: Uint8Array.from(challengeString, c => c.charCodeAt(0)),
      attestation: "direct"
    }
  }

  try {
    const credential = await navigator.credentials.create(options);
    const decodedClientData = utf8Decoder.decode(credential.response.clientDataJSON);
    // parse the string as an object
    const clientDataObj = JSON.parse(decodedClientData);
    const decodedAttestationObj = CBOR.decode(credential.response.attestationObject);

    const { authData } = decodedAttestationObj;
    const { challenge } = clientDataObj; // this is the challenge we sent to the authenticator we can match it [Optional]

    // get the length of the credential ID
    const dataView = new DataView(new ArrayBuffer(2));
    const idLenBytes = authData.slice(53, 55);

    idLenBytes.forEach((value, index) => dataView.setUint8(index, value));

    const credentialIdLength = dataView.getUint16();

    // get the credential ID
    const credentialId = authData.slice(55, 55 + credentialIdLength);

    // get the public key object
    const publicKeyBytes = authData.slice(55 + credentialIdLength);

    // the publicKeyBytes are encoded again as CBOR
    const publicKeyObject = CBOR.decode(publicKeyBytes.buffer);
    console.log({
      credentialId, publicKeyBytes
    })

    credentialIdData = credentialId;
    publicKeyBytesData = publicKeyBytes;
    correspondingCredentialId = credential.id;
    
    addFingerPrintIdentifierOnUi(credential.id);
  } catch (e) {
    console.log(e);
    this.disabled = false;
    addFingerPrintButton.classList.remove('disabled');
    credentialIdData = null;
    publicKeyBytesData = null;
    correspondingCredentialId = null;
  }
}

async function register(e) {
  e.preventDefault();
  const data = {
    name: this.name.value,
    email: this.email.value,
    password: this.password.value,
    about: this.about.value,
    uuid: uuidGenerated || self.crypto.randomUUID(),
    credentialId: uint8ArrayToBase64(credentialIdData),
    publicKeyBytes: uint8ArrayToBase64(publicKeyBytesData)
  };
  const repeatPassoword = this.repeatPassword.value;
  const agreement = this.agreement.value;

  if(!correspondingCredentialId) {
    alert('Fingerprint is required');
    return;
  }

  if(!credentialIdData  || !publicKeyBytesData) {
    alert('Fingerprint is not saved properly');
    return;
  }

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
      document.forms['register'][msg.name].classList.add('is-invalid');
      document.querySelector('#invalid-' + msg.name).innerHTML = msg.content;
    })
  } else {
    document.querySelector('.register-alert').style.display = 'block';
    document.querySelector('.register-alert').classList.add('alert-danger');
    document.querySelector('.register-alert').textContent = message[0].content;
  }
}

function removeValidation() {
  const attr = ['name', 'email', 'password', 'about'];
  attr.forEach(attr => {
    document.forms['register'][attr].classList.remove('is-invalid');
    document.querySelector('#invalid-' + attr).innerHTML = '';
  })
}

registerForm?.addEventListener('submit', register);
registerForm?.addEventListener('reset', removeValidation);
addFingerPrintButton?.addEventListener('click', askForFingerprint);



