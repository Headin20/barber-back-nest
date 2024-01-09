import {ApiProperty} from "@nestjs/swagger";
import {DEFAULT_LIMIT, DEFAULT_OFFSET} from "./const";

export class PaginationOptionsDto {
    @ApiProperty({
        example: DEFAULT_OFFSET,
        description: 'The offset number.',
    })
    offset: number = DEFAULT_OFFSET;
    @ApiProperty({
        example: DEFAULT_LIMIT,
        description: 'The number of items per page.',
    })
    limit: number = DEFAULT_LIMIT;
}