SELECT
CASE
WHEN ORGN.`DESCRIPTION`='AHC' THEN 'AHC'
WHEN ORGN.`DESCRIPTION`='AEH' THEN 'AEH'
WHEN ORGN.`DESCRIPTION`='AHI' THEN 'AHC'
ELSE
'OHC'
END AS 'PARENT_BRANCH',

	ACC_UNIT.ACCOUNTUNIT AS BRANCH,
	IF(PAT.ID IS NULL,CUST.`CUSTOMERNO`,PAT.PATIENTID) AS 'PATIENT_MRN',
	IF(PAT.ID IS NULL,CUST.`CUSTOMERNAME`,PAT.PATIENTNAME) AS 'PATIENT_NAME',
	DATE_FORMAT(BP.PAYMENT_DATE,'%Y-%m-%d') AS 'PAYMENT_OR_REFUND_DATE',
	BPB.BILL_NO AS 'BILL_NO',
	BP.`RECEIPT_NO` AS 'RECEIPT_NO',
	BPB.BILL_AMOUNT AS 'TOTAL_BILL_AMT',
	IF((BPD.PAYMENT_MODE='Cash' AND (CASE WHEN BPB.BILL_TYPE='IP' THEN BP.PAID_BY IS NOT NULL ELSE BP.PAID_STATUS!=2 END ) AND BP.PAID_STATUS!=7 ),ABS(BPD.PAYMENT_AMOUNT),0) AS CASH_AMOUNT,
	IF((BPD.PAYMENT_MODE='Card' AND (CASE WHEN BPB.BILL_TYPE='IP' THEN BP.PAID_BY IS NOT NULL ELSE BP.PAID_STATUS!=2 END ) AND BP.PAID_STATUS!=7 ),ABS(BPD.PAYMENT_AMOUNT),0) AS CARD_AMOUNT,
	IF(BPD.PAYMENT_MODE='Card',BPD.CARD_SERVICE_CHARGE,0) AS CARD_SERVICE_CHARGE_AMOUNT,
	IF((BPD.PAYMENT_MODE='Cheque' AND (CASE WHEN BPB.BILL_TYPE='IP' THEN BP.PAID_BY IS NOT NULL ELSE BP.PAID_STATUS!=2 END ) AND BP.PAID_STATUS!=7),BPD.PAYMENT_AMOUNT,0) AS CHEQUE_AMOUNT,
	IF((BPD.PAYMENT_MODE='Fund Transfer'),BPD.PAYMENT_AMOUNT,0) AS FUND_TRANSFER_AMOUNT,
	IF((BPD.PAYMENT_MODE='Paytm'),BPD.PAYMENT_AMOUNT,0) AS PAYTM_AMOUNT,
	IF(BPD.PAYMENT_MODE='DD',BPD.PAYMENT_AMOUNT,0) AS DD_AMOUNT,
		IF((BPD.PAYMENT_MODE='Online Services'),BPD.PAYMENT_AMOUNT,0) AS ONLINE_AMOUNT,
	-IF((BPD.PAYMENT_MODE='Cash' AND (CASE WHEN BPB.BILL_TYPE='IP' THEN BP.PAID_BY IS NULL ELSE BP.PAID_STATUS =2 END ) ),ABS(BPD.PAYMENT_AMOUNT),0) AS REFUND_CASH_AMOUNT,
	-IF((BPD.PAYMENT_MODE='Card' AND (CASE WHEN BPB.BILL_TYPE='IP' THEN BP.PAID_BY IS NULL ELSE BP.PAID_STATUS =2 END ) ),ABS(BPD.PAYMENT_AMOUNT),0) AS REFUND_CARD_AMOUNT,
	-IF((BPD.PAYMENT_MODE='Cheque' AND (CASE WHEN BPB.BILL_TYPE='IP' THEN BP.PAID_BY IS NULL ELSE BP.PAID_STATUS =2 END )),ABS(BPD.PAYMENT_AMOUNT),0) AS REFUND_CHEQUE_AMOUNT,
	IF((BPD.PAYMENT_MODE='Cheque' AND BP.PAID_STATUS=7),ABS(BPD.PAYMENT_AMOUNT),0) AS CREDIT_CHEQUE_AMOUNT,
	IF((BPD.PAYMENT_MODE='Cash' AND BP.PAID_STATUS=7),ABS(BPD.PAYMENT_AMOUNT),0) AS CREDIT_CASH_AMOUNT,
	IF((BPD.PAYMENT_MODE='Paytm' AND BP.PAID_STATUS=7),ABS(BPD.PAYMENT_AMOUNT),0) AS PAYTM_CASH_AMOUNT,
	0 AS PAYTM_FUND_AMOUNT,
	IF (BPB.`BILL_TYPE` =  "OP",
	IF ( BPB.ID IN (SELECT DISTINCT BILL_ID FROM BILL_SERVICE_DETAIL DTL
		INNER JOIN RT_TICKET_DIRECTSALES SAL ON SAL.ID = DTL.SERVICE_ID
		INNER JOIN RT_DATA_DEPARTMENT DEPT ON DEPT.ID = SAL.DEPTID AND DEPARTMENTNAME LIKE '%PHARM%' ) ,"PHARMACY",
	IF ( BPB.ID IN (SELECT DISTINCT BILL_ID FROM BILL_SERVICE_DETAIL DTL
		INNER JOIN RT_TICKET_DIRECTSALES SAL ON SAL.ID = DTL.SERVICE_ID
		INNER JOIN RT_DATA_DEPARTMENT DEPT ON DEPT.ID = SAL.DEPTID AND DEPARTMENTNAME LIKE '%OPTICAL%' ),"OPTICAL","OP")),"IP") AS DEPARTMENT
		,IF(BPD.PAYMENT_AMOUNT<0,'REFUND','Payment') AS PAYMENT_NATURE,
	BPD.PAYMENT_MODE AS PAYMENT_MODE,
	(BPD.PAYMENT_AMOUNT)+IF(BPD.CARD_SERVICE_CHARGE IS NULL,0,BPD.CARD_SERVICE_CHARGE) AS 'PAID_AMOUNT',
	BP.CREATED_BY AS CREATEDBY,
	CONCAT(ACC_UNIT.ACCOUNTUNIT,"/",BP.`RECEIPT_NO`) AS 'PAYMENT_REFERENCE',
	CAST(IF(BPD.PAYMENT_MODE='DD',CONCAT(BPD.DD_NUMBER," / ",BPD.BANK_NAME),IF(BPD.PAYMENT_MODE='Cheque',CONCAT(BPD.CHEQUE_NUMBER," / ",BPD.BANK_NAME),IF(BPD.PAYMENT_MODE IN ('Card','Paytm'),CONCAT(IF(ISNULL(BPD.CARD_NUMBER),"",CONCAT(BPD.CARD_NUMBER," / ")),IF(ISNULL(BPD.SWIPE_MACHINE),"",CONCAT(BPD.SWIPE_MACHINE," / ")),IF(ISNULL(BPD.BATCH_NUMBER),"",CONCAT(BPD.BATCH_NUMBER," / ")),IF((BPD.CARD_SERVICE_CHARGE=0.0),"",CONCAT("Rs.",BPD.CARD_SERVICE_CHARGE))),""))) AS CHAR) AS PAYMENT_DETAIL
