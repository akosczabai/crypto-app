import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private akos = { username: 'akos', password: 'asd', saved: ['BTC', 'ETH'] };
  loggedInStatus = true; // change after done
  currentUser: User | null = this.akos; // cahnge after done

  // Name of local storage DB
  private storageKey = 'myUserData';

  constructor(private router: Router) {}

  private getUsersFromStorage(): {
    [key: string]: { password: string; saved: string[] };
  } {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveUsersToStorage(users: {
    [key: string]: { password: string; saved: string[] };
  }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  addUser(user: { username: string; password: string; saved: string[] }) {
    const storedData = localStorage.getItem(this.storageKey);

    let users: { [key: string]: { password: string; saved: string[] } } = {};

    if (storedData) {
      users = JSON.parse(storedData);
    }

    users[user.username] = { password: user.password, saved: user.saved };

    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  getUser(username: string): { saved: string[] } | undefined {
    const storedData = localStorage.getItem(this.storageKey);

    if (storedData) {
      const users: { [key: string]: { saved: string[] } } =
        JSON.parse(storedData);
      return users[username];
    }
    return undefined;
  }

  private errorMessageSubject = new Subject<string | undefined>();
  errorMessage$: Observable<string | undefined> =
    this.errorMessageSubject.asObservable();

  setErrorMessage(message: string | undefined): void {
    this.errorMessageSubject.next(message);
  }

  login(username: string, password: string) {
    const users = this.getUsersFromStorage();
    const user = users[username];
    this.setErrorMessage(undefined);
    if (user) {
      if (user.password === password) {
        this.loggedInStatus = true;
        this.currentUser = { username, password, saved: user.saved };
        this.router.navigate(['dashboard']);
      } else {
        this.setErrorMessage('Wrong password!');
      }
    } else {
      const newUser: { password: string; saved: string[] } = {
        password,
        saved: [],
      };

      users[username] = newUser;
      this.saveUsersToStorage(users);

      this.loggedInStatus = true;
      this.currentUser = { username, password, saved: newUser.saved };
      this.router.navigate(['dashboard']);
    }
  }
}
