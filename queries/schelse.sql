
SELECT * FROM (SELECT * FROM (SELECT
       CASE
           WHEN Approval_status=0 THEN 'Pending'
           WHEN Approval_status=1 THEN 'Approved'
           WHEN Approval_status=2 THEN 'Finance approved'
           WHEN Approval_status=3 THEN 'Cancelled'
           WHEN Approval_status=4 THEN 'Cancelled by Finance'
       END AS drtApproval_status,bill.Comments AS billcomments,drcus.NAME AS 'DRTNAME',bill.*
          ,usr.name AS 'CH_Name',usr.branches as 'CH_branch',schusr.name AS 'SCH_Name',schusr.branches as 'SCH_Branch'
FROM drt_bills AS bill
INNER JOIN `drt_customer` AS drcus ON bill.Drt_id=drcus.ID
INNER JOIN `users` AS usr ON usr.emp_id=bill.Created_by AND usr.role='ch_user'
LEFT JOIN `users` AS schusr ON schusr.emp_id=bill.Sch_Approved_by AND schusr.role='sch_user'
WHERE DATE_FORMAT(bill_date,'%Y-%m')=? AND bill.Approval_status=?
  AND Billed_branch IN ( ? )
ORDER BY Created_on DESC) AS a ORDER BY Billed_branch ASC )AS a1