FROM
	BILL_PAYMENT AS BP
	INNER JOIN BILL_PAYMENT_DETAIL BPD ON BP.ID=BPD.PAYMENT_ID
	INNER JOIN BILL_PATIENT_BILL AS BPB ON BP.BILL_ID=BPB.ID
	LEFT JOIN RT_DATA_ACCOUNT_UNIT AS ACC_UNIT ON ACC_UNIT.ID=BPB.ACC_UNIT_ID
	LEFT JOIN `RT_ORGANIZATION_CORE` ORGN ON ORGN.ORGANIZATIONNAME  = ACC_UNIT.ACCOUNTUNIT
	LEFT JOIN RT_INDIVIDUAL_PATIENT PAT ON PAT.ID = BPB.PATIENT_ID
	LEFT JOIN `RT_INDIVIDUAL_CUSTOMER` CUST ON CUST.ID=BPB.CUSTOMER_ID
WHERE DATE(BP.PAYMENT_DATE) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
AND BPD.PAYMENT_MODE <> 'DEPOSIT'
 -- AND ORGN.DESCRIPTION IN ('AEH','AHC','AHI')
 AND ORGN.STATUS =1
UNION ALL
SELECT
	CASE
WHEN ORGN.`DESCRIPTION`='AHC' THEN 'AHC'
WHEN ORGN.`DESCRIPTION`='AEH' THEN 'AEH'
WHEN ORGN.`DESCRIPTION`='AHI' THEN 'AHC'
ELSE
'OHC'
END AS 'PARENT_BRANCH',
	ACC_UNIT.ACCOUNTUNIT AS BRANCH,
	PAT.PATIENTID AS 'PATIENT_MRN',
	PAT.PATIENTNAME AS 'PATIENT_NAME',
	DATE_FORMAT(CORE.CREATEDTIME,'%Y-%m-%d') AS 'PAYMENT_OR_REFUND_DATE',
	advance.RECEIPTNO AS 'BILL_NO',
	advance.RECEIPTNO AS 'RECEIPT_NO',
	advance.ADVAMOUNT AS 'TOTAL_BILL_AMT',
	IF(advance.PAYMENTMODE='Cash',COALESCE(advance.ADVAMOUNT),0) AS CASH_AMOUNT,
	IF(advance.PAYMENTMODE='Card',COALESCE(advance.ADVAMOUNT),0) AS CARD_AMOUNT,
	0 AS CARD_SERVICE_CHARGE_AMOUNT,
	IF(advance.PAYMENTMODE='Cheque',COALESCE(advance.ADVAMOUNT),0) AS CHEQUE_AMOUNT,
	IF(advance.PAYMENTMODE='Fund Transfer',COALESCE(advance.ADVAMOUNT),0) AS FUND_TRANSFER_AMOUNT,
	IF(advance.PAYMENTMODE='Paytm',COALESCE(advance.ADVAMOUNT),0) AS PAYTM_AMOUNT,
	0 AS DD_AMOUNT,
	IF(advance.PAYMENTMODE='Online Services',COALESCE(advance.ADVAMOUNT),0) AS ONLINE_AMOUNT,
	
	0 AS REFUND_CASH_AMOUNT,
	0 AS REFUND_CARD_AMOUNT,
	0 AS REFUND_CHEQUE_AMOUNT,
	0 AS CREDIT_CHEQUE_AMOUNT,
	0 AS CREDIT_CASH_AMOUNT,
	0 AS PAYTM_CASH_AMOUNT,
	0 AS PAYTM_FUND_AMOUNT,
	'ADVANCE' AS UNIT,
	'ADVANCE' AS PAYMENT_NATURE,
	advance.PAYMENTMODE AS PAYMENT_MODE,
	COALESCE(advance.ADVAMOUNT) AS 'PAID_AMOUNT',
	CORE.CREATEDBY AS CREATEDBY,
	CONCAT(ACC_UNIT.ACCOUNTUNIT,'/',advance.RECEIPTNO) AS 'PAYMENT_REFERENCE',
