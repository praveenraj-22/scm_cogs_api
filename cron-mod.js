const connections = require('./modules').connections
const cron = require('./modules').cron
const files = require('./modules').sqls
const request = require('request')
const dlog = require("./daily_log.js");
const routes = require('./modules').routes
const nativeFunctions = require('./modules').nativeFunctions


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

          var sugCogsPer = '';
          var optCogsPer = '';
          var pharCogsPer = '';
          var mcCogsPer = '';
          var sugCogsPerColr = '';
          var optCogsPerColr = '';
          var pharCogsPerColr = '';
          var mcCogsPerColr = '';

          sugCogsPer = result[i].surgery_cogs_perc;
          optCogsPer = result[i].optical_cogs_perc;
          pharCogsPer = result[i].pharmacy_cogs_perc;
          mcCogsPer = result[i].Consump;

          if (sugCogsPer != null) {
            sugCogsPer = sugCogsPer.replace("%", "");
          }
          if (optCogsPer != null) {
            optCogsPer = optCogsPer.replace("%", "");
          }
          if (pharCogsPer != null) {
            pharCogsPer = pharCogsPer.replace("%", "");
          }
          if (mcCogsPer != null) {
            mcCogsPer = mcCogsPer.replace("%", "");
          }

          if (sugCogsPer < 10 || sugCogsPer > 13) {
            sugCogsPerColr = 'background-color:red';
          }

          if (pharCogsPer < 55 || pharCogsPer > 65) {
            pharCogsPerColr = 'background-color:red';
          }

          if (optCogsPer < 30 || optCogsPer > 35) {
            optCogsPerColr = 'background-color:red';
          }





          table += '<tr align="right"><td>' + result[i].entity + '</td><td>' + result[i].branch + '</td><td>' + result[i].surgery_revenue + '</td> <td>' + result[i].optical_revenue + '</td> <td>' + result[i].pharmacy_revenue + '</td> <td>' + result[i].mtd_revenue + '</td> <td style="background-color:#FFFF33">' + result[i].surgery_revenue_perc + '</td> <td style="background-color:#FFFF33"> ' + result[i].opticals_revenue_perc + '</td><td style="background-color:#FFFF33">' + result[i].pharmacy_revenue_perc + '</td> <td>' + result[i].surgery_cogs + '</td> <td>' + result[i].opticals_cogs + '</td><td>' + result[i].pharmacy_cogs + '</td><td>' + result[i].mtd_cogs + '</td><td style="' + sugCogsPerColr + '">' + result[i].surgery_cogs_perc + '</td><td style="' + optCogsPerColr + '">' + result[i].optical_cogs_perc + '</td><td style="' + pharCogsPerColr + '">' + result[i].pharmacy_cogs_perc + '</td><td>' + result[i].Consump + '</td>  </tr>';
          date = result[i].today_date;

        }

        table = '<html><body><table border="0"><tr><th colspan="17">Revenue vs Cogs ' + tablemonth + ' </th></tr><tr><th></th><th></th><th colspan ="4">Revenue</th><th colspan="3" style="background-color:#FFFF33">Revenue Contribution</th><th colspan="4">COGS</th><th colspan="3">COGS %</th><th>Material</th></tr><tr><th>Entity</th><th>Branch</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th><th>MTD</th> <th style="background-color:#FFFF33">Surgery</th> <th style="background-color:#FFFF33">Opticals</th> <th style="background-color:#FFFF33">Pharmacy</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th> <th>MTD</th> <th style="background-color:#FFFF33">Surgery</th><th style="background-color:#FFFF33">Opticals</th><th style="background-color:#FFFF33">Pharmacy</th><th style="background-color:#9ACD32">Consump %</th> </tr>' + table + ' </table> <br><p>Dear SCH Team,</p><p>This is top level data on Revenue Mix % & COGs % for each category.</p> <br> <p>Please use this data to:</p> <ol type="1"> <li>Immediately address consumption entry lags on daily basis</li><li>Review individual Surgery/Optical/Pharmacy COGs% variance & compare best ones in your regions & to push implement alternates.</li><li>Final COGs will be after adjusting Credit notes on Optical lens/Drugs turnover discounts & adjustments to old payables/provisions.</li> </ol> <p>For detailed information on your centres please Login into the application <a href="https://app.carehis.com">https://app.carehis.com</a>  using your login ID</p> <br><ol type="1"><li>For Revenue details: check out Revenue report & Item wise sales report.</li><li>For COGs details: check out Cost of Goods Sold report.</li></ol><br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p> </body> </html> ';
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


          var sugCogsPer = '';
          var optCogsPer = '';
          var pharCogsPer = '';
          var mcCogsPer = '';
          var sugCogsPerColr = '';
          var optCogsPerColr = '';
          var pharCogsPerColr = '';
          var mcCogsPerColr = '';

          sugCogsPer = result[i].surgery_cogs_perc;
          optCogsPer = result[i].optical_cogs_perc;
          pharCogsPer = result[i].pharmacy_cogs_perc;
          mcCogsPer = result[i].Consump;

          if (sugCogsPer != null) {
            sugCogsPer = sugCogsPer.replace("%", "");
          }
          if (optCogsPer != null) {
            optCogsPer = optCogsPer.replace("%", "");
          }
          if (pharCogsPer != null) {
            pharCogsPer = pharCogsPer.replace("%", "");
          }
          if (mcCogsPer != null) {
            mcCogsPer = mcCogsPer.replace("%", "");
          }

          /*if(sugCogsPer >=11 && sugCogsPer <=13){
				   sugCogsPerColr = 'background-color:yellow';
			   }else if(sugCogsPer <11){
				   sugCogsPerColr = 'background-color:green';
			   }else{
				   sugCogsPerColr = 'background-color:red';
			   }

			   if(pharCogsPer >=55 && pharCogsPer <=60){
				   pharCogsPerColr = 'background-color:yellow';
			   }else if(pharCogsPer <55){
				   pharCogsPerColr = 'background-color:green';
			   }else{
				   pharCogsPerColr = 'background-color:red';
			   }

			   if(optCogsPer >=30 && optCogsPer <=35){
				   optCogsPerColr = 'background-color:yellow';
			   }else if(optCogsPer <30){
				   optCogsPerColr = 'background-color:green';
			   }else{
				   optCogsPerColr = 'background-color:red';
			   }

			   if(mcCogsPer >=21 && mcCogsPer <=23){
				   mcCogsPerColr = 'background-color:yellow';
			   }else if(mcCogsPer <21){
				   mcCogsPerColr = 'background-color:green';
			   }else{
				   mcCogsPerColr = 'background-color:red';
			   }*/

          if (sugCogsPer < 10 || sugCogsPer > 13) {
            sugCogsPerColr = 'background-color:red';
          }

          if (pharCogsPer < 55 || pharCogsPer > 65) {
            pharCogsPerColr = 'background-color:red';
          }

          if (optCogsPer < 30 || optCogsPer > 35) {
            optCogsPerColr = 'background-color:red';
          }




          table += '<tr align="right"><td>' + result[i].entity + '</td><td>' + result[i].branch + '</td><td>' + result[i].surgery_revenue + '</td> <td>' + result[i].optical_revenue + '</td> <td>' + result[i].pharmacy_revenue + '</td> <td>' + result[i].mtd_revenue + '</td> <td style="background-color:#FFFF33">' + result[i].surgery_revenue_perc + '</td> <td style="background-color:#FFFF33"> ' + result[i].opticals_revenue_perc + '</td><td style="background-color:#FFFF33">' + result[i].pharmacy_revenue_perc + '</td> <td>' + result[i].surgery_cogs + '</td> <td>' + result[i].opticals_cogs + '</td><td>' + result[i].pharmacy_cogs + '</td><td>' + result[i].mtd_cogs + '</td><td style="' + sugCogsPerColr + '">' + result[i].surgery_cogs_perc + '</td><td style="' + optCogsPerColr + '">' + result[i].optical_cogs_perc + '</td><td style="' + pharCogsPerColr + '">' + result[i].pharmacy_cogs_perc + '</td><td>' + result[i].Consump + '</td>  </tr>';
          date = result[i].today_date;

        }

        table = '<html><body><p>Dear SCH Team,</p><p>This is top level data on Revenue Mix % & COGs % for each category.</p> <br> <table border="0"><tr><th colspan="17">Revenue vs Cogs ' + date + ' </th></tr><tr><th></th><th></th><th colspan ="4">Revenue</th><th colspan="3" style="background-color:#FFFF33">Revenue Contribution</th><th colspan="4">COGS</th><th colspan="3">COGS %</th><th>Material</th></tr><tr><th>Entity</th><th>Branch</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th><th>MTD</th> <th style="background-color:#FFFF33">Surgery</th> <th style="background-color:#FFFF33">Opticals</th> <th style="background-color:#FFFF33">Pharmacy</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th> <th>MTD</th> <th style="background-color:#FFFF33">Surgery</th><th style="background-color:#FFFF33">Opticals</th><th style="background-color:#FFFF33">Pharmacy</th><th style="background-color:#9ACD32">Consump %</th> </tr>' + table + ' </table> <br><p>Please use this data to:</p> <ol type="1"> <li>Immediately address consumption entry lags on daily basis</li><li>Review individual Surgery/Optical/Pharmacy COGs% variance & compare best ones in your regions & to push implement alternates.</li><li>Final COGs will be after adjusting Credit notes on Optical lens/Drugs turnover discounts & adjustments to old payables/provisions.</li> </ol> <p>For detailed information on your centres please Login into the application <a href="https://app.carehis.com">https://app.carehis.com</a>  using your login ID</p> <br><ol type="1"><li>For Revenue details: check out Revenue report & Item wise sales report.</li><li>For COGs details: check out Cost of Goods Sold report.</li></ol><br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p> </body> </html> ';
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


