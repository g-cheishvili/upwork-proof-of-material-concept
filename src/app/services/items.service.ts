import {Injectable} from '@angular/core';
import {items} from '../hardcodes';
import {DummyItem, DummyItems} from '../types';


@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  loadedItems: DummyItems;

  constructor() {
    this.loadedItems = items;
  }

  getAll() {
    return this.loadedItems;
  }

  create(data: DummyItem) {
    this.loadedItems = [
      data,
      ...this.loadedItems
    ];
  }

  update(dataIndex: number, updateData: DummyItem) {
    this.loadedItems = [
      ...this.loadedItems.slice(0, dataIndex),
      updateData,
      ...this.loadedItems.slice(dataIndex + 1),
    ];
  }

  remove(index: number) {
    this.loadedItems = [
      ...this.loadedItems.slice(0, index),
      ...this.loadedItems.slice(index + 1),
    ];
  }

}
