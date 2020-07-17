select * from currency_rates  where currency_date=(select max(currency_date) as latest_late from currency_rates);
