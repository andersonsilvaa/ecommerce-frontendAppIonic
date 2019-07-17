import { CarrinhoItem } from './carrinho-item';
import { ProdutoDto } from './produto.dto';

export interface CarrinhoDto {
    itens: CarrinhoItem[];
}