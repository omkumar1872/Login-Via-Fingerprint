
const loginForm = document.querySelector('.login');




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

loginForm?.addEventListener('submit', login);

