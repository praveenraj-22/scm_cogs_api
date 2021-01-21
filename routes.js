const mods = require("./modules");
const _ = require('./modules')._;
const uuid = mods.uuid;

const connections = mods.connections;
const files = mods.sqls;
var async = require("async");
let sess = null;

var regionMapping = {
	'AEH':{
		'Chennai' : ['CMH','ANN','ASN','AVD','NLR','PMB','PRR','TLR','TRC','VLC'],
		'ROI' : ['JPR'],
	    'ROTN': ['KNP','VLR','KBK','NVL','VPM','DHA','SLM','KSN','ERD','HSR','MDU']
	},
	'AHC':{
		'AMN' 		: ['AMN'],
		'AP' 		: ['VMH','NEL','GUN','TPT','RAJ'],
	    'Chennai'	: ['TBM','ADY','EGM','MGP','NWP','AMB','TVT'],
		'KA' 		: ['BMH','WFD','KML','CLR','INR','PNR','YLK','HUB',"DWD",'MCC','MYS','SVR','BSK','RRN','RJN'],
		'Maharashtra' 	: ['VSH','PUN','HDP',"CMR", "KTD"],
		"Madhya Pradesh": ["JWS","APR","ATA","KWA"],
		'OD' 		: ['CTK','BHU'],
	    'ROI'		: ['PDY','TVM','KTM','AHM',"JWS","APR","ATA","KWA"],
		'ROTN'		: ['TVL','TCN','APM','TRI','TNJ','TPR','CMB'],
		'TS'		: ['DNR','HMH','MDA','SNR','HIM','SBD','MPM','GCB'],
		'WB'		: ['KOL','KAS'],
		'Kerala'	: ['TVM','KTM']
	},
	'Chennai' :['CMH','ANN','ASN','AVD','NLR','PMB','PRR','TLR','TRC','VLC','TBM','ADY','EGM','MGP','NWP','AMB','TVT'],
	'ROTN' :['KNP','VLR','KBK','NVL','VPM','DHA','SLM','KSN','ERD','HSR','MDU','TVL','TCN','APM','TRI','TNJ','TPR','CMB'],
	'ROI' :['JPR','PDY','TVM','KTM','AHM',"JWS","APR","ATA","KWA"],
	'KA' :['BMH','WFD','KML','CLR','INR','PNR','YLK','HUB',"DWD",'MCC','MYS','SVR','BSK','RRN','RJN'],
	'TS' :['DNR','HMH','MDA','SNR','HIM','SBD','MPM','GCB'],
	'AMN' :['AMN'],
	'AP' :['VMH','NEL','GUN','TPT','RAJ'],
	'WB' :['KOL','KAS'],
	'OD' :['CTK','BHU'],
	'Maharashtra' 	: ['VSH','PUN','HDP',"CMR", "KTD"],
	"Madhya Pradesh": ["JWS","APR","ATA","KWA"],
	'Kerala'	: ['TVM','KTM']

};


