import { UUID } from 'crypto';

export interface FilesInfo {
  name: string;
  description: string;
  fileName: string;
}

export interface FileDto {
  id: UUID;
  filename: string;
  mimeType: string;
  type: string;
  name: string;
  description: string;
  data: Buffer;
}
