import { CarrinhoDto } from '../../models/carrinho.dto';
import { StorageService } from './../storage.service';
import { Injectable } from '@angular/core';
import { ProdutoDto } from '../../models/produto.dto';

@Injectable()
export class CarrinhoService {

    constructor(public storageService: StorageService) {
    }

    criarOuLimparCarrinho() : CarrinhoDto {
        let carrinho: CarrinhoDto = {itens: []};
        this.storageService.setCarrinho(carrinho);
        return carrinho;
    }

    getCarrinho() : CarrinhoDto {
        let carrinho: CarrinhoDto = this.storageService.getCarrinho();
        if (carrinho == null) {
            carrinho = this.criarOuLimparCarrinho();
        }
        return carrinho;
    }

    adicionarProduto(produto: ProdutoDto) : CarrinhoDto {
        let carrinho = this.getCarrinho();
        let position = carrinho.itens.findIndex(x => x.produto.id == produto.id);
        if (position == -1) {
            carrinho.itens.push({quantidade: 1, produto: produto});
        }
        this.storageService.setCarrinho(carrinho);
        return carrinho;
    }

    removerProduto(produto: ProdutoDto) : CarrinhoDto {
        let carrinho = this.getCarrinho();
        let position = carrinho.itens.findIndex(x => x.produto.id == produto.id);
        if (position != -1) {
            carrinho.itens.splice(position, 1);
        }
        this.storageService.setCarrinho(carrinho);
        return carrinho;
    }

    aumentarQuantidade(produto: ProdutoDto) : CarrinhoDto {
        let carrinho = this.getCarrinho();
        let position = carrinho.itens.findIndex(x => x.produto.id == produto.id);
        if (position != -1) {
            carrinho.itens[position].quantidade++;
        }
        this.storageService.setCarrinho(carrinho);
        return carrinho;
    }

    diminuirQuantidade(produto: ProdutoDto) : CarrinhoDto {
        let carrinho = this.getCarrinho();
        let position = carrinho.itens.findIndex(x => x.produto.id == produto.id);
        if (position != -1) {
            carrinho.itens[position].quantidade--;
            if (carrinho.itens[position].quantidade < 1) {
                carrinho = this.removerProduto(produto);
            }
        }
        this.storageService.setCarrinho(carrinho);
        return carrinho;
    }

    total() : number {
        let carrinho = this.getCarrinho();
        let sum = 0;
        for (var i=0; i<carrinho.itens.length; i++) {
            sum += carrinho.itens[i].produto.preco * carrinho.itens[i].quantidade;
        }
        return sum;
    }
}