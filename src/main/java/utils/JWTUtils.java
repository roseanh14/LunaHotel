package com.lunadev.LunaHotel.utils;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
public class JWTUtils {

    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7; // 7 days

    private final SecretKey key;

    public JWTUtils() {
        this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
}