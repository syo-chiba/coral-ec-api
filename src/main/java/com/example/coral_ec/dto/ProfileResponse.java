package com.example.coral_ec.dto;

import java.time.LocalDateTime;

public record ProfileResponse(
        Long userId,
        String displayName,
        String avatarUrl,
        String bio,
        String location,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}