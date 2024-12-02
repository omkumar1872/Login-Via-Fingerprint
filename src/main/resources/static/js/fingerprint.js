if (window.PublicKeyCredential) {
  console.log('supports fingerprint')
  // do your webauthn stuff
} else {
  // wah-wah, back to passwords for you
}
