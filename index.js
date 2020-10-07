const modules = require('./modules')
const app = modules.express()

app.use(modules.cookie_parser())
app.use(modules.morgan('dev'))
app.use(modules.body_parser.urlencoded({ extended: false }))
app.use(modules.body_parser.json())
app.use(modules.cors())
app.use(modules.compression())
app.use(modules.helmet())
app.use(modules.session({ name: 'session_ID', secret: 'Bi$$DS@@J&a&i&*', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }))


app.use(modules.upload())

//modules.cron_job.schedule;



app.get('/api-super/:date', modules.routes.main_route)
app.get('/api-normal/:date/:name', modules.routes.test_route)
app.get('/api-revenue-super/:date', modules.routes.main_route_revenue)
app.get('/api-revenue-normal/:date/:name', modules.routes.test_route_revenue)
app.get('/api-branches/:entity/:region', modules.routes.branches)
app.get('/api-region/:entity', modules.routes.region)
app.get('/api-cogs-dashboard/:date/:entity/:region/:branch', modules.routes.monthlyData)
app.get('/api-super-ot/:date', modules.routes.main_ot)
app.get('/health', modules.routes.health)
app.post('/login', modules.routes.testLogin)
app.get('/logout', modules.routes.logout)
app.post('/api-changepassword', modules.routes.changePassword)
app.get('/api-newpod-super/:date', modules.routes.main_route_newopd)
app.get('/api-newpod-normal/:date/:name', modules.routes.main_route_newopd_normal)
app.get('/api-opticals-super/:date',modules.routes.opticals)
app.get('/api-discount-super/:frmdate/:todate/:department',modules.routes.discount)
app.get('/api-collection-super/:fromdate/:todate/:entity/:branch',modules.routes.collectiondetailim)
app.get('/api-branch/:entity', modules.routes.branch)
app.get('/api-usage-tracker/:date', modules.routes.main_route_usage_tracker)
app.get('/api-consultation-super/:date',modules.routes.consultation)

app.get('/api-usage-tracker-new/:date', modules.routes.main_route_usage_tracker_new)
app.get('/api-chbranch/:name', modules.routes.ch_branch)
app.get('/api-chbills/:fromdate/:todate/:visit/:branch/:type/:name', modules.routes.chbills)
app.get('/api-drt', modules.routes.drt)
app.get('/api-drtdetail/:id', modules.routes.drtdetail)
app.post('/api-drtbills', modules.routes.drtbills)
app.get('/api-billdrt/:id', modules.routes.billdrt)
app.get('/api-schbranch/:name', modules.routes.sch_branch)
app.get('/api-schbills/:fromdate/:datetype/:status/:branch/:name', modules.routes.schbills)
app.post('/api-schbillinsert',modules.routes.schbillinsert)
app.post('/api-schbillcancel',modules.routes.schbillcancel)
app.get('/api-finbranch', modules.routes.fin_branch)
app.get('/api-finbills/:fromdate/:datetype/:status/:branch/:name', modules.routes.finbills)
app.post('/api-finbillinsert',modules.routes.finbillinsert)
app.post('/api-finbillcancel',modules.routes.finbillcancel)
app.get('/api-approvalbills/:id',modules.routes.approvalbills)
app.post('/api-uploaddoctor',modules.routes.upload_doctor)
app.get('/api-chdoctorlist/:id/:name',modules.routes.ch_doctorlist)
app.get('/api-download/:download',modules.routes.download_file)
app.get('/api-findoctorlist/:status/:branch',modules.routes.fin_doctorlist)
app.post('/api-doctorapprove',modules.routes.fin_doctorapprove)
app.post('/api-doctorreject',modules.routes.fin_doctorreject)
app.get('/api-loaddoc',modules.routes.fin_loaddoc)
app.get('/api-submittedbills/:frmdate/:datetype/:status/:branch/:name',modules.routes.ch_submittedbills)
app.post('/api-finbillexpenseupdate',modules.routes.expense_date)
app.get('/api-rev-vs-cogs/:date/:entity/:region/:branch/:type', modules.routes.revvscogs_services)


app.get('/api-pettycashcategory', modules.routes.pettycash_category)
app.get('/api-bramch-allocated-amount/:branch',modules.routes.pettycash_allocated_amount)
app.post('/api-petty-cash-bill-submit',modules.routes.bill_submit)
app.get('/api-petty-cash-details/:user/:branch/:status/:date',modules.routes.petty_cash_details)
app.get('/api-voucher-download/:download',modules.routes.download_voucher)
app.get('/api-bill-download/:download',modules.routes.download_bill)

app.get('/api-schpc/:branch/:status/:name',modules.routes.strchpc)
app.get('/api-strchbranchgroupbill/:branch/:statusno/:date',modules.routes.strchbranchgroupbills)
app.get('/api-strchbranchgroupbilldetail/:branch/:categoryname/:date/:status',modules.routes.strchbranchgroupbilldetail)
app.post('/api-strchbillgroupapprove',modules.routes.strch_billgroupapprove)
app.post('/api-strchbillgroupdecline',modules.routes.strch_billgroupdecline)
app.post('/api-strchbillgroupapproveall',modules.routes.strch_billgroupapproveall)

app.get('/api-finpc/:branch/:status/:name',modules.routes.finptycsh)
app.get('/api-finpcbranchgroupbill/:branch/:status/:date',modules.routes.finpcbranchgroupbills)
app.get('/api-finpcbranchgroupbilldetail/:branch/:categoryname/:date',modules.routes.finpcbranchgroupbilldetail)
app.post('/api-finpcbillgroupdecline',modules.routes.fin_billgroupdecline)
app.post('/api-finptycshbillgroupapproveall',modules.routes.finptycsh_billgroupapproveall)
app.get('/api-declineamount/:branch/:fromdate/:todate',modules.routes.decline_amount)

//praveenraj
app.get('/api-cogsdetail/:date/:entity/:branch/:department',modules.routes.cogsdetails)
app.listen(8888, () => console.log(`App listening on port 8888`))
