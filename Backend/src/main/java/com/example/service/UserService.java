package com.example.service;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.dao.UserRepository;
import com.example.dto.UserDto;
import com.example.dto.UserLoginRequest;
import com.example.dto.UserLoginResponseJWT;
import com.example.entity.User;
import com.example.exception.EmailAlreadyExistsException;
import com.example.exception.ResourceNotFoundException;
import com.example.security.JwtUtils;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtils jwtUtils;

    
    @Autowired
    private PasswordEncoder passwordEncoder;  // Injecting BCryptPasswordEncoder

    // Register a new user
    public User registerUser(User user) {
        // Ensure ID is null when registering a new user
        user.setId(null);

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists!");
        }

        // Encrypt the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
user.setStatus("Active");
user.setRole("Buyer");
        // Save and return the user
        return userRepository.save(user);
    }

   
    // Update user details
    public User updateUser(Long id, User  user) {
        
        
        return userRepository.save(user);
    }
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    // Delete user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
    
    public List<User> getallusers(){
    	return userRepository.findAll();
    }
    public User findbyemail(String email) {
    	return userRepository.findByEmail(email).get();
    }
    
public ResponseEntity<UserLoginResponseJWT> login(UserLoginRequest loginRequest) {
		
		UserLoginResponseJWT response = new UserLoginResponseJWT();

		if (loginRequest == null) {
			response.setMessage("Missing Input");
			response.setStatus(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// Attempt to find User, Staff, and Admin
		
		User user = userRepository.findByEmail(loginRequest.getEmailId()).get();
		// Handle User login
		if (user != null) {
			return handleUserrrLogin(loginRequest, response, user);
		}
		
		
		// Neither User, Staff, nor Admin found
		else {
			response.setMessage("Invalid email or password.");
			response.setStatus(false);
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
	}
	
	
	private ResponseEntity<UserLoginResponseJWT> handleUserrrLogin(UserLoginRequest loginRequest,
			UserLoginResponseJWT response, User user) {
		try {
			authenticateUser(loginRequest, user.getRole());
			String jwtToken = jwtUtils.generateToken(loginRequest.getEmailId());

			User uu = userRepository.findByEmailAndRoleAndStatus(loginRequest.getEmailId(),
					user.getRole(), "Active");
			UserDto usedto = UserDto.toUserDtoEntity(user);
			usedto.setId(uu.getId());

			response.setUser(usedto);
			response.setMessage("Logged in successfully");
			
			response.setJwtToken(jwtToken);
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception ex) {
			response.setMessage("Invalid email or password.");
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
	}
	private void authenticateUser(UserLoginRequest loginRequest, String role) {
		List<GrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority(role));
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmailId(),
				loginRequest.getPassword(), authorities));
	}
	
	
	public User getByemail(String email) {
		return userRepository.findByEmail(email).get();
	}
	
	public User findByEmailAndRole(String email, String role) {
		return userRepository.findByEmailAndRole(email, role);
		
	}
    public User save(User user) {
    	return userRepository.save(user);
    }
}
