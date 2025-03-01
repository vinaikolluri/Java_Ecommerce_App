package com.example.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.SurfaceFinish;
@Repository
public interface SurfaceFinishRepository extends JpaRepository<SurfaceFinish, Long>{

}
