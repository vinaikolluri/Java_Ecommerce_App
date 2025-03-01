package com.example.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.example.entity.User;
import com.example.service.UserService;

@Component
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    @Lazy  // Adding @Lazy to break circular dependency
    private UserService userservice;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User byemail = userservice.getByemail(email);
        if (byemail != null) {
            return new CustomUserrrDetailss(byemail);
        }
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
