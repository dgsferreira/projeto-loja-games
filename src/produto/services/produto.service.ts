import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { CategoriaService } from '../../categoria/services/categoria.service';
import { Produto } from '../entities/produto.entity';

interface FiltroProduto {
  precoMin?: number;
  precoMax?: number;
  categoriaId?: number;
  nome?: string;
  avaliacaoMin?: number;
}

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private categoriaService: CategoriaService,
  ) {}

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  async findByID(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: {
        id,
      },
      relations: {
        categoria: true,
      },
    });

    if (!produto) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    return produto;
  }

  async findAllByNome(nome: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
      relations: {
        categoria: true,
      },
    });
  }

  async produtosMaisVendidos(limit = 10): Promise<Produto[]> {
    return this.produtoRepository.find({
      order: {
        vendas: 'DESC',
      },
      take: limit,
      relations: ['categoria'],
    });
  }

  async filtrarProdutos(filtro: FiltroProduto): Promise<Produto[]> {
    const queryBuilder = this.produtoRepository
      .createQueryBuilder('produto')
      .leftJoinAndSelect('produto.categoria', 'categoria');

    if (filtro.precoMin !== undefined) {
      queryBuilder.andWhere('produto.preco >= :precoMin', {
        precoMin: filtro.precoMin,
      });
    }

    if (filtro.precoMax !== undefined) {
      queryBuilder.andWhere('produto.preco <= :precoMax', {
        precoMax: filtro.precoMax,
      });
    }

    if (filtro.categoriaId !== undefined) {
      queryBuilder.andWhere('produto.categoriaId = :categoriaId', {
        categoriaId: filtro.categoriaId,
      });
    }

    if (filtro.nome) {
      queryBuilder.andWhere('produto.nome LIKE :nome', {
        nome: `%${filtro.nome}%`,
      });
    }

    if (filtro.avaliacaoMin !== undefined) {
      queryBuilder.andWhere('produto.avaliacao >= :avaliacaoMin', {
        avaliacaoMin: filtro.avaliacaoMin,
      });
    }

    return queryBuilder.getMany();
  }

  async create(produto: Produto): Promise<Produto> {
    await this.categoriaService.findById(produto.categoria.id);
    return await this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    await this.findByID(produto.id);

    await this.categoriaService.findById(produto.categoria.id);

    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findByID(id);

    return await this.produtoRepository.delete(id);
  }
}
