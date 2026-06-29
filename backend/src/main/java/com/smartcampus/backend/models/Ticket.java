package com.smartcampus.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String resourceId;
    private String userId; // User who created the ticket
    private String category; // e.g. HARDWARE, SOFTWARE, CLEANING
    private String description;
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    private String preferredContact;
    private String status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    private String assignedTo; // Technician ID
    private String resolutionNotes;
    private LocalDateTime createdAt;
    
    private List<String> attachmentUrls = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();

    @Data
    public static class Comment {
        private String id;
        private String text;
        private String authorId;
        private String authorName;
        private LocalDateTime timestamp;
    }
}
