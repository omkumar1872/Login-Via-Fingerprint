package com.login.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

//	User Authentication Configuration
	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public UserDetailsService userDetailService() {
		return new UserDetailsServiceImpl();
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
		daoAuthenticationProvider.setUserDetailsService(this.userDetailService());
		daoAuthenticationProvider.setPasswordEncoder(this.encoder());

		return daoAuthenticationProvider;
	}

//	User Authentication end

//	END Points Security
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

		httpSecurity.csrf(csrf -> csrf.disable()).authorizeHttpRequests(authHttpRequests -> {
			authHttpRequests.requestMatchers("/api/admin/**").hasRole("ADMIN")
							.requestMatchers("/api/user/**").hasRole("USER") //Automatically adds ROLE_ :: O/P: ROLE_USER
							.requestMatchers("/**").permitAll()
							.anyRequest().authenticated();
			}).formLogin(login -> {
				login.loginPage("/api/login")
				.loginProcessingUrl("/login")
				.defaultSuccessUrl("/api/user/index", true)
				.failureUrl("/api/public/login_fail")
				.permitAll();
			});

		httpSecurity.authenticationProvider(authenticationProvider()); //DaoAuthenticationProvider
		return httpSecurity.build();
	}
}
