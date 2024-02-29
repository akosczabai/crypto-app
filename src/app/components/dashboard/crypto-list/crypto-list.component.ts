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
  cryptoList = this.userService.currentUser?.saved;
  listedCryptos: { name: string; high?: number; low?: number }[] = [];

  gettingCryptoData() {
    this.cryptoList?.forEach((crypto) => {
      this.listedCryptos.push({
        name: crypto /*high: 234235235, low: 1233124*/,
      }); // <- dummy data. high és low
    });

    this.cryptoService.socket$
      .pipe(
        map((message) => {
          const name = message.symbol_id
            .replace('BITSTAMP_SPOT_', '')
            .replace('_USD', '');
          const high = message.price_high;
          const low = message.price_low;
          return { name: name, high: high, low: low };
        })
      )
      .subscribe(
        (message) => {
          const changeData = this.listedCryptos.find(
            (crypto) => crypto.name === message.name
          );
          changeData!.high = message.high;
          changeData!.low = message.low;
        },
        (error) => {
          console.log('Websocket error:', error);
        },
        () => {
          console.log('Websocket closed');
        }
      );
  }

  constructor(
    private cryptoService: CryptoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cryptoService.gettingWebSocketData(this.cryptoList!);
    this.gettingCryptoData();
    // this.cryptoService.closeSocket();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.gettingCryptoData();
  }

  ngOnDestroy(): void {
    this.close();
  }
  close() {
    this.cryptoService.closeSocket();
  }
}
