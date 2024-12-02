package com.login.controller;

import java.security.Signature;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import com.login.vo.LoginRequest;
import com.login.vo.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.login.entities.User;
import com.login.helper.Message;
import com.login.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/api/public")
public class AuthController{

	private static final Logger log = LoggerFactory.getLogger(AuthController.class);
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/register")
	public ResponseEntity<List<Message>> register(@RequestBody @Valid User user, BindingResult bindingResult, @RequestParam(value = "agreement", defaultValue = "false") boolean agreement, @RequestParam(value = "repeatPassword") String repeatPassword, HttpServletResponse response, HttpServletRequest request, Model model) {
		
		System.out.println("register() method Called");
		System.out.println("Request Register User : "+ user.toString());
		
		List<Message> msgList = new ArrayList<Message>();
		if (bindingResult.hasErrors()) {
			// Handle validation errors
			List<FieldError> errors = bindingResult.getFieldErrors();
			errors.forEach(error -> {
				msgList.add(new Message(error.getField(), error.getDefaultMessage()));
			});
			return ResponseEntity.badRequest().body(msgList);
		}
		try {
			if (!agreement) {
				throw new Exception("Please agree to terms and conditions");
			} else if (!repeatPassword.matches(user.getPassword())) {
				throw new Exception("Repeated Password does not match");
			} else if (userRepository.findByEmail(user.getEmail()) != null) {
				throw new Exception("Email Already Registered");
			} else {
				try {
					user.setEnabled(true);
					user.setRole("ROLE_USER");
					user.setImageURl("/img/default.png");
					user.setPassword(passwordEncoder.encode(user.getPassword()));
					
					User result = userRepository.save(user);
					System.out.println("New User Registered:" + result.toString());
					request.login(user.getEmail(), repeatPassword);
					msgList.add(new Message("default", "/api/user/index"));
					return new ResponseEntity<List<Message>>(msgList, HttpStatus.PERMANENT_REDIRECT);

				} catch (Exception e1) {
					// TODO: handle exception
					System.err.println("Error: "+e1.getMessage());
					e1.printStackTrace();
					msgList.add(new Message("default", e1.getMessage()));
					return new ResponseEntity<List<Message>>(msgList, HttpStatus.NOT_ACCEPTABLE);
				}
			}
		} catch (Exception e2) {
			// TODO: handle exception
			System.err.println("Error: "+e2.getMessage());
			e2.printStackTrace();
			if (e2.getMessage().equals("Email Already Registered")) {
				msgList.add(new Message("email", e2.getMessage()));
				return new ResponseEntity<List<Message>>(msgList, HttpStatus.BAD_REQUEST);
			} else {
				msgList.add(new Message("default", e2.getMessage()));
				return new ResponseEntity<List<Message>>(msgList, HttpStatus.NOT_ACCEPTABLE);
			}
		}
	}
	
	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest , @RequestParam(value = "agreement", defaultValue = "false") boolean rememberMe, Model model) {
		List<Message> msgList = new ArrayList<Message>();

		if(loginRequest.getUsername() == null || loginRequest.getUsername().isEmpty())
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		try {
			User result = userRepository.findByEmail(loginRequest.getUsername());
			if (result == null) {
				throw new Exception("User Not Found");
			}

			if(!result.getCredentialId().contains(loginRequest.getAssertionResponse().getId())) {
				throw new Exception("Invalid Password");
			}

			// TODO Verify signature


		} catch (Exception e2) {
			// TODO: handle exception
			System.err.println("Error: "+e2.getMessage());
			e2.printStackTrace();
			if (e2.getMessage().equals("Email Already Registered")) {
				msgList.add(new Message("email", e2.getMessage()));
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			} else {
				msgList.add(new Message("default", e2.getMessage()));
				return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
			}
		}
		return new ResponseEntity<String>("/api/user/index",HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/login_fail")
	public String loginFail(HttpServletResponse response) {
		response.setStatus(401);
		return "login_fail";
	}

	@GetMapping("/user")
	public ResponseEntity<UserInfo> getUser(@RequestParam("email") String email) {
		User user = userRepository.findByEmail(email);

		log.info("email: "+email);
		if(user == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		UserInfo userInfo = new UserInfo();
		userInfo.setName(user.getName());
		userInfo.setEmail(user.getEmail());
		userInfo.setCredentialId(user.getCredentialIdUint8Array(user.getCredentialId()));
		userInfo.setRole(user.getRole());
		userInfo.setEnabled(user.isEnabled());
		userInfo.setImageURl(user.getImageURl());
		userInfo.setAbout(user.getAbout());
		return new ResponseEntity<>(userInfo, HttpStatus.OK);
	}
}
