const connections = require('./modules').connections
const cron = require('./modules').cron
const files = require('./modules').sqls
// const request = require('request')

exports.schedule = cron.schedule('05 08 * * *', () => {
  //exports.schedule=cron.schedule('35 10 * * *',()=>{
  var d = new Date();
  var day = d.toLocaleDateString();
  var dat = d.getDate();
  var mon = d.getMonth() + 1;
  var yr = d.getFullYear();
  var tdat = d.getDate() - 1;
  var todaydate = mon + '/' + dat + '/' + yr;
  var fixdate = mon + '/' + 1 + '/' + yr;
  var tabledate = tdat + '/' + mon + '/' + yr;
  var tablemonth = mon - 1 + '-' + yr;
  var totalbrannch = '';
  var totalcode = '';
  var total = '';
  var FTD = '';
  var MTD = '';
  var LYMTD = '';
  var MTD = '';
  var table = '';
  if (fixdate == todaydate) {
    console.log('Same date');
  } else {
    connections.scm_public.query(files.newopdmail, function(errs, result1, fields) {
      if (errs) throw err;
      console.log('connected');

      connections.ideamed.query(files.newopd, function(errs, result, fields) {
        if (errs) throw err;
        console.log('executed');

        var frmid = '';
        var toid = '';
        var bccid = '';
        var ccid = '';
        var passcode = '';
        for (var j = 0; j < result1.length; j++) {
          frmid = result1[j].fromid
          toid = result1[j].toid
          bccid = result1[j].bccid
          ccid = result1[j].ccid
          passcode = result1[j].passcode

        }
        var nodemailer = require('nodemailer');
        console.log(frmid);
        console.log(passcode);

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: frmid,
            pass: passcode
          }
        });

        var table = '';
        var branch = '';
        var code = '';
        var count = '';
        var ftd = '';
        var mtd = '';
        var lymtd = '';
        var mtdperc = '';
        for (i = 0; i < result.length; i++) {
          branch = result[i].BRANCH
          code = result[i].CODE
          count = result[i].COUNT
          ftd = result[i].FTD
          mtd = result[i].MTD
          lymtd = result[i].LYMTD
          mtdperc = result[i].MTDPERC
          table += '<tr> <td >' + result[i].BRANCH + '</td> <td>' + result[i].CODE + '</td>  <td>' + result[i].FTD + '</td> <td>' + result[i].MTD + '</td> <td>' + result[i].LYMTD + '</td> <td>' + result[i].MTDPERC + '</td> </tr>';
        }
        table = '<html><body> <table border="1"><tr><th colspan="17">DAILY NEW OPD REPORT AS ON ' + tabledate + ' </th></tr><tr><th>Branch</th><th>CODE</th><th>FTD</th><th>MTD</th> <th>LYMTD</th><th>MTD %</th> </tr>' + table + ' </table> <br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p> </body> </html> ';

        console.log(table);
        let mailOptions = {
          from: frmid,
          to: toid,
          bcc: bccid,
          cc: ccid,
          subject: 'New OPD for Chennai & Other branches till ' + tabledate,
          html: table
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });


      })
    })
  }
})
exports.schedule = cron.schedule('00 08 * * *', () => {
  //exports.schedule=cron.schedule('17 11 * * *',()=>{
  var d = new Date();
  var day = d.toLocaleDateString();
  var dat = d.getDate();
  var mon = d.getMonth() + 1;
  var yr = d.getFullYear();
  var tdat = d.getDate() - 1;
  var todaydate = mon + '/' + dat + '/' + yr;
  var fixdate = mon + '/' + 1 + '/' + yr;
  var tabledate = tdat + '/' + mon + '/' + yr;
  var tablemonth = mon - 1 + '-' + yr;
  if (fixdate == todaydate) {

    connections.scm_public.query(files.email, function(errs, result1, fields) {
      connections.scm_public.query(files.onemonthmc, function(errs, result, fields) {
        if (errs) throw err;
        console.log("connected");
        var frmid = '';
        var toid = '';
        var bccid = '';
        var ccid = '';
        var passcode = '';
        for (var j = 0; j < result1.length; j++) {
          frmid = result1[j].fromid
          toid = result1[j].toid
          bccid = result1[j].bccid
          ccid = result1[j].ccid
          passcode = result1[j].passcode

        }

        var nodemailer = require('nodemailer');
        console.log(frmid);
        console.log(passcode);

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: frmid,
            pass: passcode
          }
        });
        //html string that will be send to browser
        var table = ''; //to store html table
        var date = '';

        //create html table with data from res.
        console.log("month : " + tablemonth);
        for (var i = 0; i < result.length; i++) {


          table += '<tr align="right"><td>' + result[i].entity + '</td><td>' + result[i].branch + '</td><td>' + result[i].surgery_revenue + '</td> <td>' + result[i].optical_revenue + '</td> <td>' + result[i].pharmacy_revenue + '</td> <td>' + result[i].mtd_revenue + '</td> <td style="background-color:#FFFF33">' + result[i].surgery_revenue_perc + '</td> <td style="background-color:#FFFF33"> ' + result[i].opticals_revenue_perc + '</td><td style="background-color:#FFFF33">' + result[i].pharmacy_revenue_perc + '</td> <td>' + result[i].surgery_cogs + '</td> <td>' + result[i].opticals_cogs + '</td><td>' + result[i].pharmacy_cogs + '</td><td>' + result[i].mtd_cogs + '</td><td style="background-color:#FFFF33">' + result[i].surgery_cogs_perc + '</td><td style="background-color:#FFFF33">' + result[i].optical_cogs_perc + '</td><td style="background-color:#FFFF33">' + result[i].pharmacy_cogs_perc + '</td><td style="background-color:#9ACD32">' + result[i].Consump + '</td>  </tr>';
          date = result[i].today_date;

        }

        table = '<html><body><p>Dear SCH Team,</p><p>This is top level data on Revenue Mix % & COGs % for each category.</p> <br> <p>Please use this data to:</p> <ol type="1"> <li>Immediately address consumption entry lags on daily basis</li><li>Review individual Surgery/Optical/Pharmacy COGs% variance & compare best ones in your regions & to push implement alternates.</li><li>Final COGs will be after adjusting Credit notes on Optical lens/Drugs turnover discounts & adjustments to old payables/provisions.</li> </ol> <p>For detailed information on your centres please Login into the application <a href="https://app.carehis.com">https://app.carehis.com</a>  using your login ID</p> <br><ol type="1"><li>For Revenue details: check out Revenue report & Item wise sales report.</li><li>For COGs details: check out Cost of Goods Sold report.</li></ol><br> <table border="0"><tr><th colspan="17">Revenue vs Cogs ' + tablemonth + ' </th></tr><tr><th></th><th></th><th colspan ="4">Revenue</th><th colspan="3" style="background-color:#FFFF33">Revenue Contribution</th><th colspan="4">COGS</th><th colspan="3">COGS %</th><th>Material</th></tr><tr><th>Entity</th><th>Branch</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th><th>MTD</th> <th style="background-color:#FFFF33">Surgery</th> <th style="background-color:#FFFF33">Opticals</th> <th style="background-color:#FFFF33">Pharmacy</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th> <th>MTD</th> <th style="background-color:#FFFF33">Surgery</th><th style="background-color:#FFFF33">Opticals</th><th style="background-color:#FFFF33">Pharmacy</th><th style="background-color:#9ACD32">Consump %</th> </tr>' + table + ' </table> <br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p> </body> </html> ';
        //console.log(table);

        let mailOptions = {
          from: frmid,
          to: toid,
          bcc: bccid,
          cc: ccid,
          subject: 'Revenue vs Cogs as on ' + tablemonth,
          html: table
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

      })
    })


  } else {
    connections.scm_public.query(files.email, function(errs, result1, fields) {
      connections.scm_public.query(files.materialcals, function(errs, result, fields) {
        if (errs) throw err;
        console.log("connected");
        var frmid = '';
        var toid = '';
        var bccid = '';
        var ccid = '';
        var passcode = '';
        for (var j = 0; j < result1.length; j++) {
          frmid = result1[j].fromid
          toid = result1[j].toid
          bccid = result1[j].bccid
          ccid = result1[j].ccid
          passcode = result1[j].passcode
        }

        var nodemailer = require('nodemailer');
        // console.log(frmid);
        // console.log(passcode);

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: frmid,
            pass: passcode
          }
        });
        //html string that will be send to browser
        var table = ''; //to store html table
        var date = '';

        //create html table with data from res.

        for (var i = 0; i < result.length; i++) {


          table += '<tr align="right"><td>' + result[i].entity + '</td><td>' + result[i].branch + '</td><td>' + result[i].surgery_revenue + '</td> <td>' + result[i].optical_revenue + '</td> <td>' + result[i].pharmacy_revenue + '</td> <td>' + result[i].mtd_revenue + '</td> <td style="background-color:#FFFF33">' + result[i].surgery_revenue_perc + '</td> <td style="background-color:#FFFF33"> ' + result[i].opticals_revenue_perc + '</td><td style="background-color:#FFFF33">' + result[i].pharmacy_revenue_perc + '</td> <td>' + result[i].surgery_cogs + '</td> <td>' + result[i].opticals_cogs + '</td><td>' + result[i].pharmacy_cogs + '</td><td>' + result[i].mtd_cogs + '</td><td style="background-color:#FFFF33">' + result[i].surgery_cogs_perc + '</td><td style="background-color:#FFFF33">' + result[i].optical_cogs_perc + '</td><td style="background-color:#FFFF33">' + result[i].pharmacy_cogs_perc + '</td><td style="background-color:#9ACD32">' + result[i].Consump + '</td>  </tr>';
          date = result[i].today_date;

        }

        table = '<html><body><p>Dear SCH Team,</p><p>This is top level data on Revenue Mix % & COGs % for each category.</p> <br> <p>Please use this data to:</p> <ol type="1"> <li>Immediately address consumption entry lags on daily basis</li><li>Review individual Surgery/Optical/Pharmacy COGs% variance & compare best ones in your regions & to push implement alternates.</li><li>Final COGs will be after adjusting Credit notes on Optical lens/Drugs turnover discounts & adjustments to old payables/provisions.</li> </ol> <p>For detailed information on your centres please Login into the application <a href="https://app.carehis.com">https://app.carehis.com</a>  using your login ID</p> <br><ol type="1"><li>For Revenue details: check out Revenue report & Item wise sales report.</li><li>For COGs details: check out Cost of Goods Sold report.</li></ol><br> <table border="0"><tr><th colspan="17">Revenue vs Cogs ' + date + ' </th></tr><tr><th></th><th></th><th colspan ="4">Revenue</th><th colspan="3" style="background-color:#FFFF33">Revenue Contribution</th><th colspan="4">COGS</th><th colspan="3">COGS %</th><th>Material</th></tr><tr><th>Entity</th><th>Branch</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th><th>MTD</th> <th style="background-color:#FFFF33">Surgery</th> <th style="background-color:#FFFF33">Opticals</th> <th style="background-color:#FFFF33">Pharmacy</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th> <th>MTD</th> <th style="background-color:#FFFF33">Surgery</th><th style="background-color:#FFFF33">Opticals</th><th style="background-color:#FFFF33">Pharmacy</th><th style="background-color:#9ACD32">Consump %</th> </tr>' + table + ' </table> <br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p> </body> </html> ';
        //console.log(table);

        let mailOptions = {
          from: frmid,
          to: toid,
          bcc: bccid,
          cc: ccid,
          subject: 'Revenue vs Cogs as on ' + tabledate,
          html: table
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

      })
    })

  }

})

