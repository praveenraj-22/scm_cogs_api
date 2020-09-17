 SELECT  ORGCRE.DESCRIPTION AS entity,
 DATE(BILLDATE) AS TRANSACTION_DATE,
BILLED AS BILLED,
BRANCH AS NATIVE,
PAYORTYPE AS PAYORTYPE,
PATIENTNAME AS PAYER_NAME,
PAYORNAME AS AGENCY_NAME,
UNIT AS UNIT,
GROUP1 AS 'GROUP',
SUBGROUP AS SUBGROUP,
PATIENTID AS MRN,
PATIENTNAME AS PATIENT_NAME,
REFERRAL_TYPE AS REFERRAL_TYPE,
REFERRAL_BY AS REFERRAL_BY,
REFERRAL_VALUE AS REFERRAL_VALUE,
PATIENT_AGE AS PATIENT_AGE,
REGISTERED_DATE AS REGISTERED_DATE,
	IF(REGISTERED_DATE IS NULL, 'DIRECT SALES', IF(DATEDIFF(DATE(BILLDATE),DATE(REGISTERED_DATE)) = 0, 'NEW', 'REVIEW')) AS VISIT_TYPE,
	IF(REGISTERED_DATE IS NULL, 0, DATEDIFF(DATE(BILLDATE),DATE(REGISTERED_DATE))) AS VISIT_DAYS,

BILLNO AS BILLNO,
BILLID AS EXTERNAL_ID,
ITEMCODE AS ITEMCODE,
ITEMNAME AS ITEMNAME,
MANUFACTURER AS MANUFACTURER,
QUANTITY AS QUANTITY,
AMOUNT AS TOTAL_AMOUNT,
DISCOUNT_AMOUNT AS DISCOUNT_AMOUNT,
NET_AMOUNT AS NET_AMOUNT,
PATIENT_AMOUNT AS PATIENT_AMOUNT,
PAYOR_AMOUNT AS PAYOR_AMOUNT,
CGST AS CGST,
SGST AS SGST,
GST_PERCENTAGE AS 'GST%',
Patient_Amount_WO_GST AS 'Net_Amount_W/O_GST',
CGST_Value AS CGST_Value,
SGST_VALUE AS SGST_Value
FROM 
(
(SELECT
	BILL.ID AS BILLID,
	-- IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
	IF(BILLACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
BILLACCUNIT.ACCOUNTUNIT AS BILLED,
	CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) AS BILLDATE,
	-- CONVERT_TZ(BILL.BILL_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) AS CREATEDDATE,
	-- IF((CONVERT_TZ(BILL.BILL_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) - CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT',''))) <= 0, 0, CONVERT_TZ(CORE.CREATEDTIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) - CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT',''))) AS DIFFDATE,
	BILL.BILL_NO AS BILLNO,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNO,PATIENT.PATIENTID) AS PATIENTID,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNAME,PATIENT.PATIENTNAME) AS PATIENTNAME,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.AGE,PATIENT.AGE) AS PATIENT_AGE,DATE(RIC.CREATEDTIME) AS REGISTERED_DATE,
	BILL.BILL_TYPE AS VISITTYPE,
	ACCHEAD.ACCOUNTHEAD AS UNIT,
	 SUB.`ACCOUNTSUBHEAD`  AS 'GROUP1',
	 LED.`LEDGER` AS 'SUBGROUP',
	 CHARGE.CHARGE AS ITEMNAME,
	CHARGE.CHARGECODE AS ITEMCODE,
	DETAIL.SERVICE_AMOUNT AS AMOUNT,
	DETAIL.QUANTITY AS QUANTITY,
	DETAIL.SERVICE_DISCOUNT AS DISCOUNT_AMOUNT,
	(DETAIL.SERVICE_AMOUNT - DETAIL.SERVICE_DISCOUNT) AS NET_AMOUNT,
	DETAIL.CLAIM_AMOUNT AS PAYOR_AMOUNT,
	(DETAIL.SERVICE_AMOUNT - DETAIL.SERVICE_DISCOUNT - DETAIL.CLAIM_AMOUNT) AS PATIENT_AMOUNT,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'Self', IF(PAYORTYPE.PAYORCATEGORY ='Cash','Self',PAYORTYPE.PAYORCATEGORY)) AS PAYORTYPE,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'SELF PAYING', PAYORTYPE.PAYORTYP) AS PAYORNAME,
	0 AS CGST,
	0 AS SGST,
	0 AS 'GST_PERCENTAGE',
	0 AS 'Patient_Amount_WO_GST',
	0 AS 'CGST_Value',
	0 AS 'SGST_Value',
	'' AS 'MANUFACTURER',
	'' AS 'COSTPRICE',
	IF(RDRT.REFERRALTYPENAME IS NULL, '', RDRT.REFERRALTYPENAME) AS REFERRAL_TYPE,
	PATIENT.REFERRALTYPEHIDDEN AS REFERRAL_VALUE,IF(RDRB.REFERREDBYNAME IS NULL, '', RDRB.REFERREDBYNAME) AS REFERRAL_BY
