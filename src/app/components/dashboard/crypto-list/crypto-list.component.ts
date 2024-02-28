import { Component, OnInit } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss'],
})
export class CryptoListComponent implements OnInit {
  cryptoList = this.userService.currentUser?.saved;

  constructor(
    private cryptoService: CryptoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}
}
