package com.linkedu.backend.controllers;

import com.linkedu.backend.entities.Destination;
import com.linkedu.backend.services.DestinationService;
import com.linkedu.backend.services.ImageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/destinations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")  // ← ADMIN ONLY
public class AdminDestinationController {

    private final DestinationService destinationService;
    private final ImageService imageService;

    // GET ALL
    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Destination> getDestination(@PathVariable Long id) {
        return ResponseEntity.ok(destinationService.getDestinationById(id));
    }

    // CREATE with Image
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createDestination(
            @RequestPart("destination") String destinationJson,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        
        ObjectMapper mapper = new ObjectMapper();
        Destination destination = mapper.readValue(destinationJson, Destination.class);
        
        if (file != null && !file.isEmpty()) {
            String imageUrl = imageService.saveImage(file);
            destination.setImageUrl(imageUrl);
        }
        
        Destination saved = destinationService.createDestination(destination);
        return ResponseEntity.ok(Map.of("id", saved.getId(), "message", "Destination created"));
    }

    // CREATE JSON fallback (for clients not sending multipart)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createDestinationJson(@RequestBody Destination destination) {
        Destination saved = destinationService.createDestination(destination);
        return ResponseEntity.ok(Map.of("id", saved.getId(), "message", "Destination created"));
    }

    // UPDATE with Image
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateDestination(
            @PathVariable Long id,
            @RequestPart("destination") String destinationJson,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        
        ObjectMapper mapper = new ObjectMapper();
        Destination destination = mapper.readValue(destinationJson, Destination.class);
        
        if (file != null && !file.isEmpty()) {
            String imageUrl = imageService.saveImage(file);
            destination.setImageUrl(imageUrl);
        }
        
        Destination updated = destinationService.updateDestination(id, destination);
        return ResponseEntity.ok(Map.of("id", updated.getId(), "message", "Destination updated"));
    }

    // UPDATE JSON fallback (for clients not sending multipart)
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateDestinationJson(
            @PathVariable Long id,
            @RequestBody Destination destination) {
        Destination updated = destinationService.updateDestination(id, destination);
        return ResponseEntity.ok(Map.of("id", updated.getId(), "message", "Destination updated"));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.ok(Map.of("message", "Destination deleted"));
    }
}
