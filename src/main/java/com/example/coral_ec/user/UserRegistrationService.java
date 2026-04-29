package com.example.coral_ec.user;

import com.example.coral_ec.dto.RegisterRequest;
import com.example.coral_ec.dto.RegisterResponse;
import com.example.coral_ec.exception.EmailAlreadyExistsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


public class UserRegistrationService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	public UserRegistrationService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@Transactional
	public RegisterResponse register(RegisterRequest request) {
		if (userRepository.existsByEmailIgnoreCase(request.email())) {
			throw new EmailAlreadyExistsException(request.email());
		}
		
		User user = new User();
		user.setName(request.name().trim());
		user.setEmail(request.email().trim().toLowerCase());
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		user.setRole("user");
		
		User saved = userRepository.save(user);
		
		return new RegisterResponse(
				saved.getId(),
				saved.getName(),
				saved.getEmail(),
				saved.getRole(),
				saved.getCreatedAt()
		);
	}
}
