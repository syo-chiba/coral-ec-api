package com.example.coral_ec.controller;

import com.example.coral_ec.dto.RegisterRequest;
import com.example.coral_ec.dto.RegisterResponse;
import com.example.coral_ec.user.UserRegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
public class AuthController {
	
	private final UserRegistrationService userRegistrationService;
	
	public AuthController(UserRegistrationService userRegistrationService) {
		this.userRegistrationService = userRegistrationService;
	}
	
	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
		return userRegistrationService.register(request);
	}
}
