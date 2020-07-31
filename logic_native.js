const _ = require("./modules")._;
const connections = require("./modules").connections;
const files = require("./modules").sqls;
const session = require("./modules").cookieSession;

exports.adminMainNative = async (
  dbres2,
  branches,
  ftddate,
  breakupres,
  breakupmtdres
) => {
  let entityWise = await filterEntity(dbres2, ftddate);
  let groupWise = await filterGroupwise(
    entityWise.aeharr,
    entityWise.ahcarr,
    dbres2,
    branches,
    ftddate,
    breakupres,
    breakupmtdres
  );
  return {
    alin: entityWise.alin,
    aeh: entityWise.aeh,
    ahc: entityWise.ahc,
    aehgroup: groupWise.aeh,
    ahcgroup: groupWise.ahc,
    branchwise: groupWise.branchwise
  };
};

exports.othersMainNative = async (
  revenue,
  individual,
  group,
  branches,
  ftddate,
  breakupres,
  breakupmtdres
) => {
  let branchWise = [],
    seperatedBranchWise = [],
    groupWise = [],
    mtdpha = 0,
    mtdopt = 0,
    mtdot = 0,
    mtdlab = 0,
    mtdrev = 0,
    mtd = 0,
    tempObj = {},
    tempcogsdata = null,
    temprevdata = null,
    branchname = null,
    ftdotcount = 0,
    mtdotcount = 0,
    cogsmtdotcount = 0;
  let groupBranchArr = [],
    branchHeadings = [],
    ftdpha = 0,
    ftdopt = 0,
    ftdot = 0,
    ftdlab = 0,
    ftd = 0,
    ftdrev = 0,
    ftdpharev = 0,
    ftdoptrev = 0,
    ftdotrev = 0,
    ftdlabrev = 0,
    ftdconsultrev = 0,
    ftdotherrev = 0,
    ftdvobpha = 0,
    ftdvobcons = 0,
    ftdvoblab = 0,
    ftdvobopt = 0,
    ftdvobot = 0,
    ftdvobothers = 0,
    ftdvob = 0,
    cogsftdotcount = 0;
  let shouldRemove = [],
    mappings = [],
    mtdpharev = 0,
    mtdoptrev = 0,
    mtdlabrev = 0,
    mtdotrev = 0,
    mtdconsultrev = 0,
    mtdothersrev = 0,
    mtdvob = 0,
    mtdvobpha = 0,
    mtdvobot = 0,
    mtdvobopt = 0,
    mtdvoblab = 0,
    mtdvobcons = 0,
    mtdvobothers = 0;
  if (group.length !== 0) {
    group.forEach(element => {
      if (element.split("=")[1].length === 3) {
        groupBranchArr.push(element.split("=")[1]);
        shouldRemove.push(element.split("=")[1]);
      } else {
        groupBranchArr.push(element.split("=")[1].split("+"));
      }
      branchHeadings.push(element.split("=")[0]);
    });
  }
  group.forEach(element => {
    let head = element.split("=")[0];
    let group = element.split("=")[1];
    let obj = {};
    obj["heading"] = head;
    obj["branches"] = group;
    mappings.push(obj);
  });
  groupBranchArr.forEach(group => {
    if (typeof group === "string") {
      group = [group];
    }
    group.forEach(branch => {
      let tempFilterrev = _.filter(revenue, {
        branch: branch,
        trans_date: ftddate
      });
      if (tempFilterrev.length !== 0) {
        tempFilterrev.forEach(element => {
          ftdrev += element.ftd;
          (ftdpharev += element.pharmacy),
            (ftdoptrev += element.opticals),
            (ftdotrev += element.surgery),
            (ftdlabrev += element.laboratory),
            (ftdconsultrev += element.consultation),
            (ftdotherrev += element.others);
        });
      } else {
        ftdrev += 0;
        (ftdpharev += 0),
          (ftdoptrev += 0),
          (ftdotrev += 0),
          (ftdlabrev += 0),
          (ftdconsultrev += 0),
          (ftdotherrev += 0);
      }
      (tempObj.branch = branch),
        (tempObj.ftdrev = ftdrev),
        (tempObj.ftdpharev = ftdpharev),
        (tempObj.ftdotrev = ftdotrev),
        (tempObj.ftdoptrev = ftdoptrev),
        (tempObj.ftdlabrev = ftdlabrev),
        (tempObj.ftdconsultrev = ftdconsultrev),
        (tempObj.ftdotherrev = ftdotherrev);

      _.filter(revenue, { branch: branch }).forEach(element => {
        mtdrev += element.ftd;
        (mtdpharev += element.pharmacy),
          (mtdoptrev += element.opticals),
          (mtdotrev += element.surgery),
          (mtdlabrev += element.laboratory),
          (mtdconsultrev += element.consultation),
          (mtdothersrev += element.others);
      });
      (tempObj.mtdrev = mtdrev),
        (tempObj.mtdpharev = mtdpharev),
        (tempObj.mtdoptrev = mtdoptrev),
        (tempObj.mtdlabrev = mtdlabrev),
        (tempObj.mtdotrev = mtdotrev),
        (tempObj.mtdothersrev = mtdothersrev),
        (tempObj.mtdconsultrev = mtdconsultrev);
    });
    groupWise.push(tempObj);
    (tempObj = {}),
      (mtdpha = 0),
      (mtdopt = 0),
      (mtdot = 0),
      (mtdlab = 0),
      (mtd = 0),
      (mtdrev = 0),
      (mtdpharev = 0),
      (mtdoptrev = 0),
      (mtdotrev = 0),
      (mtdlabrev = 0),
      (mtdconsultrev = 0),
      (mtdothersrev = 0),
      (mtdvob = 0),
      (mtdvobpha = 0),
      (mtdvobot = 0),
      (mtdvobopt = 0),
      (mtdvoblab = 0),
      (mtdvobcons = 0),
      (mtdvobothers = 0),
      (mtdotcount = 0),
      (cogsmtdotcount = 0),
      (ftdpha = 0),
      (ftdopt = 0),
      (ftdot = 0),
      (ftdlab = 0),
      (ftd = 0),
      (ftdrev = 0),
      (ftdpharev = 0),
      (ftdoptrev = 0),
      (ftdotrev = 0),
      (ftdlabrev = 0),
      (ftdconsultrev = 0),
      (ftdotherrev = 0),
      (ftdvobpha = 0),
      (ftdvobcons = 0),
      (ftdvoblab = 0),
      (ftdvobopt = 0),
      (ftdvobot = 0),
      (ftdvobothers = 0),
      (ftdvob = 0),
      (ftdotcount = 0),
      (cogsftdotcount = 0);
  });

  for (let i = 0; i < branchHeadings.length; i++) {
    groupWise[i].branch = branchHeadings[i];
  }

  individual.forEach(branch => {
    _.filter(branches, { code: branch }).forEach(
      ele => (branchname = ele.branch)
    );
    if (!shouldRemove.includes(branch)) {
      let tempFileterev = _.filter(revenue, {
        branch: branch,
        trans_date: ftddate
      });
      if (tempFileterev.length !== 0) {
        tempFileterev.forEach(element => {
          (tempObj.branch = branchname),
            (tempObj.code = branch),
            (tempObj.ftdrev = element.ftd),
            (tempObj["ftdpharev"] = element.pharmacy),
            (tempObj["ftdoptrev"] = element.opticals),
            (tempObj["ftdotrev"] = element.surgery),
            (tempObj["ftdlabrev"] = element.laboratory),
            (tempObj["ftdconsultrev"] = element.consultation),
            (tempObj["ftdotherrev"] = element.others);
        });
      } else {
        (tempObj.branch = branchname),
          (tempObj.code = branch),
          (tempObj.ftdrev = 0),
          (tempObj["ftdpharev"] = 0),
          (tempObj["ftdoptrev"] = 0),
          (tempObj["ftdotrev"] = 0),
          (tempObj["ftdlabrev"] = 0),
          (tempObj["ftdconsultrev"] = 0),
          (tempObj["ftdotherrev"] = 0);
      }
      let tempftdbreakup = _.filter(breakupres, {
        branch: branch,
        trans_date: ftddate
      });
      if (tempftdbreakup.length !== 0) {
        tempObj["ftdbreakup"] = tempftdbreakup;
      } else {
        tempObj["ftdbreakup"] = 0;
      }
      let tempmtdbreakup = _.filter(breakupmtdres, { branch: branch });
      if (tempmtdbreakup.length !== 0) {
        tempObj["mtdbreakup"] = tempmtdbreakup;
      } else {
        tempObj["mtdbreakup"] = 0;
      }
      _.filter(revenue, { branch: branch }).forEach(element => {
        (mtdrev += element.ftd),
          (mtdpharev += element.pharmacy),
          (mtdoptrev += element.opticals),
          (mtdotrev += element.surgery),
          (mtdlabrev += element.laboratory),
          (mtdconsultrev += element.consultation),
          (mtdothersrev += element.others);
      });
      (tempObj.mtdrev = mtdrev),
        (tempObj.mtdpharev = mtdpharev),
        (tempObj.mtdoptrev = mtdoptrev),
        (tempObj.mtdlabrev = mtdlabrev),
        (tempObj.mtdotrev = mtdotrev),
        (tempObj.mtdothersrev = mtdothersrev),
        (tempObj.mtdconsultrev = mtdconsultrev);
      branchWise.push(tempObj);
      (tempObj = {}),
        (mtdpha = 0),
        (mtdopt = 0),
        (mtdot = 0),
        (mtdlab = 0),
        (mtd = 0),
        (mtdrev = 0),
        (mtdpharev = 0),
        (mtdoptrev = 0),
        (mtdotrev = 0),
        (mtdlabrev = 0),
        (mtdconsultrev = 0),
        (mtdothersrev = 0),
        (mtdvob = 0),
        (mtdvobpha = 0),
        (mtdvobot = 0),
        (mtdvobopt = 0),
        (mtdvoblab = 0),
        (mtdvobcons = 0),
        (mtdvobothers = 0),
        (mtdotcount = 0),
        (cogsmtdotcount = 0);
    } else {
      let tempFileterev = _.filter(revenue, {
        branch: branch,
        trans_date: ftddate
      });
      if (tempFileterev.length !== 0) {
        tempFileterev.forEach(element => {
          (tempObj.branch = branchname),
            (tempObj.code = branch),
            (tempObj.ftdrev = element.ftd),
            (tempObj["ftdpharev"] = element.pharmacy),
            (tempObj["ftdoptrev"] = element.opticals),
            (tempObj["ftdotrev"] = element.surgery),
            (tempObj["ftdlabrev"] = element.laboratory),
            (tempObj["ftdconsultrev"] = element.consultation),
            (tempObj["ftdotherrev"] = element.others);
        });
      } else {
        (tempObj.branch = branchname),
          (tempObj.code = branch),
          (tempObj.ftdrev = 0),
          (tempObj["ftdpharev"] = 0),
          (tempObj["ftdoptrev"] = 0),
          (tempObj["ftdotrev"] = 0),
          (tempObj["ftdlabrev"] = 0),
          (tempObj["ftdconsultrev"] = 0),
          (tempObj["ftdotherrev"] = 0);
      }
      let tempFilterbreakupftd = _.filter(breakupres, {
        branch: branch,
        trans_date: ftddate
      });
      if (tempFilterbreakupftd.length !== 0) {
        tempObj["ftdbreakup"] = tempFilterbreakupftd;
      } else {
        tempObj["ftdbreakup"] = 0;
      }
      let tempFilterbreakupmtd = _.filter(breakupmtdres, { branch: branch });
      if (tempFilterbreakupmtd.length !== 0) {
        tempObj["mtdbreakup"] = tempFilterbreakupmtd;
      } else {
        tempObj["mtdbreakup"] = 0;
      }

      _.filter(revenue, { branch: branch }).forEach(element => {
        (mtdrev += element.ftd),
          (mtdpharev += element.pharmacy),
          (mtdoptrev += element.opticals),
          (mtdotrev += element.surgery),
          (mtdlabrev += element.laboratory),
          (mtdconsultrev += element.consultation),
          (mtdothersrev += element.others);
      });
      (tempObj.mtdrev = mtdrev),
        (tempObj.mtdpharev = mtdpharev),
        (tempObj.mtdoptrev = mtdoptrev),
        (tempObj.mtdlabrev = mtdlabrev),
        (tempObj.mtdotrev = mtdotrev),
        (tempObj.mtdothersrev = mtdothersrev),
        (tempObj.mtdconsultrev = mtdconsultrev);
      seperatedBranchWise.push(tempObj);
      (tempObj = {}),
        (mtdpha = 0),
        (mtdopt = 0),
        (mtdot = 0),
        (mtdlab = 0),
        (mtd = 0),
        (mtdrev = 0),
        (mtdpharev = 0),
        (mtdoptrev = 0),
        (mtdotrev = 0),
        (mtdlabrev = 0),
        (mtdconsultrev = 0),
        (mtdothersrev = 0),
        (mtdvob = 0),
        (mtdvobpha = 0),
        (mtdvobot = 0),
        (mtdvobopt = 0),
        (mtdvoblab = 0),
        (mtdvobcons = 0),
        (mtdvobothers = 0),
        (mtdotcount = 0),
        (cogsmtdotcount = 0);
    }
  });
  return {
    group: groupWise,
    branch: branchWise,
    mappings: mappings,
    specialBranch: _.uniqBy(seperatedBranchWise, "code")
  };
};

let filterEntity = async (dbres2, ftddate) => {
  let tempObj = {},
    pha = 0,
    opt = 0,
    lab = 0,
    ot = 0,
    total = 0,
    rev = 0,
    aeharr = [],
    aehrevarr = [],
    ahcrevarr = [],
    ahcarr = [],
    alin = {};
  aehrevarr = _.filter(dbres2, { entity: "AEH" });
  _.filter(aehrevarr, { trans_date: ftddate }).forEach(element => {
    pha += element.pharmacy;
    opt += element.opticals;
    lab += element.laboratory;
    ot += element.surgery;
    total += element.ftd;
  });
  tempObj.AEH = {
    branch: "AEH",
    ftdpharev: pha,
    ftdoptrev: opt,
    ftdlabrev: lab,
    ftdotrev: ot,
    ftdrev: total
  };
  (pha = 0), (opt = 0), (lab = 0), (ot = 0), (total = 0);
  aehrevarr.forEach(element => {
    pha += element.pharmacy;
    opt += element.opticals;
    lab += element.laboratory;
    ot += element.surgery;
    total += element.ftd;
  });
  (tempObj.AEH.mtdpharev = pha),
    (tempObj.AEH.mtdoptrev = opt),
    (tempObj.AEH.mtdlabrev = lab),
    (tempObj.AEH.mtdotrev = ot),
    (tempObj.AEH.mtdrev = total);
  (pha = 0), (opt = 0), (lab = 0), (ot = 0), (total = 0);
  ahcrevarr = _.filter(dbres2, { entity: "AHC" });
  _.filter(ahcrevarr, { trans_date: ftddate }).forEach(element => {
    pha += element.pharmacy;
    opt += element.opticals;
    lab += element.laboratory;
    ot += element.surgery;
    total += element.ftd;
  });
  tempObj.AHC = {
    branch: "AHC",
    ftdpharev: pha,
    ftdoptrev: opt,
    ftdlabrev: lab,
    ftdotrev: ot,
    ftdrev: total
  };
  (pha = 0), (opt = 0), (lab = 0), (ot = 0), (total = 0);
  ahcrevarr.forEach(element => {
    pha += element.pharmacy;
    opt += element.opticals;
    lab += element.laboratory;
    ot += element.surgery;
    total += element.ftd;
  });
  (tempObj.AHC.mtdpharev = pha),
    (tempObj.AHC.mtdoptrev = opt),
    (tempObj.AHC.mtdlabrev = lab),
    (tempObj.AHC.mtdotrev = ot),
    (tempObj.AHC.mtdrev = total);
  for (let key in tempObj.AEH) {
    alin[key] = tempObj.AEH[key];
  }
  for (let key in tempObj.AHC) {
    alin["branch"] = "All India";
    alin[key] += tempObj.AHC[key];
  }

  return {
    alin: alin,
    aeharr: aeharr,
    ahcarr: ahcarr,
    aeh: tempObj.AEH,
    ahc: tempObj.AHC
  };
};