var entityMapping = {
	'AEH' : ['CMH','ANN','ASN','AVD','NLR','PMB','PRR','TLR','TRC','VLC','JPR','KNP','VLR','KBK','NVL','VPM','DHA','SLM','KSN','ERD','HSR','MDU'],
	'AHC' : ['AMN','VMH','NEL','GUN','TPT','RAJ','TBM','ADY','EGM','MGP','NWP','AMB','TVT','BMH','JGN','WFD','KML','CLR','INR','PNR','YLK','HUB',"DWD",'MCC','MYS','SVR','BSK','RRN','RJN','VSH','PUN','HDP',"IND","JWS","APR","ATA","KWA",'CTK','BHU','PDY','TVL','TCN','APM','TRI','TNJ','TPR','CMB','DNR','HMH','MDA','SNR','HIM','SBD','MPM','GCB','KOL','KAS','TVM','KTM'],
	'ALL' : ['CMH','ANN','ASN','AVD','NLR','PMB','PRR','TLR','TRC','VLC','JPR','KNP','VLR','KBK','NVL','VPM','DHA','SLM','KSN','ERD','HSR','MDU','AMN','VMH','NEL','GUN','TPT','RAJ','TBM','ADY','EGM','MGP','NWP','AMB','TVT','BMH','JGN','WFD','KML','CLR','INR','PNR','YLK','HUB',"DWD",'MCC','MYS','SVR','BSK','RRN','RJN','VSH','PUN','HDP',"IND","JWS","APR","ATA","KWA",'CTK','BHU','PDY','TVL','TCN','APM','TRI','TNJ','TPR','CMB','DNR','HMH','MDA','SNR','HIM','SBD','MPM','GCB','KOL','KAS','TVM','KTM'],
	'AHI' : ['VSH'],

}


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
                connections.scm_public.query(files.currency_det_last_mth,  (currency_last_err, currency_last_res) => {
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
  res.json({ msg: "Am ALIVE!!!." });
};

exports.logout = (req, res) => {
  // mods.sessionStore.close()
  this.sess = null;
  res.json({ isAuthenticated: false });
};

// Local test code

exports.testLogin = (req, res) => {
//  console.log('testLogin');
  let user = req.body.user.trim();
//  console.log('roye.js user ',user);
  let pass = req.body.pass.trim();
//  console.log(' route.js pass ', pass);
    connections.scm_public.query(
      "select * from users where emp_id = ? and password = ? and is_active=1",
      [user,pass],
      (err, result) => {
        if (err) console.error(err);
        if (result.length === 0) {
          res.json({ isAuthenticated: false });
        } else {
			connections.scm_public.query("update  users set last_login=now() where emp_id ='"+user+"' ",(err1, result) => {
				if (err) console.error(err1);
			  });
          res.json({ isAuthenticated: true, role: result[0].role ,userName : result[0].name });
          // mods.session.user = JSON.stringify(user)
          // mods.session.role = JSON.stringify(result[0].role)
          sess = req.session;
          sess.role = result[0].role;
          if (sess.role === "normal_user") {
            sess.normalUser = user;
          }
          if (sess.role === "super_user") {
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

  console.log("update  users set password='"+pass+"' where emp_id ='"+user+"' ");
	connections.scm_public.query("update  users set password='"+pass+"' where emp_id ='"+user+"'",(err1, result) => {
		if (err1){
				res.json({ isAuthenticated: false});
		}else{
			res.json({ isAuthenticated: true});
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
  console.log('SELECT branch as text,code as shortCode FROM branches WHERE entity = "'+entity+'" and region="'+region+'" AND is_active=1');
  connections.scm_public.query(
    files.branchlist,
    [entity,region],
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


function whereConditionBuild(argEntity,argRegion){

	if(argEntity!='undefined' && argRegion!='undefined'){
		var branchesarr = regionMapping[argEntity][argRegion];
	}else if(argEntity=='undefined' && argRegion!='undefined'){
		var branchesarr = regionMapping[argRegion];
	}

	var branchIN = '';
	var branchlist = '';
	for (let key in branchesarr) {
	branchIN+="'"+branchesarr[key]+"',";
	}
	var branchlist = branchIN.substr(0, branchIN.length-1);
	if(branchlist){
		return ' and branch in ('+branchlist+') ';
	}else{
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

exports.monthRevenue = (req, res,callback) => {
	  try {
		 let ftddate = req.params.date;
		 let start = ftddate+'-01';
	     let end = ftddate+'-31';
		 let entity = req.params.entity;
		 let region = req.params.region;
		 let branch = req.params.branch;

		 if(ftddate!='undefined' && entity!='undefined' && region!='undefined' &&  branch!='undefined'){

			 var sqlquery = 'select  sum(pharmacy) as pharmacy,sum(opticals) as opticals,sum(laboratory) as laboratory,sum(surgery) as surgery,sum(consultation) as consultation,sum(others) as others,sum(ftd) as ftd from  	revenue_report where entity="'+entity+'"  and branch="'+branch+'" and trans_date between "'+start+'" and "'+end+'"';
		 }else if(ftddate!='undefined' && entity!='undefined' && region!='undefined' &&  branch=='undefined'){
			  var whereCondition = whereConditionBuild(entity,region);

			var sqlquery = 'select branch,sum(ftd) as ftd from 	revenue_report   where entity="'+entity+'"'+whereCondition+'  and trans_date between "'+start+'" and "'+end+'" group by branch';
		 }else if(ftddate!='undefined' && entity!='undefined' && region=='undefined' &&  branch=='undefined'){
			 var sqlquery = 'select branch,sum(ftd) as ftd from 	revenue_report   where entity="'+entity+'"  and trans_date between "'+start+'" and "'+end+'" group by branch';
		 }else if(ftddate!='undefined' && entity=='undefined' && region!='undefined' &&  branch=='undefined'){
			 var whereCondition = whereConditionBuild(entity,region);
			 var sqlquery = 'select branch,sum(ftd) as ftd from 	revenue_report   where entity!="'+entity+'"'+whereCondition+'  and trans_date between "'+start+'" and "'+end+'" group by branch';
		 }else{
			 var sqlquery = 'select branch,sum(ftd) as ftd from 	revenue_report   where entity in ("AEH","AHC") and  trans_date between "'+start+'" and "'+end+'" group by branch';
		 }
		connections.scm_public.query(sqlquery,(err, cogsres,fields) => {
			if (err) {
				 callback(err, null);
			}else{
				 callback(null, cogsres);
			}
		});

	 }catch (error) {
            callback(error, null);
     }

};

exports.monthCogs = (req, res,callback) => {
	 try {
		 let ftddate = req.params.date;
		 let start = ftddate+'-01';
	     let end = ftddate+'-31';
		 let entity = req.params.entity;
		 let region = req.params.region;
		 let branch = req.params.branch;
		 if(ftddate!='undefined' && entity!='undefined' && region!='undefined' &&  branch!='undefined'){
			 var sqlquery = 'select  sum(pharmacy) as pharmacy,sum(opticals) as opticals,sum(laboratory) as laboratory,sum(operation_theatre) as operation_theatre,sum(ftd) as ftd from  cogs_report where entity="'+entity+'"  and branch="'+branch+'" and trans_date between "'+start+'" and "'+end+'"';
		 }else if(ftddate!='undefined' && entity!='undefined' && region!='undefined' &&  branch=='undefined'){
			 var whereCondition = whereConditionBuild(entity,region);
			 var sqlquery = 'select branch,sum(ftd) as ftd from cogs_report   where entity="'+entity+'"'+whereCondition+'  and trans_date between "'+start+'" and "'+end+'" group by branch';
		 }else if(ftddate!='undefined' && entity!='undefined' && region=='undefined' &&  branch=='undefined'){
			 var sqlquery = 'select branch,sum(ftd) as ftd from cogs_report   where entity="'+entity+'"  and trans_date between "'+start+'" and "'+end+'" group by branch';
		 }else if(ftddate!='undefined' && entity=='undefined' && region!='undefined' &&  branch=='undefined'){

			  var whereCondition = whereConditionBuild(entity,region);
			var sqlquery = 'select branch,sum(ftd) as ftd from cogs_report   where entity!="'+entity+'"'+whereCondition+'  and trans_date between "'+start+'" and "'+end+'" group by branch';
		 }else{
			 var sqlquery = 'select branch,sum(ftd) as ftd from cogs_report   where entity in ("AEH","AHC","AHI") and trans_date between "'+start+'" and "'+end+'" group by branch';
		 }
		connections.scm_public.query(sqlquery,(err, cogsres,fields) => {
			if (err) {
				 callback(err, null);
			}else{
				 callback(null, cogsres);
			}

		});

	 }catch (error) {
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

                }
				,
                montlyCattractCogs: (callback) => {

                    this.cattractCogs(req, res, (_err, _res) => {
                        callback(_err, _res);
                    });

                }
				,
				montlyRefractiveCogs: (callback) => {

                    this.refractiveCogs(req, res, (_err, _res) => {
                        callback(_err, _res);
                    });

                }
				,
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

					res.json(mods.nativeFunctions.formation(results,req.params.date));
                    //resolve(results);
                }

            });

    });
};

exports.monthlyOTRevenue = (req, res,callback) => {

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
		 var sqlquery = 'select entity,TRANSACTION_DATE as trans_date,BILLED as branch,`group` from revenue_details_native where `group` in ("CATARACT","REFRACTIVE","VITREO RETINAL") and UNIT="SURGERY" and  TRANSACTION_DATE between "'+mtddate+'" and "'+ftddate+'"';
		connections.scm_public.query(sqlquery,(err, otRevenueResults) => {
			if (err) {
				 callback(err, null);
			}else{


				 callback(null, otRevenueResults);
			}
		});

	 }catch (error) {
            callback(error, null);
     }

};


exports.branchesDetails = (req, res,callback) => {
	  try {
		 var sqlquery = 'select * from branches where is_active=1';
		connections.scm_public.query(sqlquery,(err, brancheresults) => {
			if (err) {
				 callback(err, null);
			}else{
				 callback(null, brancheresults);
			}
		});

	 }catch (error) {
            callback(error, null);
     }

};
exports.cattractCogs = (req, res,callback) => {
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
		 var sqlquery = "SELECT A.item_code AS item_code,A.branch AS branch,A.trans_date AS trans_date FROM cogs_details AS A,cogs_item_mapping AS B WHERE  A.trans_date BETWEEN '"+mtddate+"' AND '"+ftddate+"' AND A.item_code=B.code AND B.TYPE='CATARACT'";
		connections.scm_public.query(sqlquery,(err, cattrachCogsRes) => {
			if (err) {
				 callback(err, null);
			}else{

				 callback(null, cattrachCogsRes);
			}
		});

	 }catch (error) {
            callback(error, null);
     }

};
exports.refractiveCogs = (req, res,callback) => {

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

		  var sqlquery = "SELECT A.item_code AS item_code,A.branch AS branch,A.trans_date AS trans_date FROM cogs_details AS A,cogs_item_mapping AS B WHERE  A.trans_date BETWEEN '"+mtddate+"' AND '"+ftddate+"' AND A.item_code=B.code AND B.TYPE='Refractive'";


		connections.scm_public.query(sqlquery,(err, refractiveCogsRes) => {
			if (err) {
				 callback(err, null);
			}else{


				 callback(null, refractiveCogsRes);
			}
		});

	 }catch (error) {
            callback(error, null);
     }

};
exports.vitreoRetinalCogs = (req, res,callback) => {

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

var sqlquery = "SELECT A.item_code AS item_code,A.branch AS branch,A.trans_date AS trans_date FROM cogs_details AS A,cogs_item_mapping AS B WHERE  A.trans_date BETWEEN '"+mtddate+"' AND '"+ftddate+"' AND A.item_code=B.code AND B.TYPE='Vitreo Retinal'";
		connections.scm_public.query(sqlquery,(err, vitreoRetinalCogsRes) => {
			if (err) {
				 callback(err, null);
			}else{


				 callback(null, vitreoRetinalCogsRes);
			}
		});

	 }catch (error) {
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

	let ftddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-'+("0" + (temp.getDate())).slice(-2);
	let mtddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-01';


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
  let ftddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-'+("0" + (temp.getDate())).slice(-2);
  let mtddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-01';
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




exports.opticals=(req,res)=>{
	console.log("hit");
	let ftddate = req.params.date;

	console.log(ftddate);
	let temp = new Date(ftddate);
let year = temp.getFullYear();
let month=temp.getMonth()+1;
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
	let ftddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-'+("0" + (temp.getDate())).slice(-2);
	let mtddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-01';

  // let mtdopticalquery = "SELECT branch,IF(ftd='',0,SUM(ftd)) AS ftd,entity,region,branchcode,branchname,SUM(targetamount) as targetamount FROM ( SELECT br.branch AS branch ,SUM(rd.NET_AMOUNT) AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,0 AS targetamount  FROM  `revenue_details` AS rd INNER JOIN  branches AS br ON CODE=rd.BILLED WHERE UNIT IN ('OPTICALS') AND DATE(TRANSACTION_DATE) BETWEEN '" + mtddate + "' AND '" + ftddate + "' GROUP BY BILLED  UNION ALL SELECT br.branch AS branch ,'' AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,IFNULL(tar.targetamount,0) AS targetamount FROM target_optical AS tar INNER JOIN  branches AS br ON br.id=tar.`entityid` WHERE tar.year = YEAR('" + mtddate + "') and tar.month =MONTH('" + mtddate + "')  ) AS A  GROUP BY branch"
  // let lymtdopticalquery = "SELECT branch,IF(ftd='',0,SUM(ftd)) AS ftd,entity,region,branchcode,branchname,SUM(targetamount) as targetamount FROM ( SELECT br.branch AS branch ,SUM(rd.NET_AMOUNT) AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,0 AS targetamount  FROM  `revenue_details` AS rd INNER JOIN  branches AS br ON CODE=rd.BILLED WHERE UNIT IN ('OPTICALS') AND DATE(TRANSACTION_DATE) BETWEEN '" + mtddatelastyear + "' AND '" + ftddatelastyear + "' GROUP BY BILLED  UNION ALL SELECT br.branch AS branch ,'' AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,IFNULL(tar.targetamount,0) AS targetamount FROM target_optical AS tar INNER JOIN  branches AS br ON br.id=tar.`entityid` WHERE tar.year = YEAR('" + ftddatelastyear + "') and tar.month =MONTH('" + ftddatelastyear + "')  ) AS A  GROUP BY branch"
  //
  // // console.log(mtdopticalquery);
  // console.log(lymtdopticalquery);
  connections.scm_public.query(files.mtdopticals,[mtddate,ftddate,mtddate,mtddate], (error, resoptical) => {

    // "SELECT branch,IF(ftd='',0,SUM(ftd)) AS ftd,entity,region,branchcode,branchname,SUM(targetamount) FROM ( SELECT br.branch AS branch ,SUM(rd.NET_AMOUNT) AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,0 AS targetamount  FROM  `revenue_details` AS rd INNER JOIN  branches AS br ON CODE=rd.BILLED WHERE UNIT IN ('OPTICALS') AND DATE(TRANSACTION_DATE) BETWEEN '"+mtddate+"' AND '"+ftddate+"' GROUP BY BILLED  UNION ALL SELECT br.branch AS branch ,'' AS ftd ,br.entity AS entity ,br.region AS region ,br.code AS branchcode ,br.branch AS branchname ,IFNULL(tar.targetamount,0) AS targetamount FROM target_optical AS tar INNER JOIN  branches AS br ON br.id=tar.`entityid` WHERE tar.year = YEAR('"+year+"') and tar.month ='"+month+"'  ) AS A  GROUP BY branch",(error,resoptical)=>{
    // //files.opticals_super,[mtddate,ftddate],(error,resoptical)=>{
    if (error) console.log(error);
    console.log("ftd");
    // console.log(resoptical);
    connections.scm_public.query(
      files.lymtdopticals,[mtddatelastyear,ftddatelastyear,ftddatelastyear,ftddatelastyear], (error, reslastyearoptical) => {
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

exports.discount=(req,res)=>{
let department=[];

	let fromdate=req.params.frmdate;
	let todate=req.params.todate;

	if(req.params.department=='All'){
//	department=["Pharmacy","Surgery","Opticals","LABORATORY"];

	console.log("from date : "+ req.params.frmdate);
	console.log("To date : "+ req.params.todate);
		console.log("department : "+ department);
		connections.scm_public.query(files.discountall,[fromdate,todate,fromdate,todate,fromdate,todate,fromdate,todate],

		(error,resdiscountall)=>{
console.log("discountall");
		if (error) console.error(error);

			res.json({"result":{"Discount":resdiscountall}});
		}

		);


}
else if((req.params.department=='Pharmacy')||(req.params.department=='Surgery')||(req.params.department=='Opticals'))
{


	department=req.params.department;
	console.log(department);

		console.log("from date : "+ req.params.frmdate);
		console.log("To date : "+ req.params.todate);
			console.log("department : "+ department);
			connections.scm_public.query(files.discount,[fromdate,todate,department,fromdate,todate,department,fromdate,todate,department,fromdate,todate,department],
			(error,resdiscount)=>{
console.log("discount");
			if (error) console.error(error);

				res.json({"result":{"Discount":resdiscount}});
			}

			);

//	console.log("done");
}
else if(req.params.department=='Laboratory'){

		department=["INVESTIGATION","TREATMENT","LABORATORY"];
  console.log(department);
		connections.scm_public.query(files.discountlab,[fromdate,todate,department,fromdate,todate,department,fromdate,todate,department,fromdate,todate,department],
		(error,resdiscountlab)=>{
console.log("discount lab");

		if (error) console.error(error);

			res.json({"result":{"Discount":resdiscountlab}});
		}

		);

}
else if((req.params.department=='VRInjection')||(req.params.department=='VRSurgery')) {
console.log(req.params.department);
if(req.params.department=='VRInjection')
{
	department=["VR - INJECTION","VR INJECTION","VR INJECTIONS"]

}
else {
	department=["VR-SURGERY"]
}

connections.scm_public.query(files.discountvr,[fromdate,todate,department,fromdate,todate,department,fromdate,todate,department,fromdate,todate,department],
(error,resdiscountvr)=>{

if (error) console.error(error);
	console.log("discountvr");

	res.json({"result":{"Discount":resdiscountvr}});
}

);

}
else if ((req.params.department=='Cataract')||(req.params.department=='Refractive')||(req.params.department=='Cornea')) {
department=req.params.department;

	connections.scm_public.query(files.discountsplit,[fromdate,todate,department,fromdate,todate,department,fromdate,todate,department,fromdate,todate,department],
	(error,resdiscountsplit)=>{

	if (error) console.error(error);
		console.log(department);

		res.json({"result":{"Discount":resdiscountsplit}});
	}

	);

}
else {
	connections.scm_public.query(files.discountothers,[fromdate,todate,fromdate,todate,fromdate,todate,fromdate,todate],
	(error,resdiscountothes)=>{

	if (error) console.error(error);
	//	console.log(department);

		res.json({"result":{"Discount":resdiscountothes}});
	}

	);
}

};




// collection --praveenraj
exports.collectiondetailim=(req,res)=>{

	let frmdate=req.params.fromdate;
	let todate=req.params.todate;
	let entity=req.params.entity;
	let branch=req.params.branch;

if ((entity=="All")&&(branch=="All")) {
	console.log("hit in all");
	let collectionquery="Select * from collection_detail where DATE(PAYMENT_OR_REFUND_DATE) BETWEEN "+"'"+frmdate+"'" +" AND "+"'"+todate+"'";
connections.scm_public.query(collectionquery,(err,rescollection)=>{
	if(err)console.error(err);
res.json({
	"result":{"collection":rescollection}
})
})

}else if (branch=="All") {

	let collectionquery="Select * from collection_detail where DATE(PAYMENT_OR_REFUND_DATE) BETWEEN "+"'"+frmdate+"'" +" AND "+"'"+todate+"' and PARENT_BRANCH='"+entity+"'";
console.log(collectionquery);
	connections.scm_public.query(collectionquery,(err,rescollection)=>{
	if(err)console.error(err);
	res.json({
		"result":{"collection":rescollection}
	})
})
}else
{
	let collectionquery="Select * from collection_detail where DATE(PAYMENT_OR_REFUND_DATE) BETWEEN "+"'"+frmdate+"'" +" AND "+"'"+todate+"' and PARENT_BRANCH='"+entity+"' and BRANCH='"+branch+"'";
console.log(collectionquery);
connections.scm_public.query(collectionquery,(err,rescollection)=>{
	if(err)console.error(err);
	res.json({
		"result":{"collection":rescollection}
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

	let ftddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-'+("0" + (temp.getDate())).slice(-2);
	let mtddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-01';

	let tarArr = ftddate.split("-");
	let tarMonth = tarArr[1];
	let tarYear = tarArr[0];


	if(tarMonth<04){
		var ytdyear = tarYear-1;
	}else{
		var ytdyear = tarYear;
	}

	let ytdfrom  = ytdyear+'-04'+'-01';

  connections.scm_public.query(files.new_opd_super,[mtddate, ftddate],(error, resnewopd) => {
      if (error){
		console.log(error);
	  }else{
	  connections.scm_public.query(files.device_history,[mtddate, ftddate],(error, resdevicehistory) => {
		if (error) {
			console.log(error);
		}else{
			connections.scm_public.query(files.device_history_ytd,[ytdfrom, ftddate],(error, resdevicehistoryytd) => {
			if (error) {
				console.log(error);
			}else{
			connections.scm_public.query(files.device_revenue,[mtddate, ftddate],(error, resdevicerevenue) => {
				if (error){
					console.log(error);
				}else{
					connections.scm_public.query(files.device_revenue_ytd,[ytdfrom, ftddate],(error, resdevicerevenueytd) => {
				if (error){
					console.log(error);
				}else{
				  //console.log(resdevicerevenueytd);
				  connections.scm_public.query("select br.entity as entity,br.region as region,br.code as branch,br.branch as branchname,tr.total from branches as br  LEFT JOIN usage_track_target as tr ON br.id=tr.branch_id AND target_month='"+tarMonth+"' AND target_year='"+tarYear+"'",(err, targetres) => {
						if (err){
							console.log(err);
						}else{
						  connections.scm_public.query("select * from branches",(err, branchres) => {
							  if (err){
							  console.log(err);
							  }else{
									  mods.nativeFunctions
										.newUsageTrackerNative(
										  resnewopd,
										  branchres,
										  ftddate,
										  resdevicehistory,
										  targetres,
										  resdevicerevenue,
										  resdevicehistoryytd,
										  resdevicerevenueytd
										)
										.then(final => res.json(final));
							  }
									});
						}
				  });
					}
					});
				}
				});
			}
			});
	    }
		});
		}
	});
  // }
};



// consultation

exports.consultation=(req,res)=>{
	console.log("hit in consultation");
	let ftddate =req.params.date;
	let temp= new Date(ftddate);
	let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";

connections.scm_public.query(
	files.new_consultation_super,
	[mtddate, ftddate],
	(error,resnewconsult)=>{
	if(error)console.error(error);
	//console.log(resnewconsult);
	connections.scm_public.query(
		"select * from branches",(err,branches)=>{
			if(err)console.error(err);
			mods.nativeFunctions.newconsultation(
				resnewconsult,branches,ftddate
			).then(final=>res.json(final));
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

	let ftddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-'+("0" + (temp.getDate())).slice(-2);
	let mtddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-01';

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
          connections.scm_public.query("select br.entity as entity,br.region as region,br.code as branch,br.branch as branchname,tr.total,tr.amount from branches as br  LEFT JOIN usage_track_target as tr ON br.id=tr.branch_id AND target_month='"+tarMonth+"' AND target_year='"+tarYear+"'",(err, targetres) => {
				if (err)console.log(err);
				  connections.scm_public.query(
					"select * from branches",
					(err, branchres) => {
					  if (err) console.error(err);
							connections.scm_public.query(files.currency_details, [mtddate, ftddate],(currerr, currres) => {
							if (currerr)  console.error(currerr);
								connections.scm_public.query(files.currency_det_last_mth, (curr_last_err, curr_last_res) => {
									if (curr_last_err)  console.error(curr_last_err);
							  mods.nativeFunctions
								.newUsageTrackerNativeNew(
								  resnewopd,
								  branchres,
								  ftddate,
								  resdevicehistory,
								  targetres,
								  resdevicerevenue,
								  currres,
                                  curr_last_res
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
      let drtbillsquery = "INSERT INTO drt_bills (Bill_id,Net_amount,Drt_percentage_value,Drt_amount,Created_by,Drt_id,Category,Comments,Aggreed_percentage_value,Billed_branch,Bill_no,bill_date,Mrn,Name,Reference) VALUE (" + billid + "," + netamount + "," + commission + "," + drtamount + ",'" + userid + "','" + drtid + "','" + category + "','" + comments + "'," + aggcommission + ",'" + billedbranch + "', '" + billno + "','" + billdate + "','" + mrn + "','" + name + "','" + ref + "' );"
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
  let expensedatefin=req.body.sch_expensedate;
  console.log("schbillid :" + schbillid);
  let findrtbillupdate = "update drt_bills set admin_Approved_by='" + schid + "' ,Approval_status=2,Admin_Approved_time=Now(),Expense_date='"+expensedatefin+"' where id=" + schbillid
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
  let fincomments=req.body.sch_comments;
let concat=fincomments.concat("-- by finance")
  let findrtbillcancel = "update drt_bills set Approval_status=4,Cancelled_time=now(),Cancelled_by='" + finid + "',Comments='"+concat+"' where id=" + finbillid
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


exports.main_route_usage_tracker_new_email = (yesterday,callback) => {
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

      if (error)  {
		  callback("new opd select query error",null);
	 }else{
	  connections.scm_public.query(
		files.device_history,
		[mtddate, ftddate],
		(error, resdevicehistory) => {
		if(error){
			callback("device_history select query error",null);
		}else{
			connections.scm_public.query(
			files.device_revenue,
			[mtddate, ftddate],
			(error, resdevicerevenue) => {
			if(error){
				callback("device_revenue select query error",null);
			}else{
          connections.scm_public.query("select br.entity as entity,br.region as region,br.code as branch,br.branch as branchname,tr.total,tr.amount from branches as br  LEFT JOIN usage_track_target as tr ON br.id=tr.branch_id AND target_month='"+tarMonth+"' AND target_year='"+tarYear+"'",(err, targetres) => {
				if(err){
					callback("target join query  error",null);
				}else{
					connections.scm_public.query(files.currency_details, [mtddate, ftddate],(currerr, currres) => {
					 if (currerr) {
						console.log(currerr);
					 }else{
						 connections.scm_public.query(files.currency_det_last_mth, (curr_last_err, curr_last_res) => {
						 if (curr_last_err) {
							console.log(curr_last_err);
						  }else{

							  connections.scm_public.query(
								"select * from branches",
								(err, branchres) => {
								  if(err) {
									  callback("branches query  error",null);
								  }else{
										  mods.nativeFunctions
											.newUsageTrackerNativeNew(
											  resnewopd,
											  branchres,
											  ftddate,
											  resdevicehistory,
											  targetres,
											  resdevicerevenue,
											  currres,
											  curr_last_res
											)
											.then(final => callback(null,final));
								 }
										});
						  }
						  });

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



exports.avaEmailList = (emailtemp,callback) =>{
	connections.scm_public.query("select fromid,toid,bccid,ccid,passcode from email where scmtype='avaemail'",(error, domesticemailres) => {
      if (error) {
		  callback("select email query",null);
	  }else{
		  callback(null,domesticemailres);
	  }
	});
}



exports.upload_doctor = async (req, res) => {
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
          doctordatainserted: "Pan card already Available"
        })
      }
    })
  } else {
    let pansearch = await pansearchfile(req);
    console.log(pansearch);
    if ((pansearch.result == null) || (pansearch.result == "")) {
      let agreementfile = await moveagreementfile(req);

      if ((agreementfile.result == 'erroragg') || (agreementfile.result == 'invalid')) {
        res.json({
          "ResponseCode": 202,
          "ResponseMsg": "Agreement not Uploaded .. Please upload valid format"
        });
        agreementfile = 'error'
      } else {
        console.log("hit in agrre");
        console.log(agreementfile);
      }

      let panfile = await movepanfile(req);
      if ((panfile.result == 'errorpan') || (panfile.result == 'invalid')) {
        res.json({
          "ResponseCode": 203,
          "ResponseMsg": "Pan not Uploaded .. Please upload valid format"
        });
        panfile = 'error'
      } else {
        console.log("hitin panfile");

      }

      let passbookfile = await movepassbookfile(req);
      if ((passbookfile.result == 'errorpassbook') || (passbookfile.result == 'invalid')) {
        res.json({
          "ResponseCode": 204,
          "ResponseMsg": "Passbook not Uploaded .. Please upload valid format"
        });
        passbookfile = 'error'
      } else {
        console.log("hitin passfile");
      }

      if ((agreementfile == "error") || (panfile == "error") || (passbookfile == "error") || (agreementfile == "") || (panfile == "") || (passbookfile == "")) {
        console.log("error");
      } else {

        let results = await errorresult(agreementfile, panfile, passbookfile)
  //      console.log(results);
        doc_agreement = 'Yes'
        if (results.result == "updated") {
          connections.scm_root.query("INSERT INTO `drt_customer` (Name,Address,Contact_no,Email,Pan_no,GSTIN,Percentage,STATUS,Branch,Account_no,Bank_ifsc,Bank_name,Agreement,Agreement_url,Pan_url,Passbook_url,uploaded_user,Payment_type,Infavour_of) VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [doctor_name, doctor_branch, doctor_contact, doctor_email, doctor_pan, doctor_gstin, doctor_agreed, isActive, doctor_branch, doctor_acc, doctor_IFSC, doctor_bankbranch, doc_agreement, results.agg, results.pan, results.pass, user_name, paymenttype, doctor_infavour], (err, resdrtcustomer) => {
              console.log(resdrtcustomer);
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
          console.log("please");
        }
      }


    } else {
      console.log("alredy Available");
      res.json({
        "ResponseCode": 201,
        "ResponseMsg": "Pan Number already exists"
      });
    }

  }


}

let pansearchfile = async (req) => {
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

  return new Promise(value => {
    console.log("hit in upload full");
    connections.scm_public.query("select Pan_no from drt_customer where Pan_no=? and status in (1,-1) AND Name=? and Infavour_of=? and Branch=? group by Pan_no", [doctor_pan,doctor_name,doctor_infavour,doctor_branch], (err, resultpan) => {
console.log(resultpan);
      if (err) {
        value({
          "result": null
        })
      } else {
        value({
          "result": resultpan
        })
      }

    })
  })
}

let moveagreementfile = async (req) => {
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

  if (upload.fileagreementupload != null) {

    return new Promise(resolve => {
      if ((upload.fileagreementupload != null) || (upload.fileagreementupload != '')) {
        agreesampleFile = upload.fileagreementupload;
        console.log("====================================");
        datetime = date.concat(agreesampleFile.name);
        aggname = user_name.concat("_", "aggreement_", datetime)

        if (agreesampleFile.mimetype == "image/jpeg" || agreesampleFile.mimetype == "image/png" ||
          agreesampleFile.mimetype == "image/gif" || agreesampleFile.mimetype == "application/pdf") {
          agreeuploadPath = '/var/www/andaman/drtfiles/' + aggname;
          doc_agreement = 'Yes'
          resolve({
            "result": agreeuploadPath,
            "file": agreesampleFile,
            "doc_agreement": doc_agreement,
            "upload_file": aggname
          })

        } else {
          console.log("hit");
          resolve({
            "result": "invalid"
          })
        }
      } else {

        resolve({
          "result": "null"
        })
      }

    })

  } else {
    return new Promise(resolve => {
      resolve({
        "result": "null"
      })
    })
  }

}

let movepanfile = async (req) => {
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
  let docname = '';
  return new Promise(resolve => {
    if (upload.filepanupload != null) {
      pansampleFile = upload.filepanupload;
      console.log("====================================");
      datetime = date.concat(pansampleFile.name);
      panname = user_name.concat("_", "pan_", datetime)

      if (pansampleFile.mimetype == "image/jpeg" ||
        pansampleFile.mimetype == "image/png" ||
        pansampleFile.mimetype == "image/gif" ||
        pansampleFile.mimetype == "application/pdf") {
        panuploadPath = '/var/www/andaman/drtfiles/' + panname;
        doc_agreement = 'Yes'
        resolve({
          "result": panuploadPath,
          "file": pansampleFile,
          "doc_agreement": doc_agreement,
          "upload_file": panname
        })

      } else {
        resolve({
          "result": "invalid"
        })
      }
    } else {

      resolve({
        "result": "null"
      })
    }

  })

}

let movepassbookfile = async (req) => {
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


  return new Promise(resolve => {
    console.log(upload.filepassbookupload);
    if (((upload.filepassbookupload) != null)) {
      passbooksampleFile = upload.filepassbookupload;
      console.log("====================================");
      datetime = date.concat(passbooksampleFile.name);
      passname = user_name.concat("_", "passbook_", datetime)

      if (passbooksampleFile.mimetype == "image/jpeg" ||
        passbooksampleFile.mimetype == "image/png" ||
        passbooksampleFile.mimetype == "image/gif" ||
        passbooksampleFile.mimetype == "application/pdf") {
        passbookuploadPath = '/var/www/andaman/drtfiles/' + passname;
        doc_agreement = 'Yes'
        resolve({
          "result": passbookuploadPath,
          "file": passbooksampleFile,
          "doc_agreement": doc_agreement,
          "upload_file": passname
        })

      } else {
        resolve({
          "result": "invalid"
        })

      }
    } else {
      resolve({
        "result": "null"
      })
    }
  })
}

let errorresult = async (a, b, c) => {

  console.log(a + " " + b + " " + c);
  let aggfile = '';
  let panfile = '';
  let passbookfile = '';
  let astatus = '';
  let bstatus = '';
  let cstatus = '';
  return new Promise(resolve => {
    if ((a == 'error') || (b == 'error') || (c == "error")) {

    } else {
      console.log(a.file + " " + b.file + " " + c.file);

      if (a.result != "null") {
        console.log("a");
        aggfile = a.file.mv(a.result, function(err) {
          if (err) {
            astatus = 'false'
          } else {
            console.log("updated");
            astatus = "true"
          }
        })
      }
      if (b.result != "null") {
        console.log("b");
        panfile = b.file.mv(b.result, function(err) {
          if (err) {
            bstatus = "false"
          } else {
            console.log("updated");
            bstatus = "true"
          }
        })

      }
      if (c.result != "null") {
        console.log("c");
        passbookfile = c.file.mv(c.result, function(err) {
          if (err) {
            cstatus = "false"
          } else {
            console.log("updated");
            cstatus = "true"
          }
        })

      }
    }
    resolve({
      "result": "updated",
      "agg": a.upload_file,
      "pan": b.upload_file,
      "pass": c.upload_file
    })

  })

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
  var fileLocation = '/var/www/andaman/drtfiles/'+filepath;
  console.log(fileLocation);
  res.download(fileLocation);
}

exports.fin_doctorlist = (req, res) => {
  let fin_status = req.params.status;
  let fin_branch = req.params.branch;

  console.log(fin_status);
  console.log(fin_branch);
  if ((fin_branch == "All") && (fin_status == "All")) {
    connections.scm_public.query(files.findocallall,(err, resfin) => {
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

exports.fin_doctorapprove=(req,res)=>{
  console.log(req.body);
  let fin_id=req.body.fin_id;
  console.log(fin_id);
  connections.scm_root.query("UPDATE drt_customer SET STATUS=1,Created_by=NOW() WHERE ID=? ",[fin_id],(err,resupdatedoc)=>{
    console.log(resupdatedoc);
    if(err) console.error(err);
    res.json({
      Dataupdated: "updated"
    })
  })

}

exports.fin_doctorreject=(req,res)=>{
  console.log(req.body);
  let fin_id=req.body.fin_id;
  console.log(fin_id);
  connections.scm_root.query("UPDATE drt_customer SET STATUS=-2,Cancelled_time=NOW() WHERE ID=? ",[fin_id],(err,resupdatedoc)=>{
    console.log(resupdatedoc);
    if(err) console.error(err);
    res.json({
      Dataupdated: "updated"
    })
  })

}

exports.fin_loaddoc=(req,res)=>{

  connections.scm_public.query("SELECT COUNT(*) as count FROM drt_customer WHERE STATUS=-1",(err,resloaddoc)=>{
    if(err) console.error(err);
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
      connections.scm_public.query(files.chsubbillstatusall, [fromdata, status, branch], (err, ressub) => {
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



exports.expense_date=(req,res)=>{
  console.log(req.body);
  let finbill_id=req.body.sch_bill_id;
  let fin_expensedate=req.body.sch_expensedate;
  let findrtbillexpenseupdate = "update drt_bills set Expense_date='"+fin_expensedate+"' where id=" + finbill_id
  console.log(findrtbillexpenseupdate);

    connections.scm_root.query(findrtbillexpenseupdate,(err,finexpense)=>{
        if (err) console.error(err);
        res.json({
          Dataupdated: "updated"
        })
    })

}



exports.revvscogs_services = (req, res) => {
	     let ftddate = req.params.date;
		 let mothYear = ftddate.split("-");
		 let year = mothYear[0];
		 let month = mothYear[1];
		 if(month<04){
			year =  year-1;
		 }

		 let start='',end='';
		 if(req.params.type == 'Month'){
			 start = ftddate+'-01';
			 end = ftddate+'-31';
		 }else{
			 start = year+'-04-01';
			 end = ftddate+'-31';
		 }
		 let entity = req.params.entity;
		 let region = req.params.region;
		 let branch = req.params.branch;
		 var revenueqry = '',revReferalQry1='',revReferalQry2='';
		 var cogsqry = '';
		 if(entity=='AEH'){
			 var entitycondition = " entity in ('AEH')";
		 }else{
			 var entitycondition = " entity in ('AHC','AHI')";
		 }
		 if(ftddate!='undefined' && entity!='undefined' && region!='undefined' &&  branch!='undefined'){



			 revenueqry = 'select  * from  revenue_details where '+entitycondition+'  and BILLED="'+branch+'" and TRANSACTION_DATE between "'+start+'" and "'+end+'" and id!=""';
			 cogsqry = 'select  * from  cogs_details where '+entitycondition+'  and branch="'+branch+'" and trans_date between "'+start+'" and "'+end+'" and  id!=""';

			 revReferalQry1 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE="'+branch+'" and BILLED!="'+branch+'" and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';

			 revReferalQry2 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE!="'+branch+'" and BILLED="'+branch+'" and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';


		 }else if(ftddate!='undefined' && entity!='undefined' && region!='undefined' &&  branch=='undefined'){

			 console.log(777777777);
			// var whereCondition1 = whereConditionBuild1(entity,region);
             //var whereCondition = whereConditionBuild(entity,region);
             var branches = branchList(entity,region);
			 revenueqry = 'select UNIT,`GROUP`,SUBGROUP,ITEMCODE,NET_AMOUNT from  revenue_details   where '+entitycondition+' and BILLED in '+branches+'   and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';


			  cogsqry = 'select top,second,`group`,sub_group,item_code,actual_value from  cogs_details   where '+entitycondition+' and branch in '+branches+'  and trans_date between "'+start+'" and "'+end+'" and  id!=""';

			 revReferalQry1 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE IN '+branches+' and BILLED NOT IN '+branches+' and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';

			 revReferalQry2 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE NOT IN '+branches+' and BILLED IN '+branches+' and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';

		 }else if(ftddate!='undefined' && entity!='undefined' && region=='undefined' &&  branch=='undefined'){
			 console.log(8888888888888);
			 var branches = branchList(entity,region);

			 revenueqry = 'select UNIT,`GROUP`,SUBGROUP,ITEMCODE,NET_AMOUNT from  revenue_details   where '+entitycondition+'  and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';
			 cogsqry = 'select top,second,`group`,sub_group,item_code,actual_value from  cogs_details   where '+entitycondition+'  and trans_date between "'+start+'" and "'+end+'" and  id!=""';

			 revReferalQry1 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE IN '+branches+' and BILLED NOT IN '+branches+' and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';

			 revReferalQry2 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE NOT IN '+branches+' and BILLED IN '+branches+' and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';


		 }else if(ftddate!='undefined' && entity=='undefined' && region!='undefined' &&  branch=='undefined'){
			console.log(99999999999999);
			//var whereCondition1 = whereConditionBuild1(entity,region);
			//var whereCondition = whereConditionBuild(entity,region);

			 var branches = branchList(entity,region);
			revenueqry = 'select * from  revenue_details   where entity in ("AEH","AHC","AHI") and BILLED in '+branches+'  and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';
			cogsqry = 'select * from  cogs_details   where entity in ("AEH","AHC","AHI") and branch in '+branches+'   and trans_date between "'+start+'" and "'+end+'" and  id!=""';

			revReferalQry1 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE IN '+branches+' and BILLED NOT IN '+branches+' and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';

			 revReferalQry2 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE NOT IN '+branches+' and BILLED IN '+branches+' and TRANSACTION_DATE between "'+start+'" and "'+end+'" and  id!=""';



		 }else{
			 console.log(101010101010);
			 var branches = branchList(entity,region);
			 revenueqry = 'select * from  revenue_details   where entity in ("AEH","AHC","AHI") and TRANSACTION_DATE between "'+start+'" and "'+end+'"';
			 cogsqry = 'select * from  cogs_details   where entity in ("AEH","AHC","AHI") and trans_date between "'+start+'" and "'+end+'" ';


			revReferalQry1 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE IN '+branches+' and BILLED NOT IN '+branches+' and TRANSACTION_DATE between "'+start+'" and "'+end+'"';

			 revReferalQry2 = 'select  sum(NET_AMOUNT) as NET_AMOUNT from  revenue_details where NATIVE NOT IN '+branches+' and BILLED IN '+branches+' and TRANSACTION_DATE between "'+start+'" and "'+end+'"';




		 }
            async.parallel({
				revenue: (callback) => {
					  connections.scm_public.query(revenueqry,(error, revresults) => {
						  callback(error, revresults);
					  });

                },
				cogs: (callback) => {
                    connections.scm_public.query(cogsqry,(error, cogsres) => {
						  callback(error, cogsres);

					  });

                }
				,
                revenue1: (callback) => {
                    connections.scm_public.query(revReferalQry1,(error, revreferres1) => {
						  callback(error, revreferres1);
					  });

                }
				,
				revenue2: (callback) => {
                    connections.scm_public.query(revReferalQry2,(error, revreferres2) => {
						  callback(error, revreferres2);
					  });

                }


            }, (err, results) => {
                if (err) {
				   res.json(err);

                } else {
					mods.nativeFunctions
									.revCogsServices(
									  results.revenue,
									  results.cogs,
									  results.revenue1,
									  results.revenue2,
									)
									.then(final => res.json(final));


                    //resolve(results);
                }

            });


};


/*function whereConditionBuild1(argEntity,argRegion){

	if(argEntity!='undefined' && argRegion!='undefined'){
		var branchesarr = regionMapping[argEntity][argRegion];
	}else if(argEntity=='undefined' && argRegion!='undefined'){
		var branchesarr = regionMapping[argRegion];
	}

	var branchIN = '';
	var branchlist = '';
	for (let key in branchesarr) {
	branchIN+="'"+branchesarr[key]+"',";
	}
	var branchlist = branchIN.substr(0, branchIN.length-1);
	if(branchlist){
		return ' and BILLED in ('+branchlist+') ';
	}else{
		return '';
	}



}*/


function branchList(argEntity,argRegion){

	if(argEntity!='undefined' && argRegion!='undefined'){
		var branchesarr = regionMapping[argEntity][argRegion];
	}else if(argEntity=='undefined' && argRegion!='undefined'){
		var branchesarr = regionMapping[argRegion];
	}else if(argEntity!='undefined' && argRegion=='undefined'){
		var branchesarr = entityMapping[argEntity];
	}else if(argEntity=='undefined' && argRegion=='undefined'){
		var branchesarr = entityMapping['ALL'];
	}

	var branchIN = '';
	var branchlist = '';
	for (let key in branchesarr) {
	branchIN+="'"+branchesarr[key]+"',";
	}
	var branchlist = branchIN.substr(0, branchIN.length-1);
	if(branchlist){
		return '  ('+branchlist+') ';
	}else{
		return '';
	}



}



exports.pettycash_category = (req, res) => {
  connections.scm_public.query(files.pettycash_category,(error, branchresults) => {
      if (error) console.error(error);
          res.json(branchresults);
    }
  );
  // }
};


exports.pettycash_allocated_amount = (req, res) => {
  let branch = req.params.branch;
  console.log(branch);


  connections.scm_public.query(files.pettycash_allocated_amount, [branch], (err, alocated_amount_res) => {
    if (err) console.error(err);
    res.json(alocated_amount_res)
  })
  // }
};


exports.bill_submit = async (req, res) => {
  console.log("1111");

  let branch = req.body.branch;
  let voucherno = req.body.voucherno;
  let category = req.body.category;
  let remarks = req.body.remarks;
  let amount = req.body.amount;
  let vendorname = req.body.vendorname;
  let billno = req.body.billno;
  let sumbissiondate = req.body.sumbissiondate;
  let chid = req.body.chid;
  let billdate = req.body.expensedate;
  let branchamount = await branchamountResult(branch);

  if (branchamount.result == null) {
    res.json({
      "ResponseCode": 201,
      "ResponseMsg": "You can't rise bill for this branch:" + branch
    });
  } else if (branchamount.result == 'error') {
    res.json({
      "ResponseCode": 202,
      "ResponseMsg": "Technical error"
    });
  }  else {
    console.log("hit in bill_submit");


    let balanceAmount = 0;
    let creditAmount = branchamount.result[0].credit;
    console.log("creditAmount : "+creditAmount);


    let notificationAmount = branchamount.result[0].notify_amount;
    console.log("notificationAmount : "+notificationAmount);

    console.log("amount : "+amount);

    let debitamountCalculate = parseInt(branchamount.result[0].debit) + parseInt(amount);
    console.log("debitamountCalculate : "+debitamountCalculate);

    if (branchamount.result[0].balance == 0) {
      balanceAmount = parseInt(branchamount.result[0].credit) - parseInt(debitamountCalculate);
      console.log("balanceAmount : "+balanceAmount);
    } else {
      balanceAmount = parseInt(branchamount.result[0].balance) - parseInt(amount);
      console.log("balanceAmount : "+balanceAmount);
    }
    console.log("debit amount ")
    console.log("debitamountCalculate : " + debitamountCalculate);


  //  process.exit(1);

    if (debitamountCalculate <= notificationAmount) {
      console.log("not reached");
      let voucherFileMoveStatus = await moveVoucherFile(req);
      let billFileMoveStatus = await moveBillFile(req);
      if (voucherFileMoveStatus.result == null && req.files.fileVoucher != null) {
        res.json({
          "ResponseCode": 204,
          "ResponseMsg": "Voucher not uploaed. Try Again"
        });
      } else if (billFileMoveStatus.result == null && req.files.fileBill != null) {
        res.json({
          "ResponseCode": 205,
          "ResponseMsg": "Bill not uploaed. Try Again"
        });
      } else {
        let voucherName = voucherFileMoveStatus.result;
        let billName = billFileMoveStatus.result;
        if (billName == null) {
          billName = 'NA';
        }
        let inserBillDetails = await insertData(creditAmount, debitamountCalculate, balanceAmount, notificationAmount, branch, voucherno, category, remarks, amount, vendorname, billno, sumbissiondate, chid, billdate, voucherName, billName);
        console.log("inserBillDetails---------");
        console.log(inserBillDetails);


        //process.exit(1);
        if (inserBillDetails.result == 'success') {
          console.log("hit");
          console.log("debitamountCalculate :" + debitamountCalculate);
          console.log("notificationAmount : " + notificationAmount);

          if (debitamountCalculate >= notificationAmount) {

            console.log("update pettycash set status=1 where status=0 and branch='" + branch + "' and ch_id='" + chid + "'");
            connections.scm_public.query("update pettycash set status=1 where status=0 and branch='" + branch + "' and ch_id='" + chid + "'", (error, updateRes) => {
              if (error) {
                console.log("##############");
                res.json({
                  "ResponseCode": 206,
                  "ResponseMsg": "Not submitted. Try Again"
                });
              } else {
                console.log("!!!!!!!!!!!!!!!");
                res.json({
                  "ResponseCode": 200,
                  "ResponseMsg": "Submitted and amount sent for sch aprroval"
                });
              }
            });
          } else {

            console.log("@@@@@@@@@@@@@@");
            res.json({
              "ResponseCode": 200,
              "ResponseMsg": "Submitted"
            });
          }

        } else {
          res.json({
            "ResponseCode": 207,
            "ResponseMsg": "Not submitted. Try Again"
          });
        }

      }

    } else {

      console.log("hit in else");
      console.log("branchamount.result[0].balance : "+branchamount.result[0].balance);
      console.log("balanceAmount : "+balanceAmount);

      if ((branchamount.result[0].balance > 0 && (balanceAmount > 0) && (balanceAmount <= branchamount.result[0].balance))
      ||((branchamount.result[0].balance==0) &&(branchamount.result[0].debit==0)))
       {
        console.log("branchamount.result[0].balance :" + branchamount.result[0].balance);
        console.log("balanceAmount : " + balanceAmount);
        console.log("balance part");
        let voucherFileMoveStatus = await moveVoucherFile(req);
        let billFileMoveStatus = await moveBillFile(req);
        if (voucherFileMoveStatus.result == null && req.files.fileVoucher != null) {
          res.json({
            "ResponseCode": 204,
            "ResponseMsg": "Voucher not uploaed. Try Again"
          });
        } else if (billFileMoveStatus.result == null && req.files.fileBill != null) {
          res.json({
            "ResponseCode": 205,
            "ResponseMsg": "Bill not uploaed. Try Again"
          });
        } else {
          let voucherName = voucherFileMoveStatus.result;
          let billName = billFileMoveStatus.result;
          if (billName == null) {
            billName = 'NA';
          }
          let inserBillDetails = await insertData(creditAmount, debitamountCalculate, balanceAmount, notificationAmount, branch, voucherno, category, remarks, amount, vendorname, billno, sumbissiondate, chid, billdate, voucherName, billName);
          console.log("inserBillDetailsssssssssss");
          console.log(inserBillDetails);
          if (inserBillDetails.result == 'success') {
              if (debitamountCalculate >= notificationAmount) {

                            console.log("update pettycash set status=1 where status=0 and branch='" + branch + "' and ch_id='" + chid + "'");
                            connections.scm_public.query("update pettycash set status=1 where status=0 and branch='" + branch + "' and ch_id='" + chid + "'", (error, updateRes) => {
                              if (error) {
                                console.log("##############");
                                res.json({
                                  "ResponseCode": 206,
                                  "ResponseMsg": "Not submitted. Try Again"
                                });
                              } else {
                                console.log("!!!!!!!!!!!!!!!");
                                res.json({
                                  "ResponseCode": 200,
                                  "ResponseMsg": "Submitted and amount sent for sch aprroval"
                                });
                              }
                            });
              }
              else {
                res.json({
                  "ResponseCode": 200,
                  "ResponseMsg": "Submitted"
                });
              }
          }
          else {
            res.json({
              "ResponseCode": 207,
              "ResponseMsg": "Not submitted. Try Again"
            });
          }


        }
      }

      else {
        res.json({
          "ResponseCode": 203,
          "ResponseMsg": "You reached limit :" + branch
        });
      }
    }

  }

};




let  branchamountResult = async (branch) =>  {
    console.log("2222222");
	 console.log(branch);

		return  new Promise(resolve => {
			connections.scm_public.query("select branch,credit,debit,balance,notify_amount from pettycash_allocate_amount where branch='"+branch+"' and status=1 ",(error, branchAmountRes) => {
				if (error) {
					console.log(error);
					console.log("333333");
					resolve({"result":"error"})
				}else{

					console.log(branchAmountRes);
					if(branchAmountRes.length>0){
					  console.log("44444");
					  //console.log(branchAmountRes[0]);
					  resolve({"result":branchAmountRes});
					}else{
					  console.log("555555");
					  resolve({"result":null})
					}
				}
			});
		});


};

let moveVoucherFile = async (req) =>  {

	upoload = req.files;
    if(upoload!=null && upoload.fileVoucher!=null){
		return  new Promise(resolve => {
			  if (upoload.fileVoucher.mimetype == "image/jpeg" || upoload.fileVoucher.mimetype == "image/png" || upoload.fileVoucher.mimetype == "image/gif" || upoload.fileVoucher.mimetype == "application/pdf") {
					time = new Date().getTime();
					oldfilename = upoload.fileVoucher.name;
					filext = oldfilename.split('.').pop();
					newfilename = time+'_voucher'+'.'+filext;
					//voucherFilePath = 'D:/git/cogs-api-new-final/voucher/' + newfilename;
					voucherFilePath = '/var/www/andaman/voucher/' + newfilename;
					console.log("uploadPath : " + voucherFilePath);
					upoload.fileVoucher.mv(voucherFilePath, function(err) {
					  if (err) {
						resolve({"result":null})
					  }else{
						resolve({"result":newfilename})
					  }

					});
			}
		});
	}else{
		return {"result":null}
	}
};

let moveBillFile = async (req) =>  {
//new Date().getTime()
   console.log("billfile");
   //console.log(billFile);
   upoload = req.files;
    if(upoload!=null && upoload.fileBill!=null){
		return  new Promise(resolve => {
			  if (upoload.fileBill.mimetype == "image/jpeg" || upoload.fileBill.mimetype == "image/png" || upoload.fileBill.mimetype == "image/gif" || upoload.fileBill.mimetype == "application/pdf") {
					time = new Date().getTime();
					oldfilename = upoload.fileBill.name;
					filext = oldfilename.split('.').pop();
					newfilename = time+'_bill'+'.'+filext;
					//billFilePath = 'D:/git/cogs-api-new-final/bill/' + newfilename;
					billFilePath = '/var/www/andaman/bill/' + newfilename;
					console.log("uploadPath : " + billFilePath);
					upoload.fileBill.mv(billFilePath, function(err) {
					  if (err) {
						resolve({"result":null})
					  }else{
						resolve({"result":newfilename})
					  }

					});
				}
		});
	}else{
		return {"result":null}
	}
};


let insertData = async (creditAmount,debitamountCalculate,balanceAmount,notificationAmount,branch,voucherno,category,remarks,amount,vendorname,billno,sumbissiondate,chid,billdate,voucherName,billName) =>  {

			/*return  new Promise(resolve => {
				var stats = 0;
				if(debitamountCalculate>=notificationAmount){
					stats = 1;
				}
				connections.scm_public.getConnection((err, con) => {
					if (err) {
							resolve({"result":"inserterror"});
				    }


					con.beginTransaction(err => {
						 if (err) {
							resolve({"result":"inserterror"});
						 }
						 var insertQry = "insert into petty_cash set branch='"+branch+"',voucher_no='"+voucherno+"',categoty_id="+category+",vendorname='"+vendorname+"',bill_no='"+billno+"',bill_date='"+billdate+"',remarks='"+remarks+"',debit="+amount+",bill_submission='"+sumbissiondate+"',voucher_attach='"+voucherName+"',bill_attch='"+billName+"',status="+stats+",created_date=now(),ch_id='"+chid+"'";

						connections.scm_public.query(insertQry,(insrtError, insrtRes) => {
						if (insrtError) {
							con.rollback((rollbackErr) => {
								if (rollbackErr) {
									resolve({"result":"rollbackerror"});
								} else {
									resolve({"result":"inserterror"});
								}
							});
					    }else{
							var updateQry = "update pettycash_allocated_amount set debit'"+debitamountCalculate+"',balance='"+balanceAmount+"' where branch='"+branch+"'";

							console.log(updateQry);
							connections.scm_public.query(updateQry,(updateError, updateRes) => {
								if (updateError) {
									console.log("update error");
									console.log(updateError)
									con.rollback((rollbackErr) => {
										if (rollbackErr) {
											resolve({"result":"rollbackerror"});
										} else {
											resolve({"result":"updateerror"});
										}
									});
								}
								con.commit((commitError) => {
									if (commitError) {
										resolve({"result":"commiterror"});
									}
									resolve({"result":"success"});

								});

							});
						}
					});
					});
				});

			});*/
		return  new Promise(resolve => {
			var stats = 0;


			console.log("inside insert data");
			console.log(debitamountCalculate);
			console.log(notificationAmount);


			if(debitamountCalculate>=notificationAmount){
				stats = 1;
			}
  			var insertQry = "insert into pettycash set branch='"+branch+"',voucher_no='"+voucherno+"',category_id="+category+",vendorname='"+vendorname+"',bill_no='"+billno+"',bill_date='"+billdate+"',remarks='"+remarks+"',debit="+amount+",bill_submission='"+sumbissiondate+"',voucher_attach='"+voucherName+"',bill_attch='"+billName+"',status="+stats+",created_date=now(),ch_id='"+chid+"'";

			console.log(insertQry);
    var js = voucherno.slice(11);
    var cutjs = js.slice(0, -5);

    //console.log("cut js : " + cutjs);
			connections.scm_public.query(insertQry,(InsError, insrtRes) => {
				if (InsError) {
					console.log(error);
					console.log("333333");
					resolve({"result":"inserterror"});
				}else{
                    var updateQry = "update pettycash_allocate_amount set debit='"+debitamountCalculate+"',balance='"+balanceAmount+"' where branch='"+branch+"'";
					connections.scm_public.query(updateQry,(updateErr, updateRes) => {
						if(updateErr){

							console.log("XXXXXXXXXX");
							var last_id = insrtRes.insertId;

							var delQry = "delete from pettycash where sno="+last_id+"";
							console.log(delQry);
							connections.scm_public.query(delQry,(delErr, updateRes) => {
								if(delErr){
									resolve({"result":"deleteerror"});
								}else{
									resolve({"result":"updateerror"});
								}
							});

						}else{

							connections.scm_root.query("update pettycash_voucher set sequence_no=? where branch=?", [cutjs, branch], (err, resvoucher) => {
							if (err){
								resolve({"result":"updateerror"});
							}else{
								resolve({"result": "success"});
							}
							});




						}
					});
				}
			});

		});
};

exports.petty_cash_details = (req, res) => {
  let chid = req.params.user;
  let ftddate = req.params.date;
  let start = ftddate + '-01';
  let end = ftddate + '-31';
  let stats = req.params.status;
  let branch = req.params.branch;
  let where_con = '';


  let sqlQry = '';


  if(chid=='itteamch'){

    if (branch != 'undefined') {
      where_con += ' and A.branch IN ("' + branch + '")';
      sqlQry = "SELECT A.*,B.category_name,CASE WHEN A.status=0 THEN 'Bill created' WHEN A.status=-1 THEN 'Bill cancelled' WHEN A.status=1 THEN 'SchPending' WHEN A.status=2 THEN 'SchApproved / FinPending' WHEN A.status=3 THEN 'SchReject' WHEN A.status=4 THEN 'Finance Approved' WHEN A.status=5 THEN 'Finance Reject'  END AS sat FROM pettycash AS A INNER JOIN  pettycash_category AS B ON A.category_id=B.sno AND A.bill_submission BETWEEN '" + start + "' AND '" + end + "' " + where_con + " order by A.sno desc";
  //    console.log(sqlQry);
    } else {
      //  where_con += '-- and A.branch IN ("' + branch + '")';
      sqlQry = "SELECT A.*,B.category_name,CASE WHEN A.status=0 THEN 'Bill created' WHEN A.status=-1 THEN 'Bill cancelled' WHEN A.status=1 THEN 'SchPending' WHEN A.status=2 THEN 'SchApproved / FinPending' WHEN A.status=3 THEN 'SchReject' WHEN A.status=4 THEN 'Finance Approved' WHEN A.status=5 THEN 'Finance Reject'  END AS sat FROM pettycash AS A INNER JOIN  pettycash_category AS B ON A.category_id=B.sno AND A.bill_submission BETWEEN '" + start + "' AND '" + end + "' order by A.sno desc";
    //  console.log(sqlQry);
    }
  }
  else {
    if (branch != 'undefined') {
      where_con += ' and A.branch IN ("' + branch + '")';
      sqlQry = "SELECT A.*,B.category_name,CASE WHEN A.status=0 THEN 'Bill created' WHEN A.status=-1 THEN 'Bill cancelled' WHEN A.status=1 THEN 'SchPending' WHEN A.status=2 THEN 'SchApproved / FinPending' WHEN A.status=3 THEN 'SchReject' WHEN A.status=4 THEN 'Finance Approved' WHEN A.status=5 THEN 'Finance Reject'  END AS sat FROM pettycash AS A INNER JOIN  pettycash_category AS B ON A.category_id=B.sno AND A.bill_submission BETWEEN '" + start + "' AND '" + end + "' AND A.ch_id='" + chid + "' " + where_con + " order by A.sno desc";
  //    console.log(sqlQry);
    } else {
      //  where_con += '-- and A.branch IN ("' + branch + '")';
      sqlQry = "SELECT A.*,B.category_name,CASE WHEN A.status=0 THEN 'Bill created' WHEN A.status=-1 THEN 'Bill cancelled' WHEN A.status=1 THEN 'SchPending' WHEN A.status=2 THEN 'SchApproved / FinPending' WHEN A.status=3 THEN 'SchReject' WHEN A.status=4 THEN 'Finance Approved' WHEN A.status=5 THEN 'Finance Reject'  END AS sat FROM pettycash AS A INNER JOIN  pettycash_category AS B ON A.category_id=B.sno AND A.bill_submission BETWEEN '" + start + "' AND '" + end + "' AND A.ch_id='" + chid + "' order by A.sno desc";
  //    console.log(sqlQry);
    }
  }

  if (stats == 'SCHPending') {
    where_con += ' AND A.status IN(0,1)';
  } else if (stats == 'SCHApproved') {
    where_con += ' AND A.status IN(2)';
  } else if (stats == 'SCHReject') {
    where_con += ' AND A.status IN(3)';
  } else if (stats == 'FinancePending') {
    where_con += ' AND A.status IN(2)';
  } else if (stats == 'FinanceApproved') {
    where_con += ' AND A.status IN(4)';
  } else if (stats == 'FinanceReject') {
    where_con += ' AND A.status IN(5)';
  }
  // let sqlQry = "SELECT A.*,B.category_name FROM pettycash AS A INNER JOIN  pettycash_category AS B ON A.category_id=B.sno AND A.bill_submission BETWEEN '" + start + "' AND '" + end + "' AND A.ch_id='" + chid + "' " + where_con + " order by A.sno desc";
  // console.log(sqlQry);

  connections.scm_public.query(sqlQry, (error, selRes) => {
    if (error) {
      res.json({
        "ResponseCode": 400,
        "ResponseMsg": "error"
      });
    } else {
      res.json({
        "ResponseCode": 200,
        "ResponseMsg": selRes
      });
    }
  });
}

exports.download_voucher = (req, res) => {
  let filename = req.params.download
  //console.log(filepath);
  var fileLocation = '/var/www/andaman/voucher/'+filename;
  //var fileLocation = 'D:/git/cogs-api-new-final/voucher/'+filename;

  console.log(fileLocation);

  res.download(fileLocation);
}
exports.download_bill = (req, res) => {
  let filename = req.params.download
  //console.log(filepath);

  var fileLocation = '/var/www/andaman/bill/'+filename;
  //var fileLocation = 'D:/git/cogs-api-new-final/bill/'+filename;

  res.download(fileLocation);
}


//petty cash preveen

exports.strchpc = (req, res) => {

  let status = req.params.status;
  let branch = req.params.branch;
  let username = req.params.name;
  let splitbranches = [];
  console.log(branch + " " + status + username);

  if ((branch == 'All') && (status != 'All')) {
    if ((status == 2) || (status == 4)) {
      try {
        console.log("hit in branch all appr");
        connections.scm_public.query("select branches from users where emp_id=? and role='sch_user' AND is_active=1", [username], (err, resbranch) => {
          if (err) {
            res.json({
              "result": {
                "pcbill": err
              }
            })
          } else {
            resbranch.forEach(branches => {
              splitbranches = branches.branches.split('+')
            })
            //  console.log(splitbranches);
            connections.scm_public.query(files.schpcschfinapp, [splitbranches, status], (err, resdata) => {
              console.log(resdata);
              if (err) console.error(err);
              res.json({
                "result": {
                  "pcbill": resdata
                }
              })
            })
          }

        })
      } catch (e) {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": e
          }
        })
      }
    } else if ((status == 3) || (status == 5)) {
      try {
        console.log("hit in branch all cancel");
        connections.scm_public.query("select branches from users where emp_id=? and role='sch_user' AND is_active=1", [username], (err, resbranch) => {
          if (err) {
            res.json({
              "result": {
                "pcbill": err
              }
            })
          } else {
            resbranch.forEach(branches => {
              splitbranches = branches.branches.split('+')
            })
            //  console.log(splitbranches);
            connections.scm_public.query(files.schpcschfindec, [splitbranches, status], (err, resdata) => {
              console.log(resdata);
              if (err) console.error(err);
              res.json({
                "result": {
                  "pcbill": resdata
                }
              })
            })
          }

        })
      } catch (e) {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": e
          }
        })
      }
    } else {
      try {
        console.log("hit in branch all pending");
        connections.scm_public.query("select branches from users where emp_id=? and role='sch_user' AND is_active=1", [username], (err, resbranch) => {
          if (err) {
            res.json({
              "result": {
                "pcbill": err
              }
            })
          } else {
            resbranch.forEach(branches => {
              splitbranches = branches.branches.split('+')
            })
            //  console.log(splitbranches);
            connections.scm_public.query(files.schpcpend, [splitbranches, status], (err, resdata) => {
              console.log(resdata);
              if (err) console.error(err);
              res.json({
                "result": {
                  "pcbill": resdata
                }
              })
            })
          }

        })
      } catch (e) {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": e
          }
        })
      }
    }
  } else if ((branch == 'All') && (status == 'All')) {

    console.log("hit in branch all status all");
    connections.scm_public.query("select branches from users where emp_id=? and role='sch_user' AND is_active=1", [username], (err, resbranch) => {
      if (err) console.error(err);
      resbranch.forEach(branches => {
        splitbranches = branches.branches.split('+')
      })
      connections.scm_public.query(files.schpcallall, [splitbranches, splitbranches, splitbranches, splitbranches, splitbranches], (err, resdata) => {

        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": resdata
          }
        })
      })

    })
  } else if ((branch != 'All') && (status == 'All')) {
    console.log("hit in status all");

    connections.scm_public.query(files.schpcallall, [branch, branch, branch, branch, branch], (err, resdata) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "pcbill": resdata
        }
      })
    })


  } else {
    console.log("hit in else");
    if ((status == 2) || (status == 4)) {
      try {
        console.log("hit in branch all appr");

        connections.scm_public.query(files.schpcschfinapp, [branch, status], (err, resdata) => {
          console.log(resdata);
          if (err) console.error(err);
          res.json({
            "result": {
              "pcbill": resdata
            }
          })
        })
      } catch (e) {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": e
          }
        })
      }
    } else if ((status == 3) || (status == 5)) {
      try {
        console.log("hit in branch all cancel");

        connections.scm_public.query(files.schpcschfindec, [branch, status], (err, resdata) => {
          console.log(resdata);
          if (err) console.error(err);
          res.json({
            "result": {
              "pcbill": resdata
            }
          })
        })
      } catch (e) {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": e
          }
        })
      }
    } else {
      try {
        console.log("hit in branch all pending");

        connections.scm_public.query(files.schpcpend, [branch, status], (err, resdata) => {
          console.log(resdata);
          if (err) console.error(err);
          res.json({
            "result": {
              "pcbill": resdata
            }
          })
        })

      } catch (e) {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": e
          }
        })
      }
    }
  }
}

exports.strchbranchgroupbills = (req, res) => {

  let date = req.params.date;
  let branch = req.params.branch;
  let status = req.params.statusno;
  console.log(req.params);
  //console.log(fromdate +" "+todate+" "+branch+" "+name);
  try {
    connections.scm_public.query(files.strbranchgroupbillz, [branch, date, date, date, date, status], (err, resgroupdata) => {

      if (err) console.error(err);
      //  console.log(resgroupdata);
      res.json(resgroupdata);
    })
  } catch (e) {
    console.log(e);
  }


}


exports.strchbranchgroupbilldetail = (req, res) => {

  let date = req.params.date;
  let categoryname = req.params.categoryname;
  let branch = req.params.branch;
  let status = req.params.status;

  try {
    connections.scm_public.query(files.strbranchgroupbilldetailz, [date, date, date, date, branch, categoryname, status], (err, resgroupdatadetail) => {
      if (err) console.error(err);
      res.json(resgroupdatadetail);
    })
  } catch (e) {
    console.log(e);
  }
}


exports.strch_billgroupapprove = (req, res) => {
  //  console.log(req.body);
  let strch_id = req.body.strch_id;
  let strch_groupcategory = req.body.strch_groupcategory;
  let strch_branch = req.body.strch_branch;
  let strch_date = req.body.strch_date;

  let datta = [];

  let grpcat = "select * from pettycash_category where category_name='" + strch_groupcategory + "'";

  connections.scm_public.query(grpcat, (err, resgrpcat) => {
    if (err) console.error(err);
    console.log(resgrpcat);
    resgrpcat.forEach(data => {
      datta = data.sno
    })
    console.log(datta);
    let strchapprovebillgroup = "update pettycash set status=2,sch_id='" + strch_id + "',sch_approved_date=now() where branch='" + strch_branch + "' and category_id='" + datta + "' and status in (1)  ";

    //let strchapprovebillgroup="select * from pettycash where branch='"+strch_branch+"' and category_id='"+datta+"' and date(created_date)='"+strch_date+"'";
    console.log(strchapprovebillgroup);
    connections.scm_public.query(strchapprovebillgroup, (err, resultgrpcat) => {
      console.log(resultgrpcat);
      if (err) {
        res.json({
          dataupdated: false
        })
      } else {
        res.json({
          dataupdated: true
        })
      }



    })
  })


}

exports.strch_billgroupdecline = (req, res) => {
  console.log(req.body);
  console.log("hit");
  let strch_id = req.body.strch_id;
  let strch_groupcategory = req.body.strch_groupcategory;
  let strch_branch = req.body.strch_branch;
  let strch_date = req.body.strch_date;
  let amount = req.body.amount;
  let comments = req.body.comments;
  let datta = [];
  let strch_billno = req.body.strch_billno;
  let strch_vouchername = req.body.strch_vouchername;
  let strch_voucherno = req.body.strch_voucherno;
  let bill_attach = req.body.bill_attach;
  let voucher_attach = req.body.voucher_attach;
  let flag = 0;

  connections.scm_root.getConnection((err, conn) => {
    conn.beginTransaction(function(err) {
      if (err) {
        res.json({
          dataupdated: false
        })
        //      throw err;
      }

      let grpcat = "select * from pettycash_category where category_name='" + strch_groupcategory + "'";
      console.log(grpcat);

      connections.scm_root.query(grpcat, (err, resgrpcat) => {
        console.log(resgrpcat);
        if (err) {
          conn.rollback(function() {
            res.json({
              dataupdated: false
            })
            //      throw err;
          });
        } else {
          resgrpcat.forEach(data => {
            datta = data.sno
          });
          let updatequery = "update pettycash set status=3,cancel_date=now() where branch='" + strch_branch + "' and category_id=" + datta + " and created_date='" + strch_date + "' and bill_no='" + strch_billno + "' and vendorname='" + strch_vouchername + "' and voucher_no='" + strch_voucherno + "'";
          connections.scm_root.query(updatequery, (err, resupdate) => {
            if (err) {
              conn.rollback(function() {
                res.json({
                  dataupdated: false
                })
                //  throw err;
              });
            } else {
              console.log(resupdate);
              let insertquery = "INSERT INTO pettycash (branch,voucher_no,category_id,vendorname,bill_no,remarks,Credit,voucher_attach,bill_attch,Cancel_by,Cancel_date,status) values (?,?,?,?,?,?,?,?,?,?,now(),3)"
              connections.scm_root.query(insertquery, [strch_branch, strch_voucherno, datta, strch_vouchername, strch_billno, comments + '-- by sch', amount, voucher_attach, bill_attach, strch_id], (err, resinsert) => {
                if (err) {
                  conn.rollback(function() {

                    res.json({
                      dataupdated: false
                    })
                    //    throw err;
                  });
                } else {
                  console.log(resinsert);
                  let updateamount = "update pettycash_allocate_amount set cancel_amount='" + amount + "',balance=(SELECT * FROM (SELECT SUM(balance)+" + amount + " FROM pettycash_allocate_amount AS b WHERE branch='" + strch_branch + "' ) AS bb),modified_date=now(),debit=(SELECT * FROM (SELECT SUM(debit)-" + amount + " FROM pettycash_allocate_amount AS c WHERE branch='" + strch_branch + "' ) AS cc) where branch='" + strch_branch + "'";
                  connections.scm_root.query(updateamount, (err, resupdateamt) => {
                    if (err) {
                      conn.rollback(function() {
                        res.json({
                          dataupdated: false
                        })
                        //    throw err;
                      });
                    } else {
                      console.log(resupdateamt);
                      conn.commit(function(err) {
                        if (err) {
                          conn.rollback(function() {
                            res.json({
                              dataupdated: false
                            })
                            throw err;
                          });

                        } else {
                          conn.release();
                          res.json({
                            dataupdated: true
                          })
                        }

                      });
                    }





                  })
                }

              })
            }



          })


        }


      })


    })

  })

}

exports.strch_billgroupapproveall = (req, res) => {
  console.log(req.body);
  let strch_id = req.body.strch_id;
  let strch_groupcategory = req.body.strch_groupcategory;
  let strch_branch = req.body.strch_branch;
  let strch_date = req.body.strch_date;


  let update = "UPDATE pettycash SET STATUS=2,sch_id='" + strch_id + "',sch_approved_date=NOW() WHERE branch='" + strch_branch + "' AND STATUS in (1)";

  console.log(update);

  connections.scm_root.query(update, (err, resupdate) => {
    if (err) {
      res.json({
        dataupdated: false
      })
    } else {
      res.json({
        dataupdated: true
      })
    }
  })

}

// [praveen]

exports.finptycsh = (req, res) => {

  //  console.log(req.params);
  //console.log("hit in finptycsh");

  let branch = req.params.branch;
  let status = req.params.status;

  if ((branch == 'All') && (status != 'All')) {
    console.log("hit in branch all.. ");
    if ((status == 2) || (status == 1)) {
      console.log("pending");
      connections.scm_public.query(files.finpcpend, [status], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": resdata
          }
        })
      })
    } else if ((status == 3) || (status == 5)) {
      console.log("decline");
      connections.scm_public.query(files.finpcschfindec, [status], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": resdata
          }
        })
      })
    } else if ((status == 4)) {
      console.log("approved");
      connections.scm_public.query(files.finpcschfinapp, [status], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": resdata
          }
        })
      })
    }


  } else if ((branch != 'All') && (status == 'All')) {
    console.log("hit in status alll");
    connections.scm_public.query(files.finptycshallall, [branch, branch, branch, branch, branch,branch], (err, resdata) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "pcbill": resdata
        }
      })
    })
  } else if ((branch == 'All') && (status == 'All')) {
    console.log("hit in all all");
    connections.scm_public.query(files.finpcallall, (err, resdata) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "pcbill": resdata
        }
      })
    })
  } else {
    console.log("hit in branch and status.");
    if ((status == 4)) {
      connections.scm_public.query(files.finpcappstbr, [status, branch], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": resdata
          }
        })
      })
    } else if ((status == 1) || (status == 2)) {
      connections.scm_public.query(files.finpcpendbrst, [status, branch], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": resdata
          }
        })
      })
    } else if ((status == 3) || (status == 5)) {
      connections.scm_public.query(files.finpcdeclibrst, [status, branch], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "pcbill": resdata
          }
        })
      })
    }
  }

}


