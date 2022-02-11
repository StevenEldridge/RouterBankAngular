import { Component, OnInit } from '@angular/core';
import {BankAccountService} from "../../services/bank-account.service";
import {BankAccount} from "../../interfaces/bank-account.interface";
import {firstValueFrom} from "rxjs";
import {PathNameService} from "../../services/path-name.service";

@Component({
  selector: 'app-deposit-withdraw',
  templateUrl: './deposit-withdraw.component.html',
  styleUrls: ['./deposit-withdraw.component.css']
})
export class DepositWithdrawComponent implements OnInit {
  form = {
    action: "deposit",
    account: "checking",
    amount: ""
  };
  errorMessage: string = "";
  bankAccount!: BankAccount;

  constructor(
    private bankAccountService: BankAccountService,
    private pathNameService: PathNameService
  ) {
    this.bankAccountService.getBankAccount().subscribe(bankAccount => this.bankAccount = bankAccount);
  }

  ngOnInit(): void {
    this.pathNameService.updatePathName("Deposit/Withdraw");
  }

  // Summary: Submits a request to the API to make a deposit or withdraw
  // Param:
  // Returns:
  async submit() {
    //Ensures that a valid number has been entered for the amount
    if (
      this.form.amount == "" ||
      !/^[0-9]*\.?[0-9]+$/.test(this.form.amount)
    ) {
      this.errorMessage = "Error: You did not enter a valid amount";
      return;
    }

    let amount = Number.parseFloat(this.form.amount)

    //Ensures that there is enough money in savings to withdraw
    if (
      this.form.action.concat(this.form.account) == "withdrawsavings" &&
       amount > this.bankAccount.savebal
    ) {
      this.errorMessage = "Error: You do not have enough money in your savings account";
      return;
    }

    //Ensures that there is enough money in checking ot withdraw
    if (
      this.form.action.concat(this.form.account) == "withdrawchecking" &&
      amount > this.bankAccount.checkbal
    ) {
      this.errorMessage = "Error: You do not have enough money in your checking account";
      return;
    }

    //Asks the bankAccountService to make a put and get API call
    await firstValueFrom(this.bankAccountService.depositOrWithdraw(
      this.form.action.concat(this.form.account),
      this.form.amount
    ));
    await firstValueFrom(this.bankAccountService.updateBankAccount());
    this.errorMessage = "";
  }
}
