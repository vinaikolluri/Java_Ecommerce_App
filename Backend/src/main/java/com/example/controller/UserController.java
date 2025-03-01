package com.example.controller;



import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.UpdateUserDTO;
import com.example.dto.UserLoginRequest;
import com.example.dto.UserLoginResponseJWT;
import com.example.entity.User;
import com.example.service.EmailService;
import com.example.service.UserService;

import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private EmailService emailservice;
    
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    @PostMapping("/login")
	public ResponseEntity<UserLoginResponseJWT> login(@RequestBody UserLoginRequest userLoginRequest) {
		return userService.login(userLoginRequest);
	}

 // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "User registered successfully.",
                    "user", registeredUser
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to register user.",
                    "error", e.getMessage()
            ));
        }
    }

    // Update user details
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO updateUserDTO) {
        try {
            // Fetch the existing user to preserve the password if not provided
            User existingUser = userService.getUserById(id);

            // If the password is unchanged, we keep it intact
            String existingPassword = existingUser.getPassword();
            
            // Update the user with the non-sensitive fields from UpdateUserDTO
            existingUser.setFirstName(updateUserDTO.getFirstName());
            existingUser.setLastName(updateUserDTO.getLastName());
            
            // Set the existing password to ensure it doesn't change
            existingUser.setPassword(existingPassword);

            // Save the updated user
            User updatedUser = userService.updateUser(id, existingUser);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "User updated successfully.",
                    "user", updatedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to update user.",
                    "error", e.getMessage()
            ));
        }
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "User deleted successfully."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to delete user.",
                    "error", e.getMessage()
            ));
        }
    }

    // Get all users
    @GetMapping("/findall")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getallusers();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Users fetched successfully.",
                    "users", users
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to fetch users.",
                    "error", e.getMessage()
            ));
        }
    }

    // Find user by email
    @GetMapping("/findByEmail")
    public ResponseEntity<?> findByEmail(@RequestParam("email") String email) {
        try {
            User user = userService.findbyemail(email);
            if (user != null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "User found successfully.",
                        "user", user
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                        "success", false,
                        "message", "User not found."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to find user.",
                    "error", e.getMessage()
            ));
        }
    }

    
    @PostMapping("/sendotp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        try {
            // Generate OTP
            String otp = emailservice.generateOtp(); // Use emailService with the correct casing

            // Store OTP against the user's email (could be stored in DB for long-term)
            otpStore.put(email, otp);

            // Send OTP email
            emailservice.sendOtp(email, otp); // Again, use emailService here

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP sent successfully to " + email
            ));
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to send OTP.",
                    "error", e.getMessage()
            ));
        }
    }

    // Endpoint to validate OTP
    @PostMapping("/validateotp")
    public ResponseEntity<?> validateOtp(@RequestParam String email, @RequestParam String otp) {
        // Get OTP stored for the given email
        String storedOtp = otpStore.get(email);

        // Validate OTP
        if (storedOtp != null && storedOtp.equals(otp)) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP validated successfully!"
            ));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Invalid OTP."
            ));
        }
    }

   
}
