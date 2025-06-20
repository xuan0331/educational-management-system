package com.huyuxuan.student_server.controller;

import com.huyuxuan.student_server.service.SMSService;
import com.huyuxuan.student_server.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class AuthController {

    @Autowired
    private SMSService smsService;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/sendCode")
    @ResponseBody
    public Map<String, Object> sendVerificationCode(@RequestParam String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        try {
            String code = verificationCodeService.generateCode();
            verificationCodeService.storeCode(phoneNumber, code);

            Map<String, Object> smsResult = smsService.sendVerificationCode(phoneNumber, code);
            if (Boolean.TRUE.equals(smsResult.get("success"))) {
                response.put("success", true);
                response.put("code", code); // 测试用返回验证码
                response.put("message", "验证码发送成功");
            } else {
                response.put("success", false);
                response.put("message", smsResult.get("message"));
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "系统错误: " + e.getMessage());
        }
        return response;
    }

    @PostMapping("/verifyCode")
    @ResponseBody
    public Map<String, Object> verifyCode(@RequestParam String phoneNumber,
                                          @RequestParam String code) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (verificationCodeService.verifyCode(phoneNumber, code)) {
                response.put("success", true);
                response.put("message", "验证成功");
            } else {
                response.put("success", false);
                response.put("message", "验证码错误或已过期");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "验证出错: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/admin")
    public String adminPage() {
        return "admin";
    }
}