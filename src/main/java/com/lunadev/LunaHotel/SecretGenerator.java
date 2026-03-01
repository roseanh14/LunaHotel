package com.lunadev.LunaHotel;

import java.security.SecureRandom;

public class SecretGenerator {

    public static void main(String[] args) {
        byte[] bytes = new byte[64]; // 512-bit key
        new SecureRandom().nextBytes(bytes);

        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }

        System.out.println(sb.toString());
    }
}