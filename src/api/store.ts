import { Loan, Payment } from '@/models/loan';

async function getLoans(url: string) {
  let loans: Loan[] = [];
  await fetch(url)
    .then(response => response.json())
    .then(data => (loans = data.map((e: any) => new Loan(e))))
    .catch(err => console.log(err));

  return loans;
}

async function getPayments(url: string, options: any) {
  let payments: Payment[] = [];
  await fetch(url, options)
    .then(response => response.json())
    .then(data => (payments = data.data.map((e: any) => new Payment(e))))
    .catch(err => console.log(err));
  return payments;
}

class API {
  // all of the constants required
  private loansURL = 'http://loan-backend/loans/';
  private upURL =
    'https://api.up.com.au/api/v1/transactions?filter%5Btag%5D=LoanPayment';
  private upHeaders = {
    headers: new Headers({
      Authorization:
        'Bearer up:yeah:NhSasHMass5wnO7RnGM7FxM9DOjSpdrQzvnQxDNO5jM7GcTwVq4b7MwLq2Hely3iSGuIKrEFtGPa60v356Z597pGInWGyNrtSquaiUolCxZtng5s6pUO77dRr2qWH6xy'
    })
  };
  public loans: Loan[] = [];
  constructor() {
    // do nothing
  }

  async getLoans() {
    const loans = getLoans(this.loansURL);
    const payments = getPayments(this.upURL, this.upHeaders);
    const values = await Promise.all([payments, loans]);
    console.log('loans', loans, 'payments', payments);
    //combine the values
    values[0].forEach((e: Payment) => {
      values[1].forEach((f: Loan) => {
        // if between date and if the loan is the most
        if (
          e.settledAt.getTime() > f.startDate.getTime() &&
          e.settledAt.getTime() < f.endDate.getTime()
        ) {
          f.addPayment(e);
        }
      });
    });
    return values;
  }
}

export const store: API = new API();
