-- SELECT rdn.native,b.branch,
-- SUM( IF( rdn.unit='SURGERY', rdn.net_amount,0) ) AS surgery, 
-- SUM( IF( rdn.unit='PHARMACY', rdn.net_amount,0) ) AS pharmacy,  
-- SUM( IF( rdn.unit='OPTICALS', rdn.net_amount ,0) ) AS opticals, 
-- SUM(rdn.net_amount) AS mtd
-- FROM revenue_details_native rdn JOIN branches b ON rdn.native = b.code WHERE (rdn.transaction_date BETWEEN DATE_FORMAT(SUBDATE(CURDATE(),1) ,'%Y-%m-01') AND LAST_DAY(SUBDATE(CURDATE(),1)))
-- AND rdn.NATIVE NOT IN ('NAB','ERC','OHC')
-- GROUP BY rdn.native ORDER BY rdn.native
SELECT `native`,
SUM( IF( unit='SURGERY', net_amount,0) ) AS surgery, 
SUM( IF( unit='PHARMACY', net_amount,0) ) AS pharmacy,  
SUM( IF( unit='OPTICALS', net_amount ,0) ) AS opticals, 
SUM(net_amount) AS mtd
FROM revenue_details_native WHERE (transaction_date BETWEEN ? AND ?)
AND `NATIVE` NOT IN ('NAB','ERC','OHC')
GROUP BY `native` ORDER BY `native`