exports.finpcbranchgroupbills = (req, res) => {
//  console.log(req.params);
  console.log("hit in group");

  let branch = req.params.branch;
  let status = req.params.status;
  console.log("-");
  connections.scm_public.query(files.finpccshbranchgroupz, [branch, status], (err, resgroupdatadetail) => {

    if (err) console.error(err);
    res.json(resgroupdatadetail);
  })

}

exports.finpcbranchgroupbilldetail = (req, res) => {
//  console.log(req.params);
console.log("hit in detail");
  let status = req.params.status
  let branch = req.params.branch;
  //let status=req.params.status;
  let categoryname = req.params.categoryname;



  connections.scm_public.query(files.finptycshbranchgroupbilldetailz, [branch, categoryname, status], (err, resgroupdatadetail) => {
  //  console.log(resgroupdatadetail);
    if (err) console.error(err);
    res.json(resgroupdatadetail);
  })

}

exports.fin_billgroupdecline = (req, res) => {
  console.log(req.body);
  let strch_id = req.body.strch_id;
  let strch_groupcategory = req.body.strch_groupcategory;
  let strch_branch = req.body.strch_branch;
  let strch_date = req.body.strch_date;
  let amount = req.body.amount;
  let comments = req.body.comments;
  let datta = [];
  let strch_billno = req.body.strch_billno;
  let strch_vouchername = req.body.strch_vouchername;
  let strch_voucherno = req.body.strch_voucherno;
  let bill_attach = req.body.bill_attach;
  let voucher_attach = req.body.voucher_attach;


  connections.scm_root.getConnection((err, conn) => {
    conn.beginTransaction(function(err) {
      if (err) {
        res.json({
          dataupdated: false
        })
      } else {
        let grpcat = "select * from pettycash_category where category_name='" + strch_groupcategory + "'";
        console.log(grpcat);
        connections.scm_root.query(grpcat, (err, resgrpcat) => {
          console.log(resgrpcat);
          if (err) {
            conn.rollback(function() {
              res.json({
                dataupdated: false
              })

            });
          } else {
            resgrpcat.forEach(data => {
              datta = data.sno
            });
            let updatequery = "update pettycash set status=5,Cancel_date=now() where branch='" + strch_branch + "' and category_id=" + datta + " and created_date='" + strch_date + "' and bill_no='" + strch_billno + "' and vendorname='" + strch_vouchername + "' and voucher_no='" + strch_voucherno + "'";
            console.log(updatequery);
            connections.scm_root.query(updatequery, (err, resupdate) => {
              if (err) {
                conn.rollback(function() {
                  res.json({
                    dataupdated: false
                  })
                  //      throw err;
                });
              } else {
                console.log(resupdate);
                let insertquery = "INSERT INTO pettycash (branch,voucher_no,category_id,vendorname,bill_no,remarks,Credit,voucher_attach,bill_attch,Cancel_by,Cancel_date,status) values (?,?,?,?,?,?,?,?,?,?,now(),5)";
                connections.scm_root.query(insertquery, [strch_branch, strch_voucherno, datta, strch_vouchername, strch_billno, comments + "-- by finance", amount, voucher_attach, bill_attach, strch_id], (err, resinsert) => {
                  if (err) {
                    conn.rollback(function() {

                      res.json({
                        dataupdated: false
                      })
                      //      throw err;
                    });
                  } else {
                    console.log(resinsert);
                    let updateamount = "update pettycash_allocate_amount set cancel_amount=(SELECT * FROM (SELECT SUM(cancel_amount)+" + amount + " FROM pettycash_allocate_amount AS a WHERE branch='" + strch_branch + "' ) AS aa),balance=(SELECT * FROM (SELECT SUM(balance)+" + amount + " FROM pettycash_allocate_amount AS b WHERE branch='" + strch_branch + "' ) AS bb),modified_date=now(),debit=(SELECT * FROM (SELECT SUM(debit)-" + amount + " FROM pettycash_allocate_amount AS c WHERE branch='" + strch_branch + "' ) AS cc) where branch='" + strch_branch + "'";
                    console.log(updateamount);
                    connections.scm_root.query(updateamount, (err, resupdateamt) => {
                      if (err) {
                        conn.rollback(function() {
                          res.json({
                            dataupdated: false
                          })
                          //    throw err;
                        });
                      } else {
                        console.log(resupdateamt);
                        conn.commit(function(err) {
                          if (err) {
                            conn.rollback(function() {
                              res.json({
                                dataupdated: false
                              })
                              //      throw err;
                            });

                          } else {
                            conn.release();
                            res.json({
                              dataupdated: true
                            })
                          }


                        })

                      }


                    })

                  }



                })

              }





            })



          }





        })


      }






    })
  })
}

