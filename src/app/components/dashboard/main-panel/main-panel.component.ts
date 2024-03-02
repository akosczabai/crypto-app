import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { CryptoService } from 'src/app/services/crypto.service';
import { UserService } from 'src/app/services/user.service';
import { CryptoModel } from 'src/app/models/crypto.model';
import { CryptoHistoryModel } from 'src/app/models/cryptoHistory.model';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss'],
})
export class MainPanelComponent implements OnInit, OnDestroy {
  // ------------------ CHART VARIABLES----------------

  view: any = [];
  // CHART OPTIONS
  showLabels: boolean = true;
  animations: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Days';
  yAxisLabel: string = 'Cost in USD';
  timeline: boolean = true;
  autoScale: boolean = true;

  colorScheme: any = {
    domain: ['#12E1FC'],
  };
  //------------------------------------------------

  convertForm = new FormGroup({
    from: new FormControl(0),
    to: new FormControl({ value: 0, disabled: true }),
  });

  addCryptoForm = new FormGroup({
    selectCrypto: new FormControl(),
  });

  //-------------------------------------------------------

  currentUser: User | null = null;
  allSavedCryptos: CryptoModel[] = [];
  allSavedCryptoNames: string[] = [];
  currentCrypto: CryptoModel | null | undefined = null;
  currentCryptoName: string = '';
  currentExchangeRate: number = 0;
  currentHistoricalData: CryptoHistoryModel[] = [];
  exchangeResult: number = 0;
  chartData: any[] = [];
  isReversed: boolean = false;
  isPopupOpened: boolean = false;
  allCrypto: string[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.fetchAllCrypto();
    this.getUserData();

    if (this.allSavedCryptoNames.length > 0) {
      this.setCurrentCrypto(0);
    }
  }

  ngOnDestroy(): void {
    this.currentUser = null;
    this.allSavedCryptos = [];
    this.allSavedCryptoNames = [];
    this.currentCrypto = null;
    this.currentCryptoName = '';
    this.currentExchangeRate = 0;
    this.currentHistoricalData = [];
    this.exchangeResult = 0;
    this.chartData = [];
    this.isReversed = false;
    this.isPopupOpened = false;
    this.allCrypto = [];
  }

  //Selecting a crypto to display data on dashboard
  setCurrentCrypto(id: number) {
    this.currentCryptoName = this.allSavedCryptoNames[id];
    this.currentCrypto = this.allSavedCryptos.find(
      (crypto) => crypto.name === this.currentCryptoName
    );
    this.currentExchangeRate = this.currentCrypto!.rate;
    this.getDataForCharts();
  }

  //Getting fresh data about the logged in user
  getUserData() {
    this.allSavedCryptoNames = this.currentUser?.saved!;

    //getting all saved cryptos exchange rate
    this.cryptoService
      .exchange(this.allSavedCryptoNames!)
      .subscribe((exchangeData) => {
        if (exchangeData && exchangeData.rates) {
          exchangeData.rates.forEach((crypto) => {
            if (crypto && crypto.asset_id_quote && crypto.rate) {
              this.allSavedCryptos.push({
                name: crypto.asset_id_quote,
                rate: crypto.rate,
              });
            }
          });

          this.setCurrentCrypto(0);
        }
      });
  }

  // Getting Chart data
  getDataForCharts() {
    if (this.currentCrypto?.historicalData === undefined) {
      this.cryptoService
        .gettingHistoricalData(this.currentCrypto!.name)
        .subscribe((data) => {
          const dataToShow: CryptoHistoryModel[] = [];
          data.reverse().forEach((record: any) => {
            const currentDate = new Date(record.time_close);

            const currentDayOfMonth = currentDate.getDate();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            const neceseryData = {
              name: `${currentYear}. ${
                currentMonth + 1
              }. ${currentDayOfMonth}.`,
              value: record.price_close,
            };

            dataToShow.push(neceseryData);
          });

          this.chartData = [
            {
              name: 'Cost',
              series: dataToShow,
            },
          ];

          const foundCrypto = this.allSavedCryptos.find((crypto) => {
            return crypto.name === this.currentCryptoName;
          });

          if (foundCrypto) {
            foundCrypto.historicalData = this.chartData;
            this.currentHistoricalData = this.chartData;
          } else {
            console.error('Crypto not found');
          }
        });
    } else {
      this.currentHistoricalData = this.currentCrypto!.historicalData;
      this.chartData = this.currentHistoricalData;
    }
  }

  // Currency converting method
  convert() {
    const amount = this.convertForm.get('from')?.value;

    if (this.isReversed === true) {
      this.exchangeResult = Number(amount) / this.currentExchangeRate;
      this.convertForm.get('to')?.setValue(this.exchangeResult);
    } else {
      this.exchangeResult = Number(amount) * this.currentExchangeRate!;
      this.convertForm.get('to')?.setValue(this.exchangeResult);
    }
  }

  // Reverse converting
  reverse() {
    this.isReversed = !this.isReversed;

    this.convertForm
      .get('from')
      ?.setValue(Number(this.convertForm.get('to')?.value));

    this.convert();
  }

  //Getting amount from input field
  selectInputContent(event: FocusEvent) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }

  // Open/close popup
  togglePopup() {
    this.isPopupOpened = !this.isPopupOpened;
  }

  // Fetching all cryptos from API
  fetchAllCrypto() {
    if (this.allCrypto.length <= 0) {
      this.cryptoService.getAllCrypto().subscribe({
        next: (cryptoList: string[]) => {
          this.allCrypto = cryptoList;
        },
        error: (error) => {
          console.error('Error fetching crypto list:', error);
        },
      });
    }
  }

  // Adding new crypto to user collection
  addCrypto() {
    const selectedCrypto = this.addCryptoForm.get('selectCrypto')?.value;
    if (
      this.currentUser &&
      selectedCrypto &&
      !this.currentUser.saved.includes(selectedCrypto)
    ) {
      this.currentUser.saved.push(selectedCrypto);

      this.userService.updateUser({
        ...this.currentUser,
        saved: [...this.currentUser.saved],
      });

      this.getUserData();

      this.togglePopup();
    }
  }

  // Deleting crypto forom user collection
  deleteCrypto() {
    this.currentUser?.saved.splice(
      this.currentUser?.saved.indexOf(this.currentCrypto?.name!),
      1
    );

    this.userService.updateUser({
      ...this.currentUser!,
      saved: [...this.currentUser!.saved],
    });

    this.allSavedCryptos = [];
    this.getUserData();
  }
}
