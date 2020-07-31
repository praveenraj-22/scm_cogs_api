const mods = require("./modules");
const _ = require('./modules')._;
const uuid = mods.uuid;

const connections = mods.connections;
const files = mods.sqls;
var async = require("async");
let sess = null;

var regionMapping = {
  'AEH': {
    'Chennai': ['CMH', 'ANN', 'ASN', 'AVD', 'NLR', 'PMB', 'PRR', 'TLR', 'TRC', 'VLC'],
    'ROI': ['JPR'],
    'ROTN': ['KNP', 'VLR', 'KBK', 'NVL', 'VPM', 'DHA', 'SLM', 'KSN', 'ERD', 'HSR', 'MDU']
  },
  'AHC': {
    'AMN': ['AMN'],
    'AP': ['VMH', 'NEL', 'GUN', 'TPT', 'RAJ'],
    'Chennai': ['TBM', 'ADY', 'EGM', 'MGP', 'NWP', 'AMB', 'TVT'],
    'KA': ['BMH', 'WFD', 'KML', 'CLR', 'INR', 'PNR', 'YLK', 'HUB', 'MCC', 'MYS', 'SVR', 'BSK', 'RRN', 'RJN'],
    'Maharashtra': ['VSH', 'PUN', 'HDP', "CMR", "KTD"],
    "Madhya Pradesh": ["JWS", "APR", "ATA", "KWA"],
    'OD': ['CTK', 'BHU'],
    'ROI': ['PDY', 'TVM', 'KTM', 'AHM', "JWS", "APR", "ATA", "KWA"],
    'ROTN': ['TVL', 'TCN', 'APM', 'TRI', 'TNJ', 'TPR', 'CMB'],
    'TS': ['DNR', 'HMH', 'MDA', 'SNR', 'HIM', 'SBD', 'MPM', 'GCB'],
    'WB': ['KOL', 'KAS'],
    'Kerala': ['TVM', 'KTM']
  },
  'Chennai': ['CMH', 'ANN', 'ASN', 'AVD', 'NLR', 'PMB', 'PRR', 'TLR', 'TRC', 'VLC', 'TBM', 'ADY', 'EGM', 'MGP', 'NWP', 'AMB', 'TVT'],
  'ROTN': ['KNP', 'VLR', 'KBK', 'NVL', 'VPM', 'DHA', 'SLM', 'KSN', 'ERD', 'HSR', 'MDU', 'TVL', 'TCN', 'APM', 'TRI', 'TNJ', 'TPR', 'CMB'],
  'ROI': ['JPR', 'PDY', 'TVM', 'KTM', 'AHM', "JWS", "APR", "ATA", "KWA"],
  'KA': ['BMH', 'WFD', 'KML', 'CLR', 'INR', 'PNR', 'YLK', 'HUB', 'MCC', 'MYS', 'SVR', 'BSK', 'RRN', 'RJN'],
  'TS': ['DNR', 'HMH', 'MDA', 'SNR', 'HIM', 'SBD', 'MPM', 'GCB'],
  'AMN': ['AMN'],
  'AP': ['VMH', 'NEL', 'GUN', 'TPT', 'RAJ'],
  'WB': ['KOL', 'KAS'],
  'OD': ['CTK', 'BHU'],
  'Maharashtra': ['VSH', 'PUN', 'HDP', "CMR", "KTD"],
  "Madhya Pradesh": ["JWS", "APR", "ATA", "KWA"],
  'Kerala': ['TVM', 'KTM']

};


exports.main_route = (req, res) => {
  //  console.log('main_route');
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";
  connections.scm_public.query(files.cogsSuper, [mtddate, ftddate], function(
    error,
    cogsresults
  ) {
    if (error) console.error(error);
    connections.scm_public.query(
      files.revenueSuper,
      [mtddate, ftddate],
      (error, revresults) => {
        if (error) console.error(error);
        connections.scm_public.query(
          "select * from branches",
          (err, branchres) => {
            if (err) console.error(err);
            connections.scm_public.query(
              files.vobSuper,
              [mtddate, ftddate],
              (voberr, vobres) => {
                if (voberr) console.error(voberr);
                connections.scm_public.query(files.currency_det_last_mth, (currency_last_err, currency_last_res) => {
                  if (currency_last_err) console.error(currency_last_err)
                  connections.scm_public.query(files.currency_details, [mtddate, ftddate], (currencyerr, currencyres) => {
                    if (currencyerr) console.error(currencyerr)
                    connections.scm_public.query(
                      files.breakupSuper,
                      [ftddate, ftddate],
                      (breakuperr, breakupres) => {
                        if (breakuperr) console.error(breakuperr);
                        connections.scm_public.query(
                          files.breakupmtdSuper,
                          [mtddate, ftddate],
                          (breakupmtderr, breakupmtdres) => {
                            if (breakupmtderr) console.error(breakupmtderr);
                            mods.functions
                              .adminMain(
                                cogsresults,
                                revresults,
                                branchres,
                                ftddate,
                                vobres,
                                currencyres,
                                currency_last_res,
                                breakupres,
                                breakupmtdres
                              )
                              .then(final => res.json(final));
                          }
                        );
                      }
                    );
                  })
                })
              }
            );
          }
        );
      }
    );
  });
  // }
};

exports.main_route_revenue = (req, res) => {
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
  //  console.log('main_route_revenue');
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";
  connections.scm_public.query(
    files.nativerevenueSuper,
    [mtddate, ftddate],
    (error, revresults) => {
      if (error) console.error(error);
      connections.scm_public.query(
        "select * from branches",
        (err, branchres) => {
          if (err) console.error(err);
          connections.scm_public.query(
            files.nativebreakupSuper,
            [ftddate, ftddate],
            (breakuperr, breakupres) => {
              if (breakuperr) console.error(breakuperr);
              connections.scm_public.query(
                files.nativebreakupmtdSuper,
                [mtddate, ftddate],
                (breakupmtderr, breakupmtdres) => {
                  if (breakupmtderr) console.error(breakupmtderr);
                  mods.nativeFunctions
                    .adminMainNative(
                      revresults,
                      branchres,
                      ftddate,
                      breakupres,
                      breakupmtdres
                    )
                    .then(final => res.json(final));
                }
              );
            }
          );
        }
      );
    }
  );
  // }
};

exports.choose_route = (req, res) => {
  //  console.log('choose_route');
  if (sess.role === "super_user") {
    //  console.log(sess.role);
    this.main_route(req, res);
  } else {
    //    console.log(sess.role);
    this.test_route(req, res);
  }
};

exports.health = (req, res) => {
  res.json({
    msg: "Am ALIVE!!!."
  });
};

exports.logout = (req, res) => {
  // mods.sessionStore.close()
  this.sess = null;
  res.json({
    isAuthenticated: false
  });
};

// Local test code

exports.testLogin = (req, res) => {
  console.log("hit");
  let user = req.body.user.trim();
  let pass = req.body.pass.trim();
  connections.scm_public.query(
    "select * from users where emp_id = ? and password = ? and is_active=1 GROUP BY role,NAME",
    [user, pass],
    (err, result) => {
      console.log(result);
      if (err) console.error(err);
      // console.log("length : " + result.length);
      if (result.length === 0) {
        console.log("error");
        res.json({
          isAuthenticated: false
        });

      } else if (result.length === 2) {
        console.log("hit");
        if ((result[0].role === 'ch_user') && (result[1].role == 'normal_user')) {

          console.log("hit in two roles");
          console.log("roles 1 : " + result[0].role);
          console.log("roles 2 : " + result[1].role);
          connections.scm_public.query("update  users set last_login=now() where emp_id ='" + user + "' ", (err1, result) => {
            if (err) console.error(err1);
          });


          res.json({
            isAuthenticated: true,
            role: result[0].role,
            role1: result[1].role,
            userName: result[0].name
          });
          sess = req.session;
          sess.role = result[0].role;
          if (sess.role === "normal_user") {
            sess.normalUser = user;
          }
          if (sess.role === "super_user") {
            sess.superUser = user;
          }
          if (sess.role === 'ch_user') {
            sess.superUser = user;
          }

          if (sess.role === 'fin_user') {
            sess.superUser = user;
          }
        } else if ((result[0].role === 'normal_user') && (result[1].role === 'sch_user')) {
          console.log("hit in sch user");

          console.log("hit in two roles");
          console.log("roles 1 : " + result[0].role);
          console.log("roles 2 : " + result[1].role);
          connections.scm_public.query("update  users set last_login=now() where emp_id ='" + user + "' ", (err1, result) => {
            if (err) console.error(err1);
          });


          res.json({
            isAuthenticated: true,
            role: result[1].role,
            role1: result[0].role,
            userName: result[1].name
          });

          sess = req.session;
          sess.role = result[1].role;
          console.log(sess.role);
          if (sess.role === "normal_user") {
            sess.normalUser = user;
          }
          if (sess.role === "super_user") {
            sess.superUser = user;
          }
          if (sess.role === 'sch_user') {
            sess.superUser = user;
          }

        } else if ((result[0].role === 'fin_user') && (result[1].role === 'super_user')) {
          console.log("hit in fin user");
          console.log("hit in two roles");
          console.log("roles 1 : " + result[0].role);
          console.log("roles 2 : " + result[1].role);

          connections.scm_public.query("update  users set last_login=now() where emp_id ='" + user + "' ", (err1, result) => {
            if (err) console.error(err1);
          });

          res.json({
            isAuthenticated: true,
            role: result[1].role,
            role1: result[0].role,
            userName: result[1].name
          });
          sess = req.session;
          sess.role = result[0].role;
          console.log(sess.role);
          if (sess.role === "normal_user") {
            sess.normalUser = user;
          }
          if (sess.role === "super_user") {
            sess.superUser = user;
          }
          if (sess.role === 'sch_user') {
            sess.superUser = user;
          }
          if (sess.role === 'fin_user') {
            sess.superUser = user;
          }


        }



      } else {
        console.log("roles_else : " + result[0].role);
        connections.scm_public.query("update  users set last_login=now() where emp_id ='" + user + "' ", (err1, result) => {
          console.log("update timedate");
          if (err) console.error(err1);

        });
        res.json({
          isAuthenticated: true,
          role: result[0].role,
          userName: result[0].name
        });

        console.log("role : " + result[0].role);
        console.log("name : " + result[0].name);
        sess = req.session;
        console.log(sess);

        sess.role = result[0].role;
        if (sess.role === "normal_user") {
          sess.normalUser = user;
        }
        if (sess.role === "super_user") {
          sess.superUser = user;
        }
        if (sess.role === 'ch_user') {
          sess.superUser = user;
        }
        if (sess.role === 'sch_user') {
          sess.superUser = user;
        }
        if (sess.role === 'fin_user') {
          sess.superUser = user;
        }

      }
    }
  );

};



exports.changePassword = (req, res) => {
  //  console.log('testLogin');
  let user = req.body.user.trim();
  let pass = req.body.confirmpassword.trim();

  console.log("update  users set password='" + pass + "' where emp_id ='" + user + "' ");
  connections.scm_public.query("update  users set password='" + pass + "' where emp_id ='" + user + "'", (err1, result) => {
    if (err1) {
      res.json({
        isAuthenticated: false
      });
    } else {
      res.json({
        isAuthenticated: true
      });
    }

  });
};

