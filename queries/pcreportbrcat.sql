SET @PK1 ='',@CK1 ='',@RN1 =0,@CK=0,@CL='',@CRE =0;

select * from (
SELECT
STATUS,
sno,
entity,
branch,
CODE,
category_name,
ledger_head,
voucher_no,
vendorname,
bill_no,
bill_date,
remarks,
 @CK := IF(@PK1=branch,@CK+1,0) AS cktmp,
 @PK1 := branch AS branctmp,
@CRE := IF(@CK=0,0,credit) AS credit,

debit,
refilled_date,
ch_id,
created_date,
sch_id,
sch_approved_date,
fin_id,
fin_approved_date,
bill_submission,
cancel_by,
cancel_date,
  CONCAT(entity,branch,CODE,category_name,voucher_no,vendorname,bill_no,bill_date,credit,debit) AS vendormatch,
 @RN1 := IF(@CK1=branch,@CL,credit) AS OPENING,
 @CK1 := branch AS branctmp1,
 @CL := IF(@CK=0,@RN1-debit,@RN1+credit-debit) AS CLOSING
,category_id
 FROM (
  SELECT CASE
WHEN pc.status=1 THEN 'Need sch approval'
WHEN pc.status=2 THEN 'Sch Approved'
WHEN pc.status=3 THEN 'Sch cancelled'
WHEN pc.status=4 THEN 'Finance approved'
WHEN pc.status=5 THEN 'Finance cancelled'
WHEN pc.status=6 THEN 'Amount refilled'
WHEN pc.status=0 THEN 'Bill raised'
WHEN pc.status IS NULL THEN 'Opening balance'
END AS 'status',pc.sno,br.entity ,IF(br.code IS NULL,0,br.code) AS branch ,pcc.code,pcc.category_name,pcc.ledger_head,pc.voucher_no,pc.vendorname
,pc.bill_no,pc.bill_date,pc.remarks ,IF(pc.credit IS NULL,0,pc.credit) AS credit,IF(pc.debit IS NULL,0,pc.debit) AS debit
,DATE(pc.refilled_date) AS refilled_date,pc.ch_id,
DATE(pc.created_date) AS created_date,pc.sch_id,DATE(pc.sch_approved_date) AS sch_approved_date,
pc.fin_id,DATE(pc.fin_approved_date) AS fin_approved_date,pc.bill_submission,pc.cancel_by,pc.cancel_date,pc.category_id
FROM pettycash AS pc
INNER JOIN pettycash_allocate_amount AS paa ON paa.branch=pc.branch
LEFT JOIN pettycash_category AS pcc ON pcc.sno=pc.category_id
INNER JOIN branches AS br ON br.code=pc.branch
ORDER BY
br.code)
 AS a
) as b where DATE(created_date) BETWEEN ? AND ?
AND branch=? AND category_id=?
