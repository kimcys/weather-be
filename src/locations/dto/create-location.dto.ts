import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateLocationDto {

    @IsString()
    name!: string;

    @IsNumber()
    @Min(-90)
    @Max(90)
    lat!: number;
  
    @IsNumber()
    @Min(-180)
    @Max(180)
    lng!: number;

    @IsOptional()
    @IsString()
    @IsIn(['St', 'Rc', 'Ds', 'Dv', 'Tn'])
    type?: 'St' | 'Rc' | 'Ds' | 'Dv' | 'Tn';
}
