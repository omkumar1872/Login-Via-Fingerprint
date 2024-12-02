package com.login.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "user")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
    @NotBlank(message = "Please provide a name")
	@NotNull(message = "Name can't be NULL")
	@Size(min=2, max=20, message = "Name should be in between 2 to 20 characters")
	private String name;
	@Column(unique = true)
	@Email(message="Should be a valid email format")
	@NotNull(message = "Email can't be null")
	@NotBlank(message="Please provide a email")
	private String email;
	@NotNull(message = "Password can't be null")
	@NotBlank(message="Please provide a password")
	@Size(min=8, message = "Password should be of minimum 8 characters")
	private String password;
	private String role;
	private boolean enabled;
	private String imageURl;
	@Column(length = 500)
	private String about;

	public User() {
		super();
		// TODO Auto-generated constructor stub
	}

	public User(int id,
			@NotBlank(message = "Please provide a name") @NotNull(message = "Name can't be NULL") @Size(min = 2, max = 20, message = "Name should be in between 2 to 20 characters") String name,
			@Email(message = "Should be a valid email format") @NotNull(message = "Email can't be null") @NotBlank(message = "Please provide a email") String email,
			@NotNull(message = "Password can't be null") @NotBlank(message = "Please provide a password") @Size(min = 8, max = 20, message = "Password should be in between 8 to 20 characters") String password,
			String role, boolean enabled, String imageURl, String about) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.role = role;
		this.enabled = enabled;
		this.imageURl = imageURl;
		this.about = about;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public String getImageURl() {
		return imageURl;
	}

	public void setImageURl(String imageURl) {
		this.imageURl = imageURl;
	}

	public String getAbout() {
		return about;
	}

	public void setAbout(String about) {
		this.about = about;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", role=" + role
				+ ", enabled=" + enabled + ", imageURl=" + imageURl + ", about=" + about
				+ "]";
	}
}