exports.finptycsh_billgroupapproveall = async (req, res) => {

  let date = req.body.strch_date;
  let status = req.body.status;
  let branch = req.body.strch_branch;
  let username = req.body.strch_id;
  let refillamount = req.body.finrefilledamount;
  let comments = req.body.comments;
  let paymentreceipt = req.body.fileBill;

  let paymentrec = await movePaymentreceipt(req);
  let paymentrectname = paymentrec.result


  connections.scm_public.getConnection((err, conn) => {
    conn.beginTransaction(function(err) {
      if (err) {
        res.json({
          dataupdated: false
        })
        //      throw err;
      } else {
        let updatequery = "update pettycash SET STATUS=4,fin_id='" + username + "',fin_approved_date=now(),remarks='" + comments + "' WHERE STATUS=2 AND branch='" + branch + "'";
        console.log(updatequery);
        connections.scm_root.query(updatequery, (err, resupdate) => {
          if (err) {
            conn.rollback(function() {
              res.json({
                dataupdated: false
              })
              //      throw err;
            });
          } else {
            let insertvalue = "INSERT INTO pettycash (branch,Credit,STATUS,Refilled_date,fin_id,Payment_receipt) VALUEs ('" + branch + "'," + refillamount + ",6,now(),'" + username + "','" + paymentrectname + "')";
            console.log(insertvalue);
            connections.scm_root.query(insertvalue, (err, resinsert) => {
              if (err) {
                conn.rollback(function() {
                  res.json({
                    dataupdated: false
                  })
                  //      throw err;
                });
              } else {
                console.log(resinsert);
                let updateamount = "update pettycash_allocate_amount set balance=(SELECT * FROM (SELECT SUM(balance)+" + refillamount + " FROM pettycash_allocate_amount AS b WHERE branch='" + branch + "' ) AS bb),modified_date=now(),debit=0,cancel_amount=0,notify_amount=(SELECT * FROM (SELECT (SUM(balance)+" + refillamount + ")-sum(3000) FROM pettycash_allocate_amount AS c WHERE branch='" + branch + "' ) AS cc) where branch='" + branch + "'";
                console.log(updateamount);
                connections.scm_root.query(updateamount, (err, resupdate1) => {
                  if (err) {
                    conn.rollback(function() {
                      res.json({
                        dataupdated: false
                      })
                      //      throw err;
                    });
                  } else {
                    console.log(resupdate1);
                    conn.commit(function(err) {
                      if (err) {
                        conn.rollback(function() {
                          res.json({
                            dataupdated: false
                          })
                          //      throw err;
                        });

                      } else {
                        conn.release();
                        console.log("updated");
                        res.json({
                          dataupdated: true
                        })

                      }
                    });

                  }


                })

              }




            })

          }



        })

      }

    })
  })


}


