SELECT br.billed_entity AS entity,breakup_report.branch,unit,`group`,subgroup,SUM(ftd) AS mtd
  FROM breakup_report
  JOIN `branches` AS br ON br.code=breakup_report.branch
WHERE trans_date BETWEEN ? and ?  AND breakup_report.branch in (?)
GROUP BY unit,`group`,subgroup,branch ORDER BY breakup_report.branch

-- SELECT entity,branch,unit,`group`,subgroup,SUM(ftd) AS mtd FROM breakup_report
-- WHERE trans_date BETWEEN ? AND ? AND branch in (?)
-- GROUP BY unit,`group`,subgroup,branch ORDER BY branch
