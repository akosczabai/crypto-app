import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, filter, map } from 'rxjs';
import { CryptoModel } from 'src/app/models/crypto.model';
import { CryptoExchangeModel } from '../models/cryptoExchange.model';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly cryptoURL = 'https://rest.coinapi.io/v1/';
  private readonly headers = {
    'X-CoinAPI-Key': 'F3E80E99-82AA-42C5-8129-6B497FF69823', // Replace with your API key
  };

  constructor(private http: HttpClient) {}

  // getAllCrypto(): Observable<[]> {
  //   const allCryptos = [];
  //   return this.http.get<Crypto>(`${this.cryptoURL}/symbols`);
  // }

  //Getting exchange rate on selected crypto
  exchange(cryptoName: string): Observable<number> {
    return this.http
      .get<CryptoExchangeModel>(
        '', // `${this.cryptoURL}exchangerate/${cryptoName}/USD`,
        {
          headers: this.headers,
        }
      )
      .pipe(map((result) => result.rate));
  }

  gettingHistoricalData(cryptoName: string): Observable<[number, string][]> {
    return this.http
      .get<any>(
        '', //`${this.cryptoURL}ohlcv/BITSTAMP_SPOT_${cryptoName}_USD/history?period_id=1DAY&limit=7`,

        {
          headers: this.headers,
        }
      )
      .pipe(
        map((result) => {
          return result.map((result: any) => ({
            price_close: result.price_close,
            time_close: result.time_close,
          }));
        })
      );
  }
}

// fetch(`${this.cryptoURL}/exchangerate/${cryptoName}/USD`, {
//   headers: this.headers,
// })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log('service data', data);
//   })
//   .catch((error) => console.error('Error:', error));

// const rates = [
//   {
//     name: 'BTC',
//     rate: 15.2,
//   },
//   {
//     name: 'ETH',
//     rate: 1.2,
//   },
// ];

// const currentCrypto = rates.find((crypto) => crypto.name === cryptoName);

// const cryptoModel: CryptoModel = {
//   time: 'valamikor',
//   asset_id_quote: cryptoName,
//   rate: currentCrypto?.rate || 0,
// };

// return new Observable<CryptoModel>((observer) => {
//   observer.next(cryptoModel);
//   observer.complete();
// });
