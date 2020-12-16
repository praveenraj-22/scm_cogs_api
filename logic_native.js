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
    "Port Blair",
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
    "Port Blair": ["AMN"],
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
	  "DWD",
      "MCC",
      "MYS",
	  "RJN",

    ],
    Banglore: ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK","SVR","BSK","RRN","RJN"],
    "Hubli + Mysore": ["HUB","DWD", "MCC", "MYS"],
	Maharashtra :["VSH", "PUN", "HDP","CMR"],
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
		  
		  //console.log(tempObject);
		  
		
		
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
  
  let tamilNaduBranches = await filterTamilNaduRevenue(dbres2, ftddate,lastyearopd,branches); 
  
  return {
	group: entityWise.group,
    alin: entityWise.alin,
    aeh: entityWise.aeh,
    ahc: entityWise.ahc,
	ohc: entityWise.ohc,
	allchennai: tamilNaduBranches.AllChennaiBranches,
	tnbranches: tamilNaduBranches.TNBranches,
	rotn: tamilNaduBranches.ROTNBranches,
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
  (tempObj.AEH.mtdopdpercentage = mtdGR(opd,opdlastyear));
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
  (tempObj.AHC.mtdopdpercentage = mtdGR(opd,opdlastyear));
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
  (tempObj.OHC.mtdopdpercentage = mtdGR(opd,opdlastyear));
  alin["branch"] = "All India";  
  alin['ftdopdrev'] =  tempObj.AEH['ftdopdrev']+tempObj.AHC['ftdopdrev']; 
  alin['mtdopdrev'] =  tempObj.AEH['mtdopdrev']+tempObj.AHC['mtdopdrev']; 
  alin['mtdopdrevlastyear'] =  tempObj.AEH['mtdopdrevlastyear']+tempObj.AHC['mtdopdrevlastyear'];
  alin['mtdopdpercentage'] = mtdGR(alin['mtdopdrev'],alin['mtdopdrevlastyear']);
  let gropuftd=0,
  gropumtd=0,
  groupmtdlastyear=0,
  groupmtdpercentage=0;
  
  gropuftd = tempObj.AEH['ftdopdrev']+tempObj.AHC['ftdopdrev']+tempObj.OHC['ftdopdrev'];
  gropumtd = tempObj.AEH['mtdopdrev']+tempObj.AHC['mtdopdrev']+tempObj.OHC['mtdopdrev'];
  groupmtdlastyear = tempObj.AEH['mtdopdrevlastyear']+tempObj.AHC['mtdopdrevlastyear']+tempObj.OHC['mtdopdrevlastyear'];
  groupmtdpercentage = mtdGR(gropumtd,groupmtdlastyear);
  
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
    "Port Blair",
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
    "Port Blair": ["AMN"],
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
	  "DWD",
      "MCC",
      "MYS",

    ],
    Banglore: ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK","SVR","BSK","RRN","RJN"],
    "Hubli + Mysore": ["HUB","DWD", "MCC", "MYS"],
	Maharashtra :["VSH", "PUN", "HDP","CMR" ],
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
    "Rwanda":["RWD","CGU"],
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
	  mtdopdpercentage = mtdGR(mtdopd,mtdopdlastyear);
	  
	  
	  
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
      
      mtdopdpercentage = mtdGR(mtdopdrev,mtdopdrevlastyear);
	  
      
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
     
      mtdopdpercentage = mtdGR(mtdopdrev,mtdopdrevlastyear);
	  
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
	   mtdopdpercentage = mtdGR(mtdopd,mtdopdlastyear);
	  
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
	  mtdopdpercentage = mtdGR(mtdopd,mtdopdlastyear);
	  
	  
	  
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
      
      mtdopdpercentage = mtdGR(mtdopdrev,mtdopdrevlastyear);
	  
      
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




let filterTamilNaduRevenue = async (dbres2, ftddate,lastyearopd,branches) => {
	
	let tntempObj = {};
	
	
	 tamilnaduGroups = [
    "All Chennai Branches",
	"ROTN Branches",
	"TN Branches"
 ]
  

	tamilnaduBranches = {
	"All Chennai Branches" :['CMH','ANN','ASN','AVD','NLR','PMB','PRR','TLR','TRC','VLC','TBM','ADY','EGM','MGP','NWP','AMB','TVT'],
    "ROTN Branches":['KNP','VLR','KBK','NVL','VPM','DHA','SLM','KSN','ERD','HSR','MDU','TVL','TCN','APM','TRI','TNJ','TPR','CMB'],
	"TN Branches":['CMH','ANN','ASN','AVD','NLR','PMB','PRR','TLR','TRC','VLC','TBM','ADY','EGM','MGP','NWP','AMB','TVT','KNP','VLR','KBK','NVL','VPM','DHA','SLM','KSN','ERD','HSR','MDU','TVL','TCN','APM','TRI','TNJ','TPR','CMB','PDY'],
  
  };
	
	tamilnaduGroups.forEach(group => {
	let tnftd=0,tnmtd=0,tnmtdlastyear=0,tnmtdpercetage=0,tntarget=0,tnmtdachived=0;
    tntempObj[group] = {};
    tamilnaduBranches[group].forEach(branch => {
		
		
      _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(
        element => {
          tnftd += element.ftd_count;
		  //target += element.target_amount;
          
        }
      );
      (tntempObj[group].ftdopdrev = tnftd);
        
      _.filter(dbres2, { branch: branch }).forEach(element => {
        tnmtd += element.ftd_count;
       
      });  
	  
	   _.filter(lastyearopd, { branch: branch }).forEach(element => {
        tnmtdlastyear += element.ftd_count;
       
      });
	  tnmtdpercetage = mtdGR(tnmtd,tnmtdlastyear);	  
      (tntempObj[group].mtdopdrev = tnmtd),
	  (tntempObj[group].mtdopdrevlastyear = tnmtdlastyear),
	  (tntempObj[group].mtdopdpercentage = tnmtdpercetage),	  
	  (tntempObj[group].branch = group);
    });   
      
  });    
  return {"AllChennaiBranches" : tntempObj["All Chennai Branches"],
  "ROTNBranches" : tntempObj["ROTN Branches"],
  "TNBranches" : tntempObj["TN Branches"]
  };    
 
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
    Karnataka:["BMH","BSK","CLR","HUB","DWD","INR","KML","MCC","MYS",
                "PNR","RJN","RRN","SVR","WFD","YLK" ],
    Maharashtra:["VSH","PUN","HDP","CMR"],
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

//console.log(alin);

//console.log(grouptempObj);
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
      Karnataka:["BMH","BSK","CLR","HUB","DWD","INR","KML","MCC","MYS",
                  "PNR","RJN","RRN","SVR","WFD","YLK" ],
      Maharashtra:["VSH","PUN","HDP","CMR"],
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
//console.log(branchObj);

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
        "rotn": ["KNP", "VLR", "KSN", "KBK","NVL", "HSR", "DHA"]

    };
    let ahcgroupedBranches = {
        "Chennai": ["MGP", "NWP", "AMB", "ADY", "TVT"],
        "ROTN": ["TVL","TPR"],
        Banglore: ["KML", "PNR", "RRN","SVR","DWD"],
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
    "Port Blair",
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
        "Port Blair": ["AMN"],
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
		  "DWD",
          "MCC",
          "MYS",

        ],
        Banglore: ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK","SVR","BSK","RRN","RJN"],
        "Hubli + Mysore": ["HUB","DWD", "MCC", "MYS"],
    	Maharashtra :["VSH", "PUN", "HDP","CMR"],
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


//console.log("");
//console.log("ftdopdcount : "+aehtempObj[group].ftdopdcount);
//console.log("ftdconsultcount : "+aehtempObj[group].ftdconsultcount);
//console.log("mtdopdcount : "+aehtempObj[group].mtdopdcount);
//console.log("mtdconsultcount : "+aehtempObj[group].mtdconsultcount);
//console.log("branch : "+aehtempObj[group].branch );
//console.log("");

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


//console.log("");
//console.log("ftdopdcount : "+ahctempObj[group].ftdopdcount);
//console.log("ftdconsultcount : "+ahctempObj[group].ftdconsultcount);
//console.log("mtdopdcount : "+ahctempObj[group].mtdopdcount);
//console.log("mtdconsultcount : "+ahctempObj[group].mtdconsultcount);
//console.log("branch : "+ahctempObj[group].branch );
//console.log("");

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


