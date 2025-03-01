package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.CategoryDTO;
import com.example.dto.CategoryUpdateDTO;
import com.example.dto.SubCategoryDTO;
import com.example.dto.SubCategoryUpdateDTO;
import com.example.entity.Category;
import com.example.entity.ParentCategory;
import com.example.entity.SubCategory;
import com.example.service.CategoryService;

@RestController
@RequestMapping("/category")
public class CategoryController {
	
	@Autowired
	private CategoryService service;
	

    // Endpoint to add a parent category
    @PostMapping("/addParentCategory")
    public ResponseEntity<ParentCategory> addParentCategory(@RequestBody ParentCategory category) {
        try {
            ParentCategory addedCategory = service.addParentCategory(category);
            return new ResponseEntity<>(addedCategory, HttpStatus.CREATED);  // Successfully created
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);  // Invalid input
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);  // Server error
        }
    }
	
	
	 // Endpoint to add a subcategory
    @PostMapping("/addSubCategory")
    public ResponseEntity<SubCategory> addSubCategory(@RequestBody SubCategoryDTO subCategoryDTO) {
        try {
            SubCategory addedSubCategory = service.addSubCategory(subCategoryDTO);
            return new ResponseEntity<>(addedSubCategory, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    // Endpoint to add a category
    @PostMapping("/addCategory")
    public ResponseEntity<Category> addCategory(@RequestBody CategoryDTO categoryDTO) {
        try {
            Category addedCategory = service.addCategory(categoryDTO);
            return new ResponseEntity<>(addedCategory, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
 // Update Parent Category
    @PutMapping("/updateParentCategory")
    public ResponseEntity<ParentCategory> updateParentCategory(@RequestBody ParentCategory category) {
        try {
            ParentCategory updatedCategory = service.updateParentCategory(category);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update Category
    @PutMapping("/updateCategory")
    public ResponseEntity<Category> updateCategory(@RequestBody CategoryUpdateDTO categoryDTO) {
        try {
            Category updatedCategory = service.updateCategory(categoryDTO);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update SubCategory
    @PutMapping("/updateSubCategory")
    public ResponseEntity<SubCategory> updateSubCategory(@RequestBody SubCategoryUpdateDTO subCategoryDTO) {
        try {
            SubCategory updatedSubCategory = service.updateSubCategory(subCategoryDTO);
            return new ResponseEntity<>(updatedSubCategory, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    //findall parent categories api
    @GetMapping("/findAllParentCategories")
    public List<ParentCategory>findAllParentCategory(){
    	List<ParentCategory> findallParentCategories = service.findallParentCategories();
    	if(findallParentCategories.isEmpty()) {
    		throw new RuntimeException("no data there it is empty");
    	}
    	return findallParentCategories;
    	
    }
    // findall categories api
    @GetMapping("/findAllCategories")
    public List<Category>findAllCategory(){
    	List<Category> allCategories = service.findAllCategories();
    	if(allCategories.isEmpty()) {
    		throw new RuntimeException("no data there it is empty");
    	}
    	return allCategories;
    	
    }
 // findall Subcategories api
    @GetMapping("/findAllSubCategories")
    public List<SubCategory>findAllSubCategory(){
    	 List<SubCategory> allSubCategories = service.findAllSubCategories();
    	if(allSubCategories.isEmpty()) {
    		throw new RuntimeException("no data there it is empty");
    	}
    	return allSubCategories;
    	
    }
    
 // Endpoint to find categories by parent id
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<Category>> getCategoriesByParentId(@PathVariable Long parentId) {
        List<Category> categories = service.findCategoriesByParentId(parentId);
        
        if (categories.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no categories found
        }
        
        return ResponseEntity.ok(categories); // Return 200 OK with the categories list
    }
    
    // Endpoint to find SubCategories by category id
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SubCategory>> getSubCategoriesByCategoryId(@PathVariable Long categoryId) {
        List<SubCategory> subCategories = service.findSubCategoriesByCategoryId(categoryId);
        
        if (subCategories.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no subcategories found
        }
        
        return ResponseEntity.ok(subCategories); // Return 200 OK with the subcategories list
    }
}
