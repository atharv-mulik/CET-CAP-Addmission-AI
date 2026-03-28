package com.capadmission.backend.controller;

import com.capadmission.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyDocument(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> result = documentService.verifyDocument(file);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to process file: " + e.getMessage()));
        }
    }
}
