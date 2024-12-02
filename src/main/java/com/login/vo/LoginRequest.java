package com.login.vo;

import java.util.List;

public class LoginRequest {
	private String username;
	private String password;
	private boolean isNativeLogin;
	private AssertionResponse assertionResponse;

	// Getters and Setters
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isNativeLogin() {
		return isNativeLogin;
	}

	public void setNativeLogin(boolean nativeLogin) {
		isNativeLogin = nativeLogin;
	}

	public AssertionResponse getAssertionResponse() {
		return assertionResponse;
	}

	public void setAssertionResponse(AssertionResponse assertionResponse) {
		this.assertionResponse = assertionResponse;
	}

	// Inner class for AssertionResponse
	public static class AssertionResponse {
		private String id;
		private List<Integer> rawId;
		private String type;
		private Response response;

		// Getters and Setters
		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public List<Integer> getRawId() {
			return rawId;
		}

		public void setRawId(List<Integer> rawId) {
			this.rawId = rawId;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public Response getResponse() {
			return response;
		}

		public void setResponse(Response response) {
			this.response = response;
		}

		// Inner class for Response
		public static class Response {
			private List<Integer> clientDataJSON;
			private List<Integer> authenticatorData;
			private List<Integer> signature;
			private List<Integer> userHandle;

			// Getters and Setters
			public List<Integer> getClientDataJSON() {
				return clientDataJSON;
			}

			public void setClientDataJSON(List<Integer> clientDataJSON) {
				this.clientDataJSON = clientDataJSON;
			}

			public List<Integer> getAuthenticatorData() {
				return authenticatorData;
			}

			public void setAuthenticatorData(List<Integer> authenticatorData) {
				this.authenticatorData = authenticatorData;
			}

			public List<Integer> getSignature() {
				return signature;
			}

			public void setSignature(List<Integer> signature) {
				this.signature = signature;
			}

			public List<Integer> getUserHandle() {
				return userHandle;
			}

			public void setUserHandle(List<Integer> userHandle) {
				this.userHandle = userHandle;
			}
		}
	}
}

