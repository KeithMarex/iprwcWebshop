import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  succes = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onFormSubmit(postData: { email: string; password_hash: string }) {
    // Send Http request
    this.http.post('localhost:3000/user/checkUserCredentials', postData).subscribe(responseData => {console.log(responseData);});
  }

  viewPass() {

  }
}
