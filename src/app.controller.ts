import {
  Controller,
  Post,
  Redirect,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('clean')
  @UseInterceptors(
    FileInterceptor('file-upload', {
      storage: diskStorage({
        destination(req, file, cb) {
          cb(null, './public/uploads/');
        },
        filename(req, file, cb) {
          cb(null, file.originalname); // Will overwrite files of same name!
        },
      }),
    }),
  )
  @Redirect()
  async cleanImg(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { url: '/' };

    const search = new URLSearchParams({
      img: await this.appService.cleanImg(file),
    });

    return { url: `/?${search}` };
  }
}