FROM
	BILL_PATIENT_BILL AS BILL
	INNER JOIN BILL_SERVICE_DETAIL AS DETAIL ON DETAIL.BILL_ID = BILL.ID
	AND DETAIL.PACKAGE_ID IS NULL AND DETAIL.SCREEN != 4 -- AND DETAIL.BILL_STATUS NOT IN (4,5)
	INNER JOIN RT_DATA_CHARGE_DETAIL AS CHARGEDETAIL ON CHARGEDETAIL.ID = DETAIL.CHARGEDETAIL_ID
	INNER JOIN RT_DATA_CORE AS CORE ON CORE.ID = CHARGEDETAIL.ID
	INNER JOIN RT_DATA_CHARGE AS CHARGE ON CHARGE.ID = CORE.PARENT_TICKET_ID
        INNER JOIN RT_DATA_ACCOUNTSUBHEAD AS SUB ON SUB.ID = CHARGE.ACCSUBHEAD
LEFT JOIN `RT_DATA_LEDGER` LED ON LED.ID=CHARGE.CHARGELEDGER
	INNER JOIN RT_DATA_ACCOUNT_HEAD AS ACCHEAD ON ACCHEAD.ID = CHARGE.CHARGACCOUNTHEAD
	LEFT JOIN RT_INDIVIDUAL_PATIENT AS PATIENT ON PATIENT.ID = BILL.PATIENT_ID
	LEFT JOIN RT_INDIVIDUAL_CORE AS RIC ON RIC.ID=PATIENT.ID
	LEFT JOIN RT_INDIVIDUAL_CUSTOMER AS CUSTOMER ON CUSTOMER.ID = BILL.CUSTOMER_ID
	-- LEFT JOIN RT_TICKET_VISIT AS VISIT ON VISIT.ID = BILL.VISIT_ID
	LEFT JOIN RT_DATA_PAYORTYPE AS PAYORTYPE ON BILL.PAYOR_TYPE_ID = PAYORTYPE.ID
	LEFT JOIN RT_DATA_ACCOUNT_UNIT PATACCUNIT ON PATACCUNIT.ID= IF(PATIENT.ID IS NULL,BILL.ACC_UNIT_ID  ,PATIENT.ACCUNIT )
	LEFT JOIN `RT_DATA_ACCOUNT_UNIT` AS BILLACCUNIT ON BILLACCUNIT.ID = BILL.`ACC_UNIT_ID`
	LEFT JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=PATIENT.REFERRALTYPE
	LEFT JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=PATIENT.REFERREDBYCONSULTANT
	LEFT JOIN SYS_ADMIN_TIMEZONE AS TZ ON TZ.TIMEZONE_ID = IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCUNITTIMEZONEID,BILLACCUNIT.ACCUNITTIMEZONEID)
WHERE

 BILL.REVENUE_DATE BETWEEN DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 3 DAY) AND DATE_ADD(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY)
AND BILL.REVENUE_DATE  >=   CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
AND BILL.REVENUE_DATE <=  CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 23:59:59'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
        AND (DETAIL.BILL_STATUS != 4 OR (DETAIL.CLAIM_AMOUNT>0))
	AND (DETAIL.REASON != 'Deleted From Counseling Console' OR DETAIL.REASON IS NULL)
)	
UNION ALL
(
SELECT
	BILL.ID AS BILLID,
	-- IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
	IF(BILLACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
BILLACCUNIT.ACCOUNTUNIT AS BILLED,
	CONVERT_TZ(CREDITDEBIT.CREATED_TIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) AS BILLDATE,
--	CONVERT_TZ(CREDITDEBIT.CREATED_TIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) AS CREATEDDATE,
--	IF((CONVERT_TZ(CREDITDEBIT.CREATED_TIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) - CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT',''))) <= 0, 0,  CONVERT_TZ(CORE.CREATEDTIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) - CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT',''))) AS DIFFDATE,
	BILL.BILL_NO AS BILLNO,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNO,PATIENT.PATIENTID) AS PATIENTID,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNAME,PATIENT.PATIENTNAME) AS PATIENTNAME,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.AGE,PATIENT.AGE) AS PATIENT_AGE,DATE(RIC.CREATEDTIME) AS REGISTERED_DATE,
	BILL.BILL_TYPE AS VISITTYPE,
ACCHEAD.ACCOUNTHEAD AS UNIT,
	 SUB.`ACCOUNTSUBHEAD`  AS 'GROUP1',
	 LED.`LEDGER` AS 'SUBGROUP',
	CHARGE.CHARGE AS ITEMNAME,
	CHARGE.CHARGECODE AS ITEMCODE,
	-DETAIL.SERVICE_AMOUNT AS AMOUNT,
	-DETAIL.QUANTITY AS QUANTITY,
	-DETAIL.SERVICE_DISCOUNT AS DISCOUNT_AMOUNT,
	-(DETAIL.SERVICE_AMOUNT - DETAIL.SERVICE_DISCOUNT) AS NET_AMOUNT,
	-(DETAIL.CLAIM_AMOUNT) AS PAYOR_AMOUNT,
	-(DETAIL.SERVICE_AMOUNT - DETAIL.SERVICE_DISCOUNT - DETAIL.CLAIM_AMOUNT) AS PATIENT_AMOUNT,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'Self', IF(PAYORTYPE.PAYORCATEGORY ='Cash','Self',PAYORTYPE.PAYORCATEGORY)) AS PAYORTYPE,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'SELF PAYING', PAYORTYPE.PAYORTYP) AS PAYORNAME,
	0 AS CGST,
	0 AS SGST,
	0 AS 'GST_PERCENTAGE',
	0 AS 'Patient Amount W/O GST',
	0 AS 'CGST Value',
	0 AS 'SGST Value',
	'' AS 'MANUFACTURER'
	,'' AS 'COSTPRICE'
	,
	IF(RDRT.REFERRALTYPENAME IS NULL, '', RDRT.REFERRALTYPENAME) AS REFERRAL_TYPE,
	PATIENT.REFERRALTYPEHIDDEN AS REFERRAL_VALUE,IF(RDRB.REFERREDBYNAME IS NULL, '', RDRB.REFERREDBYNAME) AS REFERRAL_BY