exports.test_route = (req, res) => {
  //console.log('test_route');
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let individualBranches = [];
  let branchGroups = [];
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";
  // let emp = JSON.parse(mods.session.user)
  let emp = req.params.name;
  connections.scm_public.query(
    "select * from users where emp_id = ? and is_active=1 and role not in ('ch_user','sch_user','fin_user')",
    [emp],
    (err, userRes) => {
      if (err) console.log(err);
      userRes.forEach(element => {
        if (element.branches.length < 4) {
          individualBranches.push(element.branches);
        } else {
          branchGroups.push(element.branches);
          let value = element.branches.split("=")[1];
          if (!mods._.includes(value, "+")) {
            individualBranches.push(value);
          }
        }
      });
      connections.scm_public.query(
        files.cogs,
        [mtddate, ftddate, individualBranches],
        function(error, cogsresults) {
          if (error) console.error(error);
          connections.scm_public.query(
            files.revenue,
            [mtddate, ftddate, individualBranches],
            (error, revresults) => {
              if (error) console.error(error);
              connections.scm_public.query(
                "select * from branches",
                (err, branchres) => {
                  if (err) console.error(err);
                  connections.scm_public.query(
                    files.vob,
                    [mtddate, ftddate, individualBranches],
                    (voberr, vobres) => {
                      if (voberr) console.error(voberr);
                      // connections.scm_public.query(
                      // files.surgCount,
                      // [mtddate, ftddate],
                      // (surgerr, surgres) => {
                      // if (surgerr) console.error(surgerr);
                      // connections.scm_public.query(files.cogsCount, [mtddate, ftddate], (counterr, countres) => {
                      // if (counterr) console.error(counterr)
                      connections.scm_public.query(
                        files.breakup,
                        [mtddate, ftddate, individualBranches],
                        (breakuperr, breakupres) => {
                          if (breakuperr) console.error(breakuperr);
                          connections.scm_public.query(
                            files.breakupmtd,
                            [mtddate, ftddate, individualBranches],
                            (breakupmtderr, breakupmtdres) => {
                              if (breakupmtderr) console.error(breakupmtderr);
                              mods.functions
                                .othersMain(
                                  cogsresults,
                                  revresults,
                                  individualBranches,
                                  branchGroups,
                                  branchres,
                                  ftddate,
                                  vobres,
                                  // surgres,
                                  // countres,
                                  breakupres,
                                  breakupmtdres
                                )
                                .then(final => res.json(final));
                            }
                          );
                        }
                      );
                      // })
                      // }
                      // );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.test_route_revenue = (req, res) => {
  //  console.log('test_route_revenue');
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let individualBranches = [];
  let branchGroups = [];
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";
  // let emp = JSON.parse(mods.session.user)
  let emp = req.params.name;
  connections.scm_public.query(
    "select * from users where emp_id = ? and is_active=1 and role not in ('ch_user','sch_user','fin_user') ",
    [emp],
    (err, userRes) => {
      if (err) console.log(err);
      userRes.forEach(element => {
        if (element.branches.length < 4) {
          individualBranches.push(element.branches);
        } else {
          branchGroups.push(element.branches);
          let value = element.branches.split("=")[1];
          if (!mods._.includes(value, "+")) {
            individualBranches.push(value);
          }
        }
      });
      connections.scm_public.query(
        files.nativerevenue,
        [mtddate, ftddate, individualBranches],
        (error, revresults) => {
          if (error) console.error(error);
          connections.scm_public.query(
            "select * from branches",
            (err, branchres) => {
              if (err) console.error(err);
              connections.scm_public.query(
                files.nativebreakup,
                [mtddate, ftddate, individualBranches],
                (breakuperr, breakupres) => {
                  if (breakuperr) console.error(breakuperr);
                  connections.scm_public.query(
                    files.nativebreakupmtd,
                    [mtddate, ftddate, individualBranches],
                    (breakupmtderr, breakupmtdres) => {
                      if (breakupmtderr) console.error(breakupmtderr);
                      mods.nativeFunctions
                        .othersMainNative(
                          revresults,
                          individualBranches,
                          branchGroups,
                          branchres,
                          ftddate,
                          breakupres,
                          breakupmtdres
                        )
                        .then(final => res.json(final));
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.chart = (req, res) => {
  let date = req.params.date.split("-");
  let year = date[0];
  let month = date[1];
  let day = daysInMonth(month, year);
  let start = year + "-" + month + "-" + "01";
  let end = year + "-" + month + "-" + day;
  let targetCol = getColumn(year, month);
  connections.scm_public.query(
    files.chart,
    [start, end],
    (charterr, chartres) => {
      if (charterr) console.error(charterr);
      connections.ideamed.query(
        files.opCount,
        [start, end, start, end],
        (opcounterr, opcountres) => {
          if (opcounterr) console.error(opcounterr);
          connections.scm_public.query(
            `SELECT b.code,t.${targetCol} FROM target t JOIN branches b ON b.branch = t.branch`,
            [targetCol],
            (targeterr, targetres) => {
              if (targeterr) console.error(targeterr);
              mods.chart
                .chartLogic(
                  chartres,
                  targetres,
                  targetCol.slice(1, targetCol.length - 1),
                  opcountres
                )
                .then(final => res.json(final));
            }
          );
        }
      );
    }
  );
};

exports.branches = (req, res) => {
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
  //  console.log('main_route_revenue');
  let entity = req.params.entity;
  let region = req.params.region;
  console.log('SELECT branch as text,code as shortCode FROM branches WHERE entity = "' + entity + '" and region="' + region + '" AND is_active=1');
  connections.scm_public.query(
    files.branchlist,
    [entity, region],
    (error, branchresults) => {
      if (error) console.error(error);
      res.json(branchresults);
    }
  );
  // }
};

exports.region = (req, res) => {
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
  //  console.log('main_route_revenue');
  let entity = req.params.entity;

  connections.scm_public.query(
    files.regionlist,
    [entity],
    (error, regionresults) => {
      if (error) console.error(error);
      res.json(regionresults);
    }
  );
  // }
};

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function getColumn(year, month) {
  let yearTar = String(year).slice(2);
  let months = {
    1: "jan",
    2: "feb",
    3: "mar",
    4: "apr",
    5: "may",
    6: "jun",
    7: "jul",
    8: "aug",
    9: "sep",
    10: "oct",
    11: "nov",
    12: "dec"
  };
  if (String(month).charAt(0) === "0") {
    return "`" + months[String(month).replace(0, "")] + "-" + yearTar + "`";
  } else {
    return "`" + months[month] + "-" + yearTar + "`";
  }
}


function whereConditionBuild(argEntity, argRegion) {

  if (argEntity != 'undefined' && argRegion != 'undefined') {
    var branchesarr = regionMapping[argEntity][argRegion];
  } else if (argEntity == 'undefined' && argRegion != 'undefined') {
    var branchesarr = regionMapping[argRegion];
  }

  var branchIN = '';
  var branchlist = '';
  for (let key in branchesarr) {
    branchIN += "'" + branchesarr[key] + "',";
  }
  var branchlist = branchIN.substr(0, branchIN.length - 1);
  if (branchlist) {
    return ' and branch in (' + branchlist + ') ';
  } else {
    return '';
  }



}

exports.monthlyData = (req, res) => {

  //exports.monthlyData(req, res) {
  return new Promise((resolve, reject) => {
    async.parallel({
      montlyrevenue: (callback) => {

        this.monthRevenue(req, res, (_err, _res) => {
          callback(_err, _res);
        });

      },
      monthlycogs: (callback) => {

        this.monthCogs(req, res, (_err, _res) => {
          callback(_err, _res);
        });

      }
    }, (err, results) => {
      if (err) {
        // reject(err);
        res.json(err);

      } else {
        res.json(results);
        //resolve(results);
      }

    });

  });

}

exports.monthRevenue = (req, res, callback) => {
  try {
    let ftddate = req.params.date;
    let start = ftddate + '-01';
    let end = ftddate + '-31';
    let entity = req.params.entity;
    let region = req.params.region;
    let branch = req.params.branch;

    if (ftddate != 'undefined' && entity != 'undefined' && region != 'undefined' && branch != 'undefined') {

      var sqlquery = 'select  sum(pharmacy) as pharmacy,sum(opticals) as opticals,sum(laboratory) as laboratory,sum(surgery) as surgery,sum(consultation) as consultation,sum(others) as others,sum(ftd) as ftd from  	revenue_report where entity="' + entity + '"  and branch="' + branch + '" and trans_date between "' + start + '" and "' + end + '"';
    } else if (ftddate != 'undefined' && entity != 'undefined' && region != 'undefined' && branch == 'undefined') {
      var whereCondition = whereConditionBuild(entity, region);

      var sqlquery = 'select branch,sum(ftd) as ftd from 	revenue_report   where entity="' + entity + '"' + whereCondition + '  and trans_date between "' + start + '" and "' + end + '" group by branch';
    } else if (ftddate != 'undefined' && entity != 'undefined' && region == 'undefined' && branch == 'undefined') {
      var sqlquery = 'select branch,sum(ftd) as ftd from 	revenue_report   where entity="' + entity + '"  and trans_date between "' + start + '" and "' + end + '" group by branch';
    } else if (ftddate != 'undefined' && entity == 'undefined' && region != 'undefined' && branch == 'undefined') {
      var whereCondition = whereConditionBuild(entity, region);
      var sqlquery = 'select branch,sum(ftd) as ftd from 	revenue_report   where entity!="' + entity + '"' + whereCondition + '  and trans_date between "' + start + '" and "' + end + '" group by branch';
    } else {
      var sqlquery = 'select branch,sum(ftd) as ftd from 	revenue_report   where entity in ("AEH","AHC") and  trans_date between "' + start + '" and "' + end + '" group by branch';
    }
    connections.scm_public.query(sqlquery, (err, cogsres, fields) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, cogsres);
      }
    });

  } catch (error) {
    callback(error, null);
  }

};

exports.monthCogs = (req, res, callback) => {
  try {
    let ftddate = req.params.date;
    let start = ftddate + '-01';
    let end = ftddate + '-31';
    let entity = req.params.entity;
    let region = req.params.region;
    let branch = req.params.branch;
    if (ftddate != 'undefined' && entity != 'undefined' && region != 'undefined' && branch != 'undefined') {
      var sqlquery = 'select  sum(pharmacy) as pharmacy,sum(opticals) as opticals,sum(laboratory) as laboratory,sum(operation_theatre) as operation_theatre,sum(ftd) as ftd from  cogs_report where entity="' + entity + '"  and branch="' + branch + '" and trans_date between "' + start + '" and "' + end + '"';
    } else if (ftddate != 'undefined' && entity != 'undefined' && region != 'undefined' && branch == 'undefined') {
      var whereCondition = whereConditionBuild(entity, region);
      var sqlquery = 'select branch,sum(ftd) as ftd from cogs_report   where entity="' + entity + '"' + whereCondition + '  and trans_date between "' + start + '" and "' + end + '" group by branch';
    } else if (ftddate != 'undefined' && entity != 'undefined' && region == 'undefined' && branch == 'undefined') {
      var sqlquery = 'select branch,sum(ftd) as ftd from cogs_report   where entity="' + entity + '"  and trans_date between "' + start + '" and "' + end + '" group by branch';
    } else if (ftddate != 'undefined' && entity == 'undefined' && region != 'undefined' && branch == 'undefined') {

      var whereCondition = whereConditionBuild(entity, region);
      var sqlquery = 'select branch,sum(ftd) as ftd from cogs_report   where entity!="' + entity + '"' + whereCondition + '  and trans_date between "' + start + '" and "' + end + '" group by branch';
    } else {
      var sqlquery = 'select branch,sum(ftd) as ftd from cogs_report   where entity in ("AEH","AHC","AHI") and trans_date between "' + start + '" and "' + end + '" group by branch';
    }
    connections.scm_public.query(sqlquery, (err, cogsres, fields) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, cogsres);
      }

    });

  } catch (error) {
    callback(error, null);
  }

};


exports.main_ot = (req, res) => {
  return new Promise((resolve, reject) => {
    async.parallel({
      montlyOT: (callback) => {

        this.monthlyOTRevenue(req, res, (_err, _res) => {
          callback(_err, _res);
        });

      },
      branches: (callback) => {

        this.branchesDetails(req, res, (_err, _res) => {
          callback(_err, _res);
        });

      },
      montlyCattractCogs: (callback) => {

        this.cattractCogs(req, res, (_err, _res) => {
          callback(_err, _res);
        });

      },
      montlyRefractiveCogs: (callback) => {

        this.refractiveCogs(req, res, (_err, _res) => {
          callback(_err, _res);
        });

      },
      montlyVitreoRetinalCogs: (callback) => {

        this.vitreoRetinalCogs(req, res, (_err, _res) => {
          callback(_err, _res);
        });

      }

    }, (err, results) => {
      if (err) {
        // reject(err);
        res.json(err);

      } else {

        res.json(mods.nativeFunctions.formation(results, req.params.date));
        //resolve(results);
      }

    });

  });
};

exports.monthlyOTRevenue = (req, res, callback) => {

  try {
    let ftddate = req.params.date;
    let temp = new Date(ftddate);
    let mtddate =
      temp.getFullYear() +
      "-" +
      ("0" + (temp.getMonth() + 1)).slice(-2) +
      "-" +
      "01";

    //SELECT count(item_code) FROM `cogs_details` WHERE trans_date between '2019-07-01' and '2019-07-31' and item_name in (select name from mapping where type='CATARACT')

    // SELECT COUNT(item_code),branch FROM `cogs_details` WHERE trans_date BETWEEN '2019-07-01' AND '2019-07-31' AND item_name IN (SELECT NAME FROM cogs_item_mapping WHERE TYPE='CATARACT') GROUP BY branch




    //SELECT entity,TRANSACTION_DATE AS trans_date,BILLED AS branch,`group` FROM revenue_details WHERE `group` IN ("CATARACT","REFRACTIVE","VITREO RETINAL") AND  TRANSACTION_DATE BETWEEN "2019-07-01" AND "2019-07-31" GROUP BY BILLED
    var sqlquery = 'select entity,TRANSACTION_DATE as trans_date,BILLED as branch,`group` from revenue_details_native where `group` in ("CATARACT","REFRACTIVE","VITREO RETINAL") and UNIT="SURGERY" and  TRANSACTION_DATE between "' + mtddate + '" and "' + ftddate + '"';
    connections.scm_public.query(sqlquery, (err, otRevenueResults) => {
      if (err) {
        callback(err, null);
      } else {


        callback(null, otRevenueResults);
      }
    });

  } catch (error) {
    callback(error, null);
  }

};


exports.branchesDetails = (req, res, callback) => {
  try {
    var sqlquery = 'select * from branches where is_active=1';
    connections.scm_public.query(sqlquery, (err, brancheresults) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, brancheresults);
      }
    });

  } catch (error) {
    callback(error, null);
  }

};
exports.cattractCogs = (req, res, callback) => {
  try {
    let ftddate = req.params.date;
    let temp = new Date(ftddate);
    let mtddate =
      temp.getFullYear() +
      "-" +
      ("0" + (temp.getMonth() + 1)).slice(-2) +
      "-" +
      "01";
    //var sqlquery = "SELECT item_code,branch,trans_date FROM `cogs_details` WHERE trans_date BETWEEN '"+mtddate+"' AND '"+ftddate+"' AND item_name IN (SELECT NAME FROM cogs_item_mapping WHERE TYPE='CATARACT')";
    var sqlquery = "SELECT A.item_code AS item_code,A.branch AS branch,A.trans_date AS trans_date FROM cogs_details AS A,cogs_item_mapping AS B WHERE  A.trans_date BETWEEN '" + mtddate + "' AND '" + ftddate + "' AND A.item_code=B.code AND B.TYPE='CATARACT'";
    connections.scm_public.query(sqlquery, (err, cattrachCogsRes) => {
      if (err) {
        callback(err, null);
      } else {

        callback(null, cattrachCogsRes);
      }
    });

  } catch (error) {
    callback(error, null);
  }

};
exports.refractiveCogs = (req, res, callback) => {

  try {
    let ftddate = req.params.date;
    let temp = new Date(ftddate);
    let mtddate =
      temp.getFullYear() +
      "-" +
      ("0" + (temp.getMonth() + 1)).slice(-2) +
      "-" +
      "01";
    //var sqlquery = "SELECT item_code,branch,trans_date FROM `cogs_details` WHERE trans_date BETWEEN '"+mtddate+"' AND '"+ftddate+"' AND item_name IN (SELECT NAME FROM cogs_item_mapping WHERE TYPE='Refractive')";

    var sqlquery = "SELECT A.item_code AS item_code,A.branch AS branch,A.trans_date AS trans_date FROM cogs_details AS A,cogs_item_mapping AS B WHERE  A.trans_date BETWEEN '" + mtddate + "' AND '" + ftddate + "' AND A.item_code=B.code AND B.TYPE='Refractive'";


    connections.scm_public.query(sqlquery, (err, refractiveCogsRes) => {
      if (err) {
        callback(err, null);
      } else {


        callback(null, refractiveCogsRes);
      }
    });

  } catch (error) {
    callback(error, null);
  }

};
exports.vitreoRetinalCogs = (req, res, callback) => {

  try {
    let ftddate = req.params.date;
    let temp = new Date(ftddate);
    let mtddate =
      temp.getFullYear() +
      "-" +
      ("0" + (temp.getMonth() + 1)).slice(-2) +
      "-" +
      "01";
    //var sqlquery = "SELECT item_code,branch,trans_date FROM `cogs_details` WHERE trans_date BETWEEN '"+mtddate+"' AND '"+ftddate+"' AND item_name IN (SELECT NAME FROM cogs_item_mapping WHERE TYPE='Vitreo Retinal')";

    var sqlquery = "SELECT A.item_code AS item_code,A.branch AS branch,A.trans_date AS trans_date FROM cogs_details AS A,cogs_item_mapping AS B WHERE  A.trans_date BETWEEN '" + mtddate + "' AND '" + ftddate + "' AND A.item_code=B.code AND B.TYPE='Vitreo Retinal'";
    connections.scm_public.query(sqlquery, (err, vitreoRetinalCogsRes) => {
      if (err) {
        callback(err, null);
      } else {


        callback(null, vitreoRetinalCogsRes);
      }
    });

  } catch (error) {
    callback(error, null);
  }

};


exports.main_route_newopd = (req, res) => {
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
  //  console.log('main_route_revenue');
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";

  let ftddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-' + ("0" + (temp.getDate())).slice(-2);
  let mtddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-01';


  connections.scm_public.query(
    files.new_opd_super,
    [mtddate, ftddate],
    (error, resnewopd) => {
      if (error) console.error(error);
      connections.scm_public.query(
        files.new_opd_super,
        [mtddatelastyear, ftddatelastyear],
        (error, reslastyearopd) => {
          if (error) console.error(error);
          connections.scm_public.query(
            "select * from branches",
            (err, branchres) => {
              if (err) console.error(err);
              mods.nativeFunctions
                .newopdNative(
                  resnewopd,
                  branchres,
                  ftddate,
                  reslastyearopd,

                )
                .then(final => res.json(final));
            }
          );
        }
      );
    }
  );
  // }
};

exports.main_route_newopd_normal = (req, res) => {
  //  console.log('test_route_revenue');
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let individualBranches = [];
  let branchGroups = [];
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";
  // let emp = JSON.parse(mods.session.user)
  let ftddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-' + ("0" + (temp.getDate())).slice(-2);
  let mtddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-01';
  let emp = req.params.name;
  connections.scm_public.query(
    "select * from users where emp_id = ? and is_active=1 and role not in ('ch_user','sch_user','fin_user')",
    [emp],
    (err, userRes) => {
      if (err) console.log(err);
      userRes.forEach(element => {
        if (element.branches.length < 4) {
          individualBranches.push(element.branches);
        } else {
          branchGroups.push(element.branches);
          let value = element.branches.split("=")[1];
          if (!mods._.includes(value, "+")) {
            individualBranches.push(value);
          }
        }
      });
      connections.scm_public.query(
        files.new_opd_normal,
        [mtddate, ftddate, individualBranches],
        (error, resnewopd) => {
          if (error) console.error(error);

          connections.scm_public.query(
            files.new_opd_normal,
            [mtddatelastyear, ftddatelastyear, individualBranches],
            (error, resnewopdlastyear) => {
              if (error) console.error(error);
              connections.scm_public.query(
                "select * from branches",
                (err, branchres) => {
                  if (err) console.error(err);
                  mods.nativeFunctions
                    .newopdnormal(
                      resnewopd,
                      resnewopdlastyear,
                      individualBranches,
                      branchGroups,
                      branchres,
                      ftddate
                    )
                    .then(final => res.json(final));
                }
              );
            }
          );
        }
      );
    }
  );
};




exports.opticals = (req, res) => {
  console.log("hit");
  let ftddate = req.params.date;

  console.log(ftddate);
  let temp = new Date(ftddate);
  let year = temp.getFullYear();
  let month = temp.getMonth() + 1;
  console.log(year);
  console.log(month);
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";

  // 		const monthNames = ["January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"
  // ];
  // 	const d = new Date();
  // 	console.log("d :"+d);
  // //	console.log(d.getMonth());
  // 	console.log("monthNames "+monthNames[d.getMonth()]);
  // console.log(temp.getMonth());
  // console.log((temp.getMonth() + 1));
  let ftddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-' + ("0" + (temp.getDate())).slice(-2);
  let mtddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-01';

  // let mtdopticalquery = "SELECT branch,IF(ftd='',0,SUM(ftd)) AS ftd,entity,region,branchcode,branchname,SUM(targetamount) as targetamount FROM ( SELECT br.branch AS branch ,SUM(rd.NET_AMOUNT) AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,0 AS targetamount  FROM  `revenue_details` AS rd INNER JOIN  branches AS br ON CODE=rd.BILLED WHERE UNIT IN ('OPTICALS') AND DATE(TRANSACTION_DATE) BETWEEN '" + mtddate + "' AND '" + ftddate + "' GROUP BY BILLED  UNION ALL SELECT br.branch AS branch ,'' AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,IFNULL(tar.targetamount,0) AS targetamount FROM target_optical AS tar INNER JOIN  branches AS br ON br.id=tar.`entityid` WHERE tar.year = YEAR('" + mtddate + "') and tar.month =MONTH('" + mtddate + "')  ) AS A  GROUP BY branch"
  // let lymtdopticalquery = "SELECT branch,IF(ftd='',0,SUM(ftd)) AS ftd,entity,region,branchcode,branchname,SUM(targetamount) as targetamount FROM ( SELECT br.branch AS branch ,SUM(rd.NET_AMOUNT) AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,0 AS targetamount  FROM  `revenue_details` AS rd INNER JOIN  branches AS br ON CODE=rd.BILLED WHERE UNIT IN ('OPTICALS') AND DATE(TRANSACTION_DATE) BETWEEN '" + mtddatelastyear + "' AND '" + ftddatelastyear + "' GROUP BY BILLED  UNION ALL SELECT br.branch AS branch ,'' AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,IFNULL(tar.targetamount,0) AS targetamount FROM target_optical AS tar INNER JOIN  branches AS br ON br.id=tar.`entityid` WHERE tar.year = YEAR('" + ftddatelastyear + "') and tar.month =MONTH('" + ftddatelastyear + "')  ) AS A  GROUP BY branch"
  //
  // // console.log(mtdopticalquery);
  // console.log(lymtdopticalquery);
  connections.scm_public.query(files.mtdopticals, [mtddate, ftddate, mtddate, mtddate], (error, resoptical) => {

    // "SELECT branch,IF(ftd='',0,SUM(ftd)) AS ftd,entity,region,branchcode,branchname,SUM(targetamount) FROM ( SELECT br.branch AS branch ,SUM(rd.NET_AMOUNT) AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,0 AS targetamount  FROM  `revenue_details` AS rd INNER JOIN  branches AS br ON CODE=rd.BILLED WHERE UNIT IN ('OPTICALS') AND DATE(TRANSACTION_DATE) BETWEEN '"+mtddate+"' AND '"+ftddate+"' GROUP BY BILLED  UNION ALL SELECT br.branch AS branch ,'' AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,IFNULL(tar.targetamount,0) AS targetamount FROM target_optical AS tar INNER JOIN  branches AS br ON br.id=tar.`entityid` WHERE tar.year = YEAR('"+year+"') and tar.month ='"+month+"'  ) AS A  GROUP BY branch",(error,resoptical)=>{
    // //files.opticals_super,[mtddate,ftddate],(error,resoptical)=>{
    if (error) console.log(error);
    console.log("ftd");
    // console.log(resoptical);
    connections.scm_public.query(
      files.lymtdopticals, [mtddatelastyear, ftddatelastyear, ftddatelastyear, ftddatelastyear], (error, reslastyearoptical) => {
        if (error) console.log(error);
        console.log("LASTmtd");
        connections.scm_public.query(
          "select * from branches", (err, branches) => {
            if (error) console.log(error);
            console.log("lymtd");
            mods.nativeFunctions.newopticals(resoptical, branches, ftddate, reslastyearoptical)
              .then(final => res.json(final));
          }
        );
      }
    );
  });
};


//discount --praveenraj

exports.discount = (req, res) => {
  let department = [];

  let fromdate = req.params.frmdate;
  let todate = req.params.todate;

  if (req.params.department == 'All') {
    //	department=["Pharmacy","Surgery","Opticals","LABORATORY"];

    console.log("from date : " + req.params.frmdate);
    console.log("To date : " + req.params.todate);
    console.log("department : " + department);
    connections.scm_public.query(files.discountall, [fromdate, todate, fromdate, todate, fromdate, todate, fromdate, todate],

      (error, resdiscountall) => {
        console.log("discountall");
        if (error) console.error(error);

        res.json({
          "result": {
            "Discount": resdiscountall
          }
        });
      }

    );


  } else if ((req.params.department == 'Pharmacy') || (req.params.department == 'Surgery') || (req.params.department == 'Opticals')) {


    department = req.params.department;
    console.log(department);

    console.log("from date : " + req.params.frmdate);
    console.log("To date : " + req.params.todate);
    console.log("department : " + department);
    connections.scm_public.query(files.discount, [fromdate, todate, department, fromdate, todate, department, fromdate, todate, department, fromdate, todate, department],
      (error, resdiscount) => {
        console.log("discount");
        if (error) console.error(error);

        res.json({
          "result": {
            "Discount": resdiscount
          }
        });
      }

    );

    //	console.log("done");
  } else if (req.params.department == 'Laboratory') {

    department = ["INVESTIGATION", "TREATMENT", "LABORATORY"];
    console.log(department);
    connections.scm_public.query(files.discountlab, [fromdate, todate, department, fromdate, todate, department, fromdate, todate, department, fromdate, todate, department],
      (error, resdiscountlab) => {
        console.log("discount lab");

        if (error) console.error(error);

        res.json({
          "result": {
            "Discount": resdiscountlab
          }
        });
      }

    );

  } else if ((req.params.department == 'VRInjection') || (req.params.department == 'VRSurgery')) {
    console.log(req.params.department);
    if (req.params.department == 'VRInjection') {
      department = ["VR - INJECTION", "VR INJECTION", "VR INJECTIONS"]

    } else {
      department = ["VR-SURGERY"]
    }

    connections.scm_public.query(files.discountvr, [fromdate, todate, department, fromdate, todate, department, fromdate, todate, department, fromdate, todate, department],
      (error, resdiscountvr) => {

        if (error) console.error(error);
        console.log("discountvr");

        res.json({
          "result": {
            "Discount": resdiscountvr
          }
        });
      }

    );

  } else if ((req.params.department == 'Cataract') || (req.params.department == 'Refractive') || (req.params.department == 'Cornea')) {
    department = req.params.department;

    connections.scm_public.query(files.discountsplit, [fromdate, todate, department, fromdate, todate, department, fromdate, todate, department, fromdate, todate, department],
      (error, resdiscountsplit) => {

        if (error) console.error(error);
        console.log(department);

        res.json({
          "result": {
            "Discount": resdiscountsplit
          }
        });
      }

    );

  } else {
    connections.scm_public.query(files.discountothers, [fromdate, todate, fromdate, todate, fromdate, todate, fromdate, todate],
      (error, resdiscountothes) => {

        if (error) console.error(error);
        //	console.log(department);

        res.json({
          "result": {
            "Discount": resdiscountothes
          }
        });
      }

    );
  }

};




// collection --praveenraj
exports.collectiondetailim = (req, res) => {

  let frmdate = req.params.fromdate;
  let todate = req.params.todate;
  let entity = req.params.entity;
  let branch = req.params.branch;

  if ((entity == "All") && (branch == "All")) {
    console.log("hit in all");
    let collectionquery = "Select * from collection_detail where DATE(PAYMENT_OR_REFUND_DATE) BETWEEN " + "'" + frmdate + "'" + " AND " + "'" + todate + "'";
    connections.scm_public.query(collectionquery, (err, rescollection) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "collection": rescollection
        }
      })
    })

  } else if (branch == "All") {

    let collectionquery = "Select * from collection_detail where DATE(PAYMENT_OR_REFUND_DATE) BETWEEN " + "'" + frmdate + "'" + " AND " + "'" + todate + "' and PARENT_BRANCH='" + entity + "'";
    console.log(collectionquery);
    connections.scm_public.query(collectionquery, (err, rescollection) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "collection": rescollection
        }
      })
    })
  } else {
    let collectionquery = "Select * from collection_detail where DATE(PAYMENT_OR_REFUND_DATE) BETWEEN " + "'" + frmdate + "'" + " AND " + "'" + todate + "' and PARENT_BRANCH='" + entity + "' and BRANCH='" + branch + "'";
    console.log(collectionquery);
    connections.scm_public.query(collectionquery, (err, rescollection) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "collection": rescollection
        }
      })
    })
  }

};


