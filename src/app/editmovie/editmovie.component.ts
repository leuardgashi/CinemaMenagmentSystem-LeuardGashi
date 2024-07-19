import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

interface MovieAttributes {
  name: string;
  imageUrl: string;
  synopsis: string;
  year: string;
  genre: string;
}

interface Movie {
  id: number;
  attributes: MovieAttributes;
}

@Component({
  selector: "app-editmovie",
  template: `
    <div class="modal">
      <div class="modal-backdrop" (click)="closeModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Movie</h3>
          <span style="padding: 10px;cursor: pointer;" (click)="closeModal()">X</span>
        </div>
        <div class="modal-body content">
          <form [formGroup]="editMovieForm" (ngSubmit)="editNewMovie()">
            <div class="inputField">
              <div class="label"><label for="name">Name</label></div>
              <div>
                <input id="name" type="text" formControlName="name" />
              </div>
            </div>
            <div class="inputField">
              <div class="label"><label for="imageUrl">ImageUrl</label></div>
              <div>
                <input id="imageUrl" type="text" formControlName="imageUrl" />
              </div>
            </div>
            <div class="inputField">
              <div class="label"><label for="synopsis">Synopsis</label></div>
              <div>
                <input id="synopsis" type="text" formControlName="synopsis" />
              </div>
            </div>
            <div class="inputField">
              <div class="label"><label for="year">Year</label></div>
              <div>
                <input id="year" type="text" formControlName="year" />
              </div>
            </div>
            <div class="inputField">
              <div class="label"><label for="genre">Genre</label></div>
              <div>
                <input id="genre" type="text" formControlName="genre" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" (click)="closeModal()">Cancel</button>
              <button type="submit" [disabled]="editMovieForm.invalid || disable" class="btn">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,

  styles: [
    `
      .label {
        padding: 4px 0;
        font-size: small;
        color: rgb(51, 55, 64);
      }
      .content {
        display: flex;
        flex-wrap: wrap;
      }
      .inputField {
        margin: 3px 7px;
        flex: 1 40%;
      }
    `,
  ],
})

export class EditmovieComponent implements OnInit {
  @Output() closeDialog = new EventEmitter();
  @Output() refreshMovies = new EventEmitter();
  @Input() movie: Movie | null = null;
  editMovieForm: FormGroup;
  disable = false;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.editMovieForm = this.fb.group({
      name: [''],
      imageUrl: [''],
      synopsis: [''],
      year: [''],
      genre: [''],
    });
  }

  ngOnInit(): void {
    if (this.movie && this.movie.attributes) {
      this.editMovieForm.patchValue({
        name: this.movie.attributes.name,
        imageUrl: this.movie.attributes.imageUrl,
        synopsis: this.movie.attributes.synopsis,
        year: this.movie.attributes.year,
        genre: this.movie.attributes.genre,
      });
    }
  }

  editNewMovie() {
    this.disable = true;
    const updatedMovie = this.editMovieForm.value;
    this.http
      .put("http://localhost:1337/api/movies/" + this.movie?.id, { data: updatedMovie })
      .subscribe(
        () => {
          this.disable = false;
          this.closeDialog.emit("");
          this.refreshMovies.emit();
        },
        (err) => {
          console.error('Error updating movie:', err);
          this.disable = false;
        }
      );
  }

  closeModal() {
    this.closeDialog.emit("");
  }
}