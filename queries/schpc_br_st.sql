SELECT * FROM (SELECT b.branch,
            b.status,
            paa.credit,
            b.totalamount,
            paa.balance,
            IF(Cancelled_amount IS NULL,0,Cancelled_amount) AS 'Cancelled_amount',
            Submitted_date,
            created_by,
            status1
     FROM
       (SELECT PC.branch,
                        A.status AS 'status',
                        status1,
                        SUM(Debit)AS'totalamount',
                        COUNT(A.status) AS '2',
                        DATE(PC.created_date) AS 'Submitted_date',
                        DATE(PC.Bill_date) AS 'Bill_date',
                        PC.ch_id AS 'created_by'
           FROM pettycash PC
           INNER JOIN
             (SELECT branch,
                    CASE WHEN STATUS =1  THEN 'Pending'
                    WHEN STATUS =2 THEN 'Approved'
                    WHEN STATUS =3 THEN 'Cancelled'
                    WHEN STATUS =4  THEN 'Approved By Finance'
                    WHEN STATUS =5 THEN 'Cancelled By Finance'

                    END  AS STATUS,
                    STATUS AS 'status1'

              FROM pettycash
              WHERE
                 DATE(created_date) BETWEEN ? AND ?
              GROUP BY branch,STATUS
              HAVING COUNT(*) >=1)AS A ON PC.branch = A.branch
              AND PC.status = A.status1
           WHERE DATE(created_date) BETWEEN ? AND ?
           GROUP BY PC.branch,STATUS)

           AS b
           INNER JOIN `pettycash_allocate_amount` AS paa ON b.branch=paa.branch
           LEFT JOIN
           (SELECT branch,
                   SUM(credit) AS 'Cancelled_amount'
  FROM pettycash
  WHERE STATUS IN (3,5)
  group by
  branch
) AS cancelled
  ON cancelled.branch = b.branch

     ORDER BY b.STATUS DESC, Submitted_date DESC)AS c WHERE c.branch IN (?) AND c.status1=?



-- SELECT * FROM (SELECT a.branch,CASE WHEN a.STATUS=1 THEN 'Pending'
-- WHEN a.STATUS=2 THEN 'Approved'
-- WHEN a.STATUS=3 THEN 'Cancelled'
-- WHEN a.STATUS=4 THEN 'Approved By Finance'
-- WHEN a.STATUS=5 THEN 'Cancelled by Finance'
-- END AS 'status'
-- ,paa.credit,totalamount,paa.balance,IF((status1=3)||(status1=5),totalamount,'') AS 'Cancelled_amount',Bill_date,created_by,Submitted_date,status1 FROM (
--
-- SELECT PC.branch, A.status AS 'status',A.STATUS AS 'status1',SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- INNER JOIN
-- (
-- SELECT branch, STATUS FROM pettycash
-- WHERE STATUS =? AND branch IN (?) AND DATE(created_date) BETWEEN ? AND ?
-- GROUP BY branch
-- HAVING COUNT(*) >=1
-- )AS A ON PC.branch = A.branch
-- WHERE PC.branch IN (?) AND DATE(created_date) BETWEEN ? AND ? AND PC.status=?
-- GROUP BY PC.branch) AS a
-- INNER JOIN `pettycash_allocate_amount` AS paa ON a.branch=paa.branch
-- ORDER BY
-- Submitted_date DESC
-- )AS b
-- ORDER BY
-- STATUS DESC


-- SELECT branch,CASE WHEN STATUS=1 THEN 'Pending'
-- WHEN STATUS=2 THEN 'Approved'
-- WHEN STATUS=3 THEN 'Cancelled'
-- WHEN STATUS=4 THEN 'Approved By Finance'
-- WHEN STATUS=5 THEN 'Cancelled by Finance'
-- END AS 'status'
-- ,totalamount,Bill_date,created_by,Submitted_date,status1 FROM (
--
-- SELECT PC.branch, A.status AS 'status',A.STATUS AS 'status1',SUM(Debit)AS'totalamount',COUNT(A.status) AS '2',DATE(PC.created_date) AS 'Submitted_date',
-- DATE(PC.created_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- INNER JOIN
-- (
-- SELECT branch, STATUS FROM pettycash
-- WHERE STATUS =? AND branch IN (?) AND DATE(created_date) BETWEEN ? AND ?
-- GROUP BY branch
-- HAVING COUNT(*) >=1
-- )AS A ON PC.branch = A.branch
-- WHERE PC.branch IN (?) AND DATE(created_date) BETWEEN ? AND ? AND PC.status=?
-- GROUP BY PC.branch) AS a




-- -- SELECT * FROM  (
-- -- SELECT PC.branch, IFNULL(A.status,'Approved')AS 'status',MIN(PC.status) AS 'status1' AS 'status1',SUM(Debit)AS'totalamount',
-- -- DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- LEFT JOIN (
-- -- SELECT branch,'Pending'  AS STATUS FROM pettycash
-- -- WHERE STATUS =1
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )
-- -- AS A
-- -- ON PC.branch = A.branch
-- -- WHERE PC.branch IN (?) AND DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY PC.branch)
-- --  AS b WHERE b.status1=?
--
-- SELECT * FROM  (
-- SELECT PC.branch, IFNULL(A.status,'Approved')AS 'status',MIN(PC.status) AS 'status1',SUM(Debit)AS'totalamount',
-- DATE(PC.created_date) AS 'Submitted_date',
-- DATE(PC.bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- LEFT JOIN (
-- SELECT branch,CASE WHEN STATUS=1 THEN 'Pending'
-- WHEN STATUS=3 THEN 'Cancelled'
-- WHEN STATUS=5 THEN 'Cancelled by finance' END AS STATUS  FROM pettycash
-- WHERE STATUS IN(1,3,5)
--  AND branch IN (?)  AND DATE(created_date) BETWEEN ? AND ?
-- GROUP BY branch
-- HAVING COUNT(*) >=1
-- )
-- AS A
-- ON PC.branch = A.branch
-- WHERE PC.branch IN (?) AND DATE(created_date) BETWEEN ? AND ?
-- GROUP BY PC.branch)
--  AS b WHERE b.status1=?
