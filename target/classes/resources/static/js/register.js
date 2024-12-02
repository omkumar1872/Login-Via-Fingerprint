const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');


async function register(e) {
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
			document.forms['register'][msg.name].classList.add('is-invalid');
			document.querySelector('#invalid-' + msg.name).innerHTML = msg.content;
		})
	} else {
		document.querySelector('.register-alert').style.display = 'block';
		document.querySelector('.register-alert').classList.add('alert-danger');
		document.querySelector('.register-alert').textContent = message[0].content;
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

function removeValidation() {
	const attr = ['name', 'email', 'password', 'about'];
	attr.forEach(attr => {
		document.forms['register'][attr].classList.remove('is-invalid');
		document.querySelector('#invalid-' + attr).innerHTML = '';
	})
}

registerForm.addEventListener('submit', register);
loginForm.addEventListener('submit', login);

registerForm.addEventListener('reset', removeValidation);