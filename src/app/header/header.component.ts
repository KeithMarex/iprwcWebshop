import {Component, Injectable, Input, OnInit} from '@angular/core';
import {ConfigurationService} from "../shared/configuration.service";
import {UserModel} from "../shared/models/user.model";
import {Router} from "@angular/router";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
@Injectable()
export class HeaderComponent implements OnInit {
  @Input() teller: number;
  user: UserModel = this.conf.user;

  constructor(private conf: ConfigurationService, private route: Router) { }

  ngOnInit(): void {
    console.log('Hier volgt de user data');
    console.log(this.user);
  }

  Account() {
    if (this.user){
      Swal.fire('Good job!', 'You clicked the button!', 'success');
    } else {
      this.route.navigate(['/klantenpaneel']);
    }
  }
}
