const fs = require("fs");

let read = filename => {
  return fs.readFileSync(filename, "utf-8");
};

exports.cogs = read("./queries/cogs_normal.sql");
exports.cogsbackup = read("./queries/cogs_backup.sql");
exports.cogsreport = read("./queries/cogs_report.sql");
exports.cogsSuper = read("./queries/cogs_super.sql");
exports.revenue = read("./queries/revenue_normal.sql");
exports.revenuebackup = read("./queries/revenue_backup.sql");
exports.revenuereport = read("./queries/revenue_report.sql");
exports.revenueSuper = read("./queries/revenue_super.sql");
exports.vobbackup = read("./queries/vob_backup.sql");
exports.vob = read("./queries/vob_normal.sql");
exports.vobreport = read("./queries/vob_report.sql");
exports.vobSuper = read("./queries/vob_super.sql");
exports.surgCount = read("./queries/surgery_count.sql");
exports.cogsCount = read("./queries/cogs_count.sql");
exports.breakup = read("./queries/breakup_normal.sql");
exports.breakupSuper = read("./queries/breakup_super.sql");
exports.breakupmtd = read("./queries/breakup_mtd_normal.sql");
exports.breakupmtdSuper = read("./queries/breakup_mtd_super.sql");
exports.breakupReport = read("./queries/breakup_backup.sql");
exports.nativebreakup = read("./queries/breakup_normal_revenue.sql");
exports.nativebreakupSuper = read("./queries/breakup_super_revenue.sql");
exports.nativebreakupmtd = read("./queries/breakup_mtd_normal_revenue.sql");
exports.nativebreakupmtdSuper = read("./queries/breakup_mtd_super_revenue.sql");
exports.nativebreakupReport = read("./queries/breakup_backup_revenue.sql");
exports.nativerevenue = read("./queries/revenue_normal_revenue.sql");
exports.nativerevenuebackup = read("./queries/revenue_backup_revenue.sql");
exports.nativerevenuereport = read("./queries/revenue_report_revenue.sql");
exports.nativerevenueSuper = read("./queries/revenue_super_revenue.sql");
exports.chart = read("./queries/chart.sql");
exports.opCount = read("./queries/op_count.sql");
exports.materialcals=read("./queries/materialcalc.sql");
exports.email=read("./queries/email.sql");
exports.onemonthmc=read("./queries/onemonthmc.sql");
exports.newopd=read("./queries/newopd.sql");
exports.newopdmail=read("./queries/newopdmail.sql");
exports.branchlist=read("./queries/branches_list.sql");
exports.regionlist=read("./queries/region.sql");
exports.opdatalist=read("./queries/op_backup.sql");
exports.new_opd_super=read("./queries/new_opd_super.sql");
exports.new_opd_normal=read("./queries/new_opd_normal.sql");
exports.currency_details=read("./queries/currency_details.sql");
exports.currency_det_last_mth=read("./queries/currency_det_last_mth.sql");
exports.discount=read("./queries/discount.sql");
exports.discountall=read("./queries/discountall.sql");
exports.discountvr=read("./queries/discountvr.sql");
exports.discountlab=read("./queries/discountlab.sql");
exports.discountsplit=read("./queries/discountsplit.sql");
exports.discountothers=read("./queries/discountothers.sql");
exports.collectiondetailim=read("./queries/collection_detail_im.sql");
exports.brancheslist=read("./queries/branch_list.sql");
exports.aehcollection_email=read("./queries/aehcollectionemail.sql");
exports.ahccollection_email=read("./queries/ahccollectionemail.sql");
exports.device_history=read("./queries/device_history.sql");
exports.device_revenue=read("./queries/device_revenue.sql");
exports.new_consultation_super=read("./queries/new_consultation.sql");
exports.finall=read("./queries/finall.sql");
exports.finbranchall=read("./queries/finbranchall.sql");
exports.finstatusall=read("./queries/finstatusall.sql");
exports.finelse=read("./queries/finelse.sql");
exports.schall=read("./queries/schall.sql");
exports.schbranchall=read("./queries/schbranchall.sql");
exports.schvisitall=read("./queries/schvistall.sql");
exports.schelse=read("./queries/schelse.sql");
exports.chbillall=read("./queries/chbillall.sql");
exports.chbillvisitall=read("./queries/chbillvisitall.sql");
exports.chbillbranchall=read("./queries/chbillbranchall.sql");
exports.chbillelse=read("./queries/chelse.sql");
exports.otherchbillall=read("./queries/otherchbillall.sql");
exports.otherchbillvisitall=read("./queries/otherchbillvisitall.sql");
exports.otherchbillbranchall=read("./queries/otherchbillbranchall.sql");
exports.otherchbillelse=read("./queries/otherchbillelse.sql");
exports.allapprovalbills=read("./queries/approvalbills.sql");
exports.billidch=read("./queries/billidch.sql");
exports.chbillid=read("./queries/billid.sql");
exports.mtdopticals=read("./queries/mtd_optical.sql");
exports.lymtdopticals=read("./queries/lymtd_optical.sql");
exports.totaldrtbill=read("./queries/totaldrtbill.sql");
exports.challdoctor=read("./queries/challdoctorlist.sql");
exports.chdoctor=read("./queries/chdoctorlist.sql");
exports.findocallall=read("./queries/fin_doctor_all_all.sql");
exports.findocallstatus=read("./queries/fin_doc_all_status.sql");
exports.findocbranchall=read("./queries/fin_doc_branch_all.sql");
exports.findocbranchstatus=read("./queries/fin_doc_branch_status.sql");
exports.chsubbillall=read("./queries/subbillall.sql");
exports.chsubbillstatusall=read("./queries/subbill_status_all.sql");
exports.expensedata=read("./queries/expense.sql");
exports.schexpense_all=read("./queries/schexpenseall.sql");
exports.finexpense_all=read("./queries/finexpense.sql");
exports.finexpense_branch=read("./queries/finexpensebranch.sql");
exports.pettycash_category=read("./queries/pettycashcategory.sql");
exports.pettycash_allocated_amount=read("./queries/pettycash_allocated_amount.sql");

