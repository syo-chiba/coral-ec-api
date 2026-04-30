package com.example.coral_ec.controller;

import com.example.coral_ec.dto.ProfileResponse;
import com.example.coral_ec.profile.ProfileService;
import org.springframework.web.bind.annotation.GetMapping;
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
        // Step D-1: 認証連携前のため固定ユーザーID
        return profileService.getMyProfile(1L);
    }
}