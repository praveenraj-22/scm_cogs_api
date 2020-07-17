SELECT * FROM
(
SELECT    CASE
           WHEN dbil.`Approval_status`=0 THEN 'Submitted'
           WHEN dbil.`Approval_status`=1 THEN 'SCH Approved'
           WHEN dbil.`Approval_status`=2 THEN 'Finance Approved'
           WHEN dbil.`Approval_status`=3 THEN 'Sch Cancelled'
           WHEN dbil.`Approval_status`=4 THEN 'Cancelled by Finance'
           ELSE ''
       END AS 'status',
       CASE
       WHEN rdt.BILLNO LIKE '%op%' THEN 'OP'
       WHEN rdt.BILLNO LIKE '%ip%' THEN 'IP'
       END AS 'Type',
       SUM(rdt.TOTAL_AMOUNT)AS Bill_TOTAL_AMOUNT,
       SUM(rdt.DISCOUNT_AMOUNT) AS Bill_DISCOUNT_AMOUNT,
       SUM(rdt.NET_AMOUNT) AS Bill_NET_AMOUNT,
       SUM(rdt.PATIENT_AMOUNT) AS Bill_PATIENT_AMOUNT,
       SUM(rdt.PAYOR_AMOUNT) AS Bill_PAYOR_AMOUNT,
       rdt.*
FROM revenue_details AS rdt
LEFT JOIN `drt_bills` AS dbil ON dbil.Bill_id=rdt.EXTERNAL_ID
WHERE BILLED IN (?)

  AND DATE(TRANSACTION_DATE) BETWEEN ? AND ? AND   REFERRAL_TYPE=?
GROUP BY BILLNO,
         TRANSACTION_DATE
)AS A
  WHERE A.TYPE=?
 ORDER BY BILLED,TRANSACTION_DATE
