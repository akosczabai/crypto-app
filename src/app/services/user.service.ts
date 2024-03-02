import { BehaviorSubject, Observable, Subject, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedInStatus = false;
  currentUser: User | null = null;

  // Current user as a BehaviorSubject
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(this.currentUser);
  currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  // Name of local storage DB
  private storageKey = 'myUserData';

  constructor(private router: Router) {}

  //Getting all user fromn DB
  private getUsersFromStorage(): {
    [key: string]: { password: string; saved: string[] };
  } {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : {};
  }

  // Save User to DB
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

    // Adding my own user defaultly
    if (!users['akos']) {
      users['akos'] = { password: 'asd', saved: ['BTC', 'ETH'] };
    }

    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  // Getting logged in user
  getUser(username: string): { saved: string[] } | undefined {
    const storedData = localStorage.getItem(this.storageKey);

    if (storedData) {
      const users: { [key: string]: { saved: string[] } } =
        JSON.parse(storedData);
      return users[username];
    }
    return undefined;
  }

  // Update user
  updateUser(user: User) {
    this.currentUserSubject.next(user);

    const storedData = localStorage.getItem(this.storageKey);
    let users: { [key: string]: { password: string; saved: string[] } } = {};

    if (storedData) {
      users = JSON.parse(storedData);
    }

    users[user.username] = { password: user.password, saved: user.saved };
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  // Setting up error message for wrong password
  private errorMessageSubject = new Subject<string | undefined>();
  errorMessage$: Observable<string | undefined> =
    this.errorMessageSubject.asObservable();

  setErrorMessage(message: string | undefined): void {
    this.errorMessageSubject.next(message);
  }

  // Login
  login(username: string, password: string) {
    const users = this.getUsersFromStorage();
    const user = users[username];
    this.setErrorMessage(undefined);
    if (user) {
      if (user.password === password) {
        this.loggedInStatus = true;
        this.currentUser = { username, password, saved: user.saved };
        this.currentUserSubject.next(this.currentUser);
        this.router.navigate(['dashboard']);
      } else {
        // Wrong password
        this.setErrorMessage('Wrong password!');
      }
    } else {
      //Registrate new empty user
      const newUser: { password: string; saved: string[] } = {
        password,
        saved: [],
      };

      // Navigate to dashboard azter login or registration
      users[username] = newUser;
      this.saveUsersToStorage(users);

      this.loggedInStatus = true;
      this.currentUser = { username, password, saved: newUser.saved };
      this.currentUserSubject.next(this.currentUser);
      this.router.navigate(['dashboard']);
    }
    // this.currentUser$.pipe(tap((data) => console.log(data))).subscribe();
  }
}
