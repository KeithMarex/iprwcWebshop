import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'
import {ConfigurationService} from "../../shared/configuration.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-password-forget',
  templateUrl: './password-forget.component.html',
  styleUrls: ['./password-forget.component.scss'],
  providers: [ConfigurationService]
})
export class PasswordForgetComponent implements OnInit {
  @Output() naarLogin = new EventEmitter();

  succes = true;

  constructor(private http: HttpClient, private conf: ConfigurationService) { }

  ngOnInit(): void {
  }

  onFormSubmit(postData: { email: string }) {
    if (postData.email.includes('@')){
      this.http.post(this.conf.hostname + '/user/passReset', postData).subscribe(responseData => {console.log(responseData);
        if (JSON.parse(JSON.stringify(responseData))['reset'] === true){
          Swal.fire('Wachtwoord aangevraagd', 'Controleer je e-mail adres voor een tijdelijk wachtwoord.', 'success');
          this.goToLogin();
        } else {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'Something went wrong!'});
        }
      });
    }
    else {
      this.succes = false;
    }
  }

  goToLogin() {
    this.naarLogin.emit();
  }
}
