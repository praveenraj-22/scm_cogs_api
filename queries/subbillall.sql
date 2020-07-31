
SELECT * FROM (SELECT * FROM (SELECT
       CASE
          WHEN Approval_status=0 THEN 'Pending'
           WHEN Approval_status=1 THEN 'Approved By Sch'
           WHEN Approval_status=2 THEN 'Approved'
           WHEN Approval_status=3 THEN 'Cancelled by Sch'
           WHEN Approval_status=4 THEN 'Cancelled by Finance'
       END AS drtApproval_status,bill.Comments AS billcomments,drcus.NAME AS 'DRTNAME',bill.*
       ,usr.name AS 'CH_Name',usr.branches AS 'CH_branch',schusr.name AS 'SCH_Name',schusr.branches AS 'SCH_Branch'
FROM drt_bills AS bill
INNER JOIN `drt_customer` AS drcus ON bill.Drt_id=drcus.ID
INNER JOIN `users` AS usr ON usr.emp_id=bill.Created_by AND usr.role='ch_user'
LEFT JOIN `users` AS schusr ON schusr.emp_id=bill.Sch_Approved_by AND schusr.role='sch_user'
WHERE DATE_FORMAT(bill_date,'%Y-%m')=? AND bill.Approval_status=0
  AND Billed_branch IN ( ? )
ORDER BY Created_on DESC) AS a ORDER BY Billed_branch ASC )AS a1
UNION

SELECT * FROM (SELECT * FROM (SELECT
       CASE
           WHEN Approval_status=0 THEN 'Pending'
           WHEN Approval_status=1 THEN 'Approved By Sch'
           WHEN Approval_status=2 THEN 'Approved'
           WHEN Approval_status=3 THEN 'Cancelled by Sch'
           WHEN Approval_status=4 THEN 'Cancelled by Finance'
       END AS drtApproval_status,bill.Comments AS billcomments,drcus.NAME AS 'DRTNAME',bill.*
    ,usr.name AS 'CH_Name',usr.branches AS 'CH_branch',schusr.name AS 'SCH_Name',schusr.branches AS 'SCH_Branch'
FROM drt_bills AS bill
INNER JOIN `drt_customer` AS drcus ON bill.Drt_id=drcus.ID
INNER JOIN `users` AS usr ON usr.emp_id=bill.Created_by AND usr.role='ch_user'
LEFT JOIN `users` AS schusr ON schusr.emp_id=bill.Sch_Approved_by AND schusr.role='sch_user'
WHERE DATE_FORMAT(bill_date,'%Y-%m')=?  AND bill.Approval_status=1
  AND Billed_branch IN ( ? )
ORDER BY Approved_time DESC) AS b ORDER BY Billed_branch ASC )AS b1

UNION
SELECT * FROM (SELECT * FROM (SELECT
       CASE
          WHEN Approval_status=0 THEN 'Pending'
           WHEN Approval_status=1 THEN 'Approved By Sch'
           WHEN Approval_status=2 THEN 'Approved'
           WHEN Approval_status=3 THEN 'Cancelled by Sch'
           WHEN Approval_status=4 THEN 'Cancelled by Finance'
       END AS drtApproval_status,bill.Comments AS billcomments,drcus.NAME AS 'DRTNAME',bill.*
    ,usr.name AS 'CH_Name',usr.branches AS 'CH_branch',schusr.name AS 'SCH_Name',schusr.branches AS 'SCH_Branch'
FROM drt_bills AS bill
INNER JOIN `drt_customer` AS drcus ON bill.Drt_id=drcus.ID
INNER JOIN `users` AS usr ON usr.emp_id=bill.Created_by AND usr.role='ch_user'
LEFT JOIN `users` AS schusr ON schusr.emp_id=bill.Sch_Approved_by AND schusr.role='sch_user'
WHERE DATE_FORMAT(bill_date,'%Y-%m')=? AND bill.Approval_status=2
  AND Billed_branch IN (? )
ORDER BY Admin_Approved_time DESC) AS c ORDER BY Billed_branch ASC )AS c1
UNION

SELECT * FROM (SELECT * FROM (SELECT
       CASE
           WHEN Approval_status=0 THEN 'Pending'
           WHEN Approval_status=1 THEN 'Approved By Sch'
           WHEN Approval_status=2 THEN 'Approved'
           WHEN Approval_status=3 THEN 'Cancelled by Sch'
           WHEN Approval_status=4 THEN 'Cancelled by Finance'
       END AS drtApproval_status,bill.Comments AS billcomments,drcus.NAME AS 'DRTNAME',bill.*
      ,usr.name AS 'CH_Name',usr.branches AS 'CH_branch',schusr.name AS 'SCH_Name',schusr.branches AS 'SCH_Branch'
FROM drt_bills AS bill
INNER JOIN `drt_customer` AS drcus ON bill.Drt_id=drcus.ID
INNER JOIN `users` AS usr ON usr.emp_id=bill.Created_by AND usr.role='ch_user'
LEFT JOIN `users` AS schusr ON schusr.emp_id=bill.Sch_Approved_by AND schusr.role='sch_user'
WHERE DATE_FORMAT(bill_date,'%Y-%m')=? AND bill.Approval_status=3
  AND Billed_branch IN (?)
ORDER BY Cancelled_time DESC) AS d ORDER BY Billed_branch ASC )AS d1
UNION
SELECT * FROM (SELECT * FROM (SELECT
       CASE
         WHEN Approval_status=0 THEN 'Pending'
           WHEN Approval_status=1 THEN 'Approved By Sch'
           WHEN Approval_status=2 THEN 'Approved'
           WHEN Approval_status=3 THEN 'Cancelled by Sch'
           WHEN Approval_status=4 THEN 'Cancelled by Finance'
       END AS drtApproval_status,bill.Comments AS billcomments,drcus.NAME AS 'DRTNAME',bill.*
      ,usr.name AS 'CH_Name',usr.branches AS 'CH_branch',schusr.name AS 'SCH_Name',schusr.branches AS 'SCH_Branch'
FROM drt_bills AS bill
INNER JOIN `drt_customer` AS drcus ON bill.Drt_id=drcus.ID
INNER JOIN `users` AS usr ON usr.emp_id=bill.Created_by AND usr.role='ch_user'
LEFT JOIN `users` AS schusr ON schusr.emp_id=bill.Sch_Approved_by AND schusr.role='sch_user'
WHERE DATE_FORMAT(bill_date,'%Y-%m')=? AND bill.Approval_status=4
  AND Billed_branch IN (?)
ORDER BY Cancelled_time DESC) AS e ORDER BY Billed_branch ASC )AS e1
