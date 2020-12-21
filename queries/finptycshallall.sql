
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
 branch,Opening_Balance,credit,approved,cancelled,pending,
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
ch_id AS 'created_by',STATUS,bill_submission,cancel_date,'' as Payment_receipt
 FROM `pettycash` WHERE branch IN (?) and STATUS IN (2,1)
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
MONTH(refilled_date)
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
MONTH(created_date)
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
 ,CASE WHEN statusno =6 THEN bill_submission
 ELSE 0
 END


ORDER BY
STATUS DESC,
branch ASC


--
--  SELECT CASE WHEN (pending<>0)  AND (STATUS<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'pending'
-- WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
-- WHEN approved <>0 AND pending=0 THEN 'approved'
-- WHEN refilled_amount<>0 THEN 'Refilled_amount'
-- WHEN (pending<>0) AND (STATUS=0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'Bill_raised'
-- END AS "approval_status",
--  CASE
-- WHEN STATUS=0 THEN 'Bill raised'
-- WHEN  STATUS =1  THEN 'Need SCH Approval'
-- WHEN STATUS =2 THEN 'Pending'
-- WHEN STATUS =3 THEN 'Cancelled by SCH'
-- WHEN STATUS =4  THEN 'Approved'
-- WHEN STATUS =5 THEN 'Cancelled'
-- WHEN STATUS=6 THEN 'amount refilled'
-- END AS STATUS,
--  branch,Opening_Balance,credit,approved,cancelled,pending,
-- ((credit)-((approved)-(cancelled)+(pending))) AS balance
--
-- ,refilled_amount,refill,Submitted_date,created_by,cancel_date,STATUS AS 'statusno',bill_submission, CONCAT(branch,approved,cancelled,pending,bill_submission) AS 'test' FROM
-- (
-- --
-- SELECT a.branch,pcc.credit AS 'Opening_Balance',IF(refill IS NULL,pcc.credit,refill) AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',
-- pcc.balance,refilled_amount,IF(refill IS NULL,0,refill) AS refill,DATE(Submitted_date) AS'Submitted_date',created_by,bill_submission,cancel_date,a.status
--  FROM(
-- --
-- SELECT * FROM
-- (
-- SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
-- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
-- FROM `pettycash` WHERE branch IN (?) AND   STATUS IN (0)
-- GROUP BY
-- branch,
-- MONTH(bill_submission)
--
-- UNION ALL
--
-- SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
-- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
--  FROM `pettycash` WHERE branch IN (?) AND  STATUS IN (4)
-- GROUP BY
-- branch,
-- MONTH(bill_submission)
--
-- UNION ALL
--
-- SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
-- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
--  FROM `pettycash` WHERE branch IN (?) AND  STATUS IN (2,1)
-- GROUP BY
-- branch,
-- MONTH(bill_submission)
--
--
-- UNION ALL
-- SELECT branch,0 AS 'approved',SUM(debit) AS 'cancelled',0 AS 'pending',0 AS refilled_amount,created_date AS 'Submitted_date',
-- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
--  FROM `pettycash` WHERE branch IN (?) AND  STATUS IN (3,5)
-- GROUP BY
-- branch,
-- MONTH(cancel_date)
--
-- UNION ALL
--
-- SELECT branch,0 AS 'approved',0 AS 'cancelled',0 AS 'pending',SUM(credit) AS refilled_amount,refilled_date AS 'Submitted_date',
-- fin_id AS 'created_by',STATUS,refilled_date,cancel_date
-- FROM `pettycash` WHERE branch IN (?) AND  STATUS IN (6)
-- GROUP BY
-- branch,
-- MONTH(refilled_date)
-- )  AS a
-- LEFT JOIN (
-- SELECT branch AS br ,SUM(credit) AS refill,DATE(created_date) AS crtdate FROM pettycash WHERE STATUS IN(6)
-- GROUP BY
-- branch,
-- MONTH(created_date)
-- )AS b ON a.branch=b.br AND MONTH(a.bill_submission)=MONTH(b.crtdate)
--
--
-- )  AS a
-- LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
-- GROUP BY
-- branch,
-- bill_submission,
-- cancel_date
-- ORDER BY
-- SUM(pending) DESC,
-- STATUS ASC
--
-- ) AS b
-- ORDER BY
-- STATUS DESC,
-- branch ASC
--
--
--
--
--
-- -- SELECT CASE
-- -- WHEN (SUM(pending<>0) OR (SUM(cancelled) <>0 AND SUM(approved)<>0 AND SUM(pending)<>0)) AND statusno=2 THEN 'Pending'
-- -- WHEN (SUM(pending<>0) OR (SUM(cancelled) <>0 AND SUM(approved)<>0 AND SUM(pending)<>0)) AND statusno=1 THEN 'sch pending'
-- -- WHEN SUM(cancelled) <>0 AND (SUM(approved)=0 AND SUM(pending)=0) THEN 'cancelled'
-- -- WHEN SUM(approved) <>0 AND SUM(pending)=0 THEN 'approved'
-- --
-- -- END AS 'STATUS',
-- -- approval_status,branch,credit,SUM(approved) AS 'approved',SUM(cancelled) AS 'cancelled',
-- -- SUM(pending) AS 'pending',balance,Submitted_date,created_by,cancel_date,statusno,bill_submission
-- --
-- --  FROM (
-- --  SELECT CASE WHEN (pending<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'pending'
-- -- WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
-- -- WHEN approved <>0 AND pending=0 THEN 'approved'
-- -- END AS "approval_status",
-- --  CASE WHEN  STATUS =1  THEN 'Need SCH Approval'
-- --                     WHEN STATUS =2 THEN 'Pending'
-- --                     WHEN STATUS =3 THEN 'Cancelled by SCH'
-- --                     WHEN STATUS =4  THEN 'Approved'
-- --                     WHEN STATUS =5 THEN 'Cancelled'
-- -- END AS STATUS,
-- --  branch,credit,approved,cancelled,pending,balance,Submitted_date,created_by,cancel_date,STATUS AS 'statusno',bill_submission
-- -- ,CONCAT(branch,approved,cancelled,pending,bill_submission) AS 'test'
-- --  FROM
-- --  (
-- --
-- --  SELECT a.branch,pcc.credit AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',
-- --  pcc.balance,DATE(Submitted_date) AS'Submitted_date',created_by,bill_submission,cancel_date,a.status
-- --  FROM(
-- -- SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
-- -- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
-- --  FROM `pettycash` WHERE branch IN (?) AND STATUS IN (4)
-- -- GROUP BY
-- -- branch,
-- -- MONTH(bill_submission)
-- --
-- -- UNION ALL
-- --
-- -- SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',created_date AS 'Submitted_date',
-- -- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
-- --  FROM `pettycash` WHERE branch IN (?) AND STATUS IN (2,1)
-- -- GROUP BY
-- -- branch,
-- -- MONTH(bill_submission)
-- --
-- --
-- -- UNION ALL
-- -- SELECT branch,0 AS 'approved',SUM(debit) AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
-- -- ch_id AS 'created_by',STATUS,bill_submission,cancel_date
-- --  FROM `pettycash` WHERE branch IN (?) AND STATUS IN (3,5)
-- -- GROUP BY
-- -- branch,
-- -- MONTH(cancel_date)
-- --
-- -- )  AS a
-- -- LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
-- -- GROUP BY
-- -- branch,
-- -- bill_submission,
-- -- cancel_date
-- --
-- -- ) AS b
-- -- ORDER BY
-- -- branch ASC,
-- -- STATUS DESC,
-- -- Submitted_date DESC
-- -- ) AS c
-- -- GROUP BY
-- -- branch,
-- -- MONTH(Submitted_date)
-- -- ORDER BY
-- -- branch ASC,
-- -- STATUS DESC,
-- -- Submitted_date DESC
--
--
--
--
-- -- SELECT CASE WHEN (pending<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'pending'
-- -- WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
-- -- WHEN approved <>0 AND pending=0 THEN 'approved'
-- -- END AS STATUS,
-- --  branch,credit,approved,cancelled,pending,balance,Submitted_date,created_by FROM
-- --  (SELECT a.branch,pcc.credit AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',pcc.balance,DATE(Submitted_date) AS'Submitted_date',created_by
-- --  FROM(SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
-- -- ch_id AS 'created_by',STATUS
-- --  FROM `pettycash` WHERE  STATUS IN (4) AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY
-- -- branch
-- -- UNION ALL
-- -- SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',created_date AS 'Submitted_date',
-- -- ch_id AS 'created_by',STATUS
-- --  FROM `pettycash` WHERE  STATUS=2  AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY
-- -- branch
-- -- UNION ALL
-- -- SELECT branch,0 AS 'approved',SUM(debit) AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
-- -- ch_id AS 'created_by',STATUS
-- --  FROM `pettycash` WHERE  STATUS IN (3,5)  AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY
-- -- branch
-- -- )  AS a
-- -- LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
-- -- GROUP BY
-- -- branch
-- -- )AS b
-- -- ORDER BY
-- -- STATUS DESC
--
-- -- SELECT b.branch,
-- --             b.STATUS,
-- --             paa.credit,
-- --             b.totalamount,
-- --             paa.balance,
-- --             IF(Cancelled_amount IS NULL,0,Cancelled_amount) AS 'Cancelled_amount',
-- --             Submitted_date,
-- --             created_by,
-- --             status1
-- --      FROM
-- --        (SELECT PC.branch,
-- --                         A.status AS 'status',
-- --                         status1,
-- --                         SUM(Debit)AS'totalamount',
-- --                         COUNT(A.status) AS '2',
-- --                         DATE(PC.created_date) AS 'Submitted_date',
-- --                         DATE(PC.Bill_date) AS 'Bill_date',
-- --                         PC.ch_id AS 'created_by'
-- --            FROM pettycash PC
-- --            INNER JOIN
-- --              (SELECT branch,
-- --                     CASE WHEN STATUS =1  THEN 'Need SCH Approval'
-- --                     WHEN STATUS =2 THEN 'Pending'
-- --                     WHEN STATUS =3 THEN 'Cancelled by SCH'
-- --                     WHEN STATUS =4  THEN 'Approved'
-- --                     WHEN STATUS =5 THEN 'Cancelled'
-- --
-- --                     END  AS STATUS,
-- --                     STATUS AS 'status1'
-- --
-- --               FROM pettycash
-- --               WHERE
-- --                  DATE(created_date) BETWEEN ? AND ?
-- --               GROUP BY branch,STATUS
-- --               HAVING COUNT(*) >=1)AS A ON PC.branch = A.branch
-- --               AND PC.status = A.status1
-- --            WHERE DATE(created_date) BETWEEN ? AND ?
-- --            GROUP BY PC.branch,STATUS)
-- --
-- --            AS b
-- --            INNER JOIN `pettycash_allocate_amount` AS paa ON b.branch=paa.branch
-- --            LEFT JOIN
-- --            (SELECT branch,
-- --                    SUM(credit) AS 'Cancelled_amount'
-- --   FROM pettycash
-- --   WHERE STATUS IN (3,5)
-- -- group by
-- -- branch
-- -- ) AS cancelled
-- --   ON cancelled.branch = b.branch
-- --
-- --      ORDER BY b.STATUS DESC, Submitted_date DESC
--
--
-- --
-- -- SELECT b.branch,b.STATUS,paa.credit,b.totalamount,paa.balance,IF((status1=3)||(status1=5),totalamount,'') AS 'Cancelled_amount',
-- -- Submitted_date,created_by,status1 FROM (
-- --
-- -- SELECT a.branch,a.STATUS,totalamount,Submitted_date,created_by,status1 FROM (
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Pending' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =2 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=2
-- -- GROUP BY PC.branch
-- --
-- -- UNION
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Approved' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =4 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=4
-- -- GROUP BY PC.branch
-- --
-- -- UNION
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Cancelled' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =5 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=5
-- -- GROUP BY PC.branch
-- --
-- --  UNION
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Cancelled by SCH' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =3 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=3
-- -- GROUP BY PC.branch
-- --
-- -- UNION
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',
-- --
-- -- DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Need SCH Approval' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =1 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A
-- --
-- -- ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=1
-- -- GROUP BY PC.branch
-- -- ) AS a
-- --
-- -- )AS b
-- -- INNER JOIN `pettycash_allocate_amount` AS paa ON b.branch=paa.branch
-- -- ORDER BY
-- -- b.STATUS DESC,
-- -- Submitted_date
-- -- DESC
-- --
--
--
--
-- -- SELECT * FROM (
-- -- SELECT branch,STATUS,totalamount,Submitted_date,created_by,status1 FROM (
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Actual_bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Pending' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =2 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=2
-- -- GROUP BY PC.branch
-- --
-- -- UNION
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Actual_bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Approved' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =4 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=4
-- -- GROUP BY PC.branch
-- --
-- -- UNION
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Actual_bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Cancelled' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =5 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=5
-- -- GROUP BY PC.branch
-- --
-- --  UNION
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Actual_bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Cancelled by SCH' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =3 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=3
-- -- GROUP BY PC.branch
-- --
-- -- UNION
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Actual_bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,'Need SCH Approval' AS STATUS,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =1 AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A
-- --
-- -- ON PC.branch = A.branch
-- -- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=1
-- -- GROUP BY PC.branch
-- -- ) AS a
-- --
-- -- )AS b
-- -- INNER JOIN `pettycash_allocate_amount` AS paa ON b.branch=paa.branch
-- -- ORDER BY
-- -- STATUS,
-- -- Submitted_date
-- -- DESC