let filterGroupwise = async (
  aeh,
  ahc,
  dbres2,
  branches,
  ftddate,
  breakupres,
  breakupmtdres
) => {
  let ftdpha = 0,
    ftdopt = 0,
    ftdlab = 0,
    ftdot = 0,
    ftd = 0,
    mtdpha = 0,
    mtdopt = 0,
    mtdlab = 0,
    mtdot = 0,
    mtd = 0,
    aehtempObj = {},
    ahctempObj = {},
    branchObj = {},
    ftdrev = 0,
    mtdrev = 0,
    branchName = null,
    ftdpharev = 0,
    ftdoptrev = 0,
    ftdotrev = 0,
    ftdlabrev = 0,
    ftdconsultrev = 0,
    ftdothersrev = 0,
    mtdpharev = 0,
    mtdoptrev = 0,
    mtdotrev = 0,
    mtdlabrev = 0,
    mtdconsultrev = 0,
    mtdothersrev = 0,
    code = null,
    ftdotcount = 0,
    mtdotcount = 0,
    cogsftdotcount = 0,
    cogsmtdotcount = 0,
    aehftdbreakup = 0,
    aehmtdbreakup = 0,
    ahcftdbreakup = 0,
    ahcmtdbreakup = 0;
  let aehGroups = [
    "Chennai Main Hospital",
    "Chennai Branches",
    "Kanchi + Vellore",
    "Kum + Ney + Vil",
    "Dha + Salem + Krish",
    "Erode + Hosur",
    "Jaipur",
    "Madurai KK Nagar"
  ];
  let ahcGroups = [
    "Chennai branches",
    "Tirunelveli",
	"Coimbatore",
    "Tuticorin + Madurai",
    "Trichy",
    "Thanjavur",
    "Tiruppur",
    "Andaman",
    "Karnataka",
    "Banglore",
    "Hubli + Mysore",
	"Maharashtra",
    "Telangana",
    "Hyderabad",
    "Andhra Pradesh",
    "Rest of India(incl. Jaipur)",
    "Kerala",
    "Kolkata",  
    "Ahmedabad",
    "Madhya Pradesh",
    "Odisha"
    //'Ambattur'
  ];
  let aehgroupedBranches = {
    "Chennai Main Hospital": ["CMH"],
    "Chennai Branches": [
      "ANN",
      "ASN",
      "AVD",
      "NLR",
      "PMB",
      "PRR",
      "TLR",
      "TRC",
      "VLC"
    ],
    "Kanchi + Vellore": ["KNP", "VLR"],
    "Kum + Ney + Vil": ["KBK", "NVL", "VPM"],
    "Dha + Salem + Krish": ["DHA", "SLM", "KSN"],
    "Erode + Hosur": ["ERD", "HSR"],
    Jaipur: ["JPR"],
    "Madurai KK Nagar": ["MDU"]
  };
  let ahcgroupedBranches = {
    "Chennai branches": ["TBM", "ADY", "EGM", "MGP", "NWP","AMB","TVT"],
    Pondycherry: ["PDY"],
    Tirunelveli: ["TVL"],
	 Coimbatore: ["CMB"],
    "Tuticorin + Madurai": ["TCN", "APM"],
    Trichy: ["TRI"],
    Thanjavur: ["TNJ"],
    Tiruppur: ["TPR"],
    Andaman: ["AMN"],
    Karnataka: [
      "BMH",
	  
      "WFD",
      "KML",
      "CLR",
      "INR",
      "PNR",
      "YLK",
      "SVR",
      "BSK",
      "RRN",
      "HUB",
      "MCC",
      "MYS",
	  "RJN",

    ],
    Banglore: ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK","SVR","BSK","RRN","RJN"],
    "Hubli + Mysore": ["HUB", "MCC", "MYS"],
	Maharashtra :["VSH", "PUN", "HDP","CMR", "KTD"],
    Telangana: ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD","MPM","GCB"],
    Hyderabad: ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD","MPM","GCB"],
    "Andhra Pradesh": ["VMH", "NEL", "GUN", "TPT", "RAJ"],
    "Rest of India(incl. Jaipur)": [
      "TVM",
	  "KTM",
      "KOL",
      "KAS",
	  "VSH",
      "PUN",
	  "HDP",
      "AHM",      
	  "JWS",
	  "APR",
	  "ATA",
	  "KWA",
      "CTK",
      "BHU",
      "JPR"
    ],
    Kerala: ["TVM","KTM"],
    Kolkata: ["KOL", "KAS"],   
    Ahmedabad: ["AHM"],
    "Madhya Pradesh": ["JWS","APR","ATA","KWA"],
    Odisha: ["CTK", "BHU"]

    //,Ambattur : ['AMB']
  };
  let ftdvobot = 0,
    ftdvobopt = 0,
    ftdvobpha = 0,
    ftdvoblab = 0,
    ftdvobcons = 0,
    ftdvobothers = 0,
    ftdvob = 0,
    mtdvobot = 0,
    mtdvobopt = 0,
    mtdvoblab = 0,
    mtdvobpha = 0,
    mtdvobcons = 0,
    mtdvobothers = 0,
    mtdvob = 0;
  aehGroups.forEach(group => {
    aehtempObj[group] = {};
    aehgroupedBranches[group].forEach(branch => {
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          ftdpha += element.pharmacy;
          ftdopt += element.opticals;
          ftdlab += element.laboratory;
          ftdot += element.surgery;
          ftd += element.ftd;
        }
      );
      (aehtempObj[group].ftdpharev = ftdpha),
        (aehtempObj[group].ftdoptrev = ftdopt),
        (aehtempObj[group].ftdlabrev = ftdlab),
        (aehtempObj[group].ftdotrev = ftdot),
        (aehtempObj[group].ftdrev = ftd);
      _.filter(dbres2, { branch: branch }).forEach(element => {
        mtdpha += element.pharmacy;
        mtdopt += element.opticals;
        mtdlab += element.laboratory;
        mtdot += element.surgery;
        mtd += element.ftd;
      });
      (aehtempObj[group].mtdpharev = mtdpha),
        (aehtempObj[group].mtdoptrev = mtdopt),
        (aehtempObj[group].mtdlabrev = mtdlab),
        (aehtempObj[group].mtdotrev = mtdot),
        (aehtempObj[group].mtdrev = mtd),
        (aehtempObj[group].branch = group);
    });
    (ftdpha = 0),
      (ftdopt = 0),
      (ftdlab = 0),
      (ftdot = 0),
      (ftd = 0),
      (mtdpha = 0),
      (mtdopt = 0),
      (mtdlab = 0),
      (mtdot = 0),
      (mtd = 0);
  });
  for (let key in aehgroupedBranches) {
    branchObj[key] = [];
    aehgroupedBranches[key].forEach(branch => {
      _.filter(branches, { code: branch }).forEach(element => {
        (branchName = element.branch), (code = element.code);
      });
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          (ftdrev = element.ftd),
            (ftdpharev = element.pharmacy),
            (ftdoptrev = element.opticals),
            (ftdotrev = element.surgery),
            (ftdlabrev = element.laboratory),
            (ftdconsultrev = element.consultation),
            (ftdothersrev = element.others);
        }
      );
      _.filter(dbres2, { branch: branch }).forEach(element => {
        (mtdrev += element.ftd),
          (mtdpharev += element.pharmacy),
          (mtdoptrev += element.opticals),
          (mtdotrev += element.surgery),
          (mtdlabrev += element.laboratory),
          (mtdconsultrev += element.consultation),
          (mtdothersrev += element.others);
      });
      let tempftdbreakup = _.filter(breakupres, { branch: branch });
      if (tempftdbreakup.length !== 0) {
        aehftdbreakup = tempftdbreakup;
      } else {
        aehftdbreakup = 0;
      }
      let tempmtdbreakup = _.filter(breakupmtdres, { branch: branch });
      if (tempmtdbreakup.length !== 0) {
        aehmtdbreakup = tempmtdbreakup;
      } else {
        aehmtdbreakup = 0;
      }
      // _.filter(surgres, { BILLED: branch, transaction_date: ftddate }).forEach(element => {
      //     ftdotcount = element.count
      // })
      // _.filter(surgres, { BILLED: branch }).forEach(element => {
      //     mtdotcount += element.count
      // })
      // _.filter(countres, { branch: branch, trans_date: ftddate }).forEach(element => {
      //     cogsftdotcount = element.count
      // })
      // _.filter(countres, { branch: branch }).forEach(element => {
      //     cogsmtdotcount += element.count
      // })
      branchObj[key].push({
        branch: branchName,
        code: code,
        ftdrev: ftdrev,
        ftdpharev: ftdpharev,
        ftdoptrev: ftdoptrev,
        ftdotrev: ftdotrev,
        ftdlabrev: ftdlabrev,
        ftdconsultrev: ftdconsultrev,
        ftdothersrev: ftdothersrev,
        mtdrev: mtdrev,
        mtdpharev: mtdpharev,
        mtdoptrev: mtdoptrev,
        mtdotrev: mtdotrev,
        mtdlabrev: mtdlabrev,
        mtdconsultrev: mtdconsultrev,
        mtdothersrev: mtdothersrev,
        ftdbreakup: aehftdbreakup,
        mtdbreakup: aehmtdbreakup
      });
      (ftdpha = 0),
        (ftdopt = 0),
        (ftdlab = 0),
        (ftdot = 0),
        (ftd = 0),
        (mtdpha = 0),
        (mtdopt = 0),
        (mtdlab = 0),
        (mtdot = 0),
        (mtd = 0),
        (ftdrev = 0),
        (mtdrev = 0),
        (ftdpharev = 0),
        (ftdoptrev = 0),
        (ftdotrev = 0),
        (ftdlabrev = 0),
        (ftdconsultrev = 0),
        (ftdothersrev = 0),
        (mtdpharev = 0),
        (mtdoptrev = 0),
        (mtdotrev = 0),
        (mtdlabrev = 0),
        (mtdconsultrev = 0),
        (mtdothersrev = 0),
        (code = null),
        (ftdvobot = 0),
        (ftdvobopt = 0),
        (ftdvobpha = 0),
        (ftdvoblab = 0),
        (ftdvobcons = 0),
        (ftdvobothers = 0),
        (ftdvob = 0),
        (mtdvobot = 0),
        (mtdvobopt = 0),
        (mtdvoblab = 0),
        (mtdvobpha = 0),
        (mtdvobcons = 0),
        (mtdvobothers = 0),
        (mtdvob = 0),
        (ftdotcount = 0),
        (mtdotcount = 0),
        (cogsftdotcount = 0),
        (cogsmtdotcount = 0),
        (aehftdbreakup = 0),
        (aehmtdbreakup = 0);
    });
  }
  for (let key in ahcgroupedBranches) {
    branchObj[key] = [];
    ahcgroupedBranches[key].forEach(branch => {
      _.filter(branches, { code: branch }).forEach(element => {
        (branchName = element.branch), (code = element.code);
      });
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          (ftdrev = element.ftd),
            (ftdpharev = element.pharmacy),
            (ftdoptrev = element.opticals),
            (ftdotrev = element.surgery),
            (ftdlabrev = element.laboratory),
            (ftdconsultrev = element.consultation),
            (ftdothersrev = element.others);
        }
      );
      _.filter(dbres2, { branch: branch }).forEach(element => {
        (mtdrev += element.ftd),
          (mtdpharev += element.pharmacy),
          (mtdoptrev += element.opticals),
          (mtdotrev += element.surgery),
          (mtdlabrev += element.laboratory),
          (mtdconsultrev += element.consultation),
          (mtdothersrev += element.others);
      });
      let tempfilterftdbreakup = _.filter(breakupres, { branch: branch });
      if (tempfilterftdbreakup.length !== 0) {
        ahcftdbreakup = tempfilterftdbreakup;
      } else {
        ahcftdbreakup = 0;
      }
      let tempfiltermtdbreakup = _.filter(breakupmtdres, { branch: branch });
      if (tempfiltermtdbreakup.length !== 0) {
        ahcmtdbreakup = tempfiltermtdbreakup;
      } else {
        ahcmtdbreakup = 0;
      }
      // _.filter(surgres, { BILLED: branch, transaction_date: ftddate }).forEach(element => {
      //     ftdotcount = element.count
      // })
      // _.filter(surgres, { BILLED: branch }).forEach(element => {
      //     mtdotcount += element.count
      // })
      // _.filter(countres, { branch: branch, trans_date: ftddate }).forEach(element => {
      //     cogsftdotcount = element.count
      // })
      // _.filter(countres, { branch: branch }).forEach(element => {
      //     cogsmtdotcount += element.count
      // })
      branchObj[key].push({
        branch: branchName,
        code: code,
        ftdrev: ftdrev,
        ftdpharev: ftdpharev,
        ftdoptrev: ftdoptrev,
        ftdotrev: ftdotrev,
        ftdlabrev: ftdlabrev,
        ftdconsultrev: ftdconsultrev,
        ftdothersrev: ftdothersrev,
        mtdrev: mtdrev,
        mtdpharev: mtdpharev,
        mtdoptrev: mtdoptrev,
        mtdotrev: mtdotrev,
        mtdlabrev: mtdlabrev,
        mtdconsultrev: mtdconsultrev,
        mtdothersrev: mtdothersrev,
        ftdbreakup: ahcftdbreakup,
        mtdbreakup: ahcmtdbreakup
      });
      (ftdpha = 0),
        (ftdopt = 0),
        (ftdlab = 0),
        (ftdot = 0),
        (ftd = 0),
        (mtdpha = 0),
        (mtdopt = 0),
        (mtdlab = 0),
        (mtdot = 0),
        (mtd = 0),
        (ftdrev = 0),
        (mtdrev = 0),
        (ftdpharev = 0),
        (ftdoptrev = 0),
        (ftdotrev = 0),
        (ftdlabrev = 0),
        (ftdconsultrev = 0),
        (ftdothersrev = 0),
        (mtdpharev = 0),
        (mtdoptrev = 0),
        (mtdotrev = 0),
        (mtdlabrev = 0),
        (mtdconsultrev = 0),
        (mtdothersrev = 0),
        (code = null),
        (ftdvobot = 0),
        (ftdvobopt = 0),
        (ftdvobpha = 0),
        (ftdvoblab = 0),
        (ftdvobcons = 0),
        (ftdvobothers = 0),
        (ftdvob = 0),
        (mtdvobot = 0),
        (mtdvobopt = 0),
        (mtdvoblab = 0),
        (mtdvobpha = 0),
        (mtdvobcons = 0),
        (mtdvobothers = 0),
        (mtdvob = 0),
        (ftdotcount = 0),
        (mtdotcount = 0),
        (cogsftdotcount = 0),
        (cogsmtdotcount = 0),
        (ahcftdbreakup = 0),
        (ahcmtdbreakup = 0);
    });
  }

  ahcGroups.forEach(group => {
    ahctempObj[group] = {};
    ahcgroupedBranches[group].forEach(branch => {
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          ftdpha += element.pharmacy;
          ftdopt += element.opticals;
          ftdlab += element.laboratory;
          ftdot += element.surgery;
          ftd += element.ftd;
        }
      );
      (ahctempObj[group].ftdpharev = ftdpha),
        (ahctempObj[group].ftdoptrev = ftdopt),
        (ahctempObj[group].ftdlabrev = ftdlab),
        (ahctempObj[group].ftdotrev = ftdot),
        (ahctempObj[group].ftdrev = ftd);
      _.filter(dbres2, { branch: branch }).forEach(element => {
        mtdpha += element.pharmacy;
        mtdopt += element.opticals;
        mtdlab += element.laboratory;
        mtdot += element.surgery;
        mtd += element.ftd;
      });
      (ahctempObj[group].mtdpharev = mtdpha),
        (ahctempObj[group].mtdoptrev = mtdopt),
        (ahctempObj[group].mtdlabrev = mtdlab),
        (ahctempObj[group].mtdotrev = mtdot),
        (ahctempObj[group].mtdrev = mtd),
        (ahctempObj[group].branch = group);
    });
    (ftdpha = 0),
      (ftdopt = 0),
      (ftdlab = 0),
      (ftdot = 0),
      (ftd = 0),
      (mtdpha = 0),
      (mtdopt = 0),
      (mtdlab = 0),
      (mtdot = 0),
      (mtd = 0),
      (ftdrev = 0),
      (mtdrev = 0);
  });
  return { aeh: aehtempObj, ahc: ahctempObj, branchwise: branchObj };
};

let cogsPercent = (cogs, revenue) => {
  if ((cogs !== 0 && revenue !== 0) || (cogs === 0 && revenue !== 0)) {
    return (cogs / revenue) * 100;
  } else if (revenue === 0 || (cogs === 0 && revenue === 0)) {
    return 0;
  }
};


