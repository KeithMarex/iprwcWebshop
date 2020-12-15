export class UserModel{
  public cart_id: string;
  public voornaam: string;
  public achternaam: string;
  public email: string;
  public straatnaam: string;
  public huisnummer: number;
  public plaatsnaam: string;

  constructor(cart_id: string, voornaam: string, achternaam: string, email: string, straatnaam: string, huisnummer: number, plaatsnaam: string) {
    this.cart_id = cart_id;
    this.voornaam = voornaam;
    this.achternaam = achternaam;
    this.email = email;
    this.straatnaam = straatnaam;
    this.huisnummer = huisnummer;
    this.plaatsnaam = plaatsnaam;
  }
}
