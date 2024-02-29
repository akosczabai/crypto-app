import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, filter, map } from 'rxjs';
import { CryptoModel } from 'src/app/models/crypto.model';
import { CryptoExchangeModel } from '../models/cryptoExchange.model';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly cryptoURL = 'https://rest.coinapi.io/v1/';
  private readonly headers = {
    'X-CoinAPI-Key': 'F3E80E99-82AA-42C5-8129-6B497FF69823',
  };

  constructor(private http: HttpClient) {}

  //Getting all cryptos
  getAllCrypto(): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.cryptoURL}symbols?filter_exchange_id=BITSTAMP&filter_asset_id=USD`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        map((result) => {
          return result.map((item: any) => item.asset_id_base);
        })
      );
  }

  //Getting exchange rate on selected crypto
  exchange(cryptoName: string): Observable<number> {
    return this.http
      .get<CryptoExchangeModel>(
        `${this.cryptoURL}exchangerate/${cryptoName}/USD`,
        {
          headers: this.headers,
        }
      )
      .pipe(map((result) => result.rate));
  }

  //Getting historical data on selected crypto
  gettingHistoricalData(cryptoName: string): Observable<[number, string][]> {
    return this.http
      .get<any>(
        `${this.cryptoURL}ohlcv/BITSTAMP_SPOT_${cryptoName}_USD/history?period_id=1DAY&limit=7`,

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

  // Websocket for high and low values
  socket$!: WebSocketSubject<any>;
  private readonly API_KEY: string = 'F3E80E99-82AA-42C5-8129-6B497FF69823'; //'F3E80E99-82AA-42C5-8129-6B497FF69823';

  gettingWebSocketData(cryptos: string[]): void {
    const socketUrl = 'wss://ws.coinapi.io/v1/';
    this.socket$ = new WebSocketSubject(socketUrl);

    const allCryptoSymbolId: any[] = [];
    cryptos.forEach((crypto) => {
      allCryptoSymbolId.push(`BITSTAMP_SPOT_${crypto}_USD$`);
    });

    const helloMessage = {
      type: 'hello',
      apikey: this.API_KEY,
      heartbeat: false,
      subscribe_data_type: ['ohlcv'],
      subscribe_filter_symbol_id: [...allCryptoSymbolId],
      subscribe_filter_period_id: ['1MIN'],
    };

    this.socket$.next(helloMessage);
  }

  closeSocket(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
