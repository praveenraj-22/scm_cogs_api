select entity,branch,trans_date,surgery,pharmacy,opticals,laboratory,consultation,others,ftd
from revenue_report_native where trans_date between ? and ?;
