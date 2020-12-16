import {Component, Injectable, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigurationService} from "../shared/configuration.service";
import {ProductModel} from "../shared/models/product.model";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
@Injectable()
export class LandingComponent implements OnInit {
  products: ProductModel[] = [];
  itemCount = 0;
  view = 'product';

  constructor(private http: HttpClient, public conf: ConfigurationService, private route: Router, private cookieService: CookieService) {
  }

  ngOnInit(): void {
    this.http.get('http://' + this.conf.hostname + ':3000/product/get/all').subscribe(responseData => {
      let data = JSON.parse(JSON.stringify(responseData))['result'];
      for (let i = 0; i < data.length; i++){
        let model = new ProductModel(data[i]['product_id'], data[i]['titel'], data[i]['beschrijving'], Number(data[i]['voorraad']), Number(data[i]['prijs']), data[i]['product_foto_path']);
        this.products.push(model);
      }
    });

    console.log(this.cookieService.get('iprwcLoginEmail'));
    console.log(this.cookieService.get('iprwcLoginPassword'));
  }

  voegToeAanCart(product: ProductModel) {
    if (this.conf.user){
      Swal.fire({title: product.titel, text: 'Toegevoegd', icon: 'success'});
      // TODO Voeg item toe aan winkelwagen
      this.itemCount++;
    } else {
      Swal.fire({
        title: 'Je moet eerst inloggen',
        icon: 'info',
        focusConfirm: false,
        confirmButtonText: 'Inloggen'
      }).then((result) => {
        this.route.navigate(['/klantenpaneel']);
      })
    }
  }

  switchWinkelwagen() {
    if (this.view !== 'cart'){
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
}
