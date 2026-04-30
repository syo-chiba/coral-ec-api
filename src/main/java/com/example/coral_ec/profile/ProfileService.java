package com.example.coral_ec.profile;

import com.example.coral_ec.dto.ProfileResponse;
import com.example.coral_ec.exception.ProfileNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {
	
	private final    ProfileRepository profileRepository;
	
	public ProfileService(ProfileRepository profileRepository) {
		this.profileRepository = profileRepository;
	}
	
	@Transactional(readOnly = true)
	public ProfileResponse getMyProfile(Long userId) {
		Profile profile = profileRepository.findById(userId)
				.orElseThrow(() -> new ProfileNotFoundException(userId));
		
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
}
