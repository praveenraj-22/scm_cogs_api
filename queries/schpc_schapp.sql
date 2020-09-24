SELECT CASE WHEN (pending<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'pending'
WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
WHEN approved <>0 AND pending=0 THEN 'approved'
END AS "approval_status", CASE WHEN STATUS=1 THEN 'pending'
WHEN STATUS=2 THEN 'approved'
WHEN STATUS=3 THEN 'cancelled'
WHEN STATUS=4 THEN 'finance approved'
WHEN STATUS=5 THEN 'finance cancelled'
END AS STATUS,
 branch,credit,approved,cancelled,pending,balance,Submitted_date,created_by,cancel_date,STATUS AS 'statusno',bill_submission FROM
 (
 SELECT a.branch,pcc.credit AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',pcc.balance,
 DATE(Submitted_date) AS'Submitted_date',created_by,cancel_date,a.status,bill_submission
 FROM
 (SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,cancel_date,bill_submission
 FROM `pettycash` WHERE branch IN (?) AND STATUS IN (?)
GROUP BY
branch,
MONTH(bill_submission)
)  AS a
LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
GROUP BY
branch,
bill_submission
) AS b
ORDER BY
STATUS DESC,
Submitted_date DESC


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
