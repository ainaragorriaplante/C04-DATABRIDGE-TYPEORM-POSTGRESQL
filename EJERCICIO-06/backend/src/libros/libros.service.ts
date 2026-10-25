// libros.service.ts
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';
import { UpdateLibroDto } from './update-libro.dto';

@Injectable()
export class LibrosService implements OnModuleInit {
  constructor(
    @InjectRepository(Libro)
    private readonly repository: Repository<Libro>,
  ) {}

  async onModuleInit() {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          titulo: '1984',
          autor: 'George Orwell',
          genero: 'Distopía',
          leido: false,
        }),
        this.repository.create({
          titulo: 'Dune',
          autor: 'Frank Herbert',
          genero: 'Ciencia ficción',
          leido: false,
        }),
      ]);
    }
  }

  findAll(): Promise<Libro[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async update(id: number, dto: UpdateLibroDto): Promise<Libro> {
    const libro = await this.repository.findOneBy({ id });
    if (!libro) throw new NotFoundException('Libro no encontrado');

    this.repository.merge(libro, dto);
    return this.repository.save(libro);
  }

  async remove(id: number): Promise<void> {
    const libro = await this.repository.findOneBy({ id });
    if (!libro) throw new NotFoundException('Libro no encontrado');
    await this.repository.remove(libro);
  }
}
