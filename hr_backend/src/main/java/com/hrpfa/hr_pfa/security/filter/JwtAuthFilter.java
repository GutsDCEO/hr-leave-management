package com.hrpfa.hr_pfa.security.filter;

import com.hrpfa.hr_pfa.security.jwt.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    // Constructor-based injection
    public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Skip authentication for whitelisted URLs
        String path = request.getServletPath();
        String method = request.getMethod();
        if (isPermittedEndpoint(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT token from the Authorization header
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7); // Remove "Bearer " prefix

        // Validate the token
        if (jwtUtil.isTokenValid(token)) {
            // Extract username from the token
            String username = jwtUtil.extractUsername(token);

            // Load user details and set authentication
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtUtil.isTokenValidForUser(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // Debug logs
                    System.out.println("Authenticated user: " + username);
                    System.out.println("Authorities: " + userDetails.getAuthorities());
                }
            }
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }

    private boolean isPermittedEndpoint(HttpServletRequest request) {
        String path = request.getServletPath();
        System.out.println("JwtAuthFilter - path: " + request.getServletPath() + ", method: " + request.getMethod());
        return path.startsWith("auth") || path.startsWith("/api/auth/")
                || path.startsWith("/api/user/hash-password") || path.startsWith("/user/hash-password");
    }
}