let movePaymentreceipt = async (req) => {
  upload = req.files

  if (upload != null && upload.payment_receipt != null) {
    return new Promise(resolve => {
      if (upload.payment_receipt.mimetype == "image/jpeg" ||
        upload.payment_receipt.mimetype == "image/png" ||
        upload.payment_receipt.mimetype == "image/gif" ||
        upload.payment_receipt.mimetype == "application/pdf") {
        time = new Date().getTime();
        oldfilename = upload.payment_receipt.name;
        amount = req.body.finrefilledamount;
        branch = req.body.strch_branch;
        newfilename = branch + "_" + amount + '_payment_' + oldfilename;

        paymentreceiptpath = "/var/www/andaman/Payment_receipt/" + newfilename;
        console.log(paymentreceiptpath);

        upload.payment_receipt.mv(paymentreceiptpath, function(err) {
          if (err) {
            resolve({
              "result": null
            })
          } else {
            resolve({
              "result": newfilename
            })
          }

        })

      } else {
        return {
          "result": null
        }

      }

    })
  }
}

exports.decline_amount = (req, res) => {
  //  console.log(req.params);
  let branch = req.params.branch;
  let fromdate = req.params.fromdate;
  let todate = req.params.todate;

  let declineamount="SELECT branch,SUM(credit) as 'cancelledamount' FROM pettycash WHERE STATUS=5 AND branch='"+branch+"' and  DATE(Created_date) BETWEEN '"+fromdate+"' and '"+todate+"'";
  console.log(declineamount);
connections.scm_public.query(declineamount,(err,resdata)=>{
  console.log(resdata);
  if(err) console.error(err);
res.json( resdata);

})

}

