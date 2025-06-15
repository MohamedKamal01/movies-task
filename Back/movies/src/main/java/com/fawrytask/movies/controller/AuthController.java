package com.fawrytask.movies.controller;

import com.fawrytask.movies.model.User;
import com.fawrytask.movies.repository.UserRepository;
import com.fawrytask.movies.security.CustomUserDetailsService;
import com.fawrytask.movies.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return Map.of("message", "User registered successfully!");
    }


    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.get("username"),
                        request.get("password")
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.get("username"));
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(auth -> auth.getAuthority())
                .toList();

        String token = jwtUtil.generateToken(userDetails.getUsername(), roles);

        return Map.of("token", token);
    }

}
