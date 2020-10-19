SELECT br.entity,br.region,rd.TRANSACTION_DATE AS 'BILLEDDATE',rd.BILLED,rd.NATIVE,rd.AGENCY_NAME,rd.UNIT,rd.GROUP,rd.MRN,
rd.PATIENT_NAME,rd.VISIT_TYPE,rd.BILLNO
,SUM(TOTAL_AMOUNT) AS 'totalamount',SUM(DISCOUNT_AMOUNT) AS 'discount',SUM(NET_AMOUNT) AS 'netamount'
,SUM(PATIENT_AMOUNT) AS 'patamount',SUM(PAYOR_AMOUNT) AS 'tpaamount',DATE(rdt.send_date) AS 'senddate',
 DATE(rdt.acknowledge_date) AS 'ackdate',DATE(rdt.submitted_date) AS 'subdate',
rdt.*
 FROM revenue_details AS rd
INNER JOIN revenue_detail_tpa AS rdt ON rdt.bill_id=rd.EXTERNAL_ID
 INNER JOIN branches AS br ON rd.BILLED=br.code
 WHERE TRANSACTION_DATE BETWEEN ? AND ?
 and BILLED=? AND br.entity <>'ohc'
AND AGENCY_NAME NOT LIKE 'SELF PAYING'
GROUP BY
rd.MRN,
rd.BILLNO
ORDER BY
senddate DESC,
TRANSACTION_DATE DESC,
ackdate DESC,
SUBDATE DESC,
br.code ASC
