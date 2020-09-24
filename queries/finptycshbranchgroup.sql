SELECT branch,CASE
 WHEN pet.status=2 THEN 'Pending'
WHEN pet.status=4 THEN 'Approved'
WHEN pet.status=1 THEN 'Need SCH Approval'
WHEN pet.status=3 THEN 'Cancelled by SCH'
WHEN pet.status=5 THEN 'Cancelled'
 END AS 'status',pet.status AS status1,category_id,PCC.category_name,SUM(pet.debit) AS 'totalamount'
,DATE(created_date) as 'created_date'
,bill_submission
 FROM pettycash AS pet
INNER JOIN pettycash_category AS PCC ON PCC.sno=pet.category_id
WHERE
 DATE(pet.created_date) BETWEEN CONCAT(YEAR(?),'-',MONTH(?),'-','01')
AND  CONCAT(YEAR(?),'-',MONTH(?),'-','31')

 AND pet.branch=?
GROUP BY branch,category_id
