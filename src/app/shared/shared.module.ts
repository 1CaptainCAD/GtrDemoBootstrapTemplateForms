import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StarComponent } from './star.component';
import { MinNumberDirective } from './min-number.directive';
import { MaxNumberDirective } from './max-number.directive';

@NgModule({
  declarations: [
    StarComponent,
    MinNumberDirective,
    MaxNumberDirective
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    StarComponent,
    MinNumberDirective,
    MaxNumberDirective,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
