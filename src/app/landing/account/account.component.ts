import {Component, OnInit, Output, EventEmitter,} from '@angular/core';
import {ConfigurationService} from "../../shared/configuration.service";
import {CookieService} from "ngx-cookie-service";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'
import {HttpClient} from "@angular/common/http";
import {OrderModel} from "../../shared/models/order.model";
import {cartProductModel} from "../../shared/models/cartProduct.model";
import {ProductModel} from '../../shared/models/product.model';

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
    this.refresh();
  }

  refresh(): void {
    this.http.get(this.conf.hostname + '/order/get/' + this.conf.user.user_id).subscribe(responseData => {
      const data = responseData['result'];
      for (let i = 0; i < Object.keys(data).length; i++) {
        let products: cartProductModel[] = [];
        for (let j = 0; j < Object.keys(data[i]['json_agg']).length; j++) {
          const d = data[i]['json_agg'][j];
          products.push(new cartProductModel(d['product_id'], d['product_foto_path'], d['beschrijving'], d['voorraad'], d['prijs'], d['titel'], d['count']))
        }
        this.orders.push(new OrderModel(data[i]['order_id'], products, data[i]['timestamp'], data[i]['tracking_status']));
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

  getOrder() {
    Swal.fire({
      title: 'Vul factuurnummer in',
      input: 'text',
      inputLabel: 'Factuurnummer',
      inputPlaceholder: 'Factuurnummer...'
    }).then(result => {

    })
  }

  deleteUser() {
    let options = {};

    this.http.get(this.conf.hostname + '/user/all').subscribe(responseData => {
      let d = JSON.parse(JSON.stringify(responseData));
      let data = d['result'];
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        options[data[i]['user_id']] = data[i]['voornaam'] + ' ' + data[i]['achternaam'];
      }

      Swal.fire({
        title: 'Verwijder een gebruiker',
        inputLabel: 'Kies een gebruiker',
        input: 'select',
        inputOptions: options,
      }).then(result => {
        this.http.post(this.conf.hostname + '/user/delete', {user_id: result.value}).subscribe(respone => {
          if (respone['succes']){
            Swal.fire({title: 'Gebruiker', text: 'Verwijderd', icon: 'success', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
          } else {
            Swal.fire({title: 'Product', text: 'Niet verwijderd', icon: 'error', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
          }
        })
      })
    });
  }

  deleteProduct(): void {
    let options = {};
    let products: ProductModel[] = [];

    this.http.get(this.conf.hostname + '/product/get/all').subscribe(responseData => {
      let data = JSON.parse(JSON.stringify(responseData))['result'];
      for (let i = 0; i < data.length; i++) {
        let model = new ProductModel(data[i]['product_id'], data[i]['titel'], data[i]['beschrijving'], Number(data[i]['voorraad']), Number(data[i]['prijs']), data[i]['product_foto_path']);
        products.push(model);
      }

      for (const i of products) {
        options[i.id] = i.titel;
      }

      Swal.fire({
        title: 'Verwijder een product',
        inputLabel: 'Kies een product',
        input: 'select',
        inputOptions: options,
      }).then(result => {
        if (result['delete']){
          this.http.post(this.conf.hostname + '/product/delete', {product_id: result.value}).subscribe(reactie => {
            Swal.fire({title: 'Product', text: 'Verwijderd', icon: 'success', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
          })
        }
      })
    });
  }

  editProduct() {
    let options = {};
    let products: ProductModel[] = [];

    this.http.get(this.conf.hostname + '/product/get/all').subscribe(responseData => {
      let data = JSON.parse(JSON.stringify(responseData))['result'];
      for (let i = 0; i < data.length; i++) {
        let model = new ProductModel(data[i]['product_id'], data[i]['titel'], data[i]['beschrijving'], Number(data[i]['voorraad']), Number(data[i]['prijs']), data[i]['product_foto_path']);
        products.push(model);
      }

      for (const i of products) {
        options[i.id] = i.titel;
      }

      Swal.fire({
        title: 'Wijzig een product',
        inputLabel: 'Kies een product',
        input: 'select',
        inputOptions: options,
      }).then(result => {
        if (result.isConfirmed){
          this.http.get(this.conf.hostname + '/product/getProduct/' + result.value).subscribe(res => {
            let product = res['result'][0];
            console.log(product);

            Swal.fire({
              title: 'Multiple inputs',
              html:`
                <h3>Titel</h3>
                <input id="swal-input1" class="swal2-input" value="${product['titel']}">
                <h3>Beschrijving</h3>
                <input id="swal-input2" class="swal2-input" value="${product['beschrijving']}">
                <h3>Prijs</h3>
                <input id="swal-input3" class="swal2-input" value="${product['prijs']}">
                <h3>Voorraad</h3>
                <input id="swal-input4" class="swal2-input" value="${product['voorraad']}">
                <h3>Foto pad</h3>
                <input id="swal-input5" class="swal2-input" value="${product['product_foto_path']}">`,
              focusConfirm: false,
              preConfirm: () => {
                return [
                  (document.getElementById('swal-input1') as HTMLInputElement).value,
                  (document.getElementById('swal-input2') as HTMLInputElement).value,
                  (document.getElementById('swal-input3') as HTMLInputElement).value,
                  (document.getElementById('swal-input4') as HTMLInputElement).value,
                  (document.getElementById('swal-input5') as HTMLInputElement).value,
                ]
              }
            })
            .then(result2 => {
              this.http.post(this.conf.hostname + '/product/update', {product_id: result.value, beschrijving: result2.value[1], prijs: result2.value[2], voorraad: result2.value[3], product_foto_path: result2.value[4], titel: result2.value[0]}).subscribe(end => {
                if (end['update'] === true){
                  Swal.fire({title: 'Product', text: 'Veranderd', icon: 'success', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
                } else {
                  Swal.fire({title: 'Product', text: 'Niet veranderd', icon: 'error', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
                }
              })
            })
          });
        }
      })
    });
  }

  addProduct() {
    Swal.fire({
      title: 'Voeg een product toe',
      html: `
        <h3>Titel</h3>
        <input id="swal-input1" class="swal2-input">
        <h3>Beschrijving</h3>
        <input id="swal-input2" class="swal2-input">
        <h3>Prijs</h3>
        <input id="swal-input3" class="swal2-input">
        <h3>Voorraad</h3>
        <input id="swal-input4" class="swal2-input">
        <h3>Foto pad</h3>
        <input id="swal-input5" class="swal2-input">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value,
          (document.getElementById('swal-input3') as HTMLInputElement).value,
          (document.getElementById('swal-input4') as HTMLInputElement).value,
          (document.getElementById('swal-input5') as HTMLInputElement).value,
        ]
      }
    }).then(result => {
      this.http.post(this.conf.hostname + '/product/create', { titel: result.value[0], beschrijving: result.value[1], prijs: result.value[2], voorraad: result.value[3], product_foto_path: result.value[4]}).subscribe(res => {
        if (res['create']){
          Swal.fire({title: 'Product', text: 'Aangemaakt', icon: 'success', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
        }
      })
    })
  }
}
