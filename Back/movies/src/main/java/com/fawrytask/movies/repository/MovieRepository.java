package com.fawrytask.movies.repository;

import com.fawrytask.movies.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByImdbId(String imdbId);
    List<Movie> findByTitleContainingIgnoreCase(String query);

}
