import { Component, OnInit } from '@angular/core';
import {UserAccountService} from "../../services/user-account.service";
import {BankAccountService} from "../../services/bank-account.service";
import {UserAccount} from "../../interfaces/user-account.interface";
import {BankAccount} from "../../interfaces/bank-account.interface";
import {PathNameService} from "../../services/path-name.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userAccount!: UserAccount;
  public bankAccount!: BankAccount;
  public pathName!: String;

  // Monitors the window width to see if HTML and CSS needs to be updated to the mobile view
  public windowWidth$ = new Observable<number>(subscriber => {
    const interval = setInterval(() => {
      subscriber.next(window.innerWidth);
    }, 300);
    return function unsubscribe() {
      clearInterval(interval);
    }
  });
  public windowWidth!: number;


  constructor(
    private userAccountService: UserAccountService,
    private bankAccountService: BankAccountService,
    private pathNameService: PathNameService
  ) {
    this.windowWidth$.subscribe({
      next: windowWidth => {
        this.windowWidth = windowWidth;

        // Ensures that the nav-component won't be hidden when the HTML switches to desktop mode
        if (
          windowWidth > 600 &&
          !this.pathNameService.getShowNavBar().value
        ) {
          this.pathNameService.getShowNavBar().next(true);
        }
      }
    });

    this.userAccountService.getUserAccount().subscribe(userAccount => this.userAccount = userAccount);
    this.bankAccountService.getBankAccount().subscribe(bankAccount => this.bankAccount = bankAccount);
    this.pathNameService.getPathName().subscribe(pathName => this.pathName = pathName);
  }

  ngOnInit(): void {
    if (window.innerWidth < 601) {
      this.pathNameService.getShowNavBar().next(false);
    }
  }

  ngOnDestroy(): void {
    this.windowWidth$.subscribe().unsubscribe();
  }

  // Summary: When the ShowNavBar button is clicked it reverses the current boolean value
  // Param:
  // Returns:
  updateShowNavBar() {
    if (this.pathNameService.getShowNavBar().value) {
      this.pathNameService.getShowNavBar().next(false);
    } else {
      this.pathNameService.getShowNavBar().next(true);
    }
  }

}
