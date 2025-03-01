package com.example.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Thickness;

@Repository
public interface ThicknessRepository extends JpaRepository<Thickness, Long>{

}
