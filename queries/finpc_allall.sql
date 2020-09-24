SELECT CASE
WHEN (SUM(pending<>0) OR (SUM(cancelled) <>0 AND SUM(approved)<>0 AND SUM(pending)<>0)) AND statusno=2 THEN 'Pending'
WHEN (SUM(pending<>0) OR (SUM(cancelled) <>0 AND SUM(approved)<>0 AND SUM(pending)<>0)) AND statusno=1 THEN 'sch pending'
WHEN SUM(cancelled) <>0 AND (SUM(approved)=0 AND SUM(pending)=0) THEN 'cancelled'
WHEN SUM(approved) <>0 AND SUM(pending)=0 THEN 'approved'

END AS 'STATUS',
approval_status,branch,credit,SUM(approved) AS 'approved',SUM(cancelled) AS 'cancelled',
SUM(pending) AS 'pending',balance,Submitted_date,created_by,cancel_date,statusno,bill_submission,
CONCAT(branch,approved,cancelled,pending,bill_submission) AS 'test'

 FROM (
 SELECT CASE WHEN (pending<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'pending'
WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
WHEN approved <>0 AND pending=0 THEN 'approved'
END AS "approval_status",
 CASE WHEN  STATUS =1  THEN 'Need SCH Approval'
                    WHEN STATUS =2 THEN 'Pending'
                    WHEN STATUS =3 THEN 'Cancelled by SCH'
                    WHEN STATUS =4  THEN 'Approved'
                    WHEN STATUS =5 THEN 'Cancelled'
END AS STATUS,
 branch,credit,approved,cancelled,pending,balance,Submitted_date,created_by,cancel_date,STATUS AS 'statusno',bill_submission FROM
 (

 SELECT a.branch,pcc.credit AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',
 pcc.balance,DATE(Submitted_date) AS'Submitted_date',created_by,bill_submission,cancel_date,a.status
 FROM(
SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission,cancel_date
 FROM `pettycash` WHERE  STATUS IN (4)
GROUP BY
branch,
MONTH(bill_submission)

UNION ALL

SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission,cancel_date
 FROM `pettycash` WHERE  STATUS IN (2,1)
GROUP BY
branch,
MONTH(bill_submission)


UNION ALL
SELECT branch,0 AS 'approved',SUM(debit) AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS,bill_submission,cancel_date
 FROM `pettycash` WHERE STATUS IN (3,5)
GROUP BY
branch,
MONTH(cancel_date)

)  AS a
LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
GROUP BY
branch,
bill_submission,
cancel_date

) AS b
ORDER BY
branch ASC,
STATUS DESC,
Submitted_date DESC
) AS c
GROUP BY
branch,
MONTH(Submitted_date)
ORDER BY
branch ASC,
STATUS DESC,
Submitted_date DESC