exports.category_update = (req, res) => {
//  console.log(req.body);

  let catid = req.body.categoryid;
  let userid = req.body.userid
  let ptyid = req.body.itemid;
  let branch = req.body.branch
  connections.scm_root.query("update pettycash set category_id=? where sno=? and branch=? ", [catid, ptyid, branch], (err, resdata) => {
    console.log(resdata);

    if (err) {
      res.json({
        dataupdated: false
      })
    } else {
      res.json({
        dataupdated: true
      })
    }

  })

}


exports.main_route_inactive_user = (day,callback) => {
  connections.scm_public.query("select qry from inactive_query where sno=1",(error, inactiveres) => {
      if (error)  {
		  callback("inactive_query  error",null);
	  }else{
	  connections.ideamed.query(inactiveres[0].qry,(error, inactUsers) => {
		if(error){
			callback("ideamed inactive query error",null);
		}else{

			   if(inactUsers.length>0){
					mods.nativeFunctions.inactiveEmail(inactUsers).then(final => callback(null,final));
			   }else{
				   callback(null,"No inactive users");
			   }
		}

		}
		);
		}
	}
	);
  // }
};

exports.inactiveEmailList = (emailtemp,callback) =>{
	connections.scm_public.query("select fromid,toid,bccid,ccid,passcode from email where scmtype='inactiveemail'",(error, inactivemailres) => {
      if (error) {
		  callback("select email query",null);
	  }else{
		  callback(null,inactivemailres);
	  }
	});
}



exports.avaOverseasEmailList = (emailtemp,callback) =>{
	connections.scm_public.query("select fromid,toid,bccid,ccid,passcode from email where scmtype='avaoverseasemail'",(error, domesticemailres) => {
      if (error) {
		  callback("select email query",null);
	  }else{
		  callback(null,domesticemailres);
	  }
	});
}
exports.main_route_newopd_mail = (yesterday,callback) => {
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

	let ftddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-'+("0" + (temp.getDate())).slice(-2);
	let mtddatelastyear = (temp.getFullYear()-1)+'-'+ ("0" + (temp.getMonth()+1)).slice(-2)+'-01';


  connections.scm_public.query(files.new_opd_super,[mtddate, ftddate],(error, resnewopd) => {
      if (error) {
		  callback("select new opd query error",null);
	 }else{
		  connections.scm_public.query(files.new_opd_super,[mtddatelastyear, ftddatelastyear],(error, reslastyearopd) => {
			if (error) {
				callback("select new opd last yar query error",null);
			}else{
			  connections.scm_public.query(
				"select * from branches",
				(err, branchres) => {
				  if (err){
					callback("select branch query error",null);
				  }else{
						  mods.nativeFunctions
							.newopdNative(
							  resnewopd,
							  branchres,
							  ftddate,
							  reslastyearopd,

							)
							.then(final => callback(null,final));
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



exports.opdEmailList = (emailtemp,callback) =>{
	connections.scm_public.query("select fromid,toid,bccid,ccid,passcode from email where scmtype='newopd'",(error, domesticemailres) => {
      if (error) {
		  callback("select email query",null);
	  }else{
		  callback(null,domesticemailres);
	  }
	});
}


exports.cogsdetails = (req, res) => {
  console.log(req.params);
  let fromdate = req.params.date;
  let entity = req.params.entity;
  let branch = req.params.branch;
  let depart = req.params.department;
  let start = fromdate + '-01';
  let end = fromdate + '-31';

  if(entity=='OHC')
  {
    if((branch=='All')&&(depart=="All")){
      let transquery="select * from cogs_details WHERE region='ORB' and trans_date between '" + start + "' and '" + end + "'";
      connections.scm_public.query(transquery, (err, rescogs) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "cogs": rescogs
          }
        })
      })
    }
    else if((branch=='All')&&(depart !="All")){
        let transquery="select * from cogs_details WHERE region='ORB' and trans_date between '" + start + "' and '" + end + "' and top='" + depart + "'";
        connections.scm_public.query(transquery, (err, rescogs) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "cogs": rescogs
            }
          })
        })

    }
    else if((branch !='All')&&(depart =="All")){
      let transquery="select * from cogs_details WHERE region='ORB' and trans_date between '" + start + "' and '" + end + "' and  branch='" + branch + "'";
      connections.scm_public.query(transquery, (err, rescogs) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "cogs": rescogs
          }
        })
      })
    }
    else {
      let transquery="select * from cogs_details WHERE region='ORB' and trans_date between '" + start + "' and '" + end + "'  and branch='" + branch + "' and top='" + depart + "'";
      connections.scm_public.query(transquery, (err, rescogs) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "cogs": rescogs
          }
        })
      })
    }

  }
    else{
      if ((entity == 'All') && (branch == 'All') && (depart == 'All')) {
        //  console.log("branch all entity all");
        let transquery = "select * from cogs_details where trans_date between '" + start + "' and '" + end + "'";
        //console.log(transquery);
        connections.scm_public.query(transquery, (err, rescogs) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "cogs": rescogs
            }
          })
        })

      } else if ((entity == 'All') && (branch == 'All') && (depart != 'All')) {
        //  console.log("branch all entity all");
        let transquery = "select * from cogs_details where trans_date between '" + start + "' and '" + end + "' and top='" + depart + "'";
        console.log(transquery);
        connections.scm_public.query(transquery, (err, rescogs) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "cogs": rescogs
            }
          })
        })
      } else if ((entity != 'All') && (branch == 'All') && (depart == 'All')) {
        //  console.log("branch all entity not all");
        let transquery = "select * from cogs_details where trans_date between '" + start + "' and '" + end + "'  and entity='" + entity + "' ";
        console.log(transquery);
        connections.scm_public.query(transquery, (err, rescogs) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "cogs": rescogs
            }
          })
        })
      } else if ((entity != 'All') && (branch == 'All') && (depart != 'All')) {
        //  console.log("branch all entity not all");
        let transquery = "select * from cogs_details where trans_date between '" + start + "' and '" + end + "'  and entity='" + entity + "' and top='" + depart + "'";
        console.log(transquery);
        connections.scm_public.query(transquery, (err, rescogs) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "cogs": rescogs
            }
          })
        })
      } else if ((entity != 'All') && (branch != 'All') && (depart == 'All')) {
        //  console.log("else");
        let transquery = "select * from cogs_details where trans_date between '" + start + "' and '" + end + "' and entity='" + entity + "' and branch='" + branch + "'";
        console.log(transquery);
        connections.scm_public.query(transquery, (err, rescogs) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "cogs": rescogs
            }
          })
        })
      } else {
        let transquery = "select * from cogs_details where trans_date between '" + start + "' and '" + end + "' and entity='" + entity + "' and branch='" + branch + "' and top='" + depart + "'";
        console.log(transquery);
        connections.scm_public.query(transquery, (err, rescogs) => {
          if (err) console.error(err);
          res.json({
            "result": {
              "cogs": rescogs
            }
          })
        })

      }


  }



}