CAST(IF(advance.PAYMENTMODE='Cheque',CONCAT(advance.chequeNo," / ",advance.bankNameCheque),IF(advance.PAYMENTMODE='Card',CONCAT(IF(ISNULL(advance.cardNumber),"",CONCAT(advance.cardNumber," / ")),IF(ISNULL(advance.cardMachine),"",CONCAT(advance.cardMachine," / ")),IF(ISNULL(advance.cardBatchNo),"",CONCAT(advance.cardBatchNo," / "))),"")) AS CHAR) AS PAYMENT_DETAIL


FROM
	`RT_TICKET_ADVANCE_PAYMENT` AS advance
	LEFT JOIN RT_TICKET_CORE AS CORE ON advance.ID = CORE.ID
	LEFT JOIN `RT_DATA_CORE` AS DCORE ON DCORE.TENANTID = CORE.TENANTID AND APPLICATION_NAME ='Account Unit'
	LEFT JOIN RT_DATA_ACCOUNT_UNIT AS ACC_UNIT ON ACC_UNIT.ID=DCORE.ID
	LEFT JOIN `RT_ORGANIZATION_CORE` ORGN ON ORGN.ORGANIZATIONNAME  = ACC_UNIT.ACCOUNTUNIT
	LEFT JOIN RT_INDIVIDUAL_PATIENT AS PAT ON advance.ADVPATIENTID=PAT.ID
 	LEFT JOIN RT_INDIVIDUAL_CORE AS PATCORE ON PATCORE.ID=PAT.ID
