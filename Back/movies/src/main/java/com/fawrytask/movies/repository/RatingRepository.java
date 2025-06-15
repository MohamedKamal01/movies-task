package com.fawrytask.movies.repository;

import com.fawrytask.movies.model.Movie;
import com.fawrytask.movies.model.Rating;
import com.fawrytask.movies.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndMovie(User user, Movie movie);
    List<Rating> findByMovie(Movie movie);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.movie.id = :movieId")
    Double findAverageRatingByMovieId(@Param("movieId") Long movieId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Rating r WHERE r.movie.id = :movieId")
    void deleteAllRatingsByMovieID(@Param("movieId") Long movieId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Rating r WHERE r.movie.id IN :movieIds")
    void deleteAllRatingsByMovieIds(@Param("movieIds") List<Long> movieIds);

}
