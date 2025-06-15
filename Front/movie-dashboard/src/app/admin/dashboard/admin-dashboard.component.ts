import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  
  @ViewChild(MovieListComponent) movieListComponent!: MovieListComponent;
  
  ngOnInit(): void {
  }
  onMovieAdded() {
    this.movieListComponent.loadMovies();
  }

  onMovieDeleted() {
    this.movieListComponent.loadMovies();
  }


  

}
