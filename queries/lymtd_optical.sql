SELECT branch,
       IF(ftd='', 0, SUM(ftd)) AS ftd,
       entity,
       region,
       branchcode,
       branchname,
       SUM(targetamount) AS targetamount
FROM
  (SELECT br.branch AS branch,
          SUM(rd.NET_AMOUNT) AS ftd,
          br.entity AS entity,
          br.region AS region,
          br.code AS branchcode,
          br.branch AS branchname,
          0 AS targetamount
   FROM `revenue_details` AS rd
   INNER
JOIN branches AS br ON CODE=rd.BILLED
   WHERE UNIT IN ('OPTICALS')
     AND DATE(TRANSACTION_DATE) BETWEEN ? AND ?
   GROUP BY BILLED
   UNION ALL SELECT br.branch AS branch,
                     '' AS ftd,
                     br.entity AS entity,
                     br.region AS region,
                     br.code AS branchcode,
                     br.branch AS branchname,
                     IFNULL(tar.targetamount, 0) AS targetamount
   FROM target_optical AS tar
   INNER JOIN branches AS br ON br.id=tar.`entityid`
   WHERE tar.year = YEAR(?)
     AND tar.month =MONTH(?) ) AS A
GROUP BY branch
