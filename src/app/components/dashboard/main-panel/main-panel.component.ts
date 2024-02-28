import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { CryptoService } from 'src/app/services/crypto.service';
import { UserService } from 'src/app/services/user.service';

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
  historicalData: any[] = [];

  // CHART VARIABLES
  multi: any[] = [];
  view: any = [700, 400];

  // CHART OPTIONS
  showLabels: boolean = true;
  animations: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Days';
  yAxisLabel: string = 'Cost in USD';
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

  //------------------------------------------------

  constructor(
    private router: Router,
    private userService: UserService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.loadCryptoData(0);
  }

  loadCryptoData(index: number) {
    this.selectedCrypto = this.currentUser?.saved[index];
    this.convertForm.get('to')?.setValue(0);
    this.convertForm.get('from')?.setValue(0);
    this.cryptoService
      .exchange(this.selectedCrypto!)
      .subscribe((rate: number) => {
        this.exchangeRate = rate;
      });
    this.getHistoricalData();
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

  // GET HISTORICAL DATA FROM API

  getHistoricalData() {
    this.cryptoService
      .gettingHistoricalData(this.selectedCrypto!)
      .subscribe((result) => {
        this.historicalData = result;
        console.log('historical data:', this.selectedCrypto, result);
        const dataToShow: any[] = [];
        this.historicalData.reverse().forEach((data: any) => {
          const currentDate = new Date(data.time_close);

          const currentDayOfMonth = currentDate.getDate();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          const neceseryData = {
            name: `${currentYear}. ${currentMonth + 1}. ${currentDayOfMonth}.`,
            value: data.price_close,
          };
          dataToShow.push(neceseryData);
        });

        this.multi = [
          {
            name: 'Cost',
            series: dataToShow,
          },
        ];
        console.log('multi', this.multi);
      });
  }

  // REVERSE CURRENCY CHANGE

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