exports.schedule = cron.schedule('36 10 * * *', () => {
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

  connections.ideamed.getConnection((err, con) => {
    if (err) console.log("connections err");
    let queryres = "SELECT  BPB.ID as 'bill_id',BPB.BILL_NO as 'bill_no',BPB.TPA_CLAIM_ID as 'tpa_claim' FROM BILL_PATIENT_BILL AS BPB WHERE DATE(REVENUE_DATE)=DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND CLAIM_AMOUNT >0";
    con.query(queryres, (err, res) => {
      if (err) console.error(err);
      console.log("connected to ideamed");
      console.log("inserting record for tpa bill.. please wait");
      con.beginTransaction(err => {
        if (err) console.error(err);
        res.forEach(record => {
          connections.scm_root.query("insert into revenue_detail_tpa set ?", record, (error) => {
            if (error) {
              return con.rollback(function() {
                console.error(error);
              })
            }
            con.commit(function(err) {
              if (error) {
                return con.rollback(function() {
                  console.error(error);
                })
              }

            })

          });
        });
      });
    });
  })
console.log("completed");
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
  //exports.schedule = cron.schedule('30 11 * * *', () => {
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

  var apiurl = 'http://openexchangerates.org/api/historical/' + yesterday + '.json?app_id=74e52ac0cde843989f9c9c9d5dba2961&base=USD&symbols=TZS,UGX,GHS,ZMW,MUR,RWF,MZN,MGA,NGN,INR,KES';



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
  //exports.schedule=cron.schedule('39 16 * * *',()=>{
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




    connections.scm_public.query("SELECT PARENT_BRANCH,BRANCH,PAYMENT_OR_REFUND_DATE,(SUM(CASH_AMOUNT)-SUM(REFUND_CASH_AMOUNT)) AS cashamount,(SUM(CARD_AMOUNT)-SUM(REFUND_CARD_AMOUNT)) AS cardamount,(SUM(CHEQUE_AMOUNT)-SUM(REFUND_CHEQUE_AMOUNT)) AS chequeamount,SUM(DD_AMOUNT) AS ddamount,SUM(FUND_TRANSFER_AMOUNT) AS fund_trns_amt,SUM(PAYTM_AMOUNT) AS paym_amt,SUM(CREDIT_CHEQUE_AMOUNT) AS cred_che_amt,SUM(CREDIT_CASH_AMOUNT) AS cred_cash_amt,SUM(PAYTM_CASH_AMOUNT) AS paytm_cach_amt,SUM(PAYTM_FUND_AMOUNT) AS paytm_fund_amt,ONLINE_AMOUNT FROM collection_detail WHERE PAYMENT_OR_REFUND_DATE=DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND PARENT_BRANCH IN ('AEH','AHC','AHI') GROUP BY branch", function(errs, result, fields) {
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
          table += '<tr> <td >' + result[i].PAYMENT_OR_REFUND_DATE + '</td> <td>' + result[i].BRANCH + '</td><td>' + result[i].PARENT_BRANCH + '</td> <td>' + result[i].cashamount + '</td> <td>' + result[i].cardamount + '</td> <td>' + result[i].chequeamount + '</td> <td>' + result[i].paym_amt + '</td> <td>' + result[i].ddamount + '</td> <td>' + result[i].fund_trns_amt + '</td><td>' + result[i].ONLINE_AMOUNT + '</td> </tr>';
        }
        table = '<html><body> <table border="1" cellspacing="0"><tr><th colspan="17">Branches Collection Report On ' + yesterday + ' </th></tr><tr><th>DATE</th><th>BRANCH</th><th>ENTITY</th><th>CASH</th><th>CARD</th><th>CHEQUE</th> <th>PAYTM</th><th>DD</th> <th>FUND TRANSFER</th><th>ONLINE AMOUNT</th></tr>' + table + ' </table> <br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p> </body> </html> ';
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

exports.schedule = cron.schedule('45 07 * * *', () => {
  //exports.schedule = cron.schedule('02 16 * * *', () => {
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
  var filepath = '/home/ubuntu/scmlogs/ava_email_cron_' + '_' + yesterday + '.txt';
  //var filepath = 'D:/git/cogs-api-new-final/ava_email_cron_'+'_'+yesterday+'.txt';
  routes.main_route_usage_tracker_new_email(yesterday, (_err, _res) => {
    if (_err) {
      console.log(_err);
      dlog.log(_err, filepath);
      dlog.cronErrEmail("AVA email not sent", _err);
    } else {

      nativeFunctions.avaDemoEmail(_res, yesterday).then(
        (emailtemp) => {
          routes.avaEmailList(emailtemp, (_err1, emailres) => {
            if (_err1) {
              console.log(_err1);
              dlog.log(_err1, filepath);
              dlog.cronErrEmail("AVA email not sent", _err1);
            } else {
              dlog.cronEmail(emailtemp, emailres, yesterday, (_err2, _res2) => {
                if (_err2) {
                  console.log(_err2);
                  dlog.log(_err2, filepath);
                  dlog.cronErrEmail("AVA email not sent", "error in cronEmail");
                } else {
                  console.log(_res2);
                }
              })

            }

          })

        })

    }
  });

})
// praveen validation of claim Amount
exports.schedule = cron.schedule('45 10 * * *', () => {
  var d = new Date();
  var day = d.toLocaleDateString();
  var dat = d.getDate();
  var mon = d.getMonth() + 1;
  var yr = d.getFullYear();
  var tdat = d.getDate() - 1;
  var todaydate = yr + '/' + mon + '/' + dat;
  var fixdate = yr + '/' + mon + '/' + 1;
  var tabledate = tdat + '/' + mon + '/' + yr;
  console.log("hit");
  if (fixdate == todaydate) {
    console.log('Same date');
  } else {
    connections.scm_public.query("SELECT  fromid,toid,bccid,ccid,passcode FROM email WHERE scmtype='claimamtvalid'", function(err, result1, fields) {
      if (err) throw err;
      //  console.log(result1);
      console.log("connected to mis");
      connections.ideamed.query(files.claimamountvalid, function(err, result, fields) {
        if (err) throw err;
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
        // console.log(frmid);
        // console.log(passcode);

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: frmid,
            pass: passcode
          }
        });

        var table = '';
        var branch = '';
        var billno = '';
        var billdate = '';
        var revenuedate = '';
        var mrn = '';
        var payor = '';
        var billamount = '';
        var discount = '';
        var netamount = '';
        var paidamount = '';
        var billclaimamount = '';
        var servicclaimamount = '';
        var salesclaimamount = '';
        var servicedetailclaimamount = '';
        var type = '';

        for (var i = 0; i < result.length; i++) {
          branch = result[i].BRANCH;
          billno = result[i].BILLNO;
          billdate = result[i].BILLDATE;
          revenuedate = result[i].REVENUEDATE;
          mrn = result[i].MRN;
          payor = result[i].PAYOR;
          billamount = result[i].BILLAMOUNT;
          discount = result[i].DISCOUNT;
          netamount = result[i].NETAMOUNT;
          paidamount = result[i].PAIDAMOUNT;
          billclaimamount = result[i].BILLCLAIMAMOUNT;
          servicclaimamount = result[i].SERVICECLAIMAMOUNT;
          salesclaimamount = result[i].SALESCLAIMAMOUNT;
          servicedetailclaimamount = result[i].SALESDETAILCLAIMAMOUNT;
          type = result[i].TYPE;

          table += '<tr> <td >' + branch + '</td> <td>' + billno + '</td> <td>' + billdate + '</td><td>' + revenuedate + '</td> <td>' + mrn + '</td> <td>' + payor + '</td> <td>' + billamount + '</td> <td>' + discount + '</td> <td>' + netamount + '</td> <td>' + paidamount + '</td> <td>' + billclaimamount + '</td> <td>' + servicclaimamount + '</td> <td>' + salesclaimamount + '</td> <td>' + servicedetailclaimamount + '</td> <td>' + type + '</td> <td>'
        }
        table = '<html><body> <table border="1"><tr><th colspan="17">Claim amount validation as on ' + tabledate + ' </th></tr><tr><th>Branch</th><th>Bill no</th><th>Bill date</th><th>Revenue date</th> <th>Mrn</th><th>Payor</th> <th>Bill Amount</th><th>Discount</th><th>Net Amount</th><th>Paid Amount</th> <th>Bill Claim Amount</th><th>Service Claim Amount</th> <th>Sales Claim Amount</th> <th>Servicedetail Claim Amount</th><th>Type</th> </tr>' + table + ' </table> <br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p> </body> </html> ';

        //console.log(table);
        let mailOptions = {
          from: frmid,
          to: toid,
          bcc: bccid,
          cc: ccid,
          subject: 'Claim Amount validation in ideamed ' + tabledate,
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
