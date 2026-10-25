// mascota.entity.ts
// RESPONSABILIDAD: definir la información persistente de una mascota.
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  raza: string;

  @Column()
  edad: number;

  @Column()
  ciudad: string;

  // Paso 1: nuevo campo VARCHAR en PostgreSQL.
  @Column()
  nivelEnergia: string;
}
