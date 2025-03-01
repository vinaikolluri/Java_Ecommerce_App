package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dao.ColourRepository;
import com.example.dao.SizeRepository;
import com.example.dao.ThicknessRepository;
import com.example.entity.Colour;
import com.example.entity.Size;
import com.example.entity.Thickness;

@RestController
@RequestMapping("/api/colourSizeThickness")
public class ColourSizeThicknessController {

    @Autowired
    private ColourRepository colourRepo;

    @Autowired
    private SizeRepository sizeRepo;

    @Autowired
    private ThicknessRepository thicknessRepo;

    // API to get all colours
    @GetMapping("/colours")
    public ResponseEntity<List<Colour>> getAllColours() {
        List<Colour> colours = colourRepo.findAll();
        if (colours.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(colours);
        }
        return ResponseEntity.ok(colours);
    }

    // API to get all sizes
    @GetMapping("/sizes")
    public ResponseEntity<List<Size>> getAllSizes() {
        List<Size> sizes = sizeRepo.findAll();
        if (sizes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(sizes);
        }
        return ResponseEntity.ok(sizes);
    }

    // API to get all thicknesses
    @GetMapping("/thicknesses")
    public ResponseEntity<List<Thickness>> getAllThicknesses() {
        List<Thickness> thicknesses = thicknessRepo.findAll();
        if (thicknesses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(thicknesses);
        }
        return ResponseEntity.ok(thicknesses);
    }

    // API to add a new colour
    @PostMapping("/AddColours")
    public ResponseEntity<Colour> addColour(@RequestBody Colour colour) {
        if (colour == null || colour.getColour() == null || colour.getColour().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        Colour savedColour = colourRepo.save(colour);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedColour);
    }

    // API to add a new size
    @PostMapping("/addSizes")
    public ResponseEntity<Size> addSize(@RequestBody Size size) {
        if (size == null || size.getSize() == null || size.getSize().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        Size savedSize = sizeRepo.save(size);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSize);
    }

    // API to add a new thickness
    @PostMapping("/AddThicknesses")
    public ResponseEntity<Thickness> addThickness(@RequestBody Thickness thickness) {
        if (thickness == null || thickness.getThickness() == null || thickness.getThickness().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        Thickness savedThickness = thicknessRepo.save(thickness);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedThickness);
    }
}