exports.tpabills = (req, res) => {
  let fromdate = req.params.date;
  let branch = req.params.branch;
  let start = fromdate + '-01';
  let end = fromdate + '-31';

  console.log("hit in tpa ch");
  connections.scm_public.query(files.tpabillsch, [branch, start, end], (err, resdata) => {
    if (err) console.error(err);
    res.json({
      "result": {
        "tpabills": resdata
      }
    })


  })


}

exports.tpabill_submit = (req, res) => {
  let tpa_billid = req.body.tpabillid;
  let tpa_id = req.body.tpaid;
  let id = req.body.submitted_id;

  console.log(tpa_billid + "  " + tpa_id + " " + id);

  // connections.scm_root.query('UPDATE revenue_detail_tpa SET send_date=NOW(),sent_id=? WHERE bill_id=? AND id=?', [id, tpa_billid, tpa_id], (err, resdata) =>{
  // 	if(err){
  // 		console.error(err);
  // 		res.json({
  // 			dataupdated: false
  // 		})
  // 	}
  // 	else {
  // 		console.log("updated");
  // 		res.json({
  // 			dataupdated: false
  // 		})
  // 	}
  // })

  connections.scm_root.getConnection((err, conn) => {
    conn.beginTransaction(function(err) {
      if (err) {
        res.json({
          dataupdated: false
        })

      } else {
        connections.scm_root.query('UPDATE revenue_detail_tpa SET send_date=NOW(),sent_id=? WHERE bill_id=? AND id=?', [id, tpa_billid, tpa_id], (err, resdata) => {
          if (err) {
            conn.rollback(function() {
              res.json({
                dataupdated: false
              })

            });
          } else {
            console.log(resdata);
            conn.commit(function(err) {
              if (err) {
                conn.rollback(function() {
                  res.json({
                    dataupdated: false
                  })
                  throw err;
                });

              } else {

                console.log('Transaction Complete.');
                conn.release();
                  console.log("updated");
                res.json({
                  dataupdated: true
                })

              }

            })
          }
        })

      }
    })
  })

}

exports.tpabillsfin = (req, res) => {
  let entity = req.params.entity;
  let branch = req.params.branch;
  let fromdate = req.params.date;
  let status = req.params.status;
  let username = req.params.name;
  let start = fromdate + '-01';
  let end = fromdate + '-31';
  let branchsplitresult = [],
    brsplt = [],
    resultbranch = {},
    branchOBJ = [];
  console.log(username);
  if (entity == 'Noentity') {
    if (branch == 'All') {
      console.log("Noentity" +"All");
      connections.scm_public.query("select branches AS TEXT,branches AS shortCode from users where emp_id=? and role in ('tpa_user')",
        [username], (err, resbr) => {
          if (err) console.error(err);
          resbr.forEach(element => {
            branchsplitresult = element.TEXT.split('+');
          });
          connections.scm_public.query(files.tpabillfin_allNE, [start, end, branchsplitresult], (err, resdata) => {
            if (err) console.error(err);
            res.json({
              "result": {
                "tpabillfin": resdata
              }
            });
          });

        });
    } else {
      console.log("hit in else ne");
      connections.scm_public.query(files.tpabillfinenbrNE, [start, end, branch], (err, resdata) => {
        //  console.log(resdata);
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        });
      });
    }

  } else {

    if ((entity == 'All') && (branch == 'All')) {
      console.log("hit in all all all all");
      connections.scm_public.query(files.tpabillfin_all, [start, end], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })


      })
    }
    // else if ((entity == 'All') && (branch != 'All')) {
    //   connections.scm_public.query(files.tpabillfinallbr, [start, end, branch], (err, resdata) => {
    //     if (err) console.error(err);
    //     res.json({
    //       "result": {
    //         "tpabillfin": resdata
    //       }
    //     })
    //
    //
    //   })
    //
    //
    // }
    else if ((entity != 'All') && (branch == 'All')) {
      console.log(" !entity branch");
      connections.scm_public.query(files.tpabillfinenall, [start, end, entity], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })

      })
    } else {
      console.log("!entity !branch");
      connections.scm_public.query(files.tpabillfinenbr, [start, end, entity, branch], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })


    })
  }

}

}

exports.tpabillsfinpen = (req, res) => {

  let entity = req.params.entity;
  let branch = req.params.branch;
  let fromdate = req.params.date;
  let status = req.params.status
  let start = fromdate + '-01';
  let end = fromdate + '-31';
  let branchsplitresult = [],
    brsplt = [],
    resultbranch = {},
    branchOBJ = [];
  let username = req.params.name;

  if (entity == 'Noentity') {
    if (branch == 'All') {
      console.log("ne all");
      connections.scm_public.query("select branches AS TEXT,branches AS shortCode from users where emp_id=? and role in ('tpa_user')",
        [username], (err, resbr) => {
          if (err) console.error(err);
          resbr.forEach(element => {
            branchsplitresult = element.TEXT.split('+');
          });
          console.log(branchsplitresult);
          connections.scm_public.query(files.tpabillfin_allpenNE, [start, end, branchsplitresult], (err, resdata) => {
            if (err) console.error(err);
            res.json({
              "result": {
                "tpabillfin": resdata
              }
            })
          })
        });
    } else {
      connections.scm_public.query(files.tpabillfin_enbrpenNE, [start, end, branch], (err, resdata) => {
        if (err) console.error(err);

        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })
      })

    }
  } else {
    if ((entity == 'All') && (branch == 'All') && (status == 0)) {
      console.log("hit in pending ");
      connections.scm_public.query(files.tpabillfin_allpen, [start, end,start, end], (err, resdata) => {
        if (err) console.error(err);
        //  console.log(resdata);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })


      })
    }
    //  else if ((entity == 'All') && (branch != 'All') && (status == 0)) {
    //   connections.scm_public.query(files.tpabillfin_allbrpen, [start, end, start, end, branch], (err, resdata) => {
    //     if (err) console.error(err);
    //     res.json({
    //       "result": {
    //         "tpabillfin": resdata
    //       }
    //     })
    //
    //
    //   })
    //
    //
    // }

    else if ((entity != 'All') && (branch == 'All') && (status == 0)) {
      console.log("hit in pendinf branch all");
      connections.scm_public.query(files.tpabillfin_enallpen, [start, end,start, end, entity], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })

      })
    }
     else {
       console.log("!entiy !branch pending");
      connections.scm_public.query(files.tpabillfin_enbrpen, [start, end,start, end, entity, branch], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })


      })
    }

  }


}

exports.tpabillsfinack = (req, res) => {
  let entity = req.params.entity;
  let branch = req.params.branch;
  let fromdate = req.params.date;
  let status = req.params.status
  let start = fromdate + '-01';
  let end = fromdate + '-31';
  console.log(start,end);
  let branchsplitresult = [],
    brsplt = [],
    resultbranch = {},
    branchOBJ = [];

  let username = req.params.name;


  if (entity == 'Noentity') {
    if (branch == 'All') {
      connections.scm_public.query("select branches AS TEXT,branches AS shortCode from users where emp_id=? and role in ('tpa_user')",
        [username], (err, resbr) => {
          if (err) console.error(err);
          resbr.forEach(element => {
            branchsplitresult = element.TEXT.split('+');
          });
          console.log(branchsplitresult);

          connections.scm_public.query(files.tpabillfin_allackNE, [start, end, branchsplitresult], (err, resdata) => {
            if (err) console.error(err);

            res.json({
              "result": {
                "tpabillfin": resdata
              }
            })
          })
        });
    } else {
      connections.scm_public.query(files.tpabillfin_enbrackNE, [start, end, branch], (err, resdata) => {
        if (err) console.error(err);

        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })
      })
    }
  } else {
    if ((entity == 'All') && (branch == 'All') && (status == 1)) {
      console.log("hit in pending in ack");
      connections.scm_public.query(files.tpabillfin_allack, [start, end,start, end], (err, resdata) => {
        if (err) console.error(err);
        //  console.log(resdata);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })


      })
    }
    //  else if ((entity == 'All') && (branch != 'All') && (status == 1)) {
    //   connections.scm_public.query(files.tpabillfin_allbrpen, [start, end, start, end, branch], (err, resdata) => {
    //     if (err) console.error(err);
    //     res.json({
    //       "result": {
    //         "tpabillfin": resdata
    //       }
    //     })
    //
    //
    //   })
    //
    //
    // }
     else if ((entity != 'All') && (branch == 'All') && (status == 1)) {
       console.log("!entity branch ack");
      connections.scm_public.query(files.tpabillfin_enallack, [start, end,start, end, entity], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })

      })
    } else {
      console.log("!entity !branch ack ");
      connections.scm_public.query(files.tpabillfin_enbrack, [start, end,start, end, entity, branch], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })


      })
    }
  }


}

exports.tpabillsfinsub = (req, res) => {
  let entity = req.params.entity;
  let branch = req.params.branch;
  let fromdate = req.params.date;
  let status = req.params.status
  let start = fromdate + '-01';
  let end = fromdate + '-31';
  let branchsplitresult = [],
    brsplt = [],
    resultbranch = {},
    branchOBJ = [];
  let username = req.params.name;

  if (entity == 'Noentity') {
    if (branch == 'All') {

      connections.scm_public.query("select branches AS TEXT,branches AS shortCode from users where emp_id=? and role in ('tpa_user')",
        [username], (err, resbr) => {
          if (err) console.error(err);
          resbr.forEach(element => {
            branchsplitresult = element.TEXT.split('+');
          });
          console.log(branchsplitresult);

          connections.scm_public.query(files.tpabillfin_allsubNE, [start, end, branchsplitresult], (err, resdata) => {
            if (err) console.error(err);
            res.json({
              "result": {
                "tpabillfin": resdata
              }
            })

          })
        }
      )
    } else {
      connections.scm_public.query(files.tpabillfin_enbrsubNE, [start, end, branch], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })
      })
    }
  } else {

    if ((entity == 'All') && (branch == 'All') && (status == 2)) {
      console.log("hit in pending sub");
      connections.scm_public.query(files.tpabillfin_allsub, [start, end,start, end], (err, resdata) => {
        if (err) console.error(err);
        //  console.log(resdata);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })


      })
    }
     else if ((entity != 'All') && (branch == 'All') && (status == 2)) {
       console.log("!entity branch sub");

      connections.scm_public.query(files.tpabillfin_enallsub, [start, end,start, end, entity], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })

      })
    }
     else {
      connections.scm_public.query(files.tpabillfin_enbrsub, [start, end,start, end, entity, branch], (err, resdata) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "tpabillfin": resdata
          }
        })


      })
    }
  }


}

exports.tpabill_ack = (req, res) => {
  let tpa_billid = req.body.tpabillid;
  let tpa_id = req.body.tpaid;
  let id = req.body.submitted_id;

  console.log("hit in Acknowledge : " + "tpa_billid : " + tpa_billid + " tpa_id : " + tpa_id + " id : " + id);

  // connections.scm_root.query('UPDATE revenue_detail_tpa SET acknowledge_date=NOW(),acknowledge_id=? WHERE bill_id=? AND id=?', [id, tpa_billid, tpa_id], (err, resdata) => {
  // 	if(err){
  // 		console.error(err);
  // 		res.json({
  // 			dataupdated: false
  // 		})
  // 	}
  // 	else {
  // 		console.log("updated");
  // 		res.json({
  // 			dataupdated: true
  // 		})
  // 	}
  // })
  //

  connections.scm_root.getConnection((err, conn) => {


    conn.beginTransaction(function(err) {
      if (err) {
        res.json({
          dataupdated: false
        })

      } else {


        connections.scm_root.query('UPDATE revenue_detail_tpa SET acknowledge_date=NOW(),acknowledge_id=? WHERE bill_id=? AND id=?', [id, tpa_billid, tpa_id], (err, resdata) => {
          if (err) {
            conn.rollback(function() {
              res.json({
                dataupdated: false
              })

            });
          } else {
            console.log(resdata);
            conn.commit(function(err) {
              if (err) {
                return conn.rollback(function() {
                  res.json({
                    dataupdated: false
                  })
                  throw err;
                });

              } else {

                console.log('Transaction Complete.');
              conn.release();
                  console.log("updated");
                res.json({
                  dataupdated: true
                })

              }

            })
          }
        })

      }
    })
  })


}


exports.tpabill_sub = (req, res) => {
  let tpa_billid = req.body.tpabillid;
  let tpa_id = req.body.tpaid;
  let id = req.body.submitted_id;
  let date = req.body.submitted_date;
  console.log("hit in Submitted  : " + "tpa_billid : " + tpa_billid + " tpa_id : " + tpa_id + " id : " + id + " date : " + date);

  connections.scm_root.getConnection((err, conn) => {
    console.log("hit in getconn");

    conn.beginTransaction(function(err) {
      if (err) {
        res.json({
          dataupdated: false
        })

      } else {
        console.log("begin transaction");
        connections.scm_root.query('UPDATE revenue_detail_tpa SET submitted_date=?,submitted_id=? WHERE bill_id=? AND id=?', [date, id, tpa_billid, tpa_id], (err, resdata) => {
          console.log("hit in sub ");
          if (err) {
            console.log("error");
            conn.rollback(function() {
              res.json({
                dataupdated: false
              })

            });
          } else {
            console.log(resdata);
            conn.commit(function(err) {
              if (err) {
                conn.rollback(function() {
                  res.json({
                    dataupdated: false
                  })
                  throw err;
                });

              } else {


                console.log('Transaction Complete.');
                conn.release();
                console.log("updated");
                res.json({
                  dataupdated: true
                })


              }

            })
          }
        })

      }
    })
  })


}




