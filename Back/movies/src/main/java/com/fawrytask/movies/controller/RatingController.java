package com.fawrytask.movies.controller;

import com.fawrytask.movies.model.*;
import com.fawrytask.movies.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired private RatingRepository ratingRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private MovieRepository movieRepo;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> rateMovie(@RequestBody Map<String, Object> body,
                                       @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long movieId = Long.valueOf(body.get("movieId").toString());
        int ratingValue = Integer.parseInt(body.get("rating").toString());
        String comment = (String) body.getOrDefault("comment", "");

        User user = userDetails.getUser();

        Optional<Movie> movieOpt = movieRepo.findById(movieId);
        if (movieOpt.isEmpty()) return ResponseEntity.badRequest().body("Movie not found");

        Movie movie = movieOpt.get();
        Rating rating = ratingRepo.findByUserAndMovie(user, movie).orElse(new Rating());
        rating.setUser(user);
        rating.setMovie(movie);
        rating.setRating(ratingValue);
        rating.setComment(comment);
        rating.setRatedAt(java.time.LocalDateTime.now());

        ratingRepo.save(rating);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Rating saved");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{movieId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserRatingForMovie(@PathVariable Long movieId,
                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();

        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = user.getUsername();
        Optional<User> userOpt = userRepo.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Optional<Movie> movieOpt = movieRepo.findById(movieId);
        if (movieOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Movie not found");
        }

        Optional<Rating> ratingOpt = ratingRepo.findByUserAndMovie(userOpt.get(), movieOpt.get());
        if (ratingOpt.isEmpty()) {
            return ResponseEntity.ok(null);  // أو ResponseEntity.noContent().build()
        }

        return ResponseEntity.ok(ratingOpt.get().getRating());
    }

    @GetMapping("/{movieId}/average")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getAverageRating(@PathVariable Long movieId) {
        Double average = ratingRepo.findAverageRatingByMovieId(movieId);
        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", average != null ? Math.round(average * 10.0) / 10.0 : 0);
        return ResponseEntity.ok(response);
    }


}
