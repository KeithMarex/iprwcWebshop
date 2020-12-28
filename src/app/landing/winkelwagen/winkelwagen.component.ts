import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigurationService} from "../../shared/configuration.service";
import {cartProductModel} from "../../shared/models/cartProduct.model";
import {ProductModel} from "../../shared/models/product.model";

@Component({
  selector: 'app-winkelwagen',
  templateUrl: './winkelwagen.component.html',
  styleUrls: ['./winkelwagen.component.scss']
})
export class WinkelwagenComponent implements OnInit {
  public cartProducts: cartProductModel[] = [];
  TotalAmount = 0;

  constructor(private http: HttpClient, private conf: ConfigurationService) { }

  ngOnInit(): void {
    const postData = JSON.parse(JSON.stringify({cartid: this.conf.user.cart_id}));

    this.http.post('http://' + this.conf.hostname + ':3000/cart/getProducts', postData).subscribe(responseData => {
      for (let i = 0; i < responseData['result'].length; i++){
        let data = JSON.parse(JSON.stringify(responseData))['result'][i];
        let product = new cartProductModel(data['product_id'], data['product_foto_path'], data['beschrijving'], data['voorraad'], data['prijs'], data['titel'], data['count']);
        this.cartProducts.push(product);
        this.TotalAmount = this.TotalAmount + (data['prijs'] * data['count']);
      }
    });
  }

  removeProduct(product: cartProductModel){

  }

}
