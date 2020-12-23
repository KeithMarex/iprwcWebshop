import {AfterViewInit, Component, Injectable, Input, OnInit, Output} from '@angular/core';
import {ConfigurationService} from "../shared/configuration.service";
import {UserModel} from "../shared/models/user.model";
import {Router} from "@angular/router";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js';
import {EventEmitter} from "@angular/core";
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
@Injectable()
export class HeaderComponent implements OnInit {
  @Input() teller: number;
  @Output() NormalView = new EventEmitter();
  @Output() AccountView = new EventEmitter();
  @Output() WinkelwagenView = new EventEmitter();
  userName: string;

  constructor(public conf: ConfigurationService, private route: Router, private cookieService: CookieService, private http: HttpClient) { }

  ngOnInit(): void {
    if (this.cookieService.get('iprwcLoginEmail') !== ''){
      const postData = JSON.parse(JSON.stringify({email: this.cookieService.get('iprwcLoginEmail'), wachtwoord: this.cookieService.get('iprwcLoginPassword')}));

      this.http.post('http://' + this.conf.hostname + ':3000/user/checkUserLogin', postData).subscribe(responseData => {console.log(responseData);
        if (JSON.parse(JSON.stringify(responseData))['login'] === true){
          const userData = JSON.parse(JSON.stringify(responseData))['result'][0];
          this.conf.user = new UserModel(userData['cart_id'], userData['voornaam'], userData['achternaam'], userData['email'], userData['straatnaam'], Number(userData['huisnummer']), userData['plaatsnaam']);
          this.setName();
        }
      });
    } else {
      this.setName();
    }
  }

  Account() {
    if (this.conf.user){
      this.AccountView.emit();
    } else {
      this.route.navigate(['/klantenpaneel']);
    }
  }

  setName(): void {
    if (this.cookieService.get('iprwcLoginEmail') !== ''){
      this.userName = this.conf.user.voornaam;
    } else {
      this.userName = 'Account';
    }
  }

  Winkelwagen() {
    this.WinkelwagenView.emit();
  }
}
