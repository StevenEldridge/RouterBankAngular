import { Component, OnInit } from '@angular/core';
import {UserAccount} from "../../interfaces/user-account.interface";
import {BankAccount} from "../../interfaces/bank-account.interface";
import {TokenService} from "../../services/token.service";
import {UserAccountService} from "../../services/user-account.service";
import {BankAccountService} from "../../services/bank-account.service";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  form = {
    userAccountForm: {
      name: "",
      username: "",
      pass: "",
      birthdate: "",
      addr: "",
      phone: "",
      snn: "",
    },
    bankAccountForm: {
      ussn: "",
      accountid: "",
      checkbal: "",
      savebal: "",
      mpr: "0.05",
      mpr_enable: "false"
    }
  };
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

  // Summary: Takes the user submitted form data calls the API several times to set up a new user
  // Params:
  // Returns:
  async createAccount() {
    // Exits the function if the form has invalid inputs
    if (!this.isFormDataValid()) {
      return;
    }

    // Converts the form data into a user account object
    let userAccount: UserAccount = {
      name: this.form.userAccountForm.name,
      username: this.form.userAccountForm.username,
      pass: this.form.userAccountForm.pass,
      birthdate: this.form.userAccountForm.birthdate,
      addr: this.form.userAccountForm.addr,
      phone: this.form.userAccountForm.phone,
      snn: this.form.userAccountForm.snn,
    }

    // Converts the form data into a bank account object
    let bankAccount: BankAccount = {
      ussn: this.form.userAccountForm.snn,
      accountid: 0,
      checkbal: Number.parseFloat(this.form.bankAccountForm.checkbal),
      savebal: Number.parseFloat(this.form.bankAccountForm.savebal),
      mpr: Number.parseFloat(this.form.bankAccountForm.mpr),
      mpr_enable: false
    }

    // Calls the API to create a user account and validates that it was created successfully
    await firstValueFrom(this.userAccountService.createUserAccount(userAccount));
    if (this.token == "") {
      this.errorMessage = "There was an error creating your account";
      return;
    }

    // Records what the first token given by the API is for validating the bank account later
    let firstToken = this.token;
    this.form.bankAccountForm.ussn = this.form.userAccountForm.snn;

    // Calls the API to create a bank account and validates that it was created successfully
    await firstValueFrom(this.bankAccountService.createBankAccount(bankAccount));
    if (this.token === firstToken) {
      this.errorMessage = "There was an error creating your bank account";
      return;
    }

    // Calls the API to get the accountID of the first bank account the user owns
    await firstValueFrom(this.tokenService.updateAccountID());
    if (this.accountID == 0) {
      this.errorMessage = "There was an issue fetching your accountID";
      return;
    }

    // Updates the userAccount data stored in the userAccountService
    await firstValueFrom(this.userAccountService.updateUserAccount());
    if (this.userAccount.username == null) {
      this.errorMessage = "There was an issue fetching your user account";
      return;
    }

    // Updates the bankAccount data stored in the bankAccountService
    await firstValueFrom(this.bankAccountService.updateBankAccount());
    if (this.bankAccount.accountid == null) {
      this.errorMessage = "There was an issue fetching your bank account";
      return;
    }

    // Directs the user to the home page
    this.router.navigateByUrl("user");
  }

  // Summary: Conducts several validation checks to ensure that form data is valid
  // Params: Variables from the form data
  // Returns: A boolean value denoting if the form has all valid inputs
  isFormDataValid(): boolean {
    // Ensures the password is at least 8 characters long.
    // TODO: Add more password validation checks for enhanced security
    if (this.form.userAccountForm.pass.length < 8) {
      this.errorMessage = "Your password is too short";
      return false;
    }

    // Ensures the user entered a valid phone number
    if (
      !/^[0-9]*\.?[0-9]+$/.test(this.form.userAccountForm.phone) ||
      this.form.userAccountForm.phone.length !== 10
    ) {
      this.errorMessage = "There is an issue with your phone number";
      return false;
    }

    // Ensures the user entered a valid social security number
    if (
      !/^[0-9]*\.?[0-9]+$/.test(this.form.userAccountForm.snn) ||
      this.form.userAccountForm.snn.length !== 9
    ) {
      this.errorMessage = "There is an issue with your social security number";
      return false;
    }

    // Ensures the user entered a valid savings balance number
    if (!/^[0-9]*\.?[0-9]+$/.test(this.form.bankAccountForm.savebal)) {
      this.errorMessage = "Your savings balance is not a valid number";
      return false;
    }

    // Ensures the user entered a valid checking balance number
    if (!/^[0-9]*\.?[0-9]+$/.test(this.form.bankAccountForm.checkbal)) {
      this.errorMessage = "Your checking balance is not a valid number";
      return false;
    }

    return true;
  }
}
