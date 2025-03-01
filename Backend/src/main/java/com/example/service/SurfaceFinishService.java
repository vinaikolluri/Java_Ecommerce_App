package com.example.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.SurfaceFinishRepository;
import com.example.entity.SurfaceFinish;

@Service
public class SurfaceFinishService {

	@Autowired
    private SurfaceFinishRepository surfaceFinishRepository;

    

    // Method to add a new SurfaceFinish
    public SurfaceFinish addSurfaceFinish(SurfaceFinish surfaceFinish) {
        return surfaceFinishRepository.save(surfaceFinish);
    }

    // Method to get all SurfaceFinishes
    public List<SurfaceFinish> getAllSurfaceFinishes() {
        return surfaceFinishRepository.findAll();
    }
}
