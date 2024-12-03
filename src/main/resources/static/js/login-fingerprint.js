
const loginForm = document.querySelector('.login');

const isNativeLogin = false;

if(isNativeLogin === false) {
	document.getElementById('login_password').style.display = 'none';
}

function base64ToUint8Array(base64) {
	return new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));
}

function arrayBufferToBase64(buffer) {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

async function doFingerPrintLogin(e) {
	e.preventDefault();
	const email = document.getElementById('loginName');
	console.log("login fingerprint");
	// const name = document.getElementById('registerName');

	if (!window.PublicKeyCredential) {
		alert('Fingerprint is not supported')
		return;
	}

	// if(!name || !name.value) {
	// 	alert('Please enter name');
	// 	return;
	// }

	if(!email || !email.value) {
		alert('Please enter email address');
		return;
	}
	console.log("get user");
	const responseUser = await fetch(`/api/public/user?email=${encodeURIComponent(email.value)}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => { return res });

	const user = await responseUser.json();
	console.log(user);


	const options = {
		publicKey: {
			rpId:"localhost",
			challenge: Uint8Array.from(self.crypto.randomUUID(), c => c.charCodeAt(0)),
			allowCredentials: [{
				id: new Uint8Array(atob(user.credentialId).split("").map(c => c.charCodeAt(0))),
				type: 'public-key'
			}],
			timeout: 60000,
			userVerification: "required",
      authenticatorSelection: {
        authenticatorAttachment: "platform"
      },
      attestation: "direct"
		}
	}

	console.log(JSON.stringify(options));
	try {
		console.log("assert  ");
		const assertion = await navigator.credentials.get(options);
		console.log("assertion "+assertion);
		await login(assertion);

	} catch (e) {
		console.log(e);
	}
}



async function login(assertion) {
	// e.preventDefault();
	const email = document.getElementById('loginName');
	const data = {
		username: email.value,
		password: '',
		isNativeLogin: false,
		assertionResponse : {
			id: assertion.id,
			rawId: Array.from(new Uint8Array(assertion.rawId)), // Convert to an array
			type: assertion.type,
			response: {
				clientDataJSON: Array.from(new Uint8Array(assertion.response.clientDataJSON)),
				authenticatorData: Array.from(new Uint8Array(assertion.response.authenticatorData)),
				signature: Array.from(new Uint8Array(assertion.response.signature)),
				userHandle: assertion.response.userHandle
					? Array.from(new Uint8Array(assertion.response.userHandle))
					: null
			}
		}
	};

	document.querySelector("#login_fail").style.display = "none";
	document.querySelector("#login_fail").innerHTML = "";
	document.querySelector('.spinner-grow').classList.remove('hidden');
	document.querySelector('.authentication').style.display = 'none';
	document.querySelector("#login_success").style.display='none';
	const response = await fetch(`/api/public/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	}).then(res => { return res });

	const message = await response.text();
	setTimeout(() => {
		document.querySelector('.authentication').style.display = 'block';
		document.querySelector('.spinner-grow').classList.add('hidden');
	}, 1500);

	if (response.status === 200 || response.status === 202) {
		document.querySelector("#login_success").style.display = "block";
		alert("Login Successful");
		console.log("login success");
		// setTimeout(() => {
		// 	location.href = message;
		// }, 1000);
	} else if (response.status === 401) {
		document.querySelector("#login_fail").style.display = "block";
		document.querySelector("#login_fail").innerHTML = message;
	}

}

loginForm?.addEventListener('submit', doFingerPrintLogin);