//console.log("");
//console.log("ftdopdcount : "+ohctempObj[group].ftdopdcount);
//console.log("ftdconsultcount : "+ohctempObj[group].ftdconsultcount);
//console.log("mtdopdcount : "+ohctempObj[group].mtdopdcount);
//console.log("mtdconsultcount : "+ohctempObj[group].mtdconsultcount);
//console.log("branch : "+ohctempObj[group].branch );
//console.log("");


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
	resdevicerevenue,
	currencyres,
	currencylastres

) => {
	
	let overseasCurrency = await overseasCurrencyConversion(ftddate,currencyres,currencylastres);
    let entityWise = await filterEntityUsageTrackerNew(dbres2, ftddate, resdevicehistory, targetres,resdevicerevenue);
    let groupWise = await filterGroupwiseUsageTrackerNew(
        entityWise.aeharr,
        entityWise.ahcarr,
        dbres2,
        branches,
        ftddate,
        resdevicehistory,
        targetres,
		resdevicerevenue,
		overseasCurrency
    );
	
	
	let totalWise = await totalUsageTracker(groupWise.aeh,groupWise.ahc);
	
	let totalOverseasWise = await totalOverseasUsageTracker(groupWise.overseaswise);
	

    return {
		total: totalWise,
		totalOverseas: totalOverseasWise,
        group: entityWise.group,
        alin: entityWise.alin,
        aeh: entityWise.aeh,
        ahc: entityWise.ahc,
        ohc: entityWise.ohc,
        aehgroup: groupWise.aeh,
        ahcgroup: groupWise.ahc,
        ohcgroup: groupWise.ohc,
        branchwise: groupWise.branchwise,
		overseaswise: groupWise.overseaswise
    };
};