exports.materialcogs_email = (yesterday,callback) => {

//  console.log('main_route');
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
  let ftddate = yesterday;
  let temp = new Date(ftddate);
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";
  connections.scm_public.query(files.cogsSuper, [mtddate, ftddate],(error, cogsresults) =>  {
    if (error){
		callback("select cogs query error",null);
	}else{
		connections.scm_public.query(files.revenueSuper,[mtddate, ftddate],(error, revresults) => {
			if (error) {
				callback("select revenue_report query error",null);
			}else{
				connections.scm_public.query("select * from branches",(err, branchres) => {
					if (err) {
						callback("select branches query error",null);
					}else{
						connections.scm_public.query(files.currency_det_last_mth,  (currency_last_err, currency_last_res) => {
						if (currency_last_err) {
							callback("select currenct latest query error",null);
						}else{
							connections.scm_public.query(files.currency_details, [mtddate, ftddate], (currencyerr, currencyres) => {
							 if (currencyerr){
								callback("select currenct query query error",null);
							 }else{

									mods.functions
									  .materialcogs(
										cogsresults,
										revresults,
										branchres,
										ftddate,
										currencyres,
										currency_last_res
									  )
									  .then(final => callback(null,final));
							 }
							});

						}
						});
					}
				  });
			}
		  });
	}
  });
  // }

};

exports.materialCogsOverseasEmailList = (emailtemp,callback) =>{
	connections.scm_public.query("select fromid,toid,bccid,ccid,passcode from email where scmtype='scm_materialcost_overseas'",(error, domesticemailres) => {
      if (error) {
		  callback("select email query",null);
	  }else{
		  callback(null,domesticemailres);
	  }
	});
}


exports.finbranchregions = (req, res) => {
  let username = req.params.user;

  connections.scm_public.query("select branches AS TEXT,branches AS shortCode from users where emp_id=? and role in ('tpa_user')",
    [username],
    (err, ress) => {
      if (err) console.error(err);
      console.log(ress);
      res.json(ress)
    })

}

exports.fintpabranchs = (req, res) => {
  let username = req.params.user;
  let branchsplitresult = [],
    brsplt = [],
    resultbranch = {},
    branchOBJ = [];


  connections.scm_public.query("select branches AS TEXT,branches AS shortCode from users where emp_id=? and role in ('tpa_user')",
    [username], (err, resdata) => {
      if (err) console.error(err);
      //  console.log(resdata);
      resdata.forEach(element => {
        branchsplitresult = element.TEXT.split('+');
      });
      branchsplitresult.forEach(resele => {
        branchOBJ.push({
          TEXT: resele,
          shortCode: resele
        });
      });
      res.json(branchOBJ);
    });

}


exports.fixdates = (req, res) => {
  let no = req.params.no;
  //
  // let d = new Date();
  // let dt = d.setDate(d.getDate() - no);
  // let dat = d.toLocaleDateString();
  //
  // let new_dat = new Date(dat);
  //
  // let dd = new_dat.getDate();
  // let mm = new_dat.getMonth() + 1;
  // let yyyy = new_dat.getFullYear()
  // if (dd < 10) {
  //   dd = '0' + dd;
  // } else {
  //   dd
  // }
  // if (mm < 10 && mm >= 0) {
  //   mm = '0' + mm;
  // } else {
  //   mm
  // }
  // let fin_fixdate = yyyy + '-' + mm + '-' + dd;
  // console.log(yyyy + '-' + mm + '-' + dd);


connections.scm_root.query("update drt_date set fix_date=? where sno=1",[no],(err,resdata)=>{
  if(err){

    console.error(err);
    res.json({
      datefix:false
    })
  }
  else {
    res.json({
      datefix:true,
      rest:no
    })

  }



})


}

exports.getfixeddate=(req,res)=>{

  connections.scm_public.query("select fix_date from drt_date where sno=1",(err,resdata)=>{
    if(err){

      console.error(err);
      res.json({
fixeddate:resdata
      })
    }
    else {
      res.json({
        fixeddate:resdata
      })
    }

  })
}


exports.deleteStockLedger = (currentmonth,yesterdaymonth,yesterday,callback) => {
	//currentmonth = 11;
	//yesterdaymonth =10;

	var today = new Date();
	var twodaysbefore = new Date(today);
	twodaysbefore.setDate(today.getDate() - 2);
	var dd1 = twodaysbefore.getDate();
	var mm1 = twodaysbefore.getMonth()+1; //January is 0!
	var yyyy1 = twodaysbefore.getFullYear();


	var monthlastdate  = new Date(yyyy1, mm1, 0).getDate();
	console.log("monthlastdate");
	console.log(monthlastdate);


	if(dd1<10){dd1='0'+dd1} if(mm1<10){mm1='0'+mm1}
	twodaysbefore = yyyy1+'-'+mm1+'-'+dd1;

	console.log("twodaysbefore");
	console.log(twodaysbefore);
	//process.exit(1);

	if(dd1!=monthlastdate){
		console.log("delete from stock_ledger where PREVDATE='" + twodaysbefore + "' and DESCRIPTION IN ('AEH','AHC','AHI','OHC')");
		connections.scm_public.query("delete from stock_ledger where PREVDATE='" + twodaysbefore + "' and DESCRIPTION IN ('AEH','AHC','AHI','OHC')",(error, res) => {
		  if (error) {
			  callback("delete query error",null);
		  }else{
			 callback(null,res);
		  }
		});

	}else{

		callback(null,'success');
	}


}






exports.deleteStockLedgerOverseas = (currentmonth,yesterdaymonth,yesterday,callback) => {

	var today = new Date();
	var twodaysbefore = new Date(today);
	twodaysbefore.setDate(today.getDate() - 2);
	var dd1 = twodaysbefore.getDate();
	var mm1 = twodaysbefore.getMonth()+1; //January is 0!
	var yyyy1 = twodaysbefore.getFullYear();

	var monthlastdate = new Date(yyyy1, mm1, 0).getDate();
	console.log("monthlastdate");
	console.log(monthlastdate);

	if(dd1<10){dd1='0'+dd1} if(mm1<10){mm1='0'+mm1}
	twodaysbefore = yyyy1+'-'+mm1+'-'+dd1;

	console.log("twodaysbefore");
	console.log(twodaysbefore);
	//process.exit(1);

	if(dd1!=monthlastdate){
		console.log("delete from stock_ledger where PREVDATE='" + twodaysbefore + "' and DESCRIPTION NOT IN ('AEH','AHC','AHI','OHC')");
		connections.scm_public.query("delete from stock_ledger where PREVDATE='" + twodaysbefore + "' and DESCRIPTION NOT IN ('AEH','AHC','AHI','OHC')",(error, res) => {
		  if (error) {
			  callback("delete query error",null);
		  }else{
			 callback(null,res);
		  }
		});

	}else{

		callback(null,'success');
	}


}


exports.stockledger = (req, res) => {
  console.log(req.body);
  let fromdate = req.body.date;
  let entity = req.body.entity;
  let branch = req.body.branch;
  let region = req.body.region;
  let departnment = req.body.departnment;
  let start = fromdate + '-01';
  let end = fromdate + '-31';





  let whereCondition = '';
  if(entity=='AEH' || entity=='AHC' || entity=='AHI'){
	  whereCondition+= " DESCRIPTION='"+entity+"' and ";
  }if(entity=='OHC'){
	  whereCondition+= " DESCRIPTION NOT IN ('AEH','AHC','AHI','OHC') and ";
  }if(entity=='All India'){
	  whereCondition+= " DESCRIPTION  IN ('AEH','AHC','AHI','OHC') and ";
  }if(branch != 'All'){
	  whereCondition+= " ORGANIZATIONNAME='"+branch+"' and ";
  }
  if(region != 'All'){
	  whereCondition+= " region='"+region+"' and ";
  }
  if(departnment != 'All'){
	  whereCondition+= " DEPARTMENT_NAME in ("+departnment+") and ";
  }
  let transquery="select * from stock_ledger WHERE "+whereCondition+ " PREVDATE between '" + start + "' and '" + end + "' order by DESCRIPTION ASC";

  console.log(transquery);
      connections.scm_public.query(transquery, (err, resstockledger) => {
        if (err) console.error(err);
        res.json({
          "result": {
            "stockledger": resstockledger
          }
        })
  })

}


exports.chpccancel = (req, res) => {
//  console.log(req.body);

  let ch_id = req.body.ch_id;
  let bill_no = req.body.billno;
  let cmmt = req.body.comment;
  let voc = req.body.voucher;
  let branch = req.body.branch;
  let amount = req.body.debit;
  let cat = req.body.cat;
  let billnum = req.body.bill_num;
  let vendor_name = req.body.vendor_name;
  let voucher_attach = req.body.voucher_attach;
  let bill_attach = req.body.bill_attach;


  connections.scm_root.getConnection((err, conn) => {
    console.log("connection established");

    conn.beginTransaction(function(err) {
      if (err) {
        res.json({
          dataupdated: false
        })
      } else {
        console.log("begin transaction");

        connections.scm_root.query('UPDATE pettycash SET status=-1, cancel_by=?,cancel_date=NOW(),remarks=? WHERE sno=? AND branch=?', [ch_id, cmmt, bill_no, branch], (err, resdata) => {
          if (err) {
            conn.rollback(function() {
              res.json({
                dataupdated: false
              })
            })

          } else {
            let insertptycash = "insert into pettycash (branch,voucher_no,category_id,vendorname,bill_no,remarks,credit,voucher_attach,bill_attch,status,cancel_by,cancel_date) value(?,?,?,?,?,?,?,?,?,-1,?,NOW())"
            connections.scm_root.query(insertptycash, [branch, voc, cat, vendor_name, billnum, cmmt, amount, voucher_attach, bill_attach, ch_id], (err, resdata) => {
              if (err) {
                conn.rollback(function() {
                  res.json({
                    dataupdated: false
                  })
                })
              } else {
                let updateptycashalloc = "UPDATE pettycash_allocate_amount SET balance=(SELECT * FROM (SELECT SUM(balance)+? FROM pettycash_allocate_amount AS b WHERE branch=? ) AS bb),debit=(SELECT * FROM (SELECT SUM(debit)-? FROM pettycash_allocate_amount AS b WHERE branch=? ) AS cc),modified_date=NOW() WHERE branch=?"
                connections.scm_root.query(updateptycashalloc, [amount, branch, amount, branch, branch], (err, resdata) => {
                  if (err) {
                    conn.rollback(function() {
                      res.json({
                        dataupdated: false
                      })
                    })
                  } else {
                    console.log("all done");
                    conn.commit(function(err) {
                      if (err) {
                        conn.rollback(function() {
                          res.json({
                            dataupdated: false
                          })
                          //      throw err;
                        });
                      } else {
                        conn.release();
                        console.log("updated");
                        res.json({
                          dataupdated: true
                        })

                      }
                    })
                  }
                })
              }
            })

          }
        })

      }
    })


  })
}


exports.get_pcreports = (req, res) => {
  let branch = req.params.branch;
  let category = req.params.category;
  let fromdate = req.params.date;
  console.log(fromdate);

  let from_date = fromdate.concat('-01');
  let to_date = fromdate.concat('-31');

  if ((branch == 'All') && (category == 'All')) {
    connections.scm_public.query(files.pcreports_allallall, [from_date, to_date], (err, resdata) => {
      console.log(resdata);
      if (err) console.error(err);
      res.json({
        "result": {
          "pc": resdata
        }
      })
    })
  } else if ((branch != 'All') && (category == 'All')) {
    console.log("hit");
    connections.scm_public.query(files.pcreport_brall, [from_date, to_date, branch], (err, resdata) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "pc": resdata
        }
      })
    })
  } else if ((branch == 'All') && (category != 'All')) {
    connections.scm_public.query(files.pcreport_allcat, [from_date, to_date, category], (err, resdata) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "pc": resdata
        }
      })
    })
  } else {
    connections.scm_public.query(files.pcreport_brcat, [from_date, to_date, branch, category], (err, resdata) => {
      if (err) console.error(err);
      res.json({
        "result": {
          "pc": resdata
        }
      })

    })
  }

}

exports.download_payment = (req, res) => {
  let filename = req.params.download
  //console.log(filepath);
  var fileLocation = '/var/www/andaman/Payment_receipt/' + filename;
  //var fileLocation = 'D:/git/cogs-api-new-final/voucher/'+filename;

  console.log(fileLocation);

  res.download(fileLocation);
}






exports.tpabillprint = (req, res) => {

  let externalid = req.params.externalid;
  let branch = req.params.branch;
  let agencyname = req.params.agencyname;
   connections.scm_public.query("select * from revenue_details where EXTERNAL_ID='" + externalid + "'",(rev_det_err, rev_det_res) =>  {
    if ((rev_det_err) || (rev_det_res.length==0)){
		res.json({"ResponseCode": 201,"ResponseMsg": "No data found"});
	}else{
		connections.scm_public.query("select * from revenue_detail_tpa where bill_id='" + externalid + "'",(rev_det_tpa_err, rev_det_tpa_res) => {
			if ((rev_det_tpa_err) || (rev_det_tpa_res.length==0)) {
			//if (rev_det_tpa_err) {
				res.json({"ResponseCode": 202,"ResponseMsg": "No data found"});
			}else{
				connections.scm_public.query("select * from branches where code='" + branch + "'",(branch_err, branchres) => {
					if (branch_err) {
						res.json({"ResponseCode": 203,"ResponseMsg": "No data found"});
					}else{
						connections.scm_public.query("select * from tpa_master where tpa_name='" + agencyname + "'",  (tpa_temp_err, tpa_temp_res) => {
						if ((tpa_temp_err) || (tpa_temp_res.length==0)) {
							res.json({"ResponseCode": 203,"ResponseMsg": "No bill print found for this agency"});
						}else{
							connections.scm_public.query("select * from service_mapping where tpa_id='" + tpa_temp_res[0].id + "'", (ser_mapp_err, ser_mapp_res) => {
							if (ser_mapp_err){
								res.json({"ResponseCode": 204,"ResponseMsg": "No data found"});
							 }else{

									mods.functions
									  .tpaBillPrint(
										rev_det_res,
										rev_det_tpa_res,
										branchres,
										tpa_temp_res,
										ser_mapp_res
									  )
									  .then(final => res.send(final));
							 }
							});

						}
						});
					}
				  });
			}
		  });
	}
  });



  // }
};



//praveenraj

exports.iwsr=(req,res)=>{
let frmdate=req.params.fromdate;
let todate=req.params.todate;
let entity=req.params.entity;

if(entity=='All'){
let selectqyery=" SELECT MID(BILLNO,5,2) AS vtype,rd.* FROM revenue_details AS rd WHERE TRANSACTION_DATE BETWEEN ? AND ?";
	connections.scm_public.query(selectqyery,[frmdate,todate],(err,resdata)=>{
		if(err) console.error(err);

		res.json({
			"result":{"iwsr":resdata}
		})
	})

}
else if (entity=='OHC') {
	let selectqyery="SELECT MID(BILLNO,5,2) AS vtype,rd.* FROM revenue_details AS rd WHERE TRANSACTION_DATE BETWEEN ? AND ? and entity not in ('AEH','AHC','AHI')";
		connections.scm_public.query(selectqyery,[frmdate,todate,entity],(err,resdata)=>{
			if(err) console.error(err);

			res.json({
				"result":{"iwsr":resdata}
			})
		})
}
else {
	let selectqyery="SELECT MID(BILLNO,5,2) AS vtype,rd.* FROM revenue_details AS rd WHERE TRANSACTION_DATE BETWEEN ? AND ? and entity=?";
		connections.scm_public.query(selectqyery,[frmdate,todate,entity],(err,resdata)=>{
			if(err) console.error(err);

			res.json({
				"result":{"iwsr":resdata}
			})
		})
}
}