FROM
	BILL_PATIENT_BILL AS BILL
	INNER JOIN BILL_SERVICE_DETAIL AS DETAIL ON DETAIL.BILL_ID = BILL.ID
	AND DETAIL.PACKAGE_ID IS NULL AND DETAIL.SCREEN != 4 -- AND DETAIL.BILL_STATUS NOT IN (4,5)
	INNER JOIN RT_DATA_CHARGE_DETAIL AS CHARGEDETAIL ON CHARGEDETAIL.ID = DETAIL.CHARGEDETAIL_ID
	INNER JOIN RT_DATA_CORE AS CORE ON CORE.ID = CHARGEDETAIL.ID
	INNER JOIN RT_DATA_CHARGE AS CHARGE ON CHARGE.ID = CORE.PARENT_TICKET_ID

	INNER JOIN RT_DATA_ACCOUNT_HEAD AS ACCHEAD ON ACCHEAD.ID = CHARGE.CHARGACCOUNTHEAD
	LEFT JOIN RT_INDIVIDUAL_PATIENT AS PATIENT ON PATIENT.ID = BILL.PATIENT_ID
	LEFT JOIN RT_INDIVIDUAL_CORE AS RIC ON RIC.ID=PATIENT.ID
	LEFT JOIN RT_INDIVIDUAL_CUSTOMER AS CUSTOMER ON CUSTOMER.ID = BILL.CUSTOMER_ID
	LEFT JOIN `RT_DATA_ACCOUNTSUBHEAD` SUB ON SUB.ID=CHARGE.ACCSUBHEAD
	LEFT JOIN `RT_DATA_LEDGER` LED ON LED.ID=CHARGE.CHARGELEDGER
	LEFT JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=PATIENT.REFERRALTYPE
	LEFT JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=PATIENT.REFERREDBYCONSULTANT
	-- LEFT JOIN RT_TICKET_VISIT AS VISIT ON VISIT.ID = BILL.VISIT_ID
	LEFT JOIN RT_DATA_PAYORTYPE AS PAYORTYPE ON BILL.PAYOR_TYPE_ID = PAYORTYPE.ID
	LEFT JOIN BILL_CREDIT_DEBIT_AUDIT AS CREDITDEBIT ON  CREDITDEBIT.BILL_ID = BILL.ID AND CREDITDEBIT.BILL_DETAIL_ID IS NOT NULL
	LEFT JOIN RT_DATA_ACCOUNT_UNIT PATACCUNIT ON PATACCUNIT.ID= IF(PATIENT.ID IS NULL,BILL.ACC_UNIT_ID  ,PATIENT.ACCUNIT )
	LEFT JOIN `RT_DATA_ACCOUNT_UNIT` AS BILLACCUNIT ON BILLACCUNIT.ID = BILL.`ACC_UNIT_ID`
	LEFT JOIN SYS_ADMIN_TIMEZONE AS TZ ON TZ.TIMEZONE_ID = IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCUNITTIMEZONEID,BILLACCUNIT.ACCUNITTIMEZONEID)
WHERE

 
 (CREDITDEBIT.BILL_DETAIL_ID IS NULL OR CREDITDEBIT.BILL_DETAIL_ID = DETAIL.ID )
AND CREDITDEBIT.CREATED_TIME BETWEEN DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 3 DAY) AND DATE_ADD(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY)
AND CREDITDEBIT.CREATED_TIME  >=   CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
AND CREDITDEBIT.CREATED_TIME <=  CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 23:59:59'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
	AND (BILL.REVENUE_DATE < CREDITDEBIT.CREATED_TIME)
	AND CREDITDEBIT.AMOUNT < 0 
	)
UNION ALL
(SELECT
	BILL.ID AS BILLID,
	-- IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
	IF(BILLACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
BILLACCUNIT.ACCOUNTUNIT AS BILLED,
	CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) AS BILLDATE,
	-- CONVERT_TZ(TCORE.CREATEDTIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) AS CREATEDDATE,
	-- IF((CONVERT_TZ(TCORE.CREATEDTIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) - CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT',''))) <= 0, 0, CONVERT_TZ(TCORE.CREATEDTIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) - CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT',''))) AS DIFFDATE,
	BILL.BILL_NO AS BILLNO,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNO,PATIENT.PATIENTID) AS PATIENTID,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNAME,PATIENT.PATIENTNAME) AS PATIENTNAME,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.AGE,PATIENT.AGE) AS PATIENT_AGE,DATE(RIC.CREATEDTIME) AS REGISTERED_DATE,
	BILL.BILL_TYPE AS VISITTYPE,
