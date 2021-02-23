SELECT br.billed_entity AS entity,revenue_report.branch,trans_date,surgery,pharmacy,opticals,laboratory,consultation,others,ftd
FROM revenue_report
JOIN `branches` AS br ON br.code=revenue_report.branch
WHERE trans_date BETWEEN ? AND ? AND revenue_report.branch in (?)
GROUP BY
br.billed_entity,
revenue_report.branch,
revenue_report.trans_date

-- select entity,branch,trans_date,surgery,pharmacy,opticals,laboratory,consultation,others,ftd from revenue_report where trans_date between ? and ? and branch in (?);
