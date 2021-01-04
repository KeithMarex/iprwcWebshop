import {Component, OnInit, Output, EventEmitter,} from '@angular/core';
import {ConfigurationService} from "../../shared/configuration.service";
import {CookieService} from "ngx-cookie-service";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Output() switchHome = new EventEmitter();

  constructor(public conf: ConfigurationService, private cookie: CookieService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  logUit() {
    this.cookie.delete('iprwcLoginEmail');
    this.cookie.delete('iprwcLoginPassword');
    this.conf.user = null;
    Swal.fire({
      backdrop: false,
      position: 'top-end',
      icon: 'info',
      title: 'Uitgelogd',
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1500
    })
    this.switchHome.emit();
  }

  slaGegevensOp(postData: { inputEmail: string, inputVoornaam: string, inputAchternaam: string, inputStraat: string, inputHuisnummer: number, inputPlaats: string}) {
    let data = { postData, cart_id: this.conf.user.cart_id}
    this.http.post(this.conf.hostname + '/user/update', data).subscribe(responseData => {
      if (responseData['succes']){
        Swal.fire({
          backdrop: false,
          position: 'top-end',
          icon: 'success',
          title: 'Informatie opgeslagen',
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
          backdrop: false,
          position: 'top-end',
          icon: 'error',
          title: 'Er heeft zich een probleem voorgedaan',
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  veranderWachtwoord() {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Volgende &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
    }).queue([
      {
        title: 'Voer je oude wachtwoord in',
      },
      'Voer je nieuwe wachtwoord in',
      'Herhaal je nieuwe wachtwoord'
    ]).then((result) => {
      // @ts-ignore
      if (result.value) {
        // @ts-ignore
        const answers = JSON.parse(JSON.stringify(result.value))
        // TODO add confirm previous password
        if (answers[1] === answers[2]) {
          let postData = {email: this.conf.user.email, oudWachtwoord: answers[0], nieuwWachtwoord: answers[1]};
          this.http.post(this.conf.hostname + '/user/passChange', postData).subscribe(responseData => {
            if (responseData['passChange']) {
              Swal.fire({
                icon: "success",
                title: 'Nieuw wachtwoord ingesteld!',
                confirmButtonText: 'Oke'
              })
            } else {
              Swal.fire({
                icon: "error",
                title: 'Je oude wachtwoord is fout',
                text: 'Je nieuwe wachtwoord is niet opgeslagen.',
                confirmButtonText: 'Oke'
              })
            }
          });
        }
      else {
          Swal.fire({
            icon: "error",
            title: 'Je nieuwe wachtwoorden komen niet overeen.',
            text: 'Je nieuwe wachtwoord is niet opgeslagen.',
            confirmButtonText: 'Oke'
          })
        }
      }
    });
  }
}
