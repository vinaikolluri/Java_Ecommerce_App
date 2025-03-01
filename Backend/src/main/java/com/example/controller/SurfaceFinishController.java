package com.example.controller;

import com.example.entity.SurfaceFinish;
import com.example.service.SurfaceFinishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surface-finish")
public class SurfaceFinishController {
	@Autowired
    private  SurfaceFinishService surfaceFinishService;

    
   

    // API to add a new SurfaceFinish
    @PostMapping("/add")
    public ResponseEntity<SurfaceFinish> addSurfaceFinish(@RequestBody SurfaceFinish surfaceFinish) {
        if (surfaceFinish == null || surfaceFinish.getSurfaceFinish() == null || surfaceFinish.getSurfaceFinish().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Return 400 Bad Request if surface finish is invalid
        }

        SurfaceFinish createdSurfaceFinish = surfaceFinishService.addSurfaceFinish(surfaceFinish);
        return ResponseEntity.ok(createdSurfaceFinish);
    }

    // API to get all SurfaceFinishes
    @GetMapping("/all")
    public ResponseEntity<List<SurfaceFinish>> getAllSurfaceFinishes() {
        List<SurfaceFinish> surfaceFinishes = surfaceFinishService.getAllSurfaceFinishes();
        if (surfaceFinishes.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no surface finishes are found
        }
        return ResponseEntity.ok(surfaceFinishes);
    }
}
