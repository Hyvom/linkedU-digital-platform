package com.linkedu.backend.services;

import com.linkedu.backend.entities.Destination;
import com.linkedu.backend.repositories.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DestinationService {
    private final DestinationRepository destinationRepository;

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination getDestinationById(Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
    }

    public Destination createDestination(Destination destination) {
        return destinationRepository.save(destination);
    }

    public Destination updateDestination(Long id, Destination destination) {
        Destination existing = getDestinationById(id);
        existing.setCountryName(destination.getCountryName());
        existing.setDescription(destination.getDescription());
        existing.setParagraph(destination.getParagraph());
        existing.setOffers(destination.getOffers());
        existing.setUniversities(destination.getUniversities());
        if (destination.getImageUrl() != null) existing.setImageUrl(destination.getImageUrl());
        return destinationRepository.save(existing);
    }

    public void deleteDestination(Long id) {
        destinationRepository.deleteById(id);
    }
}
