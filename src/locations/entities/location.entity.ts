import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
export type LocationType = 'St' | 'Rc' | 'Ds' | 'Dv' | 'Tn';

@Entity({ name: 'locations' })
@Unique(['name', 'type'])

export class LocationEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 200 })
    @Index()
    name!: string;

    @Column({ type: 'double precision' })
    lat!: number;

    @Column({ type: 'double precision' })
    lng!: number;
  
    @Column({ type: 'varchar', length: 2, nullable: true })
    @Index()
    type?: LocationType | null;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}