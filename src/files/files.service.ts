import { Injectable, NotFoundException } from '@nestjs/common';
import { FileDto, FilesInfo } from './dto/file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/files/entities/file.entity';
import { Repository } from 'typeorm';
import { randomUUID, UUID } from 'crypto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  async uploadImages(
    files: Array<Express.Multer.File>,
    filesInfo: FilesInfo[],
  ) {
    const dtos: FileDto[] = files.map((file, index) => {
      const fileInfo = filesInfo[index];

      return {
        id: randomUUID(),
        name: fileInfo.name,
        filename: fileInfo.fileName,
        type: 'image',
        mimeType: file.mimetype,
        data: file.buffer,
        description: fileInfo.description,
      };
    });

    const entities: File[] = dtos.map((dto) => ({
      id: randomUUID(),
      name: dto.name,
      filename: dto.filename,
      type: dto.type,
      mime_type: dto.mimeType,
      data: dto.data,
      description: dto.description,
      created_at: new Date(),
    }));

    await this.filesRepository.insert(entities);
  }

  async fetchPictures(): Promise<
    {
      id: string;
      name: string;
      description: string;
      base64: string;
      createdAt: Date;
    }[]
  > {
    const pictures = await this.filesRepository.find({
      where: {
        type: 'image',
      },
    });

    return pictures.map((picture) => ({
      id: picture.id,
      base64: picture.data.toString('base64'),
      name: picture.name,
      description: picture.description,
      createdAt: picture.created_at,
    }));
  }

  async deleteById(id: UUID): Promise<void> {
    const file = await this.filesRepository.findOneBy({
      id,
    });

    if (!file) {
      throw new NotFoundException();
    }

    await this.filesRepository.delete({ id: file.id });
  }
}
