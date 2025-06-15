package com.fawrytask.movies.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // السماح لكل ال endpoints
                        .allowedOrigins("http://localhost:4200") // السماح لفرونت Angular
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // السماح بهذه الطلبات
                        .allowCredentials(true); // لو تستخدم الكوكيز مع الطلبات
            }
        };
    }
}
