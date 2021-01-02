import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from "../../shared/configuration.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(public conf: ConfigurationService) { }

  ngOnInit(): void {
  }

}
