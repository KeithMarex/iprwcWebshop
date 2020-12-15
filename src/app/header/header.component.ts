import {Component, Injectable, Input, OnInit} from '@angular/core';
import {ConfigurationService} from "../shared/configuration.service";
import {UserModel} from "../shared/models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
@Injectable()
export class HeaderComponent implements OnInit {
  @Input() teller: number;
  user: UserModel = this.conf.user;

  constructor(private conf: ConfigurationService) { }

  ngOnInit(): void {
    console.log('Hier volgt de user data');
    console.log(this.user);
  }
}
