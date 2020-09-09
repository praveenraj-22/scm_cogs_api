SELECT branch,CASE
 WHEN pet.status=2 THEN 'Pending'
WHEN pet.status=4 THEN 'Approved'
WHEN pet.status=1 THEN 'Need SCH Approval'
WHEN pet.status=3 THEN 'Cancelled by SCH'
WHEN pet.status=5 THEN 'Cancelled'
 END AS 'status',pet.status AS status1,category_id,PCC.category_name,SUM(pet.debit) AS 'totalamount' FROM pettycash AS pet
INNER JOIN pettycash_category AS PCC ON PCC.sno=pet.category_id
WHERE pet.STATUS=?
 AND DATE(created_date) BETWEEN ? AND ?
 AND pet.branch=?
GROUP BY branch,category_id
