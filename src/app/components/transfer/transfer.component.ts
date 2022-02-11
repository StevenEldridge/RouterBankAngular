import { Component, OnInit } from '@angular/core';
import {BankAccount} from "../../interfaces/bank-account.interface";
import {BankAccountService} from "../../services/bank-account.service";
import {firstValueFrom} from "rxjs";
import {PathNameService} from "../../services/path-name.service";

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  public errorMessage: string = "";
  public form = {
    transferTo: "checking",
    amount: ""
  }
  private bankAccount!: BankAccount;

  constructor(
    private bankAccountService: BankAccountService,
    private pathNameService: PathNameService
  ) {
    this.bankAccountService.getBankAccount().subscribe(bankAccount => this.bankAccount = bankAccount);
  }

  ngOnInit(): void {
    this.pathNameService.updatePathName("Transfer");
  }

  // Summary: Submits a request to the API to make a transfer between accounts
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

    // Converts the form input string into a number for the API
    let amount = Number.parseFloat(this.form.amount)

    //Ensures that there is enough money in savings to withdraw
    if (
      this.form.transferTo === "checking" &&
      amount > this.bankAccount.savebal
    ) {
      this.errorMessage = "Error: You do not have enough money in your savings account";
      return;
    }

    //Ensures that there is enough money in checking ot withdraw
    if (
      this.form.transferTo == "savings" &&
      amount > this.bankAccount.checkbal
    ) {
      this.errorMessage = "Error: You do not have enough money in your checking account";
      return;
    }

    //Asks the bankAccountService to make a put and get API call
    await firstValueFrom(this.bankAccountService.transfer(this.form.transferTo, this.form.amount));
    await firstValueFrom(this.bankAccountService.updateBankAccount());
    this.errorMessage = "";
  }

}
