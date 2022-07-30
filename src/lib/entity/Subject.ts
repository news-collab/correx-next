import { v4 } from 'uuid';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, ManyToOne } from 'typeorm';
import { IsUrl, IsUUID } from 'class-validator';
import { Post } from './Post.ts';
import { User } from './User.ts';
import metascraperFactory from 'metascraper';
import metascraperAuthor from 'metascraper-author';
import metascraperDate from 'metascraper-date';
import metascraperPublisher from 'metascraper-publisher';
import metascraperTitle from 'metascraper-title';
import metascraperURL from 'metascraper-url';
import axios from 'axios';

/*
const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
])

*/

const metascraper = metascraperFactory([
  metascraperAuthor(),
  metascraperDate(),
  metascraperPublisher(),
  metascraperTitle(),
  metascraperURL()
]);

/*

  Okay!  So what do we need this to do?  We need to be able to take URLs.

  we need to know: 

  - which user submitted it.
  - when the user submitted it.
  - which social media posts are attached to it.

  Ideally we can grab a snapshot of the page and parse out some HTML to grab:

  - Title
  - a social card?

 */


@Entity()
export class Subject {

  @PrimaryGeneratedColumn()
  @Index()
  id!: number;

  @Column()
  @Index()
  @IsUrl()
  url!: string;

  @Column()
  @IsUUID("4")
  @Index()
  uuid!: string;

  @Column({ type: "jsonb", default: {} })
  @Index()
  metadata!: {
    title?: string,
  }

  @Column()
  createdAt!: Date;

  @OneToMany('Post', 'subject')
  posts!: Post[];

  @ManyToOne('User', 'subjects')
  user!: User;

  constructor(user: User, url: string) {
    this.user = user;
    this.url = url;
  }

  title() {
    return (this.metadata.title || this.uuid);
  }

  async extractMetadata() {
    const response = await axios.get(this.url, {
      headers: {
        'User-Agent': 'asu-correx / 1.0.0'
      }
    });
    const html = response.data;
    const result = await metascraper({ html, url: this.url });
    return result;
  }
}