// exports.schedule=cron.schedule('08 15 * * *',() =>{
//   connections.scm_root.query(files.materialcost,(errs)=> {
//       if (errs) console.error(errs)
//     console.log('connected to write');
//     console.log('generated materialcost');
//
//      let sql = `SELECT * FROM materialcost`;
//    connections.scm_public.query(sql,function(errs,result,fields)
//  {
// if (errs) throw err;
// console.log("connected to readonly");
// // const Excel = require('exceljs');
// //
// // const options = {
// //   filename: 'myfile.xlsx',
// //   useStyles: true,
// //   useSharedStrings: true
// // };
// //
// // const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
// //
// // const worksheet = workbook.addWorksheet('my sheet');
// //
// //
// // worksheet.columns = [
// //     { header: 'Entity', key: 'entity' },
// //     { header: 'Branch', key: 'branch' },
// //     { header: 'pharmacy_revenue', key: 'pharmacy_revenue' },
// //     { header: 'optical_revenue', key: 'optical_revenue' },
// //     { header: 'surgery_revenue', key: 'surgery_revenue' },
// //     { header: 'mtd_revenue', key: 'mtd_revenue' },
// //     { header: 'pharmacy_revenue_perc', key: 'pharmacy_revenue_perc' },
// //     { header: 'opticals_revenue_perc', key: 'opticals_revenue_perc' },
// //     { header: 'surgery_revenue_perc', key: 'surgery_revenue_perc' },
// //     { header: 'pharmacy_cogs', key: 'pharmacy_cogs' },
// //       { header: 'opticals_cogs', key: 'opticals_cogs' },
// //         { header: 'surgery_cogs', key: 'surgery_cogs' },
// //         { header: 'mtd_cogs', key: 'mtd_cogs' },
// //         { header: 'pharmacy_cogs_perc', key: 'pharmacy_cogs_perc' },
// //         { header: 'opticals_cogs_perc', key: 'opticals_cogs_perc' },
// //           { header: 'surgery_cogs_perc', key: 'surgery_cogs_perc' },
// //             { header: 'MC', key: 'mc' },
// // ]
// // var data;
// //
// // Object.keys(result).forEach(function(key){
// //       var row = result[key];
// // var entity_wise=row.entity;
// // var branch_wise=row.branch;
// // var pharmacy_revenue_wise=row.pharmacy_revenue;
// // var optical_revenue_wise=row.optical_revenue;
// // var surgery_revenue_wise=row.surgery_revenue;
// // var mtd_revenue_wise=row.mtd_revenue;
// // var pharmacy_revenue_perc_wise=row.pharmacy_revenue_perc;
// // var opticals_revenue_perc_wise=row.opticals_revenue_perc;
// // var surgery_revenue_perc_wise=row.surgery_revenue_perc;
// // var pharmacy_cogs_wise=row.pharmacy_cogs;
// // var opticals_cogs_wise=row.opticals_cogs;
// // var surgery_cogs_wise=row.surgery_cogs;
// // var mtd_cogs_wise=row.mtd_cogs;
// // var pharmacy_cogs_perc_wise=row.pharmacy_cogs_perc;
// // var opticals_cogs_perc_wise=row.opticals_cogs_perc;
// // var surgery_cogs_perc_wise=row.surgery_cogs_perc;
// // var mc_wise=row.MC;
// //     data = {
// //       entity: entity_wise,
// //       branch: branch_wise,
// //       pharmacy_revenue: pharmacy_revenue_wise,
// //       optical_revenue: optical_revenue_wise,
// //       surgery_revenue: surgery_revenue_wise,
// //       mtd_revenue: mtd_revenue_wise,
// //       pharmacy_revenue_perc: pharmacy_revenue_perc_wise,
// //       opticals_revenue_perc: opticals_revenue_perc_wise,
// //       surgery_revenue_perc:surgery_revenue_perc_wise,
// //       pharmacy_cogs: pharmacy_cogs_wise,
// //       opticals_cogs : opticals_cogs_wise,
// //       surgery_cogs :surgery_cogs_wise,
// //       mtd_cogs : mtd_cogs_wise,
// //       pharmacy_cogs_perc :pharmacy_cogs_perc_wise,
// //       opticals_cogs_perc :opticals_cogs_perc_wise,
// //       surgery_cogs_perc :surgery_cogs_perc_wise,
// //       mc:mc_wise
// //     };
// //
// //
// //
// // worksheet.addRow(data).commit();
// //
// //
// //
// //
// //
// //
// // })
// //
// //
// //
// // workbook.commit().then(function() {
// //   console.log('excel file cretaed');
// // });
// //
// //
// //
//
//
//
//   var nodemailer = require('nodemailer');
//
//   var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'praveenraj.y@dragarwal.com',
//     pass: 'praveenrajyv22'
//   }
// });
//
//   var table =''; //to store html table
// var date='';
//   //create html table with data from res.
//      for(var i=0; i<result.length; i++){
//
//
//        table +='<tr><td>'+ result[i].entity +'</td><td>'+ result[i].branch +'</td><td>'+result[i].surgery_revenue+'</td> <td>'+ result[i].optical_revenue+'</td> <td>'+result[i].pharmacy_revenue+'</td> <td>'+result[i].mtd_revenue+'</td> <td>'+result[i].surgery_revenue_perc+'</td> <td> '+result[i].opticals_revenue_perc +'</td><td>'+result[i].pharmacy_revenue_perc +'</td> <td>'+result[i].surgery_cogs +'</td> <td>'+result[i].opticals_cogs+'</td><td>'+result[i].pharmacy_cogs+'</td><td>'+result[i].mtd_cogs+'</td><td>'+result[i].pharmacy_cogs_perc+'</td><td>'+result[i].opticals_cogs_perc+'</td><td>'+result[i].pharmacy_cogs_perc+'</td><td>'+result[i].Consump+'</td>  </tr>';
// date =result[i].today_date;
//
//      }
//
//      table ='<table border="1"><tr><th colspan="17">Revenue vs Cogs '+result.date+' </th></tr><tr><th></th><th></th><th colspan ="4">Revenue</th><th colspan="3">Revenue Contribution</th><th colspan="4">COGS</th><th colspan="3">COGS %</th><th>Material</th></tr><tr><th>Entity</th><th>Branch</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th><th>MTD</th> <th>Surgery</th> <th>Opticals</th> <th>Pharmacy</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th> <th>MTD</th> <th>Surgery</th><th>Opticals</th><th>Pharmacy</th><th>Consump %</th> </tr>'+ table +' </table>';
// //console.log(table);
//
//
// let mailOptions={
//   from: 'praveenraj.y@dragarwal.com',
//   to:'praveenraj.yv@gmail.com',
//   subject: 'Revenue vs Cogs',
// html: table
// };
//
// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
//
//
//
//  })
//   })
// });

