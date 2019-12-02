export interface TableActionButton {
  text?: string,
  iconClass?: string,
  routerLink?: string,
  action?: any,
  disabled?: boolean
  upload?: boolean;
}


export type TableOutputElement<T extends {}> = T & {
  elementIndex: number
}

export type TableCheckOutput<T extends TableOutputElement<any>> = TableOutputElement<T> & {
  element: T,
  checked: boolean,
  column: string
}
