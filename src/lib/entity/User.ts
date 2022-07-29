import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Subject } from "./Subject";
import { Post } from "./Post";
import { Reply } from "./Reply";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    twitterId!: string;

    @Column()
    name!: string;

    @Column()
    screenname!: string;

    @Column()
    description!: string;

    @Column()
    verified!: boolean;

    @Column()
    twitterCreatedAt!: Date;

    @Column()
    token!: string;

    @Column()
    tokenSecret!: string;

    @Column()
    admin!: boolean;

    @Column({ type: "text", nullable: true })
    avatarUrl?: string | "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";

    @OneToMany('Subject', 'user')
    subjects!: Subject[];

    @OneToMany('Post', 'user')
    posts!: Post[];

    @OneToMany('Reply', 'user')
    replies!: Reply[];
}
