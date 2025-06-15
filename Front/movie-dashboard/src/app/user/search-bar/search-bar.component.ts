import { Component, EventEmitter, Output } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  query: string = '';
  @Output() search = new EventEmitter<Movie[]>();

  constructor(private movieService: MovieService, private toast: ToastService) { }

  onSearch() {
    if (!this.query.trim()) return;
    this.movieService.searchMovies(this.query.trim()).subscribe({

      next: movies => {
        this.search.emit(movies)
      },
      error: () => this.toast.error('Search failed')

    });
  }
}
