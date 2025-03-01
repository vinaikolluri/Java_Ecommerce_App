package com.example.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.SubCategory;

@Repository
public interface SubCategpryRepository extends JpaRepository<SubCategory, Long> {
	 List<SubCategory> findByCategoryId(Long categoryId);
}
