SELECT CASE WHEN (pending<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'pending'
WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
WHEN approved <>0 AND pending=0 THEN 'approved'
END AS STATUS,
 branch,credit,approved,cancelled,pending,balance,Submitted_date,created_by,bill_submission FROM
 (SELECT a.branch,pcc.credit AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',pcc.balance,
 DATE(Submitted_date) AS'Submitted_date',created_by,bill_submission
 FROM(SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission
 FROM `pettycash` WHERE branch IN (?) AND STATUS IN (2,4)
GROUP BY
branch,
bill_submission
)  AS a
LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
GROUP BY
branch,
bill_submission
) AS b
ORDER BY
STATUS DESC