ACCHEAD.ACCOUNTHEAD AS UNIT,
	ITMC.`ITMCGCATEGNAME`  AS 'GROUP1',
	ITEM.SUBCATEGORY AS 'SUBGROUP',
	ITEM.ADITMNAME AS ITEMNAME,
	ITEM.ITEMCODE AS ITEMCODE,
	CASE  WHEN BILL.REVENUE_DATE > SALESRETURNDETAIL.CREATEDTIME THEN  
	DIRECTSALESDETAIL.TOTAL - SUM(SALESRETURNDETAIL.RETURNAMOUNT)
	ELSE DIRECTSALESDETAIL.TOTAL
	END AS AMOUNT,
	CASE  WHEN BILL.REVENUE_DATE > SALESRETURNDETAIL.CREATEDTIME THEN  
	DIRECTSALESDETAIL.QUANTITY - SUM(SALESRETURNDETAIL.RETURNQUANTITY)
	ELSE DIRECTSALESDETAIL.QUANTITY
	END AS QUANTITY,
	IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT) AS DISCOUNT_AMOUNT,
	CASE  WHEN BILL.REVENUE_DATE > SALESRETURNDETAIL.CREATEDTIME THEN  
	(DIRECTSALESDETAIL.TOTAL  - IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT)) - SUM(SALESRETURNDETAIL.RETURNAMOUNT)
	ELSE (DIRECTSALESDETAIL.TOTAL  - IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT))
	END AS NET_AMOUNT,
	CASE  WHEN BILL.REVENUE_DATE > SALESRETURNDETAIL.CREATEDTIME THEN  
	IF(DIRECTSALESDETAIL.CLAIMAMOUNT>0,IF(DIRECTSALESDETAIL.CLAIMAMOUNT IS NULL,0,DIRECTSALESDETAIL.CLAIMAMOUNT) - SUM(SALESRETURNDETAIL.RETURNAMOUNT),0)
	ELSE IF(DIRECTSALESDETAIL.CLAIMAMOUNT IS NULL,0,DIRECTSALESDETAIL.CLAIMAMOUNT) 
	END AS PAYOR_AMOUNT,
	CASE  WHEN BILL.REVENUE_DATE > SALESRETURNDETAIL.CREATEDTIME THEN  
	(DIRECTSALESDETAIL.TOTAL  - IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT)) - SUM(SALESRETURNDETAIL.RETURNAMOUNT)-(IF(DIRECTSALESDETAIL.CLAIMAMOUNT>0,IF(DIRECTSALESDETAIL.CLAIMAMOUNT IS NULL,0,DIRECTSALESDETAIL.CLAIMAMOUNT) - SUM(SALESRETURNDETAIL.RETURNAMOUNT),0))
	ELSE (DIRECTSALESDETAIL.TOTAL  - IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT)-IF(DIRECTSALESDETAIL.CLAIMAMOUNT IS NULL,0,DIRECTSALESDETAIL.CLAIMAMOUNT))
	END   AS PATIENT_AMOUNT,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'Self', IF(PAYORTYPE.PAYORCATEGORY ='Cash','Self',PAYORTYPE.PAYORCATEGORY)) AS PAYORTYPE,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'SELF PAYING', PAYORTYPE.PAYORTYP) AS PAYORNAME,
	TAX.VALUE AS CGST,
	TAX.VALUE AS SGST,
	(TAX.VALUE+TAX.VALUE) AS 'GST%',
	ROUND(100/(100+(TAX.VALUE+TAX.VALUE))*((DIRECTSALESDETAIL.TOTAL - IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT))),2) AS 'Patient Amount W/O GST',
	ROUND((100/(100+(TAX.VALUE+TAX.VALUE))*((DIRECTSALESDETAIL.TOTAL - IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT)) * (TAX.VALUE/100))),2) AS 'CGST Value',
	ROUND((100/(100+(TAX.VALUE+TAX.VALUE))*((DIRECTSALESDETAIL.TOTAL - IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT)) * (TAX.VALUE/100))),2) AS 'SGST Value',
	ITEM.`MANUFACTURERID` AS 'MANUFACTURER',
	DTL.`UNIT_PRICE` AS 'COSTPRICE',IF(RDRT.REFERRALTYPENAME IS NULL, '', RDRT.REFERRALTYPENAME) AS REFERRAL_TYPE,
	PATIENT.REFERRALTYPEHIDDEN AS REFERRAL_VALUE,IF(RDRB.REFERREDBYNAME IS NULL, '', RDRB.REFERREDBYNAME) AS REFERRAL_BY

