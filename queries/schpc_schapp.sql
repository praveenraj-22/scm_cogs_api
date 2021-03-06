SELECT
CASE
WHEN (pending<>0) AND (STATUS<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0) THEN 'pending'
WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
WHEN approved <>0 AND pending=0 THEN 'approved'
WHEN refilled_amount<>0 THEN 'Refilled_amount'
WHEN (pending<>0) AND (STATUS=0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'Bill_raised'
END AS "approval_status",

CASE
WHEN STATUS=0 THEN 'Bill raised'
WHEN STATUS=1 THEN 'pending'
WHEN STATUS=2 THEN 'approved'
WHEN STATUS=3 THEN 'cancelled'
WHEN STATUS=4 THEN 'finance approved'
WHEN STATUS=5 THEN 'finance cancelled'
WHEN STATUS=6 THEN 'amount refilled'
END AS STATUS,
branch,Opening_Balance,credit,approved,cancelled,pending,
((credit)-((approved)-(cancelled)+(pending))) AS balance

,refilled_amount,refill,Submitted_date,created_by,cancel_date,STATUS AS 'statusno',bill_submission FROM
(



SELECT a.branch,pcc.credit AS 'Opening_Balance',IF(refill IS NULL,pcc.credit,refill) AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',
pcc.balance,refilled_amount,IF(refill IS NULL,0,refill) AS refill,DATE(Submitted_date) AS'Submitted_date',created_by,bill_submission,cancel_date,a.status
FROM(
--

SELECT * FROM (
--
-- SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
-- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
-- FROM `pettycash` WHERE  STATUS IN (0)
-- GROUP BY
-- branch,
-- MONTH(bill_submission)
--
-- UNION ALL
SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission,cancel_date
FROM `pettycash` WHERE branch IN (?) AND STATUS IN (?)
GROUP BY
branch,
MONTH(bill_submission)

-- UNION ALL
--
-- SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
-- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
-- FROM `pettycash` WHERE STATUS IN (1)
-- GROUP BY
-- branch,
-- MONTH(bill_submission)


-- UNION ALL
-- SELECT branch,0 AS 'approved',SUM(debit) AS 'cancelled',0 AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
-- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
-- FROM `pettycash` WHERE STATUS IN (3,5)
-- GROUP BY
-- branch,
-- MONTH(cancel_date)
--
-- UNION ALL
--
-- SELECT branch,0 AS 'approved',0 AS 'cancelled',0 AS 'pending',SUM(credit) AS refilled_amount,refilled_date AS 'Submitted_date',
-- fin_id AS 'created_by',STATUS,refilled_date,cancel_date
-- FROM `pettycash` WHERE  STATUS IN (6)
-- GROUP BY
-- branch,
-- MONTH(refilled_date)
)AS a
LEFT JOIN (
SELECT branch AS br ,SUM(credit) AS refill,DATE(created_date) AS crtdate FROM pettycash WHERE STATUS IN(6)
GROUP BY
branch,
MONTH(created_date)
)AS b ON a.branch=b.br AND MONTH(a.bill_submission)=MONTH(b.crtdate)

)  AS a
LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch

GROUP BY
branch,
bill_submission,
cancel_date,
a.status

ORDER BY
SUM(pending) DESC,
STATUS ASC

) AS b
ORDER BY
STATUS DESC,
branch ASC



-- SELECT CASE WHEN (pending<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'pending'
-- WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
-- WHEN approved <>0 AND pending=0 THEN 'approved'
-- END AS "approval_status", CASE WHEN STATUS=1 THEN 'pending'
-- WHEN STATUS=2 THEN 'approved'
-- WHEN STATUS=3 THEN 'cancelled'
-- WHEN STATUS=4 THEN 'finance approved'
-- WHEN STATUS=5 THEN 'finance cancelled'
-- END AS STATUS,
--  branch,credit,approved,cancelled,pending,balance,Submitted_date,created_by,cancel_date,STATUS AS 'statusno',bill_submission FROM
--  (
--  SELECT a.branch,pcc.credit AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',pcc.balance,
--  DATE(Submitted_date) AS'Submitted_date',created_by,cancel_date,a.status,bill_submission
--  FROM
--  (SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
-- ch_id AS 'created_by',STATUS,cancel_date,bill_submission
--  FROM `pettycash` WHERE branch IN (?) AND STATUS IN (?)
-- GROUP BY
-- branch,
-- MONTH(bill_submission)
-- )  AS a
-- LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
-- GROUP BY
-- branch,
-- bill_submission
-- ) AS b
-- ORDER BY
-- STATUS DESC,
-- Submitted_date DESC


-- SELECT CASE WHEN (pending<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'pending'
-- WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
-- WHEN approved <>0 AND pending=0 THEN 'approved'
-- END AS "approval_status", CASE WHEN STATUS=1 THEN 'pending'
-- WHEN STATUS=2 THEN 'approved'
-- WHEN STATUS=3 THEN 'cancelled'
-- WHEN STATUS=4 THEN 'finance approved'
-- WHEN STATUS=5 THEN 'finance cancelled'
-- END AS STATUS,
--  branch,credit,approved,cancelled,pending,balance,Submitted_date,created_by,bill_submission,STATUS AS 'statusno' FROM
--  (
--  SELECT a.branch,pcc.credit AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',pcc.balance,
--  DATE(Submitted_date) AS'Submitted_date',created_by,bill_submission,a.status
--  FROM
--  (SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
-- ch_id AS 'created_by',STATUS,bill_submission
--  FROM `pettycash` WHERE branch IN (?) AND STATUS IN (?)
-- GROUP BY
-- branch,
-- MONTH(bill_submission)
-- )  AS a
-- LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
-- GROUP BY
-- branch,
-- bill_submission
-- ) AS b
-- ORDER BY
-- STATUS DESC,
-- Submitted_date desc
