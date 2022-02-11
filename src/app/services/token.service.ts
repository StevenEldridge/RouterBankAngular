import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  from,
  mergeMap,
  Observable,
  of,
  tap,
} from "rxjs";
import {LoggerService} from "./logger.service";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private accountID$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private baseURL = "https://localhost:7259";

  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) {
    this.token$.next("");
    this.accountID$.next(0);
  }

  // Summary: Returns a behavior subject containing the token
  // Param:
  // Returns: A BehaviorSubject containing the session token
  getToken(): BehaviorSubject<string> {
    return this.token$;
  }

  // Summary: Returns an accountID behavior subject
  // Param:
  // Returns: A BehaviorSubject containing the first accountID of the first bank account the user owns
  getAccountID(): BehaviorSubject<number> {
    return this.accountID$;
  }

  // Summary: Hashes the user's password and then makes an API call to attempt to log the user in
  // Param "username": A string containing the user's username
  // Param "password": A string containing the user's plaintext password
  // Returns: An observable containing the authentication token handed out during successful login
  login(username: string, password: string): Observable<[string, string]> {
    return this.hashPassword(password).pipe(
      mergeMap(hashedPassword => {
        return combineLatest([
          of(hashedPassword),
          this.http.post<string>(this.baseURL + "/login", {}, {
            headers: new HttpHeaders ({
              'Content-type': 'application/json',
              'Accept': 'application/json, text/plain',
              'username': username,
              'password': hashedPassword
            })}
          ).pipe(
            catchError(err => {
              this.logger.handleError('Login', err);
              return of("");
            }),
            tap( () => this.logger.add("Logged in")),
            tap(token => this.token$.next(token))
          )
        ])
      })
    )
  }

  // Summary: Makes an API call to get all accountID's the user owns
  // Param:
  // Returns: An observable containing all accountID's the user owns but only stores the first in the service
  updateAccountID(): Observable<number[]> {
    return this.http.get<number[]>(this.baseURL + "/bankaccountsowned", {
      headers: new HttpHeaders ({
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token$.getValue(),
        'Accept': 'application/json, text/plain'
      })}
    ).pipe(
      catchError(err => {
        this.logger.handleError('Update AccountID', err);
        return of([0]);
      }),
      tap(() => this.logger.add("Updated accountID")),
      tap(accountsOwned => this.accountID$.next(accountsOwned[0]))
    )
  }

  // Summary: Hashes a plaintext password into SHA-256  TODO: Add salts to the hash
  // Param "password": A string containing the plaintext password
  // Returns: An observable containing the hashed SHA-256 password
  hashPassword(password: string): Observable<string> {
    return new Observable<string>(subscriber => {
      const utf8 = new TextEncoder().encode(password);
      const hashedBuff: Observable<ArrayBuffer> = from(crypto.subtle.digest('SHA-256', utf8));
      hashedBuff.subscribe({next: (buff) => {
          let hashedArray = Array.from(new Uint8Array(buff));
          subscriber.next(hashedArray.map(b => b.toString(16).padStart(2, '0')).join(''));
      }});
    });
  }
}
