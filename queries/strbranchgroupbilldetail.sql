SELECT CASE
WHEN pc.status=0 THEN 'bill_raised'
WHEN pc.status=1 THEN 'pending'
WHEN pc.status=2 THEN 'Approved'
WHEN pc.status=3 THEN 'Cancelled'
WHEN pc.status=4 THEN 'Approved by Finance'
WHEN pc.status=5 THEN 'Cancelled by Finance'
 END AS 'Active_status',CASE
 WHEN pc.voucher_attach='' THEN 'NA'
  WHEN pc.voucher_attach IS NULL THEN 'NA'
 ELSE pc.voucher_attach
 END AS 'voucher_attach',
 CASE
 WHEN pc.bill_attch='' THEN 'NA'
  WHEN pc.bill_attch IS NULL THEN 'NA'
 ELSE pc.bill_attch
 END AS 'bill_attach',
 pc.branch AS 'branch',pcc.category_name AS 'category_name',DATE(pc.bill_date) AS 'Bill_date',
DATE(pc.created_date) AS 'Submitted_date', SUM(pc.debit) AS 'totalamount',pc.remarks AS 'Comments',
pc.ch_id AS 'created_by',pc.*
FROM `pettycash` AS pc
INNER JOIN `pettycash_category` AS pcc ON pcc.sno=pc.category_id
WHERE  DATE(created_date) BETWEEN CONCAT(YEAR(?),'-',MONTH(?),'-','01')
AND CONCAT(YEAR(?),'-',MONTH(?),'-','31') AND  pc.branch=? AND pc.status NOT IN (6) AND pc.credit IS NULL
AND pc.category_id=? AND pc.status=?
GROUP BY
pcc.category_name,
pc.bill_date,
pc.created_date
ORDER BY
branch




-- SELECT CASE
-- WHEN pc.status=1 THEN 'pending'
-- WHEN pc.status=2 THEN 'Approved'
-- WHEN pc.status=3 THEN 'Cancelled'
-- WHEN pc.status=4 THEN 'Approved by Finance'
-- WHEN pc.status=5 THEN 'Cancelled by Finance'
--  END AS 'Active_status',CASE
--  WHEN pc.voucher_attachment='' THEN 'NA'
--   WHEN pc.voucher_attachment IS NULL THEN 'NA'
--  ELSE pc.voucher_attachment
--  END AS 'voucher_attach',
--  CASE
--  WHEN pc.bill_attachment='' THEN 'NA'
--   WHEN pc.bill_attachment IS NULL THEN 'NA'
--  ELSE pc.bill_attachment
--  END AS 'bill_attach',
--  pc.branch AS 'branch',pcc.category_name AS 'category_name',DATE(pc.Actual_bill_date) AS 'Bill_date',
-- DATE(pc.created_date) AS 'Submitted_date', SUM(pc.debit) AS 'totalamount',pc.remarks AS 'Comments',
-- pc.ch_id AS 'created_by',pc.*
-- FROM `pettycash` AS pc
-- INNER JOIN `pettycash_category` AS pcc ON pcc.sno=pc.category_id
-- WHERE  DATE(created_date) BETWEEN ? AND ? AND  pc.branch=? AND pc.status NOT IN (6) and pc.credit is null
-- AND pcc.category_name=?
-- GROUP BY
-- pcc.category_name,
-- pc.Actual_bill_date,
-- pc.created_date
-- ORDER BY
-- branch
