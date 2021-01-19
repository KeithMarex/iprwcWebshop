import {Component, EventEmitter, Injectable, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigurationService} from "../../shared/configuration.service";
import {cartProductModel} from "../../shared/models/cartProduct.model";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'
import {CookieService} from 'ngx-cookie-service';
import {OrderModel} from "../../shared/models/order.model";
import {Router} from '@angular/router';
import {AccountComponent} from '../account/account.component';

@Component({
  selector: 'app-winkelwagen',
  templateUrl: './winkelwagen.component.html',
  styleUrls: ['./winkelwagen.component.scss']
})
export class WinkelwagenComponent implements OnInit {
  TotalAmount = 0;
  @Output() updateProducten = new EventEmitter();

  constructor(private http: HttpClient, public conf: ConfigurationService, private cookie: CookieService, private route: Router) { }

  ngOnInit(): void{
    this.TotalAmount = 0;
    for (let i = 0; i < this.conf.winkelWagen.length; i++){
      this.TotalAmount = this.TotalAmount + (this.conf.winkelWagen[i].prijs * this.conf.winkelWagen[i].count)
    }
  }

  reloadPrice() {
    this.TotalAmount = 0;
    for (let i = 0; i < this.conf.winkelWagen.length; i++){
      this.TotalAmount = this.TotalAmount + (this.conf.winkelWagen[i].prijs * this.conf.winkelWagen[i].count)
    }
  }

  removeProduct(product: cartProductModel, index){
    if (this.conf.user){
      const postData = {cartid: this.conf.user.cart_id, productid: product.id};

      this.http.post(this.conf.hostname + '/cart/deleteProduct', postData).subscribe(responseData => {
        let index = this.conf.winkelWagen.indexOf(product);
        this.conf.winkelWagen.splice(index, 1);
        Swal.fire({
          backdrop: false,
          position: 'top-end',
          icon: 'success',
          title: 'Product verwijderd',
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1500
        })
        this.reloadPrice();
      });
    } else {
      console.log(this.cookie.get('cart'))
      const json = JSON.parse(this.cookie.get('cart'));
      this.conf.winkelWagen.splice(index, 1);
      json['producten'].splice(index, 1);
      console.log(JSON.stringify(json));
      this.cookie.set('cart', JSON.stringify(json));
      Swal.fire({
        backdrop: false,
        position: 'top-end',
        icon: 'success',
        title: 'Product verwijderd',
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 1500
      })
    }
    this.conf.productenCount = this.conf.productenCount - product.count
  }

  changeAmount(product: cartProductModel, event, index){
    if (event.target.value >= 1){
      if (this.conf.user){
        for (let i = 0; i < this.conf.winkelWagen.length; i++){
          if (this.conf.winkelWagen[i] === product){
            this.conf.winkelWagen[i].count = event.target.value;
          }
        }

        const postData = JSON.parse(JSON.stringify({cartid: this.conf.user.cart_id, productid: product.id, value: event.target.value}));

        this.http.post(this.conf.hostname + '/cart/changeValue', postData).subscribe(responseData => {console.log(responseData)});
        this.updateProducten.emit()

        this.reloadPrice();
      } else {
        for (let i = 0; i < this.conf.winkelWagen.length; i++){
          if (this.conf.winkelWagen[i] === product){
            this.conf.winkelWagen[i].count = event.target.value;
          }
        }

        const json = JSON.parse(this.cookie.get('cart'));
        for (let i = 0; i < json['producten'].length; i++){
          if (json['producten'][i].product_id === product.id){
            json['producten'][i].count = Number(event.target.value);
          }
        }
        console.log(json);
        this.cookie.set('cart', JSON.stringify(json));
      }
    } else if (event.target.value <= 0){
      this.removeProduct(product, index);
    }


    this.conf.productenCount = 0;
    for (let j = 0; j < this.conf.winkelWagen.length; j++){
      this.conf.productenCount = this.conf.productenCount + Number(this.conf.winkelWagen[j].count);
    }
    this.reloadPrice();
  }

  bestel() {
    if (this.conf.user){
      let timerInterval;
      Swal.fire({
        title: 'Bestelling wordt verwerkt',
        timer: 1000,
        didOpen: () => {
          Swal.showLoading()
          timerInterval = setInterval(() => {
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval);

        }
      }).then(async (result) => {
        await this.http.post(this.conf.hostname + '/order/create', {user_id: this.conf.user.user_id}).subscribe(async postData => {
          const orderId = postData['order_id'];
          for (const i of this.conf.winkelWagen){
            await this.http.post(this.conf.hostname + '/order/add', {order_id: orderId, product_id: i.id, count: i.count}).subscribe(async res => {
              await this.http.post(this.conf.hostname + '/cart/deleteProduct', {cartid: this.conf.user.cart_id, productid: i.id}).subscribe(io => {
                // Do something
              });
            });
          }

          /* Read more about handling dismissals below */
          for (let i = 0; i < this.conf.winkelWagen.length; i++) {
            this.conf.winkelWagen.splice(i);
          }
          this.reloadPrice();

          if (this.cookie.check('cart')){
            this.cookie.delete('cart');
            this.conf.productenCount = 0;
          }

          let timerInterval2;
          Swal.fire({
            position: 'top-end',
            backdrop: false,
            icon: 'success',
            title: 'Bestelling voltooid',
            timer: 3000,
            showConfirmButton: false,
            didOpen: () => {
              timerInterval2 = setInterval(() => {
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval2);
            }
          })
        })
      })
    } else {
      Swal.fire({
        title: 'Bestellen',
        text: 'Je moet inloggen om een bestelling te kunnen plaatsen!',
        icon: 'info',
      }).then(result => {
        if (result.isConfirmed){
          this.route.navigate(['klantenpaneel']);
        }
      })
    }
  }
}
