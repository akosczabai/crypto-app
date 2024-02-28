import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedInStatus = true; // change after done
  currentUser: User | null = {
    username: 'akos',
    password: 'asd',
    saved: ['BTC', 'ETH'],
  }; // cahnge after done

  private db = {
    users: [
      {
        username: 'akos',
        password: 'asd',
        saved: ['BTC', 'ETH'],
      },
    ],
  };

  constructor(private router: Router) {}

  login(username: string, password: string) {
    console.log('request megérkezett');

    const userIndex = this.db.users.findIndex((user) => {
      return user.username === username;
    });

    if (userIndex !== -1 && this.db.users[userIndex].password === password) {
      console.log(this.db.users[userIndex]);

      this.loggedInStatus = true;
      this.currentUser = this.db.users[userIndex];
      this.router.navigate(['dashboard']);
    }
    // else if (userToLogIn && userToLogIn.password === !password) {
    //   this.db;
    // }
    else {
      const newUser: User = {
        username: username,
        password: password,
        saved: [],
      };
      console.log('új felhasználó: ', newUser);
      this.db.users.push(newUser);
      this.loggedInStatus = true;
      this.currentUser = newUser;
      this.router.navigate(['dashboard']);
    }
  }
}