FROM
	BILL_PATIENT_BILL AS BILL
	INNER JOIN BILL_SERVICE_DETAIL AS DETAIL ON DETAIL.BILL_ID = BILL.ID 
	AND DETAIL.SCREEN = 4 -- AND DETAIL.BILL_STATUS NOT IN (4,5)
	INNER JOIN RT_DATA_CHARGE_DETAIL AS CHARGEDETAIL ON CHARGEDETAIL.ID = DETAIL.CHARGEDETAIL_ID
	INNER JOIN RT_DATA_CORE AS CORE ON CORE.ID = CHARGEDETAIL.ID
	INNER JOIN RT_DATA_CHARGE AS CHARGE ON CHARGE.ID = CORE.PARENT_TICKET_ID
	INNER JOIN RT_DATA_ACCOUNT_HEAD AS ACCHEAD ON ACCHEAD.ID = CHARGE.CHARGACCOUNTHEAD
	INNER JOIN RT_TICKET_DIRECTSALES AS DIRECTSALES ON DIRECTSALES.ID = DETAIL.SERVICE_ID
	INNER JOIN RT_TICKET_DIRECTSALESDETAIL AS DIRECTSALESDETAIL ON DIRECTSALESDETAIL.SALESID = DIRECTSALES.ID
	INNER JOIN RT_DATA_ITEM AS ITEM ON ITEM.ID = DIRECTSALESDETAIL.ITEMID
	LEFT JOIN RT_DATA_TAX AS TAX ON DIRECTSALESDETAIL.TAXTYPE = TAX.ID
	-- LEFT JOIN RT_DATA_TAX AS TAX1 ON ITEM.SGST = TAX1.ID
	LEFT JOIN RT_INDIVIDUAL_PATIENT AS PATIENT ON PATIENT.ID = BILL.PATIENT_ID
	LEFT JOIN RT_INDIVIDUAL_CORE AS RIC ON RIC.ID=PATIENT.ID
	LEFT JOIN RT_INDIVIDUAL_CUSTOMER AS CUSTOMER ON CUSTOMER.ID = BILL.CUSTOMER_ID
	-- LEFT JOIN RT_TICKET_VISIT AS VISIT ON VISIT.ID = BILL.VISIT_ID
	LEFT JOIN RT_DATA_PAYORTYPE AS PAYORTYPE ON BILL.PAYOR_TYPE_ID = PAYORTYPE.ID
	LEFT JOIN RT_DATA_ACCOUNT_UNIT PATACCUNIT ON PATACCUNIT.ID= IF(PATIENT.ID IS NULL,BILL.ACC_UNIT_ID  ,PATIENT.ACCUNIT )
	LEFT JOIN `RT_DATA_ACCOUNT_UNIT` AS BILLACCUNIT ON BILLACCUNIT.ID = BILL.`ACC_UNIT_ID`
	LEFT JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=PATIENT.REFERRALTYPE
	LEFT JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=PATIENT.REFERREDBYCONSULTANT
	LEFT JOIN RT_DATA_ITEM_CATEGORY ITMC
		ON ITEM.CATEGORY = ITMC.ID
		LEFT JOIN STORE_STOCK_DETAIL DTL
	ON DTL.ID = DIRECTSALESDETAIL.`STOCKDETAILID`
	LEFT JOIN
	(SELECT SALESDETAILID,TCORE.CREATEDTIME,SALESRETURNDETAIL.RETURNQUANTITY,SALESRETURNDETAIL.RETURNAMOUNT
	,SALESRETURNDETAIL.CLAIMAMOUNT
	FROM RT_TICKET_SALESRETURNDETAIL AS SALESRETURNDETAIL
	  JOIN RT_TICKET_CORE AS TCORE ON TCORE.ID = SALESRETURNDETAIL.ID
	) AS SALESRETURNDETAIL
	ON SALESRETURNDETAIL.SALESDETAILID = DIRECTSALESDETAIL.ID
	AND BILL.REVENUE_DATE > SALESRETURNDETAIL.CREATEDTIME
	LEFT JOIN SYS_ADMIN_TIMEZONE AS TZ ON TZ.TIMEZONE_ID = IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCUNITTIMEZONEID,BILLACCUNIT.ACCUNITTIMEZONEID)

WHERE
	
	
	
	 (DIRECTSALES.WORKORDERSTATUS = 'Goods Delivered' OR DIRECTSALES.WORKORDERSTATUS IS NULL OR DIRECTSALES.WORKORDERSTATUS ='No Work Order Required'  OR DIRECTSALES.WORKORDERSTATUS ='Cancelled')
