package com.huyuxuan.student_server.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class VerificationCodeService {
    private final Map<String, String> codeStorage = new HashMap<>();
    private final Random random = new Random();

    public String generateCode() {
        return String.format("%04d", random.nextInt(10000));
    }

    public void storeCode(String phoneNumber, String code) {
        codeStorage.put(phoneNumber, code);
    }

    public boolean verifyCode(String phoneNumber, String inputCode) {
        String storedCode = codeStorage.get(phoneNumber);
        return storedCode != null && storedCode.equals(inputCode);
    }
}