WHERE
	advance.ADVAMOUNT > 0
	AND DATE(CORE.CREATEDTIME) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
	-- AND ORGN.DESCRIPTION IN ('AEH','AHC','AHI')
	AND advance.PAYMENTMODE <> 'Deposit'
	AND ORGN.STATUS =1
UNION ALL
SELECT
	CASE
WHEN ORGN.`DESCRIPTION`='AHC' THEN 'AHC'
WHEN ORGN.`DESCRIPTION`='AEH' THEN 'AEH'
WHEN ORGN.`DESCRIPTION`='AHI' THEN 'AHC'
ELSE
'OHC'
END AS 'PARENT_BRANCH',
	ACC_UNIT.ACCOUNTUNIT AS BRANCH,
	PAT.PATIENTID AS 'PATIENT_MRN',
	PAT.PATIENTNAME AS 'PATIENT_NAME',
	DATE_FORMAT(CORE.CREATEDTIME,'%Y-%m-%d') AS 'PAYMENT_OR_REFUND_DATE',
	advance.ADVBILLID AS 'BILL_NO',
	advance.ADVBILLID AS 'RECEIPT_NO',
	advance.ADVAMOUNT AS 'TOTAL_BILL_AMT',
	0 AS CASH_AMOUNT,
	0 AS CARD_AMOUNT,
	0 AS CARD_SERVICE_CHARGE_AMOUNT,
	0 AS CHEQUE_AMOUNT,
	0 AS FUND_TRANSFER_AMOUNT,
	0 AS PAYTM_AMOUNT,
	0 AS DD_AMOUNT,
	0 AS ONLINE_AMOUNT,
	-IF(advance.REFUNDPAYMENTMODE='Cash',COALESCE(SUM(advance.refundamount)),0) AS REFUND_CASH_AMOUNT,
	-IF(advance.REFUNDPAYMENTMODE='Card',COALESCE(SUM(advance.refundamount)),0) AS REFUND_CARD_AMOUNT,
	-IF(advance.REFUNDPAYMENTMODE='Cheque',COALESCE(SUM(advance.refundamount)),0) AS REFUND_CHEQUE_AMOUNT,
	0 AS CREDIT_CHEQUE_AMOUNT,
	0 AS CREDIT_CASH_AMOUNT,
	0 AS PAYTM_CASH_AMOUNT,
	0 AS PAYTM_FUND_AMOUNT,
	'Refund' AS PAYMENT_NATURE,
	'REFUND' AS UNIT,
	advance.REFUNDPAYMENTMODE AS PAYMENT_MODE,
	-COALESCE(SUM(advance.refundamount)) AS 'PAID_AMOUNT',
	CORE.CREATEDBY AS CREATEDBY,
	CONCAT(ACC_UNIT.ACCOUNTUNIT,'/',advance.RECEIPTNO) AS 'PAYMENT_REFERENCE',
	CAST(IF(advance.REFUNDPAYMENTMODE='Cheque',CONCAT(advance.chequeNo," / ",advance.bankNameCheque),"") AS CHAR) AS PAMENT_DETAIL

FROM
	`RT_TICKET_ADVANCE_PAYMENT` AS advance
	LEFT JOIN RT_TICKET_CORE AS CORE ON advance.ID = CORE.ID
	LEFT JOIN `RT_DATA_CORE` AS DCORE ON DCORE.TENANTID = CORE.TENANTID AND APPLICATION_NAME ='Account Unit'
	LEFT JOIN RT_DATA_ACCOUNT_UNIT AS ACC_UNIT ON ACC_UNIT.ID=DCORE.ID
	LEFT JOIN `RT_ORGANIZATION_CORE` ORGN ON ORGN.ORGANIZATIONNAME  = ACC_UNIT.ACCOUNTUNIT
	 LEFT JOIN RT_INDIVIDUAL_PATIENT AS PAT ON advance.ADVPATIENTID=PAT.ID
 	LEFT JOIN RT_INDIVIDUAL_CORE AS PATCORE ON PATCORE.ID=PAT.ID
WHERE
	REFUNDAMTCHECK = 'Yes'
	AND DATE(CORE.CREATEDTIME) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)

 	-- AND ORGN.DESCRIPTION IN ('AEH','AHC','AHI')
	AND advance.PAYMENTMODE <> 'Deposit'
AND ORGN.STATUS =1
GROUP BY
	advance.ADVBILLID
