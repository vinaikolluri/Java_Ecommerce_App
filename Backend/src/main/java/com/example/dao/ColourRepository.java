package com.example.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Colour;
@Repository
public interface ColourRepository extends JpaRepository<Colour, Long>{

}
