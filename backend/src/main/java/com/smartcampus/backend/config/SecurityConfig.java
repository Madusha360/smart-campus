package com.smartcampus.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configure(http))
            .csrf(csrf -> csrf.disable()) // Disabled for local development/testing convenience
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.GET, "/api/resources").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                
                // Admin endpoints
                .requestMatchers(HttpMethod.POST, "/api/resources").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/bookings/*/status").hasRole("ADMIN")
                
                // Technician endpoints
                .requestMatchers(HttpMethod.PUT, "/api/tickets/*/status").hasAnyRole("ADMIN", "TECHNICIAN")
                
                // All other API endpoints require authentication
                .requestMatchers("/api/**").authenticated()
                
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("http://localhost:5173", true)
            );
            
        return http.build();
    }
}