exports.schpcschfinapp=read("./queries/schpc_schapp.sql");
exports.schpcschfindec=read("./queries/schpc_decline.sql");
exports.schpcpend=read("./queries/schpc_pend.sql");

exports.schpcallall=read("./queries/schpcallall.sql");

exports.strbranchgroupbillz=read("./queries/strbranchgroupbill.sql");
exports.strbranchgroupbilldetailz=read("./queries/strbranchgroupbilldetail.sql");

exports.finpcpend=read("./queries/finpc_pend.sql");
exports.finpcschfindec=read("./queries/finpc_decl.sql");
exports.finpcschfinapp=read("./queries/finpc_app.sql");
exports.finpcallall=read("./queries/finpc_allall.sql");
exports.finptycshallall=read("./queries/finptycshallall.sql");
exports.finpcdeclibrst=read("./queries/finpc_decl_br_st.sql");
exports.finpcpendbrst=read("./queries/finpc_pend_st_br.sql");
exports.finpcappstbr=read("./queries/finpc_app_st_br.sql");

// exports.finptycshallst=read("./queries/finpc_all_st.sql");
// exports.finptycshbrall=read("./queries/finpty_br_all.sql");
// exports.finptycshbrst=read("./queries/finptycsh_br_st.sql");

exports.finpccshbranchgroupz=read("./queries/finptycshbranchgroup.sql");
exports.finptycshbranchgroupbilldetailz=read("./queries/finptycshbranchgroupbilldetail.sql");
exports.orbit_cogs_backup=read("./queries/orbit_cogs_backup.sql");
exports.claimamountvalid=read("./queries/claimamountvalidate.sql");
exports.tpabillsch=read("./queries/tpabillch.sql");
exports.tpabillfin_all=read("./queries/tpabillfinall.sql");
exports.tpabillfinallbr=read("./queries/tpabillfin_all_br.sql");
exports.tpabillfinenall=read("./queries/tpabillfin_en_all.sql");
exports.tpabillfinenbr=read("./queries/tpabillfin_en_br.sql");
exports.pettycashreportallall=read("./queries/getpettycashallall.sql");

exports.tpabillfin_allNE=read("./queries/tpabillfinallne.sql");
exports.tpabillfinenbrNE=read("./queries/tpabillfin_en_br_NE.sql");


exports.tpabillfin_allpen=read("./queries/tpabillfinall_pen.sql");
exports.tpabillfin_allbrpen=read("./queries/tpabillfinallbr_pen.sql");
exports.tpabillfin_enallpen=read("./queries/tpabillfinenall_pen.sql");
exports.tpabillfin_enbrpen=read("./queries/tpabillfinenbr_pen.sql");

exports.tpabillfin_allpenNE=read("./queries/tpabillfinall_penNE.sql");
exports.tpabillfin_enbrpenNE=read("./queries/tpabillfinenbr_peNE.sql");

exports.tpabillfin_allack=read("./queries/tpabillfinall_ack.sql");
exports.tpabillfin_enallack=read("./queries/tpabillfinenall_ack.sql");
exports.tpabillfin_enbrack=read("./queries/tpabillfinenbr_ack.sql");

exports.tpabillfin_allackNE=read("./queries/tpabillfinall_ackNE.sql");
exports.tpabillfin_enbrackNE=read("./queries/tpabillfinenbr_ackNE.sql");

exports.tpabillfin_allsub=read("./queries/tpabillfinall_sub.sql");
exports.tpabillfin_enallsub=read("./queries/tpabillfinenall_sub.sql");
exports.tpabillfin_enbrsub=read("./queries/tpabillfinenbr_sub.sql");

exports.tpabillfin_allsubNE=read("./queries/tpabillfinall_subNE.sql");
exports.tpabillfin_enbrsubNE=read("./queries/tpabillfinenbr_subNE.sql");


exports.stock_ledger_domestic_IM=read("./queries/stock_ledger_domestic.sql");
exports.stock_ledger_overseas_IM=read("./queries/stock_ledger_overseas.sql");

exports.pcreports_allallall=read("./queries/pcreportallallall.sql");
exports.pcreport_brall=read("./queries/pcreportbrall.sql");
exports.pcreport_allcat=read("./queries/pcreportallcat.sql");
exports.pcreport_brcat=read('./queries/pcreportbrcat.sql');



exports.device_history_ytd=read("./queries/device_history_YTD.sql");
exports.device_revenue_ytd=read("./queries/device_revenue_YTD.sql");

//STN
exports.stns=read("./queries/stn.sql");
exports.collections=read("./queries/collectionquery.sql");
exports.collectionsme=read("./queries/collectionme.sql");

exports.revenuedetailstpa=read("./queries/revenue_tpadetails.sql");

exports.dob=read("./queries/dateofbirth.sql");

exports.opr_branches=read("./queries/opr_branches.sql");

exports.in_transit=read("./queries/intransit_15.sql");

exports.total_collection=read("./queries/totalcollection.sql");
exports.total_collectiondate=read("./queries/totalcollection_date.sql");

exports.collection_recon_update=read("./queries/collectionrecon_update.sql");
