import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { CryptoService } from 'src/app/services/crypto.service';
import { UserService } from 'src/app/services/user.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { multi } from './data';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss'],
})
export class MainPanelComponent {
  isPopupOpened: boolean = false;
  currentUser: User | null = this.userService.currentUser;
  selectedCrypto?: string = '';
  exchangeRate: number | null = null;
  exchangeResult: number = 0;
  isReversed: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private cryptoService: CryptoService
  ) {
    Object.assign(this, { multi });
  }

  ngOnInit(): void {
    this.loadCryptoData(0);
  }

  multi: any;
  view: any = [700, 400];

  // options
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Days';
  yAxisLabel: string = `USD / ${this.selectedCrypto}`;
  timeline: boolean = true;

  colorScheme: any = {
    domain: ['#FFB400'],
  };

  convertForm = new FormGroup({
    from: new FormControl(0),
    to: new FormControl({ value: 0, disabled: true }),
  });

  addCryptoForm = new FormGroup({
    selectCrypto: new FormControl(),
  });

  loadCryptoData(index: number) {
    this.selectedCrypto = this.currentUser?.saved[index];
    this.convertForm.get('to')?.setValue(0);
    this.convertForm.get('from')?.setValue(0);
    this.cryptoService.exchange(this.selectedCrypto!).subscribe((result) => {
      this.exchangeRate = result.rate;
    });
  }

  convert() {
    const amount = this.convertForm.get('from')?.value;

    if (this.isReversed === false) {
      this.exchangeResult = Number(amount) / this.exchangeRate!;
      this.convertForm.get('to')?.setValue(this.exchangeResult);
    } else {
      this.exchangeResult = Number(amount) * this.exchangeRate!;
      this.convertForm.get('to')?.setValue(this.exchangeResult);
    }

    console.log('convert. rate: ', this.exchangeRate);
  }

  reverse() {
    this.isReversed = !this.isReversed;

    this.convertForm
      .get('from')
      ?.setValue(Number(this.convertForm.get('to')?.value));

    this.convert();
    console.log('újraszámolás');
  }

  selectInputContent(event: FocusEvent) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }

  togglePopup() {
    this.isPopupOpened = !this.isPopupOpened;
  }

  addCrypto() {
    const selectedCrypto = this.addCryptoForm.get('selectCrypto')?.value;
    if (selectedCrypto && !this.currentUser?.saved.includes(selectedCrypto)) {
      this.currentUser?.saved.push(selectedCrypto);
      console.log('Selected Crypto:', selectedCrypto);
    }
    this.loadCryptoData(this.currentUser?.saved.indexOf(selectedCrypto)!);
    this.togglePopup();
  }

  deleteCrypto() {
    this.currentUser?.saved.splice(
      this.currentUser?.saved.indexOf(this.selectedCrypto!),
      1
    );
    this.loadCryptoData(0);
  }
}
