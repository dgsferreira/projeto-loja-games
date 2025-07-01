import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Produto } from '../entities/produto.entity';
import { ProdutoService } from '../services/produto.service';

@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findByID(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findByID(id);
  }

  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findAllByNome(@Param('nome') nome: string): Promise<Produto[]> {
    return this.produtoService.findAllByNome(nome);
  }

  @Get('/mais-vendidos')
  @HttpCode(HttpStatus.OK)
  getMaisVendidos(@Query('limit') limit = 10): Promise<Produto[]> {
    return this.produtoService.produtosMaisVendidos(Number(limit));
  }

  @Get('/filtrar')
  @HttpCode(HttpStatus.OK)
  filtrarProdutos(
    @Query('precoMin') precoMin?: string,
    @Query('precoMax') precoMax?: string,
    @Query('categoriaId') categoriaId?: string,
    @Query('nome') nome?: string,
    @Query('avaliacaoMin') avaliacaoMin?: string,
  ) {
    const filtro = {
      precoMin: precoMin ? Number(precoMin) : undefined,
      precoMax: precoMax ? Number(precoMax) : undefined,
      categoriaId: categoriaId ? Number(categoriaId) : undefined,
      nome: nome || undefined,
      avaliacaoMin: avaliacaoMin ? Number(avaliacaoMin) : undefined,
    };

    return this.produtoService.filtrarProdutos(filtro);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  created(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.update(produto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.delete(id);
  }
}
