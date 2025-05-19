package com.hrpfa.hr_pfa.config;

import com.hrpfa.hr_pfa.security.filter.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;


    // Constructor Injection (Dependency Inversion)
    public SecurityConfig(JwtAuthFilter jwtAuthFilter, UserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    //------------------------ Security Filter Chain ------------------------//
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless APIs
                .authorizeHttpRequests(auth -> auth
                                // Public endpoints (allow ALL HTTP methods)
                        .requestMatchers(
                                "/auth/login/**",
                                "/api/auth/register", // Added registration endpoint
                                "/api/auth/**",
                                "/api/user/hash-password")
                                .permitAll()
                                // Employees and Admins can view leave requests (GET)
                                .requestMatchers(HttpMethod.GET, "/api/leaves/**").hasAnyRole("ADMIN", "EMPLOYEE")
                        // Role-based access (Open/Closed: Add new roles without modifying this)
                                .requestMatchers("/api/user/**").hasRole("ADMIN") // Ensure roles match
//                        Spring Security applies rules top-to-bottom. Place broader rules (e.g., anyRequest().authenticated()) last
                        .requestMatchers("/api/leaves/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:4200")); // Angular app
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                    config.setAllowedHeaders(List.of("*"));
                    return config;
                }))
                .headers(headers -> headers
                        .addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN))
                ) // Allow H2 console frames
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No sessions
                )
                // Add JWT filter before default auth filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .userDetailsService(userDetailsService);

        return http.build();
    }

    //------------------------ Shared Beans ------------------------//
    @Bean
    public PasswordEncoder passwordEncoder() { // Single Responsibility: Only encode passwords
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig
    ) throws Exception { // Interface Segregation: Use AuthenticationConfiguration
        return authConfig.getAuthenticationManager();
    }
}
