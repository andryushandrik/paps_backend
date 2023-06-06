import { IsDateString, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateActionDto {
    

    @ApiProperty({
        description: 'StartTime of an Action',
    })
    @IsOptional()
    @IsDateString({ message: 'Must be DateString' })
    startTime: Date;

    @ApiProperty({
        description: 'EndTime of an Action',
    })
    @IsOptional()
    @IsDateString({ message: 'Must be DateString' })
    endTime: Date;

    @ApiProperty({
        description: 'Id of related Task',
    })
    @IsNumber()
    @Transform(({ value }) => {
        return Number(value);
      })
    taskId: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => {
        return Number(value);
      })
    userId: number;

}
