
SELECT BILLED,
       SUM(GrossBillamount) AS 'GrossBillamount' ,
       SUM(DiscountGiven) AS 'DiscountGiven',
       SUM(NetAmount) AS 'NetAmount',
     SUM(DiscountGiven)/SUM(GrossBillamount) *100 AS 'Discount_as_of_Gross_Amount',
       SUM(BILLNO) AS 'NoOfBillsRaised' ,
       SUM(Discounts) AS 'Bills_Provided_Discounts' ,
       (SUM(Discounts)/SUM(BILLNO)) *100  AS 'Discounted_Bills',
       IFNULL(  (SUM(DiscountGiven)/SUM(discountbillamt)) * 100,0)  AS 'ActualDiscount',
       UNIT
FROM
  (SELECT BILLED,
          SUM(TOTAL_AMOUNT) AS 'GrossBillamount',
          SUM(IFNULL(DISCOUNT_AMOUNT, 0)) AS 'DiscountGiven',
          SUM(NET_AMOUNT) AS 'NetAmount',
          0 AS BILLNO,
          0 AS Discounts,
          0 AS 'discountbillamt',
          CASE
              WHEN UNIT IN ('CONTACT LENS',
                            'CONTACTLENS') THEN 'CONTACTLENS'
              ELSE UNIT
          END AS UNIT
   FROM revenue_details
   WHERE TOTAL_AMOUNT > 0
     AND DATE(TRANSACTION_DATE) BETWEEN ? AND ?
     AND PAYORTYPE ='SELF'
   AND  UNIT in (?)
   GROUP BY BILLED,
            UNIT

   UNION ALL

    SELECT BILLED,
                    0 AS 'GrossBillamount',
                    0 AS 'DiscountGiven',
                    0 AS NetAmount ,
                    COUNT(DISTINCT BILLNO) AS 'BILLNO',
                    0 AS 'Discounts',
                    0 AS 'discountbillamt',
                    CASE
                        WHEN UNIT IN ('CONTACT LENS',
                                      'CONTACTLENS') THEN 'CONTACTLENS'
                        ELSE UNIT
                    END AS UNIT
   FROM revenue_details
   WHERE TOTAL_AMOUNT > 0
     AND `PAYORTYPE` LIKE 'SELF%'
     AND DATE(TRANSACTION_DATE) BETWEEN ? AND ?
    AND  UNIT in (?)
   GROUP BY UNIT,
            BILLED

   UNION ALL

   SELECT BILLED,
                    0 AS 'GrossBillamount',
                    0 AS 'DiscountGiven',
                    0 AS NetAmount,
                    0 AS 'BILLNO',
                    COUNT(DISTINCT BILLNO) AS 'Discounts',
                            0 AS 'discountbillamt',
                    CASE
                        WHEN UNIT IN ('CONTACT LENS',
                                      'CONTACTLENS') THEN 'CONTACTLENS'
                        ELSE UNIT
                    END AS UNIT
   FROM revenue_details
   WHERE TOTAL_AMOUNT > 0
     AND DISCOUNT_AMOUNt > 0
     AND `PAYORTYPE` LIKE 'SELF%'
     AND DATE(TRANSACTION_DATE) BETWEEN ? AND ?
     AND  UNIT in (?)
   GROUP BY BILLED,
            UNIT

            UNION ALL
            SELECT BILLED,
          0 AS 'GrossBillamount',
          0  AS 'DiscountGiven',
         0 AS 'NetAmount',
          0 AS BILLNO,
          0 AS Discounts,
          SUM(TOTAL_AMOUNT) AS 'discountbillamt',
          CASE
              WHEN UNIT IN ('CONTACT LENS',
                            'CONTACTLENS') THEN 'CONTACTLENS'
              ELSE UNIT
          END AS UNIT
   FROM
   revenue_details
   WHERE TOTAL_AMOUNT > 0
   AND DISCOUNT_AMOUNT > 0
     AND DATE(TRANSACTION_DATE) BETWEEN ? AND ?
     AND PAYORTYPE ='SELF'
AND  UNIT in (?)
   GROUP BY BILLED,
            UNIT
            ) AS A
           WHERE BILLED NOT IN ("MDR","UGD","ZMB","MZQ","TZA","GHA","EBN","FLQ","GDL","BRA","NGA","RWD","NAB")
GROUP BY BILLED
-- ,UNIT
ORDER BY Discount_as_of_Gross_Amount DESC
