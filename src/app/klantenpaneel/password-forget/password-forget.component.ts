import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-password-forget',
  templateUrl: './password-forget.component.html',
  styleUrls: ['./password-forget.component.scss']
})
export class PasswordForgetComponent implements OnInit {
  @Output() naarLogin = new EventEmitter();

  succes = true;

  constructor() { }

  ngOnInit(): void {
  }

  onFormSubmit(postData: { email: string }) {
    if (postData.email.includes('@')){
      // TODO voeg wachtwoord herstel aan via API
    }
    // Geef waarschuwing dat er iets fout is gegaan
    this.succes = false;
  }

  goToLogin() {
    this.naarLogin.emit();
  }
}
