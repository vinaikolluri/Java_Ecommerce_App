package com.example.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.ParentCategory;

@Repository
public interface ParentCategoryRepository extends JpaRepository<ParentCategory, Long>{

}
