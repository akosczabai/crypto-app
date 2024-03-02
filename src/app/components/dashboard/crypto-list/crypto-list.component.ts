import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { map } from 'rxjs';
import { CryptoService } from 'src/app/services/crypto.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss'],
})
export class CryptoListComponent implements OnInit, OnChanges, OnDestroy {
  cryptoList: string[] | undefined = undefined;
  listedCryptos: { name: string; high?: number; low?: number }[] = [];

  constructor(
    private cryptoService: CryptoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.cryptoList = user?.saved;

      this.listedCryptos =
        this.cryptoList?.map((crypto) => ({ name: crypto })) || [];

      this.listedCryptos.forEach((crypto) => {
        this.cryptoService
          .gettingCurrentData(crypto.name)
          .subscribe((currentData: any) => {
            crypto.high = currentData.price_high;
            crypto.low = currentData.price_low;
          });
      });
    });

    this.cryptoService.gettingWebSocketData(this.cryptoList!);
    this.gettingCryptoData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.gettingCryptoData();
  }

  ngOnDestroy(): void {
    this.close();
  }

  // Getting HIGH and LOW values from WebSocket
  gettingCryptoData() {
    this.cryptoService.socket$
      .pipe(
        map((message) => {
          console.log(message);
          const name = message.symbol_id
            .replace('BITSTAMP_SPOT_', '')
            .replace('_USD', '');
          let high = message.price_high;
          let low = message.price_low;

          // Getting latest data to show at first time
          this.cryptoService.gettingCurrentData(name).subscribe({
            next: (data: any) => {
              high = data.price_high;
              low = data.price_low;
            },
            error: (err) => console.log(err),
          });
          return { name: name, high: high, low: low };
        })
      )
      // Subscribe to WebSocket
      .subscribe(
        (message) => {
          const changeData = this.listedCryptos.find(
            (crypto) => crypto.name === message.name
          );
          if (!changeData) {
            this.listedCryptos.push({
              name: message.name,
              high: message.high,
              low: message.low,
            });
          } else {
            changeData!.high = message.high;
            changeData!.low = message.low;
          }
        },
        (error) => {
          console.log('Websocket error:', error);
        },
        () => {
          console.log('Websocket closed');
        }
      );
  }

  // Close WebSocket
  close() {
    this.cryptoService.closeSocket();
  }
}
