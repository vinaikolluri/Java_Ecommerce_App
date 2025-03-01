package com.example.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Size;
@Repository
public interface SizeRepository extends JpaRepository<Size, Long>{

}
