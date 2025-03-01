package com.example.dto;

import org.springframework.beans.BeanUtils;

import com.example.entity.User;

public class UserDto {
	
	private Long id;
	private String firstName;
	private String lastName;
	private String emailId;
    private String password;
    private String role;
    private Long mobileNo;
  
	private String status;
	

	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getFirstName() {
		return firstName;
	}


	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}


	public String getLastName() {
		return lastName;
	}


	public void setLastName(String lastName) {
		this.lastName = lastName;
	}


	public String getEmailId() {
		return emailId;
	}


	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getRole() {
		return role;
	}


	public void setRole(String role) {
		this.role = role;
	}


	public Long getMobileNo() {
		return mobileNo;
	}


	public void setMobileNo(Long mobileNo) {
		this.mobileNo = mobileNo;
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	// Convert Admin entity to AdminDto
	public static UserDto toUserDtoEntity(User user)  { 
		UserDto  adminDto=new UserDto();
		BeanUtils.copyProperties(user,  adminDto, "Mentee");

		return adminDto;
	}

}
