interface IPaginateResult<T> {
  items: T[];
  limit: number;
  totalItems: number;
  offset: number;
}

export class PaginationResult<T> {
  private items: T[];
  private totalItems: number;
  private limit: number;
  private nextOffset: number;

  constructor(data: IPaginateResult<T>) {
    this.items = data.items;
    this.totalItems = data.totalItems;
    this.limit = +data.limit;
    this.nextOffset = +data.offset + +data.limit;
  }
}
