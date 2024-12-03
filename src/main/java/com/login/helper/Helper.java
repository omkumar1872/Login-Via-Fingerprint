package com.login.helper;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.cbor.CBORFactory;

public class Helper {
	public static byte[] base64ToByteArray(String base64) {
		return Base64.getDecoder().decode(base64);
	}

	public static  boolean verifySignature(PublicKey publicKey, byte[] signature, byte[] data) throws Exception {
		Signature sig = Signature.getInstance("SHA256withRSA");
		sig.initVerify(publicKey);
		sig.update(data);
		return sig.verify(signature);
	}

	public static PublicKey getPublicKeyFromBase64(String publicKeyBase64) throws Exception {
		byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyBase64);
		CBORFactory cborFactory = new CBORFactory();
		ObjectMapper objectMapper = new ObjectMapper(cborFactory);
		Map<String, Object> coseKey = objectMapper.readValue(publicKeyBytes, Map.class);

		byte[] x509EncodedKey = (byte[]) coseKey.get("x5c");
		X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		return keyFactory.generatePublic(keySpec);
	}
}