exports.branch = (req, res) => {
  let entity = req.params.entity;
  connections.scm_public.query(
    files.brancheslist,
    [entity],
    (error, branchesresults) => {
      if (error) console.error(error);
      res.json(branchesresults);
    }
  );
  // }
};


exports.main_route_usage_tracker = (req, res) => {
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
  //  console.log('main_route_revenue');
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";

  let ftddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-' + ("0" + (temp.getDate())).slice(-2);
  let mtddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-01';

  let tarArr = ftddate.split("-");
  let tarMonth = tarArr[1];
  let tarYear = tarArr[0];

  connections.scm_public.query(
    files.new_opd_super,
    [mtddate, ftddate],
    (error, resnewopd) => {
      if (error) console.error(error);
      connections.scm_public.query(
        files.device_history,
        [mtddate, ftddate],
        (error, resdevicehistory) => {
          if (error) console.error(error);
          connections.scm_public.query(
            files.device_revenue,
            [mtddate, ftddate],
            (error, resdevicerevenue) => {
              if (error) console.error(error);
              connections.scm_public.query("select br.entity as entity,br.region as region,br.code as branch,br.branch as branchname,tr.total from branches as br  LEFT JOIN usage_track_target as tr ON br.id=tr.branch_id AND target_month='" + tarMonth + "' AND target_year='" + tarYear + "'", (err, targetres) => {
                if (err) console.log(err);
                connections.scm_public.query(
                  "select * from branches",
                  (err, branchres) => {
                    if (err) console.error(err);
                    mods.nativeFunctions
                      .newUsageTrackerNative(
                        resnewopd,
                        branchres,
                        ftddate,
                        resdevicehistory,
                        targetres,
                        resdevicerevenue
                      )
                      .then(final => res.json(final));
                  }
                );
              });
            }
          );


        }
      );
    }
  );
  // }
};



