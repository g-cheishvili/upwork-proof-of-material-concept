import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DummyItem} from '../../types';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  form: FormGroup;
  item: DummyItem;
  submit: (data: any) => void;

  nameControl: FormControl = new FormControl();
  descriptionControl: FormControl = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) inputs: any,
  ) {
    this.item = inputs.item;
    this.submit = inputs.submit;

    this.form = new FormGroup({
      name: this.nameControl,
      description: this.descriptionControl
    });

    if (this.item) {
      this.form.patchValue(this.item);
    }
  }

  ngOnInit() {

  }

  onSubmit() {
    if (this.form.valid) {
      this.submit(this.form.value);
    }
  }

}
