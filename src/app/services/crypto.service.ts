import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { CryptoModel } from 'src/app/models/crypto.model';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  // private readonly exchangeURL = 'https://rest.coinapi.io/v1/exchangerate/';
  // private readonly headers = {
  //   'X-CoinAPI-Key': 'YOUR-API-KEY', // Replace with your API key
  // };

  constructor(private http: HttpClient) {}

  exchange(cryptoName: string): Observable<CryptoModel> {
    // return this.http.get<Crypto>(`${this.exchangeURL}/${cryptoName}/${amount}`);

    const rates = [
      {
        name: 'BTC',
        rate: 15.2,
      },
      {
        name: 'ETH',
        rate: 1.2,
      },
    ];

    const currentCrypto = rates.find((crypto) => crypto.name === cryptoName);

    const cryptoModel: CryptoModel = {
      time: 'valamikor',
      asset_id_quote: cryptoName,
      rate: currentCrypto?.rate || 0,
    };

    return new Observable<CryptoModel>((observer) => {
      observer.next(cryptoModel);
      observer.complete();
    });
  }
}
