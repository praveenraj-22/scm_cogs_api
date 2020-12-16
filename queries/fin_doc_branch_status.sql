SELECT CASE
           WHEN STATUS=-1 THEN 'Pending for approval'
           WHEN STATUS=-2 THEN 'Rejected'
           WHEN STATUS=1 THEN 'Approved'
       END AS 'Active_status',
            CASE
            WHEN Agreement_url='' THEN 'NA'
            WHEN Agreement_url IS NULL THEN 'NA'
            ELSE Agreement_url
        END AS Agreement_d,
        CASE
            WHEN Pan_url='' THEN 'NA'
             WHEN Pan_url IS NULL THEN 'NA'
            ELSE Pan_url
        END AS Pan_d,
         CASE
            WHEN Passbook_url='' THEN 'NA'
             WHEN Passbook_url IS NULL THEN 'NA'
            ELSE Passbook_url
        END AS Passbook_d,
         CONCAT("'",`Account_no`) AS Accnt_no,
       cus.*
FROM drt_customer AS cus
WHERE Branch=? AND STATUS=?
ORDER BY Created_by DESC
