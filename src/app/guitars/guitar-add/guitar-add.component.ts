import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

import { IGuitarBrand } from '../guitar-brand';
import { GuitarBrandService } from '../guitar-brand.service';
import { IGuitar } from '../guitar';
import { GuitarService } from '../guitar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gtr-guitar-add',
  templateUrl: './guitar-add.component.html',
  styleUrls: ['./guitar-add.component.css']
})
export class GuitarAddComponent implements OnInit {
  @ViewChild(NgForm) editForm: NgForm;
  pageTitle = 'Add Guitar';
  errorMessage: string;
  guitarBrands: IGuitarBrand[];
  guitars: IGuitar[];
  guitarBrand: IGuitarBrand;
  guitar: IGuitar;

  minRatingNum = 0;
  maxRatingNum = 5;
  minStringQty = 4;
  maxStringQty = 12;
  minFretQty = 10;
  maxFretQty = 30;
  minScaleLength = 20;
  maxScaleLength = 30;

  get isDirty(): boolean {
    return this.editForm.dirty;
  }

  constructor(private guitarBrandService: GuitarBrandService,
              private guitarSevice: GuitarService,
              private router: Router) { }

  ngOnInit() {
    this.guitarBrandService.getGuitarBrands().subscribe(
      (data: IGuitarBrand[]) => {
        this.guitarBrands = data;
        if(this.guitarBrands && this.guitarBrands.length) {
          this.guitarBrand = this.guitarBrands[0];
        }
        console.log('Brands = ' + JSON.stringify(data));
      }
    );

    this.guitarSevice.getGuitars().subscribe(
      data => {
        this.guitars = data;
      },
      error => this.errorMessage = <any>error
    );

    this.guitarSevice.getGuitar(0).subscribe(
      (data: IGuitar) => {
        this.guitar = data;
        console.log('Initialized guitar = ' + JSON.stringify(data));
      },
      (error: any) => this.errorMessage = <any>error
    );

    if (this.errorMessage) {
      console.log(this.errorMessage);
    }
  }

  addGuitar(): void {
    if (this.editForm.valid) {
      this.guitar.brandId = this.guitarBrand.id;
      this.guitarSevice.saveGuitar(this.guitar).subscribe(
        () => {
          this.onAddComplete();
        },
        (error: any) => this.errorMessage = <any>error
      );
    }
  }

  cancel() {
    this.router.navigate(['/guitars']);
  }


  private onAddComplete(): void {
    this.editForm.reset(this.editForm.value);
    this.router.navigate(['/guitars']);
  }

  onBrand() {
    console.log('Selected guitar brand = ' + this.guitarBrand.brandName);
  }
}
