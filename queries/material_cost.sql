TRUNCATE TABLE materialcost;
INSERT INTO materialcost(entity,branch,pharmacy_revenue,optical_revenue,surgery_revenue,mtd_revenue,pharmacy_revenue_perc,opticals_revenue_perc,surgery_revenue_perc,pharmacy_cogs,opticals_cogs,surgery_cogs,mtd_cogs,pharmacy_cogs_perc,opticals_cogs_perc,surgery_cogs_perc,Consump,today_date)
SELECT
	entity
	, branch
	, ROUND(IF((SUM(pharmacyrevenue)/100000)=0 OR NULL,0,SUM(pharmacyrevenue)/100000),1) AS pharmacy_revenue
	, ROUND(IF((SUM(opticalsrevenue)/100000)=0 OR NULL,0,SUM(opticalsrevenue)/100000),1) AS optical_revenue
	, ROUND(IF((SUM(surgeryrevenue)/100000)=0 OR NULL,0,SUM(surgeryrevenue)/100000),1) AS surgery_revenue
	, ROUND(IF((SUM(mtdrevenue)/100000)=0 OR NULL,0,SUM(mtdrevenue)/100000),1) AS mtd_revenue
	, CONCAT(ROUND(IF((SUM(pharmacyrevenueperc))=0 OR NULL,0,SUM(pharmacyrevenueperc)),0),'%') AS pharmacy_revenue_perc
	, CONCAT(ROUND(IF((SUM(opticalsrevenueperc))=0 OR NULL,0,SUM(opticalsrevenueperc)),0),'%') AS opticals_revenue_perc
	, CONCAT(ROUND(IF((SUM(surgeryrevenueperc))=0 OR NULL,0,SUM(surgeryrevenueperc)),0),'%') AS surgery_revenue_perc
	, ROUND(IF((SUM(pharmacycogs)/100000)=0 OR NULL,0,SUM(pharmacycogs)/100000),1) AS pharmacy_cogs
	, ROUND(IF((SUM(opticalscogs)/100000)=0 OR NULL,0,SUM(opticalscogs)/100000),1) AS opticals_cogs
	, ROUND(IF((SUM(surgerycogs)/100000)=0 OR NULL,0,SUM(surgerycogs)/100000),1) AS surgery_cogs
	, ROUND(IF((SUM(mtdcogs)/100000)= 0 OR NULL,0,SUM(mtdcogs)/100000),1) AS mtd_cogs
	, IFNULL(CONCAT(ROUND((((SUM(pharmacycogs)/100000)/(SUM(pharmacyrevenue)/100000))*100),0),'%'),0) AS pharmacy_cogs_perc
	, IFNULL(CONCAT(ROUND((((SUM(opticalscogs)/100000)/(SUM(opticalsrevenue)/100000))*100),0),'%'),0) AS optical_cogs_perc
	, IFNULL(CONCAT(ROUND((((SUM(surgerycogs)/100000)/(SUM(surgeryrevenue)/100000))*100),0),'%'),0) AS surgery_cogs_perc
