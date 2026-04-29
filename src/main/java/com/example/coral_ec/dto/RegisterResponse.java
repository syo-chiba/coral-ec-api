package com.example.coral_ec.dto;

import java.time.LocalDateTime;

public record RegisterResponse(
		Long id,
		String name,
		String email,
		String role,
		LocalDateTime createdAt
) {
}
