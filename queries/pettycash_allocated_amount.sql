SELECT credit,debit,balance,paa.branch,notify_amount,
CONCAT('PC','/',pv.entity,'/',pv.branch,'/',SUM(pv.sequence_no)+1,'/',pv.year) AS voucher_no
FROM pettycash_allocate_amount AS paa
inner JOIN `pettycash_voucher` AS pv ON paa.branch=pv.branch
 WHERE paa.branch in ( ? ) AND
 paa.STATUS=1
