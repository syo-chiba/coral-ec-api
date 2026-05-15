package com.example.coral_ec.profile;

import com.example.coral_ec.dto.ProfileResponse;
import com.example.coral_ec.dto.ProfileUpdateRequest;
import com.example.coral_ec.exception.ProfileNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile(Long userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ProfileNotFoundException(userId));

        return toResponse(profile);
    }

    @Transactional
    public ProfileResponse updateMyProfile(Long userId, ProfileUpdateRequest request) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ProfileNotFoundException(userId));

        profile.setDisplayName(request.displayName().trim());
        profile.setBio(nullableTrim(request.bio()));
        profile.setAvatarUrl(nullableTrim(request.avatarUrl()));
        profile.setLocation(nullableTrim(request.location()));

        Profile saved = profileRepository.save(profile);
        return toResponse(saved);
    }

    private ProfileResponse toResponse(Profile profile) {
        return new ProfileResponse(
                profile.getUserId(),
                profile.getDisplayName(),
                profile.getAvatarUrl(),
                profile.getBio(),
                profile.getLocation(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }

    private String nullableTrim(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}