import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConfigurationService} from '../../shared/configuration.service';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [ConfigurationService]
})
export class RegisterComponent implements OnInit {
  @Output() naarLogin = new EventEmitter();

  succes = true;

  constructor(private http: HttpClient, private conf: ConfigurationService) { }

  ngOnInit(): void {
  }

  onFormSubmit(postData: { voornaam: string; achternaam: string, email: string, wachtwoord: string, straatnaam: string, huisnummer: number, plaatsnaam: string }) {
    this.http.post(this.conf.hostname + '/user/create', postData).subscribe(responseData => {
      if (JSON.parse(JSON.stringify(responseData))['create'] === true){
        this.gaNaarLogin()
        Swal.fire('Account aangemaakt', 'Je hebt een account succesvol aangemaakt.', 'success');
      };
    });
  }

  gaNaarLogin (){
    this.naarLogin.emit();
  }
}
