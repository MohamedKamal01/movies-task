import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  currentPage = 0;
  totalPages = 0;
  hasMoreMovies = false;
  checkAllDeleted?: boolean = false;
  movies: any[] = [];            // الأفلام اللي في الداتا بيز
  searchResults: any[] = [];     // نتائج البحث من OMDB
  selection: { [key: number]: boolean } = {};         // اللي مختاره من الداتا بيز (id)

  searchQuery = '';

  constructor(private movieService: MovieService, private toast: ToastService) { }

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
          // لو الصفحة الحالية أكبر من عدد الصفحات بعد الحذف ➜ نرجع صفحة لورا
          if (this.currentPage >= this.totalPages && this.currentPage > 0) {
            this.currentPage--;
            this.loadMovies();
          }
        }
        this.selection = {};
      },
      error: (err) => {
        console.error('Error loading movies:', err);
      }
    });
  }


  toggleAllSelection(event: any) {
    const checked = event.target.checked;
    this.movies.forEach(movie => this.selection[movie.id] = checked);
  }


  deleteMovie(id: number) {
    this.movieService.deleteMovie(id).subscribe(() => {
      this.checkAllDeleted = false;
      this.toast.success('Movie deleted successfully!');

      this.loadMovies()
    });
  }

  batchDelete() {
    const idsToDelete = Object.keys(this.selection)
      .filter(id => this.selection[+id])
      .map(id => +id);

    if (idsToDelete.length === 0) {
      this.toast.error('Please select movies to delete.');
      return;
    }

    this.movieService.deleteMovies(idsToDelete).subscribe(() => {
      this.checkAllDeleted = false;
      this.toast.success('Movies deleted successfully!');

      this.loadMovies();
    });
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