exports.schedule = cron.schedule('00 06 * * *', () => {
  //exports.schedule = cron.schedule('44 10 * * *', () => {
  connections.ideamed.getConnection((err, con) => {
    if (err) console.log('Connection Error.')
    con.query(files.cogsbackup, (ideaerr, ideares) => {
      if (ideaerr) console.error(ideaerr)
      console.log('Connected to Ideamed.')
      console.log('Inserting Records for Cogs table.Please Wait...')
      con.beginTransaction(err => {
        if (err) console.error(err)
        ideares.forEach(record => {
          connections.scm_root.query('insert into cogs_details set ?', record, (error) => {
            if (error) {
              return con.rollback(function() {
                console.error(error)
              });
            }
            con.commit(function(err) {
              if (err) {
                return con.rollback(function() {
                  console.error(err)
                });
              }
            });
          })
        })
        connections.scm_root.query(files.cogsreport, (errs) => {
          if (errs) console.error(errs)
          console.log('Finished loading Cogs.')
          console.log('Generated Cogs Report table.')
        })
      })
    })
  })
  connections.ideamed.getConnection((err, con) => {
    if (err) console.log('Connection Error.')
    con.query(files.revenuebackup, (ideaerr, ideares) => {
      if (ideaerr) console.error(ideaerr)
      console.log('Connected to Ideamed.')
      console.log('Inserting Records for Revenue table.Please Wait...')
      con.beginTransaction(err => {
        if (err) console.error(err)
        ideares.forEach(record => {
          connections.scm_root.query('insert into revenue_details set ?', record, (error) => {
            if (error) {
              return con.rollback(function() {
                console.error(error)
              });
            }
            con.commit(function(err) {
              if (err) {
                return con.rollback(function() {
                  console.error(err)
                });
              }
            });
          })
        })
        connections.scm_root.query(files.revenuereport, (errs) => {
          if (errs) console.error(errs)
          connections.scm_root.query(files.breakupReport, (berrs) => {
            if (berrs) console.error(berrs)
            console.log('Finished loading Revenue & breakup.')
            console.log('Generated Revenue & breakup Report table.')
          })
        })
      })
    })
  })

  connections.ideamed.getConnection((err, con) => {
    if (err) console.log('Connection Error.')
    con.query(files.nativerevenuebackup, (ideaerr, ideares) => {
      if (ideaerr) console.error(ideaerr)
      console.log('Connected to Ideamed.')
      console.log('Inserting Records for Native Revenue table.Please Wait...')
      con.beginTransaction(err => {
        if (err) console.error(err)
        ideares.forEach(record => {
          connections.scm_root.query('insert into revenue_details_native set ?', record, (error) => {
            if (error) {
              return con.rollback(function() {
                console.error(error)
              });
            }
            con.commit(function(err) {
              if (err) {
                return con.rollback(function() {
                  console.error(err)
                });
              }
            });
          })
        })
        connections.scm_root.query(files.nativerevenuereport, (errs) => {
          if (errs) console.error(errs)
          connections.scm_root.query(files.nativebreakupReport, (berrs) => {
            if (berrs) console.error(berrs)
            console.log('Finished loading Native Revenue & Native breakup.')
            console.log('Generated Native Revenue & Native breakup Report table.')
          })
        })
      })
    })
  })

  connections.ideamed.getConnection((err, con) => {
    if (err) console.log('Connection Error.')
    con.query(files.vobbackup, (ideaerr, ideares) => {
      if (ideaerr) console.error(ideaerr)
      console.log('Connected to Ideamed.')
      console.log('Inserting Records for VOB table.Please Wait...')
      con.beginTransaction(err => {
        if (err) console.error(err)
        ideares.forEach(record => {
          connections.scm_root.query('insert into vob set ?', record, (error) => {
            if (error) {
              return con.rollback(function() {
                console.error(error)
              });
            }
            con.commit(function(err) {
              if (err) {
                return con.rollback(function() {
                  console.error(err)
                });
              }
            });
          })
        })
        connections.scm_root.query(files.vobreport, (errs) => {
          if (errs) console.error(errs)
          console.log('Finished loading VOB.')
          console.log('Generated VOB Report table.')
        })
      })
    })
  })

  console.log('completed');
})







