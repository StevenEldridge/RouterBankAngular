import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  logs: string[] = [];

  constructor() { }


  // Summary: Adds a new log to the logs array
  // Param: A string containing log information
  // Returns:
  add(log: string) {
    this.logs.push(log);
  }

  // Summary: Clears all stored logs
  // Param:
  // Returns:
  clear() {
    this.logs = [];
  }

  // Summary: Handles errors that could occur during API calls
  // Param "operation": Data on the operation that was running when the error occurred
  // Param "result": Optional data regarding the specific error that occurred
  // Returns: The error that was passed to the function
  handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      this.add(operation + " failed: " + error.meesage);
      return of(result as T);
    }
  }
}
