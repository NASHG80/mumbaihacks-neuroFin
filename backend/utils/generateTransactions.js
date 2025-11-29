import { faker } from "@faker-js/faker";

const merchants = [
  "Amazon","Flipkart","Swiggy","Zomato","Myntra","Paytm","Google Pay","PhonePe",
  "Uber","Rapido","DMart","BigBazaar","Apple","Netflix","Hotstar","Ola",
  "Blinkit","Zepto","Starbucks","KFC"
];

const types = ["UPI", "Debit Card", "Credit Card"];
const statuses = ["SUCCESS", "FAILED", "PENDING"];

/* ---------------------------------------------
   DATE HELPERS
---------------------------------------------- */

// Spread uniformly over last 12 months
function randomDateOverYear() {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const ts = faker.date.between({ from: oneYearAgo, to: now });
  return ts;
}

// Cluster around now ±15 min
function randomDateNearNow() {
  const now = new Date();
  const offsetMs = (Math.random() - 0.5) * 30 * 60 * 1000; // +/- 15 min
  return new Date(now.getTime() + offsetMs);
}

// Default (fallback): between Jan 2025 → now
function randomDate2025() {
  const start = new Date("2025-01-01");
  const end = new Date();
  return faker.date.between({ from: start, to: end });
}

/* ---------------------------------------------
   MAIN GENERATOR
---------------------------------------------- */

export default function generateTransactions(
  cardNumber,
  count,
  bank,
  opts = { spreadOverYear: false, anchorNow: false }
) {
  const { spreadOverYear, anchorNow } = opts;

  const results = [];

  for (let i = 0; i < count; i++) {
    let timestamp;

    if (spreadOverYear) {
      timestamp = randomDateOverYear();
    } else if (anchorNow) {
      timestamp = randomDateNearNow();
    } else {
      timestamp = randomDate2025();
    }

    const monthKey = timestamp.toISOString().slice(0, 7);

    const merchant = faker.helpers.arrayElement(merchants);
    const type = faker.helpers.arrayElement(types);

    results.push({
      monthKey,
      transaction: {
        id: faker.string.uuid(),
        cardNumber,
        timestamp,
        merchant,
        amount: faker.number.int({ min: 50, max: 5000 }),
        currency: "INR",
        status: faker.helpers.arrayElement(statuses),
        type,
        bank,
        description: `${merchant} - Payment via ${type}`,
      }
    });
  }

  return results;
}
