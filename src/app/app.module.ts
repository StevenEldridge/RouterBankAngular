import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { LoginComponent } from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { AccountValuesComponent } from './components/account-values/account-values.component';
import { AccountOverviewComponent } from './components/account-overview/account-overview.component';
import { DepositWithdrawComponent } from './components/deposit-withdraw/deposit-withdraw.component';
import { HomeComponent } from './components/home/home.component';
import { ManageInterestComponent } from './components/manage-interest/manage-interest.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { TransferComponent } from './components/transfer/transfer.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { UserComponent } from './components/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CreateUserComponent,
    LoginComponent,
    NavBarComponent,
    HeaderComponent,
    AccountValuesComponent,
    AccountOverviewComponent,
    DepositWithdrawComponent,
    HomeComponent,
    ManageInterestComponent,
    TransactionHistoryComponent,
    TransferComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: AboutComponent},
      {path: '*', redirectTo: '', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'createaccount', component: CreateUserComponent},
      {path: 'user', component: UserComponent, children: [
        {path: '', component: HomeComponent},
        {path: 'home', component: HomeComponent},
        {path: 'overview', component: AccountOverviewComponent},
        {path: 'depositwithdraw', component: DepositWithdrawComponent},
        {path: 'transfer', component: TransferComponent},
        {path: 'interest', component: ManageInterestComponent},
        {path: 'transactions', component: TransactionHistoryComponent}
      ]}
    ]),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
