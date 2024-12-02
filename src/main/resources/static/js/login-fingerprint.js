
const loginForm = document.querySelector('.login');

const isNativeLogin = false;

if(isNativeLogin === false) {
	document.getElementById('login_password').style.display = 'none';
}

async function doFingerPrintLogin() {
	const email = document.getElementById('loginName');
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

	const user = await fetch(`/api/public/user?email=${email.value}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => { return res });

	console.log("user" + user);

	//disabling add button
	this.disabled = true;
	this.classList.add('disabled');



	const options = {
		challenge: Uint8Array.from("randomString", c => c.charCodeAt(0)),
		allowCredentials: [{
			id: Uint8Array.from(
				user.credentialId, c => c.charCodeAt(0)),
			type: 'public-key',
			transports: ['usb', 'ble', 'nfc'],
		}],
		timeout: 60000,
	}

	try {
		const assertion = await navigator.credentials.get(options);
		console.log(assertion);

	} catch (e) {
		console.log(e);
	}
}



async function login(e) {
	e.preventDefault();
	const data = {
		username: this.username.value,
		password: this.password.value,
	};

	document.querySelector("#login_fail").style.display = "none";
	document.querySelector("#login_fail").innerHTML = "";
	document.querySelector('.spinner-grow').classList.remove('hidden');
	document.querySelector('.authentication').style.display = 'none';
	document.querySelector("#login_success").style.display='none';
	const response = await fetch(`/login?username=${data.username}&password=${data.password}`, {
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

	if (response.status === 200) {
		document.querySelector("#login_success").style.display = "block";
		setTimeout(() => {
			location.href = response.url;
		}, 1000);
	} else if (response.status === 401) {
		document.querySelector("#login_fail").style.display = "block";
		document.querySelector("#login_fail").innerHTML = message;
	}

}

loginForm?.addEventListener('submit', doFingerPrintLogin);

