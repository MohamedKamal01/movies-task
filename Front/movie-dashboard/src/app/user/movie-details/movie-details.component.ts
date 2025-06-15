import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { Rating } from 'src/app/models/rating';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie?: Movie = new Movie();
  message = '';
  userRating?: number = 0;
  isSubmitting: boolean = false;
  averageRating: number = 0;

  constructor(private route: ActivatedRoute, private movieService: MovieService, private toast: ToastService) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.movieService.getMovieById(id).subscribe({
        next: movie => {
          this.movie = movie;
          if (this.movie.id) {
            this.movieService.getUserRating(this.movie.id).subscribe({
              next: (rating) => {
                if (rating !== null) {
                  this.userRating = rating;
                }
              },
              error: (err) => {
                console.error('Failed to fetch user rating', err);
              }
            });
            this.movieService.getAverageRating(this.movie.id).subscribe(avg => {
              this.averageRating = avg;
            });
          }
        },
        error: () => this.message = 'Movie not found.'
      });
    }
  }
  submitRating() {
    if (!this.movie) return;

    this.isSubmitting = true;

    if (this.movie.id && this.userRating) {
      this.movieService.rateMovie(this.movie.id, this.userRating, '').subscribe({

        next: () => {
          this.toast.success('Thanks for your rating!')

          this.isSubmitting = false;
          if (this.movie && this.movie.id) {
            this.movieService.getAverageRating(this.movie.id).subscribe(avg => {
              this.averageRating = avg;
            });
          }

        },
        error: (error) => {

          this.toast.error('Failed to submit rating')

          this.isSubmitting = false;
        }
      });
    }


  }
  setRating(rating: number) {
    this.userRating = rating;
    this.submitRating();
  }


}
