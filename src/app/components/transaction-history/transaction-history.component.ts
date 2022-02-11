import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../interfaces/transaction.interface";
import {TransactionService} from "../../services/transaction.service";
import {firstValueFrom, Observable} from "rxjs";
import {PathNameService} from "../../services/path-name.service";

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  public transactions!: Transaction[];

  constructor(
    private transactionService: TransactionService,
    private pathNameService: PathNameService
  ) {
    this.transactionService.getTransactions().subscribe(transactions =>
      this.transactions = this.reverseTransactionArray(transactions)
    );
  }

  ngOnInit(): void {
    this.transactionService.updateTransactionHistory().subscribe();
    this.pathNameService.updatePathName("Transactions");
  }

  // Summary: Reverses the data returned by the transactionService so the newest transactions are displayed first
  // Param: An array containing Transaction objects
  // Returns: An array of reversed order containing Transaction objects
  private reverseTransactionArray(transactions: Transaction[]): Transaction[] {
    let reversedTransaction: Transaction[] = [];

    for (let i = transactions.length - 1; i >= 0; i--) {
      reversedTransaction.push(transactions[i]);
    }

    return reversedTransaction;
  }

}