,CONCAT(ROUND(((SUM(pharmacyrevenueperc)*(IFNULL((SUM(pharmacycogs)/SUM(pharmacyrevenue)),0))+SUM(opticalsrevenueperc)*(IFNULL((SUM(opticalscogs)/SUM(opticalsrevenue)),0))+SUM(surgeryrevenueperc)*(IFNULL((SUM(surgerycogs)/SUM(surgeryrevenue)),0)))/100)*100,1), '%') AS Consump
	,DATE(CURDATE()) AS today_date
 FROM (
(
SELECT entity, branch,
IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy))AS pharmacyrevenue,
IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalsrevenue,
 IF((SUM(laboratory+surgery+consultation+others))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others)) AS surgeryrevenue,
 IF((SUM(laboratory+surgery+consultation+others+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others+pharmacy+opticals)) AS MTDrevenue
, IF(((SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS pharmacyrevenueperc
, IF(((SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS opticalsrevenueperc
, IF(((SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS surgeryrevenueperc
, 0 AS pharmacycogs
, 0 AS opticalscogs
, 0 AS surgerycogs
, 0 AS mtdcogs
, 0 AS pharmacycogsperc
, 0 AS opticalscogsperc
, 0 AS surgerycogsperc
FROM revenue_report
WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
GROUP BY entity, branch

)

UNION ALL

(
SELECT entity, branch,
	0 AS pharmacyrevenue
	, 0 AS opticalsrevenue
	, 0 AS surgeryrevenue
	, 0 AS mtdrevenue
	, 0 AS pharmacyrevenueperc
	, 0 AS opticalsrevenueperc
	, 0 AS surgeryrevenueperc
	, IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy)) AS pharmacycogs,
    IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalscogs,
    IF((SUM(laboratory+operation_theatre))=0 OR NULL,0,SUM(laboratory+operation_theatre)) AS surgerycogs,
	IF((SUM(laboratory+operation_theatre+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+operation_theatre+pharmacy+opticals)) AS MTDcogs

, 0 AS pharmacycogsperc
, 0 AS opticalscogsperc
, 0 AS surgerycogsperc
FROM cogs_report
WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
GROUP BY entity, branch
)
) A WHERE branch NOT IN('NAB','UGD')
GROUP BY
entity, branch

UNION ALL
SELECT " " AS entity, "" AS branch," " AS pharmacy_revenue,"" AS optical_revenue,
"" AS surgery_revenue ,"" AS mtd_revenue,"" AS pharmacy_revenue_perc,
"" AS opticals_revenue_perc ,"" AS surgery_revenue_perc, "" AS pharmacy_cogs,
"" AS opticals_cogs,"" AS surgery_cogs,"" AS md_cogs ,"" AS pharmacy_cogs_perc,"" AS optical_cogs_perc ,
"" AS surgery_cogs_perc ,"" AS consump,"" AS today_date FROM cogs_report
 GROUP BY
 pharmacy_revenue

UNION ALL

SELECT entity,"Total" AS branch,ROUND(SUM(pharmacy_revenue),2) AS pharmacy_revenue,ROUND(SUM(optical_revenue),2) AS optical_revenue,
ROUND(SUM(surgery_revenue),2) AS surgery_revenue ,ROUND(SUM(mtd_revenue),2) AS mtd_revenue,
CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%')
 END AS pharmacy_revenue_perc
 ,
CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%')
 END AS opticals_revenue_perc
 ,
CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')
 END AS surgery_revenue_perc ,
 ROUND(SUM(pharmacy_cogs),2) AS pharmacy_cogs ,ROUND(SUM(opticals_cogs),2) AS opticals_cogs,ROUND(SUM(surgery_cogs),2) AS surgery_cogs,
 ROUND(SUM(mtd_cogs),2) AS mtd_cogs,
 CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%')
 END AS pharmacy_cogs_perc
 ,  CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%')
 END AS optical_cogs_perc
  ,  CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%')
 END AS surgery_cogs_perc
 , CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((((CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')))/100),1),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((((CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')))/100),1),'%')
 END AS Consump ,DATE(CURDATE()) AS today_date

FROM (SELECT
	entity
	, branch
	, ROUND(IF((SUM(pharmacyrevenue)/100000)=0 OR NULL,0,SUM(pharmacyrevenue)/100000),1) AS pharmacy_revenue
	, ROUND(IF((SUM(opticalsrevenue)/100000)=0 OR NULL,0,SUM(opticalsrevenue)/100000),1) AS optical_revenue
	, ROUND(IF((SUM(surgeryrevenue)/100000)=0 OR NULL,0,SUM(surgeryrevenue)/100000),1) AS surgery_revenue
	, ROUND(IF((SUM(mtdrevenue)/100000)=0 OR NULL,0,SUM(mtdrevenue)/100000),1) AS mtd_revenue
	, CONCAT(ROUND(IF((SUM(pharmacyrevenueperc))=0 OR NULL,0,SUM(pharmacyrevenueperc)),0),'%') AS pharmacy_revenue_perc
	, CONCAT(ROUND(IF((SUM(opticalsrevenueperc))=0 OR NULL,0,SUM(opticalsrevenueperc)),0),'%') AS opticals_revenue_perc
	, CONCAT(ROUND(IF((SUM(surgeryrevenueperc))=0 OR NULL,0,SUM(surgeryrevenueperc)),0),'%') AS surgery_revenue_perc
	, ROUND(IF((SUM(pharmacycogs)/100000)=0 OR NULL,0,SUM(pharmacycogs)/100000),1) AS pharmacy_cogs
	, ROUND(IF((SUM(opticalscogs)/100000)=0 OR NULL,0,SUM(opticalscogs)/100000),1) AS opticals_cogs
	, ROUND(IF((SUM(surgerycogs)/100000)=0 OR NULL,0,SUM(surgerycogs)/100000),1) AS surgery_cogs
	, ROUND(IF((SUM(mtdcogs)/100000)= 0 OR NULL,0,SUM(mtdcogs)/100000),1) AS mtd_cogs
	, IFNULL(CONCAT(ROUND((((SUM(pharmacycogs)/100000)/(SUM(pharmacyrevenue)/100000))*100),0),'%'),0) AS pharmacy_cogs_perc
	, IFNULL(CONCAT(ROUND((((SUM(opticalscogs)/100000)/(SUM(opticalsrevenue)/100000))*100),0),'%'),0) AS optical_cogs_perc
	, IFNULL(CONCAT(ROUND((((SUM(surgerycogs)/100000)/(SUM(surgeryrevenue)/100000))*100),0),'%'),0) AS surgery_cogs_perc
,CONCAT(ROUND(((SUM(pharmacyrevenueperc)*(IFNULL((SUM(pharmacycogs)/SUM(pharmacyrevenue)),0))+SUM(opticalsrevenueperc)*(IFNULL((SUM(opticalscogs)/SUM(opticalsrevenue)),0))+SUM(surgeryrevenueperc)*(IFNULL((SUM(surgerycogs)/SUM(surgeryrevenue)),0)))/100)*100,1), '%') AS Consump
	,DATE(CURDATE()) AS today_date
 FROM (
(
SELECT entity, branch,
IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy))AS pharmacyrevenue,
IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalsrevenue,
 IF((SUM(laboratory+surgery+consultation+others))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others)) AS surgeryrevenue,
 IF((SUM(laboratory+surgery+consultation+others+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others+pharmacy+opticals)) AS MTDrevenue
, IF(((SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS pharmacyrevenueperc
, IF(((SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS opticalsrevenueperc
, IF(((SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS surgeryrevenueperc
, 0 AS pharmacycogs
, 0 AS opticalscogs
, 0 AS surgerycogs
, 0 AS mtdcogs
, 0 AS pharmacycogsperc
, 0 AS opticalscogsperc
, 0 AS surgerycogsperc
FROM revenue_report
WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
GROUP BY entity, branch

)
UNION ALL
(
SELECT entity, branch,
	0 AS pharmacyrevenue
	, 0 AS opticalsrevenue
	, 0 AS surgeryrevenue
	, 0 AS mtdrevenue
	, 0 AS pharmacyrevenueperc
	, 0 AS opticalsrevenueperc
	, 0 AS surgeryrevenueperc
	, IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy)) AS pharmacycogs,
    IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalscogs,
    IF((SUM(laboratory+operation_theatre))=0 OR NULL,0,SUM(laboratory+operation_theatre)) AS surgerycogs,
	IF((SUM(laboratory+operation_theatre+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+operation_theatre+pharmacy+opticals)) AS MTDcogs

, 0 AS pharmacycogsperc
, 0 AS opticalscogsperc
, 0 AS surgerycogsperc
FROM cogs_report
WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
GROUP BY entity, branch
)
) A WHERE branch NOT IN('NAB','UGD')
GROUP BY
entity, branch) B

GROUP BY
entity

UNION ALL
SELECT " " AS entity, "" AS branch," " AS pharmacy_revenue,"" AS optical_revenue,
"" AS surgery_revenue ,"" AS mtd_revenue,"" AS pharmacy_revenue_perc,
"" AS opticals_revenue_perc ,"" AS surgery_revenue_perc, "" AS pharmacy_cogs,
"" AS opticals_cogs,"" AS surgery_cogs,"" AS md_cogs ,"" AS pharmacy_cogs_perc,"" AS optical_cogs_perc ,
"" AS surgery_cogs_perc ,"" AS consump,"" AS today_date FROM cogs_report
 GROUP BY
 pharmacy_revenue

UNION ALL

SELECT "Total" AS entity, " " AS branch,ROUND(SUM(pharmacy_revenue),2) AS pharmacy_revenue,
ROUND(SUM(optical_revenue),2) AS optical_revenue,
ROUND(SUM(surgery_revenue),2) AS surgery_revenue ,ROUND(SUM(mtd_revenue),2) AS mtd_revenue,
CONCAT(SUM(pharmacy_revenue_perc)/2,'%') AS pharmacy_revenue_perc,
CONCAT(SUM(opticals_revenue_perc)/2,'%') AS opticals_revenue_perc,
CONCAT(SUM(surgery_revenue_perc)/2,'%') AS surgery_revenue_perc,
ROUND(SUM(pharmacy_cogs),2) AS pharmacy_cogs,ROUND(SUM(opticals_cogs),2) AS opticals_cogs,ROUND(SUM(surgery_cogs),2) AS surgery_cogs ,ROUND(SUM(mtd_cogs),2) AS mtd_cogs,
CONCAT(SUM(pharmacy_cogs_perc)/2,'%') AS pharmacy_cogs_perc,
CONCAT(SUM(optical_cogs_perc)/2,'%') AS optical_cogs_perc,
CONCAT(SUM(surgery_cogs_perc)/2,'%') AS surgery_cogs_perc,
CONCAT((SUM(Consump)/2),'%') AS Consump
,DATE(CURDATE()) AS today_date
FROM

(SELECT entity,branch,SUM(pharmacy_revenue) AS pharmacy_revenue,SUM(optical_revenue) AS optical_revenue,
SUM(surgery_revenue) AS surgery_revenue ,SUM(mtd_revenue) AS mtd_revenue,
CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%')
 END AS pharmacy_revenue_perc
 ,
CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%')
 END AS opticals_revenue_perc
 ,
CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')
 END AS surgery_revenue_perc ,
 SUM(pharmacy_cogs) AS pharmacy_cogs ,SUM(opticals_cogs) AS opticals_cogs,SUM(surgery_cogs) AS surgery_cogs,
 SUM(mtd_cogs) AS mtd_cogs,
 CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%')
 END AS pharmacy_cogs_perc
 ,  CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%')
 END AS optical_cogs_perc
  ,  CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%')
 END AS surgery_cogs_perc
 , CASE
WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((((CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')))/100),0),'%')
WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((((CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')))/100),0),'%')
 END AS Consump ,DATE(CURDATE()) AS today_date

FROM (SELECT
	entity
	, branch
	, ROUND(IF((SUM(pharmacyrevenue)/100000)=0 OR NULL,0,SUM(pharmacyrevenue)/100000),1) AS pharmacy_revenue
	, ROUND(IF((SUM(opticalsrevenue)/100000)=0 OR NULL,0,SUM(opticalsrevenue)/100000),1) AS optical_revenue
	, ROUND(IF((SUM(surgeryrevenue)/100000)=0 OR NULL,0,SUM(surgeryrevenue)/100000),1) AS surgery_revenue
	, ROUND(IF((SUM(mtdrevenue)/100000)=0 OR NULL,0,SUM(mtdrevenue)/100000),1) AS mtd_revenue
	, CONCAT(ROUND(IF((SUM(pharmacyrevenueperc))=0 OR NULL,0,SUM(pharmacyrevenueperc)),0),'%') AS pharmacy_revenue_perc
	, CONCAT(ROUND(IF((SUM(opticalsrevenueperc))=0 OR NULL,0,SUM(opticalsrevenueperc)),0),'%') AS opticals_revenue_perc
	, CONCAT(ROUND(IF((SUM(surgeryrevenueperc))=0 OR NULL,0,SUM(surgeryrevenueperc)),0),'%') AS surgery_revenue_perc
	, ROUND(IF((SUM(pharmacycogs)/100000)=0 OR NULL,0,SUM(pharmacycogs)/100000),1) AS pharmacy_cogs
	, ROUND(IF((SUM(opticalscogs)/100000)=0 OR NULL,0,SUM(opticalscogs)/100000),1) AS opticals_cogs
	, ROUND(IF((SUM(surgerycogs)/100000)=0 OR NULL,0,SUM(surgerycogs)/100000),1) AS surgery_cogs
	, ROUND(IF((SUM(mtdcogs)/100000)= 0 OR NULL,0,SUM(mtdcogs)/100000),1) AS mtd_cogs
	, IFNULL(CONCAT(ROUND((((SUM(pharmacycogs)/100000)/(SUM(pharmacyrevenue)/100000))*100),0),'%'),0) AS pharmacy_cogs_perc
	, IFNULL(CONCAT(ROUND((((SUM(opticalscogs)/100000)/(SUM(opticalsrevenue)/100000))*100),0),'%'),0) AS optical_cogs_perc
	, IFNULL(CONCAT(ROUND((((SUM(surgerycogs)/100000)/(SUM(surgeryrevenue)/100000))*100),0),'%'),0) AS surgery_cogs_perc
,CONCAT(ROUND(((SUM(pharmacyrevenueperc)*(IFNULL((SUM(pharmacycogs)/SUM(pharmacyrevenue)),0))+SUM(opticalsrevenueperc)*(IFNULL((SUM(opticalscogs)/SUM(opticalsrevenue)),0))+SUM(surgeryrevenueperc)*(IFNULL((SUM(surgerycogs)/SUM(surgeryrevenue)),0)))/100)*100,1), '%') AS Consump
	,DATE(CURDATE()) AS today_date
 FROM (
(
SELECT entity, branch,
IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy))AS pharmacyrevenue,
IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalsrevenue,
 IF((SUM(laboratory+surgery+consultation+others))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others)) AS surgeryrevenue,
 IF((SUM(laboratory+surgery+consultation+others+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others+pharmacy+opticals)) AS MTDrevenue
, IF(((SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS pharmacyrevenueperc
, IF(((SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS opticalsrevenueperc
, IF(((SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS surgeryrevenueperc
, 0 AS pharmacycogs
, 0 AS opticalscogs
, 0 AS surgerycogs
, 0 AS mtdcogs
, 0 AS pharmacycogsperc
, 0 AS opticalscogsperc
, 0 AS surgerycogsperc
FROM revenue_report
WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
GROUP BY entity, branch

)
UNION ALL
(
SELECT entity, branch,
	0 AS pharmacyrevenue
	, 0 AS opticalsrevenue
	, 0 AS surgeryrevenue
	, 0 AS mtdrevenue
	, 0 AS pharmacyrevenueperc
	, 0 AS opticalsrevenueperc
	, 0 AS surgeryrevenueperc
	, IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy)) AS pharmacycogs,
    IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalscogs,
    IF((SUM(laboratory+operation_theatre))=0 OR NULL,0,SUM(laboratory+operation_theatre)) AS surgerycogs,
	IF((SUM(laboratory+operation_theatre+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+operation_theatre+pharmacy+opticals)) AS MTDcogs

, 0 AS pharmacycogsperc
, 0 AS opticalscogsperc
, 0 AS surgerycogsperc
FROM cogs_report
WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
GROUP BY entity, branch
)
) A WHERE branch NOT IN('NAB','UGD')
GROUP BY
entity, branch) B

GROUP BY
entity) c



--
-- SELECT
-- 	entity
-- 	, branch
-- 	, ROUND(IF((SUM(pharmacyrevenue)/100000)=0 OR NULL,0,SUM(pharmacyrevenue)/100000),1) AS pharmacy_revenue
-- 	, ROUND(IF((SUM(opticalsrevenue)/100000)=0 OR NULL,0,SUM(opticalsrevenue)/100000),1) AS optical_revenue
-- 	, ROUND(IF((SUM(surgeryrevenue)/100000)=0 OR NULL,0,SUM(surgeryrevenue)/100000),1) AS surgery_revenue
-- 	, ROUND(IF((SUM(mtdrevenue)/100000)=0 OR NULL,0,SUM(mtdrevenue)/100000),1) AS mtd_revenue
-- 	, CONCAT(ROUND(IF((SUM(pharmacyrevenueperc))=0 OR NULL,0,SUM(pharmacyrevenueperc)),0),'%') AS pharmacy_revenue_perc
-- 	, CONCAT(ROUND(IF((SUM(opticalsrevenueperc))=0 OR NULL,0,SUM(opticalsrevenueperc)),0),'%') AS opticals_revenue_perc
-- 	, CONCAT(ROUND(IF((SUM(surgeryrevenueperc))=0 OR NULL,0,SUM(surgeryrevenueperc)),0),'%') AS surgery_revenue_perc
-- 	, ROUND(IF((SUM(pharmacycogs)/100000)=0 OR NULL,0,SUM(pharmacycogs)/100000),1) AS pharmacy_cogs
-- 	, ROUND(IF((SUM(opticalscogs)/100000)=0 OR NULL,0,SUM(opticalscogs)/100000),1) AS opticals_cogs
-- 	, ROUND(IF((SUM(surgerycogs)/100000)=0 OR NULL,0,SUM(surgerycogs)/100000),1) AS surgery_cogs
-- 	, ROUND(IF((SUM(mtdcogs)/100000)= 0 OR NULL,0,SUM(mtdcogs)/100000),1) AS mtd_cogs
-- 	, IFNULL(CONCAT(ROUND((((SUM(pharmacycogs)/100000)/(SUM(pharmacyrevenue)/100000))*100),0),'%'),0) AS pharmacy_cogs_perc
-- 	, IFNULL(CONCAT(ROUND((((SUM(opticalscogs)/100000)/(SUM(opticalsrevenue)/100000))*100),0),'%'),0) AS revenue_cogs_perc
-- 	, IFNULL(CONCAT(ROUND((((SUM(surgerycogs)/100000)/(SUM(surgeryrevenue)/100000))*100),0),'%'),0) AS surgery_cogs_perc
-- ,CONCAT(ROUND(((SUM(pharmacyrevenueperc)*(IFNULL((SUM(pharmacycogs)/SUM(pharmacyrevenue)),0))+SUM(opticalsrevenueperc)*(IFNULL((SUM(opticalscogs)/SUM(opticalsrevenue)),0))+SUM(surgeryrevenueperc)*(IFNULL((SUM(surgerycogs)/SUM(surgeryrevenue)),0)))/100)*100,1), '%') AS Consump
-- 	,DATE(CURDATE()) AS today_date
--  FROM (
-- (
-- SELECT entity, branch,
-- IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy))AS pharmacyrevenue,
-- IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalsrevenue,
--  IF((SUM(laboratory+surgery+consultation+others))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others)) AS surgeryrevenue,
--  IF((SUM(laboratory+surgery+consultation+others+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others+pharmacy+opticals)) AS MTDrevenue
-- , IF(((SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS pharmacyrevenueperc
-- , IF(((SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS opticalsrevenueperc
-- , IF(((SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS surgeryrevenueperc
-- , 0 AS pharmacycogs
-- , 0 AS opticalscogs
-- , 0 AS surgerycogs
-- , 0 AS mtdcogs
-- , 0 AS pharmacycogsperc
-- , 0 AS opticalscogsperc
-- , 0 AS surgerycogsperc
-- FROM revenue_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
--
-- )
--
-- UNION ALL
--
-- (
-- SELECT entity, branch,
-- 	0 AS pharmacyrevenue
-- 	, 0 AS opticalsrevenue
-- 	, 0 AS surgeryrevenue
-- 	, 0 AS mtdrevenue
-- 	, 0 AS pharmacyrevenueperc
-- 	, 0 AS opticalsrevenueperc
-- 	, 0 AS surgeryrevenueperc
-- 	, IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy)) AS pharmacycogs,
--     IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalscogs,
--     IF((SUM(laboratory+operation_theatre))=0 OR NULL,0,SUM(laboratory+operation_theatre)) AS surgerycogs,
-- 	IF((SUM(laboratory+operation_theatre+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+operation_theatre+pharmacy+opticals)) AS MTDcogs
--
-- , 0 AS pharmacycogsperc
-- , 0 AS opticalscogsperc
-- , 0 AS surgerycogsperc
-- FROM cogs_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
-- )
-- ) A WHERE branch NOT IN('NAB','UGD')
-- GROUP BY
-- entity, branch
--
-- UNION ALL
-- SELECT " " AS entity, "" AS branch," " AS pharmacy_revenue,"" AS optical_revenue,
-- "" AS surgery_revenue ,"" AS mtd_revenue,"" AS pharmacy_revenue_perc,
-- "" AS opticals_revenue_perc ,"" AS surgery_revenue_perc, "" AS pharmacy_cogs,
-- "" AS opticals_cogs,"" AS surgery_cogs,"" AS md_cogs ,"" AS pharmacy_cogs_perc,"" AS optical_cogs_perc ,
-- "" AS surgery_cogs_perc ,"" AS consump,"" AS today_date FROM cogs_report
--  GROUP BY
--  pharmacy_revenue
--
-- UNION ALL
--
-- SELECT entity,"Total" AS branch,ROUND(SUM(pharmacy_revenue),2) AS pharmacy_revenue,ROUND(SUM(optical_revenue),2) AS optical_revenue,
-- ROUND(SUM(surgery_revenue),2) AS surgery_revenue ,ROUND(SUM(mtd_revenue),2) AS mtd_revenue,
-- CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%')
--  END AS pharmacy_revenue_perc
--  ,
-- CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%')
--  END AS opticals_revenue_perc
--  ,
-- CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')
--  END AS surgery_revenue_perc ,
--  ROUND(SUM(pharmacy_cogs),2) AS pharmacy_cogs ,ROUND(SUM(opticals_cogs),2) AS opticals_cogs,ROUND(SUM(surgery_cogs),2) AS surgery_cogs,
--  ROUND(SUM(mtd_cogs),2) AS mtd_cogs,
--  CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%')
--  END AS pharmacy_cogs_perc
--  ,  CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%')
--  END AS optical_cogs_perc
--   ,  CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%')
--  END AS surgery_cogs_perc
--  , CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((((CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')))/100),1),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((((CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')))/100),1),'%')
--  END AS Consump ,DATE(CURDATE()) AS today_date
--
-- FROM (SELECT
-- 	entity
-- 	, branch
-- 	, ROUND(IF((SUM(pharmacyrevenue)/100000)=0 OR NULL,0,SUM(pharmacyrevenue)/100000),1) AS pharmacy_revenue
-- 	, ROUND(IF((SUM(opticalsrevenue)/100000)=0 OR NULL,0,SUM(opticalsrevenue)/100000),1) AS optical_revenue
-- 	, ROUND(IF((SUM(surgeryrevenue)/100000)=0 OR NULL,0,SUM(surgeryrevenue)/100000),1) AS surgery_revenue
-- 	, ROUND(IF((SUM(mtdrevenue)/100000)=0 OR NULL,0,SUM(mtdrevenue)/100000),1) AS mtd_revenue
-- 	, CONCAT(ROUND(IF((SUM(pharmacyrevenueperc))=0 OR NULL,0,SUM(pharmacyrevenueperc)),0),'%') AS pharmacy_revenue_perc
-- 	, CONCAT(ROUND(IF((SUM(opticalsrevenueperc))=0 OR NULL,0,SUM(opticalsrevenueperc)),0),'%') AS opticals_revenue_perc
-- 	, CONCAT(ROUND(IF((SUM(surgeryrevenueperc))=0 OR NULL,0,SUM(surgeryrevenueperc)),0),'%') AS surgery_revenue_perc
-- 	, ROUND(IF((SUM(pharmacycogs)/100000)=0 OR NULL,0,SUM(pharmacycogs)/100000),1) AS pharmacy_cogs
-- 	, ROUND(IF((SUM(opticalscogs)/100000)=0 OR NULL,0,SUM(opticalscogs)/100000),1) AS opticals_cogs
-- 	, ROUND(IF((SUM(surgerycogs)/100000)=0 OR NULL,0,SUM(surgerycogs)/100000),1) AS surgery_cogs
-- 	, ROUND(IF((SUM(mtdcogs)/100000)= 0 OR NULL,0,SUM(mtdcogs)/100000),1) AS mtd_cogs
-- 	, IFNULL(CONCAT(ROUND((((SUM(pharmacycogs)/100000)/(SUM(pharmacyrevenue)/100000))*100),0),'%'),0) AS pharmacy_cogs_perc
-- 	, IFNULL(CONCAT(ROUND((((SUM(opticalscogs)/100000)/(SUM(opticalsrevenue)/100000))*100),0),'%'),0) AS optical_cogs_perc
-- 	, IFNULL(CONCAT(ROUND((((SUM(surgerycogs)/100000)/(SUM(surgeryrevenue)/100000))*100),0),'%'),0) AS surgery_cogs_perc
-- ,CONCAT(ROUND(((SUM(pharmacyrevenueperc)*(IFNULL((SUM(pharmacycogs)/SUM(pharmacyrevenue)),0))+SUM(opticalsrevenueperc)*(IFNULL((SUM(opticalscogs)/SUM(opticalsrevenue)),0))+SUM(surgeryrevenueperc)*(IFNULL((SUM(surgerycogs)/SUM(surgeryrevenue)),0)))/100)*100,1), '%') AS Consump
-- 	,DATE(CURDATE()) AS today_date
--  FROM (
-- (
-- SELECT entity, branch,
-- IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy))AS pharmacyrevenue,
-- IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalsrevenue,
--  IF((SUM(laboratory+surgery+consultation+others))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others)) AS surgeryrevenue,
--  IF((SUM(laboratory+surgery+consultation+others+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others+pharmacy+opticals)) AS MTDrevenue
-- , IF(((SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS pharmacyrevenueperc
-- , IF(((SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS opticalsrevenueperc
-- , IF(((SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS surgeryrevenueperc
-- , 0 AS pharmacycogs
-- , 0 AS opticalscogs
-- , 0 AS surgerycogs
-- , 0 AS mtdcogs
-- , 0 AS pharmacycogsperc
-- , 0 AS opticalscogsperc
-- , 0 AS surgerycogsperc
-- FROM revenue_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
--
-- )
-- UNION ALL
-- (
-- SELECT entity, branch,
-- 	0 AS pharmacyrevenue
-- 	, 0 AS opticalsrevenue
-- 	, 0 AS surgeryrevenue
-- 	, 0 AS mtdrevenue
-- 	, 0 AS pharmacyrevenueperc
-- 	, 0 AS opticalsrevenueperc
-- 	, 0 AS surgeryrevenueperc
-- 	, IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy)) AS pharmacycogs,
--     IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalscogs,
--     IF((SUM(laboratory+operation_theatre))=0 OR NULL,0,SUM(laboratory+operation_theatre)) AS surgerycogs,
-- 	IF((SUM(laboratory+operation_theatre+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+operation_theatre+pharmacy+opticals)) AS MTDcogs
--
-- , 0 AS pharmacycogsperc
-- , 0 AS opticalscogsperc
-- , 0 AS surgerycogsperc
-- FROM cogs_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
-- )
-- ) A WHERE branch NOT IN('NAB','UGD')
-- GROUP BY
-- entity, branch) B
--
-- GROUP BY
-- entity
--
-- UNION ALL
-- SELECT " " AS entity, "" AS branch," " AS pharmacy_revenue,"" AS optical_revenue,
-- "" AS surgery_revenue ,"" AS mtd_revenue,"" AS pharmacy_revenue_perc,
-- "" AS opticals_revenue_perc ,"" AS surgery_revenue_perc, "" AS pharmacy_cogs,
-- "" AS opticals_cogs,"" AS surgery_cogs,"" AS md_cogs ,"" AS pharmacy_cogs_perc,"" AS optical_cogs_perc ,
-- "" AS surgery_cogs_perc ,"" AS consump,"" AS today_date FROM cogs_report
--  GROUP BY
--  pharmacy_revenue
--
-- UNION ALL
--
-- SELECT "Total" AS entity, " " AS branch,ROUND(SUM(pharmacy_revenue),2) AS pharmacy_revenue,
-- ROUND(SUM(optical_revenue),2) AS optical_revenue,
-- ROUND(SUM(surgery_revenue),2) AS surgery_revenue ,ROUND(SUM(mtd_revenue),2) AS mtd_revenue,
-- CONCAT(SUM(pharmacy_revenue_perc)/2,'%') AS pharmacy_revenue_perc,
-- CONCAT(SUM(opticals_revenue_perc)/2,'%') AS opticals_revenue_perc,
-- CONCAT(SUM(surgery_revenue_perc)/2,'%') AS surgery_revenue_perc,
-- ROUND(SUM(pharmacy_cogs),2) AS pharmacy_cogs,ROUND(SUM(opticals_cogs),2) AS opticals_cogs,ROUND(SUM(surgery_cogs),2) AS surgery_cogs ,ROUND(SUM(mtd_cogs),2) AS mtd_cogs,
-- CONCAT(SUM(pharmacy_cogs_perc)/2,'%') AS pharmacy_cogs_perc,
-- CONCAT(SUM(optical_cogs_perc)/2,'%') AS optical_cogs_perc,
-- CONCAT(SUM(surgery_cogs_perc)/2,'%') AS surgery_cogs_perc,
-- CONCAT((SUM(Consump)/2),'%') AS Consump
-- ,DATE(CURDATE()) AS today_date
-- FROM
--
-- (SELECT entity,branch,SUM(pharmacy_revenue) AS pharmacy_revenue,SUM(optical_revenue) AS optical_revenue,
-- SUM(surgery_revenue) AS surgery_revenue ,SUM(mtd_revenue) AS mtd_revenue,
-- CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%')
--  END AS pharmacy_revenue_perc
--  ,
-- CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%')
--  END AS opticals_revenue_perc
--  ,
-- CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')
--  END AS surgery_revenue_perc ,
--  SUM(pharmacy_cogs) AS pharmacy_cogs ,SUM(opticals_cogs) AS opticals_cogs,SUM(surgery_cogs) AS surgery_cogs,
--  SUM(mtd_cogs) AS mtd_cogs,
--  CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%')
--  END AS pharmacy_cogs_perc
--  ,  CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%')
--  END AS optical_cogs_perc
--   ,  CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%')
--  END AS surgery_cogs_perc
--  , CASE
-- WHEN entity LIKE "%AEH%" THEN CONCAT(ROUND((((CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')))/100),0),'%')
-- WHEN entity LIKE '%AHC%' THEN CONCAT(ROUND((((CONCAT(ROUND((SUM(pharmacy_cogs)/SUM(pharmacy_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(pharmacy_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(opticals_cogs)/SUM(optical_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(optical_revenue)/SUM(mtd_revenue))*100,0),'%'))+(CONCAT(ROUND((SUM(surgery_cogs)/SUM(surgery_revenue))*100,0),'%'))*(CONCAT(ROUND((SUM(surgery_revenue)/SUM(mtd_revenue))*100,0),'%')))/100),0),'%')
--  END AS Consump ,DATE(CURDATE()) AS today_date
--
-- FROM (SELECT
-- 	entity
-- 	, branch
-- 	, ROUND(IF((SUM(pharmacyrevenue)/100000)=0 OR NULL,0,SUM(pharmacyrevenue)/100000),1) AS pharmacy_revenue
-- 	, ROUND(IF((SUM(opticalsrevenue)/100000)=0 OR NULL,0,SUM(opticalsrevenue)/100000),1) AS optical_revenue
-- 	, ROUND(IF((SUM(surgeryrevenue)/100000)=0 OR NULL,0,SUM(surgeryrevenue)/100000),1) AS surgery_revenue
-- 	, ROUND(IF((SUM(mtdrevenue)/100000)=0 OR NULL,0,SUM(mtdrevenue)/100000),1) AS mtd_revenue
-- 	, CONCAT(ROUND(IF((SUM(pharmacyrevenueperc))=0 OR NULL,0,SUM(pharmacyrevenueperc)),0),'%') AS pharmacy_revenue_perc
-- 	, CONCAT(ROUND(IF((SUM(opticalsrevenueperc))=0 OR NULL,0,SUM(opticalsrevenueperc)),0),'%') AS opticals_revenue_perc
-- 	, CONCAT(ROUND(IF((SUM(surgeryrevenueperc))=0 OR NULL,0,SUM(surgeryrevenueperc)),0),'%') AS surgery_revenue_perc
-- 	, ROUND(IF((SUM(pharmacycogs)/100000)=0 OR NULL,0,SUM(pharmacycogs)/100000),1) AS pharmacy_cogs
-- 	, ROUND(IF((SUM(opticalscogs)/100000)=0 OR NULL,0,SUM(opticalscogs)/100000),1) AS opticals_cogs
-- 	, ROUND(IF((SUM(surgerycogs)/100000)=0 OR NULL,0,SUM(surgerycogs)/100000),1) AS surgery_cogs
-- 	, ROUND(IF((SUM(mtdcogs)/100000)= 0 OR NULL,0,SUM(mtdcogs)/100000),1) AS mtd_cogs
-- 	, IFNULL(CONCAT(ROUND((((SUM(pharmacycogs)/100000)/(SUM(pharmacyrevenue)/100000))*100),0),'%'),0) AS pharmacy_cogs_perc
-- 	, IFNULL(CONCAT(ROUND((((SUM(opticalscogs)/100000)/(SUM(opticalsrevenue)/100000))*100),0),'%'),0) AS optical_cogs_perc
-- 	, IFNULL(CONCAT(ROUND((((SUM(surgerycogs)/100000)/(SUM(surgeryrevenue)/100000))*100),0),'%'),0) AS surgery_cogs_perc
-- ,CONCAT(ROUND(((SUM(pharmacyrevenueperc)*(IFNULL((SUM(pharmacycogs)/SUM(pharmacyrevenue)),0))+SUM(opticalsrevenueperc)*(IFNULL((SUM(opticalscogs)/SUM(opticalsrevenue)),0))+SUM(surgeryrevenueperc)*(IFNULL((SUM(surgerycogs)/SUM(surgeryrevenue)),0)))/100)*100,1), '%') AS Consump
-- 	,DATE(CURDATE()) AS today_date
--  FROM (
-- (
-- SELECT entity, branch,
-- IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy))AS pharmacyrevenue,
-- IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalsrevenue,
--  IF((SUM(laboratory+surgery+consultation+others))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others)) AS surgeryrevenue,
--  IF((SUM(laboratory+surgery+consultation+others+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others+pharmacy+opticals)) AS MTDrevenue
-- , IF(((SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS pharmacyrevenueperc
-- , IF(((SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS opticalsrevenueperc
-- , IF(((SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS surgeryrevenueperc
-- , 0 AS pharmacycogs
-- , 0 AS opticalscogs
-- , 0 AS surgerycogs
-- , 0 AS mtdcogs
-- , 0 AS pharmacycogsperc
-- , 0 AS opticalscogsperc
-- , 0 AS surgerycogsperc
-- FROM revenue_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
--
-- )
-- UNION ALL
-- (
-- SELECT entity, branch,
-- 	0 AS pharmacyrevenue
-- 	, 0 AS opticalsrevenue
-- 	, 0 AS surgeryrevenue
-- 	, 0 AS mtdrevenue
-- 	, 0 AS pharmacyrevenueperc
-- 	, 0 AS opticalsrevenueperc
-- 	, 0 AS surgeryrevenueperc
-- 	, IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy)) AS pharmacycogs,
--     IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalscogs,
--     IF((SUM(laboratory+operation_theatre))=0 OR NULL,0,SUM(laboratory+operation_theatre)) AS surgerycogs,
-- 	IF((SUM(laboratory+operation_theatre+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+operation_theatre+pharmacy+opticals)) AS MTDcogs
--
-- , 0 AS pharmacycogsperc
-- , 0 AS opticalscogsperc
-- , 0 AS surgerycogsperc
-- FROM cogs_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
-- )
-- ) A WHERE branch NOT IN('NAB','UGD')
-- GROUP BY
-- entity, branch) B
--
-- GROUP BY
-- entity) c
--


-- SELECT
--  entity
--  , branch
--  , ROUND(IF((SUM(pharmacyrevenue)/100000)=0 OR NULL,0,SUM(pharmacyrevenue)/100000),1) AS pharmacy_revenue
--  , ROUND(IF((SUM(opticalsrevenue)/100000)=0 OR NULL,0,SUM(opticalsrevenue)/100000),1) AS optical_revenue
--  , ROUND(IF((SUM(surgeryrevenue)/100000)=0 OR NULL,0,SUM(surgeryrevenue)/100000),1) AS surgery_revenue
--  , ROUND(IF((SUM(mtdrevenue)/100000)=0 OR NULL,0,SUM(mtdrevenue)/100000),1) AS mtd_revenue
--  , CONCAT(ROUND(IF((SUM(pharmacyrevenueperc))=0 OR NULL,0,SUM(pharmacyrevenueperc)),0),'%') AS pharmacy_revenue_perc
--  , CONCAT(ROUND(IF((SUM(opticalsrevenueperc))=0 OR NULL,0,SUM(opticalsrevenueperc)),0),'%') AS opticals_revenue_perc
--  , CONCAT(ROUND(IF((SUM(surgeryrevenueperc))=0 OR NULL,0,SUM(surgeryrevenueperc)),0),'%') AS surgery_revenue_perc
--  , ROUND(IF((SUM(pharmacycogs)/100000)=0 OR NULL,0,SUM(pharmacycogs)/100000),1) AS pharmacy_cogs
--  , ROUND(IF((SUM(opticalscogs)/100000)=0 OR NULL,0,SUM(opticalscogs)/100000),1) AS opticals_cogs
--  , ROUND(IF((SUM(surgerycogs)/100000)=0 OR NULL,0,SUM(surgerycogs)/100000),1) AS surgery_cogs
--  , ROUND(IF((SUM(mtdcogs)/100000)= 0 OR NULL,0,SUM(mtdcogs)/100000),1) AS mtd_cogs
--  , IFNULL(CONCAT(ROUND((((SUM(pharmacycogs)/100000)/(SUM(pharmacyrevenue)/100000))*100),0),'%'),0) AS pharmacy_cogs_perc
--  , IFNULL(CONCAT(ROUND((((SUM(opticalscogs)/100000)/(SUM(opticalsrevenue)/100000))*100),0),'%'),0) AS optical_cogs_perc
--  , IFNULL(CONCAT(ROUND((((SUM(surgerycogs)/100000)/(SUM(surgeryrevenue)/100000))*100),0),'%'),0) AS surgery_cogs_perc
-- ,CONCAT(ROUND(((SUM(pharmacyrevenueperc)*(IFNULL((SUM(pharmacycogs)/SUM(pharmacyrevenue)),0))+SUM(opticalsrevenueperc)*(IFNULL((SUM(opticalscogs)/SUM(opticalsrevenue)),0))+SUM(surgeryrevenueperc)*(IFNULL((SUM(surgerycogs)/SUM(surgeryrevenue)),0)))/100)*100,1), '%') AS Consump
--  ,DATE(CURDATE()) AS today_date
-- FROM (
-- (
-- SELECT entity, branch,
-- IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy))AS pharmacyrevenue,
-- IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalsrevenue,
-- IF((SUM(laboratory+surgery+consultation+others))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others)) AS surgeryrevenue,
-- IF((SUM(laboratory+surgery+consultation+others+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+surgery+consultation+others+pharmacy+opticals)) AS MTDrevenue
-- , IF(((SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS pharmacyrevenueperc
-- , IF(((SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS opticalsrevenueperc
-- , IF(((SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100)=0 OR NULL,0,(SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100) AS surgeryrevenueperc
-- , 0 AS pharmacycogs
-- , 0 AS opticalscogs
-- , 0 AS surgerycogs
-- , 0 AS mtdcogs
-- , 0 AS pharmacycogsperc
-- , 0 AS opticalscogsperc
-- , 0 AS surgerycogsperc
-- FROM revenue_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
--
-- )
-- UNION ALL
-- (
-- SELECT entity, branch,
--  0 AS pharmacyrevenue
--  , 0 AS opticalsrevenue
--  , 0 AS surgeryrevenue
--  , 0 AS mtdrevenue
--  , 0 AS pharmacyrevenueperc
--  , 0 AS opticalsrevenueperc
--  , 0 AS surgeryrevenueperc
--  , IF((SUM(pharmacy))=0 OR NULL,0,SUM(pharmacy)) AS pharmacycogs,
-- 	 IF((SUM(opticals))=0 OR NULL,0,SUM(opticals)) AS opticalscogs,
-- 	 IF((SUM(laboratory+operation_theatre))=0 OR NULL,0,SUM(laboratory+operation_theatre)) AS surgerycogs,
--  IF((SUM(laboratory+operation_theatre+pharmacy+opticals))=0 OR NULL,0,SUM(laboratory+operation_theatre+pharmacy+opticals)) AS MTDcogs
--
-- , 0 AS pharmacycogsperc
-- , 0 AS opticalscogsperc
-- , 0 AS surgerycogsperc
-- FROM cogs_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
-- )
-- ) A WHERE branch NOT IN('NAB','UGD')
-- GROUP BY
-- entity, branch
--



-- truncate table materialcost;
-- INSERT INTO materialcost(entity,branch,pharmacy_revenue,optical_revenue,surgery_revenue,mtd_revenue,pharmacy_revenue_perc,opticals_revenue_perc,surgery_revenue_perc,pharmacy_cogs,opticals_cogs,surgery_cogs,mtd_cogs,pharmacy_cogs_perc,opticals_cogs_perc,surgery_cogs_perc,Consump,today_date)
-- SELECT
-- 	entity
-- 	, branch
-- 	, ROUND(SUM(pharmacyrevenue)/100000,2) AS pharmacy_revenue
-- 	, ROUND(SUM(opticalsrevenue)/100000,2) AS optical_revenue
-- 	, ROUND(SUM(surgeryrevenue)/100000,2) AS surgery_revenue
-- 	, ROUND(SUM(mtdrevenue)/100000,2) AS mtd_revenue
-- 	, CONCAT(ROUND(SUM(pharmacyrevenueperc),0),'%') AS pharmacy_revenue_perc
-- 	, CONCAT(ROUND(SUM(opticalsrevenueperc),0),'%') AS opticals_revenue_perc
-- 	, CONCAT(ROUND(SUM(surgeryrevenueperc),0),'%') AS surgery_revenue_perc
-- 	, ROUND(SUM(pharmacycogs)/100000,2) AS pharmacy_cogs
-- 	, ROUND(SUM(opticalscogs)/100000,2) AS opticals_cogs
-- 	, ROUND(SUM(surgerycogs)/100000,2) AS surgery_cogs
-- 	, ROUND(SUM(mtdcogs)/100000,2) AS mtd_cogs
-- 	, CONCAT(ROUND(SUM(pharmacycogsperc),0),'%') AS pharmacy_cogs_perc
-- 	, CONCAT(ROUND(SUM(opticalscogsperc),0),'%') AS opticals_cogs_perc
-- 	, CONCAT(ROUND(SUM(surgerycogsperc),0),'%') AS surgery_cogs_perc
-- 	, CONCAT(ROUND((SUM(pharmacyrevenueperc)*SUM(pharmacycogsperc)+SUM(opticalsrevenueperc)*SUM(opticalscogsperc)+SUM(surgeryrevenueperc)*SUM(surgerycogsperc))/100,0),'%') AS Consump,DATE(CURDATE()) AS today_date
--  FROM (
-- (SELECT entity, branch, SUM(pharmacy)AS pharmacyrevenue, SUM(opticals) AS opticalsrevenue, SUM(laboratory+surgery+consultation+others) AS surgeryrevenue, SUM(laboratory+surgery+consultation+others+pharmacy+opticals) AS MTDrevenue
-- , (SUM(pharmacy)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100 AS pharmacyrevenueperc
-- , (SUM(opticals)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100 AS opticalsrevenueperc
-- , (SUM(laboratory+surgery+consultation+others)/SUM(laboratory+surgery+consultation+others+pharmacy+opticals))*100 AS surgeryrevenueperc
-- , 0 AS pharmacycogs
-- , 0 AS opticalscogs
-- , 0 AS surgerycogs
-- , 0 AS mtdcogs
-- , 0 AS pharmacycogsperc
-- , 0 AS opticalscogsperc
-- , 0 AS surgerycogsperc
-- FROM revenue_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
-- )
-- UNION ALL
-- (SELECT entity, branch,
-- 	0 AS pharmacyrevenue
-- 	, 0 AS opticalsrevenue
-- 	, 0 AS surgeryrevenue
-- 	, 0 AS mtdrevenue
-- 	, 0 AS pharmacyrevenueperc
-- 	, 0 AS opticalsrevenueperc
-- 	, 0 AS surgeryrevenueperc
--     , SUM(pharmacy)AS pharmacycogs, SUM(opticals) AS opticalscogs, SUM(laboratory+operation_theatre) AS surgerycogs,
-- 	SUM(laboratory+operation_theatre+pharmacy+opticals) AS MTDcogs
-- , (SUM(pharmacy)/SUM(laboratory+operation_theatre+pharmacy+opticals))*100 AS pharmacycogsperc
-- , (SUM(opticals)/SUM(laboratory+operation_theatre+pharmacy+opticals))*100 AS opticalscogsperc
-- , (SUM(laboratory+operation_theatre)/SUM(laboratory+operation_theatre+pharmacy+opticals))*100 AS surgerycogsperc
-- FROM cogs_report
-- WHERE DATE(trans_date) BETWEEN DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- GROUP BY entity, branch
-- )
-- ) A WHERE branch NOT IN('NAB','UGD')
-- GROUP BY
-- entity, branch
--
-- -- select
-- -- 	entity
-- -- 	, branch
-- -- 	, round(sum(pharmacyrevenue),2) as pharmacy_revenue
-- -- 	, round(sum(opticalsrevenue),2) as optical_revenue
-- -- 	, round(sum(surgeryrevenue),2) as surgery_revenue
-- -- 	, round(sum(mtdrevenue),2) as mtd_revenue
-- -- 	, round(sum(pharmacyrevenueperc),0) as pharmacy_revenue_perc
-- -- 	, round(sum(opticalsrevenueperc),0) as opticals_revenue_perc
-- -- 	, round(sum(surgeryrevenueperc),0) as surgery_revenue_perc
-- -- 	, round(sum(pharmacycogs),2) as pharmacy_cogs
-- -- 	, round(sum(opticalscogs),2) as opticals_cogs
-- -- 	, round(sum(surgerycogs),2) as surgery_cogs
-- -- 	, round(sum(mtdcogs),2) as mtd_cogs
-- -- 	, round(sum(pharmacycogsperc),0) as pharmacy_cogs_perc
-- -- 	, round(sum(opticalscogsperc),0) as opticals_cogs_perc
-- -- 	, round(sum(surgerycogsperc),0) as surgery_cogs_perc
-- -- 	, round((sum(pharmacyrevenueperc)*sum(pharmacycogsperc)+sum(opticalsrevenueperc)*sum(opticalscogsperc)+sum(surgeryrevenueperc)*sum(surgerycogsperc))/100,0) as MC
-- --  from (
-- -- (select entity, branch, sum(pharmacy)as pharmacyrevenue, sum(opticals) as opticalsrevenue, sum(laboratory+surgery+consultation+others) as surgeryrevenue, sum(laboratory+surgery+consultation+others+pharmacy+opticals) as MTDrevenue
-- -- , (sum(pharmacy)/sum(laboratory+surgery+consultation+others+pharmacy+opticals))*100 as pharmacyrevenueperc
-- -- , (sum(opticals)/sum(laboratory+surgery+consultation+others+pharmacy+opticals))*100 as opticalsrevenueperc
-- -- , (sum(laboratory+surgery+consultation+others)/sum(laboratory+surgery+consultation+others+pharmacy+opticals))*100 as surgeryrevenueperc
-- -- , 0 as pharmacycogs
-- -- , 0 as opticalscogs
-- -- , 0 as surgerycogs
-- -- , 0 as mtdcogs
-- -- , 0 as pharmacycogsperc
-- -- , 0 as opticalscogsperc
-- -- , 0 as surgerycogsperc
-- -- from revenue_report
-- -- where date(trans_date) between DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- -- group by entity, branch
-- -- )
-- -- union all
-- -- (select entity, branch,
-- -- 	0 as pharmacyrevenue
-- -- 	, 0 as opticalsrevenue
-- -- 	, 0 as surgeryrevenue
-- -- 	, 0 as mtdrevenue
-- -- 	, 0 as pharmacyrevenueperc
-- -- 	, 0 as opticalsrevenueperc
-- -- 	, 0 as surgeryrevenueperc
-- --     , sum(pharmacy)as pharmacycogs, sum(opticals) as opticalscogs, sum(laboratory+operation_theatre) as surgerycogs,
-- -- 	sum(laboratory+operation_theatre+pharmacy+opticals) as MTDcogs
-- -- , (sum(pharmacy)/sum(laboratory+operation_theatre+pharmacy+opticals))*100 as pharmacycogsperc
-- -- , (sum(opticals)/sum(laboratory+operation_theatre+pharmacy+opticals))*100 as opticalscogsperc
-- -- , (sum(laboratory+operation_theatre)/sum(laboratory+operation_theatre+pharmacy+opticals))*100 as surgerycogsperc
-- -- from cogs_report
-- -- where date(trans_date) between DATE_SUB(DATE(NOW()),INTERVAL (DAY(NOW())-1) DAY) AND NOW()
-- -- group by entity, branch
-- -- )
-- -- ) A
-- -- group by
-- -- entity, branch
