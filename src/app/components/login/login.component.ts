import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string | undefined;
  errorMessageSubscription!: Subscription;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.errorMessageSubscription = this.userService.errorMessage$.subscribe(
      (message) => {
        this.errorMessage = message;
      }
    );
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription.unsubscribe();
  }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  // Login
  login() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    if (username && password) {
      this.userService.login(username, password);
    }
  }
}
