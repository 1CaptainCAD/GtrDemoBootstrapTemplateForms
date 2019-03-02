import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';

import {IGuitar} from '../guitar';
import {IGuitarBrand} from '../guitar-brand';
import {GuitarService} from '../guitar.service';
import {GuitarBrandService} from '../guitar-brand.service';

@Component({
  selector: 'gtr-guitar-edit',
  templateUrl: './guitar-edit.component.html',
  styleUrls: ['./guitar-edit.component.css']
})
export class GuitarEditComponent implements OnInit {
  @ViewChild(NgForm) editForm: NgForm;
  pageTitle = 'Guitar Edit';
  errorMessage: string;
  guitar: IGuitar;
  guitarBrand: IGuitarBrand;
  private originalGuitar: IGuitar;
  minNum = 0;
  maxNum = 5;

  get isDirty(): boolean {
    return this.editForm.dirty;
  }

  constructor(private guitarService: GuitarService,
              private guitarBrandService: GuitarBrandService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getGuitar(id);
    }
  }

  getGuitar(id: number) {
    this.guitarService.getGuitar(id).subscribe(
      guitar => {
        this.guitar = guitar;
        this.pageTitle += ' ' + this.guitar.modelNumber;
      },
      error => this.errorMessage = <any>error
    );

    if (this.guitar) {
      this.guitarBrandService.getGuitarBrand(this.guitar.brandId).subscribe(
        brand => {
          this.guitarBrand = brand;
          this.pageTitle = `Editing ${this.guitarBrand.brandName} Guitar - Model # ${this.guitar.modelNumber}`;
        },
        error => this.errorMessage = <any>error
      );
    }
  }

  saveGuitar(): void {
    if (this.editForm.valid) {
      this.guitarService.saveGuitar(this.guitar)
        .subscribe(() => {
            // Assign the changes from the copy
            // Object.keys(this.guitar).forEach(key =>
            //   this.originalGuitar[key] = this.guitar[key]
            // );
            this.onSaveComplete();
          },
          (error: any) => this.errorMessage = <any>error
        );
    } else {
      this.errorMessage = 'Please correct the validation errors';
    }
  }

  cancel(): void {
    this.router.navigate(['/guitars']);
  }

  deleteGuitar() {
    if (this.guitar.id) {
      if (confirm(`Really delete guitar model # ${this.guitar.modelNumber}?`)) {
        this.guitarService.deleteGuitar(this.guitar.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    } else {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.editForm.reset(this.editForm.value);
    this.router.navigate(['/guitars']);
  }
}
