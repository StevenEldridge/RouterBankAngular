import { Component, OnInit } from '@angular/core';
import {firstValueFrom, Observable} from "rxjs";
import {UserAccount} from "../../interfaces/user-account.interface";
import {BankAccount} from "../../interfaces/bank-account.interface";
import {TokenService} from "../../services/token.service";
import {UserAccountService} from "../../services/user-account.service";
import {BankAccountService} from "../../services/bank-account.service";
import {Router} from "@angular/router";
import {PathNameService} from "../../services/path-name.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private token!: string;
  private accountID!: number;
  private userAccount!: UserAccount;
  private bankAccount!: BankAccount;
  private interestTimeout!: any;
  public showNavBar!: boolean;

  constructor (
    private tokenService: TokenService,
    private userAccountService: UserAccountService,
    private bankAccountService: BankAccountService,
    private pathNameService: PathNameService,
    private router: Router
  ) {
    this.tokenService.getToken().subscribe(token => this.token = token);
    this.tokenService.getAccountID().subscribe(accountID => this.accountID = accountID);
    this.userAccountService.getUserAccount().subscribe(userAccount => this.userAccount = userAccount);
    this.bankAccountService.getBankAccount().subscribe(bankAccount => this.bankAccount = bankAccount);
  }

  ngOnInit(): void {
    this.pathNameService.getShowNavBar().subscribe(showNavBar => this.showNavBar = showNavBar);

    if (
      this.token === "" ||
      this.accountID === 0 ||
      this.userAccount.username == null ||
      this.bankAccount.accountid == null
    ) {
      this.router.navigateByUrl("login");
    }

    this.interestTimeout = setInterval(() => this.manageInterest(), 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interestTimeout);
  }

  // Summary: Calculates and deposits Routez earned through interest
  // Param:
  // Returns:
  async manageInterest() {
    // Only deposits Routez if interest is enabled
    if (this.bankAccount.mpr_enable) {
      // Asks the API to make a deposit for the interest earned
      await firstValueFrom(
        this.bankAccountService.depositOrWithdraw(
          "depositsavings",
          (this.bankAccount.savebal * this.bankAccount.mpr / 6).toFixed(2).toString()
        )
      );
      // Asks the API to fetch the most updated bankAccount information
      await firstValueFrom(this.bankAccountService.updateBankAccount());
    }
  }

}
