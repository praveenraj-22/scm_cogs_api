SELECT branch,CASE
when pet.status=0 then 'Bill_raised'
 WHEN pet.status=1 THEN 'Pending'
WHEN pet.status=2 THEN 'Approved'
WHEN pet.status=3 THEN 'Cancelled'
WHEN pet.status=4 THEN 'Approved by Finance'
WHEN pet.status=5 THEN 'Cancelled by Finance'
 END AS 'status',pet.status AS status1,category_id,PCC.category_name,
 SUM(pet.debit) AS 'totalamount',DATE(created_date) as 'created_date'
 ,bill_submission
 FROM pettycash AS pet
INNER JOIN pettycash_category AS PCC ON PCC.sno=pet.category_id
WHERE   pet.branch=?  AND DATE(pet.created_date) BETWEEN CONCAT(YEAR(?),'-',MONTH(?),'-','01')
AND  CONCAT(YEAR(?),'-',MONTH(?),'-','31')  AND pet.status IN (?)
GROUP BY branch,category_id,status1


-- SELECT branch,CASE WHEN pet.status=1 THEN 'Pending'
-- WHEN pet.status=2 THEN 'Approved'
-- WHEN pet.status=3 THEN 'Cancelled'
-- WHEN pet.status=4 THEN 'Approved by Finance'
-- WHEN pet.status=5 THEN 'Cancelled by Finance'
--  END AS 'status',pet.status AS status1,category_id,PCC.category_name,SUM(pet.debit) AS 'totalamount' FROM pettycash AS pet
-- INNER JOIN pettycash_category AS PCC ON PCC.sno=pet.category_id
-- WHERE   pet.branch=? and
-- GROUP BY branch,category_id

-- SELECT branch,CASE WHEN pet.status=1 THEN 'Pending'
-- WHEN pet.status=2 THEN 'Approved'
-- WHEN pet.status=3 THEN 'Cancelled'
-- WHEN pet.status=4 THEN 'Approved by Finance'
-- WHEN pet.status=5 THEN 'Cancelled by Finance'
--  END AS 'status',pet.status AS status1,category_id,PCC.category_name,SUM(pet.debit) AS 'totalamount' FROM pettycash AS pet
-- INNER JOIN pettycash_category AS PCC ON PCC.sno=pet.category_id
-- WHERE pet.STATUS =?
--  AND DATE(created_date) BETWEEN ? AND ? AND pet.branch=?
-- GROUP BY branch,category_id





-- SELECT branch,'Pending' AS 'status',category_id,PCC.category_name,SUM(pet.debit) AS 'totalamount' FROM pettycash AS pet
-- INNER JOIN pettycash_category AS PCC ON PCC.sno=pet.category_id
-- WHERE pet.STATUS =1 AND DATE(created_date) BETWEEN ? AND ? AND pet.branch=?
-- GROUP BY branch,category_id
-- HAVING COUNT(*) >=1
-- UNION ALL
-- SELECT branch,'Approved' AS 'status',category_id,PCC.category_name,SUM(pet.debit) AS 'totalamount'  FROM pettycash AS pet
-- INNER JOIN pettycash_category AS PCC ON PCC.sno=pet.category_id
-- WHERE pet.STATUS =2 AND DATE(created_date) BETWEEN ? AND ? AND pet.branch=?
-- GROUP BY branch,category_id
-- HAVING COUNT(*) >=1
-- UNION ALL
-- SELECT branch,'Cancelled' AS 'status',category_id,PCC.category_name,SUM(pet.debit) AS 'totalamount'  FROM pettycash AS pet
-- INNER JOIN pettycash_category AS PCC ON PCC.sno=pet.category_id
-- WHERE pet.STATUS =3 AND DATE(created_date) BETWEEN ? AND ? AND pet.branch=?
-- GROUP BY branch,category_id
-- HAVING COUNT(*) >=1