exports.schedule = cron.schedule('30 07 * * *', () => {
  //exports.schedule = cron.schedule('58 10 * * *', () => {
  connections.ideamed.getConnection((err, con) => {
    if (err) console.log('Connection Error.')
    con.query(files.opdatalist, (ideaerr_op, ideares_op) => {
      if (ideaerr_op) console.error(ideaerr_op)
      console.log('Connected to Ideamed.')
      console.log('Inserting Records for opd_details.Please Wait...')
      con.beginTransaction(err => {
        if (err) console.error(err)
        ideares_op.forEach(record => {

          //console.log(record);
          connections.scm_root.query('insert into op_details set ?', record, (error) => {
            if (error) {
              return con.rollback(function() {
                console.error(error)
              });
            }
            con.commit(function(err) {
              if (err) {
                return con.rollback(function() {
                  console.error(err)
                });
              }
            });
          })
        })

      })
    })
  })
  console.log('completed');
})





exports.schedule = cron.schedule('00 07 * * *', () => {
  //exports.schedule = cron.schedule('41 10 * * *', () => {
  var nodemailer = require('nodemailer');
  var fs = require('fs');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'misreport@dragarwal.com',
      pass: 'Welcome@##$$'
    }
  });

  let mailOptions = {
    from: 'misreport@dragarwal.com',
    to: 'nandhakumar.b@dragarwal.com',
    text: ''
  };


  /*yester day */

  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  var dd = yesterday.getDate();
  var mm = yesterday.getMonth() + 1; //January is 0!

  var yyyy = yesterday.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  yesterday = yyyy + '-' + mm + '-' + dd;

  var apiurl = 'https://openexchangerates.org/api/historical/' + yesterday + '.json?app_id=74e52ac0cde843989f9c9c9d5dba2961&base=USD&symbols=TZS,UGX,GHS,ZMW,MUR,RWF,MZN,MGA,NGN,INR,KES';



  /* var d = new Date();
	  var day = d.toLocaleDateString();
	  var dat=d.getDate();
	  //var mon= d.getMonth()+1;
	  var mon=("0" + (d.getMonth()+1)).slice(-2);
	  var yr = d.getFullYear();
	 // var tdat=d.getDate()-1;
	  var tdat=("0" + (d.getDate()-1)).slice(-2);
	  var yesterdaydate=yr+'-'+mon+'-'+tdat;
	  var apiurl = 'https://openexchangerates.org/api/historical/'+yesterdaydate+'.json?app_id=74e52ac0cde843989f9c9c9d5dba2961&base=USD&symbols=TZS,UGX,GHS,ZMW,MUR,RWF,MZN,MGA,NGN,INR,KES';
	  */
  /*yester day */

  //var apiurl = 'https://openexchangerates.org/api/latest.json?app_id=74e52ac0cde843989f9c9c9d5dba2961&base=USD&symbols=TZS,UGX,GHS,ZMW,MUR,RWF,MZN,MGA,NGN,INR,KES';


  request(apiurl, {
    json: true
  }, function(error, response, body) {
    if ((error) || body.hasOwnProperty("error")) {

      mailOptions.subject = "Currency api error :: Api url ::" + apiurl;
      mailOptions.text = body.description;

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      var fileContent = {
        "date": yesterday,
        "Api url": apiurl
      };
      var newfileContent = Object.assign(fileContent, body);
      newfileContent = JSON.stringify(newfileContent) + '\n';
      let fileName = '/home/ubuntu/scmlogs/currency_api_err_' + yyyy + '-' + mm + '.txt';

      fs.appendFile(fileName, newfileContent, function(err) {
        if (err)
          console.log(err);
        else
          console.log('Append operation complete.');
      });
    } else {

      /*var timestamp = body.timestamp;
      var date = new Date(timestamp * 1000);
      var currency_date = date.getFullYear()+'-'+
      ("0" + (date.getMonth() + 1)).slice(-2)+
      '-'+("0" + (date.getDate())).slice(-2);	*/
      for (var key in body.rates) {
        var countrycode = '',
          currencycode = '',
          inr_amount = 0,
          insetquery = '',
          usd_amount = 0;
        if (key !== 'INR') {
          inr_amount = (1 / body.rates[key]) * body.rates['INR'];
          if (key == 'TZS') {
            countrycode = 'TZA'
          } else if (key == 'UGX') {
            countrycode = 'UGD';
          } else if (key == 'GHS') {
            countrycode = 'GHA';
          } else if (key == 'ZMW') {
            countrycode = 'ZMB';
          } else if (key == 'MUR') {
            countrycode = 'MUR';
          } else if (key == 'RWF') {
            countrycode = 'RWD';
          } else if (key == 'MZN') {
            countrycode = 'MZN';
          } else if (key == 'MGA') {
            countrycode = 'MDR';
          } else if (key == 'NGN') {
            countrycode = 'NGA';
          } else if (key == 'KES') {
            countrycode = 'NAB';
          }
        } else {
          countrycode = key;
          inr_amount = body.rates['INR'];
        }
        usd_amount = body.rates[key];
        currencycode = key;
        insetquery = 'insert into currency_rates set INR_rate="' + inr_amount + '",country_code="' + countrycode + '",currency_code="' + currencycode + '",currency_date="' + yesterday + '",USD_rate="' + usd_amount + '",add_date=now()';
        connections.scm_root.query(insetquery, (error1, res1) => {
          if (error1) {
            console.log(error1);
          } else {
            console.log(res1);
          }

        })


      }
      mailOptions.subject = 'Currency api success';
      mailOptions.text = 'Api url ::' + apiurl;
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log('inserted');
    }
  })

  console.log('completed');
})





