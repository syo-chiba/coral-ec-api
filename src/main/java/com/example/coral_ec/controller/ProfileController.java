package com.example.coral_ec.controller;

import com.example.coral_ec.dto.ProfileResponse;
import com.example.coral_ec.dto.ProfileUpdateRequest;
import com.example.coral_ec.profile.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ProfileResponse me() {
        // Step D: 認証連携前のため固定
        return profileService.getMyProfile(1L);
    }

    @PutMapping("/me")
    public ProfileResponse updateMe(@Valid @RequestBody ProfileUpdateRequest request) {
        // Step D: 認証連携前のため固定
        return profileService.updateMyProfile(1L, request);
    }
}