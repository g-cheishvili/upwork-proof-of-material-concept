import {animate, state, style, transition, trigger} from '@angular/animations';
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {MatCheckboxChange, PageEvent, Sort, SortDirection} from '@angular/material';
import {select, sum} from '../../../utils/helpers/functions';
import {TableActionButton, TableCheckOutput, TableOutputElement} from '../../types';

@Component({
  selector: 'ui-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', overflow: 'hidden', opacity: 0})),
      state('*', style({height: 'auto', opacity: 1})),
      transition('* <=> void', animate('225ms 0s linear')),
    ]),
  ],
})
export class BasicTableComponent implements OnInit, AfterViewInit {
  providedColumns: any[];
  displayColumns: any[];
  expandedElement: any;
  expandedElements: Set<any> = new Set<any>();
  mExpandable: boolean;
  mSelectable: boolean;
  mSelected: Map<string, any>;
  highlightedElements: Set<any> = new Set<any>();
  allColumns: string[] = [];

  _data: any[] = [];

  _ghostElements = Array(3);

  @Input() set ghostSize(size: number) {
    this._ghostElements = Array(size);
  }

  @Input('config') rowConfig: { [key: string]: { label?: string, type?: 'basic' | 'link' | 'links' | 'attachments' | 'value' | 'checkbox' } } = {};
  @Input('footerConfig') footerConfig: { [key: string]: { label?: string, type?: 'basic' | 'link' | 'links' | 'attachments' | 'value' | 'checkbox' } } = {};

  @Input() set data(data: any[]) {
    this._data = data;
    this.setHighlightedElements();
  }

  get data() {
    return this._data;
  }

  @Input() footerData: { [key: string]: string };
  @Input() actionsMap: Map<any, TableActionButton[]> = new Map();
  @Input() actions: TableActionButton[] = [];
  // @Input() actionsMap: Map<any, TableActionButton[]> = new Map();
  @Input() footerActions: TableActionButton[] = [];
  @Input() identifier: 'sum' | 'id' | string = 'id';
  @Input() expandedTemplate: TemplateRef<any>;
  @Input() multiExpanded = false;
  @Input() canAdd = false;

  @Input() hasPaginator: boolean = false;
  @Input() totalElements: number;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;

  @Input() highlightWhen: (element: any) => boolean;
  @Input() editableColumns: boolean = false;

  @Input() sorted: { column: string, direction: SortDirection };
  @Input() sortableColumns: Map<string, string> = new Map<string, string>();

  @Output() expand = new EventEmitter();
  @Output() select = new EventEmitter<any | any[]>();
  @Output() edit = new EventEmitter<TableOutputElement<any>>();
  @Output() remove = new EventEmitter<TableOutputElement<any>>();
  @Output() rowClick = new EventEmitter();
  @Output() add = new EventEmitter();
  @Output() onInsertBefore = new EventEmitter();
  @Output() onInsertAfter = new EventEmitter();
  @Output() checkChange = new EventEmitter<TableCheckOutput<any>>();
  @Output() pageChange = new EventEmitter<{ page: number; size: number }>();
  @Output() sortChange = new EventEmitter<{ column: string, direction: string }>();

  @Input() multipleSelectable = false;

  @Input()
  set expandable(value: boolean) {
    this.mExpandable = value !== false;
  }

  @Input()
  set selectable(value: boolean) {
    this.mSelectable = value !== false;
  }

  _selectedElement: any | any[];

  @Input()
  set selected(element: any | any[]) {
    this._selectedElement = element;
    if (!Array.isArray(element)) {
      this.mSelected = new Map([
        [this.getIdentifier(element), element]
      ]);
    } else {
      const elements = [];
      element.forEach(el => {
        elements.push([this.getIdentifier(el), el]);
      });
      this.mSelected = new Map(elements);
    }
  }

  @Input()
  set columns(columns: any[]) {
    this.providedColumns = columns.filter(c => c !== 'actions' && c !== 'number');
    if (this.allColumns.length === 0) {
      this.allColumns = columns;
      this.visibleColumns = new Set(columns);
    }
    this.displayColumns = [
      ...(this.mExpandable || this.multiExpanded ? ['expandableCol'] : []),
      ...(this.mSelectable ? ['selectable'] : []),
      ...columns
    ];
  }

  visibleColumns: Set<string> = new Set();

  expandIcon(element: any): string {
    const itemExpanded = this.multiExpanded ? this.expandedElements.has(this.getIdentifier(element)) : this.expandedElement === this.getIdentifier(element);
    return itemExpanded ? 'unfold_less' : 'unfold_more';
  }

  constructor() {
  }

