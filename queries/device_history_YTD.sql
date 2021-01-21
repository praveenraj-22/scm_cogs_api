SELECT SUM(device_daily_count) AS YTDcount,branch FROM device_history  WHERE trans_date BETWEEN ? AND ? GROUP BY branch;