// consultation

exports.consultation = (req, res) => {
  console.log("hit in consultation");
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";

  connections.scm_public.query(
    files.new_consultation_super,
    [mtddate, ftddate],
    (error, resnewconsult) => {
      if (error) console.error(error);
      //console.log(resnewconsult);
      connections.scm_public.query(
        "select * from branches", (err, branches) => {
          if (err) console.error(err);
          mods.nativeFunctions.newconsultation(
            resnewconsult, branches, ftddate
          ).then(final => res.json(final));
        }
      );
    });


};



exports.main_route_usage_tracker_new = (req, res) => {
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
  //  console.log('main_route_revenue');
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";

  let ftddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-' + ("0" + (temp.getDate())).slice(-2);
  let mtddatelastyear = (temp.getFullYear() - 1) + '-' + ("0" + (temp.getMonth() + 1)).slice(-2) + '-01';

  let tarArr = ftddate.split("-");
  let tarMonth = tarArr[1];
  let tarYear = tarArr[0];

  connections.scm_public.query(
    files.new_opd_super,
    [mtddate, ftddate],
    (error, resnewopd) => {
      if (error) console.error(error);
      connections.scm_public.query(
        files.device_history,
        [mtddate, ftddate],
        (error, resdevicehistory) => {
          if (error) console.error(error);
          connections.scm_public.query(
            files.device_revenue,
            [mtddate, ftddate],
            (error, resdevicerevenue) => {
              if (error) console.error(error);
              connections.scm_public.query("select br.entity as entity,br.region as region,br.code as branch,br.branch as branchname,tr.total,tr.amount from branches as br  LEFT JOIN usage_track_target as tr ON br.id=tr.branch_id AND target_month='" + tarMonth + "' AND target_year='" + tarYear + "'", (err, targetres) => {
                if (err) console.log(err);
                connections.scm_public.query(
                  "select * from branches",
                  (err, branchres) => {
                    if (err) console.error(err);
                    mods.nativeFunctions
                      .newUsageTrackerNativeNew(
                        resnewopd,
                        branchres,
                        ftddate,
                        resdevicehistory,
                        targetres,
                        resdevicerevenue
                      )
                      .then(final => res.json(final));
                  }
                );
              });
            }
          );


        }
      );
    }
  );
  // }
};


