SELECT * FROM (SELECT * FROM (SELECT   CASE
           WHEN Approval_status=0 THEN 'Need SCH Approval'
           WHEN Approval_status=1 THEN 'Pending'
           WHEN Approval_status=2 THEN 'Approved'
           WHEN Approval_status=3 THEN 'Cancelled By sch'
           WHEN Approval_status=4 THEN 'Cancelled'
      END AS drtApproval_status,bill.Comments AS billcomments,drcus.NAME AS 'DRTNAME',DATE(bill.Created_on) AS 'Drt_Created_on',DATE(bill.Approved_time) AS 'Drt_Approved_time',DATE(bill.Admin_Approved_time) AS 'Drt_Admin_Approved_time',DATE(bill.Cancelled_time) AS 'Drt_Cancelled_time',bill.*
 ,usr.name AS 'CH_Name',usr.branches AS 'CH_branch',schusr.name AS 'SCH_Name',schusr.branches AS 'SCH_Branch'
 ,drcus.Infavour_of,drcus.Payment_type,drcus.Pan_no,drcus.Account_no,drcus.Bank_ifsc,drcus.Bank_name
       FROM drt_bills AS bill
INNER JOIN `drt_customer` AS drcus ON bill.Drt_id=drcus.ID
INNER JOIN `users` AS usr ON usr.emp_id=bill.Created_by AND usr.role='ch_user'
LEFT JOIN `users` AS schusr ON schusr.emp_id=bill.Sch_Approved_by AND schusr.role='sch_user'
WHERE Expense_date= ? AND Approval_status=?  ORDER BY Approved_time DESC) AS a ORDER BY Billed_branch ASC )AS a1
