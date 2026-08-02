const hongKongDateTime = new Intl.DateTimeFormat("en-HK", {
  timeZone: "Asia/Hong_Kong",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatAdminDateTime(value: string) {
  return hongKongDateTime.format(new Date(value));
}

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("en-HK", {
    timeZone: "Asia/Hong_Kong",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatMoney(amountCents: number, currency = "HKD") {
  return new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}
