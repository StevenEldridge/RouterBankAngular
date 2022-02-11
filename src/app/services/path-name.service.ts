import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PathNameService {
  // A behavior subject containing a user-friendly name for the current webpage
  private pathName$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  // A behavior subject containing a boolean value determining if the navigation component should be rendered or not
  private showNavBar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }

  // Summary: Returns the pathName BehaviorSubject
  // Param:
  // Returns: A BehaviorSubject containing the pathName string data
  getPathName(): BehaviorSubject<string> {
    return this.pathName$;
  }

  // Summary: updates the pathName string data
  // Param: A string containing the next value for the pathName data
  // Returns: A BehaviorSubject containing the pathName data
  updatePathName(newName: string): BehaviorSubject<string> {
    this.pathName$.next(newName);
    return this.pathName$;
  }

  // Summary: Returns the showNavBar BehaviorSubject
  // Param:
  // Returns: A BehaviorSubject containing the showNavBar boolean value
  getShowNavBar(): BehaviorSubject<boolean> {
    return this.showNavBar$;
  }
}
