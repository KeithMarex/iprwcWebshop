import {Component, EventEmitter, Injectable, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigurationService} from "../../shared/configuration.service";
import {cartProductModel} from "../../shared/models/cartProduct.model";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'
import {CookieService} from 'ngx-cookie-service';
import {constants} from 'perf_hooks';
import NODE_PERFORMANCE_GC_MAJOR = module

@Component({
  selector: 'app-winkelwagen',
  templateUrl: './winkelwagen.component.html',
  styleUrls: ['./winkelwagen.component.scss']
})
export class WinkelwagenComponent implements OnInit {
  TotalAmount = 0;
  @Output() updateProducten = new EventEmitter();

  constructor(private http: HttpClient, public conf: ConfigurationService, private cookie: CookieService) { }

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
      console.log(json);
    }


    this.conf.productenCount = this.conf.productenCount - product.count
  }

  changeAmount(product: cartProductModel, event){
    if (event.target.value >= 1){
      for (let i = 0; i < this.conf.winkelWagen.length; i++){
        if (this.conf.winkelWagen[i] === product){
          this.conf.winkelWagen[i].count = event.target.value;
        }
      }

      const postData = JSON.parse(JSON.stringify({cartid: this.conf.user.cart_id, productid: product.id, value: event.target.value}));

      this.http.post(this.conf.hostname + '/cart/changeValue', postData).subscribe(responseData => {console.log(responseData)});
      this.updateProducten.emit()

      this.reloadPrice();
    }

    this.conf.productenCount = 0;
    for (let j = 0; j < this.conf.winkelWagen.length; j++){
      this.conf.productenCount = this.conf.productenCount + Number(this.conf.winkelWagen[j].count);
    }
  }

  bestel() {
    let timerInterval
    Swal.fire({
      title: 'Bestelling wordt verwerkt',
      timer: 1000,
      didOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      for (let i = 0; i < this.conf.winkelWagen.length; i++) {
        this.conf.winkelWagen.splice(i);
      }
      this.reloadPrice();

      if (this.cookie.check('cart')){
        this.cookie.delete('cart');
        this.conf.productenCount = 0;
      }

      let timerInterval2
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
  }
}
