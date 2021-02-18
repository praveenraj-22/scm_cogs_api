SELECT * FROM
(
SELECT
1 AS RANK
,  DATE
, entity
, '' AS BILLED
, ROUND(SUM(FTDREVENUE),0) AS REVENUE
, ROUND(SUM(FTDcashamount),0) AS cashamount
, ROUND(SUM(FTDcardamount),0) AS cardamount
, ROUND(SUM(FTDchequeamount),0) AS chequeamount
, ROUND(SUM(FTDddamount),0) AS ddamount
, ROUND(SUM(FTDfund_trns_amt),0) AS fund_trns_amt
, ROUND(SUM(FTDpaym_amt),0) AS paym_amt
, ROUND(SUM(FTDcred_che_amt),0)
, ROUND(SUM(FTDcred_cash_amt),0)
, ROUND(SUM(FTDpaytm_cach_amt),0)
, ROUND(SUM(FTDpaytm_fund_amt),0)
, ROUND(SUM(FTDONLINE_AMOUNT),0) AS ONLINE_AMOUNT
, ROUND((SUM(FTDcashamount)+SUM(FTDcardamount)+SUM(FTDchequeamount)+SUM(FTDddamount)+SUM(FTDfund_trns_amt)+SUM(FTDpaym_amt)+SUM(FTDcred_che_amt)+SUM(FTDcred_cash_amt)+SUM(FTDpaytm_cach_amt)
+SUM(FTDpaytm_fund_amt)+SUM(FTDONLINE_AMOUNT)),0) AS FTDTotal
, ROUND(SUM(MTDREVENUE),0) AS REVENUEMTD
, ROUND(SUM(MTDcashamount),0) AS cashamountMTD
, ROUND(SUM(MTDcardamount),0) AS cardamountMTD
, ROUND(SUM(MTDchequeamount),0) AS chequeamountMTD
, ROUND(SUM(MTDddamount),0) AS ddamountMTD
, ROUND(SUM(MTDfund_trns_amt),0) AS fund_trns_amtMTD
, ROUND(SUM(MTDpaym_amt),0) AS paym_amtMTD
, ROUND(SUM(MTDcred_che_amt),0)
, ROUND(SUM(MTDcred_cash_amt),0)
, ROUND(SUM(MTDpaytm_cach_amt),0)
, ROUND(SUM(MTDpaytm_fund_amt),0)
, ROUND(SUM(MTDONLINE_AMOUNT),0) AS ONLINE_AMOUNTMTD
, ROUND((SUM(MTDcashamount)+SUM(MTDcardamount)+SUM(MTDchequeamount)+SUM(MTDddamount)+SUM(MTDfund_trns_amt)+SUM(MTDpaym_amt)+SUM(MTDcred_che_amt)+SUM(MTDcred_cash_amt)+SUM(MTDpaytm_cach_amt)
+SUM(MTDpaytm_fund_amt)+SUM(MTDONLINE_AMOUNT)),0) AS MTDTotal
FROM
(
-- ftd
SELECT
  TRANSACTION_DATE AS DATE
, entity
, BILLED
, ROUND(SUM(NET_AMOUNT),2) AS FTDREVENUE
, 0 AS FTDcashamount
, 0 AS FTDcardamount
, 0 AS FTDchequeamount
, 0 AS FTDddamount
, 0 AS FTDfund_trns_amt
, 0 AS FTDpaym_amt
, 0 AS FTDcred_che_amt
, 0 AS FTDcred_cash_amt
, 0 AS FTDpaytm_cach_amt
, 0 AS FTDpaytm_fund_amt
, 0 AS FTDONLINE_AMOUNT
, 0 AS MTDPARENT_BRANCH
, 0 AS MTDBRANCH
, 0 AS MTDPAYMENT_OR_REFUND_DATE
, 0 AS MTDREVENUE
, 0 AS MTDcashamount
, 0 AS MTDcardamount
, 0 AS MTDchequeamount
, 0 AS MTDddamount
, 0 AS MTDfund_trns_amt
, 0 AS MTDpaym_amt
, 0 AS MTDcred_che_amt
, 0 AS MTDcred_cash_amt
, 0 AS MTDpaytm_cach_amt
, 0 AS MTDpaytm_fund_amt
, 0 AS MTDONLINE_AMOUNT
FROM
revenue_details REV
WHERE
REV.TRANSACTION_DATE = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  AND ENTITY IN ('AEH','AHC','AHI')
GROUP BY
BILLED

UNION ALL

-- mtd
SELECT
DATE_SUB(CURDATE(), INTERVAL 1 DAY) AS DATE
, entity
, BILLED
, 0 AS FTDREVENUE
, 0 AS FTDcashamount
, 0 AS FTDcardamount
, 0 AS FTDchequeamount
, 0 AS FTDddamount
, 0 AS FTDfund_trns_amt
, 0 AS FTDpaym_amt
, 0 AS FTDcred_che_amt
, 0 AS FTDcred_cash_amt
, 0 AS FTDpaytm_cach_amt
, 0 AS FTDpaytm_fund_amt
, 0 AS FTDONLINE_AMOUNT
, 0 AS MTDPARENT_BRANCH
, 0 AS MTDBRANCH
, 0 AS MTDPAYMENT_OR_REFUND_DATE
, ROUND(SUM(NET_AMOUNT),2) AS MTDREVENUE
, 0 AS MTDcashamount
, 0 AS MTDcardamount
, 0 AS MTDchequeamount
, 0 AS MTDddamount
, 0 AS MTDfund_trns_amt
, 0 AS MTDpaym_amt
, 0 AS MTDcred_che_amt
, 0 AS MTDcred_cash_amt
, 0 AS MTDpaytm_cach_amt
, 0 AS MTDpaytm_fund_amt
, 0 AS MTDONLINE_AMOUNT
FROM
revenue_details REV
WHERE
REV.TRANSACTION_DATE BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  AND ENTITY IN ('AEH','AHC','AHI')
GROUP BY
BILLED

UNION ALL
-- collection ftd
SELECT
PAYMENT_OR_REFUND_DATE AS DATE
, PARENT_BRANCH AS entity
, BRANCH
, 0 AS FTDREVENUE
, (SUM(CASH_AMOUNT)+SUM(REFUND_CASH_AMOUNT)) AS FTDcashamount
, (SUM(CARD_AMOUNT)+SUM(REFUND_CARD_AMOUNT)) AS FTDcardamount
, (SUM(CHEQUE_AMOUNT)+SUM(REFUND_CHEQUE_AMOUNT)) AS FTDchequeamount
, SUM(DD_AMOUNT) AS FTDddamount
, SUM(FUND_TRANSFER_AMOUNT) AS FTDfund_trns_amt
, SUM(PAYTM_AMOUNT) AS FTDpaym_amt
, SUM(CREDIT_CHEQUE_AMOUNT) AS FTDcred_che_amt
, SUM(CREDIT_CASH_AMOUNT) AS FTDcred_cash_amt
, SUM(PAYTM_CASH_AMOUNT) AS FTDpaytm_cach_amt
, SUM(PAYTM_FUND_AMOUNT) AS FTDpaytm_fund_amt
, SUM(ONLINE_AMOUNT) AS  FTDONLINE_AMOUNT
, 0 AS MTDPARENT_BRANCH
, 0 AS MTDBRANCH
, 0 AS MTDPAYMENT_OR_REFUND_DATE
, 0 AS MTDREVENUE
, 0 AS MTDcashamount
, 0 AS MTDcardamount
, 0 AS MTDchequeamount
, 0 AS  MTDddamount
, 0 AS MTDfund_trns_amt
, 0 AS MTDpaym_amt
, 0 AS MTDcred_che_amt
, 0 AS MTDcred_cash_amt
, 0 AS MTDpaytm_cach_amt
, 0 AS MTDpaytm_fund_amt
, 0 AS MTDONLINE_AMOUNT
FROM
collection_detail COL
WHERE
PAYMENT_OR_REFUND_DATE = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  AND PARENT_BRANCH IN ('AEH','AHC','AHI')
GROUP BY
BRANCH

UNION ALL
-- collection mtd
SELECT
DATE_SUB(CURDATE(), INTERVAL 1 DAY) AS DATE
, PARENT_BRANCH AS entity
, BRANCH
, 0 AS FTDREVENUE
, 0 AS FTDcashamount
, 0 AS FTDcardamount
, 0 AS FTDchequeamount
, 0 AS FTDddamount
, 0 AS FTDfund_trns_amt
, 0 AS FTDpaym_amt
, 0 AS FTDcred_che_amt
, 0 AS FTDcred_cash_amt
, 0 AS FTDpaytm_cach_amt
, 0 AS FTDpaytm_fund_amt
, 0 AS  FTDONLINE_AMOUNT
, 0 AS MTDPARENT_BRANCH
, 0 AS MTDBRANCH
, 0 AS MTDPAYMENT_OR_REFUND_DATE
, 0 AS MTDREVENUE
, (SUM(CASH_AMOUNT)+SUM(REFUND_CASH_AMOUNT)) AS MTDcashamount
, (SUM(CARD_AMOUNT)+SUM(REFUND_CARD_AMOUNT)) AS MTDcardamount
, (SUM(CHEQUE_AMOUNT)+SUM(REFUND_CHEQUE_AMOUNT)) AS MTDchequeamount
, SUM(DD_AMOUNT) AS MTDddamount
, SUM(FUND_TRANSFER_AMOUNT) AS MTDfund_trns_amt
, SUM(PAYTM_AMOUNT) AS MTDpaym_amt
, SUM(CREDIT_CHEQUE_AMOUNT) AS MTDcred_che_amt
, SUM(CREDIT_CASH_AMOUNT) AS MTDcred_cash_amt
, SUM(PAYTM_CASH_AMOUNT) AS MTDpaytm_cach_amt
, SUM(PAYTM_FUND_AMOUNT) AS MTDpaytm_fund_amt
, SUM(ONLINE_AMOUNT) AS  MTDONLINE_AMOUNT
FROM
collection_detail COL
WHERE
PAYMENT_OR_REFUND_DATE BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  AND PARENT_BRANCH IN ('AEH','AHC','AHI')
GROUP BY
BRANCH
)
AS A
GROUP BY
	ENTITY

UNION ALL

SELECT
2 AS RANK
, DATE
, entity
, BILLED
, SUM(FTDREVENUE) AS REVENUE
, SUM(FTDcashamount) AS cashamount
, SUM(FTDcardamount) AS cardamount
, SUM(FTDchequeamount) AS chequeamount
, SUM(FTDddamount) AS ddamount
, SUM(FTDfund_trns_amt) AS fund_trns_amt
, SUM(FTDpaym_amt) AS paym_amt
, SUM(FTDcred_che_amt)
, SUM(FTDcred_cash_amt)
, SUM(FTDpaytm_cach_amt)
, SUM(FTDpaytm_fund_amt)
, SUM(FTDONLINE_AMOUNT) AS ONLINE_AMOUNT
, (SUM(FTDcashamount)+SUM(FTDcardamount)+SUM(FTDchequeamount)+SUM(FTDddamount)+SUM(FTDfund_trns_amt)+SUM(FTDpaym_amt)+SUM(FTDcred_che_amt)+SUM(FTDcred_cash_amt)+SUM(FTDpaytm_cach_amt)
+SUM(FTDpaytm_fund_amt)+SUM(FTDONLINE_AMOUNT)) AS FTDTotal
, SUM(MTDREVENUE) AS REVENUEMTD
, SUM(MTDcashamount) AS cashamountMTD
, SUM(MTDcardamount) AS cardamountMTD
, SUM(MTDchequeamount) AS chequeamountMTD
, SUM(MTDddamount) AS ddamountMTD
, SUM(MTDfund_trns_amt)AS fund_trns_amtMTD
, SUM(MTDpaym_amt) AS paym_amtMTD
, SUM(MTDcred_che_amt)
, SUM(MTDcred_cash_amt)
, SUM(MTDpaytm_cach_amt)
, SUM(MTDpaytm_fund_amt)
, SUM(MTDONLINE_AMOUNT) AS ONLINE_AMOUNTMTD
, (SUM(MTDcashamount)+SUM(MTDcardamount)+SUM(MTDchequeamount)+SUM(MTDddamount)+SUM(MTDfund_trns_amt)+SUM(MTDpaym_amt)+SUM(MTDcred_che_amt)+SUM(MTDcred_cash_amt)+SUM(MTDpaytm_cach_amt)
+SUM(MTDpaytm_fund_amt)+SUM(MTDONLINE_AMOUNT)) AS MTDTotal
FROM
(
-- ftd
SELECT
TRANSACTION_DATE AS DATE
, entity
, BILLED
, ROUND(SUM(NET_AMOUNT),2) AS FTDREVENUE
, 0 AS FTDcashamount
, 0 AS FTDcardamount
, 0 AS FTDchequeamount
, 0 AS FTDddamount
, 0 AS FTDfund_trns_amt
, 0 AS FTDpaym_amt
, 0 AS FTDcred_che_amt
, 0 AS FTDcred_cash_amt
, 0 AS FTDpaytm_cach_amt
, 0 AS FTDpaytm_fund_amt
, 0 AS FTDONLINE_AMOUNT
, 0 AS MTDPARENT_BRANCH
, 0 AS MTDBRANCH
, 0 AS MTDPAYMENT_OR_REFUND_DATE
, 0 AS MTDREVENUE
, 0 AS MTDcashamount
, 0 AS MTDcardamount
, 0 AS MTDchequeamount
, 0 AS MTDddamount
, 0 AS MTDfund_trns_amt
, 0 AS MTDpaym_amt
, 0 AS MTDcred_che_amt
, 0 AS MTDcred_cash_amt
, 0 AS MTDpaytm_cach_amt
, 0 AS MTDpaytm_fund_amt
, 0 AS MTDONLINE_AMOUNT
FROM
revenue_details REV
WHERE
REV.TRANSACTION_DATE = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  AND ENTITY IN ('AEH','AHC','AHI')
GROUP BY
BILLED

UNION ALL

-- mtd
SELECT
DATE_SUB(CURDATE(), INTERVAL 1 DAY) AS DATE
, entity
, BILLED
, 0 AS FTDREVENUE
, 0 AS FTDcashamount
, 0 AS FTDcardamount
, 0 AS FTDchequeamount
, 0 AS FTDddamount
, 0 AS FTDfund_trns_amt
, 0 AS FTDpaym_amt
, 0 AS FTDcred_che_amt
, 0 AS FTDcred_cash_amt
, 0 AS FTDpaytm_cach_amt
, 0 AS FTDpaytm_fund_amt
, 0 AS FTDONLINE_AMOUNT
, 0 AS MTDPARENT_BRANCH
, 0 AS MTDBRANCH
, 0 AS MTDPAYMENT_OR_REFUND_DATE
, ROUND(SUM(NET_AMOUNT),2) AS MTDREVENUE
, 0 AS MTDcashamount
, 0 AS MTDcardamount
, 0 AS MTDchequeamount
, 0 AS MTDddamount
, 0 AS MTDfund_trns_amt
, 0 AS MTDpaym_amt
, 0 AS MTDcred_che_amt
, 0 AS MTDcred_cash_amt
, 0 AS MTDpaytm_cach_amt
, 0 AS MTDpaytm_fund_amt
, 0 AS MTDONLINE_AMOUNT
FROM
revenue_details REV
WHERE
REV.TRANSACTION_DATE BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  AND ENTITY IN ('AEH','AHC','AHI')
GROUP BY
BILLED

UNION ALL
-- collection ftd
SELECT
PAYMENT_OR_REFUND_DATE AS DATE
, PARENT_BRANCH AS entity
, BRANCH
, 0 AS FTDREVENUE
, (SUM(CASH_AMOUNT)+SUM(REFUND_CASH_AMOUNT)) AS FTDcashamount
, (SUM(CARD_AMOUNT)+SUM(REFUND_CARD_AMOUNT)) AS FTDcardamount
, (SUM(CHEQUE_AMOUNT)+SUM(REFUND_CHEQUE_AMOUNT)) AS FTDchequeamount
, SUM(DD_AMOUNT) AS FTDddamount
, SUM(FUND_TRANSFER_AMOUNT) AS FTDfund_trns_amt
, SUM(PAYTM_AMOUNT) AS FTDpaym_amt
, SUM(CREDIT_CHEQUE_AMOUNT) AS FTDcred_che_amt
, SUM(CREDIT_CASH_AMOUNT) AS FTDcred_cash_amt
, SUM(PAYTM_CASH_AMOUNT) AS FTDpaytm_cach_amt
, SUM(PAYTM_FUND_AMOUNT) AS FTDpaytm_fund_amt
, SUM(ONLINE_AMOUNT) AS  FTDONLINE_AMOUNT
, 0 AS MTDPARENT_BRANCH
, 0 AS MTDBRANCH
, 0 AS MTDPAYMENT_OR_REFUND_DATE
, 0 AS MTDREVENUE
, 0 AS MTDcashamount
, 0 AS MTDcardamount
, 0 AS MTDchequeamount
, 0 AS  MTDddamount
, 0 AS MTDfund_trns_amt
, 0 AS MTDpaym_amt
, 0 AS MTDcred_che_amt
, 0 AS MTDcred_cash_amt
, 0 AS MTDpaytm_cach_amt
, 0 AS MTDpaytm_fund_amt
, 0 AS MTDONLINE_AMOUNT
FROM
collection_detail COL
WHERE
PAYMENT_OR_REFUND_DATE = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  AND PARENT_BRANCH IN ('AEH','AHC','AHI')
GROUP BY
BRANCH

UNION ALL
-- collection mtd
SELECT
DATE_SUB(CURDATE(), INTERVAL 1 DAY) AS DATE
, PARENT_BRANCH AS entity
, BRANCH
, 0 AS FTDREVENUE
, 0 AS FTDcashamount
, 0 AS FTDcardamount
, 0 AS FTDchequeamount
, 0 AS FTDddamount
, 0 AS FTDfund_trns_amt
, 0 AS FTDpaym_amt
, 0 AS FTDcred_che_amt
, 0 AS FTDcred_cash_amt
, 0 AS FTDpaytm_cach_amt
, 0 AS FTDpaytm_fund_amt
, 0 AS  FTDONLINE_AMOUNT
, 0 AS MTDPARENT_BRANCH
, 0 AS MTDBRANCH
, 0 AS MTDPAYMENT_OR_REFUND_DATE
, 0 AS MTDREVENUE
, (SUM(CASH_AMOUNT)+SUM(REFUND_CASH_AMOUNT)) AS MTDcashamount
, (SUM(CARD_AMOUNT)+SUM(REFUND_CARD_AMOUNT)) AS MTDcardamount
, (SUM(CHEQUE_AMOUNT)+SUM(REFUND_CHEQUE_AMOUNT)) AS MTDchequeamount
, SUM(DD_AMOUNT) AS MTDddamount
, SUM(FUND_TRANSFER_AMOUNT) AS MTDfund_trns_amt
, SUM(PAYTM_AMOUNT) AS MTDpaym_amt
, SUM(CREDIT_CHEQUE_AMOUNT) AS MTDcred_che_amt
, SUM(CREDIT_CASH_AMOUNT) AS MTDcred_cash_amt
, SUM(PAYTM_CASH_AMOUNT) AS MTDpaytm_cach_amt
, SUM(PAYTM_FUND_AMOUNT) AS MTDpaytm_fund_amt
, SUM(ONLINE_AMOUNT) AS  MTDONLINE_AMOUNT
FROM
collection_detail COL
WHERE
PAYMENT_OR_REFUND_DATE BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  AND PARENT_BRANCH IN ('AEH','AHC','AHI')
GROUP BY
BRANCH
)
AS A
GROUP BY
	ENTITY, BILLED
)
AS FINAL
ORDER BY RANK, ENTITY, BILLED