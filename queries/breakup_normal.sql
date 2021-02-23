SELECT br.billed_entity AS entity,breakup_report.branch,trans_date,unit,`group`,`subgroup`,ftd
 FROM breakup_report
JOIN `branches` AS br ON br.code=breakup_report.branch
  WHERE trans_date BETWEEN ? and ? AND breakup_report.branch (?);


-- select entity,branch,trans_date,unit,`group`,`subgroup`,ftd from breakup_report where trans_date between ? and ? and branch in (?);