// ch drt
exports.ch_branch = (req, res) => {

  let emp = req.params.name;
  let branchsplitresult = [],
    resultbranch = {},
    grouptempObj = {},
    branchOBJ = [];
  connections.scm_public.query(
    "select branches AS TEXT,branches AS shortCode from users where name = ? and role in  ('ch_user')",
    [emp],
    (error, branchesresults) => {
      if (error) console.error(error);
      branchesresults.forEach(element => {
        branchsplitresult = element.TEXT.split('+');
      });
      branchsplitresult.forEach(resultbranch => {
        branchOBJ.push({
          TEXT: resultbranch,
          shortCode: resultbranch
        });
      });
      res.json(branchOBJ);
    }
  );
};




exports.chbills = (req, res) => {
  let frmdate = req.params.fromdate;
  let todate = req.params.todate;
  let visit = req.params.visit;
  let branch = req.params.branch;
  let name = req.params.name;
  let type = req.params.type;
  let splitbranches = [];
  let string = null;

  if (type == 'other') {
    console.log("hit");
    if ((visit == "All") && (branch == "All")) {
      console.log("hit in branch and visit all");
      let drtbillquery = "select branches from users where emp_id ='" + name + "' and role ='ch_user' "
      console.log("drtbillquery : " + drtbillquery);
      connections.scm_public.query(drtbillquery, (err, resbranch) => {
        if (err) console.error(err);
        resbranch.forEach(branch => {
          splitbranches = branch.branches.split('+')
        });

        connections.scm_public.query(files.otherchbillall, [splitbranches, frmdate, todate], (err, resbill) => {
          if (err) console.error(err);

          res.json({
            "result": {
              "bill": resbill
            }
          })
        });


      });

    } else if ((visit == "All") && (!(branch == 'All'))) {
      console.log("hit in visit all");
      connections.scm_public.query(files.otherchbillvisitall, [branch, frmdate, todate], (err, resbill) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "bill": resbill
          }
        })
      });
    } else if (!(visit == "All") && (branch == 'All')) {
      console.log("hit in branch all");

      let drtbillquery = "select branches from users where emp_id ='" + name + "' and role ='ch_user' "
      console.log("drtbillquery : " + drtbillquery);
      connections.scm_public.query(drtbillquery, (err, resbranch) => {
        if (err) console.error(err);
        resbranch.forEach(branch => {
          splitbranches = branch.branches.split('+')
        });
        connections.scm_public.query(files.otherchbillbranchall, [splitbranches, frmdate, todate, visit], (err, resbill) => {
          if (err) console.error(err);

          res.json({
            "result": {
              "bill": resbill
            }
          });

        });
      });
    } else {
      connections.scm_public.query(files.otherchbillelse, [branch, frmdate, todate, visit], (err, resbill) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "bill": resbill
          }
        })
      })


    }


  } else if ((visit == "All") && (branch == "All")) {
    console.log("hit in branch and visit all");
    let drtbillquery = "select branches from users where emp_id ='" + name + "' and role ='ch_user' "
    console.log("drtbillquery : " + drtbillquery);
    connections.scm_public.query(drtbillquery, (err, resbranch) => {
      if (err) console.error(err);
      resbranch.forEach(branch => {
        splitbranches = branch.branches.split('+')
      });

      connections.scm_public.query(files.chbillall, [splitbranches, frmdate, todate, type], (err, resbill) => {
        if (err) console.error(err);

        res.json({
          "result": {
            "bill": resbill
          }
        })
      });


    });

  } else if ((visit == "All") && (!(branch == 'All'))) {
    console.log("hit in visit all");
    connections.scm_public.query(files.chbillvisitall, [branch, frmdate, todate, type], (err, resbill) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "bill": resbill
        }
      })
    });
  } else if (!(visit == "All") && (branch == 'All')) {
    console.log("hit in branch all");

    let drtbillquery = "select branches from users where emp_id ='" + name + "' and role ='ch_user' "
    console.log("drtbillquery : " + drtbillquery);
    connections.scm_public.query(drtbillquery, (err, resbranch) => {
      if (err) console.error(err);
      resbranch.forEach(branch => {
        splitbranches = branch.branches.split('+')
      });
      connections.scm_public.query(files.chbillbranchall, [splitbranches, frmdate, todate, type, visit], (err, resbill) => {
        if (err) console.error(err);

        res.json({
          "result": {
            "bill": resbill
          }
        });

      });
    });
  } else {
    connections.scm_public.query(files.chbillelse, [branch, type, frmdate, todate, visit], (err, resbill) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "bill": resbill
        }
      })
    })


  }

}

exports.drt = (req, res) => {
  let drtbranch = req.params.branch;
  let drtquery = 'SELECT ID,CONCAT(NAME," || ",Pan_no) AS "Name"  FROM drt_customer WHERE STATUS=1';

  connections.scm_public.query(drtquery, (err, resdrt) => {
    if (err) console.error(err);
    res.json(resdrt)
  })
}

exports.drtdetail = (req, res) => {
  let id = req.params.id;
  connections.scm_public.query("SELECT * FROM `drt_customer` WHERE STATUS=1 AND ID= ?", [id], (err, resdrtdetail) => {
    if (err) console.error(err);
    res.json(resdrtdetail)
  })
}

exports.drtbills = (req, res) => {
  let billid = req.body.bill_id;
  let netamount = req.body.net_amount;
  let commission = req.body.drt_commission;
  let drtamount = req.body.drt_amount;
  let drtid = req.body.drt_id;
  let category = req.body.drt_category;
  let userid = req.body.drt_user;
  let comments = req.body.drt_comments;
  let aggcommission = req.body.drt_aggcommission;
  let billedbranch = req.body.drt_billed;
  let billno = req.body.drt_billno;
  let billdate = req.body.drt_billdate;
  let mrn = req.body.drt_mrn;
  let name = req.body.drt_name;
  let ref = req.body.drt_ref;

  let billcheckquery = "select Bill_no from drt_bills where Bill_id=" + billid
  console.log(billcheckquery);
  connections.scm_public.query(billcheckquery, (err, resbill) => {

    if (resbill == '') {
      let drtbillsquery = "INSERT INTO drt_bills (Bill_id,Net_amount,Drt_percentage_value,Drt_amount,Created_by,Drt_id,Category,Comments,Aggreed_percentage_value,Billed_branch,Bill_no,bill_date,Mrn,Name,Reference) VALUE (" + billid + "," + netamount + "," + commission + "," + drtamount + "," + userid + ",'" + drtid + "','" + category + "','" + comments + "'," + aggcommission + ",'" + billedbranch + "', '" + billno + "','" + billdate + "','" + mrn + "','" + name + "','" + ref + "' );"
      console.log(drtbillsquery);
      connections.scm_root.query(drtbillsquery, (err, result) => {
        if (err) {
          res.json({
            Datainserted: false

          })
        } else {
          res.json({
            Datainserted: true
          })
        }

      })
    } else {

      let updatedrtbillquery = "update drt_bills set Drt_percentage_value='" + commission + "', Drt_amount='" + drtamount + "', Created_by='" + userid + "', Drt_id='" + drtid + "', Category='" + category + "', Comments='" + comments + "', Aggreed_percentage_value='" + aggcommission + "',Billed_branch='" + billedbranch + "',Approval_status=0  where Bill_id='" + billid + "'";
      console.log(updatedrtbillquery);
      connections.scm_root.query(updatedrtbillquery, (err, resupdate) => {
        if (err) console.error(err);
        res.json({
          Datainserted: "Updated"
        })
      })

    }

  })


}

exports.billdrt = (req, res) => {
  let billid = req.params.id;

  connections.scm_public.query(files.billidch, [billid, billid, billid, billid], (err, resultbill) => {
    if (err) console.error(err);
    res.json(resultbill)
  })

}



// sch drt flow
exports.sch_branch = (req, res) => {

  let emp = req.params.name;
  console.log(emp);
  let branchsplitresult = [],
    resultbranch = {},
    grouptempObj = {},
    branchOBJ = [];
  connections.scm_public.query(
    "select branches AS TEXT,branches AS shortCode from users where name = ? and role in  ('sch_user')",
    [emp],
    (error, branchesresults) => {
      if (error) console.error(error);
      branchesresults.forEach(element => {
        branchsplitresult = element.TEXT.split('+');
      });
      branchsplitresult.forEach(resultbranch => {
        branchOBJ.push({
          TEXT: resultbranch,
          shortCode: resultbranch
        });
      });
      res.json(branchOBJ);
    }
  );
}


exports.schbills = (req, res) => {
  let frmdate = req.params.fromdate;
  let status = req.params.status;
  let branch = req.params.branch;
  let name = req.params.name;
  let date_type = req.params.datetype;
  let splitbranches = [];
  let string = null;

  console.log(req.params);

  if (date_type == 2) {
    console.log("hit in expense");


    if (branch == 'All') {
      connections.scm_public.query("select branches from users where emp_id=? and role='sch_user'", [name], (err, resbranch) => {
        if (err) console.error(err);
        resbranch.forEach(branch => {
          splitbranches = branch.branches.split('+')
        });

        connections.scm_public.query(files.schexpense_all, [frmdate, splitbranches], (err, resbill) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "bill": resbill
            }
          })
        })
      })

    } else {
      connections.scm_public.query(files.schexpense_all, [frmdate, branch], (err, resbill) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "bill": resbill
          }
        })
      })
    }
  } else {
    if ((status == "All") && (branch == "All")) {
      console.log("hit in branch and visit all");
      let drtbillquery = "select branches from users where emp_id ='" + name + "' and role ='sch_user' "
      console.log("drtbillquery : " + drtbillquery);
      connections.scm_public.query(drtbillquery, (err, resbranch) => {

        if (err) console.error(err);
        resbranch.forEach(branch => {
          splitbranches = branch.branches.split('+')
        });
        connections.scm_public.query(files.schall, [frmdate, splitbranches, frmdate, splitbranches, frmdate, splitbranches, frmdate, splitbranches, frmdate, splitbranches], (err, resbill) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "bill": resbill
            }
          })
        });;


      });


    } else if ((status == "All") && (!(branch == 'All'))) {
      console.log("hit in status all");
      connections.scm_public.query(files.schvisitall, [frmdate, branch, frmdate, branch, frmdate, branch, frmdate, branch, frmdate, branch], (err, resbill) => {
        if (err) console.error(err);

        res.json({
          "result": {
            "bill": resbill
          }
        })
      });
    } else if (!(status == "All") && (branch == 'All')) {
      console.log("hit in branch all");

      let drtbillquery = "select branches from users where emp_id ='" + name + "' and role ='sch_user' "
      console.log("drtbillquery : " + drtbillquery);
      connections.scm_public.query(drtbillquery, (err, resbranch) => {
        if (err) console.error(err);
        resbranch.forEach(branch => {
          splitbranches = branch.branches.split('+')
        });
        connections.scm_public.query(files.schbranchall, [frmdate, status, splitbranches], (err, resbill) => {
          if (err) console.error(err);

          res.json({
            "result": {
              "bill": resbill
            }
          });

        });
      });
    } else {
      console.log("hit in else");
      connections.scm_public.query(files.schelse, [frmdate, status, branch], (err, resbill) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "bill": resbill
          }
        })
      })


    }

  }

}

