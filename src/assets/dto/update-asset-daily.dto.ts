import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetDailyDto } from './create-asset-daily.dto';

export class UpdateAssetDailyDto extends PartialType(CreateAssetDailyDto) { }
