import {Component, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigurationService} from "../shared/configuration.service";
import {ProductModel} from "../shared/models/product.model";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  products: ProductModel[] = [];
  itemCount = 0;

  constructor(private http: HttpClient, public conf: ConfigurationService) {
  }

  ngOnInit(): void {
    this.http.get('http://' + this.conf.hostname + ':3000/product/get/all').subscribe(responseData => {
      let data = JSON.parse(JSON.stringify(responseData))['result'];
      for (let i = 0; i < data.length; i++){
        let model = new ProductModel(data[i]['product_id'], data[i]['titel'], data[i]['beschrijving'], Number(data[i]['voorraad']), Number(data[i]['prijs']), data[i]['product_foto_path']);
        this.products.push(model);
      }
    });
  }

  voegToeAanCart(product: ProductModel) {
    Swal.fire(product.titel, 'Toegevoegd', 'success');
    this.itemCount++;
  }
}
