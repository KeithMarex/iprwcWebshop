import {Component, Injectable, Input, OnInit, Output} from '@angular/core';
import {ConfigurationService} from "../shared/configuration.service";
import {UserModel} from "../shared/models/user.model";
import {Router} from "@angular/router";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js';
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
@Injectable()
export class HeaderComponent implements OnInit {
  @Input() teller: number;
  @Output() AccountView = new EventEmitter();
  user: UserModel = this.conf.user;

  constructor(private conf: ConfigurationService, private route: Router) { }

  ngOnInit(): void {
    console.log('Hier volgt de user data');
    console.log(this.user);
  }

  Account() {
    if (this.user){
      this.AccountView.emit();
    } else {
      this.route.navigate(['/klantenpaneel']);
    }
  }
}
