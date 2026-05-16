package com.example.coral_ec.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateItemRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 2000) String description,
        @NotNull @Min(0) Integer price,
        @Size(max = 100) String category,
        @NotBlank String condition
) {
}