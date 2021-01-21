import {Component, EventEmitter, Injectable, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigurationService} from "../shared/configuration.service";
import {ProductModel} from "../shared/models/product.model";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'
import {Router} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {cartProductModel} from "../shared/models/cartProduct.model";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
@Injectable()
export class LandingComponent implements OnInit {
  products: ProductModel[] = [];
  copyProduct: ProductModel[] = [];
  view = 'product';
  @ViewChild(HeaderComponent) hc;
  @Output() updateProductenEvent = new EventEmitter();

  constructor(private http: HttpClient, public conf: ConfigurationService, private route: Router, private cookie: CookieService) {
  }

  ngOnInit(): void {
    this.http.get(this.conf.hostname + '/product/get/all').subscribe(responseData => {
      let data = JSON.parse(JSON.stringify(responseData))['result'];
      for (let i = 0; i < data.length; i++){
        let model = new ProductModel(data[i]['product_id'], data[i]['titel'], data[i]['beschrijving'], Number(data[i]['voorraad']), Number(data[i]['prijs']), data[i]['product_foto_path']);
        this.products.push(model);
        this.copyProduct = this.products;
      }
    });
    this.laadWinkelWagen();
  }

  async laadWinkelWagen() {
    this.conf.winkelWagen.length = 0;

    if (this.conf.user) {
      this.conf.productenCount = 0;
      const postData = JSON.parse(JSON.stringify({cartid: this.conf.user.cart_id}));
      this.http.post(this.conf.hostname + '/cart/getProducts', postData).subscribe(responseData => {
        this.conf.winkelWagen.length = 0;
        for (let i = 0; i < responseData['result'].length; i++) {
          let data = JSON.parse(JSON.stringify(responseData))['result'][i];
          let product = new cartProductModel(data['product_id'], data['product_foto_path'], data['beschrijving'], data['voorraad'], data['prijs'], data['titel'], Number(data['count']));
          this.conf.winkelWagen.push(product);

          this.conf.productenCount = 0;
          for (let j = 0; j < this.conf.winkelWagen.length; j++) {
            this.conf.productenCount = this.conf.productenCount + this.conf.winkelWagen[j].count;
          }
        }

        if (this.cookie.check('cart') && this.conf.winkelWagen.length >= 1){
          Swal.fire({
            title: 'Winkelwagen',
            text: 'Wilt u uw online winkelwagen laden of die op uw apparaat?',
            showDenyButton: true,
            confirmButtonText: `Online`,
            denyButtonText: `Lokaal`,
          }).then(res => {
            if (res.isConfirmed){
              // Do nothing
            } else if (res.isDenied){
              this.conf.productenCount = 0;
              this.conf.winkelWagen.length = 0;
              const json = JSON.parse(this.cookie.get('cart'));
              for (let i = 0; i < Object.keys(json['producten']).length; i++) {
                let data = json['producten'][i];
                this.http.get(this.conf.hostname + '/product/getProduct/' + data['product_id']).subscribe(responseData => {
                  let data = JSON.parse(JSON.stringify(responseData))['result'][0];
                  let productCookie = new cartProductModel(data['product_id'], data['product_foto_path'], data['beschrijving'], data['voorraad'], data['prijs'], data['titel'], json['producten'][i].count);
                  this.conf.winkelWagen.push(productCookie);
                })
                this.conf.productenCount += json['producten'][i].count;
              }
            }
          })
        }

      });
    } else if (this.cookie.check('cart')) {
      this.conf.productenCount = 0;
      this.conf.winkelWagen.length = 0;
      const json = JSON.parse(this.cookie.get('cart'));
      for (let i = 0; i < Object.keys(json['producten']).length; i++) {
        let data = json['producten'][i];
        await this.http.get(this.conf.hostname + '/product/getProduct/' + data['product_id']).subscribe(responseData => {
          let data = JSON.parse(JSON.stringify(responseData))['result'][0];
          let productCookie = new cartProductModel(data['product_id'], data['product_foto_path'], data['beschrijving'], data['voorraad'], data['prijs'], data['titel'], json['producten'][i].count);
          this.conf.winkelWagen.push(productCookie);
        })
        this.conf.productenCount += json['producten'][i].count;
      }
    }
  }

  voegToeAanCart(product: ProductModel) {
    if (this.conf.user){
      const koppelProduct = JSON.parse(JSON.stringify({cartid: this.conf.user.cart_id, productid: product.id}));
      this.http.post(this.conf.hostname + '/cart/addProduct', koppelProduct).subscribe(
        responseData => {
        if (responseData['result'].length === 0){
          Swal.fire({title: product.titel, text: 'Toegevoegd', icon: 'success', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
        }
        this.hc.telOp();
        this.laadWinkelWagen();
      }, err => {
        const postData = JSON.parse(JSON.stringify({cartid: this.conf.user.cart_id, productid: product.id}));

        this.http.post(this.conf.hostname + '/cart/increaseAmountByOne', postData).subscribe(responseData => {
          Swal.fire({title: product.titel, text: 'Product zat al in winkelwagen, aantal is verhoogd', icon: 'success', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
          this.hc.telOp();
          this.laadWinkelWagen();
        });
      });
    } else {
      if (this.cookie.check('cart')){
        this.hc.telOp();

        const newProduct = {
          product_id: product.id,
          count: 1
        };

        let json = JSON.parse(this.cookie.get('cart'));

        console.log(json);
        json['producten'].push(newProduct);
        console.log(json);

        this.cookie.set('cart', JSON.stringify(json));
        Swal.fire({title: product.titel, text: 'Toegevoegd', icon: 'success', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
        this.laadWinkelWagen();
      } else {
        const lijst = {"producten":[
          {
            product_id: product.id,
            count: 1
          }]
        };
        this.cookie.set('cart', JSON.stringify(lijst));
        this.hc.telOp();
        Swal.fire({title: product.titel, text: 'Toegevoegd', icon: 'success', position: 'top-end', showConfirmButton: false, backdrop: false, allowOutsideClick: false, timer: 1500});
        this.laadWinkelWagen();
      }
    }
  }

  switchWinkelwagen() {
    if (this.view !== 'cart' && this.conf.winkelWagen.length !== 0) {
      this.view = 'cart';
    } else if (this.conf.winkelWagen.length === 0 && this.view === 'cart'){
      this.view = 'product';
    } else if (this.conf.winkelWagen.length === 0){
      this.view = 'cart';
    } else {
      this.view = 'product';
    }
  }

  switchAccount() {
    if (this.view !== 'account'){
      this.view = 'account';
    } else {
      this.view = 'product';
    }
  }

  updateProductenP(){
    this.hc.refreshProducten();
  }

  zoekProduct(event) {
    this.copyProduct = this.products.filter(function(hero){
      return hero.titel.toLocaleLowerCase().includes(event.target.value.toLowerCase());
    })
  }
}
