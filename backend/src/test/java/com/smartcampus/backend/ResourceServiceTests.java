package com.smartcampus.backend;

import com.smartcampus.backend.models.Resource;
import com.smartcampus.backend.repositories.ResourceRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest(properties = {
    "spring.security.oauth2.client.registration.google.client-id=test-client-id",
    "spring.security.oauth2.client.registration.google.client-secret=test-client-secret"
})
class ResourceServiceTests {

    @MockitoBean
    private ResourceRepository resourceRepository;

    @Test
    void testFindAllResources() {
        // Arrange
        Resource r1 = new Resource();
        r1.setId("1");
        r1.setName("Lecture Hall A");
        r1.setType("ROOM");
        r1.setStatus("ACTIVE");

        Resource r2 = new Resource();
        r2.setId("2");
        r2.setName("Projector 1");
        r2.setType("EQUIPMENT");
        r2.setStatus("ACTIVE");

        when(resourceRepository.findAll()).thenReturn(Arrays.asList(r1, r2));

        // Act
        List<Resource> resources = resourceRepository.findAll();

        // Assert
        assertEquals(2, resources.size());
        assertEquals("Lecture Hall A", resources.get(0).getName());
        assertEquals("EQUIPMENT", resources.get(1).getType());
    }
}
