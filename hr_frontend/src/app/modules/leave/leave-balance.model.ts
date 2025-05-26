export interface LeaveBalance {
  annual: number;
  sick: number;
  maternity: number;
  paternity: number;
  study: number;
  compassionate: number;
  unpaid: number;
  other: number;
  [key: string]: number; // Index signature to allow dynamic access
}

export interface LeaveBalanceItem {
  type: string;
  allocated: number;
  used: number;
  remaining: number;
}
