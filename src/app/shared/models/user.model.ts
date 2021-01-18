export class UserModel{
  public user_id: string;
  public cart_id: string;
  public voornaam: string;
  public achternaam: string;
  public email: string;
  public straatnaam: string;
  public huisnummer: number;
  public plaatsnaam: string;

  constructor(user_id: string, cart_id: string, voornaam: string, achternaam: string, email: string, straatnaam: string, huisnummer: number, plaatsnaam: string) {
    this.user_id = user_id;
    this.cart_id = cart_id;
    this.voornaam = voornaam;
    this.achternaam = achternaam;
    this.email = email;
    this.straatnaam = straatnaam;
    this.huisnummer = huisnummer;
    this.plaatsnaam = plaatsnaam;
  }
}