exports.schbillinsert = (req, res) => {
  let schbillid = req.body.sch_bill_id;
  let schid = req.body.sch_id;

  let schdrtbillupdate = "update drt_bills set sch_Approved_by='" + schid + "',Approval_status=1,Approved_time=Now() where id='" + schbillid + "'";
  console.log(schdrtbillupdate);

  connections.scm_root.query(schdrtbillupdate, (err, resilt) => {
    if (err) console.error(err);
    res.json({
      Dataupdated: "updated"
    })
  })
}

exports.schbillcancel = (req, res) => {
  let schbillid = req.body.sch_bill_id;
  let schid = req.body.sch_id;
  let schcomments = req.body.sch_comments;
  let concat = schcomments.concat("-- By--", schid, "--SCH")
  console.log(concat);
  // console.log("schid : "+schid);
  let schdrtbillcancel = "update drt_bills set Approval_status=3,Cancelled_time=now(),Cancelled_by='" + schid + "',Comments='" + concat + "' where id=" + schbillid
  console.log(schdrtbillcancel);

  connections.scm_root.query(schdrtbillcancel, (err, rescance) => {
    if (err) console.error(err);
    res.json({
      Dataschcancelled: "cancelled"
    })
  })
}


// fin branch

exports.fin_branch = (req, res) => {

  let emp = req.params.name;

  let branchsplitresult = [],
    resultbranch = {},
    grouptempObj = {},
    branchOBJ = [];
  connections.scm_public.query(
    "SELECT branch AS TEXT,CODE AS shortCode FROM branches WHERE entity NOT IN ('OHC')",

    (error, branchesresults) => {
      if (error) console.error(error);

      res.json(branchesresults);
    }
  );
}



exports.finbills = (req, res) => {
  let frmdate = req.params.fromdate;
  let status = req.params.status;
  let branch = req.params.branch;
  let name = req.params.name;
  let splitbranches = [];
  let listmrn = [];
  let string = null;
  let mergedList = [];
  let date_type = req.params.datetype;
  console.log(req.params);

  if (date_type == 2) {
    console.log("hit in expense");

    if (branch == 'All') {

      connections.scm_public.query("SELECT Mrn FROM `drt_bills` WHERE DATE_FORMAT(bill_date,'%Y-%m')= ? group by Mrn", [frmdate], (err, resmrn) => {
        if (err) console.error(err);

        resmrn.forEach(element => {
          listmrn.push(element.Mrn);
        })

        connections.ideamed.query("SELECT RIP.PATIENTID as Mrn, RIP.PATIENTNAME, RDRT.REFERRALTYPENAME, RDRB.REFERREDBYNAME from RT_INDIVIDUAL_PATIENT RIP JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=RIP.REFERRALTYPE JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=RIP.REFERREDBYCONSULTANT where RIP.PATIENTID IN (?)", [listmrn], (err, resultvalue) => {
          if (err) console.error(err);

          connections.scm_public.query(files.finexpense_all, [frmdate, status], (err, resultfin) => {
            if (err) console.error(err);
            mergedList = _.map(resultfin, function(item) {
              return _.extend(item, _.find(resultvalue, {
                Mrn: item.Mrn
              }));
            });

            res.json({
              "result": {
                "bill": mergedList
              }
            });

          })

        })

      })
    } else {
      console.log("hitin expense branch");
      connections.scm_public.query(files.finexpense_branch, [frmdate, status, branch], (err, resultfin) => {
        console.log();
        if (err) console.error(err);
        res.json({
          "result": {
            "bill": resultfin
          }
        });
      })
    }
  }
else {
  if ((status == "All") && (branch == "All")) {
    console.log("hit in branch and visit all");

    connections.scm_public.query("SELECT Mrn FROM `drt_bills` WHERE DATE_FORMAT(bill_date,'%Y-%m')= ? group by Mrn", [frmdate], (err, resmrn) => {
      if (err) console.error(err);

      resmrn.forEach(element => {
        listmrn.push(element.Mrn);
      })

      connections.ideamed.query("SELECT RIP.PATIENTID as Mrn, RIP.PATIENTNAME, RDRT.REFERRALTYPENAME, RDRB.REFERREDBYNAME from RT_INDIVIDUAL_PATIENT RIP JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=RIP.REFERRALTYPE JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=RIP.REFERREDBYCONSULTANT where RIP.PATIENTID IN (?)", [listmrn], (err, resultvalue) => {
        if (err) console.error(err);

        connections.scm_public.query(files.finall, [frmdate, frmdate, frmdate, frmdate, frmdate], (err, resultfin) => {
          if (err) console.error(err);


          mergedList = _.map(resultfin, function(item) {
            return _.extend(item, _.find(resultvalue, {
              Mrn: item.Mrn
            }));
          });

          res.json({
            "result": {
              "bill": mergedList
            }
          });

        });

      })
    })


  }
  else if ((status == "All") && (!(branch == 'All'))) {
    console.log("hit in status all");

    connections.scm_public.query("SELECT Mrn FROM `drt_bills` WHERE DATE_FORMAT(bill_date,'%Y-%m')= ? group by Mrn", [frmdate], (err, resmrn) => {
      if (err) console.error(err);

      resmrn.forEach(element => {
        listmrn.push(element.Mrn);
      })

      connections.ideamed.query("SELECT RIP.PATIENTID as Mrn, RIP.PATIENTNAME, RDRT.REFERRALTYPENAME, RDRB.REFERREDBYNAME from RT_INDIVIDUAL_PATIENT RIP JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=RIP.REFERRALTYPE JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=RIP.REFERREDBYCONSULTANT where RIP.PATIENTID IN (?)", [listmrn], (err, resultvalue) => {
        if (err) console.error(err);

        connections.scm_public.query(files.finstatusall, [frmdate, branch, frmdate, branch, frmdate, branch, frmdate, branch, frmdate, branch], (err, resultfin) => {
          if (err) console.error(err);

          mergedList = _.map(resultfin, function(item) {
            return _.extend(item, _.find(resultvalue, {
              Mrn: item.Mrn
            }));
          });

          res.json({
            "result": {
              "bill": mergedList
            }
          });

        });

      });
    });



  }

  else if (!(status == "All") && (branch == 'All')) {
  //
    connections.scm_public.query("SELECT Mrn FROM `drt_bills` WHERE DATE_FORMAT(bill_date,'%Y-%m')= ? group by Mrn", [frmdate], (err, resmrn) => {
      if (err) console.error(err);

      resmrn.forEach(element => {
        listmrn.push(element.Mrn);
      })

      connections.ideamed.query("SELECT RIP.PATIENTID as Mrn, RIP.PATIENTNAME, RDRT.REFERRALTYPENAME, RDRB.REFERREDBYNAME from RT_INDIVIDUAL_PATIENT RIP JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=RIP.REFERRALTYPE JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=RIP.REFERREDBYCONSULTANT where RIP.PATIENTID IN (?)", [listmrn], (err, resultvalue) => {
        if (err) console.error(err);

        connections.scm_public.query(files.finbranchall, [frmdate, status], (err, resultfin) => {
          if (err) console.error(err);
          mergedList = _.map(resultfin, function(item) {
            return _.extend(item, _.find(resultvalue, {
              Mrn: item.Mrn
            }));
          });

          res.json({
            "result": {
              "bill": mergedList
            }
          });

        });
      });
    });


  }

  else {
    console.log("hit in else");

    connections.scm_public.query("SELECT Mrn FROM `drt_bills` WHERE DATE_FORMAT(bill_date,'%Y-%m')= ? group by Mrn", [frmdate], (err, resmrn) => {
      if (err) console.error(err);

      resmrn.forEach(element => {
        listmrn.push(element.Mrn);
      })

      connections.ideamed.query("SELECT RIP.PATIENTID as Mrn, RIP.PATIENTNAME, RDRT.REFERRALTYPENAME, RDRB.REFERREDBYNAME from RT_INDIVIDUAL_PATIENT RIP JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=RIP.REFERRALTYPE JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=RIP.REFERREDBYCONSULTANT where RIP.PATIENTID IN (?)", [listmrn], (err, resultvalue) => {
        if (err) console.error(err);

        connections.scm_public.query(files.finelse, [frmdate,status, branch], (err, resultfin) => {
          if (err) console.error(err);

          mergedList = _.map(resultfin, function(item) {
            return _.extend(item, _.find(resultvalue, {
              Mrn: item.Mrn
            }));
          });

          res.json({
            "result": {
              "bill": mergedList
            }
          });


        });
      });

    });
  }
}
  //
  // if ((status == "All") && (branch == "All")) {
  //   console.log("hit in branch and visit all");
  //
  //   connections.scm_public.query("SELECT Mrn FROM `drt_bills` WHERE bill_date BETWEEN ?  and ? group by Mrn", [frmdate, todate], (err, resmrn) => {
  //     if (err) console.error(err);
  //
  //     resmrn.forEach(element => {
  //       listmrn.push(element.Mrn);
  //     })
  //
  //     connections.ideamed.query("SELECT RIP.PATIENTID as Mrn, RIP.PATIENTNAME, RDRT.REFERRALTYPENAME, RDRB.REFERREDBYNAME from RT_INDIVIDUAL_PATIENT RIP JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=RIP.REFERRALTYPE JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=RIP.REFERREDBYCONSULTANT where RIP.PATIENTID IN (?)", [listmrn], (err, resultvalue) => {
  //       if (err) console.error(err);
  //
  //       connections.scm_public.query(files.finall, [frmdate, todate, frmdate, todate, frmdate, todate, frmdate, todate, frmdate, todate], (err, resultfin) => {
  //         if (err) console.error(err);
  //
  //
  //         mergedList = _.map(resultfin, function(item) {
  //           return _.extend(item, _.find(resultvalue, {
  //             Mrn: item.Mrn
  //           }));
  //         });
  //
  //         res.json({
  //           "result": {
  //             "bill": mergedList
  //           }
  //         });
  //
  //       });
  //
  //     })
  //   })
  //
  //
  // } else if ((status == "All") && (!(branch == 'All'))) {
  //   console.log("hit in status all");
  //
  //   connections.scm_public.query("SELECT Mrn FROM `drt_bills` WHERE bill_date BETWEEN ?  and ? group by Mrn", [frmdate, todate], (err, resmrn) => {
  //     if (err) console.error(err);
  //
  //     resmrn.forEach(element => {
  //       listmrn.push(element.Mrn);
  //     })
  //
  //     connections.ideamed.query("SELECT RIP.PATIENTID as Mrn, RIP.PATIENTNAME, RDRT.REFERRALTYPENAME, RDRB.REFERREDBYNAME from RT_INDIVIDUAL_PATIENT RIP JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=RIP.REFERRALTYPE JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=RIP.REFERREDBYCONSULTANT where RIP.PATIENTID IN (?)", [listmrn], (err, resultvalue) => {
  //       if (err) console.error(err);
  //
  //       connections.scm_public.query(files.finstatusall, [frmdate, todate, branch, frmdate, todate, branch, frmdate, todate, branch, frmdate, todate, branch, frmdate, todate, branch], (err, resultfin) => {
  //         if (err) console.error(err);
  //
  //         mergedList = _.map(resultfin, function(item) {
  //           return _.extend(item, _.find(resultvalue, {
  //             Mrn: item.Mrn
  //           }));
  //         });
  //
  //         res.json({
  //           "result": {
  //             "bill": mergedList
  //           }
  //         });
  //
  //       });
  //
  //     });
  //   });
  //
  //
  //
  // } else if (!(status == "All") && (branch == 'All')) {
  //
  //   connections.scm_public.query("SELECT Mrn FROM `drt_bills` WHERE bill_date BETWEEN ?  and ? group by Mrn", [frmdate, todate], (err, resmrn) => {
  //     if (err) console.error(err);
  //
  //     resmrn.forEach(element => {
  //       listmrn.push(element.Mrn);
  //     })
  //
  //     connections.ideamed.query("SELECT RIP.PATIENTID as Mrn, RIP.PATIENTNAME, RDRT.REFERRALTYPENAME, RDRB.REFERREDBYNAME from RT_INDIVIDUAL_PATIENT RIP JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=RIP.REFERRALTYPE JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=RIP.REFERREDBYCONSULTANT where RIP.PATIENTID IN (?)", [listmrn], (err, resultvalue) => {
  //       if (err) console.error(err);
  //
  //       connections.scm_public.query(files.finbranchall, [frmdate, todate, status], (err, resultfin) => {
  //         if (err) console.error(err);
  //         mergedList = _.map(resultfin, function(item) {
  //           return _.extend(item, _.find(resultvalue, {
  //             Mrn: item.Mrn
  //           }));
  //         });
  //
  //         res.json({
  //           "result": {
  //             "bill": mergedList
  //           }
  //         });
  //
  //       });
  //     });
  //   });
  //
  //
  // } else {
  //   console.log("hit in else");
  //
  //   connections.scm_public.query("SELECT Mrn FROM `drt_bills` WHERE bill_date BETWEEN ?  and ? group by Mrn", [frmdate, todate], (err, resmrn) => {
  //     if (err) console.error(err);
  //
  //     resmrn.forEach(element => {
  //       listmrn.push(element.Mrn);
  //     })
  //
  //     connections.ideamed.query("SELECT RIP.PATIENTID as Mrn, RIP.PATIENTNAME, RDRT.REFERRALTYPENAME, RDRB.REFERREDBYNAME from RT_INDIVIDUAL_PATIENT RIP JOIN RT_DATA_REFERRAL_TYPE RDRT ON RDRT.ID=RIP.REFERRALTYPE JOIN RT_DATA_REFERRED_BY RDRB ON RDRB.ID=RIP.REFERREDBYCONSULTANT where RIP.PATIENTID IN (?)", [listmrn], (err, resultvalue) => {
  //       if (err) console.error(err);
  //
  //       connections.scm_public.query(files.finelse, [frmdate, todate, status, branch], (err, resultfin) => {
  //         if (err) console.error(err);
  //
  //         mergedList = _.map(resultfin, function(item) {
  //           return _.extend(item, _.find(resultvalue, {
  //             Mrn: item.Mrn
  //           }));
  //         });
  //
  //         res.json({
  //           "result": {
  //             "bill": mergedList
  //           }
  //         });
  //
  //
  //       });
  //     });
  //
  //   });
  // }

}