exports.formation = function(argDetails,fdate){	
	//console.log(argDetails);
	//process.exit(1);
	
	var brachdetails = argDetails.branches;
	var OTRevenueDetails = argDetails.montlyOT;
	var cattrackCogs = argDetails.montlyCattractCogs;
	var refractiveCogs = argDetails.montlyRefractiveCogs;
	var vitreoRetinal = argDetails.montlyVitreoRetinalCogs;
	
	
	var groupCatract = '';
	var groupRefertactive = '';
	var groupVitroRetinal = '';
	//console.log(OTRevenueDetails);
	
	groupCatract = _.filter(OTRevenueDetails, { group: 'CATARACT' });
	groupRefertactive = _.filter(OTRevenueDetails, { group: 'REFRACTIVE' });
	groupVitroRetinal = _.filter(OTRevenueDetails, { group: 'VITREO RETINAL' });
	
	//groupCatractCogs = _.filter(cattrackCogs, { group: 'CATARACT' });
	//groupRefertactiveCogs = _.filter(refractiveCogs, { group: 'Refractive' });
	//groupVitroRetinalCogs = _.filter(vitreoRetinal, { group: 'Vitreo Retinal' });
	
	//console.log(groupCatract);
	//console.log(groupRefertactive);
	//console.log(groupRefertactive);
	
	var tempObject = {};	
	for (var key in brachdetails) {
		 var branch = '';
	     var branchName = '';
		 branch = brachdetails[key]['code'];
		 branchName = brachdetails[key]['branch'];
		 var mtdCattraackt = 0;
		 var ftdCattraackt = 0;
		 var mtdRefertactive = 0;
		 var ftdRefertactive = 0;
		 var mtdRefertactive = 0;
		 var ftdRefertactive = 0;
		 var mtdVitroRetinal = 0;
		 var ftdVitroRetinal = 0;
		 var mtdCatractCogs = 0;
		 var ftdCatractCogs = 0;
		 var mtdRefertactiveCogs = 0;
		 var ftdRefertactiveCogs = 0;
		 var mtdVitroRetinalCogs = 0;
		 var ftdVitroRetinalCogs = 0;
		   _.filter(groupCatract, { branch: branch }).forEach(element => {
			   mtdCattraackt=mtdCattraackt+1;
			
		  });
		   _.filter(groupCatract, { branch: branch, trans_date : fdate }).forEach(element => {
			   ftdCattraackt=ftdCattraackt+1;
			
		  }); 
		  
		  
		   _.filter(groupRefertactive, { branch: branch }).forEach(element => {
			   mtdRefertactive=mtdRefertactive+1;
			
		  });
		  
		   _.filter(groupRefertactive, { branch: branch, trans_date : fdate}).forEach(element => {
			   ftdRefertactive=ftdRefertactive+1;
			
		  });  
		  
		  _.filter(groupVitroRetinal, { branch: branch }).forEach(element => {
			   mtdVitroRetinal=mtdVitroRetinal+1;
			
		  });
		  
		   _.filter(groupVitroRetinal, { branch: branch, trans_date : fdate}).forEach(element => {
			   ftdVitroRetinal=ftdVitroRetinal+1;
			
		  });
		  
		  _.filter(cattrackCogs, { branch: branch }).forEach(element => {
			   mtdCatractCogs=mtdCatractCogs+1;
			
		  });
		  
		   _.filter(cattrackCogs, { branch: branch, trans_date : fdate}).forEach(element => {
			   ftdCatractCogs=ftdCatractCogs+1;
			
		  });
		  
		  
		   _.filter(refractiveCogs, { branch: branch }).forEach(element => {
			   mtdRefertactiveCogs=mtdRefertactiveCogs+1;
			
		  });
		  
		   _.filter(refractiveCogs, { branch: branch, trans_date : fdate}).forEach(element => {
			   ftdRefertactiveCogs=ftdRefertactiveCogs+1;
			
		  });
		  
		  
		  _.filter(vitreoRetinal, { branch: branch }).forEach(element => {
			   mtdVitroRetinalCogs=mtdVitroRetinalCogs+1;
			
		  });
		  
		   _.filter(vitreoRetinal, { branch: branch, trans_date : fdate}).forEach(element => {
			   ftdVitroRetinalCogs=ftdVitroRetinalCogs+1;
			
		  });
		  tempObject[branch] = {'branch':branchName,'mtdCattraackt':mtdCattraackt,'ftdCattraackt':ftdCattraackt,'mtdRefertactive':mtdRefertactive,'ftdRefertactive':ftdRefertactive,'mtdVitroRetinal':mtdVitroRetinal,'ftdVitroRetinal':ftdVitroRetinal,		  
		  'mtdCatractCogs':mtdCatractCogs,
		  'ftdCatractCogs':ftdCatractCogs,		  
		  'mtdRefertactiveCogs':mtdRefertactiveCogs,
		  'ftdRefertactiveCogs':ftdRefertactiveCogs,
		  'mtdVitroRetinalCogs':mtdVitroRetinalCogs,
		  'ftdVitroRetinalCogs':ftdVitroRetinalCogs};
		  
		  console.log(tempObject);
		  
		
		
	}
	return tempObject;
	
	
}


exports.newopdNative = async (
  dbres2,
  branches,
  ftddate,
  lastyearopd
  
) => {
  let entityWise = await filterEntityOpd(dbres2, ftddate,lastyearopd);
  let groupWise = await filterGroupwiseOPD(
    entityWise.aeharr,
    entityWise.ahcarr,
    dbres2,
    branches,
    ftddate,
	lastyearopd
  );
  
  
  return {
	group: entityWise.group,
    alin: entityWise.alin,
    aeh: entityWise.aeh,
    ahc: entityWise.ahc,
	ohc: entityWise.ohc,
    aehgroup: groupWise.aeh,
    ahcgroup: groupWise.ahc,
	ohcgroup: groupWise.ohc,
    branchwise: groupWise.branchwise
  };
};



let filterEntityOpd = async (dbres2, ftddate,lastyearopd) => {
  let tempObj = {},
    opd = 0,
    opdlastyear = 0,
    aeharr = [],
    aehrevarr = [],
	aehrevarrlastyear = [],
    ahcrevarr = [],
	ahcrevarrlastyear = [],
    ahcarr = [],
	ohcrevarr=[],
	ohcrevarrlastyear=[],
	
    alin = {};
  aehrevarr = _.filter(dbres2, { entity: "AEH" });
  
  
  aehrevarrlastyear = _.filter(lastyearopd, { entity: "AEH" });
  _.filter(aehrevarr, { trans_date: ftddate }).forEach(element => {
    opd += element.ftd_count;
    
  });
  tempObj.AEH = {
    branch: "AEH",
    ftdopdrev: opd
  };
  (opd = 0),(opdlastyear = 0);
  aehrevarr.forEach(element => {
    opd += element.ftd_count;

  });
  
  
  aehrevarrlastyear.forEach(element => {
    opdlastyear += element.ftd_count;

  });
  
  //opdmtdpercentage =0;
  //opdmtdpercentage = (opd-opdlastyear)/ opdlastyear;
  (tempObj.AEH.mtdopdrev = opd);
  (tempObj.AEH.mtdopdrevlastyear = opdlastyear);
  (tempObj.AEH.mtdopdpercentage = Math.round(((opd-opdlastyear)/ opdlastyear)*100));
  (opd = 0),(opdlastyear = 0);
  ahcrevarr = _.filter(dbres2, { entity: "AHC" });
  
  ahcrevarrlastyear = _.filter(lastyearopd, { entity: "AHC" });
  _.filter(ahcrevarr, { trans_date: ftddate }).forEach(element => {
    opd += element.ftd_count;
   
  });
  tempObj.AHC = {
    branch: "AHC",
    ftdopdrev: opd
  };
  (opd = 0),(opdlastyear);
  ahcrevarr.forEach(element => {
    opd += element.ftd_count;
    
  });
  ahcrevarrlastyear.forEach(element => {
    opdlastyear += element.ftd_count;
    
  });
   //opdmtdpercentage =0;
  //opdmtdpercentage = (opd-opdlastyear)/ opdlastyear;
  
  
  
  (tempObj.AHC.mtdopdrev = opd);
  (tempObj.AHC.mtdopdrevlastyear = opdlastyear);
  (tempObj.AHC.mtdopdpercentage = Math.round(((opd-opdlastyear)/ opdlastyear)*100));
  /*for (let key in tempObj.AEH) {
    alin[key] = tempObj.AEH[key];
  }
  for (let key in tempObj.AHC) {
    alin["branch"] = "All India";
    alin[key] += tempObj.AHC[key];
  }*/
  
  (opd = 0),(opdlastyear = 0);
  ohcrevarr = _.filter(dbres2, { entity: "OHC" });
  
  ohcrevarrlastyear = _.filter(lastyearopd, { entity: "OHC" });
  _.filter(ohcrevarr, { trans_date: ftddate }).forEach(element => {
    opd += element.ftd_count;
   
  });
  tempObj.OHC = {
    branch: "OHC",
    ftdopdrev: opd
  };
  (opd = 0),(opdlastyear);
  ohcrevarr.forEach(element => {
    opd += element.ftd_count;
    
  });
  ohcrevarrlastyear.forEach(element => {
    opdlastyear += element.ftd_count;
    
  });
  
  (tempObj.OHC.mtdopdrev = opd);
  (tempObj.OHC.mtdopdrevlastyear = opdlastyear);
  (tempObj.OHC.mtdopdpercentage = Math.round(((opd-opdlastyear)/ opdlastyear)*100));
  alin["branch"] = "All India";  
  alin['ftdopdrev'] =  tempObj.AEH['ftdopdrev']+tempObj.AHC['ftdopdrev']; 
  alin['mtdopdrev'] =  tempObj.AEH['mtdopdrev']+tempObj.AHC['mtdopdrev']; 
  alin['mtdopdrevlastyear'] =  tempObj.AEH['mtdopdrevlastyear']+tempObj.AHC['mtdopdrevlastyear'];
  alin['mtdopdpercentage'] = Math.round(((alin['mtdopdrev']-alin['mtdopdrevlastyear'])/alin['mtdopdrevlastyear'])*100);
  
  let gropuftd=0,
  gropumtd=0,
  groupmtdlastyear=0,
  groupmtdpercentage=0;
  
  gropuftd = tempObj.AEH['ftdopdrev']+tempObj.AHC['ftdopdrev']+tempObj.OHC['ftdopdrev'];
  gropumtd = tempObj.AEH['mtdopdrev']+tempObj.AHC['mtdopdrev']+tempObj.OHC['mtdopdrev'];
  groupmtdlastyear = tempObj.AEH['mtdopdrevlastyear']+tempObj.AHC['mtdopdrevlastyear']+tempObj.OHC['mtdopdrevlastyear'];
  groupmtdpercentage = Math.round(((gropumtd-groupmtdlastyear)/groupmtdlastyear)*100);
  
  group = {};
  
  group["branch"] = "Group";  
  group['ftdopdrev'] =  gropuftd; 
  group['mtdopdrev'] =  gropumtd; 
  group['mtdopdrevlastyear'] =  groupmtdlastyear;
  group['mtdopdpercentage'] = groupmtdpercentage;
  
  return {
	group : group,
    alin :alin,
    aeharr: aeharr,
    ahcarr: ahcarr,
    aeh: tempObj.AEH,
    ahc: tempObj.AHC,
	ohc: tempObj.OHC
  };
};





let filterGroupwiseOPD = async (
  aeh,
  ahc,
  dbres2,
  branches,
  ftddate,
  lastyearopd
) => {
  let ftdopd = 0,    
    mtdopd = 0,
    mtdopdlastyear = 0,
    mtdopdpercentage = 0,    
    aehtempObj = {},
    ahctempObj = {},
	ohctempObj = {},
    branchObj = {}, 
    branchName = null,
    ftdopdrev = 0,
    mtdopdrev = 0, 
    mtdopdrevlastyear = 0, 	
    code = null;
    
   
  let aehGroups = [
    "Chennai Main Hospital",
    "Chennai Branches",
    "Kanchi + Vellore",
    "Kum + Ney + Vil",
    "Dha + Salem + Krish",
    "Erode + Hosur",
    "Jaipur",
    "Madurai KK Nagar"
  ];
  
  let ohcGroups = [
    "Madagascar",
    "Mozambique",
    "Nigeria",
    "Rwanda",
    "Mauritius",
    "Zambia",
    "Ghana",
    "Nairobi",
    "Uganda",
	"Tanzania"
  ];
  
  
  
  
  
  
  
  let ahcGroups = [
    "Chennai branches",
    "Tirunelveli",
	"Coimbatore",
    "Tuticorin + Madurai",
    "Trichy",
    "Thanjavur",
    "Tiruppur",
    "Andaman",
    "Karnataka",
    "Banglore",
	"Maharashtra",
    "Hubli + Mysore",
    "Telangana",
    "Hyderabad",
    "Andhra Pradesh",
    "Rest of India(incl. Jaipur)",
    "Kerala",
    "Kolkata",    
    "Ahmedabad",
    "Madhya Pradesh",
    "Odisha"
    //'Ambattur'
  ];
  let aehgroupedBranches = {
    "Chennai Main Hospital": ["CMH"],
    "Chennai Branches": [
      "ANN",
      "ASN",
      "AVD",
      "NLR",
      "PMB",
      "PRR",
      "TLR",
      "TRC",
      "VLC"
    ],
    "Kanchi + Vellore": ["KNP", "VLR"],
    "Kum + Ney + Vil": ["KBK", "NVL", "VPM"],
    "Dha + Salem + Krish": ["DHA", "SLM", "KSN"],
    "Erode + Hosur": ["ERD", "HSR"],
    Jaipur: ["JPR"],
    "Madurai KK Nagar": ["MDU"]
  };
  let ahcgroupedBranches = {
    "Chennai branches": ["TBM", "ADY", "EGM", "MGP", "NWP","AMB","TVT"],
    Pondycherry: ["PDY"],
    Tirunelveli: ["TVL"],
	Coimbatore: ["CMB"],
    "Tuticorin + Madurai": ["TCN", "APM"],
    Trichy: ["TRI"],
    Thanjavur: ["TNJ"],
    Tiruppur: ["TPR"],
    Andaman: ["AMN"],
    Karnataka: [
      "BMH",
	  
      "WFD",
      "KML",
      "CLR",
      "INR",
      "PNR",
      "YLK",
      "SVR",
      "BSK",
      "RRN",
	  "RJN",
      "HUB",
      "MCC",
      "MYS",

    ],
    Banglore: ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK","SVR","BSK","RRN","RJN"],
    "Hubli + Mysore": ["HUB", "MCC", "MYS"],
	Maharashtra :["VSH", "PUN", "HDP","CMR", "KTD"],
    Telangana: ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD","MPM","GCB"],
    Hyderabad: ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD","MPM","GCB"],
    "Andhra Pradesh": ["VMH", "NEL", "GUN", "TPT", "RAJ"],
    "Rest of India(incl. Jaipur)": [
      "TVM",
	  "KTM",
      "KOL",
      "KAS",
	  "VSH",
      "PUN",
	  "HDP",
      "AHM",      
	  "JWS",
	  "APR",
	  "ATA",
	  "KWA",
      "CTK",
      "BHU",
      "JPR"
    ],
    Kerala: ["TVM","KTM"],
    Kolkata: ["KOL", "KAS"],
    Ahmedabad: ["AHM"],
    "Madhya Pradesh": ["JWS","APR","ATA","KWA"],
    Odisha: ["CTK", "BHU"]

    //,Ambattur : ['AMB']
  };
  
  
  let ohcgroupedBranches = {
	"Madagascar" :["MDR"],
    "Mozambique":["MZQ","BRA"],
    "Nigeria":["NGA"],
    "Rwanda":["RWD"],
    "Mauritius":["EBN","FLQ","GDL"],    
	"Zambia":["ZMB"],
    "Ghana":["GHA"],
    "Nairobi":["NAB"],
    "Uganda":["UGD"],
	"Tanzania":["TZA"]
  };
  
  aehGroups.forEach(group => {
    aehtempObj[group] = {};
    aehgroupedBranches[group].forEach(branch => {
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          ftdopd += element.ftd_count;
          
        }
      );
      (aehtempObj[group].ftdopdrev = ftdopd);
        
      _.filter(dbres2, { branch: branch }).forEach(element => {
        mtdopd += element.ftd_count;
       
      });
	  
	  
	   _.filter(lastyearopd, { branch: branch }).forEach(element => {
        mtdopdlastyear += element.ftd_count;
       
      });
	  mtdopdpercentage = Math.round(((mtdopd-mtdopdlastyear)/mtdopdlastyear)*100);
	  
	  
	  
      (aehtempObj[group].mtdopdrev = mtdopd),
	  (aehtempObj[group].mtdopdrevlastyear = mtdopdlastyear),
	  (aehtempObj[group].mtdopdpercentage = mtdopdpercentage),
	  (aehtempObj[group].branch = group);
    });
    (ftdopd = 0),
    (ftdopdrev = 0),
	(mtdopdrev = 0),	
      (mtdopd = 0),
	  (mtdopdrevlastyear = 0),	
      (mtdopdlastyear = 0),
	  (mtdopdpercentage = 0);
      
  });
  for (let key in aehgroupedBranches) {
    branchObj[key] = [];
    aehgroupedBranches[key].forEach(branch => {
      _.filter(branches, { code: branch }).forEach(element => {
        (branchName = element.branch), (code = element.code);
      });
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          
            (ftdopdrev = element.ftd_count);
        }
      );
      _.filter(dbres2, { branch: branch }).forEach(element => {
        
          (mtdopdrev += element.ftd_count);
      });
	  
	  
	  _.filter(lastyearopd, { branch: branch }).forEach(element => {
        
          (mtdopdrevlastyear += element.ftd_count);
      });
      
      mtdopdpercentage = Math.round(((mtdopdrev-mtdopdrevlastyear)/mtdopdrevlastyear)*100);
	  
      
      branchObj[key].push({
        branch: branchName,
        code: code,       
        ftdopdrev: ftdopdrev,        
        mtdopdrev: mtdopdrev,
		mtdopdrevlastyear: mtdopdrevlastyear,
        mtdopdpercentage:mtdopdpercentage
      });
      (ftdopd = 0),        
        (mtdopd = 0),
		(ftdopdrev = 0),
	    (mtdopdrev = 0),
		(mtdopdrevlastyear = 0),	
        (mtdopdlastyear = 0),
		(mtdopdpercentage = 0),
        (code = null);
     });
  }
  for (let key in ahcgroupedBranches) {
    branchObj[key] = [];
    ahcgroupedBranches[key].forEach(branch => {
      _.filter(branches, { code: branch }).forEach(element => {
        (branchName = element.branch), (code = element.code);
      });
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
         
            (ftdopdrev = element.ftd_count);
            
        }
      );
      _.filter(dbres2, { branch: branch }).forEach(element => {        
          (mtdopdrev += element.ftd_count);
          
      });
	  
	  _.filter(lastyearopd, { branch: branch }).forEach(element => {        
          (mtdopdrevlastyear += element.ftd_count);
          
      });
     
      mtdopdpercentage = Math.round(((mtdopdrev-mtdopdrevlastyear)/mtdopdrevlastyear)*100);
	  
      branchObj[key].push({
		branch: branchName,
        code: code,       
        ftdopdrev: ftdopdrev,        
        mtdopdrev: mtdopdrev,
		mtdopdrevlastyear: mtdopdrevlastyear,
		mtdopdpercentage : mtdopdpercentage
        
      });
      (ftdopd = 0),
      (ftdopdrev = 0),
	  (mtdopdrev = 0),    
      (mtdopd = 0),
	  (mtdopdrevlastyear = 0),
      (mtdopdpercentage = 0),	  
       (mtdopdlastyear = 0);
        
    });
  }

  ahcGroups.forEach(group => {
    ahctempObj[group] = {};
    ahcgroupedBranches[group].forEach(branch => {
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          ftdopd += element.ftd_count;
          
        }
      );
      (ahctempObj[group].ftdopdrev = ftdopd);
        
      _.filter(dbres2, { branch: branch }).forEach(element => {
        mtdopd += element.ftd_count;
       
      });
	  
	  
	   _.filter(lastyearopd, { branch: branch }).forEach(element => {
        mtdopdlastyear += element.ftd_count;
       
      });
	   mtdopdpercentage = Math.round(((mtdopd-mtdopdlastyear)/mtdopdlastyear)*100);
	  
      (ahctempObj[group].mtdopdrev = mtdopd),
	  (ahctempObj[group].mtdopdrevlastyear = mtdopdlastyear),
	   (ahctempObj[group].mtdopdpercentage = mtdopdpercentage),
	  (ahctempObj[group].branch = group);
    });
    (ftdopd = 0),     
      (mtdopd = 0),
	  (ftdopdrev = 0),
	(mtdopdrev = 0),
	(mtdopdrevlastyear = 0),	
    (mtdopdlastyear = 0);
  });
  
  
  
  
    ohcGroups.forEach(group => {
    ohctempObj[group] = {};
    ohcgroupedBranches[group].forEach(branch => {
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          ftdopd += element.ftd_count;
          
        }
      );
      (ohctempObj[group].ftdopdrev = ftdopd);
        
      _.filter(dbres2, { branch: branch }).forEach(element => {
        mtdopd += element.ftd_count;
       
      });
	  
	  
	   _.filter(lastyearopd, { branch: branch }).forEach(element => {
        mtdopdlastyear += element.ftd_count;
       
      });
	  mtdopdpercentage = Math.round(((mtdopd-mtdopdlastyear)/mtdopdlastyear)*100);
	  
	  
	  
      (ohctempObj[group].mtdopdrev = mtdopd),
	  (ohctempObj[group].mtdopdrevlastyear = mtdopdlastyear),
	  (ohctempObj[group].mtdopdpercentage = mtdopdpercentage),
	  (ohctempObj[group].branch = group);
    });
    (ftdopd = 0),
    (ftdopdrev = 0),
	(mtdopdrev = 0),	
      (mtdopd = 0),
	  (mtdopdrevlastyear = 0),	
      (mtdopdlastyear = 0),
	  (mtdopdpercentage = 0);
      
  });
  
  
    for (let key in ohcgroupedBranches) {
    branchObj[key] = [];
    ohcgroupedBranches[key].forEach(branch => {
      _.filter(branches, { code: branch }).forEach(element => {
        (branchName = element.branch), (code = element.code);
      });
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          
            (ftdopdrev = element.ftd_count);
        }
      );
      _.filter(dbres2, { branch: branch }).forEach(element => {
        
          (mtdopdrev += element.ftd_count);
      });
	  
	  
	  _.filter(lastyearopd, { branch: branch }).forEach(element => {
        
          (mtdopdrevlastyear += element.ftd_count);
      });
      
      mtdopdpercentage = Math.round(((mtdopdrev-mtdopdrevlastyear)/mtdopdrevlastyear)*100);
	  
      
      branchObj[key].push({
        branch: branchName,
        code: code,       
        ftdopdrev: ftdopdrev,        
        mtdopdrev: mtdopdrev,
		mtdopdrevlastyear: mtdopdrevlastyear,
        mtdopdpercentage:mtdopdpercentage
      });
      (ftdopd = 0),        
        (mtdopd = 0),
		(ftdopdrev = 0),
	    (mtdopdrev = 0),
		(mtdopdrevlastyear = 0),	
        (mtdopdlastyear = 0),
		(mtdopdpercentage = 0),
        (code = null);
     });
  }
  
  
  
  
  return { aeh: aehtempObj, ahc: ahctempObj,ohc: ohctempObj, branchwise: branchObj };
};