exports.schedule = cron.schedule('30 08 * * *', () => {
  //exports.schedule = cron.schedule('09 11 * * *',() =>{
  connections.ideamed.getConnection((err, con) => {
    if (err) console.error('connection error');
    con.query(files.collectiondetailim, (collectionerr, collectioneres) => {
      if (collectionerr) console.error(collectionerr);
      console.log("connected to Ideamed");
      console.log('inserting in collection_detail table.please wait.....');
      con.beginTransaction(err => {
        if (err) console.error(err);
        collectioneres.forEach(records => {
          connections.scm_root.query("insert into collection_detail set ?", records, (error) => {
            if (error) {
              return con.rollback(function() {
                console.error(error)
              });
            }
            con.commit(function(err) {
              if (err) {
                return con.rollback(function() {
                  console.error(err);
                });
              }
            })

          })
        })
      })
      console.log('completed');
    })
  })
})




exports.schedule = cron.schedule('30 09 * * *', () => {
  //exports.schedule=cron.schedule('13 11 * * *',()=>{
  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  var dd = yesterday.getDate();
  var mm = yesterday.getMonth() + 1; //January is 0!

  var yyyy = yesterday.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  yesterday = yyyy + '-' + mm + '-' + dd;
  connections.scm_public.query(files.aehcollection_email, function(errs, result1, fields) {
    if (errs) throw err;
    console.log('connected');




    connections.scm_public.query("SELECT PARENT_BRANCH,BRANCH,PAYMENT_OR_REFUND_DATE,(SUM(CASH_AMOUNT)-SUM(REFUND_CASH_AMOUNT)) AS cashamount,(SUM(CARD_AMOUNT)-SUM(REFUND_CARD_AMOUNT)) AS cardamount,(SUM(CHEQUE_AMOUNT)-SUM(REFUND_CHEQUE_AMOUNT)) AS chequeamount,SUM(DD_AMOUNT) AS ddamount,SUM(FUND_TRANSFER_AMOUNT) AS fund_trns_amt,SUM(PAYTM_AMOUNT) AS paym_amt,SUM(CREDIT_CHEQUE_AMOUNT) AS cred_che_amt,SUM(CREDIT_CASH_AMOUNT) AS cred_cash_amt,SUM(PAYTM_CASH_AMOUNT) AS paytm_cach_amt,SUM(PAYTM_FUND_AMOUNT) AS paytm_fund_amt FROM collection_detail WHERE PAYMENT_OR_REFUND_DATE=DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND PARENT_BRANCH IN ('AEH','AHC','AHI') GROUP BY branch", function(errs, result, fields) {
      if (errs) throw err;
      console.log('executed');

      var frmid = '';
      var toid = '';
      var bccid = '';
      var ccid = '';
      var passcode = '';
      for (var j = 0; j < result1.length; j++) {
        frmid = result1[j].fromid
        toid = result1[j].toid
        bccid = result1[j].bccid
        ccid = result1[j].ccid
        passcode = result1[j].passcode

      }
      var nodemailer = require('nodemailer');
      console.log(frmid);
      console.log(passcode);

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: frmid,
          pass: passcode
        }
      });

      var table = '';
      console.log(result);
      console.log(result.length);
      if (result.length > 0) {


        for (i = 0; i < result.length; i++) {
          table += '<tr> <td >' + result[i].PAYMENT_OR_REFUND_DATE + '</td> <td>' + result[i].BRANCH + '</td><td>' + result[i].PARENT_BRANCH + '</td> <td>' + result[i].cashamount + '</td> <td>' + result[i].cardamount + '</td> <td>' + result[i].chequeamount + '</td> <td>' + result[i].paym_amt + '</td> <td>' + result[i].ddamount + '</td> <td>' + result[i].fund_trns_amt + '</td> </tr>';
        }
        table = '<html><body> <table border="1" cellspacing="0"><tr><th colspan="17">Branches Collection Report On ' + yesterday + ' </th></tr><tr><th>DATE</th><th>BRANCH</th><th>ENTITY</th><th>CASH</th><th>CARD</th><th>CHEQUE</th> <th>PAYTM</th><th>DD</th> <th>FUND TRANSFER</th></tr>' + table + ' </table> <br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p> </body> </html> ';
      } else {
        table = "No Collections in Branches ";
      }

      console.log(table);

      let mailOptions = {
        from: frmid,
        to: toid,
        bcc: bccid,
        cc: ccid,
        subject: 'Branches Collection Report On ' + yesterday,
        html: table
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


    })
  })

})
