package com.smartcampus.backend.controllers;

import com.smartcampus.backend.models.Booking;
import com.smartcampus.backend.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*") // For development purposes
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // Simple conflict check
        List<Booking> existingBookings = bookingRepository.findByResourceId(booking.getResourceId());
        boolean hasConflict = existingBookings.stream()
                .filter(b -> !"REJECTED".equals(b.getStatus()) && !"CANCELLED".equals(b.getStatus()))
                .anyMatch(b -> 
                    (booking.getStartTime().isBefore(b.getEndTime()) && booking.getEndTime().isAfter(b.getStartTime()))
                );

        if (hasConflict) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Scheduling conflict detected for this resource.");
        }

        booking.setStatus("PENDING");
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id, @RequestBody Booking updateData) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus(updateData.getStatus());
            if (updateData.getRejectReason() != null) {
                booking.setRejectReason(updateData.getRejectReason());
            }
            Booking savedBooking = bookingRepository.save(booking);
            
            // Broadcast notification
            messagingTemplate.convertAndSend("/topic/notifications", 
                "Booking for resource " + savedBooking.getResourceId() + " was " + savedBooking.getStatus());
                
            return ResponseEntity.ok(savedBooking);
        }
        return ResponseEntity.notFound().build();
    }
}
