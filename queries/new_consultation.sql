SELECT A.branch AS branch,A.trans_date AS trans_date,A.ftd_count AS ftd_count,A.bill_count,B.entity AS entity,
B.region AS region,B.code AS branchcode,B. branch AS branchname FROM op_details AS A,branches AS B
WHERE A.trans_date BETWEEN  ? AND ?
AND A.branch=B.code;
