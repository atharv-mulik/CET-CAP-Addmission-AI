package com.capadmission.backend.service;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class DocumentService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String AI_VERIFY_URL = "http://localhost:5000/verify-document";

    public Map<String, Object> verifyDocument(MultipartFile file) throws IOException {
        // Prepare Multi-part request for Python AI
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        // Wrap MultipartFile in ByteArrayResource for RestTemplate
        ByteArrayResource contentsAsResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        body.add("file", contentsAsResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    AI_VERIFY_URL,
                    HttpMethod.POST,
                    requestEntity,
                    new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {
                    });
            return response.getBody();
        } catch (Exception e) {
            return Map.of(
                    "status", "Error",
                    "message", "AI Verification Service unreachable: " + e.getMessage());
        }
    }
}
