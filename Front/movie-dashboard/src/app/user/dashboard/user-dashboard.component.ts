import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  movies: Movie[] = [];
  message = '';
  currentPage = 0;
  totalPages = 0;
  hasMoreMovies = false;
  constructor(private movieService: MovieService, private router: Router) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getAllMovies(this.currentPage).subscribe({
      next: (response) => {
        if (response.movies) {
          this.movies = response.movies;
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
          this.hasMoreMovies = this.currentPage < this.totalPages - 1;
        }
      },
      error: (err) => {
        console.error('Error loading movies:', err);
      }
    });
  }

  viewDetails(movieId: number) {

    this.router.navigate(['/user/movie', movieId]);
  }
  goToNextPage() {
    if (this.hasMoreMovies) {
      this.currentPage++;
      this.loadMovies();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMovies();
    }
  }
}
