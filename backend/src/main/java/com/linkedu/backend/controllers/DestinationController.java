package com.linkedu.backend.controllers;

import com.linkedu.backend.entities.Destination;
import com.linkedu.backend.services.DestinationService;
import com.linkedu.backend.services.ImageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DestinationController {

    private final DestinationService destinationService;
    private final ImageService imageService;

    @GetMapping
    public List<Destination> getAll() {
        return destinationService.getAllDestinations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(destinationService.getDestinationById(id));
    }
}