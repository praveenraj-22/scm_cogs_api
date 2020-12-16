SELECT CASE
WHEN pc.status IS NULL THEN 'Opening_balance'
WHEN pc.status=0 THEN 'Bill_created'
WHEN pc.status=1 THEN 'Bill_submitted'
WHEN pc.status=2 THEN 'Sch_Approved'
WHEN pc.status=3 THEN 'Sch_cancelled'
WHEN pc.status=4 THEN 'Finance_Approved'
WHEN pc.status=5 THEN 'Finance_Cancelled'
WHEN pc.status=6 THEN 'Amount_refilled'
WHEN pc.status=-1 THEN 'ch_cancelled'
END AS STATUS, br.entity,pc.branch,pcc.code AS ns_code,pcc.category_name ,pcc.ledger_head AS ledger,pc.vendorname,pc.bill_no,pc.bill_date,pc.credit,pc.debit,DATE(pc.created_date) AS created_date
,pc.ch_id,pc.sch_approved_date AS sch_approved_on,pc.sch_id AS sch,pc.fin_approved_date AS finance_approved_on,pc.fin_id AS finance
,pc.cancel_date,pc.cancel_by,pc.bill_submission AS bill_submitted_on
 FROM `pettycash` AS pc
 INNER JOIN `branches` AS br ON br.code=pc.branch
LEFT JOIN `pettycash_category` AS pcc ON pc.category_id=pcc.sno

ORDER BY
br.branch ASC
