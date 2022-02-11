import { Component, OnInit } from '@angular/core';
import {BankAccountService} from "../../services/bank-account.service";
import {BankAccount} from "../../interfaces/bank-account.interface";

@Component({
  selector: 'app-account-values',
  templateUrl: './account-values.component.html',
  styleUrls: ['./account-values.component.css']
})
export class AccountValuesComponent implements OnInit {
  bankAccount!: BankAccount;

  constructor(
    private bankAccountService: BankAccountService
  ) {
    this.bankAccountService.getBankAccount().subscribe(bankAccount => this.bankAccount = bankAccount);
  }

  ngOnInit(): void {
  }

}
