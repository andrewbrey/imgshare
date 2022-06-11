import {
  Controller,
  Post,
  Redirect,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('clean')
  @UseInterceptors(FileInterceptor('file-upload'))
  @Redirect()
  cleanImg(@UploadedFile() file: Express.Multer.File) {
    console.log({ file });

    return { url: '/?thing=blah' };
  }
}
