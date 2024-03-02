import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  ngOnInit(): void {
    this.currentUser = this.userService.currentUser;
  }

  constructor(private router: Router, private userService: UserService) {}

  // Logout
  logout() {
    this.router.navigate(['']);
    this.currentUser = null;
  }
}
