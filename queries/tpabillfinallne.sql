SELECT br.entity,br.region,rdt.TRANSACTION_DATE AS 'BILLEDDATE',rdt.BILLED,rdt.AGENCY_NAME,rdt.UNIT,rdt.GROUP,rdt.MRN,
rdt.PATIENT_NAME,rdt.BILLNO
,SUM(TOTAL_AMOUNT) AS 'totalamount',SUM(DISCOUNT_AMOUNT) AS 'discount',SUM(NET_AMOUNT) AS 'netamount'
,SUM(PATIENT_AMOUNT) AS 'patamount',SUM(PAYOR_AMOUNT) AS 'tpaamount',DATE(rdt.send_date) AS 'senddate',
 DATE(rdt.acknowledge_date) AS 'ackdate',DATE(rdt.submitted_date) AS 'subdate',
rdt.*

FROM  revenue_detail_tpa AS rdt
 INNER JOIN branches AS br ON rdt.BILLED=br.code
 WHERE TRANSACTION_DATE  BETWEEN ? AND ? AND rdt.BILLED IN (?)

  AND br.entity <>'ohc'
AND AGENCY_NAME NOT LIKE 'SELF PAYING'
GROUP BY
rdt.MRN,
rdt.BILLNO
ORDER BY
senddate DESC,
TRANSACTION_DATE DESC,
ackdate DESC,
SUBDATE DESC,
br.code ASC
