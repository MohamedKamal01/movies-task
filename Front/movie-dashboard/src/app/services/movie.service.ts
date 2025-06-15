import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { Rating } from '../models/rating';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private backendUrl = '/api/movies';
  private backendUrlRating = '/api/ratings';
  constructor(private http: HttpClient) { }

  // Load from our database (used by user and admin)
  getAllMovies(page: number, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}?page=${page}&size=${size}`);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.backendUrl}/${id}`);
  }

  // OMDB API search
  searchOmdbMovies(query: string): Observable<any> {
    
    return this.http.get<any>(`${this.backendUrl}/search-omdb?query=${query}`);
  }

  // Search from our own DB (user search)
  searchMovies(query: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.backendUrl}/search?query=${query}`);
  }

  // Add single movie (admin)
  addMovie(imdbId: string): Observable<Movie> {
    
    return this.http.post<Movie>(`${this.backendUrl}/add`, { imdbId });
  }

  // Batch add movies by IMDB IDs (optional/bonus)
  addMovies(imdbIds: string[]): Observable<Movie[]> {
    
    return this.http.post<Movie[]>(`${this.backendUrl}/batch-add`, { imdbIds });
  }

  deleteMovies(ids: number[]): Observable<any> {
    return this.http.post(`${this.backendUrl}/batch-delete`, { ids });
  }


  // Remove a movie (admin)
  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.backendUrl}/delete/${id}`);
  }


  rateMovie(movieId: number, rating: number, comment: string = ''): Observable<any> {
    return this.http.post(`${this.backendUrlRating}`, {
      movieId: movieId,
      rating: rating,
      comment: comment
    });
  }
  

  getUserRating(movieId: number): Observable<number | null> {
    return this.http.get<number>(`${this.backendUrlRating}/user/${movieId}`);
  }
  
  getAverageRating(movieId: number): Observable<number> {
    return this.http.get<{ averageRating: number }>(`${this.backendUrlRating}/${movieId}/average`)
      .pipe(map(res => res.averageRating));
  }
  
}
