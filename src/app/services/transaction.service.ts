import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, of, tap} from "rxjs";
import {Transaction} from "../interfaces/transaction.interface";
import {LoggerService} from "./logger.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {BankAccount} from "../interfaces/bank-account.interface";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private token!: string;
  private accountID!: number;
  private transactions$: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([] as Transaction[]);
  private baseURL = "https://localhost:7259";

  constructor(
    private logger: LoggerService,
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.tokenService.getToken().subscribe(token => this.token = token);
    this.tokenService.getAccountID().subscribe(accountID => this.accountID = accountID);
  }

  // Summary: Returns the transactions BehaviorSubject
  // Param:
  // Returns: A BehaviorSubject array containing the user's transaction history
  getTransactions() {
    return this.transactions$;
  }

  // Summary: Calls the API to get the most recent transaction history
  // Param:
  // Returns: An observable array containing the most recent transaction history
  updateTransactionHistory() {
    return this.http.get<Transaction[]>(this.baseURL + "/" + this.accountID + "/transactionhistory", {
      headers: new HttpHeaders ({
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json, text/plain',
      })}
    ).pipe(
      catchError(err => {
        this.logger.handleError('updateTransactionHistory', err);
        return of(Object() as Transaction);
      }),
      tap(() => this.logger.add("Updated Transaction History")),
      tap(transactions => this.transactions$.next(transactions as Transaction[]))
    )
  }
}
