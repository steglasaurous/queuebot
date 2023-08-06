import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Channel {
    @PrimaryColumn()
    channelName: string;

    @Column()
    joinedOn: Date;
}