AND  BILL.REVENUE_DATE BETWEEN DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 3 DAY) AND DATE_ADD(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY)
AND BILL.REVENUE_DATE  >=   CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
AND BILL.REVENUE_DATE <=  CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 23:59:59'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
GROUP BY DIRECTSALESDETAIL.ID,SALESRETURNDETAIL.CREATEDTIME
HAVING
	QUANTITY > 0
)
UNION ALL
(SELECT
	BILL.ID AS BILLID,
	-- IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
	IF(BILLACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
BILLACCUNIT.ACCOUNTUNIT AS BILLED,
	CONVERT_TZ(TCORE.CREATEDTIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) AS BILLDATE,
	-- CONVERT_TZ(TCORE.CREATEDTIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) AS CREATEDDATE,
	-- IF((CONVERT_TZ(TCORE.CREATEDTIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) - CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT',''))) <= 0, 0, CONVERT_TZ(TCORE.CREATEDTIME, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) - CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT',''))) AS DIFFDATE,
	BILL.BILL_NO AS BILLNO,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNO,PATIENT.PATIENTID) AS PATIENTID,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNAME,PATIENT.PATIENTNAME) AS PATIENTNAME,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.AGE,PATIENT.AGE) AS PATIENT_AGE,DATE(RIC.CREATEDTIME) AS REGISTERED_DATE,
	BILL.BILL_TYPE AS VISITTYPE,
	ACCHEAD.ACCOUNTHEAD AS UNIT,
		ITMC.`ITMCGCATEGNAME`  AS 'GROUP1',
	ITEM.SUBCATEGORY AS 'SUBGROUP',
		ITEM.ADITMNAME AS ITEMNAME,
	ITEM.ITEMCODE AS ITEMCODE,
	IF(DIRECTSALES.SALESSTATUS = 'Advance Received',-DIRECTSALESDETAIL.TOTAL,-(SALESRETURNDETAIL.RETURNAMOUNT+SALESRETURNDETAIL.TOTALDISCOUNT)) AS AMOUNT,  -- DIRECTSALESDETAIL.REFUNDAMOUNT updated as SALESRETURNDETAIL.RETURNAMOUNT
	-SALESRETURNDETAIL.RETURNQUANTITY AS QUANTITY,
	-IF(SALESRETURNDETAIL.TOTALDISCOUNT IS NULL, 0, SALESRETURNDETAIL.TOTALDISCOUNT) AS DISCOUNT_AMOUNT,
	IF(DIRECTSALES.SALESSTATUS = 'Advance Received',-(DIRECTSALESDETAIL.TOTAL-IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT)),-SALESRETURNDETAIL.RETURNAMOUNT) AS NET_AMOUNT, -- DIRECTSALESDETAIL.REFUNDAMOUNT updated as SALESRETURNDETAIL.RETURNAMOUNT
	-IF(DIRECTSALESDETAIL.CLAIMAMOUNT IS NULL,0,DIRECTSALESDETAIL.CLAIMAMOUNT) AS PAYOR_AMOUNT,
	IF(DIRECTSALES.SALESSTATUS IN ('Advance Received','Bill Raised'),-(DIRECTSALESDETAIL.TOTAL-IF(DIRECTSALESDETAIL.DISCOUNTAMOUNT IS NULL, 0, DIRECTSALESDETAIL.DISCOUNTAMOUNT) - IF(DIRECTSALESDETAIL.CLAIMAMOUNT IS NULL,0,DIRECTSALESDETAIL.CLAIMAMOUNT)),-(SALESRETURNDETAIL.RETURNAMOUNT - SALESRETURNDETAIL.CLAIMAMOUNT)) AS PATIENT_AMOUNT,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'Self', IF(PAYORTYPE.PAYORCATEGORY ='Cash','Self',PAYORTYPE.PAYORCATEGORY)) AS PAYORTYPE,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'SELF PAYING', PAYORTYPE.PAYORTYP) AS PAYORNAME,
		TAX.VALUE AS CGST,
	TAX.VALUE AS SGST,
	(TAX.VALUE+TAX.VALUE) AS 'GST%',
	ROUND((100/(100+(TAX.VALUE+TAX.VALUE))*((IF(SALESRETURNDETAIL.RETURNQUANTITY IS NULL, 0, SALESRETURNDETAIL.RETURNAMOUNT)) - IF(SALESRETURNDETAIL.TOTALDISCOUNT IS NULL, 0, SALESRETURNDETAIL.TOTALDISCOUNT))),2) AS 'Patient Amount W/O GST',  -- DIRECTSALESDETAIL.REFUNDAMOUNT updated as SALESRETURNDETAIL.RETURNAMOUNT
	ROUND(((100/(100+(TAX.VALUE+TAX.VALUE))*(( IF(SALESRETURNDETAIL.RETURNQUANTITY IS NULL, 0, SALESRETURNDETAIL.RETURNAMOUNT)) - IF(SALESRETURNDETAIL.TOTALDISCOUNT IS NULL, 0, SALESRETURNDETAIL.TOTALDISCOUNT)) * (TAX.VALUE/100))),2) AS 'CGST Value', -- DIRECTSALESDETAIL.REFUNDAMOUNT updated as SALESRETURNDETAIL.RETURNAMOUNT
	ROUND(((100/(100+(TAX.VALUE+TAX.VALUE))*((IF(SALESRETURNDETAIL.RETURNQUANTITY IS NULL, 0, SALESRETURNDETAIL.RETURNAMOUNT)) - IF(SALESRETURNDETAIL.TOTALDISCOUNT IS NULL, 0, SALESRETURNDETAIL.TOTALDISCOUNT)) * (TAX.VALUE/100))),2) AS 'SGST Value', -- DIRECTSALESDETAIL.REFUNDAMOUNT updated as SALESRETURNDETAIL.RETURNAMOUNT
	ITEM.`MANUFACTURERID` AS 'MANUFACTURER',
	DTL.`UNIT_PRICE` AS 'COSTPRICE',
	IF(RDRT.REFERRALTYPENAME IS NULL, '', RDRT.REFERRALTYPENAME) AS REFERRAL_TYPE,
	PATIENT.REFERRALTYPEHIDDEN AS REFERRAL_VALUE,IF(RDRB.REFERREDBYNAME IS NULL, '', RDRB.REFERREDBYNAME) AS REFERRAL_BY