exports.newopdnormal = async (
  newopdres,
  newopdreslastyear,
  individual,
  group,
  branches,
  ftddate
) => {
  let branchWise = [],
    seperatedBranchWise = [],
    groupWise = [], 
    tempObj = {},  
    branchname = null;
  let groupBranchArr = [],
    branchHeadings = [],      
    ftdopdrev = 0;
	ftdopdrevlastyear = 0;
  let shouldRemove = [],
    mappings = [],
    mtdopdrev = 0;
	mtdopdrevlastyear = 0;
	mtdopdpercentage =0;
  if (group.length !== 0) {
    group.forEach(element => {
      if (element.split("=")[1].length === 3) {
        groupBranchArr.push(element.split("=")[1]);
        shouldRemove.push(element.split("=")[1]);
      } else {
        groupBranchArr.push(element.split("=")[1].split("+"));
      }
      branchHeadings.push(element.split("=")[0]);
    });
  }
  group.forEach(element => {
    let head = element.split("=")[0];
    let group = element.split("=")[1];
    let obj = {};
    obj["heading"] = head;
    obj["branches"] = group;
    mappings.push(obj);
  });
  groupBranchArr.forEach(group => {
    if (typeof group === "string") {
      group = [group];
    }
    group.forEach(branch => {
      let tempFilterrev = _.filter(newopdres, {
        branch: branch,
        trans_date: ftddate
      });
	  
	  
	  
      if (tempFilterrev.length !== 0) {
        tempFilterrev.forEach(element => {
        
          (ftdopdrev += element.ftd_count);
        });
      } else {
        
        (ftdopdrev += 0);
      }
      (tempObj.branch = branch),        
        (tempObj.ftdopdrev = ftdopdrev);

      _.filter(newopdres, { branch: branch }).forEach(element => {
      
        (mtdopdrev += element.ftd_count);
      });
	  
	  
	   _.filter(newopdreslastyear, { branch: branch }).forEach(element => {
      
        (mtdopdrevlastyear += element.ftd_count);
      });
	  
	  mtdopdpercentage =  Math.round(((mtdopdrev-mtdopdrevlastyear)/mtdopdrevlastyear)*100);
      
        (tempObj.mtdopdrev = mtdopdrev),
		(tempObj.mtdopdrevlastyear = mtdopdrevlastyear),
		(tempObj.mtdopdpercentage = mtdopdpercentage);
    });
    groupWise.push(tempObj);
    (tempObj = {}),
     
      (mtdopdrev = 0),
      (mtdopdrevlastyear = 0), 
      (mtdopdpercentage=0),	  
      (ftdopdrev = 0);
  });

  for (let i = 0; i < branchHeadings.length; i++) {
    groupWise[i].branch = branchHeadings[i];
  }

  individual.forEach(branch => {
    _.filter(branches, { code: branch }).forEach(
      ele => (branchname = ele.branch)
    );
    if (!shouldRemove.includes(branch)) {
      let tempFileterev = _.filter(newopdres, {
        branch: branch,
        trans_date: ftddate
      });
      if (tempFileterev.length !== 0) {
        tempFileterev.forEach(element => {
          (tempObj.branch = branchname),
            (tempObj.code = branch),
            
            (tempObj["ftdopdrev"] = element.ftd_count);
        });
      } else {
        (tempObj.branch = branchname),
          (tempObj.code = branch),
          
          (tempObj["ftdopdrev"] = 0);
      }
    
      _.filter(newopdres, { branch: branch }).forEach(element => {
        
          (mtdopdrev += element.ftd_count);
      });
	  
	  _.filter(newopdreslastyear, { branch: branch }).forEach(element => {
        
          (mtdopdrevlastyear += element.ftd_count);
      });
	  mtdopdpercentage = Math.round(((mtdopdrev-mtdopdrevlastyear)/mtdopdrevlastyear)*100);
      
        (tempObj.mtdopdrev = mtdopdrev),
		(tempObj.mtdopdrevlastyear = mtdopdrevlastyear),
		(tempObj.mtdopdpercentage = mtdopdpercentage);
      branchWise.push(tempObj);
      (tempObj = {}),
        
        (mtdopdrev = 0),
		(mtdopdrevlastyear = 0),
		(mtdopdpercentage=0);
    } else {
      let tempFileterev = _.filter(newopdres, {
        branch: branch,
        trans_date: ftddate
      });
      if (tempFileterev.length !== 0) {
        tempFileterev.forEach(element => {
          (tempObj.branch = branchname),
            (tempObj.code = branch),            
            (tempObj["ftdopdrev"] = element.ftd_count);
        });
      } else {
        (tempObj.branch = branchname),
          (tempObj.code = branch),        
          (tempObj["ftdopdrev"] = 0);
      }
     

      _.filter(newopdres, { branch: branch }).forEach(element => {        
          (mtdopdrev += element.ftd_count);
      });
	  
	   _.filter(newopdreslastyear, { branch: branch }).forEach(element => {        
          (mtdopdrevlastyear += element.ftd_count);
      });
	  mtdopdpercentage = Math.round(((mtdopdrev-mtdopdrevlastyear)/mtdopdrevlastyear)*100);
      
        (tempObj.mtdopdrev = mtdopdrev),
		(tempObj.mtdopdrevlastyear = mtdopdrevlastyear);
		(tempObj.mtdopdpercentage = mtdopdpercentage);
      seperatedBranchWise.push(tempObj);
      (tempObj = {}),
        
        (mtdopdrev = 0),
		(mtdopdrevlastyear = 0),
		(mtdopdpercentage=0);
    }
  });
  return {
    group: groupWise,
    branch: branchWise,
    mappings: mappings,
    specialBranch: _.uniqBy(seperatedBranchWise, "code")
  };
};




exports.newopticals = async (dbresoptical,branches,ftddate,dbreslastyearoptical
)=>{
 let groupwise = await filterGroupwiseoptical(dbresoptical,ftddate,dbreslastyearoptical);
 let branchwise= await filterBranchwiseoptical(dbresoptical,ftddate,dbreslastyearoptical,branches)
return{
group:groupwise.group,
alin:groupwise.alin,
branch:branchwise.branch
};
};

let filterGroupwiseoptical= async(dbresoptical,ftddate,dbreslastyearoptical)=>{
  let tempObj={},opt=0,
  targetmtdopt=0,optlastyear=0,
  mtdopt=0,grouptempObj={},
  alin={};


let totalgroup=[
  "Chennai",
  "ROTN",
  "Karnataka",
  "Maharashtra",
  "Hyderabad",
  "AP",
  "Kolkata",
  "Odisha",
  "ROI"
];

let totalgroupbranches={
    "Chennai":["ADY","AMB","ANN","ASN","AVD","CMH","EGM","MGP",
    "NLR","NWP","PMB","PRR","TBM","TLR","TRC","TVT","VLC"],
    Karnataka:["BMH","BSK","CLR","HUB","INR","KML","MCC","MYS",
                "PNR","RJN","RRN","SVR","WFD","YLK" ],
    Maharashtra:["VSH","PUN","HDP","CMR", "KTD"],
    ROTN:["APM","CMB","DHA","ERD","HSR","KBK","KNP","KSN",
          "MDU","NVL","PDY","SLM","TCN","TNJ","TPR","TRI",
            "TVL","VLR","VPM"],
    ROI:["TVM","JPR","AHM"],
    Odisha: ["CTK", "BHU"],
    Kolkata: ["KOL", "KAS"],
    Hyderabad:["DNR","HIM","HMH","MDA","MPM","GCB","SBD","SNR"],
    AP:["GUN","NEL","RAJ","TPT","VMH"]

};

totalgroup.forEach(group =>{
  grouptempObj[group]={};
  (opt=0),(mtdopt=0),(optlastyear=0),(targetmtdopt=0);
  totalgroupbranches[group].forEach(branch=>{

    // _.filter(dbresoptical,{branchcode: branch ,trans_date:ftddate})
    // .forEach(element =>{opt +=element.ftd;});
    // (grouptempObj[group].ftdoptrev=Math.round(opt));
    //
    // _.filter(dbresoptical,{branchcode: branch ,trans_date:ftddate})
    // .forEach(element =>{targetmtdopt+=element.targetamount;});
    // (grouptempObj[group].targetmtdrev=Math.round(targetmtdopt));

    _.filter(dbresoptical,{branchcode: branch})
    .forEach(element =>{mtdopt +=element.ftd;});
  (grouptempObj[group].mtdoptrev=Math.round(mtdopt));

_.filter(dbreslastyearoptical,{branchcode: branch})
.forEach(element =>{optlastyear +=element.ftd;});
(grouptempObj[group].lstoptrev=Math.round(optlastyear));

    _.filter(dbresoptical,{branchcode: branch})
    .forEach(element =>{targetmtdopt +=parseInt(element.targetamount);});
    (grouptempObj[group].targetmtdrev=Math.round(targetmtdopt))

  });// end of foreach --> branch

  (grouptempObj[group].mtdoptperc=Math.round(((grouptempObj[group].mtdoptrev)/(grouptempObj[group].lstoptrev)-1)*100));
// total percentage calc for region
(grouptempObj[group].mtdoptpercachieved)=Math.round(((grouptempObj[group].mtdoptrev)/(grouptempObj[group].targetmtdrev))*100);
//target achieved
//(grouptempObj[group].targetachieved=Math.round((()/())*100));
(grouptempObj[group].groupwise=group);
//console.log(group);
});

alin['groupwise']="All India";
// alin['ftdoptrev']=grouptempObj['Chennai'].ftdoptrev+grouptempObj['ROTN'].ftdoptrev+grouptempObj['Karnataka'].ftdoptrev
//                           +grouptempObj['ROI'].ftdoptrev+grouptempObj['Odisha'].ftdoptrev+grouptempObj['Kolkata'].ftdoptrev
//                           +grouptempObj['Hyderabad'].ftdoptrev+grouptempObj['AP'].ftdoptrev;
alin['mtdoptrev']=grouptempObj['Chennai'].mtdoptrev+grouptempObj['ROTN'].mtdoptrev+grouptempObj['Karnataka'].mtdoptrev
                          +grouptempObj['Maharashtra'].mtdoptrev
                          +grouptempObj['ROI'].mtdoptrev+grouptempObj['Odisha'].mtdoptrev+grouptempObj['Kolkata'].mtdoptrev
                          +grouptempObj['Hyderabad'].mtdoptrev+grouptempObj['AP'].mtdoptrev;
alin['lstoptrev']=grouptempObj['Chennai'].lstoptrev+grouptempObj['ROTN'].lstoptrev+grouptempObj['Karnataka'].lstoptrev
                        +grouptempObj['Maharashtra'].lstoptrev
                          +grouptempObj['ROI'].lstoptrev+grouptempObj['Odisha'].lstoptrev+grouptempObj['Kolkata'].lstoptrev
                          +grouptempObj['Hyderabad'].lstoptrev+grouptempObj['AP'].lstoptrev;
alin['targetmtdrev']=grouptempObj['Chennai'].targetmtdrev+grouptempObj['ROTN'].targetmtdrev+grouptempObj['Karnataka'].targetmtdrev
                          +grouptempObj['Maharashtra'].targetmtdrev
                          +grouptempObj['ROI'].targetmtdrev+grouptempObj['Odisha'].targetmtdrev+grouptempObj['Kolkata'].targetmtdrev
                          +grouptempObj['Hyderabad'].targetmtdrev+grouptempObj['AP'].targetmtdrev;

alin['mtdoptperc']=Math.round((((alin['mtdoptrev'])/(alin['lstoptrev']))-1)*100);
// mrdpercentage for all india
alin['mtdoptpercachieved']=Math.round(((alin['mtdoptrev'])/(alin['targetmtdrev']))*100);

console.log(alin);

console.log(grouptempObj);
return{
  alin : alin,
  group :grouptempObj
};
};

let filterBranchwiseoptical= async(dbresoptical,ftddate,dbreslastyearoptical,branches)=>{
  let opt=0,targetmtdopt=0,mtdopt=0,optlastyear=0,
  //targetmtdopt=0,
  mtdoptpercentage=0,
  targetachieved=0,
  grouptempObj={},branchObj={},
  branchName=null,ftdoptrev=0,mtdoptrev=0,
  mtdoptrevlastyear=0,code=null;
  let totalgroup=[
    "Chennai",
    "ROTN",
    "Karnataka",
    "Maharashtra",
    "Hyderabad",
    "AP",
    "Kolkata",
    "Odisha",
    "ROI"
  ];

  let totalgroupbranches={
      "Chennai":["ADY","AMB","ANN","ASN","AVD","CMH","EGM","MGP",
      "NLR","NWP","PMB","PRR","TBM","TLR","TRC","TVT","VLC"],
      Karnataka:["BMH","BSK","CLR","HUB","INR","KML","MCC","MYS",
                  "PNR","RJN","RRN","SVR","WFD","YLK" ],
      Maharashtra:["VSH","PUN","HDP","CMR", "KTD"],
      ROTN:["APM","CMB","DHA","ERD","HSR","KBK","KNP","KSN",
            "MDU","NVL","PDY","SLM","TCN","TNJ","TPR","TRI",
            "TVL","VLR","VPM"],
      ROI:["TVM","JPR","AHM"],
      Odisha: ["CTK", "BHU"],
      Kolkata: ["KOL", "KAS"],
      Hyderabad:["DNR","HIM","HMH","MDA","MPM","GCB","SBD","SNR"],
      AP:["GUN","NEL","RAJ","TPT","VMH"]

  };

for(let key in totalgroupbranches)
{
//   branchObj[key] = [];
branchObj[key]=[];
 totalgroupbranches[key].forEach(branch=>{

   _.filter(branches,{code: branch})
   .forEach(element =>{(branchName = element.branch), (code = element.code)});

   _.filter(dbresoptical,{branchcode: branch})
   .forEach(element =>{targetmtdopt +=element.targetamount});

   // _.filter(dbresoptical,{branchcode: branch,trans_date: ftddate})
   // .forEach(element =>{opt +=element.ftd});

   _.filter(dbresoptical,{branchcode: branch})
   .forEach(element =>{mtdopt +=element.ftd});

   _.filter(dbreslastyearoptical,{branchcode: branch})
   .forEach(element =>{optlastyear +=element.ftd});
  // .forEach(element=>{(branchName=element.branch),(code=element.code);});

mtdoptpercentage=Math.round(((mtdopt)/(optlastyear)-1)*100);
targetachieved=Math.round(((mtdopt)/(targetmtdopt))*100)
  branchObj[key].push({

    branchcode: branch,
    branch:branchName,

  mtdoptrev:Math.round(mtdopt),
   lstoptrev:Math.round(optlastyear),
   mtdoptperc:Math.round(mtdoptpercentage),
     targetmtdrev:Math.round(targetmtdopt),
     mtdoptpercachieved:Math.round(targetachieved)
});

//process.exit(1);
(opt=0),(mtdopt=0),(optlastyear=0),
(targetmtdopt=0),
(mtdoptpercentage=0),(targetachieved=0),
(branchName=null);
});
}//END OF for(let key in totalgroupbranches)
console.log(branchObj);

return{branch:branchObj}
};


