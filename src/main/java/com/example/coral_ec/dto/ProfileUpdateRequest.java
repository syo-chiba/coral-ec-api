package com.example.coral_ec.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank @Size(max = 100) String displayName,
        @Size(max = 500) String bio,
        @Size(max = 500) String avatarUrl,
        @Size(max = 100) String location
) {
}