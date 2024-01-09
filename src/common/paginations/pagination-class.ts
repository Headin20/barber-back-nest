import {DEFAULT_LIMIT, DEFAULT_OFFSET, MAX_LIMIT} from "./const";

export class Pagination {
    constructor(
        public offset: number = DEFAULT_OFFSET,
        public limit: number = DEFAULT_LIMIT,
    ) {
        this.limit = Math.min(this.limit, MAX_LIMIT);
        this.offset = Math.max(this.offset, DEFAULT_OFFSET);
    }
}