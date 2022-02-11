import { Component, OnInit } from '@angular/core';
import {BankAccount} from "../../interfaces/bank-account.interface";
import {BankAccountService} from "../../services/bank-account.service";
import {firstValueFrom} from "rxjs";
import {PathNameService} from "../../services/path-name.service";

@Component({
  selector: 'app-manage-interest',
  templateUrl: './manage-interest.component.html',
  styleUrls: ['./manage-interest.component.css']
})
export class ManageInterestComponent implements OnInit {
  form = {
    mprRate: "",
    mprEnable: "true"
  };
  errorMessage: string = "";
  public bankAccount!: BankAccount;

  constructor(
    private bankAccountService: BankAccountService,
    private pathNameService: PathNameService
  ) {
    this.bankAccountService.getBankAccount().subscribe(bankAccount => this.bankAccount = bankAccount);
    this.form.mprRate = (this.bankAccount.mpr * 100).toFixed(2).toString();
  }

  ngOnInit(): void {
    this.pathNameService.updatePathName("Manage Interest");
  }

  // Summary: Submits a request to the API to update interest preferences
  // Param:
  // Returns:
  async submit() {
    //Ensures that a valid number has been entered for the amount
    if (
      this.form.mprRate == "" ||
      !/^[0-9]*\.?[0-9]+$/.test(this.form.mprRate)
    ) {
      this.errorMessage = "Error: You did not enter a valid amount";
      return;
    }

    // Converts the form data into valid data for the API and database
    let amount = Number.parseFloat(this.form.mprRate) / 100;

    //Ensures that the user doesn't put a crazy MPR Rate
    if (
      amount > 3.0
    ) {
      this.errorMessage = "Error: Sorry but that is too much :(";
      return;
    }

    //Asks the bankAccountService to make a put and get API call
    await firstValueFrom(this.bankAccountService.updateInterest(amount.toString(), this.form.mprEnable));
    await firstValueFrom(this.bankAccountService.updateBankAccount());
    this.errorMessage = "";
  }
}
