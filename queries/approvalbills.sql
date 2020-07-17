SELECT CASE
           WHEN dbil.`Approval_status`=0 THEN 'Submitted'
           WHEN dbil.`Approval_status`=1 THEN 'SCH Approved'
           WHEN dbil.`Approval_status`=2 THEN 'Finance Approved'
           ELSE '0'
       END AS 'status',
       rdt.entity,
       rdt.TRANSACTION_DATE,
       rdt.BILLED,
       rdt.NATIVE,
       rdt.PAYORTYPE,
       rdt.PAYER_NAME,
       rdt.AGENCY_NAME,
       rdt.UNIT,
       rdt.GROUP,
       rdt.SUBGROUP,
       rdt.MRN,
       rdt.PATIENT_NAME,
       rdt.REFERRAL_TYPE,
       rdt.REFERRAL_BY,
       rdt.REFERRAL_VALUE,
       rdt.PATIENT_AGE,
       rdt.REGISTERED_DATE,
       rdt.VISIT_TYPE,
       rdt.BILLNO,
       rdt.ITEMNAME,
       rdt.EXTERNAL_ID,
       rdt.QUANTITY,
(SELECT ROUND(SUM(TOTAL_AMOUNT),2) FROM `revenue_details` WHERE EXTERNAL_ID=?) AS BILL_TOTAL_AMOUNT,
(SELECT ROUND(SUM(DISCOUNT_AMOUNT),2) FROM `revenue_details` WHERE EXTERNAL_ID=?) AS BILL_DISCOUNT_AMOUNT,
(SELECT ROUND(SUM(NET_AMOUNT),2) FROM `revenue_details` WHERE EXTERNAL_ID=?) AS BILL_NET_AMOUNT,
       ROUND(SUM(rdt.TOTAL_AMOUNT), 2)AS TOTAL_AMOUNT,
       ROUND(SUM(rdt.DISCOUNT_AMOUNT), 2) AS DISCOUNT_AMOUNT,
       ROUND(SUM(rdt.NET_AMOUNT), 2) AS NET_AMOUNT,
       ROUND(SUM(rdt.PATIENT_AMOUNT), 2) AS PATIENT_AMOUNT,
       ROUND(SUM(rdt.PAYOR_AMOUNT), 2) AS PAYOR_AMOUNT,
       dtcus.Name AS 'DRT_Name',
       dbil.Drt_id AS 'DRT_Id',
       dbil.Category AS 'DRT_Category',
       dtcus.Pan_no AS 'DRT_Pan',
       dbil.Aggreed_percentage_value,
       dbil.Drt_percentage_value,
       dbil.Net_amount AS 'Drt_net_amount',
       dbil.Drt_amount,
       dbil.Comments,dbil.Created_by,dbil.sch_Approved_by,dbil.Admin_approved_by
FROM revenue_details AS rdt
LEFT JOIN drt_bills AS dbil ON dbil.Bill_id=rdt.EXTERNAL_ID
LEFT JOIN drt_customer AS dtcus ON dtcus.id=dbil.Drt_id
WHERE EXTERNAL_ID= ?
GROUP BY
rdt.id
