package com.example.coral_ec.user;

import com.example.coral_ec.dto.RegisterRequest;
import com.example.coral_ec.dto.RegisterResponse;
import com.example.coral_ec.exception.EmailAlreadyExistsException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserRegistrationServiceTest {

    @Test
    void register_success() {
        UserRepository repository = mock(UserRepository.class);
        UserRegistrationService service = new UserRegistrationService(repository);

        when(repository.existsByEmailIgnoreCase("test@example.com")).thenReturn(false);
        when(repository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            // simulate DB-generated id in mocked repository response
            java.lang.reflect.Field idField = User.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(user, 1L);
            return user;
        });

        RegisterResponse response = service.register(new RegisterRequest("Taro", "test@example.com", "password123"));

        assertEquals(1L, response.id());
        assertEquals("Taro", response.name());
        assertEquals("test@example.com", response.email());
        assertEquals("user", response.role());
    }

    @Test
    void register_duplicateEmail_throws() {
        UserRepository repository = mock(UserRepository.class);
        UserRegistrationService service = new UserRegistrationService(repository);

        when(repository.existsByEmailIgnoreCase("dup@example.com")).thenReturn(true);

        assertThrows(
                EmailAlreadyExistsException.class,
                () -> service.register(new RegisterRequest("Jiro", "dup@example.com", "password123"))
        );
    }
}
