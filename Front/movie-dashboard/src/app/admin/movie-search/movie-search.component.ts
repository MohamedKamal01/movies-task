// movie-search.component.ts
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']

})
export class MovieSearchComponent {
  query = '';
  checkAllAdded?: boolean = false;
  searchResults: any[] = [];
  searchSelection: { [key: string]: boolean } = {};   // اللي مختاره من بحث OMDB (imdbID)
  @ViewChild(MovieListComponent) movieListComponent!: MovieListComponent;

  @Output() movieAdded = new EventEmitter<void>();
  searchCriteria = {
    title: '',
    year: '',
    plot: ''
  };

  constructor(private movieService: MovieService, private toast: ToastService) { }

  search() {
    const { title, year, plot } = this.searchCriteria;
    if (!title && !year && !plot) {
      this.toast.error('Please enter at least one search criteria');
      return;
    }

    const queryParams = [`s=${encodeURIComponent(title)}`];

    if (year) queryParams.push(`y=${encodeURIComponent(year)}`);
    if (plot) queryParams.push(`plot=${encodeURIComponent(plot)}`);

    const fullQuery = queryParams.join('-');


    this.movieService.searchOmdbMovies(fullQuery).subscribe(res => {

      this.searchResults = res.Search || [];
      this.searchSelection = {};

    });
  }

  addMovie(imdbId: string) {
    this.movieService.addMovie(imdbId).subscribe(() => {
      this.toast.success('Movie added successfully!');
      this.movieAdded.emit();
      this.checkAllAdded = false;

    }, err => {

      if (err.status === 409) {
        this.toast.error(err.error)
      }
      else {
        this.toast.error('Failed to add movie');

      }

    });
  }
  toggleAllSearchSelection(event: any) {
    const checked = event.target.checked;
    this.searchResults.forEach(movie => this.searchSelection[movie.imdbID] = checked);
  }

  batchAdd() {
    const imdbIdsToAdd = Object.keys(this.searchSelection)
      .filter(id => this.searchSelection[id]);

    if (imdbIdsToAdd.length === 0) {
      this.toast.error('Please select movies to add.')
      return;
    }

    this.movieService.addMovies(imdbIdsToAdd).subscribe(() => {
      debugger
      this.toast.success('Movies added successfully!')
      this.movieAdded.emit();
      this.checkAllAdded = false;
      this.searchResults.forEach(movie => this.searchSelection[movie.imdbID] = false);


    });
  }
}