  ngOnInit(): void {
    if (this.canAdd) {
      this.footerActions = [
        ...this.footerActions,
        {
          iconClass: 'fas fa-plus',
          action: () => this.add.emit()
        }
      ];
    }

    this.setHighlightedElements();
  }

  setHighlightedElements() {
    this.highlightedElements.clear();
    if (this.highlightWhen && typeof this.highlightWhen == 'function') {
      for (const element of (this.data || [])) {
        if (this.highlightWhen(element)) {
          this.highlightedElements.add(this.getIdentifier(element));
        }
      }
    }
  }

  getIdentifier(el) {
    if (el) {
      return this.identifier === 'sum' ? sum(el) : <string> el[this.identifier];
    }
    return undefined;
  }

  getActionButtons(el) {
    return this.actionsMap.get(this.getIdentifier(el));
  }

  ngAfterViewInit() {
    if (this._selectedElement) {
      this.select.emit(this._selectedElement);
    }
  }

  actionButtonClicked(event, button, element: any = null) {
    if (element) {
      button.action(button, element, event);
    } else {
      button.action(button, event);
    }
  }

  footerActionButtonClicked(e, button) {
    e.stopPropagation();
    button.action();
  }

  extract(key: string, object: {}) {
    return select(key, object);
  }

  toggleElement(element) {
    if (this.mExpandable) {
      this.toggleExpansion(element);
    }
    // if (this.mSelectable) {
    //   this.toggleSelection(element);
    // }
    this.rowClick.emit(element);
  }

  display(element = {}, column) {
    let v = element[column];

    if (v === void 0) {
      v = this.extract(column, element);
    }

    if (v === true) {
      return 'yes';
    }

    if (v === false) {
      return 'no';
    }

    return v;
  }

  private toggleExpansion(element) {
    if (this.multiExpanded) {
      this.updateExpandedElements(element);
    } else {
      this.updateExpandedElement(element);
    }
  }

  updateExpandedElement(element) {
    const elIdentifier = this.getIdentifier(element);
    if (this.expandedElement !== elIdentifier) {
      this.expand.emit(element);
      this.expandedElement = elIdentifier;
    } else {
      this.expandedElement = void 0;
    }
  }

  updateExpandedElements(element) {
    const elIdentifier = this.getIdentifier(element);
    if (!this.expandedElements.has(elIdentifier)) {
      this.expand.emit(element);
      this.expandedElements.add(elIdentifier);
    } else {
      this.expandedElements.delete(elIdentifier);
    }
  }

  toggleSelection(element) {
    const identifier = this.getIdentifier(element);
    const selectAction = !this.mSelected.has(identifier);

    if (!this.multipleSelectable) {
      this.mSelected.clear();
      this._selectedElement = element;
    }

    selectAction ? this.mSelected.set(identifier, element) : this.mSelected.delete(identifier);

    if (this.multipleSelectable) {
      this.select.emit([...this.mSelected.values()]);
    } else {
      this.select.emit(selectAction ? element : undefined);
    }
  }

  toggleAllSelection($event: MatCheckboxChange) {
    if ($event) {
      if ($event.checked) {
        const elements = [];
        this.data.forEach(d => elements.push([this.getIdentifier(d), d]));
        this.mSelected = new Map<string, any>(elements);
      } else {
        this.mSelected.clear();
      }
      this.select.emit([...this.mSelected.values()]);
    }
  }

  onRemove(element: any, index: number) {
    this.remove.emit({
      ...element,
      elementIndex: index
    });
  }

  checkboxValueChanged(element: any, matCheckbox: MatCheckboxChange, column: string, elementIndex: number) {
    this.checkChange.emit({
      element,
      checked: matCheckbox.checked,
      column,
      elementIndex
    });
  }

  pageChanged($event: PageEvent) {
    this.pageChange.emit({page: $event.pageIndex, size: $event.pageSize});
  }

  toggleColumnVisibility(columnName: string, state: MatCheckboxChange) {
    if (state.checked) {
      this.visibleColumns.add(columnName);
    } else {
      this.visibleColumns.delete(columnName);
    }

    this.columns = this.allColumns.filter((col) => this.visibleColumns.has(col));
  }

  sortChanged($event: Sort) {
    this.sortChange.emit({column: $event.active, direction: $event.direction});
  }

  toggleAllElementExpansion() {
    if (this.expandedElements.size > 0) {
      this.expandedElements = new Set<any>();
    } else {
      this.expandedElements = new Set<any>(this.data.map(r => this.getIdentifier(r)));
    }
  }

  onEdit(element: any, index: number) {
    this.edit.emit({
      ...element,
      elementIndex: index
    });
  }
}

