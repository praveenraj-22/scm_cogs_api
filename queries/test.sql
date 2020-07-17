-- truncate table materialcost;
-- INSERT INTO materialcost(entity,branch,pharmacy_revenue,optical_revenue,surgery_revenue,mtd_revenue,pharmacy_revenue_perc,opticals_revenue_perc,surgery_revenue_perc,pharmacy_cogs,opticals_cogs,surgery_cogs,mtd_cogs,pharmacy_cogs_perc,opticals_cogs_perc,surgery_cogs_perc,Consump,today_date)
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
	, IFNULL(CONCAT(ROUND((((SUM(opticalscogs)/100000)/(SUM(opticalsrevenue)/100000))*100),0),'%'),0) AS revenue_cogs_perc
	, IFNULL(CONCAT(ROUND((((SUM(surgerycogs)/100000)/(SUM(surgeryrevenue)/100000))*100),0),'%'),0) AS surgery_cogs_perc
,--  (
-- (CONCAT(ROUND(IF((SUM(pharmacyrevenueperc))=0 OR NULL,0,SUM(pharmacyrevenueperc)),0),'%'))
-- *
-- (()/())
-- +
-- (CONCAT(ROUND(IF((SUM(opticalsrevenueperc))=0 OR NULL,0,SUM(opticalsrevenueperc)),0),'%'))
-- *
-- (IFNULL(CONCAT(ROUND((((SUM(opticalscogs)/100000)/(SUM(opticalsrevenue)/100000))*100),0),'%'),0))
-- +
-- (CONCAT(ROUND(IF((SUM(surgeryrevenueperc))=0 OR NULL,0,SUM(surgeryrevenueperc)),0),'%'))
-- *
-- (IFNULL(CONCAT(ROUND((((SUM(surgerycogs)/100000)/(SUM(surgeryrevenue)/100000))*100),0),'%'),0))
-- ) as Consump
CONCAT(ROUND(((SUM(pharmacyrevenueperc)*(IFNULL((SUM(pharmacycogs)/SUM(pharmacyrevenue)),0))+SUM(opticalsrevenueperc)*(IFNULL((SUM(opticalscogs)/SUM(opticalsrevenue)),0))+SUM(surgeryrevenueperc)*(IFNULL((SUM(surgerycogs)/SUM(surgeryrevenue)),0)))/100)*100,1), '%') AS Consump
	,DATE(CURDATE()) AS today_date
 FROM (
(
--
-- SELECT entity, branch, SUM(pharmacy)AS pharmacyrevenue, SUM(opticals) AS opticalsrevenue, SUM(laboratory+surgery+consultation+others) AS surgeryrevenue, SUM(laboratory+surgery+consultation+others+pharmacy+opticals) AS MTDrevenue
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
-- SELECT entity, branch,
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
