package com.fawrytask.movies.controller;

import com.fawrytask.movies.model.Movie;
import com.fawrytask.movies.repository.MovieRepository;
import com.fawrytask.movies.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.springframework.data.domain.Pageable;

import java.util.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private RatingRepository ratingRepo;


    private final String omdbApiKey = "69399543";

    private final String omdbUrl = "https://www.omdbapi.com/?apikey=" + omdbApiKey;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addMovieByImdbId(@RequestBody Map<String, String> body) {
        String imdbId = body.get("imdbId");

        if (imdbId == null || imdbId.isEmpty()) {
            throw new RuntimeException("IMDB ID is required");
        }

        if (movieRepository.findByImdbId(imdbId).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Movie already exists");
        }

        RestTemplate restTemplate = new RestTemplate();
        String url = omdbUrl + "&i=" + imdbId;

        Map<?, ?> response = restTemplate.getForObject(url, Map.class);

        if (response == null || !"True".equals(response.get("Response"))) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found in OMDB API");
        }

        Movie movie = new Movie();
        movie.setImdbId((String) response.get("imdbID"));
        movie.setTitle((String) response.get("Title"));
        movie.setYear((String) response.get("Year"));
        movie.setType((String) response.get("Type"));
        movie.setPosterUrl((String) response.get("Poster"));

        Movie saved = movieRepository.save(movie);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        Optional<Movie> movie = movieRepository.findById(id);
        if (movie.isPresent()) {
            return ResponseEntity.ok(movie.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> deleteMovie(@PathVariable Long id) {
        ratingRepo.deleteAllRatingsByMovieID(id);
        movieRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Movie deleted");
        return response;
    }
    @GetMapping("/search-omdb")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> searchFromOmdb(@RequestParam String query) {
        String url = omdbUrl + "&" + query;
        if ( url.contains("-y=")) url = url.replace("-y=","&y=");
        if ( url.contains("-plot=")) url = url.replace("-plot=","&plot=");
        RestTemplate restTemplate = new RestTemplate();

        try {
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to connect to OMDB API");
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Map<String, Object> getAllMovies(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> moviePage = movieRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("movies", moviePage.getContent());
        response.put("currentPage", moviePage.getNumber());
        response.put("totalItems", moviePage.getTotalElements());
        response.put("totalPages", moviePage.getTotalPages());

        return response;
    }



    @PostMapping("/batch-delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> batchDeleteMovies(@RequestBody Map<String, List<Long>> body) {
        List<Long> ids = body.get("ids");
        ratingRepo.deleteAllRatingsByMovieIds(ids);
        movieRepository.deleteAllById(ids);
        return ResponseEntity.ok(Map.of("message", "Movies deleted successfully"));
    }

    @PostMapping("/batch-add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> batchAddMovies(@RequestBody Map<String, List<String>> body) {
        List<String> imdbIds = body.get("imdbIds");

        RestTemplate restTemplate = new RestTemplate();
        List<Movie> savedMovies = new ArrayList<>();

        for (String imdbId : imdbIds) {
            if (movieRepository.findByImdbId(imdbId).isPresent()) {
                continue; // تخطي إذا الفيلم موجود
            }

            String url = omdbUrl + "&i=" + imdbId;
            Map<?, ?> response = restTemplate.getForObject(url, Map.class);

            if (response != null && "True".equals(response.get("Response"))) {
                Movie movie = new Movie();
                movie.setImdbId((String) response.get("imdbID"));
                movie.setTitle((String) response.get("Title"));
                movie.setYear((String) response.get("Year"));
                movie.setType((String) response.get("Type"));
                movie.setPosterUrl((String) response.get("Poster"));

                savedMovies.add(movieRepository.save(movie));
            }
        }

        return ResponseEntity.ok(savedMovies);
    }
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<List<Movie>> searchMovies(@RequestParam String query) {
        List<Movie> movies = movieRepository.findByTitleContainingIgnoreCase(query);
        return ResponseEntity.ok(movies);
    }



}