exports.finbillinsert = (req, res) => {
  let schbillid = req.body.sch_bill_id;
  let schid = req.body.sch_id;
  let expensedatefin = req.body.sch_expensedate;
  console.log("schbillid :" + schbillid);
  console.log(req.body);


  let findrtbillupdate = "update drt_bills set admin_Approved_by='" + schid + "' ,Approval_status=2,Admin_Approved_time=Now(),Expense_date='" + expensedatefin + "' where id=" + schbillid
  console.log(findrtbillupdate);

  connections.scm_root.query(findrtbillupdate, (err, resilt) => {
    if (err) console.error(err);
    res.json({
      Dataupdated: "updated"
    })
  })
}

exports.finbillcancel = (req, res) => {
  let finbillid = req.body.sch_bill_id;
  let finid = req.body.sch_id;
  let fincomments = req.body.sch_comments;
  let concat = fincomments.concat("-- by finance")
  let findrtbillcancel = "update drt_bills set Approval_status=4,Cancelled_time=now(),Cancelled_by='" + finid + "',Comments='" + concat + "' where id=" + finbillid
  // let findrtbillcancel = "update drt_bills set Approval_status=4,Cancelled_time=now(),Cancelled_by='" + finid + "' where id=" + finbillid

  console.log(findrtbillcancel);

  connections.scm_root.query(findrtbillcancel, (err, rescance) => {
    if (err) console.error(err);
    res.json({
      Dataschcancelled: "cancelled"
    })
  })
}

exports.approvalbills = (req, res) => {

  let billid = req.params.id;
  console.log(billid);
  connections.scm_public.query(files.allapprovalbills, [billid, billid, billid, billid], (err, resbills) => {
    if (err) console.error(err);
    res.json(resbills)
  })
}


exports.main_route_usage_tracker_new_email = (yesterday, callback) => {
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
  //  console.log('main_route_revenue');
  let ftddate = yesterday;
  let temp = new Date(ftddate);
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";

  let tarArr = ftddate.split("-");
  let tarMonth = tarArr[1];
  let tarYear = tarArr[0];

  console.log(ftddate);
  console.log(mtddate);

  connections.scm_public.query(
    files.new_opd_super,
    [mtddate, ftddate],
    (error, resnewopd) => {

      if (error) {
        callback("new opd select query error", null);
      } else {
        connections.scm_public.query(
          files.device_history,
          [mtddate, ftddate],
          (error, resdevicehistory) => {
            if (error) {
              callback("device_history select query error", null);
            } else {
              connections.scm_public.query(
                files.device_revenue,
                [mtddate, ftddate],
                (error, resdevicerevenue) => {
                  if (error) {
                    callback("device_revenue select query error", null);
                  } else {
                    connections.scm_public.query("select br.entity as entity,br.region as region,br.code as branch,br.branch as branchname,tr.total,tr.amount from branches as br  LEFT JOIN usage_track_target as tr ON br.id=tr.branch_id AND target_month='" + tarMonth + "' AND target_year='" + tarYear + "'", (err, targetres) => {
                      if (err) {
                        callback("target join query  error", null);
                      } else {
                        connections.scm_public.query(
                          "select * from branches",
                          (err, branchres) => {
                            if (err) {
                              callback("branches query  error", null);
                            } else {
                              mods.nativeFunctions
                                .newUsageTrackerNativeNew(
                                  resnewopd,
                                  branchres,
                                  ftddate,
                                  resdevicehistory,
                                  targetres,
                                  resdevicerevenue
                                )
                                .then(final => callback(null, final));
                            }
                          });
                      }
                    });
                  }
                }
              );
            }

          }
        );
      }
    }
  );
  // }
};



exports.avaEmailList = (emailtemp, callback) => {
  connections.scm_public.query("select fromid,toid,bccid,ccid,passcode from email where scmtype='avaemail'", (error, domesticemailres) => {
    if (error) {
      callback("select email query", null);
    } else {
      callback(null, domesticemailres);
    }
  });
}