exports.newUsageTrackerNative = async (
    dbres2,
    branches,
    ftddate,
    resdevicehistory,
    targetres,
	resdevicerevenue

) => {
    let entityWise = await filterEntityUsageTracker(dbres2, ftddate, resdevicehistory, targetres,resdevicerevenue);
    let groupWise = await filterGroupwiseUsageTracker(
        entityWise.aeharr,
        entityWise.ahcarr,
        dbres2,
        branches,
        ftddate,
        resdevicehistory,
        targetres,
		resdevicerevenue
    );

    return {
        group: entityWise.group,
        alin: entityWise.alin,
        aeh: entityWise.aeh,
        ahc: entityWise.ahc,
        ohc: entityWise.ohc,
        aehgroup: groupWise.aeh,
        ahcgroup: groupWise.ahc,
        ohcgroup: groupWise.ohc,
        branchwise: groupWise.branchwise
    };
};



let filterEntityUsageTracker = async (dbres2, ftddate, resdevicehistory, targetres,resdevicerevenue) => {
    let tempObj = {},
        opd = 0,
        devicehistorycount = 0,
        aeharr = [],
        aehrevarr = [],
        aehtargetarr = [],
        aehdevicehistoty = [],
		aehdevicerevenue = [],
        ahcrevarr = [],
        ahcdevicehistoty = [],
		ahcdevicerevenue = [],
        ahcarr = [],
        ahctargetarr = [],
        ohcrevarr = [],
        ohcdevicehistoty = [],
		ohcdevicerevenue = [],
        target = 0,	
		ftddevicerevenueamount=0,
		mtddevicerevenueamount=0,
		ftddevicerevenuecount=0,
		mtddevicerevenuecount=0,
        alin = {};


    aehrevarr = _.filter(dbres2, {
        entity: "AEH"
    });

    aehtargetarr = _.filter(targetres, {
        entity: "AEH"
    });


    aehdevicehistoty = _.filter(resdevicehistory, {
        entity: "AEH"
    });
	
	aehdevicerevenue = _.filter(resdevicerevenue, {
        entity: "AEH"
    });
	
	
	
    _.filter(aehrevarr, {
        trans_date: ftddate
    }).forEach(element => {
        opd += element.device_daily_count;

    });

    _.filter(aehdevicehistoty, {
        trans_date: ftddate
    }).forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	
	
	_.filter(aehdevicerevenue, {
        trans_date: ftddate
    }).forEach(element => {
        ftddevicerevenuecount += element.BILL_COUNT;
		ftddevicerevenueamount += element.AMOUNT;
    });	
    aehtargetarr.forEach(element => {
        target += element.total;

    });



    tempObj.AEH = {
        branch: "AEH",
        ftdopdrev: opd,
        target: target,
        devicemtd: devicehistorycount,
        revenueftdcount: ftddevicerevenuecount,        
        revenueftdamount: ftddevicerevenueamount,       
        deviceftd: devicehistorycount
    };
    (opd = 0), (devicehistorycount = 0);
    aehrevarr.forEach(element => {
        opd += element.ftd_count;

    });


    aehdevicehistoty.forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	
	aehdevicerevenue.forEach(element => {
        mtddevicerevenuecount += element.BILL_COUNT;
		 mtddevicerevenueamount += element.AMOUNT;
    });
	
	
	

    (tempObj.AEH.mtdopdrev = opd);
    (tempObj.AEH.devicemtd = devicehistorycount);
	(tempObj.AEH.revenuemtdcount = mtddevicerevenuecount);
	(tempObj.AEH.revenuemtdamount = mtddevicerevenueamount);	
	(tempObj.AEH.revenuetargetachived = Math.round(((tempObj.AEH.revenuemtdcount/tempObj.AEH.target)*100)));
	
    (opd = 0), (devicehistorycount = 0), (target = 0),(ftddevicerevenuecount = 0),(ftddevicerevenueamount = 0),(mtddevicerevenuecount = 0),(mtddevicerevenuecount = 0);
    ahcrevarr = _.filter(dbres2, {
        entity: "AHC"
    });

    ahctargetarr = _.filter(targetres, {
        entity: "AHC"
    });


    ahcdevicehistoty = _.filter(resdevicehistory, {
        entity: "AHC"
    });
	
	
	ahcdevicerevenue = _.filter(resdevicerevenue, {
        entity: "AHC"
    });
	
	


    _.filter(ahcrevarr, {
        trans_date: ftddate
    }).forEach(element => {
        opd += element.ftd_count;

    });
	
	

    _.filter(ahcdevicehistoty, {
        trans_date: ftddate
    }).forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	_.filter(ahcdevicerevenue, {
        trans_date: ftddate
    }).forEach(element => {
        ftddevicerevenuecount += element.BILL_COUNT;
		 ftddevicerevenueamount += element.AMOUNT;
    });
	

	

    ahctargetarr.forEach(element => {
        target += element.total;

    });


    tempObj.AHC = {
        branch: "AHC",
        ftdopdrev: opd,
        target: target,
        devicemtd: devicehistorycount,
        revenueftdcount: ftddevicerevenuecount,       
        revenueftdamount: ftddevicerevenueamount,
        deviceftd: devicehistorycount
    };
    (opd = 0), (devicehistorycount = 0),(mtddevicerevenuecount = 0), (mtddevicerevenueamount = 0);
    ahcrevarr.forEach(element => {
        opd += element.ftd_count;

    });
    ahcdevicehistoty.forEach(element => {
        devicehistorycount += element.device_daily_count;

    });

    ahcdevicerevenue.forEach(element => {
        mtddevicerevenuecount += element.BILL_COUNT;
		mtddevicerevenueamount += element.AMOUNT;
    });
	

    (tempObj.AHC.mtdopdrev = opd);
    (tempObj.AHC.devicemtd = devicehistorycount);
	(tempObj.AHC.revenuemtdcount = mtddevicerevenuecount);
	(tempObj.AHC.revenuemtdamount = mtddevicerevenueamount);
	(tempObj.AHC.revenuetargetachived = Math.round(((tempObj.AHC.revenuemtdcount/tempObj.AHC.target)*100)));

    /*for (let key in tempObj.AEH) {
      alin[key] = tempObj.AEH[key];
    }
    for (let key in tempObj.AHC) {
      alin["branch"] = "All India";
      alin[key] += tempObj.AHC[key];
    }*/

    (opd = 0), (devicehistorycount = 0), (target = 0),(ftddevicerevenuecount = 0),(ftddevicerevenueamount = 0),(mtddevicerevenuecount = 0),(mtddevicerevenuecount = 0);
    ohcrevarr = _.filter(dbres2, {
        entity: "OHC"
    });

    ohcdevicehistoty = _.filter(resdevicehistory, {
        entity: "OHC"
    });
	
	
	
	ohcdevicerevenue = _.filter(resdevicerevenue, {
        entity: "OHC"
    });
	
	
    _.filter(ohcrevarr, {
        trans_date: ftddate
    }).forEach(element => {
        opd += element.ftd_count;

    });
	
	
	
	 _.filter(ohcdevicehistoty, {
        trans_date: ftddate
    }).forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	_.filter(ohcdevicerevenue, {
        trans_date: ftddate
    }).forEach(element => {
        ftddevicerevenuecount += element.BILL_COUNT;
		ftddevicerevenueamount += element.AMOUNT;
    });
	
    tempObj.OHC = {
        branch: "OHC",
        ftdopdrev: opd,
        target: 50,
        devicemtd: devicehistorycount,
        revenueftdcount: ftddevicerevenuecount,
		revenueftdamount: ftddevicerevenueamount,
        deviceftd: devicehistorycount
    };
    (opd = 0), (devicehistorycount = 0),(ftddevicerevenuecount = 0),(ftddevicerevenueamount = 0),(mtddevicerevenuecount = 0),(mtddevicerevenuecount = 0);
    ohcrevarr.forEach(element => {
        opd += element.ftd_count;

    });
    ohcdevicehistoty.forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	
	ohcdevicerevenue.forEach(element => {
        mtddevicerevenuecount += element.BILL_COUNT;
        mtddevicerevenueamount += element.AMOUNT;
    });
	
	
	(tempObj.OHC.mtdopdrev = opd);
    (tempObj.OHC.devicemtd = devicehistorycount);
	(tempObj.OHC.revenuemtdcount = mtddevicerevenuecount);
    (tempObj.OHC.revenuemtdamount = mtddevicerevenueamount);
	(tempObj.OHC.revenuetargetachived = Math.round(((tempObj.OHC.revenuemtdcount/tempObj.OHC.target)*100)));
	
	
    alin["branch"] = "All India";
    alin['ftdopdrev'] = tempObj.AEH['ftdopdrev'] + tempObj.AHC['ftdopdrev'];
    alin['mtdopdrev'] = tempObj.AEH['mtdopdrev'] + tempObj.AHC['mtdopdrev'];
    alin['deviceftd'] = tempObj.AEH['deviceftd'] + tempObj.AHC['deviceftd'];
    alin['devicemtd'] = tempObj.AEH['devicemtd'] + tempObj.AHC['devicemtd'];
    alin['target'] = tempObj.AEH['target'] + tempObj.AHC['target'];

    let gropuftd = 0,
        gropumtd = 0,
        groupdeviceftd = 0,
        groupdevicemtd = 0;
    grouptarget = 0;

    gropuftd = tempObj.AEH['ftdopdrev'] + tempObj.AHC['ftdopdrev'] + tempObj.OHC['ftdopdrev'];
    gropumtd = tempObj.AEH['mtdopdrev'] + tempObj.AHC['mtdopdrev'] + tempObj.OHC['mtdopdrev'];
    groupdeviceftd = tempObj.AEH['deviceftd'] + tempObj.AHC['deviceftd'] + tempObj.OHC['deviceftd'];
    groupdevicemtd = tempObj.AEH['devicemtd'] + tempObj.AHC['devicemtd'] + tempObj.OHC['devicemtd'];
    grouptarget = tempObj.AEH['target'] + tempObj.AHC['target'] + tempObj.OHC['target'];

    group = {};

    group["branch"] = "Group";
    group['ftdopdrev'] = gropuftd;
    group['mtdopdrev'] = gropumtd;
    group['deviceftd'] = groupdeviceftd;
    group['devicemtd'] = groupdevicemtd;
    group['target'] = grouptarget;

    return {
        group: group,
        alin: alin,
        aeharr: aeharr,
        ahcarr: ahcarr,
        aeh: tempObj.AEH,
        ahc: tempObj.AHC,
        ohc: tempObj.OHC
    };
};




