import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from 'typeorm';
import { IsUrl } from 'class-validator';
import { Post } from './Post.ts';
import { User } from './User.ts';

export enum Platforms { twitter, facebook }

@Entity()
export class Reply extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Index()
  id!: number;

  @Column({ type: 'enum', enum: Platforms, default: Platforms.twitter })
  platform!: Platforms;

  @Column()
  platformId!: string;

  @Column({ type: 'jsonb' })
  data!: Object;

  @ManyToOne('Post', 'replies')
  post!: Post;

  @ManyToOne('User', 'replies')
  user!: User;
}
