import { Component, OnInit } from '@angular/core';
import {UserAccountService} from "../../services/user-account.service";
import {BankAccountService} from "../../services/bank-account.service";
import {TokenService} from "../../services/token.service";
import {Router} from "@angular/router";
import {concatMap, firstValueFrom, lastValueFrom} from "rxjs";
import {UserAccount} from "../../interfaces/user-account.interface";
import {BankAccount} from "../../interfaces/bank-account.interface";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model = { username: "", password: "" };
  errorMessage: string = "";
  private token: string = "";
  private accountID: number = 0;
  private userAccount!: UserAccount;
  private bankAccount!: BankAccount;

  constructor(
    private tokenService: TokenService,
    private userAccountService: UserAccountService,
    private bankAccountService: BankAccountService,
    private router: Router
  ) {
    this.tokenService.getToken().subscribe(token => this.token = token);
    this.tokenService.getAccountID().subscribe(accountID => this.accountID = accountID);
    this.userAccountService.getUserAccount().subscribe(userAccount => this.userAccount = userAccount);
    this.bankAccountService.getBankAccount().subscribe(bankAccount => this.bankAccount = bankAccount);
  }

  ngOnInit(): void {
  }

  // Summary: Calls the API and attempts to log the user in
  // Param:
  // Returns:
  async login() {
    // Makes a login API call and checks if it returns a token to determine success or not
    await firstValueFrom(this.tokenService.login(this.model.username, this.model.password));
    if (this.token == "") {
      this.errorMessage = "Invalid username or password";
      return;
    }

    // Calls the API to get an accountID for the first bank accoun the user owns
    await firstValueFrom(this.tokenService.updateAccountID());
    if (this.accountID == 0) {
      this.errorMessage = "There was an issue fetching your accountID";
      return;
    }

    // Calls the API to fetch the most recent userAccount data for the userAccountService
    await firstValueFrom(this.userAccountService.updateUserAccount());
    if (this.userAccount.username == null) {
      this.errorMessage = "There was an issue fetching your user account";
      return;
    }

    // Calls the API to fetch the most recent bankAccount data for the bankAccountService
    await firstValueFrom(this.bankAccountService.updateBankAccount());
    if (this.bankAccount.accountid == null) {
      this.errorMessage = "There was an issue fetching your bank account";
      return;
    }

    this.router.navigateByUrl("user");
  }
}
