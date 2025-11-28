export type CanonicalTransaction = {
  user_id: string,
  account_id?: string,
  timestamp: string,
  amount: number,
  direction: 'debit' | 'credit',
  merchant?: string,
  category?: string,
  currency?: string,
  raw?: any
};
