package com.hrpfa.hr_pfa.security.jwt;


import com.hrpfa.hr_pfa.user.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    // Injected from application.properties
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long EXPIRATION_MS;

    //------------------------ Token Generation ------------------------//
    public String generateToken(User user) {
        return generateToken(new HashMap<>(), user);
    }


    //------------------------ Role Extraction ------------------------//
    public List<GrantedAuthority> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        String role = claims.get("role", String.class); // Changed from "roles" to "role"
        return List.of(new SimpleGrantedAuthority("ROLE_" + role)); // Wrap the single role in a List
    }


    public String generateToken(
            Map<String, Object> extraClaims,
            User user
    ) {
        return Jwts.builder()
                .setClaims(new HashMap<>())
                .setSubject(user.getEmail())
                .claim("role", user.getRole()) // Ensure "role" is added as a claim
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //------------------------ Token Validation ------------------------//
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token); // Validates signature
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false; // Invalid token (expired or bad signature)
        }
    }




    public boolean isTokenValidForUser(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && isTokenValid(token);
    }

    //------------------------ Helper Methods ------------------------//
    private boolean isSignatureValid(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    //------------------------ Claims Extraction ------------------------//
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //------------------------ Security Helpers ------------------------//
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}