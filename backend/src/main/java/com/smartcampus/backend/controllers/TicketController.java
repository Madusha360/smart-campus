package com.smartcampus.backend.controllers;

import com.smartcampus.backend.models.Ticket;
import com.smartcampus.backend.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;


import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*") // For development purposes
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        Ticket savedTicket = ticketRepository.save(ticket);
        messagingTemplate.convertAndSend("/topic/notifications", "New Incident Ticket Created: " + savedTicket.getCategory());
        return savedTicket;
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable String id, @RequestBody Ticket updateData) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);
        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();
            ticket.setStatus(updateData.getStatus());
            if (updateData.getResolutionNotes() != null) {
                ticket.setResolutionNotes(updateData.getResolutionNotes());
            }
            if (updateData.getAssignedTo() != null) {
                ticket.setAssignedTo(updateData.getAssignedTo());
            }
            Ticket savedTicket = ticketRepository.save(ticket);
            messagingTemplate.convertAndSend("/topic/notifications", "Ticket status updated to " + savedTicket.getStatus());
            return ResponseEntity.ok(savedTicket);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable String id, @RequestBody Ticket.Comment comment) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);
        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();
            comment.setId(UUID.randomUUID().toString());
            comment.setTimestamp(LocalDateTime.now());
            ticket.getComments().add(comment);
            Ticket savedTicket = ticketRepository.save(ticket);
            messagingTemplate.convertAndSend("/topic/notifications", "New comment added to ticket " + id);
            return ResponseEntity.ok(savedTicket);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<?> uploadAttachment(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);
        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();
            if (ticket.getAttachmentUrls().size() >= 3) {
                return ResponseEntity.badRequest().body("Maximum of 3 attachments allowed.");
            }
            try {
                // Ensure uploads directory exists
                String uploadDir = "uploads/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                // Save file securely
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, file.getBytes());

                // Add to ticket
                ticket.getAttachmentUrls().add("/uploads/" + fileName);
                Ticket savedTicket = ticketRepository.save(ticket);
                return ResponseEntity.ok(savedTicket);

            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Failed to upload file");
            }
        }
        return ResponseEntity.notFound().build();
    }
}
