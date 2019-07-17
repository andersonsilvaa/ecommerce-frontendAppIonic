import { EnderecoDto } from './../../models/endereco.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { CarrinhoService } from '../../services/domain/carrinho.service';
import { PedidoDto } from '../../models/pedido.dto';

@IonicPage()
@Component({
  selector: 'page-endereco',
  templateUrl: 'endereco.html',
})
export class EnderecoPage {

  itens: EnderecoDto[];

  pedido: PedidoDto;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storageService: StorageService,
    public clienteService: ClienteService,
    public carrinhoService: CarrinhoService) {
  }

  ionViewDidLoad() {
    let usuariologado = this.storageService.getUsuarioLogado();
    if (usuariologado && usuariologado.email) {
      this.clienteService.consultaPorEmail(usuariologado.email)
        .subscribe(response => {
          this.itens = response['enderecos'];

          let carrinho = this.carrinhoService.getCarrinho();

          this.pedido = {
            cliente: {id: response['id']},
            enderecoDeEntrega: null,
            pagamento: null,
            itens : carrinho.itens.map(x => {return {quantidade: x.quantidade, produto: {id: x.produto.id}}})
          }
        },
        error => {
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        });
    }
    else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  nextPage(item: EnderecoDto) {
    this.pedido.enderecoDeEntrega = {id: item.id};
    this.navCtrl.push('PagamentoPage', {pedido: this.pedido});
    console.log(this.pedido);
  }
}