let filterGroupwiseUsageTracker = async (
    aeh,
    ahc,
    dbres2,
    branches,
    ftddate,
    resdevicehistory,
    targetres,
	resdevicerevenue
) => {
    let ftdopd = 0,
        mtdopd = 0,
        ftddevicecount = 0,
        mtddevicecount = 0,
        aehtempObj = {},
        ahctempObj = {},
        ohctempObj = {},
        branchObj = {},
        branchName = null,
        ftdopdrev = 0,
        mtdopdrev = 0,
        mtdopdrevlastyear = 0,
        target = 0,
		ftddevicerevenueamount=0,
		mtddevicerevenueamount=0,
		ftddevicerevenuecount=0,
		mtddevicerevenuecount=0,
        code = null;


    let aehGroups = [
        "chennai",
        "rotn"
    ];

    let ohcGroups = [
        "Madagascar",
        "Mozambique",
        "Nigeria",
        "Rwanda",
        "Mauritius",
        "Zambia",
        "Ghana",
        "Nairobi",
        "Uganda",
        "Tanzania"
    ];

    let ahcGroups = [
        "Chennai",
        "Banglore",
        "Hyderabad",
        "Kerala",
        "Madhya Pradesh",
		"Maharashtra"
        //'Ambattur'
    ];
    let aehgroupedBranches = {
        "chennai": ["ASN", "TRC", "AVD", "TLR"],
        "rotn": ["KNP", "VLR", "KSN", "KBK", "HSR", "DHA"]

    };
    let ahcgroupedBranches = {
        "Chennai": ["MGP", "NWP", "AMB", "ADY", "TVT"],
        "ROTN": ["TVL","TPR"],
        Banglore: ["KML", "PNR", "RRN","SVR"],
        Hyderabad: ["DNR", "MDA", "SNR", "MPM", "GCB"],
        Kerala: ["KTM"],
        "Madhya Pradesh": ["APR"],
		"Maharashtra":["VSH"]
        //,Ambattur : ['AMB']
    };


    let ohcgroupedBranches = {
        "Madagascar": ["MDR"],
        "Mozambique": ["MZQ", "BRA"],
        "Nigeria": ["NGA"],
        "Rwanda": ["RWD"],
        "Mauritius": ["EBN", "FLQ", "GDL"],
        "Zambia": ["ZMB"],
        "Ghana": ["GHA"],
        "Nairobi": ["NAB"],
        "Uganda": ["UGD"],
        "Tanzania": ["TZA"]
    };


    aehGroups.forEach(group => {
        aehtempObj[group] = {};
        aehgroupedBranches[group].forEach(branch => {

            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target += element.total;
                }
            );


            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftdopd += element.ftd_count;

                }
            );
			
			
			_.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicecount += element.device_daily_count;

                }
            );
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
					 ftddevicerevenueamount += element.AMOUNT;
                    ftddevicerevenuecount += element.BILL_COUNT;

                }
            );
			
		
            (aehtempObj[group].ftdopdrev = ftdopd);
            (aehtempObj[group].target = target);
			(aehtempObj[group].deviceftd = ftddevicecount);
			(aehtempObj[group].revenueftdcount = ftddevicerevenuecount);
			(aehtempObj[group].revenueftdamount = ftddevicerevenueamount);
			

            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {
                mtdopd += element.ftd_count;

            });


            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {
                mtddevicecount += element.device_daily_count;

            });
			
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
					mtddevicerevenueamount += element.AMOUNT;

                }
            );

            (aehtempObj[group].mtdopdrev = mtdopd),
            (aehtempObj[group].devicemtd = mtddevicecount),           
            (aehtempObj[group].entity = 'AEH'),          
            (aehtempObj[group].revenuemtdcount = mtddevicerevenuecount),           
            (aehtempObj[group].revenuemtdamount = mtddevicerevenueamount),
			(aehtempObj[group].revenuetargetachived = Math.round(((mtddevicecount/target)*100))),
            (aehtempObj[group].branch = group);
        });
        (ftdopd = 0),
        (ftdopdrev = 0),
        (mtdopdrev = 0),
        (mtdopd = 0),
        (mtddevicecount = 0),
        (ftddevicecount = 0),
		(ftddevicerevenueamount=0),
		(mtddevicerevenueamount=0),
		(ftddevicerevenuecount=0),
		(mtddevicerevenuecount=0),
        (target = 0);

    });
    for (let key in aehgroupedBranches) {
        branchObj[key] = [];
        aehgroupedBranches[key].forEach(branch => {
            _.filter(branches, {
                code: branch
            }).forEach(element => {
                (branchName = element.branch), (code = element.code);
            });

            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target = element.total;
                }
            );




            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {

                    (ftdopdrev = element.ftd_count);
                }
            );
			
			
			 _.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {

                    (ftddevicecount += element.device_daily_count);
                }
            );
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicerevenuecount += element.BILL_COUNT;
					ftddevicerevenueamount += element.AMOUNT;

                }
            );
			
			
            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {

                (mtdopdrev += element.ftd_count);
            });


            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {

                (mtddevicecount += element.device_daily_count);
            });
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
                     mtddevicerevenueamount += element.AMOUNT;
                }
            );
			
            branchObj[key].push({
                branch: branchName,
                code: code,
                ftdopdrev: ftdopdrev,
                mtdopdrev: mtdopdrev,
                deviceftd: ftddevicecount,
                target: target,
                entity: 'AEH',
                devicemtd: mtddevicecount,              
                revenueftdcount: ftddevicerevenuecount,
                revenuemtdcount: mtddevicerevenuecount,                
                revenueftdamount: ftddevicerevenueamount,
                revenuemtdamount: mtddevicerevenueamount,
				revenuetargetachived : Math.round(((mtddevicecount/target)*100))
            });
            (ftdopd = 0),
            (mtdopd = 0),
            (ftdopdrev = 0),
            (mtdopdrev = 0),
            (ftddevicecount = 0),
            (mtddevicecount = 0),            
            (target = 0),
			(ftddevicerevenueamount=0),
			(mtddevicerevenueamount=0),
			(ftddevicerevenuecount=0),
			(mtddevicerevenuecount=0),
            (code = null);
        });
    }
    for (let key in ahcgroupedBranches) {
        branchObj[key] = [];
        ahcgroupedBranches[key].forEach(branch => {
            _.filter(branches, {
                code: branch
            }).forEach(element => {
                (branchName = element.branch), (code = element.code);
            });
			
			
            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {

                    (ftdopdrev = element.ftd_count);

                }
            );


            _.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {

                    (ftddevicecount += element.device_daily_count);

                }
            );
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicerevenuecount += element.BILL_COUNT;
                    ftddevicerevenueamount += element.AMOUNT;
                }
            );
			
			
            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target = element.total;
                }
            );


            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {
                (mtdopdrev += element.ftd_count);

            });

            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {
                (mtddevicecount += element.device_daily_count);

            });
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
					mtddevicerevenueamount += element.AMOUNT;

                }
            );	 

          

            branchObj[key].push({
                branch: branchName,
                code: code,
                ftdopdrev: ftdopdrev,
                mtdopdrev: mtdopdrev,
                deviceftd: ftddevicecount,
                target: target,
                entity: 'AHC',
                devicemtd: mtddevicecount,               
                revenueftdcount: ftddevicerevenuecount,
                revenuemtdcount: mtddevicerevenuecount,                
                revenueftdamount: ftddevicerevenueamount,
                revenuemtdamount: mtddevicerevenueamount,
				revenuetargetachived : Math.round(((mtddevicecount/target)*100))

            });
			
			
            (ftdopd = 0),
            (ftdopdrev = 0),
            (mtdopdrev = 0),
            (mtdopd = 0),
            (mtddevicecount = 0),
            (ftddevicecount = 0),
            (target = 0),
			(ftddevicerevenueamount=0),
			(mtddevicerevenueamount=0),
			(ftddevicerevenuecount=0),
			(mtddevicerevenuecount=0);

        });
    }

    ahcGroups.forEach(group => {
        ahctempObj[group] = {};
        ahcgroupedBranches[group].forEach(branch => {
            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftdopd += element.ftd_count;

                }
            );
			
			
			_.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicecount += element.device_daily_count;

                }
            );
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicerevenuecount += element.BILL_COUNT;
					ftddevicerevenueamount += element.AMOUNT;
                }
            );
			


            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target += element.total;
                }
            );



            (ahctempObj[group].ftdopdrev = ftdopd);
			(ahctempObj[group].deviceftd = ftddevicecount);
            (ahctempObj[group].target = target);
			(ahctempObj[group].revenueftdcount = ftddevicerevenuecount);
			(ahctempObj[group].revenueftdamount = ftddevicerevenueamount);

            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {
                mtdopd += element.ftd_count;

            });


            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {
                mtddevicecount += element.device_daily_count;

            });
			
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
					mtddevicerevenueamount += element.AMOUNT;

                }
            );	 
          

            (ahctempObj[group].mtdopdrev = mtdopd),            
            (ahctempObj[group].devicemtd = mtddevicecount),
            (ahctempObj[group].entity = 'AHC'),        
            (ahctempObj[group].revenuemtdcount = mtddevicerevenuecount),
			(ahctempObj[group].revenuemtdamount = mtddevicerevenueamount),
			(ahctempObj[group].revenuetargetachived = Math.round(((mtddevicecount/target)*100))),
            (ahctempObj[group].branch = group);
        });
        (ftdopd = 0),
        (mtdopd = 0),
        (ftdopdrev = 0),
        (mtdopdrev = 0),
        (mtddevicecount = 0),
        (target = 0),
        (ftddevicecount = 0),
		(ftddevicerevenueamount=0),
		(mtddevicerevenueamount=0),
		(ftddevicerevenuecount=0),
		(mtddevicerevenuecount=0);
    });

    ohcGroups.forEach(group => {
        ohctempObj[group] = {};
        ohcgroupedBranches[group].forEach(branch => {
            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftdopd += element.ftd_count;

                }
            );
			
			
			_.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicecount += element.device_daily_count;

                }
            );
			
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicerevenuecount += element.BILL_COUNT;
					ftddevicerevenueamount += element.AMOUNT;
                }
            );


            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target += element.total;
                }
            );
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
					mtddevicerevenueamount += element.AMOUNT;
                }
            );



            (ohctempObj[group].ftdopdrev = ftdopd);
			(ohctempObj[group].deviceftd = ftddevicecount);
            (ohctempObj[group].target = target);
			(ohctempObj[group].revenueftdcount = mtddevicerevenuecount);
            (ohctempObj[group].revenueftdamount = mtddevicerevenueamount);

            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {
                mtdopd += element.ftd_count;

            });


            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {
                mtddevicecount += element.device_daily_count;

            });
           



            (ohctempObj[group].mtdopdrev = mtdopd),
            (ohctempObj[group].deviceftd = ftddevicecount),
            (ohctempObj[group].devicemtd = mtddevicecount),
            (ohctempObj[group].entity = 'OHC'),         
            (ohctempObj[group].revenuemtdcount = 0),
            (ohctempObj[group].revenuemtdamount = 0),            
			(ohctempObj[group].revenuetargetachived = Math.round(((mtddevicecount/target)*100))),    
            (ohctempObj[group].branch = group);
        });
        (ftdopd = 0),
        (ftdopdrev = 0),
        (mtdopdrev = 0),
        (mtdopd = 0),
        (mtddevicecount = 0),
        (ftddevicecount = 0),
		(ftddevicerevenueamount=0),
		(mtddevicerevenueamount=0),
		(ftddevicerevenuecount=0),
		(mtddevicerevenuecount=0),
        (target = 0);

    });


    for (let key in ohcgroupedBranches) {
        branchObj[key] = [];
        ohcgroupedBranches[key].forEach(branch => {
            _.filter(branches, {
                code: branch
            }).forEach(element => {
                (branchName = element.branch), (code = element.code);
            });
			

            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target = element.total;
                }
            );



            _.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    (ftddevicecount += element.device_daily_count);
                }
            );
			
			
			 _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {

                    (ftdopdrev = element.ftd_count);
                }
            );
			
			
			
			
            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {

                (mtdopdrev += element.ftd_count);
            });


            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {

                (mtddevicecount += element.device_daily_count);
            });      


            branchObj[key].push({
                branch: branchName,
                code: code,
                ftdopdrev: ftdopdrev,
                mtdopdrev: mtdopdrev,
                deviceftd: ftddevicecount,
                target: target,
                entity: 'OHC',
                devicemtd: mtddevicecount,                
                revenueftdcount: 0,
                revenuemtdcount: 0,               
                revenueftdamount: 0,
                revenuemtdamount: 0,
				revenuetargetachived : Math.round(((mtddevicerevenuecount/target)*100))
            });
            (ftdopd = 0),
            (mtdopd = 0),
            (ftdopdrev = 0),
            (mtdopdrev = 0),
            (mtddevicecount = 0),
            (ftddevicecount = 0),
            (target = 0),
			(ftddevicerevenueamount=0),
			(mtddevicerevenueamount=0),
			(ftddevicerevenuecount=0),
			(mtddevicerevenuecount=0),
            (code = null);
        });
    }
    return {
        aeh: aehtempObj,
        ahc: ahctempObj,
        ohc: ohctempObj,
        branchwise: branchObj
    };
};


// praveen
exports.newconsultation=async(consultation,branch,ftddate)=>{
  let entityWise=await filternewconsult(consultation,ftddate);
  let groupWise=await filternewGroupwise(
    entityWise.aeharr,entityWise.ahcarr,consultation,branch,ftddate
  );
  return {
	
	group: entityWise.group,
    alin: entityWise.alin,
    aeh: entityWise.aeh,
    ahc: entityWise.ahc,
	ohc: entityWise.ohc,
    aehgroup: groupWise.aeh,
    ahcgroup: groupWise.ahc,
	ohcgroup: groupWise.ohc,
    branchwise: groupWise.branchwise
  };
}

let filternewconsult=async(consultation,ftddate)=>{
//  console.log("hit in filternewconsult");
  let tempObj={},
  consult=0,opd=0,aeharr=[],ahcarr=[],ohcarr=[],
  aehcountarr=[],ahccountarr=[],ohccountarr=[],alin={};
//aeh
  (opd=0),(consult=0);
  aehcountarr=_.filter(consultation,{entity:"AEH"});

  _.filter(aehcountarr,{trans_date:ftddate}).forEach(element =>{
    opd+=element.ftd_count;
    consult+=element.bill_count;
  });
  tempObj.AEH ={branch:"AEH",ftdopdcount:opd,ftdconsultcount:consult};

//aeh mtd
  (opd=0),(consult=0);
  aehcountarr.forEach(element => {
  opd+=element.ftd_count;
  consult+=element.bill_count;
  });

  (tempObj.AEH.mtdopdcount=opd);
  (tempObj.AEH.mtdconsultcount=consult);



//ahc

(opd=0),(consult=0);
ahccountarr=_.filter(consultation,{entity:"AHC"});

_.filter(ahccountarr,{trans_date:ftddate}).forEach(element =>{
  opd+=element.ftd_count;
  consult+=element.bill_count;
});
tempObj.AHC ={branch:"AHC",ftdopdcount:opd,ftdconsultcount:consult};

// ahc mtd

(opd=0),(consult=0);
ahccountarr.forEach(element => {
opd+=element.ftd_count;
consult+=element.bill_count;
});

(tempObj.AHC.mtdopdcount=opd);
(tempObj.AHC.mtdconsultcount=consult);

//ohc

(opd=0),(consult=0);
ahccountarr=_.filter(consultation,{entity:"OHC"});

_.filter(ahccountarr,{trans_date:ftddate}).forEach(element =>{
  opd+=element.ftd_count;
  consult+=element.bill_count;
});
tempObj.OHC ={branch:"OHC",ftdopdcount:opd,ftdconsultcount:consult};

//ohc mtd
(opd=0),(consult=0);
ahccountarr.forEach(element => {
opd+=element.ftd_count;
consult+=element.bill_count;
});

(tempObj.OHC.mtdopdcount=opd);
(tempObj.OHC.mtdconsultcount=consult);


//allindia

alin["branch"] = "All India";
alin['ftdopdcount'] =  tempObj.AEH['ftdopdcount']+tempObj.AHC['ftdopdcount'];
alin['mtdopdcount'] =  tempObj.AEH['mtdopdcount']+tempObj.AHC['mtdopdcount'];
alin['ftdconsultcount'] =  tempObj.AEH['ftdconsultcount']+tempObj.AHC['ftdconsultcount'];
alin['mtdconsultcount'] =  tempObj.AEH['mtdconsultcount']+tempObj.AHC['mtdconsultcount'];


//groupwise

  let groupftd=0,
  groupmtd=0,
  groupftdconsult=0,
    groupmtdconsult=0;


  groupftd = tempObj.AEH['ftdopdcount']+tempObj.AHC['ftdopdcount']+tempObj.OHC['ftdopdcount'];
  groupmtd = tempObj.AEH['mtdopdcount']+tempObj.AHC['mtdopdcount']+tempObj.OHC['mtdopdcount'];
  groupftdconsult = tempObj.AEH['ftdconsultcount']+tempObj.AHC['ftdconsultcount']+tempObj.OHC['ftdconsultcount'];
  groupmtdconsult = tempObj.AEH['mtdconsultcount']+tempObj.AHC['mtdconsultcount']+tempObj.OHC['mtdconsultcount'];


  group = {};

  group["branch"] = "Group";
  group['ftdopdcount'] =  groupftd;
  group['mtdopdcount'] =  groupmtd;
  group['ftdconsultcount'] =  groupftdconsult;
  group['mtdconsultcount'] = groupmtdconsult;


  return {
	group : group,
    alin :alin,
    aeharr: aeharr,
    ahcarr: ahcarr,
    aeh: tempObj.AEH,
    ahc: tempObj.AHC,
	ohc: tempObj.OHC
  };

};

let filternewGroupwise=async(aeh,ahc,consultation,branches,ftddate)=>{
  let ftdopd=0,mtdopd=0,ftdconsult=0,mtdconsult=0,
  aehtempObj={},ahctempObj={},ohctempObj={},branchObj={},
  branchName=null,ftdopdcount=0,mtdopdcount=0,ftdconsultcount=0,mtdconsultcount=0,code=null;

  let aehGroups = [
    "Chennai Main Hospital",
    "Chennai Branches",
    "Kanchi + Vellore",
    "Kum + Ney + Vil",
    "Dha + Salem + Krish",
    "Erode + Hosur",
    "Jaipur"
    ];
  let ohcGroups = [
    "Madagascar",
    "Mozambique",
    "Nigeria",
    "Rwanda",
    "Mauritius",
    "Zambia",
    "Ghana",
    "Nairobi",
    "Uganda",
    "Tanzania"
  ];
  let ahcGroups = [
    "Chennai branches","Pondycherry",
    "Tirunelveli",
	   "Coimbatore",
    "Tuticorin + Madurai",
    "Trichy",
    "Thanjavur",
    "Tiruppur",
    "Andaman",
    "Karnataka",
    "Banglore",
    "Hubli + Mysore",
	   "Maharashtra",
     "Telangana",
    "Hyderabad",
    "Andhra Pradesh",
    "Rest of India(incl. Jaipur)",
    "Kerala",
    "Kolkata",
    "Ahmedabad",
    "Madhya Pradesh",
    "Odisha"
      ];

      let aehgroupedBranches = {
        "Chennai Main Hospital": ["CMH"],
        "Chennai Branches": [
          "ANN",
          "ASN",
          "AVD",
          "NLR",
          "PMB",
          "PRR",
          "TLR",
          "TRC",
          "VLC"
        ],
        "Kanchi + Vellore": ["KNP", "VLR"],
        "Kum + Ney + Vil": ["KBK", "NVL", "VPM"],
        "Dha + Salem + Krish": ["DHA", "SLM", "KSN"],
        "Erode + Hosur": ["ERD", "HSR"],
        Jaipur: ["JPR"],
        "Madurai KK Nagar": ["MDU"]
      };

      let ahcgroupedBranches = {
        "Chennai branches": ["TBM", "ADY", "EGM", "MGP", "NWP","AMB","TVT"],
        Pondycherry: ["PDY"],
        Tirunelveli: ["TVL"],
    	Coimbatore: ["CMB"],
        "Tuticorin + Madurai": ["TCN", "APM"],
        Trichy: ["TRI"],
        Thanjavur: ["TNJ"],
        Tiruppur: ["TPR"],
        Andaman: ["AMN"],
        Karnataka: [
          "BMH",
    	     
          "WFD",
          "KML",
          "CLR",
          "INR",
          "PNR",
          "YLK",
          "SVR",
          "BSK",
          "RRN",
    	     "RJN",
          "HUB",
          "MCC",
          "MYS",

        ],
        Banglore: ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK","SVR","BSK","RRN","RJN"],
        "Hubli + Mysore": ["HUB", "MCC", "MYS"],
    	Maharashtra :["VSH", "PUN", "HDP","CMR", "KTD"],
        Telangana: ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD","MPM","GCB"],
        Hyderabad: ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD","MPM","GCB"],
        "Andhra Pradesh": ["VMH", "NEL", "GUN", "TPT", "RAJ"],
        "Rest of India(incl. Jaipur)": [
          "TVM",
    	     "KTM",
          "KOL",
          "KAS",
    	     "VSH",
          "PUN",
    	     "HDP",
          "AHM",          
      	  "JWS",
      	  "APR",
      	  "ATA",
      	  "KWA",
            "CTK",
          "BHU",
          "JPR"
        ],
        Kerala: ["TVM","KTM"],
        Kolkata: ["KOL", "KAS"],
        Ahmedabad: ["AHM"],
        "Madhya Pradesh": ["JWS","APR","ATA","KWA"],
        Odisha: ["CTK", "BHU"]

      };

      let ohcgroupedBranches = {
    	"Madagascar" :["MDR"],
        "Mozambique":["MZQ","BRA"],
        "Nigeria":["NGA"],
        "Rwanda":["RWD","CGU"],
        "Mauritius":["EBN","FLQ","GDL"],
    	   "Zambia":["ZMB"],
        "Ghana":["GHA"],
        "Nairobi":["NAB"],
        "Uganda":["UGD"],
    	"Tanzania":["TZA"]
      };

  aehGroups.forEach(group=>{
  aehtempObj[group]={};
  aehgroupedBranches[group].forEach(branch => {
    _.filter(consultation,{branch:branch,trans_date:ftddate}).forEach(element => {
    ftdopd+=element.ftd_count;
    ftdconsultcount+=element.bill_count;
    });
    _.filter(consultation,{branch:branch}).forEach(element => {
      mtdopd+=element.ftd_count;
      mtdconsult+=element.bill_count;
    });


    (aehtempObj[group].ftdopdcount=ftdopd);
    (aehtempObj[group].ftdconsultcount=ftdconsultcount);
    (aehtempObj[group].mtdopdcount=mtdopd);
    (aehtempObj[group].mtdconsultcount=mtdconsult);
     (aehtempObj[group].branch = group);


console.log("");
console.log("ftdopdcount : "+aehtempObj[group].ftdopdcount);
console.log("ftdconsultcount : "+aehtempObj[group].ftdconsultcount);
console.log("mtdopdcount : "+aehtempObj[group].mtdopdcount);
console.log("mtdconsultcount : "+aehtempObj[group].mtdconsultcount);
console.log("branch : "+aehtempObj[group].branch );
console.log("");

    });

    (ftdopd = 0),(ftdconsultcount=0),(mtdopd = 0),(mtdconsult = 0);

});
  for(let key in aehgroupedBranches){
    branchObj[key]=[];
    aehgroupedBranches[key].forEach(branch => {
      _.filter(branches,{code:branch}).forEach(element => {
        (branchName=element.branch),(code=element.code);
      });
      _.filter(consultation,{branch:branch,trans_date:ftddate}).forEach(element => {
        (ftdopdcount+=element.ftd_count),(ftdconsultcount+=element.bill_count);
      });
      _.filter(consultation,{branch:branch}).forEach(element => {
        (mtdopdcount +=element.ftd_count),(mtdconsultcount +=element.bill_count);
      });
      branchObj[key].push({
        branch:branchName,
        code:code,
        ftdopdcount:ftdopdcount,
        mtdopdcount:mtdopdcount,
        ftdconsultcount:ftdconsultcount,
        mtdconsultcount:mtdconsultcount

      });



          (ftdopd = 0),(ftdconsultcount=0),(mtdopd = 0),(mtdconsult = 0),
          (ftdopdcount=0),(mtdopdcount=0),(ftdconsultcount=0),(mtdconsultcount=0),
          (code=null);

    });
//console.log(branchObj);
  };

  ahcGroups.forEach(group=>{
  ahctempObj[group]={};
  ahcgroupedBranches[group].forEach(branch => {
    _.filter(consultation,{branch:branch,trans_date:ftddate}).forEach(element => {
    ftdopd+=element.ftd_count;
    ftdconsultcount+=element.bill_count;
    });
    _.filter(consultation,{branch:branch}).forEach(element => {
      mtdopd+=element.ftd_count;
      mtdconsult+=element.bill_count;
    });


    (ahctempObj[group].ftdopdcount=ftdopd);
    (ahctempObj[group].ftdconsultcount=ftdconsultcount);
    (ahctempObj[group].mtdopdcount=mtdopd);
    (ahctempObj[group].mtdconsultcount=mtdconsult);
     (ahctempObj[group].branch = group);


console.log("");
console.log("ftdopdcount : "+ahctempObj[group].ftdopdcount);
console.log("ftdconsultcount : "+ahctempObj[group].ftdconsultcount);
console.log("mtdopdcount : "+ahctempObj[group].mtdopdcount);
console.log("mtdconsultcount : "+ahctempObj[group].mtdconsultcount);
console.log("branch : "+ahctempObj[group].branch );
console.log("");

  });

  (ftdopd = 0),(ftdconsultcount=0),(mtdopd = 0),(mtdconsult = 0);

});
  for(let key in ahcgroupedBranches){
    branchObj[key]=[];
    ahcgroupedBranches[key].forEach(branch => {
      _.filter(branches,{code:branch}).forEach(element => {
        (branchName=element.branch),(code=element.code);
      });
      _.filter(consultation,{branch:branch,trans_date:ftddate}).forEach(element => {
        (ftdopdcount+=element.ftd_count),(ftdconsultcount+=element.bill_count);
      });
      _.filter(consultation,{branch:branch}).forEach(element => {
        (mtdopdcount +=element.ftd_count),(mtdconsultcount +=element.bill_count);
      });
      branchObj[key].push({
        branch:branchName,
        code:code,
        ftdopdcount:ftdopdcount,
        mtdopdcount:mtdopdcount,
        ftdconsultcount:ftdconsultcount,
        mtdconsultcount:mtdconsultcount

      });



          (ftdopd = 0),(ftdconsultcount=0),(mtdopd = 0),(mtdconsult = 0),
          (ftdopdcount=0),(mtdopdcount=0),(ftdconsultcount=0),(mtdconsultcount=0),
          (code=null);

    });
//console.log(branchObj);
  };

  ohcGroups.forEach(group=>{
  ohctempObj[group]={};
  ohcgroupedBranches[group].forEach(branch => {
    _.filter(consultation,{branch:branch,trans_date:ftddate}).forEach(element => {
    ftdopd+=element.ftd_count;
    ftdconsultcount+=element.bill_count;

    });
    _.filter(consultation,{branch:branch}).forEach(element => {
      mtdopd+=element.ftd_count;
      mtdconsult+=element.bill_count;
    });


    (ohctempObj[group].ftdopdcount=ftdopd);
    (ohctempObj[group].ftdconsultcount=ftdconsultcount);
    (ohctempObj[group].mtdopdcount=mtdopd);
    (ohctempObj[group].mtdconsultcount=mtdconsult);
     (ohctempObj[group].branch = group);


console.log("");
console.log("ftdopdcount : "+ohctempObj[group].ftdopdcount);
console.log("ftdconsultcount : "+ohctempObj[group].ftdconsultcount);
console.log("mtdopdcount : "+ohctempObj[group].mtdopdcount);
console.log("mtdconsultcount : "+ohctempObj[group].mtdconsultcount);
console.log("branch : "+ohctempObj[group].branch );
console.log("");


  });
  (ftdopd = 0),(ftdconsultcount=0),(mtdopd = 0),(mtdconsult = 0);
});
  for(let key in ohcgroupedBranches){
    branchObj[key]=[];
    ohcgroupedBranches[key].forEach(branch => {
      _.filter(branches,{code:branch}).forEach(element => {
        (branchName=element.branch),(code=element.code);
      });
      _.filter(consultation,{branch:branch,trans_date:ftddate}).forEach(element => {
        (ftdopdcount+=element.ftd_count),(ftdconsultcount+=element.bill_count);
      });
      _.filter(consultation,{branch:branch}).forEach(element => {
        (mtdopdcount +=element.ftd_count),(mtdconsultcount +=element.bill_count);
      });
      branchObj[key].push({
        branch:branchName,
        code:code,
        ftdopdcount:ftdopdcount,
        mtdopdcount:mtdopdcount,
        ftdconsultcount:ftdconsultcount,
        mtdconsultcount:mtdconsultcount

      });



          (ftdopd = 0),(ftdconsultcount=0),(mtdopd = 0),(mtdconsult = 0),
          (ftdopdcount=0),(mtdopdcount=0),(ftdconsultcount=0),(mtdconsultcount=0),
          (code=null);

    });
//console.log(branchObj);
  };

  return { aeh: aehtempObj, ahc: ahctempObj,ohc: ohctempObj, branchwise: branchObj };


};


