FROM
	BILL_PATIENT_BILL AS BILL
	INNER JOIN BILL_SERVICE_DETAIL AS DETAIL ON DETAIL.BILL_ID = BILL.ID AND DETAIL.SCREEN = 4
	-- AND DETAIL.BILL_STATUS NOT IN (4,5)
	INNER JOIN RT_DATA_CHARGE_DETAIL AS CHARGEDETAIL ON CHARGEDETAIL.ID = DETAIL.CHARGEDETAIL_ID
	INNER JOIN RT_DATA_CORE AS CORE ON CORE.ID = CHARGEDETAIL.ID
	INNER JOIN RT_DATA_CHARGE AS CHARGE ON CHARGE.ID = CORE.PARENT_TICKET_ID
	INNER JOIN RT_DATA_ACCOUNT_HEAD AS ACCHEAD ON ACCHEAD.ID = CHARGE.CHARGACCOUNTHEAD
	INNER JOIN RT_TICKET_DIRECTSALES AS DIRECTSALES ON DIRECTSALES.ID = DETAIL.SERVICE_ID
	INNER JOIN RT_TICKET_DIRECTSALESDETAIL AS DIRECTSALESDETAIL ON DIRECTSALESDETAIL.SALESID = DIRECTSALES.ID
	INNER JOIN RT_TICKET_SALESRETURNDETAIL AS SALESRETURNDETAIL ON SALESRETURNDETAIL.SALESDETAILID = DIRECTSALESDETAIL.ID
	INNER JOIN RT_TICKET_CORE AS TCORE ON TCORE.ID = SALESRETURNDETAIL.ID
	INNER JOIN RT_DATA_ITEM AS ITEM ON ITEM.ID = DIRECTSALESDETAIL.ITEMID
	LEFT JOIN RT_DATA_TAX AS TAX ON DIRECTSALESDETAIL.TAXTYPE = TAX.ID
	-- LEFT JOIN RT_DATA_TAX AS TAX ON ITEM.SGST = TAX.ID
	LEFT JOIN RT_INDIVIDUAL_PATIENT AS PATIENT ON PATIENT.ID = BILL.PATIENT_ID
	LEFT JOIN RT_INDIVIDUAL_CORE AS RIC ON RIC.ID=PATIENT.ID
	LEFT JOIN RT_INDIVIDUAL_CUSTOMER AS CUSTOMER ON CUSTOMER.ID = BILL.CUSTOMER_ID
	LEFT JOIN RT_TICKET_VISIT AS VISIT ON VISIT.ID = BILL.VISIT_ID
	LEFT JOIN RT_DATA_PAYORTYPE AS PAYORTYPE ON BILL.PAYOR_TYPE_ID = PAYORTYPE.ID
	LEFT JOIN RT_DATA_ACCOUNT_UNIT PATACCUNIT ON PATACCUNIT.ID= IF(PATIENT.ID IS NULL,BILL.ACC_UNIT_ID  ,PATIENT.ACCUNIT )
	LEFT JOIN `RT_DATA_ACCOUNT_UNIT` AS BILLACCUNIT ON BILLACCUNIT.ID = BILL.`ACC_UNIT_ID`
	LEFT JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=PATIENT.REFERRALTYPE
	LEFT JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=PATIENT.REFERREDBYCONSULTANT
	LEFT JOIN RT_DATA_ITEM_CATEGORY ITMC
		ON ITEM.CATEGORY = ITMC.ID
	LEFT JOIN STORE_STOCK_DETAIL DTL
	ON DTL.ID = DIRECTSALESDETAIL.`STOCKDETAILID`	
	LEFT JOIN SYS_ADMIN_TIMEZONE AS TZ ON TZ.TIMEZONE_ID = IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCUNITTIMEZONEID,BILLACCUNIT.ACCUNITTIMEZONEID)
WHERE
	
	
	
	
	(DIRECTSALES.WORKORDERSTATUS = 'Goods Delivered' OR DIRECTSALES.WORKORDERSTATUS IS NULL OR DIRECTSALES.WORKORDERSTATUS ='No Work Order Required' OR DIRECTSALES.WORKORDERSTATUS ='Cancelled')
AND 
 TCORE.CREATEDTIME BETWEEN DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 3 DAY) AND DATE_ADD(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY)
AND TCORE.CREATEDTIME  >=   CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
AND TCORE.CREATEDTIME <=  CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 23:59:59'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
	AND BILL.REVENUE_DATE IS NOT NULL
        AND  BILL.REVENUE_DATE <= TCORE.CREATEDTIME
	AND DIRECTSALESDETAIL.RETURNQUANTITY IS NOT NULL
)
UNION ALL
(
SELECT
	BILL.ID AS BILLID,
	-- IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
	IF(BILLACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.ACCUNITTIMEZONEID=9,IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCOUNTUNIT,BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT),BILLACCUNIT.ACCOUNTUNIT) AS BRANCH,
	BILLACCUNIT.ACCOUNTUNIT AS BILLED,
	CONVERT_TZ(BILL.REVENUE_DATE, '+00:00', REPLACE(TZ.GMT_ID,'GMT','')) AS BILLDATE,
	BILL.BILL_NO AS BILLNO,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNO,PATIENT.PATIENTID) AS PATIENTID,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.CUSTOMERNAME,PATIENT.PATIENTNAME) AS PATIENTNAME,
	IF(BILL.PATIENT_ID IS NULL,CUSTOMER.AGE,PATIENT.AGE) AS PATIENT_AGE,DATE(RIC.CREATEDTIME) AS REGISTERED_DATE,
	BILL.BILL_TYPE AS VISITTYPE,
	ACCHEAD.ACCOUNTHEAD AS UNIT,
	 SUB.`ACCOUNTSUBHEAD`  AS 'GROUP1',
	 LED.`LEDGER` AS 'SUBGROUP',
	CHARGE.CHARGE AS ITEMNAME,
	CHARGE.CHARGECODE AS ITEMCODE,
	-DETAIL.SERVICE_AMOUNT AS AMOUNT,
	-DETAIL.QUANTITY AS QUANTITY,
	-DETAIL.SERVICE_DISCOUNT AS DISCOUNT_AMOUNT,
	-(DETAIL.SERVICE_AMOUNT - DETAIL.SERVICE_DISCOUNT) AS NET_AMOUNT,
	-(DETAIL.CLAIM_AMOUNT) AS PAYOR_AMOUNT,
	-(DETAIL.SERVICE_AMOUNT - DETAIL.SERVICE_DISCOUNT - DETAIL.CLAIM_AMOUNT) AS PATIENT_AMOUNT,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'Self', IF(PAYORTYPE.PAYORCATEGORY ='Cash','Self',PAYORTYPE.PAYORCATEGORY)) AS PAYORTYPE,
	IF(PAYORTYPE.PAYORCATEGORY IS NULL, 'SELF PAYING', PAYORTYPE.PAYORTYP) AS PAYORNAME,
