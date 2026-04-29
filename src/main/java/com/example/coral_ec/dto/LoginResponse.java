package com.example.coral_ec.dto;

public record LoginResponse(
		Long id,
		String name,
		String email,
		String role
) {
}
