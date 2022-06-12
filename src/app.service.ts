import { Injectable, Logger } from '@nestjs/common';
import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(_exec);

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async cleanImg(file: Express.Multer.File) {
    return await exec(`exiftool -all="" ${file.path}`)
      .then(() => file.filename)
      .catch((e) => {
        this.logger.error(e);

        return '';
      });
  }
}
