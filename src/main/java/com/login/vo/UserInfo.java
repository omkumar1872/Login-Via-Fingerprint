package com.login.vo;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserInfo {
	private String name;
	private String email;
	private byte[] credentialId;
	private String role;
	private boolean enabled;
	private String imageURl;
	private String about;

	public String getName() {
		return name;
	}

	public String getEmail() {
		return email;
	}

	public byte[] getCredentialId() {
		return credentialId;
	}

	public String getRole() {
		return role;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public String getImageURl() {
		return imageURl;
	}

	public String getAbout() {
		return about;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setCredentialId(byte[] credentialId) {
		this.credentialId = credentialId;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public void setImageURl(String imageURl) {
		this.imageURl = imageURl;
	}

	public void setAbout(String about) {
		this.about = about;
	}
}

