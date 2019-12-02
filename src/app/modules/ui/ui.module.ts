import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {BasicTableComponent} from './components/basic-table/basic-table.component';
import {RouterModule} from '@angular/router';
import {UtilsModule} from '../utils/utils.module';


@NgModule({
  declarations: [
    BasicTableComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    MatCheckboxModule,
    RouterModule.forChild([]),
    MatPaginatorModule,
    UtilsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    BasicTableComponent
  ]
})
export class UiModule {
}
