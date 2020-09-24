SELECT CASE WHEN (pending<>0) OR (cancelled <>0 AND approved<>0 AND pending<>0)  THEN 'Pending'
WHEN cancelled <>0 AND (approved=0 AND pending=0) THEN 'cancelled'
WHEN approved <>0 AND pending=0 THEN 'approved'
END AS STATUS,
 branch,credit,approved,cancelled,pending,balance,Submitted_date,created_by FROM
 (SELECT a.branch,pcc.credit AS 'credit',SUM(approved) AS'approved',SUM(cancelled)AS 'cancelled',SUM(pending) AS 'pending',pcc.balance,DATE(Submitted_date) AS'Submitted_date',created_by
 FROM(SELECT branch,SUM(debit) AS 'approved',0 AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS
 FROM `pettycash` WHERE  STATUS IN (4) AND branch IN (?) AND DATE(created_date) BETWEEN ? AND ?
GROUP BY
branch
UNION ALL
SELECT branch,0 AS 'approved',0 AS 'cancelled',SUM(debit) AS 'pending',created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS
 FROM `pettycash` WHERE  STATUS=2 AND branch IN (?) AND DATE(created_date) BETWEEN ? AND ?
GROUP BY
branch
UNION ALL
SELECT branch,0 AS 'approved',SUM(debit) AS 'cancelled',0 AS 'pending',created_date AS 'Submitted_date',
ch_id AS 'created_by',STATUS
 FROM `pettycash` WHERE  STATUS IN (3,5) AND branch IN (?)  AND DATE(created_date) BETWEEN ? AND ?
GROUP BY
branch
)  AS a
LEFT JOIN `pettycash_allocate_amount` AS pcc ON pcc.branch=a.branch
GROUP BY
branch
)AS b
ORDER BY
STATUS DESC

-- SELECT * FROM (SELECT b.branch,
--             b.STATUS,
--             paa.credit,
--             b.totalamount,
--             paa.balance,
--             IF(Cancelled_amount IS NULL,0,Cancelled_amount) AS 'Cancelled_amount',
--             Submitted_date,
--             created_by,
--             status1
--      FROM
--        (SELECT PC.branch,
--                         A.status AS 'status',
--                         status1,
--                         SUM(Debit)AS'totalamount',
--                         COUNT(A.status) AS '2',
--                         DATE(PC.created_date) AS 'Submitted_date',
--                         DATE(PC.Bill_date) AS 'Bill_date',
--                         PC.ch_id AS 'created_by'
--            FROM pettycash PC
--            INNER JOIN
--              (SELECT branch,
--                     CASE WHEN STATUS =1  THEN 'Need SCH Approval'
--                     WHEN STATUS =2 THEN 'Pending'
--                     WHEN STATUS =3 THEN 'Cancelled by SCH'
--                     WHEN STATUS =4  THEN 'Approved'
--                     WHEN STATUS =5 THEN 'Cancelled'
--
--                     END  AS STATUS,
--                     STATUS AS 'status1'
--
--               FROM pettycash
--               WHERE
--                  DATE(created_date) BETWEEN ? AND ?
--               GROUP BY branch,STATUS
--               HAVING COUNT(*) >=1)AS A ON PC.branch = A.branch
--               AND PC.status = A.status1
--            WHERE DATE(created_date) BETWEEN ? AND ?
--            GROUP BY PC.branch,STATUS)
--
--            AS b
--            INNER JOIN `pettycash_allocate_amount` AS paa ON b.branch=paa.branch
--            LEFT JOIN
--            (SELECT branch,
--                    SUM(credit) AS 'Cancelled_amount'
--   FROM pettycash
--   WHERE STATUS IN (3,5)
--   group by
--   branch
-- ) AS cancelled
--   ON cancelled.branch = b.branch
--
--      ORDER BY b.STATUS DESC, Submitted_date DESC) AS c WHERE c.branch=?


-- SELECT b.branch,b.STATUS,paa.credit,b.totalamount,paa.balance,
-- IF((status1=3)||(status1=5),totalamount,'') AS 'Cancelled_amount',
--  b.Submitted_date,b.created_by,status1 FROM (
-- SELECT branch,STATUS,totalamount,Submitted_date,created_by,status1 FROM (
--
-- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- INNER JOIN
-- (
-- SELECT branch,'Pending' AS STATUS,STATUS AS 'status1' FROM pettycash
-- WHERE STATUS =2 AND DATE(created_date) BETWEEN ? AND ?
-- GROUP BY branch
-- HAVING COUNT(*) >=1
-- )AS A ON PC.branch = A.branch
-- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=2
-- GROUP BY PC.branch
--
-- UNION
--
-- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- INNER JOIN
-- (
-- SELECT branch,'Approved' AS STATUS,STATUS AS 'status1' FROM pettycash
-- WHERE STATUS =4 AND DATE(created_date) BETWEEN ? AND ?
-- GROUP BY branch
-- HAVING COUNT(*) >=1
-- )AS A ON PC.branch = A.branch
-- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=4
-- GROUP BY PC.branch
--
-- UNION
--
-- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- INNER JOIN
-- (
-- SELECT branch,'Cancelled' AS STATUS,STATUS AS 'status1' FROM pettycash
-- WHERE STATUS =5 AND DATE(created_date) BETWEEN ? AND ?
-- GROUP BY branch
-- HAVING COUNT(*) >=1
-- )AS A ON PC.branch = A.branch
-- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=5
-- GROUP BY PC.branch
--
--  UNION
--
-- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- INNER JOIN
-- (
-- SELECT branch,'Cancelled by SCH' AS STATUS,STATUS AS 'status1' FROM pettycash
-- WHERE STATUS =3 AND DATE(created_date) BETWEEN ? AND ?
-- GROUP BY branch
-- HAVING COUNT(*) >=1
-- )AS A ON PC.branch = A.branch
-- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=3
-- GROUP BY PC.branch
--
-- UNION
--
-- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- INNER JOIN
-- (
-- SELECT branch,'Need SCH Approval' AS STATUS,STATUS AS 'status1' FROM pettycash
-- WHERE STATUS =1 AND DATE(created_date) BETWEEN ? AND ?
-- GROUP BY branch
-- HAVING COUNT(*) >=1
-- )AS A
--
-- ON PC.branch = A.branch
-- WHERE DATE(created_date) BETWEEN ? AND ? AND PC.status=1
-- GROUP BY PC.branch
-- ) AS a
--
-- )AS b
-- INNER JOIN `pettycash_allocate_amount` AS paa ON b.branch=paa.branch
-- WHERE b.branch=?
-- ORDER BY
-- b.STATUS DESC,
-- Submitted_date
-- DESC
--
--
--
--
-- -- SELECT * FROM (
-- -- SELECT branch,STATUS,totalamount,Submitted_date,created_by,status1 FROM (
-- --
-- -- SELECT PC.branch, A.status AS 'status',status1,SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
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
-- -- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
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
-- -- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
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
-- -- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
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
-- -- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
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
-- -- WHERE b.branch=?
-- -- ORDER BY
-- -- STATUS,
-- -- Submitted_date
-- -- DESC
