import {Component, EventEmitter, Injectable, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigurationService} from "../../shared/configuration.service";
import {cartProductModel} from "../../shared/models/cartProduct.model";

@Component({
  selector: 'app-winkelwagen',
  templateUrl: './winkelwagen.component.html',
  styleUrls: ['./winkelwagen.component.scss']
})
export class WinkelwagenComponent implements OnInit {
  public cartProducts: cartProductModel[] = [];
  TotalAmount = 0;
  @Output() updateProducten = new EventEmitter();

  constructor(private http: HttpClient, private conf: ConfigurationService) { }

  ngOnInit(): void {
    const postData = JSON.parse(JSON.stringify({cartid: this.conf.user.cart_id}));

    this.http.post('http://' + this.conf.hostname + ':3000/cart/getProducts', postData).subscribe(responseData => {
      for (let i = 0; i < responseData['result'].length; i++){
        let data = JSON.parse(JSON.stringify(responseData))['result'][i];
        let product = new cartProductModel(data['product_id'], data['product_foto_path'], data['beschrijving'], data['voorraad'], data['prijs'], data['titel'], Number(data['count']));
        this.cartProducts.push(product);
        this.TotalAmount = this.TotalAmount + (data['prijs'] * data['count']);

        this.conf.productenCount = 0;
        for (let j = 0; j < this.cartProducts.length; j++){
          this.conf.productenCount = this.conf.productenCount + this.cartProducts[j].count;
        }
      }
    });
  }

  removeProduct(product: cartProductModel){
    const postData = JSON.parse(JSON.stringify({cartid: this.conf.user.cart_id, productid: product.id}));

    this.http.post('http://' + this.conf.hostname + ':3000/cart/deleteProduct', postData).subscribe(responseData => {
      let index = this.cartProducts.indexOf(product);
      this.cartProducts.splice(index, 1);
    });
  }



  changeAmount(product: cartProductModel, event){
    if (event.target.value >= 1){
      for (let i = 0; i < this.cartProducts.length; i++){
        if (this.cartProducts[i] === product){
          this.cartProducts[i].count = event.target.value;
        }
      }

      const postData = JSON.parse(JSON.stringify({cartid: this.conf.user.cart_id, productid: product.id, value: event.target.value}));

      this.http.post('http://' + this.conf.hostname + ':3000/cart/changeValue', postData).subscribe(responseData => {console.log(responseData)});
      this.updateProducten.emit();
    }

    this.conf.productenCount = 0;
    for (let j = 0; j < this.cartProducts.length; j++){
      this.conf.productenCount = this.conf.productenCount + Number(this.cartProducts[j].count);
    }
  }

}
