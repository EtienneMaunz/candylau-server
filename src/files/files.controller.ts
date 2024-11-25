import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UUID } from 'crypto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('filesInfo') filesInfo: string,
  ) {
    await this.filesService.uploadImages(files, JSON.parse(filesInfo));
  }

  @Get('fetchPictures')
  async fetchPictures() {
    return await this.filesService.fetchPictures();
  }

  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.filesService.deleteById(id);
  }
}
