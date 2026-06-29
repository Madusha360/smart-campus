package com.smartcampus.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;

@Data
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;
    private String name;
    private String type; // e.g., LECTURE_HALL, LAB, EQUIPMENT
    private int capacity;
    private String location;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private String status; // ACTIVE, OUT_OF_SERVICE
}
