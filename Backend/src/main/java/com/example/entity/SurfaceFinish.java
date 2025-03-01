package com.example.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class SurfaceFinish {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String surfaceFinish;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSurfaceFinish() {
		return surfaceFinish;
	}

	public void setSurfaceFinish(String surfaceFinish) {
		this.surfaceFinish = surfaceFinish;
	}
	
	

}
