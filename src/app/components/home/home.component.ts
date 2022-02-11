import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PathNameService} from "../../services/path-name.service";
import {UserAccount} from "../../interfaces/user-account.interface";
import {BankAccount} from "../../interfaces/bank-account.interface";
import {UserAccountService} from "../../services/user-account.service";
import {BankAccountService} from "../../services/bank-account.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userAccount!: UserAccount;
  public bankAccount!: BankAccount;

  constructor(
    private userAccountService: UserAccountService,
    private bankAccountService: BankAccountService,
    private pathNameService: PathNameService
  ) {
    this.userAccountService.getUserAccount().subscribe(userAccount => this.userAccount = userAccount);
    this.bankAccountService.getBankAccount().subscribe(bankAccount => this.bankAccount = bankAccount);
  }

  ngOnInit(): void {
    this.pathNameService.updatePathName("Home");
  }

}
