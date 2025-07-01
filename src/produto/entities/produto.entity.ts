import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity({ name: 'tb_produtos' })
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  nome: string;

  @IsNotEmpty()
  @Column({ length: 1000, nullable: false })
  descricao: string;

  @IsNotEmpty()
  @Column({
    type: 'decimal',
    precision: 19, // total de dígitos (ex: 99999999.99)
    scale: 4, // casas decimais
    nullable: false,
    default: 0,
    transformer: {
      to: (value: number) => value, // ao salvar no banco
      from: (value: string) => parseFloat(value), // ao ler do banco
    },
  })
  preco: number;

  @IsNotEmpty()
  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  vendas: number;

  @IsNotEmpty()
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  avaliacao: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    onDelete: 'CASCADE',
  })
  categoria: Categoria;
}