0 AS CGST,
	0 AS SGST,
		0 AS 'GST_PERCENTAGE',
	0 AS 'Patient Amount W/O GST',
	0 AS 'CGST Value',
	0 AS 'SGST Value',
	'' AS 'MANUFACTURER',
	'' AS 'COSTPRICE',
	IF(RDRT.REFERRALTYPENAME IS NULL, '', RDRT.REFERRALTYPENAME) AS REFERRAL_TYPE,
	PATIENT.REFERRALTYPEHIDDEN AS REFERRAL_VALUE,IF(RDRB.REFERREDBYNAME IS NULL, '', RDRB.REFERREDBYNAME) AS REFERRAL_BY

FROM
	BILL_PATIENT_BILL AS BILL
	INNER JOIN BILL_SERVICE_DETAIL AS DETAIL ON DETAIL.BILL_ID = BILL.ID
	AND DETAIL.PACKAGE_ID IS NULL AND DETAIL.SCREEN != 4 -- AND DETAIL.BILL_STATUS NOT IN (4,5)
	INNER JOIN RT_DATA_CHARGE_DETAIL AS CHARGEDETAIL ON CHARGEDETAIL.ID = DETAIL.CHARGEDETAIL_ID
	INNER JOIN RT_DATA_CORE AS CORE ON CORE.ID = CHARGEDETAIL.ID
	INNER JOIN RT_DATA_CHARGE AS CHARGE ON CHARGE.ID = CORE.PARENT_TICKET_ID
        INNER JOIN RT_DATA_ACCOUNTSUBHEAD AS SUB ON SUB.ID = CHARGE.ACCSUBHEAD
	INNER JOIN RT_DATA_ACCOUNT_HEAD AS ACCHEAD ON ACCHEAD.ID = CHARGE.CHARGACCOUNTHEAD
	LEFT JOIN RT_INDIVIDUAL_PATIENT AS PATIENT ON PATIENT.ID = BILL.PATIENT_ID
	LEFT JOIN RT_INDIVIDUAL_CUSTOMER AS CUSTOMER ON CUSTOMER.ID = BILL.CUSTOMER_ID
	LEFT JOIN `RT_DATA_LEDGER` LED ON LED.ID=CHARGE.CHARGELEDGER
		LEFT JOIN RT_INDIVIDUAL_CORE AS RIC ON RIC.ID=PATIENT.ID
	-- LEFT JOIN RT_TICKET_VISIT AS VISIT ON VISIT.ID = BILL.VISIT_ID
	LEFT JOIN RT_DATA_PAYORTYPE AS PAYORTYPE ON BILL.PAYOR_TYPE_ID = PAYORTYPE.ID
	LEFT JOIN RT_DATA_ACCOUNT_UNIT PATACCUNIT ON PATACCUNIT.ID= IF(PATIENT.ID IS NULL,BILL.ACC_UNIT_ID  ,PATIENT.ACCUNIT )
	LEFT JOIN `RT_DATA_ACCOUNT_UNIT` AS BILLACCUNIT ON BILLACCUNIT.ID = BILL.`ACC_UNIT_ID`
	LEFT JOIN SYS_ADMIN_TIMEZONE AS TZ ON TZ.TIMEZONE_ID = IF(PATACCUNIT.STATUS != 0,PATACCUNIT.ACCUNITTIMEZONEID,BILLACCUNIT.ACCUNITTIMEZONEID)
		LEFT JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=PATIENT.REFERRALTYPE
	LEFT JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=PATIENT.REFERREDBYCONSULTANT
	
WHERE
	  BILL.REVENUE_DATE BETWEEN DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 3 DAY) AND DATE_ADD(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY)
AND BILL.REVENUE_DATE  >=   CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 00:00:00'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
AND BILL.REVENUE_DATE <=  CONVERT_TZ(DATE_SUB(CONCAT(DATE(CURDATE()),' 23:59:59'), INTERVAL 1 DAY),REPLACE(TZ.GMT_ID,'GMT',''),'+00:00')
 	AND ((DETAIL.BILL_STATUS = 4 OR DETAIL.BILL_STATUS = 2) AND DETAIL.SERVICE_ID LIKE 'PKG-%')
	GROUP BY DETAIL.ID
	)
ORDER BY
	BILLID
) AS A
INNER JOIN `RT_ORGANIZATION_CORE` ORGCRE
ON ORGCRE.`ORGANIZATIONNAME`  = A.BRANCH
WHERE ORGCRE.STATUS = 1