let overseasCurrencyConversion = async (ftddate,currencyres,currencylastres) => {
	
	let overseasftd=0,overseasmtd=0,mozamftd=0,mozammtd=0,overseastempObj={},mauritiusftd=0,mauritiusmtd=0,overseaslasttempObj={},overseaslastftd=0,overseaslastmtd=0,overseas_last_arr=[];
	var lastdate = currencylastres[0].currency_date;
	
/*MZQ
BRA
NGA
RWD
EBN
FLQ
GDL
ZMB
GHA
NAB
UGD
TZA*/

//console.log(currencyres);

	let overseasCountryCode = ['MDR','NGA','RWD','ZMB','GHA','NAB','UGD','TZA','MZN','MUR'];
	//console.log(currencyres);
		overseasCountryCode.forEach(countrycode => {		
		   overseasftd=0,overseasmtd=0,overseaslastftd=0,overseaslastmtd=0;
		   overseastempObj[countrycode] = {};
      		_.filter(currencyres, { country_code: countrycode, currency_date: ftddate }).forEach(element => {
				overseasftd += parseFloat(element.INR_rate);
			})
			
			
			if(overseasftd==0){
				_.filter(currencylastres, { country_code: countrycode, currency_date: lastdate }).forEach(element => {				
				overseasftd = element.INR_rate;
				overseasmtd = element.INR_rate;
				})
			}else{
				let overseasarr = _.filter(currencyres, { country_code: countrycode })		
				overseasarr.forEach(element => {
					
					overseasmtd += parseFloat(element.INR_rate);
				})
				overseasmtd = overseasmtd/(overseasarr.length);
			}
			overseastempObj[countrycode].ftd = overseasmtd;
			overseastempObj[countrycode].mtd = overseasmtd;
			overseastempObj[countrycode].lastmtd = overseaslastmtd;
		})
	if((Object.keys(overseastempObj).length) > 0){
			overseastempObj['CGU'] = {'ftd' : overseastempObj.RWD.ftd,'mtd' :overseastempObj.RWD.mtd,'lastmtd':overseastempObj.RWD.lastmtd};
			overseastempObj['MZQ'] = {'ftd' : overseastempObj.MZN.ftd,'mtd' :overseastempObj.MZN.mtd,'lastmtd':overseastempObj.MZN.lastmtd};
			overseastempObj['BRA'] = {'ftd' : overseastempObj.MZN.ftd,'mtd' :overseastempObj.MZN.mtd,'lastmtd':overseastempObj.MZN.lastmtd};
			overseastempObj['GDL'] = {'ftd' : overseastempObj.MUR.ftd,'mtd' :overseastempObj.MUR.mtd,'lastmtd':overseastempObj.MUR.lastmtd};
			overseastempObj['FLQ'] = {'ftd' : overseastempObj.MUR.ftd,'mtd' :overseastempObj.MUR.mtd,'lastmtd':overseastempObj.MUR.lastmtd};
			overseastempObj['EBN'] = {'ftd' : overseastempObj.MUR.ftd,'mtd' :overseastempObj.MUR.mtd,'lastmtd':overseastempObj.MUR.lastmtd};
	}
	
	
	
	//console.log(overseastempObj);
	
	return overseastempObj;

}

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
	resdevicerevenue,
	overseasCurrency
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
        "rotn": ["KNP", "VLR", "KSN", "KBK","NVL", "HSR", "DHA"]

    };
    let ahcgroupedBranches = {
        "Chennai": ["MGP", "NWP", "AMB", "ADY", "TVT"],
        "ROTN": ["TVL","TPR"],
        Banglore: ["KML", "PNR", "RRN","SVR","DWD"],
        Hyderabad: ["DNR", "MDA", "SNR", "MPM", "GCB"],
        Kerala: ["KTM"],
		"Maharashtra":["VSH"]
        //,Ambattur : ['AMB']
    };


    let ohcgroupedBranches = {
        "Madagascar": ["MDR"],
        "Mozambique": ["MZQ", "BRA"],
        "Nigeria": ["NGA"],
        "Rwanda": ["RWD","CGU"],
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
			(aehtempObj[group].revenueftdamount = ftddevicerevenueamount.toFixed(2));
			

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
            (aehtempObj[group].revenuemtdamount = mtddevicerevenueamount.toFixed(2)),
			(aehtempObj[group].revenuetargetachived = Math.round(((mtddevicerevenuecount/target)*100))),
			(aehtempObj[group].targetamount = (target*targetamount).toFixed(2)),
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
			let avaregion='';
			
			if(key=='chennai'){
				avaregion='Chennai';
			}else if(key=='rotn'){
				avaregion='ROTN';
			}else{
				avaregion=key;
			}
            branchObj.push({
                branch: branchName,
				region:avaregion,
                code: code,
                ftdopdrev: ftdopdrev,
                mtdopdrev: mtdopdrev,
                deviceftd: ftddevicecount,
                target: target,
                entity: 'AEH',
                devicemtd: mtddevicecount,              
                revenueftdcount: ftddevicerevenuecount,
                revenuemtdcount: mtddevicerevenuecount,                
                revenueftdamount: ftddevicerevenueamount.toFixed(2),
                revenuemtdamount: mtddevicerevenueamount.toFixed(2),
				targetamount : (target * targetamount).toFixed(2),
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

            let avaregion='';
			
			if(key=='chennai'){
				avaregion='Chennai';
			}else if(key=='rotn'){
				avaregion='ROTN';
			}else{
				avaregion=key;
			}

            branchObj.push({
                branch: branchName,
				region:avaregion,
                code: code,
                ftdopdrev: ftdopdrev,
                mtdopdrev: mtdopdrev,
                deviceftd: ftddevicecount,
                target: target,
                entity: 'AHC',
                devicemtd: mtddevicecount,               
                revenueftdcount: ftddevicerevenuecount,
                revenuemtdcount: mtddevicerevenuecount,                
                revenueftdamount: ftddevicerevenueamount.toFixed(2),
                revenuemtdamount: mtddevicerevenueamount.toFixed(2),
				targetamount : (target * targetamount).toFixed(2),
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
			(ahctempObj[group].revenueftdamount = ftddevicerevenueamount.toFixed(2));

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
			(ahctempObj[group].revenuemtdamount = mtddevicerevenueamount.toFixed(2)),
			(ahctempObj[group].revenuetargetachived = Math.round(((mtddevicerevenuecount/target)*100))),
			(ahctempObj[group].targetamountach = Math.round(((mtddevicerevenueamount/ahctempObj[group].targetamountach)*100))),
			(ahctempObj[group].targetamount = (target * targetamount).toFixed(2)),
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
            (ohctempObj[group].revenueftdamount = mtddevicerevenueamount.toFixed(2));

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
	
	let overseasbranchObj=[];
	for (let key in ohcgroupedBranches) {
        //branchObj[key] = [];
        ohcgroupedBranches[key].forEach(branch => {
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
			
			
			if((Object.keys(overseasCurrency).length) > 0){		
				
                ftddevicerevenueamount = ftddevicerevenueamount*overseasCurrency[branch].ftd;
			}
			
			
			
			
            /* target */
            _.filter(targetres, {
                branch: branch
            }).forEach(
                element => {
                    target = 0;
					targetamount = 0;
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


			if((Object.keys(overseasCurrency).length) > 0){	
				
                mtddevicerevenueamount = mtddevicerevenueamount*overseasCurrency[branch].mtd;
			}

            let avaregion='';
			
			if(key=='chennai'){
				avaregion='Chennai';
			}else if(key=='rotn'){
				avaregion='ROTN';
			}else{
				avaregion=key;
			}

            overseasbranchObj.push({
                branch: branchName,
				region:avaregion,
                code: code,
                ftdopdrev: ftdopdrev,
                mtdopdrev: mtdopdrev,
                deviceftd: ftddevicecount,
                target: target,
                entity: 'AHC',
                devicemtd: mtddevicecount,               
                revenueftdcount: ftddevicerevenuecount,
                revenuemtdcount: mtddevicerevenuecount,                
                revenueftdamount: ftddevicerevenueamount.toFixed(2),
                revenuemtdamount: mtddevicerevenueamount.toFixed(2),
				targetamount : 0,
				targetamountach : 0,
				revenuetargetachived : 0,
				

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
	
	
	
	

    
    return {
        aeh: aehtempObj,
        ahc: ahctempObj,
        ohc: ohctempObj,
        branchwise: branchObj,
		overseaswise: overseasbranchObj
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
			 totalrevenueftdamount = (parseFloat(totalrevenueftdamount)+parseFloat(aehGroup[key].revenueftdamount)).toFixed(2);
			 totalrevenuemtdamount = (parseFloat(totalrevenuemtdamount)+parseFloat(aehGroup[key].revenuemtdamount)).toFixed(2);
			 totaltargetamount = (parseFloat(totaltargetamount)+parseFloat(aehGroup[key].targetamount)).toFixed(2);
		  }		  
		  for (let key in ahcGroup) {	  
			  
			 totaloptdftd = totaloptdftd+ahcGroup[key].ftdopdrev;
			 totaloptdmtd = totaloptdmtd+ahcGroup[key].mtdopdrev;
			 totaldeviceftd = totaldeviceftd+ahcGroup[key].deviceftd;
			 totaldevicemtd = totaldevicemtd+ahcGroup[key].devicemtd;			 
			 totalrevenueftdcount = totalrevenueftdcount+ahcGroup[key].revenueftdcount;
			 totalrevenuemtdcount = totalrevenuemtdcount+ahcGroup[key].revenuemtdcount;
			 totaltarget = totaltarget+ahcGroup[key].target;
			 totalrevenueftdamount = (parseFloat(totalrevenueftdamount)+parseFloat(ahcGroup[key].revenueftdamount)).toFixed(2);
			 totalrevenuemtdamount = (parseFloat(totalrevenuemtdamount)+parseFloat(ahcGroup[key].revenuemtdamount)).toFixed(2);
			 totaltargetamount = (parseFloat(totaltargetamount)+parseFloat(ahcGroup[key].targetamount)).toFixed(2);
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
	//console.log("final template");	
	let local_template_design = await emailTemplate(finalResult,todatadate);
	return local_template_design;
	
}
let emailTemplate = async (finalResult,todatadate) => {
	
	let  branchlist = finalResult.branchwise;
	
    let sortbranches = branchlist.slice().sort((a, b) => b.revenuemtdamount - a.revenuemtdamount);	
	
	
	let avaTemplate = "<html><body><table cellpadding='5' border='1' style='border-collapse: collapse;  border-spacing: 0;border-color: black'><tr><td></td><td></td><td></td><td colspan='2'><b>New OPD</b></td><td colspan='4' align='center'><b>Perimeter (Paid Count) <br>Individual Eye</b></td><td colspan='4' align='center'><b>Perimeter Revenue (INR)	</b></td></tr><tr><td><b>Entity</b></td><td><b>Region</b></td><td><b>Branch</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>Target</b></td><td><b>Tar Ach%</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>Target Amount</b></td><td><b>Tar Ach%</b></td></tr>";
	
	avaTemplate+= '<tr><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">Total</td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center"></td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center"></td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ finalResult.total['ftdopdrev'] +'</td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ finalResult.total['mtdopdrev'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.total['revenueftdcount'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.total['revenuemtdcount'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.total['target'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.total['revenuetargetachived'] +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat("en-IN").format(finalResult.total['revenueftdamount']) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat("en-IN").format(finalResult.total['revenuemtdamount']) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat("en-IN").format(finalResult.total['targetamount']) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ finalResult.total['targetamountach'] +'</td></tr>';
	
	
	
	sortbranches.forEach(element => {
		avaTemplate+= '<tr><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">'+ element.entity +'</td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">'+ element.region +'</td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">'+ element.branch +'</td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ element.ftdopdrev +'</td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ element.mtdopdrev +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.revenueftdcount +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.revenuemtdcount +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.target +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.revenuetargetachived +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat("en-IN").format(element.revenueftdamount) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+  new Intl.NumberFormat("en-IN").format(element.revenuemtdamount) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat("en-IN").format(element.targetamount) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ element.targetamountach +'</td></tr>';    
	});
	
	avaTemplate+='</table><br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p></body></html>';
	return avaTemplate;	
	
	
}



exports.revCogsServices = async (
    revresults,
    cogsres,
	revreferalres1,
	revreferalres2
	
) => {
    let groupWise = await filterGroupwiseRevVsCogs(  
        revresults,
        cogsres,
		revreferalres1,
		revreferalres2
    );
	
	return groupWise;
};




let filterGroupwiseRevVsCogs = async (
    revresults,
    cogsres,
	revreferalres1,
	revreferalres2
) => {
	 //console.log(22222);
    let mtdrev = 0,
        mtdcogs = 0,
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


    /*let servicesGroups = [
        "SERVICES",
        "CATARACT",
        "REFRACTIVE",
        "VR_INJ",
        "VR_SURGERY",
        "OTHER SURGERY",
        "OTHERS",
        "LABORATORY",		
		"PHARMACY",
		"CONTACT LENS"
		
    ];*/
	
	let servicesGroups = [
        "SERVICES",        
		"OPTICALS",		
		"PHARMACY",
		"CONTACT LENS"
		
    ];
	

    
   /* let servicesGroupsList = {
        "SERVICES": ["CATARACT","REFRACTIVE","VR_INJ","VR_SURGERY","LABORATORY"],
        "OPTICALS": [
            "OPTICAL FRAME",
            "OPTICAL LENS",
            "OPTICAL SUNGLASS",
           
        ],
        "PHARMACY": ["PHARMACY"],
        "CONTACT LENS": ["CONTACT LENS"]
    };*/
	
	
	 let servicesGroupsList = {
        "SERVICES": ["CATARACT","REFRACTIVE","VR_INJ","VR_SURGERY","OTHER SURGERY","OTHERS","LABORATORY",],
        "OPTICALS": [
		    "OPTICALS_LENS",
            "OPTICALS_FRAME",
			"OPTICALS_OTHERS",            
            "OPTICALS_SUNGLASS",
           
        ],
        "PHARMACY": ["PHARMACY"],
        "CONTACT LENS": ["CONTACT LENS"]
    };
   
   // var newItem1 = _.filter(result, obj => /REFRACTIVE/i.test(obj.name));


	let  CATARACTFilters = {
			UNIT : ["SURGERY"] ,
			GROUP : ["CATARACT"],
			SUBGROUP :['CATARACT','CATARACT - INVESTIGATION','CATARACT HIGH END','CATARACT LOW END','CATARACT MID END'] 			
	};
	let catractarrFilter1=[],
	 catractarrFilter2=[],
     vitrorentalFilter=[],
	 othersurgeryFilter=[],
	 otherServicesFilter=[],
	 otherServicesFilter1=[],
	 opticalothersFilter=[],
	 
	 
	 cogsCatractarrFilter1=[],
	 otherSurgeryFilter1=[],
	 otherSurgeryFilter2=[],
	 otherSurgeryFilter3=[],
	 cogsOtherOPticalFilter=[],
	  cogsOtherOPticalLensFilter=[],
	   cogsOtherOPticalFramFilter=[];
	 
	 
	vitrorentalFilter = _.filter(revresults, {UNIT:'SURGERY',GROUP: 'VITREO RETINAL'});
	othersurgeryFilter = _.filter(revresults, {UNIT:'SURGERY'});
	opticalothersFilter = _.filter(revresults, {UNIT:'OPTICALS'});	
	
	cogsCatractarrFilter1 = _.filter(cogsres, {'top':'OPERATION THEATRE',second:'Surgery'});
	
	cogsOtherOPticalFilter = _.filter(cogsres, {'top':'OPTICALS'});
	
	let excludeOpticals = ['OPTICAL SUNGLASS','OPTICAL FRAME','LENS'];
	let excludeOtherSurgery = ['CATARACT','REFRACTIVE','VITREO RETINAL'];
//console.log(_.filter(cogsOtherOPticalFilter, (v) => !_.includes(excludeOpticals, v.group)));
	
	//console.log(_.reject(cogsOtherOPticalFilter, {group:['OPTICAL SUNGLASS','OPTICAL FRAME']}));
	
	
	
	
	
	otherSurgeryFilter1 =_.reject(cogsCatractarrFilter1, obj => /CATARACT/i.test(obj.sub_group));
	otherSurgeryFilter2 = _.reject(otherSurgeryFilter1, obj => /REFRACTIVE/i.test(obj.sub_group));
	otherSurgeryFilter3 = _.reject(otherSurgeryFilter2, obj => /VR/i.test(obj.sub_group));
	
    for (let key in servicesGroupsList) {
        branchObj[key] = [];
        servicesGroupsList[key].forEach(servicelist => {            
            
			if(servicelist=='CATARACT'){
				/* revenue */			
				catractarrFilter1 = _.filter(revresults, {UNIT:'SURGERY',GROUP: 'CATARACT'});			
				_.reject(catractarrFilter1, {SUBGROUP:'OTHERS',SUBGROUP: 'RESURGERY'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});				
				/* revenue */
				
				/* cogs */				
				_.filter(cogsCatractarrFilter1, obj => /CATARACT/i.test(obj.group)).forEach(element => {
                mtdcogs += element.actual_value;
				});				
				/* cogs */
				
				
			}else if(servicelist=='REFRACTIVE'){
				/* revenue */
				_.filter(revresults, {UNIT:'SURGERY',GROUP: 'REFRACTIVE'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				
				/* cogs */		
				_.filter(cogsCatractarrFilter1, obj => /REFRACTIVE/i.test(obj.group)).forEach(element => {
                mtdcogs += element.actual_value;
				});				
				/* cogs */
			}else if(servicelist=='VR_INJ'){
                /* revenue */				
				_.filter(vitrorentalFilter, {SUBGROUP:'VR - INJECTION'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});				
				/* revenue */
				
				/* cogs */		
				_.filter(cogsCatractarrFilter1, {sub_group:'VR INJECTION'}).forEach(element => {
                mtdcogs += element.actual_value;
				});					
				/* cogs */
			}else if(servicelist=='VR_SURGERY'){
				/* revenue */
				_.reject(vitrorentalFilter, {SUBGROUP:'VR - INJECTION'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				/* cogs */		
				_.filter(cogsCatractarrFilter1, obj => /VR SURGERY/i.test(obj.group)).forEach(element => {
                mtdcogs += element.actual_value;
				});					
				/* cogs */
				
			}else if(servicelist=='OTHER SURGERY'){				
				/* revenue */
				_.filter(othersurgeryFilter, (v) => !_.includes(excludeOtherSurgery, v.GROUP)).forEach(element => {				
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				
				/* cogs */
				 otherSurgeryFilter3.forEach(element => {
					mtdcogs += element.actual_value;
				});	
				/* cogs */
				
				
				
				
			}else if(servicelist=='OTHERS'){  

				 otherServicesFilter1 = _.filter(revresults, (v) => !_.includes(['SURGERY','LABORATORY'], v.UNIT));
				 _.filter(otherServicesFilter1, obj => /SERV/i.test(obj.ITEMCODE)).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
			}else if(servicelist=='LABORATORY'){
				/* revenue */
				_.filter(revresults, {UNIT:'LABORATORY'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				
				
				/* cogs */
				_.filter(cogsres, {'top':'LABORATORY'}).forEach(element => {
                mtdcogs += element.actual_value;
				});
				/* cogs */
				
				
			}else if(servicelist=='OPTICALS_FRAME'){
				/* revenue */
				_.filter(revresults, {UNIT:'OPTICALS',GROUP: 'OPTICAL FRAME'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				
				/* cogs */
				_.filter(cogsOtherOPticalFilter, {group: 'OPTICAL FRAME'}).forEach(element => {
                mtdcogs += element.actual_value;
				});
				/* cogs */
				
				
			}else if(servicelist=='OPTICALS_LENS'){
				/* revenue */
				_.filter(revresults, {UNIT:'OPTICALS',GROUP: 'LENS'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				
				/* cogs */
				_.filter(cogsOtherOPticalFilter, {group: 'LENS'}).forEach(element => {
                mtdcogs += element.actual_value;
				});
				/* cogs */
			}
			else if(servicelist=='OPTICALS_OTHERS'){
				/* revenue */
				
				_.filter(opticalothersFilter, (v) => !_.includes(excludeOpticals, v.GROUP)).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				
				
				/* cogs */
				_.filter(cogsOtherOPticalFilter, (v) => !_.includes(excludeOpticals, v.group)).forEach(element => {
					mtdcogs += element.actual_value;
				});
				/* cogs */
				
			}else if(servicelist=='OPTICALS_SUNGLASS'){
				/* revenue */
				_.filter(revresults, {UNIT:'OPTICALS',GROUP: 'OPTICAL SUNGLASS'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				
				/* cogs */
				_.filter(cogsOtherOPticalFilter, {group: 'OPTICAL SUNGLASS'}).forEach(element => {
					mtdcogs += element.actual_value;
				});
				/* cogs */
			}else if(servicelist=='PHARMACY'){
				/* revenue */
				_.filter(revresults, {UNIT:'PHARMACY'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				
				
				/* cogs */
				_.filter(cogsres, {'top':'PHARMACY'}).forEach(element => {
					mtdcogs += element.actual_value;
				});
				/* cogs */
			}else if(servicelist=='CONTACT LENS'){
				/* revenue */
				_.filter(revresults, {UNIT:'CONTACT LENS',GROUP: 'CONTACT LENS'}).forEach(element => {
                mtdrev += element.NET_AMOUNT;
				});
				/* revenue */
				
				/* cogs */
				_.filter(cogsres, {'top':'OPTICALS',group: 'CONTACT LENS'}).forEach(element => {				
                mtdcogs += element.actual_value;
				});
				/* cogs */
				
				
			}			
            branchObj[key].push({
				branch: servicelist,           
                mtdrev: mtdrev,
				mtdcogs: mtdcogs,
				mc:(mtdcogs/mtdrev)*100,
				contribution: ''
               
            });
            (mtdrev = 0),            
            (mtdcogs = 0),
            (mtdopdrev = 0),
            (mtdopdrevlastyear = 0),
            (mtdopdlastyear = 0),
            (mtdopdpercentage = 0),
            (code = null);
        });
    }
	//console.log(aehtempObj);
    //console.log(branchObj);
	var billedrevmtd = 0,billedcogsmtd = 0;
	let billedObj={};
	let grpObj = {},
	grprevmtd=0,grpcogsmtd=0;
	
	
	for (let key in branchObj) {		 
		  branchObj[key].forEach(individual => { 
		  billedrevmtd = billedrevmtd+individual.mtdrev;    
		  billedcogsmtd = billedcogsmtd+individual.mtdcogs;    
			   
		  });
	 }
	 
	 let revreferalmtd = revreferalres1[0]['NET_AMOUNT'] - revreferalres2[0]['NET_AMOUNT'];
	 let cogsreferalmtd = (revreferalmtd/30)*100;
	 let refertalObject ={},withreferalObj={};
	 //console.log(revreferalres1[0]['NET_AMOUNT']);
	 //console.log(revreferalres2[0]['NET_AMOUNT']);
	billedObj['BILLED'] = {'branch':'BILLED','mtdrev':billedrevmtd,'mtdcogs':billedcogsmtd,mc:(billedcogsmtd/billedrevmtd)*100,'contribution':100}
	refertalObject['REFERRAL'] = {'branch':'REFERRAL','mtdrev':revreferalmtd,'mtdcogs':cogsreferalmtd,mc:'','contribution':''}
	
	let revwithrefmtd = billedrevmtd+revreferalmtd;
	let cogswithrefmtd = billedcogsmtd+cogsreferalmtd;
	withreferalObj['With REFERRAL'] = {'branch':'With REFERRAL',
										'mtdrev':revwithrefmtd,
										'mtdcogs':cogswithrefmtd,
										mc:(cogswithrefmtd/revwithrefmtd)*100,
										'contribution':''}
	/*console.log("--------------");
	console.log(branchObj);
	console.log("--------------");
	console.log(billedObj)
	console.log("--------------");*/
	 for (let key in branchObj) {
		 grpObj[key]=[];
		 //console.log(branchObj[key]);
		  branchObj[key].forEach(individual => {	 
			 grprevmtd+=individual.mtdrev;	
             grpcogsmtd+=individual.mtdcogs;				 
		  });
		   grpObj[key].push({
				branch: key,           
                mtdrev: grprevmtd,
				mtdcogs: grpcogsmtd,
				mc: (grpcogsmtd/grprevmtd)*100,
				contribution: (grprevmtd/billedObj.BILLED.mtdrev)*100
               
            });
		  
		  grprevmtd=0;
	 }
     
    
	 return {
        servicesGrp: grpObj,
		servicesWise: branchObj,
		BilledWise: billedObj,
		Referal :refertalObject,
		witReferal :withreferalObj
        
    };
};



exports.inactiveEmail = async (finalResult) => {
	//console.log("final template");	
	let inactive_template_design = await inactiveEmailTemplate(finalResult);
	return inactive_template_design;
	
}
let inactiveEmailTemplate = async (finalResult) => {

	let inactiveTemplate="<html><body><table cellpadding='5' border='1' style='border-collapse: collapse;  border-spacing: 0;border-color: black'><tr><td align='center'><b>Account ID</b></td><td align='center'><b>First Name </b></td><td align='center'><b>Last Name	</b></td><td align='center'><b>Organiztion </b></td><td align='center'><b>TimezoneId</b></td><td align='center'><b>Date</b></td></tr>";
	finalResult.forEach(element => {
		
		inactiveTemplate+= '<tr><td>'+element.LOGIN+'</td><td>'+element.FIRST_NAME+'</td><td>'+element.LAST_NAME+'</td><td >'+element.BRANCH+'</td><td>'+element.TIMEZONE+'</td><td>'+element.LAST_LOGIN+'</td></tr>';
		
	});
	
	inactiveTemplate+='</table><br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p></body></html>';
	
	return inactiveTemplate;
	
}



exports.avaOverseasEmail = async (finalResult,todatadate) => {
	//console.log("final template");	
	let local_template_design_overseas = await emailTemplateOverseas(finalResult,todatadate);
	return local_template_design_overseas;
	
}
let emailTemplateOverseas = async (finalResult,todatadate) => {
	
	let  branchlist = finalResult.overseaswise; 
	
	
	let avaTemplateOverseas = "<html><body><table cellpadding='5' border='1' style='border-collapse: collapse;  border-spacing: 0;border-color: black'><tr><td></td><td></td><td></td><td colspan='2'><b>New OPD</b></td><td colspan='4' align='center'><b>Perimeter (Paid Count) <br>Individual Eye</b></td><td colspan='4' align='center'><b>Perimeter Revenue (INR)</b></td></tr><tr><td><b>Entity</b></td><td><b>Region</b></td><td><b>Branch</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>Target</b></td><td><b>Tar Ach%</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>Target Amount</b></td><td><b>Tar Ach%</b></td></tr>";
	
	avaTemplateOverseas+= '<tr><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">Total</td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center"></td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center"></td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ finalResult.totalOverseas['ftdopdrev'] +'</td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ finalResult.totalOverseas['mtdopdrev'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.totalOverseas['revenueftdcount'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.totalOverseas['revenuemtdcount'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.totalOverseas['target'] +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ finalResult.totalOverseas['revenuetargetachived'] +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat("en-IN").format(finalResult.totalOverseas['revenueftdamount']) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat("en-IN").format(finalResult.totalOverseas['revenuemtdamount']) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat("en-IN").format(finalResult.totalOverseas['targetamount']) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ finalResult.totalOverseas['targetamountach'] +'</td></tr>';
	
	
	
	branchlist.forEach(element => {
		avaTemplateOverseas+= '<tr><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">'+ element.entity +'</td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">'+ element.region +'</td><td bgcolor="#a8afba" style="background:#a8afba!important;color:#000000;text-align:center">'+ element.branch +'</td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ element.ftdopdrev +'</td><td bgcolor="#cddc39" style="background:#cddc39!important;color:#000000;text-align:center">'+ element.mtdopdrev +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.revenueftdcount +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.revenuemtdcount +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.target +'</td><td bgcolor="#f0ae19" style="background:#f0ae19!important;color:#000000;text-align:center">'+ element.revenuetargetachived +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+new Intl.NumberFormat("en-IN").format(element.revenueftdamount)+'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+  new Intl.NumberFormat("en-IN").format(element.revenuemtdamount) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ new Intl.NumberFormat("en-IN").format(element.targetamount) +'</td><td bgcolor="#f7fcff" style="background:#f7fcff!important;color:#000000;text-align:center">'+ element.targetamountach +'</td></tr>';    
	});
	
	avaTemplateOverseas+='</table><br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p></body></html>';
	return avaTemplateOverseas;	
	
	
}


let totalOverseasUsageTracker = async (overseasGroup) =>{
	 let totalOverseas = {};
	
	var totaloptdftd = 0,totaloptdmtd = 0,totaldeviceftd=0,totaldevicemtd=0,totalrevenueftdcount=0,totalrevenuemtdcount=0,totaltarget=0,totalrevenueftdamount=0,totalrevenuemtdamount=0,totaltargetamount=0;
	
	 
		 
		  for (let key in overseasGroup) {	  
			  
			 totaloptdftd = totaloptdftd+overseasGroup[key].ftdopdrev;
			 totaloptdmtd = totaloptdmtd+overseasGroup[key].mtdopdrev;
			 totaldeviceftd = totaldeviceftd+overseasGroup[key].deviceftd;
			 totaldevicemtd = totaldevicemtd+overseasGroup[key].devicemtd;			 
			 totalrevenueftdcount = totalrevenueftdcount+overseasGroup[key].revenueftdcount;
			 totalrevenuemtdcount = totalrevenuemtdcount+overseasGroup[key].revenuemtdcount;
			 totaltarget = totaltarget+overseasGroup[key].target;
			 totalrevenueftdamount = (parseFloat(totalrevenueftdamount)+parseFloat(overseasGroup[key].revenueftdamount)).toFixed(2);
			 totalrevenuemtdamount =(parseFloat(totalrevenuemtdamount)+parseFloat(overseasGroup[key].revenuemtdamount)).toFixed(2);
			 totaltargetamount = totaltargetamount+overseasGroup[key].targetamount;
		  }
	 
	totalOverseas['ftdopdrev'] = totaloptdftd;
	totalOverseas['mtdopdrev'] = totaloptdmtd;
	totalOverseas['deviceftd'] = totaldeviceftd;	
	totalOverseas['devicemtd'] = totaldevicemtd;
	totalOverseas['revenueftdcount'] = totalrevenueftdcount;
	totalOverseas['revenuemtdcount'] = totalrevenuemtdcount;
	totalOverseas['revenueftdamount'] = totalrevenueftdamount;
	totalOverseas['revenuemtdamount'] = totalrevenuemtdamount;
	totalOverseas['target'] = 0;
	totalOverseas['targetamount'] = 0;
	totalOverseas['targetamountach'] = 0,
	totalOverseas['revenuetargetachived'] = 0;
	totalOverseas['branch'] = 'Total';	
	return totalOverseas;
}




exports.newOPDEmail = async (finalResult,yesterday) => {
	console.log("final template");	
	let local_template_design_opd = await emailTemplateOPD(finalResult,yesterday);
	return local_template_design_opd;
	
}
let emailTemplateOPD = async (finalResult,todatadate) => {	

    let dateArr = todatadate.split("-");
	let dateDay = dateArr[2];
    let dateMonth = dateArr[1];
    let dateYear = dateArr[0];
	var monthName = '';
	if(dateMonth==01){
		monthName='Jan';
	}else if(dateMonth==02){
		monthName='Feb';
	}else if(dateMonth==03){
		monthName='March';
	}else if(dateMonth==04){
		monthName='April';
	}else if(dateMonth==05){
		monthName='May';
	}else if(dateMonth==06){
		monthName='June';
	}else if(dateMonth==07){
		monthName='July';
	}else if(dateMonth==08){
		monthName='Aug';
	}else if(dateMonth==09){
		monthName='Sep';
	}else if(dateMonth==10){
		monthName='Oct';
	}else if(dateMonth==11){
		monthName='Nov';
	}else if(dateMonth==12){
		monthName='Dec';
	}
	
	
	let day = dateDay+' '+monthName+' '+dateYear;

    

	let cmh = finalResult.branchwise["Chennai Main Hospital"];
	let aeh_chennai = finalResult.aehgroup["Chennai Branches"];	
	let aeh_chennai_branches = finalResult.branchwise["Chennai Branches"];
	let kanchi_vel = finalResult.aehgroup["Kanchi + Vellore"];
	let kanchi_vel_branches = finalResult.branchwise["Kanchi + Vellore"];
	let kum_ney_vil = finalResult.aehgroup["Kum + Ney + Vil"];
	let kum_ney_vil_branches = finalResult.branchwise["Kum + Ney + Vil"];
	let dha_salem_krish = finalResult.aehgroup["Dha + Salem + Krish"];
	let dha_salem_krish_branches = finalResult.branchwise["Dha + Salem + Krish"];	
	let erod_hosure = finalResult.aehgroup["Erode + Hosur"];
	let erod_hosure_branches = finalResult.branchwise["Erode + Hosur"];
	let jaipur = finalResult.branchwise["Jaipur"];
	let madurai = finalResult.aehgroup["Madurai KK Nagar"];
	let ahc_chennai = finalResult.ahcgroup["Chennai branches"];
	let ahc_chennai_branches = finalResult.branchwise["Chennai branches"];
	let tirunelveli = finalResult.branchwise["Tirunelveli"];
	//let coim_trippur = finalResult.ahcgroup["Coimbatore + Tiruppur"];
	//let coim_trippur_branches = finalResult.branchwise["Coimbatore + Tiruppur"];
    let tiruppur = finalResult.branchwise["Tiruppur"];
	let coimbatore = finalResult.branchwise["Coimbatore"];
	
	
	let tuti_madurai = finalResult.ahcgroup["Tuticorin + Madurai"];
	let tuti_madurai_branches = finalResult.branchwise["Tuticorin + Madurai"].concat(finalResult.branchwise["Madurai KK Nagar"]);
	let trichy = finalResult.branchwise["Trichy"];
	let thanjavur = finalResult.branchwise["Thanjavur"];
	let andaman = finalResult.ahcgroup["Port Blair"];
	let karnataka = finalResult.ahcgroup["Karnataka"];
	let banglore = finalResult.ahcgroup["Banglore"];
	let banglore_branches = finalResult.branchwise["Banglore"];
	let hub_mys = finalResult.ahcgroup["Hubli + Mysore"];
	let hub_mys_branches = finalResult.branchwise["Hubli + Mysore"];
	let maharashtra = finalResult.ahcgroup["Maharashtra"];
	let maharashtra_branches = finalResult.branchwise["Maharashtra"];
	let telangana = finalResult.ahcgroup["Telangana"];
	let hyderabad = finalResult.ahcgroup["Hyderabad"];
	let hyderabad_branches = finalResult.branchwise["Hyderabad"];
	
	let andhra = finalResult.ahcgroup["Andhra Pradesh"];
	let andhra_branches = finalResult.branchwise["Andhra Pradesh"];
	let roi = finalResult.ahcgroup["Rest of India(incl. Jaipur)"];
	
	let kerla = finalResult.ahcgroup["Kerala"];
    let kerla_branches = finalResult.branchwise["Kerala"];
	
    let kolk = finalResult.ahcgroup["Kolkata"];
    let kolk_branches = finalResult.branchwise["Kolkata"];
   
    let ahmedabad = finalResult.branchwise["Ahmedabad"];
    let madhyapradesh = finalResult.ahcgroup["Madhya Pradesh"];
    let madhyapradesh_branches = finalResult.branchwise["Madhya Pradesh"];
    let odisha = finalResult.ahcgroup["Odisha"];
    let odisha_branches = finalResult.branchwise["Odisha"];	
	let pondycherry = finalResult.branchwise["Pondycherry"];
	
	let madagascar = finalResult.branchwise["Madagascar"];
	let mozambique = finalResult.ohcgroup["Mozambique"];
	let mozambique_branches = finalResult.branchwise["Mozambique"];
	let nigeria = finalResult.branchwise["Nigeria"];
	let rwanda = finalResult.ohcgroup["Rwanda"];
	let rwanda_branches = finalResult.branchwise["Rwanda"];
	let mauritius = finalResult.ohcgroup["Mauritius"];
	let mauritius_branches = finalResult.branchwise["Mauritius"];
	let zambia = finalResult.branchwise["Zambia"];
	let ghana = finalResult.branchwise["Ghana"];
	let nairobi = finalResult.branchwise["Nairobi"];
	let uganda = finalResult.branchwise["Uganda"];
	let tanzania = finalResult.branchwise["Tanzania"];



	
	let opdTemplate = "<html><body><table cellspacing='0'><tr><td colspan='5' style='text-align:left'><img src='https://mis.dragarwal.com/andaman/mis_logo.png'></td></tr><tr><td colspan='5'></br></td></tr></table><table cellpadding='5' border='1' style='border-collapse: collapse;  border-spacing: 0;border-color: black'><tr><td colspan='5' style='text-align:center'><b>DAILY NEW OPD REPORT AS ON "+ day +"<b></td></tr><tr><td><b>Branch</b></td><td><b>FTD</b></td><td><b>MTD</b></td><td><b>LYSMTD</b></td><td><b>MTD Gr.%</b></td></tr>";
	
	opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ finalResult.group['branch'] +'</td><td>'+ finalResult.group['ftdopdrev'] +'</td><td>'+ finalResult.group['mtdopdrev'] +'</td><td>'+ finalResult.group['mtdopdrevlastyear'] +'</td><td>'+ finalResult.group['mtdopdpercentage'] +'</td></tr>';
	
	
	opdTemplate+='<tr bgcolor="#f0ae19" style="background:#f0ae19!important;text-align:center;color:#FFFFFF"><td align="left">'+ finalResult.alin['branch'] +'</td><td>'+ finalResult.alin['ftdopdrev'] +'</td><td>'+ finalResult.alin['mtdopdrev'] +'</td><td>'+ finalResult.alin['mtdopdrevlastyear'] +'</td><td>'+ finalResult.alin['mtdopdpercentage'] +'</td></tr>';
	
	opdTemplate+='<tr bgcolor="#f0ae19" style="background:#f0ae19!important;text-align:center;color:#FFFFFF"><td align="left">'+ finalResult.aeh['branch'] +'</td><td>'+ finalResult.aeh['ftdopdrev'] +'</td><td>'+ finalResult.aeh['mtdopdrev'] +'</td><td>'+ finalResult.aeh['mtdopdrevlastyear'] +'</td><td>'+ finalResult.aeh['mtdopdpercentage'] +'</td></tr>';
	
	
	
	opdTemplate+='<tr  bgcolor="#f0ae19" style="background:#f0ae19!important;text-align:center;color:#FFFFFF"><td align="left">'+ finalResult.ahc['branch'] +'</td><td>'+ finalResult.ahc['ftdopdrev'] +'</td><td>'+ finalResult.ahc['mtdopdrev'] +'</td><td>'+ finalResult.ahc['mtdopdrevlastyear'] +'</td><td>'+ finalResult.ahc['mtdopdpercentage'] +'</td></tr>';
	
	opdTemplate+='<tr  bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ finalResult.ohc['branch'] +'</td><td>'+ finalResult.ohc['ftdopdrev'] +'</td><td>'+ finalResult.ohc['mtdopdrev'] +'</td><td>'+ finalResult.ohc['mtdopdrevlastyear'] +'</td><td>'+ finalResult.ohc['mtdopdpercentage'] +'</td></tr>';
	
	
	opdTemplate+='<tr bgcolor="#3a75b5" style="background:#3a75b5!important;text-align:center;color:#FFFFFF"><td align="left">'+ finalResult.allchennai['branch'] +'</td><td>'+ finalResult.allchennai['ftdopdrev'] +'</td><td>'+ finalResult.allchennai['mtdopdrev'] +'</td><td>'+ finalResult.allchennai['mtdopdrevlastyear'] +'</td><td>'+ finalResult.allchennai['mtdopdpercentage'] +'</td></tr>';
		
		
		opdTemplate+='<tr bgcolor="#3a75b5" style="background:#3a75b5!important;text-align:center;color:#FFFFFF"><td align="left">'+ finalResult.rotn['branch'] +'</td><td>'+ finalResult.rotn['ftdopdrev'] +'</td><td>'+ finalResult.rotn['mtdopdrev'] +'</td><td>'+ finalResult.rotn['mtdopdrevlastyear'] +'</td><td>'+ finalResult.rotn['mtdopdpercentage'] +'</td></tr>';
		
		opdTemplate+='<tr bgcolor="#3a75b5" style="background:#3a75b5!important;text-align:center;color:#FFFFFF"><td align="left">'+ finalResult.tnbranches['branch'] +'</td><td>'+ finalResult.tnbranches['ftdopdrev'] +'</td><td>'+ finalResult.tnbranches['mtdopdrev'] +'</td><td>'+ finalResult.tnbranches['mtdopdrevlastyear'] +'</td><td>'+ finalResult.tnbranches['mtdopdpercentage'] +'</td></tr>';	
	
	
	
	opdTemplate+=  '<tr  bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;text-align:center"><td align="left">'+ karnataka.branch +'</td><td>'+ karnataka.ftdopdrev +'</td><td>'+ karnataka.mtdopdrev +'</td><td>'+ karnataka.mtdopdrevlastyear +'</td><td>'+ karnataka.mtdopdpercentage +'</td></tr>';
		
		opdTemplate+=  '<tr bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;text-align:center"><td align="left">'+ maharashtra.branch +'</td><td>'+ maharashtra.ftdopdrev +'</td><td>'+ maharashtra.mtdopdrev +'</td><td>'+ maharashtra.mtdopdrevlastyear +'</td><td>'+ maharashtra.mtdopdpercentage +'</td></tr>';
		
		
		opdTemplate+=  '<tr bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;text-align:center"><td align="left">'+ telangana.branch +'</td><td>'+ telangana.ftdopdrev +'</td><td>'+ telangana.mtdopdrev +'</td><td>'+ telangana.mtdopdrevlastyear +'</td><td>'+ telangana.mtdopdpercentage +'</td></tr>';
		
		opdTemplate+=  '<tr bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;text-align:center"><td align="left">'+ andhra.branch +'</td><td>'+ andhra.ftdopdrev +'</td><td>'+ andhra.mtdopdrev +'</td><td>'+ andhra.mtdopdrevlastyear +'</td><td>'+ andhra.mtdopdpercentage +'</td></tr>';
		
		
		opdTemplate+=  '<tr bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;text-align:center"><td align="left">'+ kerla.branch +'</td><td>'+ kerla.ftdopdrev +'</td><td>'+ kerla.mtdopdrev +'</td><td>'+ kerla.mtdopdrevlastyear +'</td><td>'+ kerla.mtdopdpercentage +'</td></tr>';
		
		opdTemplate+=  '<tr bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;text-align:center"><td align="left">'+ kolk.branch +'</td><td>'+ kolk.ftdopdrev +'</td><td>'+ kolk.mtdopdrev +'</td><td>'+ kolk.mtdopdrevlastyear +'</td><td>'+ kolk.mtdopdpercentage +'</td></tr>';
		
		opdTemplate+=  '<tr  bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;text-align:center"><td align="left">'+ ahmedabad[0].branch +'</td><td>'+ ahmedabad[0].ftdopdrev +'</td><td>'+ ahmedabad[0].mtdopdrev +'</td><td>'+ ahmedabad[0].mtdopdrevlastyear +'</td><td>'+ ahmedabad[0].mtdopdpercentage +'</td></tr>';


		opdTemplate+=  '<tr  bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;text-align:center"><td align="left">'+ madhyapradesh.branch +'</td><td>'+ madhyapradesh.ftdopdrev +'</td><td>'+ madhyapradesh.mtdopdrev +'</td><td>'+ madhyapradesh.mtdopdrevlastyear +'</td><td>'+ madhyapradesh.mtdopdpercentage +'</td></tr>';
		
		opdTemplate+=  '<tr bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;text-align:center"><td align="left">'+ odisha.branch +'</td><td>'+ odisha.ftdopdrev +'</td><td>'+ odisha.mtdopdrev +'</td><td>'+ odisha.mtdopdrevlastyear +'</td><td>'+ odisha.mtdopdpercentage +'</td></tr>';
	
	opdTemplate+='<tr bgcolor="#3a75b5"  style="background:#3a75b5!important;color:#FFFFFF"><td>AEHL:</td><td></td><td></td><td></td><td></td></tr>';
	
	opdTemplate+='<tr style="text-align:center" style="color:#5d6476"><td align="left" style="color:#5d6476">'+ cmh[0].branch +'</td><td>'+ cmh[0].ftdopdrev +'</td><td>'+ cmh[0].mtdopdrev +'</td><td>'+ cmh[0].mtdopdrevlastyear +'</td><td>'+ cmh[0].mtdopdpercentage +'</td></tr>';
	
	opdTemplate+='<tr bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ aeh_chennai.branch +'</td><td>'+ aeh_chennai.ftdopdrev +'</td><td>'+ aeh_chennai.mtdopdrev +'</td><td>'+ aeh_chennai.mtdopdrevlastyear +'</td><td>'+ aeh_chennai.mtdopdpercentage +'</td></tr>';
	
	
	aeh_chennai_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';    
	});
	
	
    opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ kanchi_vel.branch +'</td><td>'+ kanchi_vel.ftdopdrev +'</td><td>'+ kanchi_vel.mtdopdrev +'</td><td>'+ kanchi_vel.mtdopdrevlastyear +'</td><td>'+ kanchi_vel.mtdopdpercentage +'</td></tr>';
	
	
	kanchi_vel_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});	
	
		
	opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ kum_ney_vil.branch +'</td><td>'+ kum_ney_vil.ftdopdrev +'</td><td>'+ kum_ney_vil.mtdopdrev +'</td><td>'+ kum_ney_vil.mtdopdrevlastyear +'</td><td>'+ kum_ney_vil.mtdopdpercentage +'</td></tr>';
	
	kum_ney_vil_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});
		
		
	opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ dha_salem_krish.branch +'</td><td>'+ dha_salem_krish.ftdopdrev +'</td><td>'+ dha_salem_krish.mtdopdrev +'</td><td>'+ dha_salem_krish.mtdopdrevlastyear +'</td><td>'+ dha_salem_krish.mtdopdpercentage +'</td></tr>';

		dha_salem_krish_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});
		
	opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ erod_hosure.branch +'</td><td>'+ erod_hosure.ftdopdrev +'</td><td>'+ erod_hosure.mtdopdrev +'</td><td>'+ erod_hosure.mtdopdrevlastyear +'</td><td>'+ erod_hosure.mtdopdpercentage +'</td></tr>';

		erod_hosure_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});
		
	opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ jaipur[0].branch +'</td><td>'+ jaipur[0].ftdopdrev +'</td><td>'+ jaipur[0].mtdopdrev +'</td><td>'+ jaipur[0].mtdopdrevlastyear +'</td><td>'+ jaipur[0].mtdopdpercentage +'</td></tr>';

		opdTemplate+=  '<tr bgcolor="#f0ae19" style="background:#f0ae19!important;color:#FFFFFF"><td>AHCL:</td><td></td><td></td><td></td><td></td></tr><tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ ahc_chennai.branch +'</td><td>'+ ahc_chennai.ftdopdrev +'</td><td>'+ ahc_chennai.mtdopdrev +'</td><td>'+ ahc_chennai.mtdopdrevlastyear +'</td><td>'+ ahc_chennai.mtdopdpercentage +'</td></tr>';
		
		
	ahc_chennai_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';    
		});

		opdTemplate+=  '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ pondycherry[0].branch +'</td><td>'+ pondycherry[0].ftdopdrev +'</td><td>'+ pondycherry[0].mtdopdrev +'</td><td>'+ pondycherry[0].mtdopdrevlastyear +'</td><td>'+ pondycherry[0].mtdopdpercentage +'</td></tr>';

		opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ tirunelveli[0].branch +'</td><td>'+ tirunelveli[0].ftdopdrev +'</td><td>'+ tirunelveli[0].mtdopdrev +'</td><td>'+ tirunelveli[0].mtdopdrevlastyear +'</td><td>'+ tirunelveli[0].mtdopdpercentage +'</td></tr>';

		opdTemplate+=  '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ tirunelveli[0].branch +'</td><td>'+ tirunelveli[0].ftdopdrev +'</td><td>'+ tirunelveli[0].mtdopdrev +'</td><td>'+ tirunelveli[0].mtdopdrevlastyear +'</td><td>'+ tirunelveli[0].mtdopdpercentage +'</td></tr>';


		opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ coimbatore[0].branch +'</td><td>'+ coimbatore[0].ftdopdrev +'</td><td>'+ coimbatore[0].mtdopdrev +'</td><td>'+ coimbatore[0].mtdopdrevlastyear +'</td><td>'+ coimbatore[0].mtdopdpercentage +'</td></tr>';
		
		opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ tiruppur[0].branch +'</td><td>'+ tiruppur[0].ftdopdrev +'</td><td>'+ tiruppur[0].mtdopdrev +'</td><td>'+ tiruppur[0].mtdopdrevlastyear +'</td><td>'+ tiruppur[0].mtdopdpercentage +'</td></tr>';
		
		
		opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ tuti_madurai.branch +'</td><td>'+ tuti_madurai.ftdopdrev +'</td><td>'+ tuti_madurai.mtdopdrev +'</td><td>'+ tuti_madurai.mtdopdrevlastyear +'</td><td>'+ tuti_madurai.mtdopdpercentage +'</td></tr>';

		tuti_madurai_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';    
		});


		opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ trichy[0].branch +'</td><td>'+trichy[0].ftdopdrev +'</td><td>'+ trichy[0].mtdopdrev +'</td><td>'+ trichy[0].mtdopdrevlastyear +'</td><td>'+ trichy[0].mtdopdpercentage +'</td></tr>';

		opdTemplate+=  '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ thanjavur[0].branch +'</td><td>'+ thanjavur[0].ftdopdrev +'</td><td>'+ thanjavur[0].mtdopdrev +'</td><td>'+ thanjavur[0].mtdopdrevlastyear +'</td><td>'+ thanjavur[0].mtdopdpercentage +'</td></tr>';


        opdTemplate+=  '<tr  bgcolor="#264e99" style="background:#264e99!important;color:#FFFFFF;text-align:center"><td align="left">'+ karnataka.branch +'</td><td>'+ karnataka.ftdopdrev +'</td><td>'+ karnataka.mtdopdrev +'</td><td>'+ karnataka.mtdopdrevlastyear +'</td><td>'+ karnataka.mtdopdpercentage +'</td></tr>';

		opdTemplate+=  '<tr bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ banglore.branch +'</td><td>'+ banglore.ftdopdrev +'</td><td>'+ banglore.mtdopdrev +'</td><td>'+ banglore.mtdopdrevlastyear +'</td><td>'+ banglore.mtdopdpercentage +'</td></tr>';


		banglore_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';    
		});


		opdTemplate+=  '<tr bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ hub_mys.branch +'</td><td>'+ hub_mys.ftdopdrev +'</td><td>'+ hub_mys.mtdopdrev +'</td><td>'+ hub_mys.mtdopdrevlastyear +'</td><td>'+ hub_mys.mtdopdpercentage +'</td></tr>';

		hub_mys_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});




		opdTemplate+=  '<tr bgcolor="#264e99" style="background:#264e99!important;color:#FFFFFF;text-align:center"><td align="left">'+ maharashtra.branch +'</td><td>'+ maharashtra.ftdopdrev +'</td><td>'+ maharashtra.mtdopdrev +'</td><td>'+ maharashtra.mtdopdrevlastyear +'</td><td>'+ maharashtra.mtdopdpercentage +'</td></tr>';

		maharashtra_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});


		opdTemplate+=  '<tr bgcolor="#264e99" style="background:#264e99!important;color:#FFFFFF;text-align:center"><td align="left">'+ telangana.branch +'</td><td>'+ telangana.ftdopdrev +'</td><td>'+ telangana.mtdopdrev +'</td><td>'+ telangana.mtdopdrevlastyear +'</td><td>'+ telangana.mtdopdpercentage +'</td></tr>';


		opdTemplate+=  '<tr bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ hyderabad.branch +'</td><td>'+ hyderabad.ftdopdrev +'</td><td>'+ hyderabad.mtdopdrev +'</td><td>'+ hyderabad.mtdopdrevlastyear +'</td><td>'+ hyderabad.mtdopdpercentage +'</td></tr>';


		hyderabad_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';    
		});
		
		
		opdTemplate+=  '<tr bgcolor="#264e99" style="background:#264e99!important;color:#FFFFFF;text-align:center"><td align="left">'+ andhra.branch +'</td><td>'+ andhra.ftdopdrev +'</td><td>'+ andhra.mtdopdrev +'</td><td>'+ andhra.mtdopdrevlastyear +'</td><td>'+ andhra.mtdopdpercentage +'</td></tr>';


		andhra_branches.forEach(element => {
		opdTemplate += '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';    
		});

		opdTemplate+=  '<tr bgcolor="#264e99" style="background:#264e99!important;color:#FFFFFF;text-align:center"><td align="left">'+ roi.branch +'</td><td>'+ roi.ftdopdrev +'</td><td>'+ roi.mtdopdrev +'</td><td>'+ roi.mtdopdrevlastyear +'</td><td>'+ roi.mtdopdpercentage +'</td></tr>';


		opdTemplate+=  '<tr bgcolor="#264e99" style="background:#264e99!important;color:#FFFFFF;text-align:center"><td align="left">'+ kerla.branch +'</td><td>'+ kerla.ftdopdrev +'</td><td>'+ kerla.mtdopdrev +'</td><td>'+ kerla.mtdopdrevlastyear +'</td><td>'+ kerla.mtdopdpercentage +'</td></tr>';

		kerla_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});

		opdTemplate+=  '<tr bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ kolk.branch +'</td><td>'+ kolk.ftdopdrev +'</td><td>'+ kolk.mtdopdrev +'</td><td>'+ kolk.mtdopdrevlastyear +'</td><td>'+ kolk.mtdopdpercentage +'</td></tr>';

		kolk_branches.forEach(element => {
		opdTemplate += '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		}); 	


		opdTemplate+=  '<tr  bgcolor="#7083a9" style="background:#7083a9!important;color:#FFFFFF;text-align:center"><td align="left">'+ ahmedabad[0].branch +'</td><td>'+ ahmedabad[0].ftdopdrev +'</td><td>'+ ahmedabad[0].mtdopdrev +'</td><td>'+ ahmedabad[0].mtdopdrevlastyear +'</td><td>'+ ahmedabad[0].mtdopdpercentage +'</td></tr>';


		opdTemplate+=  '<tr  bgcolor="#264e99" style="background:#264e99!important;color:#FFFFFF;text-align:center"><td align="left">'+ madhyapradesh.branch +'</td><td>'+ madhyapradesh.ftdopdrev +'</td><td>'+ madhyapradesh.mtdopdrev +'</td><td>'+ madhyapradesh.mtdopdrevlastyear +'</td><td>'+ madhyapradesh.mtdopdpercentage +'</td></tr>';

		madhyapradesh_branches.forEach(element => {
		opdTemplate += '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});
		
		
		
		opdTemplate+=  '<tr bgcolor="#264e99" style="background:#264e99!important;color:#FFFFFF;text-align:center"><td align="left">'+ odisha.branch +'</td><td>'+ odisha.ftdopdrev +'</td><td>'+ odisha.mtdopdrev +'</td><td>'+ odisha.mtdopdrevlastyear +'</td><td>'+ odisha.mtdopdpercentage +'</td></tr>';

		odisha_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5d6476">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});

		opdTemplate+= '<tr  bgcolor="#3a75b5" style="background:#3a75b5!important;color:#FFFFFF;"><td>OHCL:</td><td></td><td></td><td></td><td></td></tr>';

		opdTemplate+=  '<tr  bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ madagascar[0].branch +'</td><td>'+ madagascar[0].ftdopdrev +'</td><td>'+ madagascar[0].mtdopdrev +'</td><td>'+ madagascar[0].mtdopdrevlastyear +'</td><td>'+ madagascar[0].mtdopdpercentage +'</td></tr>';

		opdTemplate+=  '<tr bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ mozambique.branch +'</td><td>'+ mozambique.ftdopdrev +'</td><td>'+ mozambique.mtdopdrev +'</td><td>'+ mozambique.mtdopdrevlastyear +'</td><td>'+ mozambique.mtdopdpercentage +'</td></tr>';

		mozambique_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5b5e60">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});

		opdTemplate+=  '<tr bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ nigeria[0].branch +'</td><td>'+ nigeria[0].ftdopdrev +'</td><td>'+ nigeria[0].mtdopdrev +'</td><td>'+ nigeria[0].mtdopdrevlastyear +'</td><td>'+ nigeria[0].mtdopdpercentage +'</td></tr>';


		opdTemplate+=  '<tr bgcolor="#f9e699" style="background:#f9e699!important;text-align:center;"><td align="left" style="color:#5b5e60">'+ rwanda.branch +'</td><td>'+ rwanda.ftdopdrev +'</td><td>'+ rwanda.mtdopdrev +'</td><td>'+ rwanda.mtdopdrevlastyear +'</td><td>'+ rwanda.mtdopdpercentage +'</td></tr>';

		rwanda_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5b5e60">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});

		opdTemplate+=  '<tr bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ mauritius.branch +'</td><td>'+ mauritius.ftdopdrev +'</td><td>'+ mauritius.mtdopdrev +'</td><td>'+ mauritius.mtdopdrevlastyear +'</td><td>'+ mauritius.mtdopdpercentage +'</td></tr>';

		mauritius_branches.forEach(element => {
		opdTemplate+= '<tr style="text-align:center"><td align="left" style="color:#5b5e60">'+ element.branch +'</td><td>'+ element.ftdopdrev +'</td><td>'+ element.mtdopdrev +'</td><td>'+ element.mtdopdrevlastyear +'</td><td>'+ element.mtdopdpercentage +'</td></tr>';
		});

		opdTemplate+=  '<tr bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ zambia[0].branch +'</td><td>'+ zambia[0].ftdopdrev +'</td><td>'+ zambia[0].mtdopdrev +'</td><td>'+ zambia[0].mtdopdrevlastyear +'</td><td>'+ zambia[0].mtdopdpercentage +'</td></tr>';


		opdTemplate+=  '<tr bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ ghana[0].branch +'</td><td>'+ ghana[0].ftdopdrev +'</td><td>'+ ghana[0].mtdopdrev +'</td><td>'+ ghana[0].mtdopdrevlastyear +'</td><td>'+ ghana[0].mtdopdpercentage +'</td></tr>';


		opdTemplate+=  '<tr bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ nairobi[0].branch +'</td><td>'+ nairobi[0].ftdopdrev +'</td><td>'+ nairobi[0].mtdopdrev +'</td><td>'+ nairobi[0].mtdopdrevlastyear +'</td><td>'+ nairobi[0].mtdopdpercentage +'</td></tr>';


		opdTemplate+=  '<tr bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ uganda[0].branch +'</td><td>'+ uganda[0].ftdopdrev +'</td><td>'+ uganda[0].mtdopdrev +'</td><td>'+ uganda[0].mtdopdrevlastyear +'</td><td>'+ uganda[0].mtdopdpercentage +'</td></tr>';


		opdTemplate+='<tr bgcolor="#f9e699" style="background:#f9e699!important;text-align:center"><td align="left" style="color:#5b5e60">'+ tanzania[0].branch +'</td><td>'+ tanzania[0].ftdopdrev +'</td><td>'+ tanzania[0].mtdopdrev +'</td><td>'+ tanzania[0].mtdopdrevlastyear +'</td><td>'+ tanzania[0].mtdopdpercentage +'</td></tr>';



	
	opdTemplate+='</table><br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p></body></html>';
	return opdTemplate;	
	
	
}

function mtdGR(opd,opdlastyear){
	let monthGD = 0;
	monthGD = Math.round(((opd-opdlastyear)/ opdlastyear)*100);
	
	if(isNaN(monthGD)==true || monthGD=='Infinity' || monthGD=='-Infinity'){
		return '-';
	}else{
		return monthGD;
	}
}
