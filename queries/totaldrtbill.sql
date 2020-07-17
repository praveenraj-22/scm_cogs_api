SELECT CASE
           WHEN dbil.`Approval_status`=0 THEN 'Pending'
           WHEN dbil.`Approval_status`=1 THEN 'SCH Approved'
           WHEN dbil.`Approval_status`=2 THEN 'Finance Approved'
           WHEN dbil.`Approval_status`=3 THEN 'SCH Cancelled'
           WHEN dbil.`Approval_status`=4 THEN 'Finance Cancelled'
           ELSE '0'
       END AS 'status',dbil.*,rvd.*,cus.Pan_no,cus.Name AS drt_cusname,DATE(dbil.Created_on) AS 'Drt_Created_on',
       DATE(dbil.Approved_time) AS 'Drt_Approved_time',DATE(dbil.Admin_Approved_time) AS 'Drt_Admin_Approved_time',
       DATE(dbil.Cancelled_time) AS 'Drt_Cancelled_time'
        FROM `drt_bills` AS dbil
INNER JOIN `revenue_details` AS rvd ON rvd.`EXTERNAL_ID`=dbil.`Bill_id`
INNER JOIN `drt_customer` AS cus ON cus.ID=dbil.Drt_id
WHERE DATE(dbil.Created_on) BETWEEN ? AND ?
ORDER BY
dbil.Billed_branch,dbil.Created_on
