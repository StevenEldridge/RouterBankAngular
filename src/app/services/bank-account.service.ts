import { Injectable } from '@angular/core';
import {LoggerService} from "./logger.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BankAccount} from "../interfaces/bank-account.interface";
import {BehaviorSubject, catchError, Observable, of, Subject, tap} from "rxjs";
import {TokenService} from "./token.service";
import {UserAccount} from "../interfaces/user-account.interface";

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private token!: string;
  private accountID!: number;
  private bankAccount$: BehaviorSubject<BankAccount> = new BehaviorSubject<BankAccount>(Object() as BankAccount);
  private baseURL = "https://localhost:7259";

  constructor(
    private logger: LoggerService,
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.tokenService.getToken().subscribe(token => this.token = token);
    this.tokenService.getAccountID().subscribe(accountID => this.accountID = accountID);
  }

  // Summary: Returns the bankAccount BehaviorSubject
  // Param:
  // Returns: A BehaviorSubject containing the bankAccount object data
  getBankAccount(): BehaviorSubject<BankAccount> {
    return this.bankAccount$;
  }

  // Summary: Calls the API requesting the most up to date bankAccount data
  // Param:
  // Returns: An Observable containing a bank account object
  updateBankAccount(): Observable<BankAccount> {
    return this.http.get<BankAccount>(this.baseURL + "/" + this.accountID + "/bankaccount", {
      headers: new HttpHeaders ({
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json, text/plain',
      })}
    ).pipe(
      catchError(err => {
        this.logger.handleError('updateBankAccount', err);
        return of(Object() as BankAccount);
      }),
      tap(() => this.logger.add("Updated bankAccount")),
      tap(bankAccount => this.bankAccount$.next(bankAccount))
    )
  }

  // Summary: Submits a request to the API to make a deposit or withdraw
  // Param "actionAccount": A string with a value of "depositchecking", "depositsavings",
  //    "withdrawchecking", or "withdrawsavings" that denotes the action to take
  // Param "amount": A numerical string containing the amount of money to deposit or withdraw
  // Returns: A string observable containing the API server response
  depositOrWithdraw(actionAccount: string, amount: string): Observable<string> {
    return this.http.put<string>(this.baseURL + "/" + this.accountID + "/" + actionAccount, {}, {
      headers: new HttpHeaders ({
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json, text/plain',
        'amount': amount
      })}
    ).pipe(
      catchError(err => {
        this.logger.handleError(actionAccount, err);
        return of("");
      }),
      tap(() => this.logger.add("Performed " + actionAccount))
    )
  }

  // Summary: Submits a request to the API to make a transfer between savings and checking
  // Param "transferTo": A string with the value of either "checking" or "savings"
  // Param "amount": A numerical string containing the amount of money to transfer
  // Returns: A string observable containing the API server response
  transfer(transferTo: string, amount: string): Observable<string> {
    return this.http.put<string>(this.baseURL + "/" + this.accountID + "/transfer", {}, {
      headers: new HttpHeaders ({
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json, text/plain',
        'transferTo': transferTo,
        'amount': amount
      })}
    ).pipe(
      catchError(err => {
        this.logger.handleError("Transfer", err);
        return of("");
      }),
      tap(() => this.logger.add("Performed Transfer"))
    )
  }

  // Summary: Submits a request to the API to update interest settings
  // Param "mprRate": A numerical string of the new MPR rate where 0.05 would denote 5% interest every minute
  // Param "mprEnable": A boolean string determining if interest should be accrued
  // Returns: A string observable containing the API server response
  updateInterest(mprRate: string, mprEnable: string): Observable<string> {
    return this.http.put<string>(this.baseURL + "/" + this.accountID + "/updatempr", {}, {
      headers: new HttpHeaders ({
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json, text/plain',
        'amount': mprRate,
        'enabled': mprEnable
      })}
    ).pipe(
      catchError(err => {
        this.logger.handleError("Update Interest", err);
        return of("");
      }),
      tap(() => this.logger.add("Performed Update Interest"))
    )
  }

  // Summary: Submits a request to the API to create a new bank account object
  // Param: A bank account object
  // Returns: A string observable containing a token that the API server responds with upon success
  createBankAccount(bankAccount: BankAccount): Observable<string> {
    return this.http.post<string>(this.baseURL + "/createbankaccount", bankAccount,
      {
        headers: new HttpHeaders ({
          'Content-type': 'application/json',
          'Authorization': 'Bearer ' + this.token,
          'Accept': 'application/json, text/plain'
        })
      }
    ).pipe(
      catchError(err => {
        this.logger.handleError('createBankAccount', err);
        return of("");
      }),
      tap(() => this.logger.add("Created BankAccount")),
      tap(token => this.tokenService.getToken().next(token))
    )
  }
}
