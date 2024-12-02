package com.login.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.login.configuration.CustomUserDetails;
import com.login.entities.User;


@Controller
public class HomeController {

	@GetMapping("/api/home")
	public String getHomePage(Model model) {
		model.addAttribute("title", "Home Page");
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userDetails = authentication.getPrincipal().toString();

		if (!userDetails.matches("anonymousUser")) {
			CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
			model.addAttribute("user", customUserDetails);
		} else {
			model.addAttribute("user", new User());
		}
		return "home";
	}

	@GetMapping("/api/user/index")
	public String getUserIndexPage(Model model) {
		model.addAttribute("msg", "This is user");
		return "/user/index";
	}

	@GetMapping("/api/admin/index")
	public String getAdminIndexPage(Model model) {
		model.addAttribute("msg", "This is admin");
		return "/user/index";
	}

	@GetMapping("/api/login")
	public String getLoginPage() {
		return "login";
	}

}
