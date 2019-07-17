import { AuthService } from './../../services/auth.service';
import { CrendenciaisDto } from './../../models/credenciais.dto';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  credenciais: CrendenciaisDto = {email: "", senha: ""};

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public authService: AuthService) {}

  // Desabilita o menu na tela de login
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  // Habilita o menu no momento que o usuário se loga no sistema 
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  // Verifica se o token expirou
  // Se não expirou o sistema pega o token existente e loga no sistema automaticamente
  // não precisando do usuário se logar novamente
  ionViewDidEnter(){
    this.authService.refreshToken()
        .subscribe(response => {
          this.authService.successfulLogin(response.headers.get('Authorization'));
          this.navCtrl.setRoot('CategoriasPage');
        },
        error => {});
  }

  // Verifica se o usuário pode logar no sistema 
  // Se estiver o email e senha no banco de dados o sistema entrará na página de categorias 
  login(){
    this.authService.authenticate(this.credenciais)
        .subscribe(response => {
          this.authService.successfulLogin(response.headers.get('Authorization'));
          this.navCtrl.setRoot('CategoriasPage');
        },
        error => {});
  }

  // Redireciona para a tela para criação de um usário para logar no sistema 
  signup(){
    this.navCtrl.push('SignupPage');
  }

}