exports.upload_doctor = (req, res) => {
  console.log("hit in back end ------------------------------------");

  let agreesampleFile = '';
  let agreeuploadPath = '';
  let pansampleFile = '';
  let panuploadPath = '';
  let passbooksampleFile = '';
  let passbookuploadPath = '';
  let datetime = '';
  let doctor_name = req.body.doctorname;
  let doctor_branch = req.body.doctorbranch;
  let doctor_contact = req.body.doctorcontact;
  let doctor_email = req.body.doctoremail;
  let doctor_pan = req.body.doctorpan;
  let doctor_gstin = req.body.doctorgstin;
  let doctor_agreed = req.body.doctoragreed;
  let doctor_acc = req.body.doctoracc;
  let doctor_IFSC = req.body.doctorIFSC;
  let doctor_bankbranch = req.body.doctorbankbranch;
  let user_name = req.body.username;
  let paymenttype = req.body.docpaymenttype;
  let doctor_infavour = req.body.docfavourname;
  let doc_agreement = '';
  let isActive = "-1";
  let aggname = '';
  let panname = '';
  let passname = '';




  function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + '_' + minutes + '_' + ampm;
    return date.getDate() + "_" + (date.getMonth() + 1) + "_" + date.getFullYear() + "_" + strTime + "_";
  }

  var d = new Date();
  var date = formatDate(d);
  let upload = req.files;

  console.log(req.body);
  // console.log(date);
  console.log(upload);
  // if (!upload || Object.keys(upload).length === 0) {
  //   res.status(400).send('No files were uploaded.');
  //   return;
  // }
  //  console.log('req.files >>>', upload); // eslint-disable-line

  if (upload == null) {
    connections.scm_public.query("select Pan_no from drt_customer where Pan_no=? and status in (1,-1) group by Pan_no", [doctor_pan], (err, resultpan) => {
      if (err) console.error(err);
      if ((resultpan == '') || (resultpan[0].Pan_no == "NO PAN")) {
        connections.scm_root.query("INSERT INTO `drt_customer` (Name,Address,Contact_no,Email,Pan_no,GSTIN,Percentage,STATUS,Branch,Account_no,Bank_ifsc,Bank_name,Agreement,Agreement_url,Pan_url,Passbook_url,uploaded_user,Payment_type,Infavour_of) VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [doctor_name, doctor_branch, doctor_contact, doctor_email, doctor_pan, doctor_gstin, doctor_agreed, isActive, doctor_branch, doctor_acc, doctor_IFSC, doctor_bankbranch, doc_agreement, aggname, panname, passname, user_name, paymenttype, doctor_infavour], (err, resdrtcustomer) => {
            console.log();
            if (err) {
              console.error(err);
              res.json({
                doctordatainserted: false
              })
            } else {
              res.json({
                doctordatainserted: true
              })
            }
          })
      } else {
        console.log("alredy Available");
        res.json({
          doctordatainserted: "Available"
        })
      }
    })
  } else {
    connections.scm_public.query("select Pan_no from drt_customer where Pan_no=? and status in (1,-1) group by Pan_no", [doctor_pan], (err, resultpan) => {
      if (err) console.error(err);
      if ((resultpan == '') || (resultpan[0].Pan_no == "NO PAN")) {

        if (((upload.fileagreementupload) == null) || ((upload.fileagreementupload) === '')) {
          console.log("hit");
        } else {
          agreesampleFile = upload.fileagreementupload;
          console.log("====================================");
          datetime = date.concat(agreesampleFile.name);
          aggname = user_name.concat("_", "aggreement_", datetime)
          console.log(agreesampleFile.name);
          console.log(aggname);
          if (agreesampleFile.mimetype == "image/jpeg" || agreesampleFile.mimetype == "image/png" || agreesampleFile.mimetype == "image/gif" || agreesampleFile.mimetype == "application/pdf") {
            agreeuploadPath = '/var/www/andaman/drtfiles/' + aggname;
            console.log("uploadPath : " + agreeuploadPath);

            doc_agreement = 'Yes'
            console.log(doc_agreement);
            agreesampleFile.mv(agreeuploadPath, function(err) {
              if (err) {
                return res.status(500).send(err);
              }
              doc_agreement = 'Yes'
            });
          }

        }
        if (((upload.filepanupload) == null) || ((upload.filepanupload) == '')) {
          console.log("hit");
        } else {
          pansampleFile = upload.filepanupload;
          console.log("====================================");
          datetime = date.concat(pansampleFile.name);
          panname = user_name.concat("_", "pan_", datetime)
          console.log(pansampleFile.name);
          console.log(panname);
          if (pansampleFile.mimetype == "image/jpeg" || pansampleFile.mimetype == "image/png" || pansampleFile.mimetype == "image/gif" || pansampleFile.mimetype == "application/pdf") {
            panuploadPath = '/var/www/andaman/drtfiles/' + panname;
            console.log("uploadPath : " + panuploadPath);
            doc_agreement = 'Yes'
            console.log(doc_agreement);
            pansampleFile.mv(panuploadPath, function(err) {
              if (err) {
                return res.status(500).send(err);
              }
              isAgreement = 'Yes'
            });
          }

        }
        if (((upload.filepassbookupload) == null) || ((upload.filepassbookupload) == '')) {
          console.log('hir');
        } else {
          passbooksampleFile = upload.filepassbookupload;
          console.log("====================================");
          datetime = date.concat(passbooksampleFile.name);
          passname = user_name.concat("_", "passbook_", datetime)
          console.log(passbooksampleFile.name);
          console.log(passname);

          if (passbooksampleFile.mimetype == "image/jpeg" || passbooksampleFile.mimetype == "image/png" || passbooksampleFile.mimetype == "image/gif" || passbooksampleFile.mimetype == "application/pdf") {
            passbookuploadPath = '/var/www/andaman/drtfiles/' + passname;
            console.log("uploadPath : " + passbookuploadPath);
            doc_agreement = 'Yes'
            console.log(doc_agreement);

            passbooksampleFile.mv(passbookuploadPath, function(err) {
              if (err) {
                return res.status(500).send(err);
              }
              isAgreement = 'Yes'
            });
          }

        }

        connections.scm_root.query("INSERT INTO `drt_customer` (Name,Address,Contact_no,Email,Pan_no,GSTIN,Percentage,STATUS,Branch,Account_no,Bank_ifsc,Bank_name,Agreement,Agreement_url,Pan_url,Passbook_url,uploaded_user,Payment_type,Infavour_of) VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [doctor_name, doctor_branch, doctor_contact, doctor_email, doctor_pan, doctor_gstin, doctor_agreed, isActive, doctor_branch, doctor_acc, doctor_IFSC, doctor_bankbranch, doc_agreement, aggname, panname, passname, user_name, paymenttype, doctor_infavour], (err, resdrtcustomer) => {
            console.log();
            if (err) {
              console.error(err);
              res.json({
                doctordatainserted: false
              })
            } else {
              res.json({
                doctordatainserted: true
              })
            }


          })

      } else {
        console.log("alredy Available");
        res.json({
          doctordatainserted: "Available"
        })
      }

    })
  }


}



exports.ch_doctorlist = (req, res) => {
  let statustype = req.params.id;
  let name = req.params.name;

  console.log("statustype : " + statustype);
  console.log("name : " + name);
  if (statustype == 'All') {

    let chbranch_query = "select branches from users where emp_id ='" + name + "' and role ='ch_user'";
    connections.scm_public.query(chbranch_query, (err, resbranch) => {
      if (err) console.error(err);
      resbranch.forEach(branch => {
        splitbranches = branch.branches.split('+')
      });
      console.log(splitbranches);
      connections.scm_public.query(files.challdoctor, [splitbranches], (err, reslist) => {
        if (err) console.error(err);
        //console.log(reslist);
        res.json({
          "result": {
            "doctordata": reslist
          }
        })
      })
    })
  } else {
    //    let doctorlist_ch = "select * from drt_customer WHERE STATUS= ?";

    let chbranch_query = "select branches from users where emp_id ='" + name + "' and role ='ch_user'";
    connections.scm_public.query(chbranch_query, (err, resbranch) => {
      if (err) console.error(err);
      resbranch.forEach(branch => {
        splitbranches = branch.branches.split('+')
      });
      console.log(splitbranches);
      connections.scm_public.query(files.chdoctor, [splitbranches, statustype], (err, reslist) => {
        if (err) console.error(err);
        //console.log(reslist);
        res.json({
          "result": {
            "doctordata": reslist
          }
        })
      })
    })


  }


}
exports.download_file = (req, res) => {
  let filepath = req.params.download
  console.log(filepath);
  //var fileLocation = path.join('/var/www/andaman/drtfiles', filepath)
  var fileLocation = '/var/www/andaman/drtfiles/' + filepath;
  console.log(fileLocation);
  res.download(fileLocation);
}

exports.fin_doctorlist = (req, res) => {
  let fin_status = req.params.status;
  let fin_branch = req.params.branch;

  console.log(fin_status);
  console.log(fin_branch);
  if ((fin_branch == "All") && (fin_status == "All")) {
    connections.scm_public.query(files.findocallall, (err, resfin) => {
      //  console.log(resfin);
      if (err) console.error(err);
      res.json({
        "result": {
          "findata": resfin
        }
      })
    })
  } else if ((fin_branch == "All") && (!(fin_status == 'All'))) {

    connections.scm_public.query(files.findocallstatus, [fin_status], (err, resfin) => {
      //  console.log(resfin);
      if (err) console.error(err);
      res.json({
        "result": {
          "findata": resfin
        }
      })
    })
  } else if ((!(fin_branch == "All")) && (fin_status == 'All')) {
    connections.scm_public.query(files.findocbranchall, [fin_branch], (err, resfin) => {
      //    console.log(resfin);
      if (err) console.error(err);
      res.json({
        "result": {
          "findata": resfin
        }
      })
    })
  } else if ((!(fin_branch == "All")) && (!(fin_status == 'All'))) {
    connections.scm_public.query(files.findocbranchstatus, [fin_branch, fin_status], (err, resfin) => {
      //  console.log(resfin);
      if (err) console.error(err);
      res.json({
        "result": {
          "findata": resfin
        }
      })
    })
  }
}

exports.fin_doctorapprove = (req, res) => {
  console.log(req.body);
  let fin_id = req.body.fin_id;
  console.log(fin_id);
  connections.scm_root.query("UPDATE drt_customer SET STATUS=1,Created_by=NOW() WHERE ID=? ", [fin_id], (err, resupdatedoc) => {
    console.log(resupdatedoc);
    if (err) console.error(err);
    res.json({
      Dataupdated: "updated"
    })
  })

}

exports.fin_doctorreject = (req, res) => {
  console.log(req.body);
  let fin_id = req.body.fin_id;
  console.log(fin_id);
  connections.scm_root.query("UPDATE drt_customer SET STATUS=-2,Cancelled_time=NOW() WHERE ID=? ", [fin_id], (err, resupdatedoc) => {
    console.log(resupdatedoc);
    if (err) console.error(err);
    res.json({
      Dataupdated: "updated"
    })
  })

}

exports.fin_loaddoc = (req, res) => {

  connections.scm_public.query("SELECT COUNT(*) as count FROM drt_customer WHERE STATUS=-1", (err, resloaddoc) => {
    if (err) console.error(err);
    res.json(resloaddoc)
  })
}

exports.ch_submittedbills = (req, res) => {
  let fromdata = req.params.frmdate;
  let date_type = req.params.datetype;
  let status = req.params.status;
  let branch = req.params.branch;
  let name = req.params.name;

  let splitbranches = [];
  let splitdate = [];
  splitdate = fromdata.split("-")


  if (date_type == 2) {
    console.log("hit in expense");
    connections.scm_public.query("select branches from users where emp_id=? and role='ch_user'", [name], (err, ressubill) => {
      if (err) console.error(err);
      console.log(ressubill.length);
      ressubill.forEach(branch => {
        splitbranches = branch.branches.split('+')
      });

      connections.scm_public.query(files.expensedata, [fromdata, status, splitbranches], (err, resexpense) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "subbill": resexpense
          }
        })
      })
    })
  } else {
    if ((status == 'All') && (branch == 'All')) {
      connections.scm_public.query("select branches from users where emp_id=? and role='ch_user'", [name], (err, ressubill) => {
        if (err) console.error(err);
        console.log(ressubill.length);
        ressubill.forEach(branch => {
          splitbranches = branch.branches.split('+')
        });

        connections.scm_public.query(files.chsubbillall, [fromdata, splitbranches, fromdata, splitbranches, fromdata, splitbranches, fromdata, splitbranches, fromdata, splitbranches], (err, ressub) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "subbill": ressub
            }
          })
        })
      })

    } else if ((status == 'All') && (!(branch == 'All'))) {
      console.log("hit");
      connections.scm_public.query(files.chsubbillall, [fromdata, branch, fromdata, branch, fromdata, branch, fromdata, branch, fromdata, branch], (err, ressub) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "subbill": ressub
          }
        })
      })

    } else if (!(status == 'All') && (branch == 'All')) {
      connections.scm_public.query("select branches from users where emp_id=? and role='ch_user'", [name], (err, ressubill) => {
        if (err) console.error(err);
        console.log(ressubill.length);
        ressubill.forEach(branch => {
          splitbranches = branch.branches.split('+')
        });
        console.log(fromdata + " " + " " + status + " " + splitbranches);
        connections.scm_public.query(files.chsubbillstatusall, [fromdata, status, splitbranches], (err, ressub) => {
          if (err) console.error(err);
          console.log(ressub);
          res.json({
            "result": {
              "subbill": ressub
            }
          })
        })
      })
    } else {
      console.log(fromdata);
      connections.scm_public.query(files.chsubbillstatusall, [splitdate[0], splitdate[1], status, branch], (err, ressub) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "subbill": ressub
          }
        })
      })

    }
  }
}



exports.expense_date = (req, res) => {
  console.log(req.body);
  let finbill_id = req.body.sch_bill_id;
  let fin_expensedate = req.body.sch_expensedate;
  let findrtbillexpenseupdate = "update drt_bills set Expense_date='" + fin_expensedate + "' where id=" + finbill_id
  console.log(findrtbillexpenseupdate);

  connections.scm_root.query(findrtbillexpenseupdate, (err, finexpense) => {
    if (err) console.error(err);
    res.json({
      Dataupdated: "updated"
    })
  })

}
