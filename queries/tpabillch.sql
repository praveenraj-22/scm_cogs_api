SELECT
rd.TRANSACTION_DATE AS 'BILLEDDATE',rd.BILLED,rd.AGENCY_NAME,rd.UNIT,rd.GROUP,rd.MRN,
rd.PATIENT_NAME,rd.BILLNO
,ROUND(SUM(TOTAL_AMOUNT),2) AS 'totalamount',ROUND(SUM(DISCOUNT_AMOUNT),2) AS 'discount',ROUND(SUM(NET_AMOUNT),2) AS 'netamount'
,ROUND(SUM(PATIENT_AMOUNT),2) AS 'patamount',ROUND(SUM(PAYOR_AMOUNT),2) AS 'tpaamount',DATE(rd.send_date) AS 'senddate'
,tpa_claim,rd.*
FROM revenue_detail_tpa AS rd
 WHERE BILLED=? AND TRANSACTION_DATE BETWEEN ? AND ?
AND AGENCY_NAME NOT LIKE 'SELF PAYING'
GROUP BY
rd.MRN,
rd.BILLNO
ORDER BY
senddate ASC,
TRANSACTION_DATE DESC
