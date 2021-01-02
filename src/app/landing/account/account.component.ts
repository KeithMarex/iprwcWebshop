import {Component, OnInit, Output, EventEmitter,} from '@angular/core';
import {ConfigurationService} from "../../shared/configuration.service";
import {CookieService} from "ngx-cookie-service";
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Output() switchHome = new EventEmitter();

  constructor(public conf: ConfigurationService, private cookie: CookieService) { }

  ngOnInit(): void {
  }

  logUit() {
    this.cookie.delete('iprwcLoginEmail');
    this.cookie.delete('iprwcLoginPassword');
    this.conf.user = null;
    Swal.fire({
      backdrop: false,
      position: 'top-end',
      icon: 'info',
      title: 'Uitgelogd',
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1500
    })
    this.switchHome.emit();
  }

  slaGegevensOp() {

  }
}
