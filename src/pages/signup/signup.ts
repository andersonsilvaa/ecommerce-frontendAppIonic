import { EnderecoDto } from './../../models/endereco.dto';
import { ClienteDto } from './../../models/cliente.dto';
import { ClienteService } from './../../services/domain/cliente.service';
import { EstadoDto } from './../../models/estado.dto';
import { CidadeDto } from './../../models/cidade.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';
import { TelefoneDto } from '../../models/telefone.dto';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDto[];
  cidades: CidadeDto[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public clienteService: ClienteService,
    public cidadeService: CidadeService,
    public estadoService: EstadoService,
    public alertCtrl: AlertController) {

  this.formGroup = this.formBuilder.group({
    nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
    email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
    tipo : ['1', [Validators.required]],
    cpfOuCnpj : ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
    senha : ['123', [Validators.required]],
    logradouro : ['Rua Via', [Validators.required]],
    numero : ['25', [Validators.required]],
    complemento : ['Apto 3', []],
    bairro : ['Copacabana', []],
    cep : ['10828333', [Validators.required]],
    telefone1 : ['977261827', [Validators.required]],
    telefone2 : ['', []],
    telefone3 : ['', []],
    estadoId : [null, [Validators.required]],
    cidadeId : [null, [Validators.required]]      
  });
}

  ionViewDidLoad() {
    this.estadoService.consultaTodos()
      .subscribe(response => {
        this.estados = response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id);
        this.atualizarCidades();
      },
      error => {});
  }

  atualizarCidades() {
    let estadoId = this.formGroup.value.estadoId;
    this.cidadeService.consultaCidadesPorEstado(estadoId)
      .subscribe(response => {
        this.cidades = response;
        this.formGroup.controls.cidadeId.setValue(null);
      },
      error => {});
  }

  salvarUsuario() {
    let cliente: ClienteDto = this.formGroupToCliente();
    this.clienteService.salvar(cliente)
      .subscribe(response => {
        this.showInsertOk();
      },
      error => {});
  }

  formGroupToCliente(): ClienteDto {
    let cliente: ClienteDto = {
      id: null,
      nome: this.formGroup.value.nome,
      email: this.formGroup.value.email,
      tipo: this.formGroup.value.tipo,
      cpfOuCnpj: this.formGroup.value.cpfOuCnpj,
      senha: this.formGroup.value.senha
    };

    let estado: EstadoDto = {
      id: this.formGroup.value.estadoId,
      descricao: null
    }

    let cidade: CidadeDto = {
      id: this.formGroup.value.cidadeId,
      descricao: null
    }

    let endereco: EnderecoDto = {
      id: null,
      logradouro: this.formGroup.value.logradouro,
      numero: this.formGroup.value.numero,
      complemento: this.formGroup.value.complemento,
      bairro: this.formGroup.value.bairro,
      cep: this.formGroup.value.cep
    }

    let telefones: Array<TelefoneDto> = [];

    let primeiroTelefone: TelefoneDto = {
      numero: this.formGroup.value.telefone1
    }
    let segundoTelefone: TelefoneDto = {
      numero: this.formGroup.value.telefone2
    }
    let terceiroTelefone: TelefoneDto = {
      numero: this.formGroup.value.telefone3
    }

    telefones.push(primeiroTelefone);
    telefones.push(segundoTelefone);
    telefones.push(terceiroTelefone);
    
    cidade.estado = estado;
    cliente.cidade = cidade;
    cliente.endereco = endereco;
    cliente.telefones = telefones;
   
    return cliente;
  }

  showInsertOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }
}
