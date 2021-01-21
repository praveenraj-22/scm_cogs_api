SELECT br.entity,br.region,rd.TRANSACTION_DATE AS 'BILLEDDATE',rd.BILLED,rd.AGENCY_NAME,rd.UNIT,rd.GROUP,rd.MRN,
rd.PATIENT_NAME,rd.BILLNO AS bill_no
,SUM(TOTAL_AMOUNT) AS 'totalamount',SUM(DISCOUNT_AMOUNT) AS 'discount',SUM(NET_AMOUNT) AS 'netamount'
,SUM(PATIENT_AMOUNT) AS 'patamount',SUM(PAYOR_AMOUNT) AS 'tpaamount',DATE(rd.send_date) AS 'senddate',
 DATE(rd.acknowledge_date) AS 'ackdate',DATE(rd.submitted_date) AS 'subdate',rd.TPA_CLAIM as tpa_claim,

rd.*
FROM  revenue_detail_tpa  AS rd
 INNER JOIN branches AS br ON rd.BILLED=br.code
 WHERE
 TRANSACTION_DATE BETWEEN ? AND ?
 AND (rd.send_date <> NULL OR rd.send_date !='')
 AND (rd.acknowledge_date IS NULL OR rd.acknowledge_date ='')
AND (rd.submitted_date IS NULL OR rd.submitted_date ='')
 AND rd.BILLED IN (?)
 AND DATE(rd.acknowledge_date) IS NULL AND DATE(submitted_date) IS NULL
 AND br.entity <>'ohc'
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

-- SELECT br.entity,br.region,rd.TRANSACTION_DATE AS 'BILLEDDATE',rd.BILLED,rd.NATIVE,rd.AGENCY_NAME,rd.UNIT,rd.GROUP,rd.MRN,
-- rd.PATIENT_NAME,rd.VISIT_TYPE,rd.BILLNO
-- ,SUM(TOTAL_AMOUNT) AS 'totalamount',SUM(DISCOUNT_AMOUNT) AS 'discount',SUM(NET_AMOUNT) AS 'netamount'
-- ,SUM(PATIENT_AMOUNT) AS 'patamount',SUM(PAYOR_AMOUNT) AS 'tpaamount',DATE(rdt.send_date) AS 'senddate',
--  DATE(rdt.acknowledge_date) AS 'ackdate',DATE(rdt.submitted_date) AS 'subdate',
-- rdt.*
--  FROM revenue_details AS rd
-- INNER JOIN revenue_detail_tpa AS rdt ON rdt.bill_id=rd.EXTERNAL_ID
--  INNER JOIN branches AS br ON rd.BILLED=br.code
--  WHERE DATE(send_date) BETWEEN ? AND ?
--  AND TRANSACTION_DATE BETWEEN ? AND ?
--  and rd.BILLED in (?)
--  AND DATE(rdt.acknowledge_date) IS NULL AND DATE(submitted_date) IS NULL
--  AND br.entity <>'ohc'
-- AND AGENCY_NAME NOT LIKE 'SELF PAYING'
-- GROUP BY
-- rd.MRN,
-- rd.BILLNO
-- ORDER BY
-- senddate DESC,
-- TRANSACTION_DATE DESC,
-- ackdate DESC,
-- SUBDATE DESC,
-- br.code ASC
