import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChangeDoneStatusActivityDTO {
  @ApiProperty()
  @IsBoolean({ message: 'Status precisa ser um booleano' })
  is_done: boolean;
}
