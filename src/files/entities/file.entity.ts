import { UUID } from 'crypto';
import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryColumn()
  id: UUID;

  @Column()
  filename: string;

  @Column()
  mime_type: string;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'longblob' })
  data: Buffer;

  @CreateDateColumn()
  created_at: Date;
}
