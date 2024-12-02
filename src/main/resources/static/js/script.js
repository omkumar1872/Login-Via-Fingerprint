console.log('hi from script .js ')
if (window.PublicKeyCredential) {
	console.log('supports fingerprint')
	// do your webauthn stuff
} else {
	// wah-wah, back to passwords for you
	console.log('does not support fingerprint')
}


const myModal = document.getElementById('myModal')

$(document).ready(function() {
	$("#myModal").modal('show');
});
