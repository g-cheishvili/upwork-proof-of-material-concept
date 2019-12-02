import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemsService} from '../../services/items.service';
import {DummyItem, DummyItems} from '../../types';
import {TableOutputElement} from '../../modules/ui/types';
import {MatDialog} from '@angular/material';
import {ItemFormComponent} from '../item-form/item-form.component';

@Component({
  selector: 'items-list',
  templateUrl: './items-list.component.html',
})
export class ItemsListComponent implements OnInit, OnDestroy {
  columns: string[] = ['number', 'name', 'description', 'actions'];

  get items(): DummyItems {
    return this.itemsService.getAll();
  }

  constructor(
    private itemsService: ItemsService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  onAdd() {
    const createDialog = this.dialog.open(ItemFormComponent, {
      width: '60vw',
      data: {
        submit: (data: DummyItem) => {
          this.itemsService.create(data);
          createDialog.close();
        }
      }
    });
  }

  onEdit($event: TableOutputElement<DummyItem>) {
    const editDialog = this.dialog.open(ItemFormComponent, {
      width: '60vw',
      data: {
        item: $event,
        submit: (data: DummyItem) => {
          this.itemsService.update($event.elementIndex, data);
          editDialog.close();
        }
      }
    });
  }

  onRemove($event: TableOutputElement<DummyItem>) {
    this.itemsService.remove($event.elementIndex);
  }
}