exports.newUsageTrackerNativeNew = async (
    dbres2,
    branches,
    ftddate,
    resdevicehistory,
    targetres,
	resdevicerevenue

) => {
    let entityWise = await filterEntityUsageTrackerNew(dbres2, ftddate, resdevicehistory, targetres,resdevicerevenue);
    let groupWise = await filterGroupwiseUsageTrackerNew(
        entityWise.aeharr,
        entityWise.ahcarr,
        dbres2,
        branches,
        ftddate,
        resdevicehistory,
        targetres,
		resdevicerevenue
    );
	
	
	let totalWise = await totalUsageTracker(groupWise.aeh,groupWise.ahc);
	
	

    return {
		total: totalWise,
        group: entityWise.group,
        alin: entityWise.alin,
        aeh: entityWise.aeh,
        ahc: entityWise.ahc,
        ohc: entityWise.ohc,
        aehgroup: groupWise.aeh,
        ahcgroup: groupWise.ahc,
        ohcgroup: groupWise.ohc,
        branchwise: groupWise.branchwise
    };
};



let filterEntityUsageTrackerNew = async (dbres2, ftddate, resdevicehistory, targetres,resdevicerevenue) => {
    let tempObj = {},
        opd = 0,
        devicehistorycount = 0,
        aeharr = [],
        aehrevarr = [],
        aehtargetarr = [],
        aehdevicehistoty = [],
		aehdevicerevenue = [],
        ahcrevarr = [],
        ahcdevicehistoty = [],
		ahcdevicerevenue = [],
        ahcarr = [],
        ahctargetarr = [],
        ohcrevarr = [],
        ohcdevicehistoty = [],
		ohcdevicerevenue = [],
        target = 0,	
		targetamount = 0,	
		ftddevicerevenueamount=0,
		mtddevicerevenueamount=0,
		ftddevicerevenuecount=0,
		mtddevicerevenuecount=0,
        alin = {};


    aehrevarr = _.filter(dbres2, {
        entity: "AEH"
    });

    aehtargetarr = _.filter(targetres, {
        entity: "AEH"
    });


    aehdevicehistoty = _.filter(resdevicehistory, {
        entity: "AEH"
    });
	
	aehdevicerevenue = _.filter(resdevicerevenue, {
        entity: "AEH"
    });
	
	
	
    _.filter(aehrevarr, {
        trans_date: ftddate
    }).forEach(element => {
        opd += element.device_daily_count;

    });

    _.filter(aehdevicehistoty, {
        trans_date: ftddate
    }).forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	
	
	_.filter(aehdevicerevenue, {
        trans_date: ftddate
    }).forEach(element => {
        ftddevicerevenuecount += element.BILL_COUNT;
		ftddevicerevenueamount += element.AMOUNT;
    });	
    aehtargetarr.forEach(element => {
        target += element.total;
		targetamount += element.amount;

    });



    tempObj.AEH = {
        branch: "AEH",
        ftdopdrev: opd,
        target: target,
        devicemtd: devicehistorycount,
        revenueftdcount: ftddevicerevenuecount,        
        revenueftdamount: ftddevicerevenueamount,       
        deviceftd: devicehistorycount
    };
    (opd = 0), (devicehistorycount = 0);
    aehrevarr.forEach(element => {
        opd += element.ftd_count;

    });


    aehdevicehistoty.forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	
	aehdevicerevenue.forEach(element => {
        mtddevicerevenuecount += element.BILL_COUNT;
		 mtddevicerevenueamount += element.AMOUNT;
    });
	
	
	

    (tempObj.AEH.mtdopdrev = opd);
    (tempObj.AEH.devicemtd = devicehistorycount);
	(tempObj.AEH.revenuemtdcount = mtddevicerevenuecount);
	(tempObj.AEH.revenuemtdamount = mtddevicerevenueamount);
    (tempObj.AEH.targetamount = target*targetamount);	
	(tempObj.AEH.revenuetargetachived = Math.round(((mtddevicerevenuecount/target)*100)));
	
    (opd = 0), (devicehistorycount = 0), (target = 0),(targetamount = 0),(ftddevicerevenuecount = 0),(ftddevicerevenueamount = 0),(mtddevicerevenuecount = 0),(mtddevicerevenuecount = 0);
    ahcrevarr = _.filter(dbres2, {
        entity: "AHC"
    });

    ahctargetarr = _.filter(targetres, {
        entity: "AHC"
    });


    ahcdevicehistoty = _.filter(resdevicehistory, {
        entity: "AHC"
    });
	
	
	ahcdevicerevenue = _.filter(resdevicerevenue, {
        entity: "AHC"
    });
	
	


    _.filter(ahcrevarr, {
        trans_date: ftddate
    }).forEach(element => {
        opd += element.ftd_count;

    });
	
	

    _.filter(ahcdevicehistoty, {
        trans_date: ftddate
    }).forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	_.filter(ahcdevicerevenue, {
        trans_date: ftddate
    }).forEach(element => {
        ftddevicerevenuecount += element.BILL_COUNT;
		 ftddevicerevenueamount += element.AMOUNT;
    });
	

	

    ahctargetarr.forEach(element => {
        target += element.total;
		targetamount += element.amount;

    });


    tempObj.AHC = {
        branch: "AHC",
        ftdopdrev: opd,
        target: target,
        devicemtd: devicehistorycount,
        revenueftdcount: ftddevicerevenuecount,       
        revenueftdamount: ftddevicerevenueamount,
        deviceftd: devicehistorycount
    };
    (opd = 0), (devicehistorycount = 0),(mtddevicerevenuecount = 0), (mtddevicerevenueamount = 0);
    ahcrevarr.forEach(element => {
        opd += element.ftd_count;

    });
    ahcdevicehistoty.forEach(element => {
        devicehistorycount += element.device_daily_count;

    });

    ahcdevicerevenue.forEach(element => {
        mtddevicerevenuecount += element.BILL_COUNT;
		mtddevicerevenueamount += element.AMOUNT;
    });
	

    (tempObj.AHC.mtdopdrev = opd);
    (tempObj.AHC.devicemtd = devicehistorycount);
	(tempObj.AHC.revenuemtdcount = mtddevicerevenuecount);
	(tempObj.AHC.revenuemtdamount = mtddevicerevenueamount);
	(tempObj.AHC.targetamount = target*targetamount);	
	(tempObj.AHC.revenuetargetachived = Math.round(((mtddevicerevenuecount/target)*100)));

    /*for (let key in tempObj.AEH) {
      alin[key] = tempObj.AEH[key];
    }
    for (let key in tempObj.AHC) {
      alin["branch"] = "All India";
      alin[key] += tempObj.AHC[key];
    }*/

    (opd = 0), (devicehistorycount = 0), (target = 0),(targetamount = 0),(ftddevicerevenuecount = 0),(ftddevicerevenueamount = 0),(mtddevicerevenuecount = 0),(mtddevicerevenuecount = 0);
    ohcrevarr = _.filter(dbres2, {
        entity: "OHC"
    });

    ohcdevicehistoty = _.filter(resdevicehistory, {
        entity: "OHC"
    });
	
	
	
	ohcdevicerevenue = _.filter(resdevicerevenue, {
        entity: "OHC"
    });
	
	
    _.filter(ohcrevarr, {
        trans_date: ftddate
    }).forEach(element => {
        opd += element.ftd_count;

    });
	
	
	
	 _.filter(ohcdevicehistoty, {
        trans_date: ftddate
    }).forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	_.filter(ohcdevicerevenue, {
        trans_date: ftddate
    }).forEach(element => {
        ftddevicerevenuecount += element.BILL_COUNT;
		ftddevicerevenueamount += element.AMOUNT;
    });
	
    tempObj.OHC = {
        branch: "OHC",
        ftdopdrev: opd,
        target: 50,
        devicemtd: devicehistorycount,
        revenueftdcount: ftddevicerevenuecount,
		revenueftdamount: ftddevicerevenueamount,
        deviceftd: devicehistorycount
    };
    (opd = 0), (devicehistorycount = 0),(ftddevicerevenuecount = 0),(ftddevicerevenueamount = 0),(mtddevicerevenuecount = 0),(mtddevicerevenuecount = 0);
    ohcrevarr.forEach(element => {
        opd += element.ftd_count;

    });
    ohcdevicehistoty.forEach(element => {
        devicehistorycount += element.device_daily_count;

    });
	
	
	ohcdevicerevenue.forEach(element => {
        mtddevicerevenuecount += element.BILL_COUNT;
        mtddevicerevenueamount += element.AMOUNT;
    });
	
	
	(tempObj.OHC.mtdopdrev = opd);
    (tempObj.OHC.devicemtd = devicehistorycount);
	(tempObj.OHC.revenuemtdcount = mtddevicerevenuecount);
    (tempObj.OHC.revenuemtdamount = mtddevicerevenueamount);
	(tempObj.OHC.targetamount = target*targetamount);
	(tempObj.OHC.revenuetargetachived = Math.round(((mtddevicerevenuecount/target)*100)));
	
	
    alin["branch"] = "All India";
    alin['ftdopdrev'] = tempObj.AEH['ftdopdrev'] + tempObj.AHC['ftdopdrev'];
    alin['mtdopdrev'] = tempObj.AEH['mtdopdrev'] + tempObj.AHC['mtdopdrev'];
    alin['deviceftd'] = tempObj.AEH['deviceftd'] + tempObj.AHC['deviceftd'];
    alin['devicemtd'] = tempObj.AEH['devicemtd'] + tempObj.AHC['devicemtd'];
    alin['target'] = tempObj.AEH['target'] + tempObj.AHC['target'];

    let gropuftd = 0,
        gropumtd = 0,
        groupdeviceftd = 0,
        groupdevicemtd = 0;
    grouptarget = 0;

    gropuftd = tempObj.AEH['ftdopdrev'] + tempObj.AHC['ftdopdrev'] + tempObj.OHC['ftdopdrev'];
    gropumtd = tempObj.AEH['mtdopdrev'] + tempObj.AHC['mtdopdrev'] + tempObj.OHC['mtdopdrev'];
    groupdeviceftd = tempObj.AEH['deviceftd'] + tempObj.AHC['deviceftd'] + tempObj.OHC['deviceftd'];
    groupdevicemtd = tempObj.AEH['devicemtd'] + tempObj.AHC['devicemtd'] + tempObj.OHC['devicemtd'];
    grouptarget = tempObj.AEH['target'] + tempObj.AHC['target'] + tempObj.OHC['target'];

    group = {};

    group["branch"] = "Group";
    group['ftdopdrev'] = gropuftd;
    group['mtdopdrev'] = gropumtd;
    group['deviceftd'] = groupdeviceftd;
    group['devicemtd'] = groupdevicemtd;
    group['target'] = grouptarget;

    return {
        group: group,
        alin: alin,
        aeharr: aeharr,
        ahcarr: ahcarr,
        aeh: tempObj.AEH,
        ahc: tempObj.AHC,
        ohc: tempObj.OHC
    };
};




