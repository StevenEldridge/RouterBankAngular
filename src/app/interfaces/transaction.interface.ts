export interface Transaction {
  acntid: number,
  act: "deposit" | "withdraw"
  amount: number,
  account: "checking" | "savings",
  tDate: string,
  newbal: number
}
