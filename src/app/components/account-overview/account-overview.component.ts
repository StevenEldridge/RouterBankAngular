import { Component, OnInit } from '@angular/core';
import {UserAccount} from "../../interfaces/user-account.interface";
import {BankAccount} from "../../interfaces/bank-account.interface";
import {UserAccountService} from "../../services/user-account.service";
import {BankAccountService} from "../../services/bank-account.service";
import {PathNameService} from "../../services/path-name.service";

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.css']
})
export class AccountOverviewComponent implements OnInit {
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
    this.pathNameService.updatePathName("Account Overview");
  }

  // Summary: Converts true and false boolean into enabled and disabled strings
  // Param:
  // Returns: "Enabled" or "Disabled"
  mprEnabledDisabled(): string {
    if (this.bankAccount.mpr_enable) {
      return "Enabled";
    }
    return "Disabled";
  }

}
