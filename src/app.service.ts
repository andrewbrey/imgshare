import { Injectable, Logger } from '@nestjs/common';
import { exec as _exec } from 'node:child_process';
import { parse } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(_exec);

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async cleanImg(file: Express.Multer.File) {
    const parsed = parse(file.path);

    return await exec(
      `exiftool -all="" ${file.path} && mkdir -p ${parsed.dir}/small && convert ${file.path} -resize 1920x1080\\> ${parsed.dir}/small/${file.filename}`,
    )
      .then(() => file.filename)
      .catch((e) => {
        this.logger.error(e);

        return '';
      });
  }
}