let filterGroupwiseUsageTrackerNew = async (
    aeh,
    ahc,
    dbres2,
    branches,
    ftddate,
    resdevicehistory,
    targetres,
	resdevicerevenue
) => {
    let ftdopd = 0,
        mtdopd = 0,
        ftddevicecount = 0,
        mtddevicecount = 0,
        aehtempObj = {},
        ahctempObj = {},
        ohctempObj = {},
       
        branchName = null,
        ftdopdrev = 0,
        mtdopdrev = 0,
        mtdopdrevlastyear = 0,
        target = 0,
		targetamount = 0,
		ftddevicerevenueamount=0,
		mtddevicerevenueamount=0,
		ftddevicerevenuecount=0,
		mtddevicerevenuecount=0,
        code = null;


    let aehGroups = [
        "chennai",
        "rotn"
    ];

    let ohcGroups = [
        "Madagascar",
        "Mozambique",
        "Nigeria",
        "Rwanda",
        "Mauritius",
        "Zambia",
        "Ghana",
        "Nairobi",
        "Uganda",
        "Tanzania"
    ];

    let ahcGroups = [
        "Chennai",
		"ROTN",
        "Banglore",
        "Hyderabad",
        "Kerala",
		"Maharashtra"
        //'Ambattur'
    ];
    let aehgroupedBranches = {
        "chennai": ["ASN", "TRC", "AVD", "TLR"],
        "rotn": ["KNP", "VLR", "KSN", "KBK", "HSR", "DHA"]

    };
    let ahcgroupedBranches = {
        "Chennai": ["MGP", "NWP", "AMB", "ADY", "TVT"],
        "ROTN": ["TVL","TPR"],
        Banglore: ["KML", "PNR", "RRN","SVR"],
        Hyderabad: ["DNR", "MDA", "SNR", "MPM", "GCB"],
        Kerala: ["KTM"],
		"Maharashtra":["VSH"]
        //,Ambattur : ['AMB']
    };


    let ohcgroupedBranches = {
        "Madagascar": ["MDR"],
        "Mozambique": ["MZQ", "BRA"],
        "Nigeria": ["NGA"],
        "Rwanda": ["RWD"],
        "Mauritius": ["EBN", "FLQ", "GDL"],
        "Zambia": ["ZMB"],
        "Ghana": ["GHA"],
        "Nairobi": ["NAB"],
        "Uganda": ["UGD"],
        "Tanzania": ["TZA"]
    };


    aehGroups.forEach(group => {
        aehtempObj[group] = {};
        aehgroupedBranches[group].forEach(branch => {

            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target += element.total;
					targetamount = element.amount;
                }
            );


            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftdopd += element.ftd_count;

                }
            );
			
			
			_.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicecount += element.device_daily_count;

                }
            );
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
					 ftddevicerevenueamount += element.AMOUNT;
                    ftddevicerevenuecount += element.BILL_COUNT;

                }
            );
			
		
            (aehtempObj[group].ftdopdrev = ftdopd);
            (aehtempObj[group].target = target);
			(aehtempObj[group].deviceftd = ftddevicecount);
			(aehtempObj[group].revenueftdcount = ftddevicerevenuecount);
			(aehtempObj[group].revenueftdamount = ftddevicerevenueamount);
			

            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {
                mtdopd += element.ftd_count;

            });


            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {
                mtddevicecount += element.device_daily_count;

            });
			
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
					mtddevicerevenueamount += element.AMOUNT;

                }
            );
			
			
			

            (aehtempObj[group].mtdopdrev = mtdopd),
            (aehtempObj[group].devicemtd = mtddevicecount),           
            (aehtempObj[group].entity = 'AEH'),          
            (aehtempObj[group].revenuemtdcount = mtddevicerevenuecount),           
            (aehtempObj[group].revenuemtdamount = mtddevicerevenueamount),
			(aehtempObj[group].revenuetargetachived = Math.round(((mtddevicerevenuecount/target)*100))),
			(aehtempObj[group].targetamount = target*targetamount),
			(aehtempObj[group].targetamountach = Math.round(((mtddevicerevenueamount/aehtempObj[group].targetamountach)*100))),
            (aehtempObj[group].branch = group);
        });
        (ftdopd = 0),
        (ftdopdrev = 0),
        (mtdopdrev = 0),
        (mtdopd = 0),
        (mtddevicecount = 0),
        (ftddevicecount = 0),
		(ftddevicerevenueamount=0),
		(mtddevicerevenueamount=0),
		(ftddevicerevenuecount=0),
		(mtddevicerevenuecount=0),
        (target = 0),
		(targetamount = 0);

    });
	
	
	let branchObj = [];
	
    for (let key in aehgroupedBranches) {
        //branchObj[key] = [];
        aehgroupedBranches[key].forEach(branch => {
            _.filter(branches, {
                code: branch
            }).forEach(element => {
                (branchName = element.branch), (code = element.code);
            });

            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target = element.total;
					targetamount = element.amount;
                }
            );




            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {

                    (ftdopdrev = element.ftd_count);
                }
            );
			
			
			 _.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {

                    (ftddevicecount += element.device_daily_count);
                }
            );
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicerevenuecount += element.BILL_COUNT;
					ftddevicerevenueamount += element.AMOUNT;

                }
            );
			
			
            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {

                (mtdopdrev += element.ftd_count);
            });


            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {

                (mtddevicecount += element.device_daily_count);
            });
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
                     mtddevicerevenueamount += element.AMOUNT;
                }
            );
			
            branchObj.push({
                branch: branchName,
				region:key,
                code: code,
                ftdopdrev: ftdopdrev,
                mtdopdrev: mtdopdrev,
                deviceftd: ftddevicecount,
                target: target,
                entity: 'AEH',
                devicemtd: mtddevicecount,              
                revenueftdcount: ftddevicerevenuecount,
                revenuemtdcount: mtddevicerevenuecount,                
                revenueftdamount: ftddevicerevenueamount,
                revenuemtdamount: mtddevicerevenueamount,
				targetamount : target * targetamount,
				targetamountach : Math.round(((mtddevicerevenueamount/(target * targetamount))*100)),
				revenuetargetachived : Math.round(((mtddevicerevenuecount/target)*100))
            });
            (ftdopd = 0),
            (mtdopd = 0),
            (ftdopdrev = 0),
            (mtdopdrev = 0),
            (ftddevicecount = 0),
            (mtddevicecount = 0),            
            (target = 0),
			(targetamount = 0),
			(ftddevicerevenueamount=0),
			(mtddevicerevenueamount=0),
			(ftddevicerevenuecount=0),
			(mtddevicerevenuecount=0),
            (code = null);
        });
    }
	
    for (let key in ahcgroupedBranches) {
        //branchObj[key] = [];
        ahcgroupedBranches[key].forEach(branch => {
            _.filter(branches, {
                code: branch
            }).forEach(element => {
                (branchName = element.branch), (code = element.code);
            });
			
			
            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {

                    (ftdopdrev = element.ftd_count);

                }
            );


            _.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {

                    (ftddevicecount += element.device_daily_count);

                }
            );
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicerevenuecount += element.BILL_COUNT;
                    ftddevicerevenueamount += element.AMOUNT;
                }
            );
			
			
            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target = element.total;
					targetamount = element.amount;
                }
            );


            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {
                (mtdopdrev += element.ftd_count);

            });

            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {
                (mtddevicecount += element.device_daily_count);

            });
			
			
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
					mtddevicerevenueamount += element.AMOUNT;

                }
            );	 

          

            branchObj.push({
                branch: branchName,
				region:key,
                code: code,
                ftdopdrev: ftdopdrev,
                mtdopdrev: mtdopdrev,
                deviceftd: ftddevicecount,
                target: target,
                entity: 'AHC',
                devicemtd: mtddevicecount,               
                revenueftdcount: ftddevicerevenuecount,
                revenuemtdcount: mtddevicerevenuecount,                
                revenueftdamount: ftddevicerevenueamount,
                revenuemtdamount: mtddevicerevenueamount,
				targetamount : target * targetamount,
				targetamountach : Math.round(((mtddevicerevenueamount/(target * targetamount))*100)),
				revenuetargetachived : Math.round(((mtddevicerevenuecount/target)*100)),
				

            });
			
			
            (ftdopd = 0),
            (ftdopdrev = 0),
            (mtdopdrev = 0),
            (mtdopd = 0),
            (mtddevicecount = 0),
            (ftddevicecount = 0),
            (target = 0),
			(targetamount = 0),
			(ftddevicerevenueamount=0),
			(mtddevicerevenueamount=0),
			(ftddevicerevenuecount=0),
			(mtddevicerevenuecount=0);

        });
    }

    ahcGroups.forEach(group => {
        ahctempObj[group] = {};
        ahcgroupedBranches[group].forEach(branch => {
            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftdopd += element.ftd_count;

                }
            );
			
			
			_.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicecount += element.device_daily_count;

                }
            );
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicerevenuecount += element.BILL_COUNT;
					ftddevicerevenueamount += element.AMOUNT;
                }
            );
			


            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target += element.total;
					targetamount = element.amount;
                }
            );



            (ahctempObj[group].ftdopdrev = ftdopd);
			(ahctempObj[group].deviceftd = ftddevicecount);
            (ahctempObj[group].target = target);
			(ahctempObj[group].revenueftdcount = ftddevicerevenuecount);
			(ahctempObj[group].revenueftdamount = ftddevicerevenueamount);

            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {
                mtdopd += element.ftd_count;

            });


            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {
                mtddevicecount += element.device_daily_count;

            });
			
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
					mtddevicerevenueamount += element.AMOUNT;

                }
            );	 
          

            (ahctempObj[group].mtdopdrev = mtdopd),            
            (ahctempObj[group].devicemtd = mtddevicecount),
            (ahctempObj[group].entity = 'AHC'),        
            (ahctempObj[group].revenuemtdcount = mtddevicerevenuecount),
			(ahctempObj[group].revenuemtdamount = mtddevicerevenueamount),
			(ahctempObj[group].revenuetargetachived = Math.round(((mtddevicerevenuecount/target)*100))),
			(ahctempObj[group].targetamountach = Math.round(((mtddevicerevenueamount/ahctempObj[group].targetamountach)*100))),
			(ahctempObj[group].targetamount = target * targetamount),
            (ahctempObj[group].branch = group);
        });
        (ftdopd = 0),
        (mtdopd = 0),
        (ftdopdrev = 0),
        (mtdopdrev = 0),
        (mtddevicecount = 0),
        (target = 0),
		(targetamount = 0),
        (ftddevicecount = 0),
		(ftddevicerevenueamount=0),
		(mtddevicerevenueamount=0),
		(ftddevicerevenuecount=0),
		(mtddevicerevenuecount=0);
    });

    ohcGroups.forEach(group => {
        ohctempObj[group] = {};
        ohcgroupedBranches[group].forEach(branch => {
            _.filter(dbres2, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftdopd += element.ftd_count;

                }
            );
			
			
			_.filter(resdevicehistory, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicecount += element.device_daily_count;

                }
            );
			
			
			_.filter(resdevicerevenue, {
                branch: branch,
                trans_date: ftddate
            }).forEach(
                element => {
                    ftddevicerevenuecount += element.BILL_COUNT;
					ftddevicerevenueamount += element.AMOUNT;
                }
            );


            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target += element.total;
					targetamount = element.amount;
                }
            );
			
			_.filter(resdevicerevenue, {
                branch: branch
            }).forEach(
                element => {
                    mtddevicerevenuecount += element.BILL_COUNT;
					mtddevicerevenueamount += element.AMOUNT;
                }
            );



            (ohctempObj[group].ftdopdrev = ftdopd);
			(ohctempObj[group].deviceftd = ftddevicecount);
            (ohctempObj[group].target = target);
			(ohctempObj[group].revenueftdcount = mtddevicerevenuecount);
            (ohctempObj[group].revenueftdamount = mtddevicerevenueamount);

            _.filter(dbres2, {
                branch: branch
            }).forEach(element => {
                mtdopd += element.ftd_count;

            });


            _.filter(resdevicehistory, {
                branch: branch
            }).forEach(element => {
                mtddevicecount += element.device_daily_count;

            });
           



            (ohctempObj[group].mtdopdrev = mtdopd),
            (ohctempObj[group].deviceftd = ftddevicecount),
            (ohctempObj[group].devicemtd = mtddevicecount),
            (ohctempObj[group].entity = 'OHC'),         
            (ohctempObj[group].revenuemtdcount = 0),
            (ohctempObj[group].revenuemtdamount = 0),            
			(ohctempObj[group].revenuetargetachived = Math.round(((mtddevicerevenuecount/target)*100))),    
            (ohctempObj[group].branch = group);
        });
        (ftdopd = 0),
        (ftdopdrev = 0),
        (mtdopdrev = 0),
        (mtdopd = 0),
        (mtddevicecount = 0),
        (ftddevicecount = 0),
		(ftddevicerevenueamount=0),
		(mtddevicerevenueamount=0),
		(ftddevicerevenuecount=0),
		(mtddevicerevenuecount=0),
        (target = 0),
		(targetamount = 0);

    });

    
    return {
        aeh: aehtempObj,
        ahc: ahctempObj,
        ohc: ohctempObj,
        branchwise: branchObj
    };
};


let totalUsageTracker = async (aehGroup,ahcGroup) =>{
	 let total = {};
	
	var totaloptdftd = 0,totaloptdmtd = 0,totaldeviceftd=0,totaldevicemtd=0,totalrevenueftdcount=0,totalrevenuemtdcount=0,totaltarget=0,totalrevenueftdamount=0,totalrevenuemtdamount=0,totaltargetamount=0;
	
	 
		  for (let key in aehGroup) {
			 totaloptdftd = totaloptdftd+aehGroup[key].ftdopdrev;
			 totaloptdmtd = totaloptdmtd+aehGroup[key].mtdopdrev;
			 totaldeviceftd = totaldeviceftd+aehGroup[key].deviceftd;
			 totaldevicemtd = totaldevicemtd+aehGroup[key].devicemtd;			 
			 totalrevenueftdcount = totalrevenueftdcount+aehGroup[key].revenueftdcount;
			 totalrevenuemtdcount = totalrevenuemtdcount+aehGroup[key].revenuemtdcount;
			 totaltarget = totaltarget+aehGroup[key].target;
			 totalrevenueftdamount = totalrevenueftdamount+aehGroup[key].revenueftdamount;
			 totalrevenuemtdamount = totalrevenuemtdamount+aehGroup[key].revenuemtdamount;
			 totaltargetamount = totaltargetamount+aehGroup[key].targetamount;
		  }		  
		  for (let key in ahcGroup) {	  
			  
			 totaloptdftd = totaloptdftd+ahcGroup[key].ftdopdrev;
			 totaloptdmtd = totaloptdmtd+ahcGroup[key].mtdopdrev;
			 totaldeviceftd = totaldeviceftd+ahcGroup[key].deviceftd;
			 totaldevicemtd = totaldevicemtd+ahcGroup[key].devicemtd;			 
			 totalrevenueftdcount = totalrevenueftdcount+ahcGroup[key].revenueftdcount;
			 totalrevenuemtdcount = totalrevenuemtdcount+ahcGroup[key].revenuemtdcount;
			 totaltarget = totaltarget+ahcGroup[key].target;
			 totalrevenueftdamount = totalrevenueftdamount+ahcGroup[key].revenueftdamount;
			 totalrevenuemtdamount = totalrevenuemtdamount+ahcGroup[key].revenuemtdamount;
			 totaltargetamount = totaltargetamount+ahcGroup[key].targetamount;
		  }
	 
	total['ftdopdrev'] = totaloptdftd;
	total['mtdopdrev'] = totaloptdmtd;
	total['deviceftd'] = totaldeviceftd;	
	total['devicemtd'] = totaldevicemtd;
	total['revenueftdcount'] = totalrevenueftdcount;
	total['revenuemtdcount'] = totalrevenuemtdcount;
	total['revenueftdamount'] = totalrevenueftdamount;
	total['revenuemtdamount'] = totalrevenuemtdamount;
	total['target'] = totaltarget;
	total['targetamount'] = totaltargetamount;
	total['targetamountach'] = Math.round(((totalrevenuemtdamount/totaltargetamount)*100)),
	total['revenuetargetachived'] = Math.round((totalrevenuemtdcount/totaltarget)*100);
	total['branch'] = 'Total';	
	return total;
}



exports.avaDemoEmail = async (finalResult,todatadate) => {
	console.log("final template");	
	let local_template_design = await emailTemplate(finalResult,todatadate);
	return local_template_design;
	
}
let emailTemplate = async (finalResult,todatadate) => {
	
	let  branchlist = finalResult.branchwise;
	
    let sortbranches = branchlist.slice().sort((a, b) => b.revenuemtdamount - a.revenuemtdamount);	
	
	
	let avaTemplate = "<html><body><table cellpadding='5' border='1' style='border-collapse: collapse;  border-spacing: 0;border-color: black'><tr><td></td><td></td><td></td><td colspan='2'><b>New OPD</b></td><td colspan='4' align='center'><b>Perimeter (Paid Count)</b></td><td colspan='4' align='center'><b>Perimeter Revenue (INR)	</b></td></tr><tr><td><b>Entity</b></td><td><b>Region</b></td><td><b>Branch</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>Target</b></td><td><b>Tar Ach%</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>Target Amount</b></td><td><b>Tar Ach%</b></td></tr>";
	
	avaTemplate+= '<tr><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">Total</td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center"></td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center"></td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ finalResult.total['ftdopdrev'] +'</td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ finalResult.total['mtdopdrev'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.total['revenueftdcount'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.total['revenuemtdcount'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.total['target'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.total['revenuetargetachived'] +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat('en-IN').format(finalResult.total['revenueftdamount']) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat('en-IN').format(finalResult.total['revenuemtdamount']) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat('en-IN').format(finalResult.total['targetamount']) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ finalResult.total['targetamountach'] +'</td></tr>';
	
	
	
	sortbranches.forEach(element => {
		avaTemplate+= '<tr><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">'+ element.entity +'</td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">'+ element.region +'</td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">'+ element.branch +'</td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ element.ftdopdrev +'</td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ element.mtdopdrev +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.revenueftdcount +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.revenuemtdcount +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.target +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.revenuetargetachived +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat('en-IN').format(element.revenueftdamount) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+  new Intl.NumberFormat('en-IN').format(element.revenuemtdamount) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat('en-IN').format(element.targetamount) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ element.targetamountach +'</td></tr>';    
	});
	
	avaTemplate+='</table><br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p></body></html>';
	return avaTemplate;	
	
	
}



