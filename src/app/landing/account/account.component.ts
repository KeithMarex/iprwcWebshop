import {Component, OnInit, Output, EventEmitter,} from '@angular/core';
import {ConfigurationService} from "../../shared/configuration.service";
import {CookieService} from "ngx-cookie-service";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'
import {HttpClient} from "@angular/common/http";
import {OrderModel} from "../../shared/models/order.model";
import {cartProductModel} from "../../shared/models/cartProduct.model";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Output() switchHome = new EventEmitter();
  @Output() logOut = new EventEmitter();

  public orders: OrderModel[] = [];

  constructor(public conf: ConfigurationService, private cookie: CookieService, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(this.conf.hostname + '/order/get/' + this.conf.user.user_id).subscribe(responseData => {
      const data = responseData['result'];
      for (let i = 0; i < Object.keys(data).length; i++) {
        let products: cartProductModel[] = [];
        for (let j = 0; j < Object.keys(data[i]['json_agg']).length; j++) {
          const d = data[i]['json_agg'][j];
          products.push(new cartProductModel(d['product_id'], d['product_foto_path'], d['beschrijving'], d['voorraad'], d['prijs'], d['titel'], d['count']))
        }
        this.orders.push(new OrderModel(data[i]['order_id'], products));
      }
    })
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
    this.conf.winkelWagen = [];
    this.conf.productenCount = 0;
    this.logOut.emit();
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

  getTotalPrice(order: OrderModel): number {
    let totalPrice = 0;
    for (const i of order.producten){
      totalPrice += i.prijs * i.count;
    }
    return totalPrice;
  }

  veranderWachtwoord() {
    Swal.mixin({
      input: 'password',
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
