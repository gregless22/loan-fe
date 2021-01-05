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
  private loansURL = process.env.VUE_APP_LOANS_URL;
  private upURL = process.env.VUE_APP_UP_URL;
  private upHeaders = {
    headers: new Headers({
      Authorization: process.env.VUE_APP_UP_AUTH
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
    console.log(values);
    console.log('Env variable', this.upURL, this.upHeaders);

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
