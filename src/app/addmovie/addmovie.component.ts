import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-addmovie",
  template: `
    <div class="modal">
      <div class="modal-backdrop" (click)="closeModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add Movie</h3>
          <span style="padding: 10px;cursor: pointer;" (click)="closeModal()">X</span>
        </div>
        <div class="modal-body content">
          <form [formGroup]="addMovieForm" (ngSubmit)="addNewMovie()">
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
              <button type="submit" [disabled]="addMovieForm.invalid || disable" class="btn">Add</button>
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

export class AddmovieComponent implements OnInit {
  @Output() closeDialog = new EventEmitter();
  @Output() refreshMovies = new EventEmitter();
  addMovieForm: FormGroup;
  disable = false;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.addMovieForm = this.fb.group({
      name: [''],
      imageUrl: [''],
      synopsis: [''],
      year: [''],
      genre: [''],
    });
  }

  ngOnInit(): void {}

  addNewMovie() {
    this.disable = true;
    const newMovie = this.addMovieForm.value;
    this.http.post("http://localhost:1337/api/movies", { data: newMovie }).subscribe(
      (data) => {
        this.disable = false;
        this.refreshMovies.emit("");
        this.closeDialog.emit("");
      },
      (err) => {
        this.disable = false;
      }
    );
  }

  closeModal() {
    this.closeDialog.emit("");
  }
}