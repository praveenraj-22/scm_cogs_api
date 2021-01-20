SELECT br.entity,br.region,rd.TRANSACTION_DATE AS 'BILLEDDATE',rd.BILLED,rd.AGENCY_NAME,rd.UNIT,rd.GROUP,rd.MRN,
rd.PATIENT_NAME,rd.BILLNO AS bill_no
,SUM(TOTAL_AMOUNT) AS 'totalamount',SUM(DISCOUNT_AMOUNT) AS 'discount',SUM(NET_AMOUNT) AS 'netamount'
,SUM(PATIENT_AMOUNT) AS 'patamount',SUM(PAYOR_AMOUNT) AS 'tpaamount',DATE(rd.send_date) AS 'senddate',
 DATE(rd.acknowledge_date) AS 'ackdate',DATE(rd.submitted_date) AS 'subdate',rd.TPA_CLAIM as tpa_claim,

rd.*
FROM  revenue_detail_tpa  AS rd
 INNER JOIN branches AS br ON rd.BILLED=br.code
 WHERE TRANSACTION_DATE BETWEEN ? AND ?
 and DATE(rd.send_date) BETWEEN ? AND ?
 AND DATE(rd.acknowledge_date) IS NULL AND DATE(submitted_date) IS NULL
  AND br.entity <>'ohc'
AND br.entity=? and BILLED=?

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
