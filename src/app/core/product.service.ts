import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ProductModel} from '../shared/models/product.model';

export class ProductService{
  constructor(private http: HttpClient) {
  }

  // getProduct(): Observable<ProductModel[]> {
  //   return this.http.get('/api/user').map((res: Response) => res.json().response.map((user: User) => new ProductModel().deserialize(user)));
  // }
}
