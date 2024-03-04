import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { CryptoExchangeModel } from '../models/cryptoExchange.model';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  //-------Switch this endpoints to switch between mock/real API------------------
  private readonly cryptoURL = 'https://rest.coinapi.io/v1/';
  // private readonly cryptoURL = '';
  // ----------------------------------------------------------------------------------------

  private readonly headers = {
    //
    // API KEYS
    // 'X-CoinAPI-Key': 'DF384E11-3C5C-4D0A-B14F-DB14B8D8E52D',
    // 'X-CoinAPI-Key': '22EEFD40-4E24-4394-9EBD-6025EA6CDA51',
    // 'X-CoinAPI-Key': 'FA5576B6-0DC7-4793-AC03-40E6BF7E3DAD',
    'X-CoinAPI-Key': 'F3E80E99-82AA-42C5-8129-6B497FF69823',
    // 'X-CoinAPI-Key': '5FFBF01D-5B84-4242-B31B-516BE26B119F',
  };

  constructor(private http: HttpClient) {}

  //Getting all cryptos
  getAllCrypto(): Observable<any[]> {
    return this.http
      .get<any>(
        //-------Switch this endpoints to switch between mock/real API------------------
        `${this.cryptoURL}symbols?filter_exchange_id=BITSTAMP&filter_asset_id=USD`,
        // 'http://localhost:3000/allSymbols',
        // ------------------------------------------------------------------------------
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
  exchange(cryptoNames: string[] = []): Observable<CryptoExchangeModel> {
    return this.http.get<CryptoExchangeModel>(
      //-------Switch this endpoints to switch between mock/real API------------------
      `${
        this.cryptoURL
      }exchangerate/USD?filter_asset_id=${cryptoNames.toString()}`,
      // `http://localhost:3000/exchangeRate/`,
      //-------------------------------------------------------------------------------
      {
        headers: this.headers,
      }
    );
  }

  //Getting historical data on selected crypto
  gettingHistoricalData(cryptoName: string): Observable<[number, string][]> {
    return (
      this.http

        .get<any>(
          //-------Switch this endpoints to switch between mock/real API------------------
          `${this.cryptoURL}ohlcv/BITSTAMP_SPOT_${cryptoName}_USD/history?period_id=1DAY&limit=7`,
          // `http://localhost:3000/historicalData/?crypto=${cryptoName}`,
          //-------------------------------------------------------------------------------
          {
            headers: this.headers,
          }
        )
        //-------Comment out in Mock API------------------
        .pipe(
          tap((result) => console.log('history', result)),
          map((result) => {
            return result.map((result: any) => ({
              price_close: result.price_close,
              time_close: result.time_close,
            }));
          })
        )
    );
    //------------------------------------------------------------------------------
  }

  //Getting instant data for high and low values
  gettingCurrentData(cryptoName: string): Observable<[number, string][]> {
    return this.http
      .get<any>(
        //-------Switch this endpoints to switch between mock/real API------------------
        `${this.cryptoURL}ohlcv/BITSTAMP_SPOT_${cryptoName}_USD/latest?period_id=10SEC&limit=1`,
        // 'http://localhost:3000/historicalData',
        //------------------------------------------------------------------------------
        {
          headers: this.headers,
        }
      )
      .pipe(
        map((result) => {
          return result.map((result: any) => ({
            price_high: result.price_high,
            price_low: result.time_low,
          }));
        })
      );
  }

  // Websocket for high and low values
  socket$!: WebSocketSubject<any>;
  // private readonly API_KEY: string = '';
  private readonly API_KEY: string = '5FFBF01D-5B84-4242-B31B-516BE26B119F';
  //
  // API KEYS:
  // '22EEFD40-4E24-4394-9EBD-6025EA6CDA51'
  // 'F3E80E99-82AA-42C5-8129-6B497FF69823';
  // 'FA5576B6-0DC7-4793-AC03-40E6BF7E3DAD';

  //connect to websocket
  gettingWebSocketData(cryptos: string[]): void {
    const socketUrl = 'wss://ws.coinapi.io/v1/';
    this.socket$ = new WebSocketSubject(socketUrl);

    const allCryptoSymbolId: string[] = [];
    cryptos.forEach((crypto) => {
      allCryptoSymbolId.push(`BITSTAMP_SPOT_${crypto}_USD$`);
    });

    const helloMessage = {
      type: 'hello',
      apikey: this.API_KEY,
      heartbeat: false,
      subscribe_data_type: ['ohlcv'],
      subscribe_filter_symbol_id: allCryptoSymbolId,
      subscribe_filter_period_id: ['1MIN'],
    };

    // Connecting to the WebSocket ONLY if the user have saved cryptos. If the allCryptoSymbolId is empty, then the data would be unfiltered by crypto name.
    if (allCryptoSymbolId.length > 0) {
      this.socket$.next(helloMessage);
    }

    this.socket$.subscribe(
      (message) => {
        console.log(message);
      },
      (error) => console.error('WebSocket error:', error),
      () => console.log('WebSocket closed')
    );

    console.log('Sending hello message:', helloMessage);
  }

  //Close websocket
  closeSocket(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
