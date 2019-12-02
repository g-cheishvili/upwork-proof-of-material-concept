import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ItemsListComponent} from '../../components/items-list/items-list.component';

@Component({
  templateUrl: './index.page.html',
  styles: [
      `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        justify-content: center;
      }
    `
  ]
})
export class IndexPage implements OnInit {

  constructor(
    private dialogService: MatDialog
  ) {
  }

  ngOnInit() {
  }

  openListModal() {
    this.dialogService.open(ItemsListComponent, {
      width: '70vw',
    });
  }
}
