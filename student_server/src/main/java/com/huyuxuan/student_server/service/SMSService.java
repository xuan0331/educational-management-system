package com.huyuxuan.student_server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.huyuxuan.student_server.util.HttpUtils;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SMSService {
    private static final String HOST = "https://dfsns.market.alicloudapi.com";
    private static final String PATH = "/data/send_sms";
    private static final String METHOD = "POST";
    private static final String APP_CODE = "392b673f23cd40ea9729145d4b8f5ec9"; // 替换为真实值

    public Map<String, Object> sendVerificationCode(String phoneNumber, String code) {
        Map<String, Object> result = new HashMap<>();

        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "APPCODE " + APP_CODE);
        headers.put("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

        Map<String, String> bodys = new HashMap<>();
        bodys.put("content", "code:" + code); // 按照文档要求格式
        bodys.put("template_id", "CST_ptdie100"); // 调试用模板ID
        bodys.put("phone_number", phoneNumber);

        try {
            HttpResponse response = HttpUtils.doPost(HOST, PATH, METHOD, headers, new HashMap<>(), bodys);
            String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");

            // 解析JSON响应
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> responseMap = mapper.readValue(responseBody, Map.class);

            if ("OK".equals(responseMap.get("status"))) {
                result.put("success", true);
                result.put("message", "短信发送成功");
            } else {
                result.put("success", false);
                result.put("message", responseMap.get("message"));
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "短信服务异常: " + e.getMessage());
        }
        return result;
    }
}