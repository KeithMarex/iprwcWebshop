import {Component, Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConfigurationService} from '../../shared/configuration.service';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js';
import {Router} from "@angular/router";
import {UserModel} from "../../shared/models/user.model";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent implements OnInit {
  succes = true;
  type = 'login';

  constructor(private http: HttpClient, private conf: ConfigurationService, private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  onFormSubmit(postData: { email: string; wachtwoord: string }) {
    // Send Http request
    this.http.post(this.conf.hostname + '/user/checkUserLogin', postData).subscribe(responseData => {console.log(responseData);
      if (JSON.parse(JSON.stringify(responseData))['login'] === true){
        this.cookieService.set('iprwcLoginEmail', postData.email);
        this.cookieService.set('iprwcLoginPassword', postData.wachtwoord);
        const userData = JSON.parse(JSON.stringify(responseData))['result'][0];
        this.conf.user = new UserModel(userData['cart_id'], userData['voornaam'], userData['achternaam'], userData['email'], userData['straatnaam'], Number(userData['huisnummer']), userData['plaatsnaam']);
        Swal.fire({title: 'Login succesvol', text:'', icon:'success', timer: 1000});
        console.log(this.conf.user);
        this.router.navigate(['/']);
      } else {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'Je email of wachtwoord combinatie is verkeerd', timer: 1000});
      }
    });
  }

}
