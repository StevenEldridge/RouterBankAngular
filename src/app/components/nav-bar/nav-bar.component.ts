import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TokenService} from "../../services/token.service";
import {UserAccountService} from "../../services/user-account.service";
import {UserAccount} from "../../interfaces/user-account.interface";
import {BankAccount} from "../../interfaces/bank-account.interface";
import {BankAccountService} from "../../services/bank-account.service";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../interfaces/transaction.interface";
import {PathNameService} from "../../services/path-name.service";


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
    private userAccountService: UserAccountService,
    private bankAccountService: BankAccountService,
    private transactionService: TransactionService,
    private pathNameService: PathNameService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  // Summary: Routes the user to the requested webpage
  // Param: A string containing the sub url after /user/
  // Returns:
  navTo(destination: string) {
    // Closes the navigation component if the page is in mobile mode
    if (window.innerWidth < 600) {
      this.pathNameService.getShowNavBar().next(false);
    }

    this.route.navigateByUrl('/user/' + destination);
  }

  // Summary: Logs the user out by removing all stored data in the services and redirects to the home page
  // Param:
  // Returns:
  logout() {
    this.tokenService.getToken().next("");
    this.userAccountService.getUserAccount().next({} as UserAccount);
    this.bankAccountService.getBankAccount().next({} as BankAccount);
    this.transactionService.getTransactions().next([] as Transaction[]);
    this.route.navigateByUrl('');
  }

}
