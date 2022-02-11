import { Injectable } from '@angular/core';
import {UserAccount} from "../interfaces/user-account.interface";
import {LoggerService} from "./logger.service";
import {BehaviorSubject, catchError, combineLatest, mergeMap, Observable, of, Subject, tap} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {stringify} from "@angular/compiler/src/util";

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {
  private userAccount$: BehaviorSubject<UserAccount> = new BehaviorSubject<UserAccount>(Object() as UserAccount);
  private accountID!: number;
  private token!: string;
  private baseURL = "https://localhost:7259";

  constructor(
    private logger: LoggerService,
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.tokenService.getToken().subscribe(token => this.token = token);
    this.tokenService.getAccountID().subscribe(accountID => this.accountID = accountID);
  }

  // Summary: Returns the userAccount BehaviorSubject
  // Param:
  // Returns: A BehaviorSubject containing the userAccount object data stored in the service
  getUserAccount(): BehaviorSubject<UserAccount> {
    return this.userAccount$;
  }

  // Summary: Calls the API to request the most recent userAccount data
  // Param:
  // Returns: An observable containing the userAccount data
  updateUserAccount(): Observable<UserAccount> {
    return this.http.get<UserAccount>(this.baseURL + "/" + this.accountID + "/useraccount", {
      headers: new HttpHeaders ({
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json, text/plain'
      })}
    ).pipe(
      catchError(err => {
        this.logger.handleError('updateUserAccount', err);
        return of(Object() as UserAccount);
      }),
      tap(() => this.logger.add("Updated userAccount")),
      tap(userAccount => this.userAccount$.next(userAccount))
    )
  }

  // Summary: Calls the API and attempts to create a new user account
  // Param "userAccount": A UserAccount object containing data for the new user account
  // Returns: An observable containing a token from the API server given upon successful account creation
  createUserAccount(userAccount: UserAccount): Observable<[string, string]> {
    return this.tokenService.hashPassword(userAccount.pass).pipe(
      mergeMap(hashedPassword => {
        return combineLatest([
          of(hashedPassword).pipe(
            tap(() => userAccount.pass = hashedPassword)
          ),
          this.http.post<string>(this.baseURL + "/createuseraccount", userAccount, {
              headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Accept': 'application/json, text/plain'
              })
            }
          ).pipe(
            catchError(err => {
              this.logger.handleError('CreateUserAccount', err);
              return of("");
            }),
            tap(() => this.logger.add("Created User Account")),
            tap(token => this.tokenService.getToken().next(token))
          )
        ])
      })
    )
  }
}
