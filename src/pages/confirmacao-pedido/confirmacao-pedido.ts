import { PedidoService } from './../../services/domain/pedido.service';
import { CarrinhoService } from './../../services/domain/carrinho.service';
import { EnderecoDto } from './../../models/endereco.dto';
import { ClienteDto } from './../../models/cliente.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDto } from '../../models/pedido.dto';
import { CarrinhoItem } from '../../models/carrinho-item';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-confirmacao-pedido',
  templateUrl: 'confirmacao-pedido.html',
})
export class ConfirmacaoPedidoPage {

  pedido: PedidoDto;
  carrinhoItens: CarrinhoItem[];
  cliente: ClienteDto;
  endereco: EnderecoDto;
  codpedido: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public clienteService: ClienteService,
    public carrinhoService: CarrinhoService,
    public pedidoService: PedidoService) {

    this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    this.carrinhoItens = this.carrinhoService.getCarrinho().itens;

    this.clienteService.consultaPorId(this.pedido.cliente.id)
      .subscribe(response => {
        this.cliente = response as ClienteDto;
        this.endereco = this.consultarEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
      },
      error => {
        this.navCtrl.setRoot('HomePage');
      });
  }

  private consultarEndereco(id: string, list: EnderecoDto[]) : EnderecoDto {
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }

  total() : number {
    return this.carrinhoService.total();
  } 

  voltar() {
    this.navCtrl.setRoot('CarrinhoPage');
  }

  home() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  confirmarPedido() {
    this.pedidoService.salvar(this.pedido)
      .subscribe(response => {
        this.carrinhoService.criarOuLimparCarrinho();
        this.codpedido = this.extractId(response.headers.get('location'));
      },
      error => {
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
  }

  private extractId(location : string) : string {
    let position = location.lastIndexOf('/');
    return location.substring(position + 1, location.length);
  }
}