package com.example.coral_ec.dto;

import java.time.LocalDateTime;

public record ItemResponse(
        Long id,
        Long sellerId,
        String title,
        String description,
        Integer price,
        String category,
        String condition,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}