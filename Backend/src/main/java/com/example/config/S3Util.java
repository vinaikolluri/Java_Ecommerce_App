/*
 * package com.example.config;
 * 
 * import com.amazonaws.services.s3.AmazonS3; import
 * com.amazonaws.services.s3.model.PutObjectRequest; import
 * org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.beans.factory.annotation.Value; import
 * org.springframework.stereotype.Component;
 * 
 * import java.io.File;
 * 
 * @Component public class S3Util {
 * 
 * @Autowired private AmazonS3 amazonS3;
 * 
 * @Value("${aws.s3.bucket.name}") private String bucketName;
 * 
 * public String uploadFile(File file) { String fileName = file.getName();
 * amazonS3.putObject(new PutObjectRequest(bucketName, fileName, file)); return
 * amazonS3.getUrl(bucketName, fileName).toString(); } }
 */