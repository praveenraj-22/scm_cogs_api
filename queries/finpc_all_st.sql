SELECT * FROM (SELECT b.branch,
            b.STATUS,
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
                    CASE WHEN STATUS =1  THEN 'Need SCH Approval'
                    WHEN STATUS =2 THEN 'Pending'
                    WHEN STATUS =3 THEN 'Cancelled by SCH'
                    WHEN STATUS =4  THEN 'Approved'
                    WHEN STATUS =5 THEN 'Cancelled'

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

     ORDER BY b.STATUS DESC, Submitted_date DESC) AS c WHERE c.status1=?


-- SELECT b.branch,b.STATUS,paa.credit,b.totalamount,paa.balance,
-- IF((status1=3)||(status1=5),totalamount,'') AS 'Cancelled_amount',
--  b.Submitted_date,b.created_by,status1  FROM (
-- SELECT branch,totalamount,Submitted_date,created_by,status1,
-- CASE
--  WHEN status1=2 THEN 'Pending'
-- WHEN status1=4 THEN 'Approved'
-- WHEN status1=1 THEN 'Need SCH Approval'
-- WHEN status1=3 THEN 'Cancelled by SCH'
-- WHEN status1=5 THEN 'Cancelled' END AS 'STATUS'
--  FROM (
--
-- SELECT PC.branch,status1,SUM(Debit)AS'totalamount',DATE(PC.created_date) AS 'Submitted_date',
-- DATE(PC.Bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- INNER JOIN
-- (
-- SELECT branch,STATUS AS 'status1' FROM pettycash
-- WHERE STATUS =?  AND  DATE(created_date) BETWEEN ? AND ?
-- GROUP BY branch
-- HAVING COUNT(*) >=1
-- )AS A ON PC.branch = A.branch
-- WHERE  DATE(created_date) BETWEEN ? AND ? AND PC.status=?
-- GROUP BY PC.branch
-- ) AS a
--
-- )AS b
-- INNER JOIN `pettycash_allocate_amount` AS paa ON b.branch=paa.branch
-- ORDER BY
-- b.STATUS
-- ,Submitted_date
-- DESC
--
--
--
-- -- SELECT * FROM (
-- -- SELECT branch,totalamount,Submitted_date,created_by,status1,
-- -- CASE
-- --  WHEN status1=2 THEN 'Pending'
-- -- WHEN status1=4 THEN 'Approved'
-- -- WHEN status1=1 THEN 'Need SCH Approval'
-- -- WHEN status1=3 THEN 'Cancelled by SCH'
-- -- WHEN status1=5 THEN 'Cancelled' END AS 'STATUS'
-- --  FROM (
-- --
-- -- SELECT PC.branch,status1,SUM(Debit)AS'totalamount',DATE(PC.created_date) AS 'Submitted_date',
-- -- DATE(PC.Actual_bill_date) AS 'Bill_date',PC.ch_id AS 'created_by' FROM pettycash PC
-- -- INNER JOIN
-- -- (
-- -- SELECT branch,STATUS AS 'status1' FROM pettycash
-- -- WHERE STATUS =?  AND  DATE(created_date) BETWEEN ? AND ?
-- -- GROUP BY branch
-- -- HAVING COUNT(*) >=1
-- -- )AS A ON PC.branch = A.branch
-- -- WHERE  DATE(created_date) BETWEEN ? AND ? AND PC.status=?
-- -- GROUP BY PC.branch
-- -- ) AS a
-- --
-- -- )AS b
-- -- INNER JOIN `pettycash_allocate_amount` AS paa ON b.branch=paa.branch
-- -- ORDER BY
-- -- STATUS
-- -- ,Submitted_date
-- -- DESC
