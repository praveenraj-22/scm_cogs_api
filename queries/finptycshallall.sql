SELECT CASE WHEN (pending<>0)  AND (STATUS<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'pending'
WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
WHEN approved <>0 AND pending=0 THEN 'approved'
WHEN refilled_amount<>0 THEN 'Refilled_amount'
WHEN (pending<>0) AND (STATUS=0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'Bill_raised'
END AS "approval_status",
 CASE
WHEN STATUS=0 THEN 'Bill raised'
WHEN  STATUS =1  THEN 'Need SCH Approval'
WHEN STATUS =2 THEN 'Pending'
WHEN STATUS =3 THEN 'Cancelled by SCH'
WHEN STATUS =4  THEN 'Approved'
WHEN STATUS =5 THEN 'Cancelled'
WHEN STATUS=6 THEN 'amount refilled'
END AS STATUS,
 branch,Opening_Balance,credit,approved,cancelled,sum(pending) as pending,
((credit)-((approved)-(can)+(pending))) AS balance

,refilled_amount,refill,sum(can) as can,Submitted_date,created_by,cancel_date,STATUS AS 'statusno',bill_submission, CONCAT(branch,approved,cancelled,pending,bill_submission) AS 'test',IF(Payment_receipt IS NULL,'NA',Payment_receipt) AS Payment_receipt FROM
(
--
SELECT a.branch,pcc.credit AS 'Opening_Balance',IF(refill IS NULL,pcc.credit,refill) AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',
pcc.balance,refilled_amount,IF(refill IS NULL,0,refill) AS refill,IF(can IS NULL,0,can) AS can,DATE(Submitted_date) AS'Submitted_date',created_by,bill_submission,cancel_date,a.status,Payment_receipt
 FROM(
SELECT * FROM (
SELECT * FROM
(
SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission,cancel_date,'' as Payment_receipt
FROM `pettycash` WHERE branch IN (?) and STATUS IN (0)
GROUP BY
branch,
MONTH(bill_submission)

UNION ALL

SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission,cancel_date,'' as Payment_receipt
 FROM `pettycash` WHERE branch IN (?) and  STATUS IN (4)
GROUP BY
branch,
MONTH(bill_submission)

UNION ALL

SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission,cancel_date,'' AS Payment_receipt
 FROM `pettycash` WHERE branch IN (?) and  STATUS IN (1)
GROUP BY
branch,
MONTH(bill_submission)

UNION ALL
SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission,cancel_date,'' AS Payment_receipt
 FROM `pettycash` WHERE branch IN (?) and  STATUS IN (2)
GROUP BY
branch,
MONTH(bill_submission)



UNION ALL
SELECT branch,0 AS 'approved',SUM(debit) AS 'cancelled',0 AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission,cancel_date,'' as Payment_receipt
 FROM `pettycash` WHERE branch IN (?) and STATUS IN (3,5)
GROUP BY
branch,
MONTH(cancel_date)

UNION ALL

SELECT branch,0 AS 'approved',0 AS 'cancelled',0 AS 'pending',SUM(credit) AS refilled_amount,refilled_date AS 'Submitted_date',
fin_id AS 'created_by',STATUS,refilled_date,cancel_date,Payment_receipt
FROM `pettycash` WHERE branch IN (?) and  STATUS IN (6)
GROUP BY
branch,
MONTH(refilled_date),
Payment_receipt
)  AS a
LEFT JOIN (
SELECT branch AS br ,SUM(credit) AS refill,DATE(created_date) AS crtdate FROM pettycash WHERE STATUS IN(6)
GROUP BY
branch,
MONTH(created_date)
)AS b ON a.branch=b.br AND MONTH(a.bill_submission)=MONTH(b.crtdate)
) AS c
LEFT JOIN (
SELECT branch AS br1 ,SUM(credit) AS can,DATE(created_date) AS crtdate1 FROM pettycash WHERE STATUS IN(3,5)
GROUP BY
branch,
MONTH(cancel_date)
)AS c1 ON c.branch=c1.br1 AND MONTH(c.bill_submission)=MONTH(c1.crtdate1)

)  AS a
LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
GROUP BY
branch,
bill_submission,
cancel_date
 ,a.status
ORDER BY
SUM(pending) DESC,
STATUS ASC

) AS b
GROUP BY
branch,
approval_status
,statusno
 ,CASE WHEN statusno =6 THEN bill_submission
 ELSE 0
 END


ORDER BY
STATUS DESC,
branch ASC