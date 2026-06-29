package com.smartcampus.backend.config;

import com.smartcampus.backend.models.Resource;
import com.smartcampus.backend.repositories.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if database is empty
        if (resourceRepository.count() == 0) {
            System.out.println("Seeding database with initial data...");
            
            Resource hall1 = new Resource();
            hall1.setName("Main Lecture Hall A");
            hall1.setType("LECTURE_HALL");
            hall1.setCapacity(150);
            hall1.setLocation("Building 1, Ground Floor");
            hall1.setStatus("ACTIVE");
            
            Resource lab1 = new Resource();
            lab1.setName("Advanced Computing Lab");
            lab1.setType("LAB");
            lab1.setCapacity(30);
            lab1.setLocation("Building 2, Floor 3");
            lab1.setStatus("ACTIVE");

            Resource equip1 = new Resource();
            equip1.setName("Mobile Projector Unit 1");
            equip1.setType("EQUIPMENT");
            equip1.setCapacity(0);
            equip1.setLocation("IT Storage Room");
            equip1.setStatus("ACTIVE");

            resourceRepository.save(hall1);
            resourceRepository.save(lab1);
            resourceRepository.save(equip1);
            
            System.out.println("Database seeding completed!");
        } else {
            System.out.println("Database already contains data, skipping seed.");
        }
    }
}
