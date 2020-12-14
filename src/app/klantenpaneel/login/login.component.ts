import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConfigurationService} from '../../shared/configuration.service';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ConfigurationService]
})
export class LoginComponent implements OnInit {
  succes = true;
  type = 'login';

  constructor(private http: HttpClient, private conf: ConfigurationService) { }

  ngOnInit(): void {
  }

  onFormSubmit(postData: { email: string; wachtwoord: string }) {
    // Send Http request
    this.http.post('http://' + this.conf.hostname + ':3000/user/checkUserLogin', postData).subscribe(responseData => {console.log(responseData);
      if (JSON.parse(JSON.stringify(responseData))['login'] === true){
        Swal.fire('Login succesvol', '', 'success');
      };
    });
  }

}
