import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Index, ManyToOne, OneToMany, EntitySchema } from 'typeorm';
import { IsUrl } from 'class-validator';
import { Reply } from './Reply';
import { Subject } from './Subject';
import { User } from './User';

/* 
  What do we need to know about social media posts?

  - When we searched for the post
  - 
 */

export enum Platforms { twitter, facebook }

/*export interface Post {
  id: number;
  platform: Platforms;
}

export const PostEntity = new EntitySchema<Post>({
  name: "post",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    platform: {
      type: 'enum',
      enum: Platforms,
      default: Platforms.twitter
    },
    platformId: {
      type: String
    },
    url: {
      type: String,
      index: {

      }
    }
  }
});*/

@Entity()
export class Post extends BaseEntity {

  @PrimaryGeneratedColumn()
  @Index()
  id!: number;

  @Column({ type: 'enum', enum: Platforms, default: Platforms.twitter })
  platform!: Platforms;

  @Column()
  platformId!: string;

  @Column()
  @Index()
  @IsUrl()
  url!: string;

  @Column({ default: false })
  starred!: boolean;

  @Column({ type: 'jsonb' })
  data!: Object;

  @ManyToOne('Subject', 'posts')
  subject!: Subject;

  @ManyToOne('User', 'posts')
  user!: User;

  @OneToMany('Reply', 'post')
  replies!: Reply[];
}
