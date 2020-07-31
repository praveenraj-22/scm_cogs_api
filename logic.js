const _ = require('./modules')._
const connections = require('./modules').connections
const files = require('./modules').sqls
const session = require('./modules').cookieSession

exports.adminMain = async (dbres, dbres2, branches, ftddate, vobres, currencyres,currencylastres,breakupres, breakupmtdres) => { 
	
	
	let overseasCurrency = await overseasCurrencyConversion(ftddate,currencyres,currencylastres)
	let entityWise = await filterEntity(dbres, dbres2, ftddate,overseasCurrency)	
    let groupWise = await filterGroupwise(entityWise.aeharr, entityWise.ahcarr,entityWise.ohcarr, dbres2, branches, ftddate, vobres, breakupres, breakupmtdres, overseasCurrency)
    return { group: entityWise.group,alin: entityWise.alin, aeh: entityWise.aeh, ahc: entityWise.ahc, ohc: entityWise.ohc,ohcgroup: groupWise.ohc,aehgroup: groupWise.aeh, ahcgroup: groupWise.ahc, branchwise: groupWise.branchwise }
}

exports.othersMain = async (cogs, revenue, individual, group, branches, ftddate, vobres, breakupres, breakupmtdres) => {
    let branchWise = [], seperatedBranchWise = [], groupWise = [], mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtdrev = 0, mtd = 0, tempObj = {}, tempcogsdata = null, temprevdata = null, branchname = null, ftdotcount = 0, mtdotcount = 0, cogsmtdotcount = 0
    let groupBranchArr = [], branchHeadings = [], ftdpha = 0, ftdopt = 0, ftdot = 0, ftdlab = 0, ftd = 0, ftdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdotherrev = 0, ftdvobpha = 0, ftdvobcons = 0, ftdvoblab = 0, ftdvobopt = 0, ftdvobot = 0, ftdvobothers = 0, ftdvob = 0, cogsftdotcount = 0
    let shouldRemove = [], mappings = [], mtdpharev = 0, mtdoptrev = 0, mtdlabrev = 0, mtdotrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0
    if (group.length !== 0) {
        group.forEach(element => {
            if (element.split('=')[1].length === 3) {
                groupBranchArr.push(element.split('=')[1])
                shouldRemove.push(element.split('=')[1])
            }
            else {
                groupBranchArr.push(element.split('=')[1].split('+'))
            }
            branchHeadings.push(element.split('=')[0])
        })
    }
    group.forEach(element => {
        let head = element.split('=')[0]
        let group = element.split('=')[1]
        let obj = {}
        obj["heading"] = head
        obj["branches"] = group
        mappings.push(obj)
    })
    groupBranchArr.forEach(group => {
        if (typeof (group) === 'string') {
            group = [group]
        }
        group.forEach(branch => {
            let tempFiltercogs = _.filter(cogs, { branch: branch, trans_date: ftddate })
            if (tempFiltercogs.length !== 0) {
                tempFiltercogs.forEach(element => {
                    ftdpha += element.pharmacy,
                        ftdopt += element.opticals,
                        ftdot += element.operation_theatre,
                        ftdlab += element.laboratory,
                        ftd += element.ftd
                })
            }
            else {
                ftdpha += 0,
                    ftdopt += 0,
                    ftdot += 0,
                    ftdlab += 0,
                    ftd += 0
            }
            let tempFilterrev = _.filter(revenue, { branch: branch, trans_date: ftddate })
            if (tempFilterrev.length !== 0) {
                tempFilterrev.forEach(element => {
                    ftdrev += element.ftd
                    // ftdpharev += element.pharmacy,
                    // ftdoptrev += element.opticals,
                    // ftdotrev += element.surgery,
                    // ftdlabrev += element.laboratory,
                    // ftdconsultrev += element.consultation,
                    // ftdotherrev += element.others
                })
            }
            else {
                ftdrev += 0
                // ftdpharev += 0,
                // ftdoptrev += 0,
                // ftdotrev += 0,
                // ftdlabrev += 0,
                // ftdconsultrev += 0,
                // ftdotherrev += 0
            }
            // let tempFiltervob = _.filter(vobres, { billed: branch, trans_date: ftddate })
            // if (tempFiltervob.length !== 0) {
            //     tempFiltervob.forEach(element => {
            //         ftdvob += element.ftd,
            //             ftdvobpha += element.pharmacy,
            //             ftdvobopt += element.opticals,
            //             ftdvobot += element.surgery,
            //             ftdvoblab += element.laboratory,
            //             ftdvobcons += element.consultation,
            //             ftdvobothers += element.others,
            //             tempObj.ftd_vob_percent = cogsPercent(tempObj.ftd, tempObj.ftdvob)
            //     })
            // }
            // else {
            //     ftdvob = 0,
            //         ftdvobpha = 0,
            //         ftdvobopt = 0,
            //         ftdvobot = 0,
            //         ftdvoblab = 0,
            //         ftdvobcons = 0,
            //         ftdvobothers = 0,
            //         tempObj.ftd_vob_percent = 0
            // }

            // let tempFiltersurgres = _.filter(surgres, { BILLED: branch, transaction_date: ftddate })
            // if (tempFiltersurgres.length !== 0) {
            //     tempFiltersurgres.forEach(element => {
            //         ftdotcount += element.count
            //     })
            // }
            // else {
            //     ftdotcount = 0
            // }
            // let tempFiltercogsCount = _.filter(countres, { branch: branch, trans_date: ftddate })
            // if (tempFiltercogsCount.length !== 0) {
            //     tempFiltercogsCount.forEach(element => {
            //         cogsftdotcount += element.count
            //     })
            // }
            // else {
            //     cogsftdotcount = 0
            // }
            tempObj.branch = branch
            tempObj.ftdpha = ftdpha,
                tempObj.ftdopt = ftdopt,
                tempObj.ftdlab = ftdlab,
                tempObj.ftdot = ftdot,
                tempObj.ftd = ftd,
                tempObj.ftdrev = ftdrev,
                tempObj.ftd_cogs_percent = cogsPercent(ftd, ftdrev)
            // tempObj.ftdpharev = ftdpharev,
            // tempObj.ftdotrev = ftdotrev,
            // tempObj.ftdoptrev = ftdoptrev,
            // tempObj.ftdlabrev = ftdlabrev,
            // tempObj.ftdconsultrev = ftdconsultrev,
            // tempObj.ftdotherrev = ftdotherrev,
            // tempObj.ftdvob = ftdvob,
            // tempObj.ftdvobpha = ftdvobpha,
            // tempObj.ftdvobopt = ftdvobopt,
            // tempObj.ftdvobot = ftdvobot,
            // tempObj.ftdvoblab = ftdvoblab,
            // tempObj.ftdvobcons = ftdvobcons,
            // tempObj.ftdvobothers = ftdvobothers,
            // tempObj.ftdotcount = ftdotcount,
            // tempObj.cogsftdotcount = cogsftdotcount
            _.filter(cogs, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy,
                    mtdopt += element.opticals,
                    mtdot += element.operation_theatre,
                    mtdlab += element.laboratory,
                    mtd += element.ftd
            })

            _.filter(revenue, { branch: branch }).forEach(element => {
                mtdrev += element.ftd
                // mtdpharev += element.pharmacy,
                // mtdoptrev += element.opticals,
                // mtdotrev += element.surgery,
                // mtdlabrev += element.laboratory,
                // mtdconsultrev += element.consultation,
                // mtdothersrev += element.others
            })
            // _.filter(vobres, { billed: branch }).forEach(element => {
            //     mtdvob += element.ftd,
            //         mtdvobpha += element.pharmacy,
            //         mtdvobopt += element.opticals,
            //         mtdvobot += element.surgery,
            //         mtdvoblab += element.laboratory,
            //         mtdvobcons += element.consultation,
            //         mtdvobothers += element.others
            // })
            // _.filter(surgres, { BILLED: branch }).forEach(element => {
            //     mtdotcount += element.count
            // })
            // _.filter(countres, { branch: branch }).forEach(element => {
            //     cogsmtdotcount += element.count
            // })
            tempObj.mtdpha = mtdpha,
                tempObj.mtdopt = mtdopt,
                tempObj.mtdot = mtdot,
                tempObj.mtdlab = mtdlab,
                tempObj.mtd = mtd,
                tempObj.mtdrev = mtdrev,
                // tempObj.mtdpharev = mtdpharev,
                // tempObj.mtdoptrev = mtdoptrev,
                // tempObj.mtdlabrev = mtdlabrev,
                // tempObj.mtdotrev = mtdotrev,
                // tempObj.mtdothersrev = mtdothersrev,
                // tempObj.mtdconsultrev = mtdconsultrev,
                tempObj.mtd_cogs_percent = cogsPercent(mtd, mtdrev)
            // tempObj.mtdvob = mtdvob,
            // tempObj.mtdvobpha = mtdvobpha,
            // tempObj.mtdvobopt = mtdvobopt,
            // tempObj.mtdvoblab = mtdvoblab,
            // tempObj.mtdvobot = mtdvobot,
            // tempObj.mtdvobothers = mtdvobothers,
            // tempObj.mtdvobcons = mtdvobcons,
            // tempObj.mtd_vob_percent = cogsPercent(mtd, mtdvob),
            // tempObj.mtdotcount = mtdotcount,
            // tempObj.cogsmtdotcount = cogsmtdotcount
        })
        groupWise.push(tempObj)
        tempObj = {}, mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtd = 0, mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0, mtdotcount = 0, cogsmtdotcount = 0, ftdpha = 0, ftdopt = 0, ftdot = 0, ftdlab = 0, ftd = 0, ftdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdotherrev = 0, ftdvobpha = 0, ftdvobcons = 0, ftdvoblab = 0, ftdvobopt = 0, ftdvobot = 0, ftdvobothers = 0, ftdvob = 0, ftdotcount = 0, cogsftdotcount = 0
    })

    for (let i = 0; i < branchHeadings.length; i++) {
        groupWise[i].branch = branchHeadings[i]
    }

    individual.forEach(branch => {
        _.filter(branches, { code: branch }).forEach(ele => branchname = ele.branch)
        if (!shouldRemove.includes(branch)) {
            let tempFiltercogs = _.filter(cogs, { branch: branch, trans_date: ftddate })
            if (tempFiltercogs.length !== 0) {
                tempFiltercogs.forEach(element => {
                    tempObj.branch = branchname,
                        tempObj.code = branch,
                        tempObj.ftdpha = element.pharmacy,
                        tempObj.ftdopt = element.opticals,
                        tempObj.ftdot = element.operation_theatre,
                        tempObj.ftdlab = element.laboratory,
                        tempObj.ftd = element.ftd
                })
            }
            else {
                tempObj.branch = branchname,
                    tempObj.code = branch,
                    tempObj.ftdpha = 0,
                    tempObj.ftdopt = 0,
                    tempObj.ftdot = 0,
                    tempObj.ftdlab = 0,
                    tempObj.ftd = 0
            }
            let tempFileterev = _.filter(revenue, { branch: branch, trans_date: ftddate })
            if (tempFileterev.length !== 0) {
                tempFileterev.forEach(element => {
                    tempObj.ftdrev = element.ftd,
                        tempObj['ftdpharev'] = element.pharmacy,
                        tempObj['ftdoptrev'] = element.opticals,
                        tempObj['ftdotrev'] = element.surgery,
                        tempObj['ftdlabrev'] = element.laboratory,
                        tempObj['ftdconsultrev'] = element.consultation,
                        tempObj['ftdotherrev'] = element.others,
                        tempObj.ftd_cogs_percent = cogsPercent(tempObj.ftd, tempObj.ftdrev)
                })
            }
            else {
                tempObj.ftdrev = 0,
                    tempObj['ftdpharev'] = 0,
                    tempObj['ftdoptrev'] = 0,
                    tempObj['ftdotrev'] = 0,
                    tempObj['ftdlabrev'] = 0,
                    tempObj['ftdconsultrev'] = 0,
                    tempObj['ftdotherrev'] = 0,
                    tempObj.ftd_cogs_percent = 0
            }

            let tempFiltervob = _.filter(vobres, { billed: branch, trans_date: ftddate })
            if (tempFiltervob.length !== 0) {
                tempFiltervob.forEach(element => {
                    tempObj.ftdvob = element.ftd,
                        tempObj['ftdvobpha'] = element.pharmacy,
                        tempObj['ftdvobopt'] = element.opticals,
                        tempObj['ftdvobot'] = element.surgery,
                        tempObj['ftdvoblab'] = element.laboratory,
                        tempObj['ftdvobcons'] = element.consultation,
                        tempObj['ftdvobothers'] = element.others,
                        tempObj.ftd_vob_percent = cogsPercent(tempObj.ftd, tempObj.ftdvob)
                })
            }
            else {
                tempObj.ftdvob = 0,
                    tempObj['ftdvobpha'] = 0,
                    tempObj['ftdvobopt'] = 0,
                    tempObj['ftdvobot'] = 0,
                    tempObj['ftdvoblab'] = 0,
                    tempObj['ftdvobcons'] = 0,
                    tempObj['ftdvobothers'] = 0,
                    tempObj.ftd_vob_percent = 0
            }

            // let tempFiltersurgres = _.filter(surgres, { BILLED: branch, transaction_date: ftddate })
            // if (tempFiltersurgres.length !== 0) {
            //     tempFiltersurgres.forEach(element => {
            //         tempObj['ftdotcount'] = element.count
            //     })
            // }
            // else {
            //     tempObj.ftdotcount = 0
            // }
            // let tempFiltercogsCount = _.filter(countres, { branch: branch, trans_date: ftddate })
            // if (tempFiltercogsCount.length !== 0) {
            //     tempFiltercogsCount.forEach(element => {
            //         tempObj['cogsftdotcount'] = element.count
            //     })
            // }
            // else {
            //     tempObj.cogsftdotcount = 0
            // }

            let tempftdbreakup = _.filter(breakupres, { branch: branch, trans_date: ftddate })
            if (tempftdbreakup.length !== 0) {
                tempObj['ftdbreakup'] = tempftdbreakup
            }
            else {
                tempObj['ftdbreakup'] = 0
            }
            let tempmtdbreakup = _.filter(breakupmtdres, { branch: branch })
            if (tempmtdbreakup.length !== 0) {
                tempObj['mtdbreakup'] = tempmtdbreakup
            }
            else {
                tempObj['mtdbreakup'] = 0
            }

            _.filter(cogs, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy,
                    mtdopt += element.opticals,
                    mtdot += element.operation_theatre,
                    mtdlab += element.laboratory,
                    mtd += element.ftd
            })

            _.filter(revenue, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            _.filter(vobres, { billed: branch }).forEach(element => {
                mtdvob += element.ftd,
                    mtdvobpha += element.pharmacy,
                    mtdvobopt += element.opticals,
                    mtdvobot += element.surgery,
                    mtdvoblab += element.laboratory,
                    mtdvobcons += element.consultation,
                    mtdvobothers += element.others
            })
            // _.filter(surgres, { BILLED: branch }).forEach(element => {
            //     mtdotcount += element.count
            // })
            // _.filter(countres, { branch: branch }).forEach(element => {
            //     cogsmtdotcount += element.count
            // })
            tempObj.mtdpha = mtdpha,
                tempObj.mtdopt = mtdopt,
                tempObj.mtdot = mtdot,
                tempObj.mtdlab = mtdlab,
                tempObj.mtd = mtd,
                tempObj.mtdrev = mtdrev,
                tempObj.mtdpharev = mtdpharev,
                tempObj.mtdoptrev = mtdoptrev,
                tempObj.mtdlabrev = mtdlabrev,
                tempObj.mtdotrev = mtdotrev,
                tempObj.mtdothersrev = mtdothersrev,
                tempObj.mtdconsultrev = mtdconsultrev,
                tempObj.mtd_cogs_percent = cogsPercent(mtd, mtdrev),
                tempObj.mtdvob = mtdvob,
                tempObj.mtdvobpha = mtdvobpha,
                tempObj.mtdvobopt = mtdvobopt,
                tempObj.mtdvoblab = mtdvoblab,
                tempObj.mtdvobot = mtdvobot,
                tempObj.mtdvobothers = mtdvobothers,
                tempObj.mtdvobcons = mtdvobcons,
                tempObj.mtd_vob_percent = cogsPercent(mtd, mtdvob),
                // tempObj.mtdotcount = mtdotcount,
                // tempObj.cogsmtdotcount = cogsmtdotcount
                branchWise.push(tempObj)
            tempObj = {}, mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtd = 0, mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0, mtdotcount = 0, cogsmtdotcount = 0

        }
        else {
            let tempFiltercogs = _.filter(cogs, { branch: branch, trans_date: ftddate })
            if (tempFiltercogs.length !== 0) {
                tempFiltercogs.forEach(element => {
                    tempObj.branch = branchname,
                        tempObj.code = branch,
                        tempObj.ftdpha = element.pharmacy,
                        tempObj.ftdopt = element.opticals,
                        tempObj.ftdot = element.operation_theatre,
                        tempObj.ftdlab = element.laboratory,
                        tempObj.ftd = element.ftd
                })
            }
            else {
                tempObj.branch = branchname,
                    tempObj.code = branch,
                    tempObj.ftdpha = 0,
                    tempObj.ftdopt = 0,
                    tempObj.ftdot = 0,
                    tempObj.ftdlab = 0,
                    tempObj.ftd = 0
            }
            let tempFileterev = _.filter(revenue, { branch: branch, trans_date: ftddate })
            if (tempFileterev.length !== 0) {
                tempFileterev.forEach(element => {
                    tempObj.ftdrev = element.ftd,
                        tempObj['ftdpharev'] = element.pharmacy,
                        tempObj['ftdoptrev'] = element.opticals,
                        tempObj['ftdotrev'] = element.surgery,
                        tempObj['ftdlabrev'] = element.laboratory,
                        tempObj['ftdconsultrev'] = element.consultation,
                        tempObj['ftdotherrev'] = element.others,
                        tempObj.ftd_cogs_percent = cogsPercent(tempObj.ftd, tempObj.ftdrev)
                })
            }
            else {
                tempObj.ftdrev = 0,
                    tempObj['ftdpharev'] = 0,
                    tempObj['ftdoptrev'] = 0,
                    tempObj['ftdotrev'] = 0,
                    tempObj['ftdlabrev'] = 0,
                    tempObj['ftdconsultrev'] = 0,
                    tempObj['ftdotherrev'] = 0,
                    tempObj.ftd_cogs_percent = 0
            }

            let tempFiltervob = _.filter(vobres, { billed: branch, trans_date: ftddate })
            if (tempFiltervob.length !== 0) {
                tempFiltervob.forEach(element => {
                    tempObj.ftdvob = element.ftd,
                        tempObj['ftdvobpha'] = element.pharmacy,
                        tempObj['ftdvobopt'] = element.opticals,
                        tempObj['ftdvobot'] = element.surgery,
                        tempObj['ftdvoblab'] = element.laboratory,
                        tempObj['ftdvobcons'] = element.consultation,
                        tempObj['ftdvobothers'] = element.others,
                        tempObj.ftd_vob_percent = cogsPercent(tempObj.ftd, tempObj.ftdvob)
                })
            }
            else {
                tempObj.ftdvob = 0,
                    tempObj['ftdvobpha'] = 0,
                    tempObj['ftdvobopt'] = 0,
                    tempObj['ftdvobot'] = 0,
                    tempObj['ftdvoblab'] = 0,
                    tempObj['ftdvobcons'] = 0,
                    tempObj['ftdvobothers'] = 0,
                    tempObj.ftd_vob_percent = 0
            }

            // let tempFiltersurgres = _.filter(surgres, { BILLED: branch, transaction_date: ftddate })
            // if (tempFiltersurgres.length !== 0) {
            //     tempFiltersurgres.forEach(element => {
            //         tempObj['ftdotcount'] = element.count
            //     })
            // }
            // else {
            //     tempObj.ftdotcount = 0
            // }
            // let tempFiltercogsCount = _.filter(countres, { branch: branch, trans_date: ftddate })
            // if (tempFiltercogsCount.length !== 0) {
            //     tempFiltercogsCount.forEach(element => {
            //         tempObj['cogsftdotcount'] = element.count
            //     })
            // }
            // else {
            //     tempObj.cogsftdotcount = 0
            // }
            let tempFilterbreakupftd = _.filter(breakupres, { branch: branch, trans_date: ftddate })
            if (tempFilterbreakupftd.length !== 0) {
                tempObj['ftdbreakup'] = tempFilterbreakupftd
            }
            else {
                tempObj['ftdbreakup'] = 0
            }
            let tempFilterbreakupmtd = _.filter(breakupmtdres, { branch: branch })
            if (tempFilterbreakupmtd.length !== 0) {
                tempObj['mtdbreakup'] = tempFilterbreakupmtd
            }
            else {
                tempObj['mtdbreakup'] = 0
            }
            _.filter(cogs, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy,
                    mtdopt += element.opticals,
                    mtdot += element.operation_theatre,
                    mtdlab += element.laboratory,
                    mtd += element.ftd
            })

            _.filter(revenue, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            _.filter(vobres, { billed: branch }).forEach(element => {
                mtdvob += element.ftd,
                    mtdvobpha += element.pharmacy,
                    mtdvobopt += element.opticals,
                    mtdvobot += element.surgery,
                    mtdvoblab += element.laboratory,
                    mtdvobcons += element.consultation,
                    mtdvobothers += element.others
            })
            // _.filter(surgres, { BILLED: branch }).forEach(element => {
            //     mtdotcount += element.count
            // })
            // _.filter(countres, { branch: branch }).forEach(element => {
            //     cogsmtdotcount += element.count
            // })
            tempObj.mtdpha = mtdpha,
                tempObj.mtdopt = mtdopt,
                tempObj.mtdot = mtdot,
                tempObj.mtdlab = mtdlab,
                tempObj.mtd = mtd,
                tempObj.mtdrev = mtdrev,
                tempObj.mtdpharev = mtdpharev,
                tempObj.mtdoptrev = mtdoptrev,
                tempObj.mtdlabrev = mtdlabrev,
                tempObj.mtdotrev = mtdotrev,
                tempObj.mtdothersrev = mtdothersrev,
                tempObj.mtdconsultrev = mtdconsultrev,
                tempObj.mtd_cogs_percent = cogsPercent(mtd, mtdrev),
                tempObj.mtdvob = mtdvob,
                tempObj.mtdvobpha = mtdvobpha,
                tempObj.mtdvobopt = mtdvobopt,
                tempObj.mtdvoblab = mtdvoblab,
                tempObj.mtdvobot = mtdvobot,
                tempObj.mtdvobothers = mtdvobothers,
                tempObj.mtdvobcons = mtdvobcons,
                tempObj.mtd_vob_percent = cogsPercent(mtd, mtdvob),
                // tempObj.mtdotcount = mtdotcount,
                // tempObj.cogsmtdotcount = cogsmtdotcount
                seperatedBranchWise.push(tempObj)
            tempObj = {}, mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtd = 0, mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0, mtdotcount = 0, cogsmtdotcount = 0

        }
    })
    return { group: groupWise, branch: branchWise, mappings: mappings, specialBranch: _.uniqBy(seperatedBranchWise, 'code') }
}


let overseasCurrencyConversion = async (ftddate,currencyres,currencylastres) => {
	
	let overseasftd=0,overseasmtd=0,mozamftd=0,mozammtd=0,overseastempObj={},mauritiusftd=0,mauritiusmtd=0;
	
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


	let overseasCountryCode = ['MDR','NGA','RWD','ZMB','GHA','NAB','UGD','TZA'];
	var lastdate = currencylastres[0].currency_date;
	if((currencyres.length>0) && (ftddate>='2019-11-01')){
       		
		overseasCountryCode.forEach(countrycode => {		
		   overseasftd=0,overseasmtd=0;
		   overseastempObj[countrycode] = {};		
			_.filter(currencyres, { country_code: countrycode, currency_date: ftddate }).forEach(element => {
				overseasftd += element.INR_rate
			})


			if(overseasftd==0){
				_.filter(currencylastres, { country_code: countrycode, currency_date: lastdate }).forEach(element => {				
				overseasftd = element.INR_rate;
				overseasmtd = element.INR_rate;
				})
			}else{
				let overseasarr = _.filter(currencyres, { country_code: countrycode })		
				overseasarr.forEach(element => {
					
					overseasmtd += element.INR_rate
				})
				overseasmtd = overseasmtd/(overseasarr.length);
			}
			overseastempObj[countrycode].ftd = overseasftd;
			overseastempObj[countrycode].mtd = overseasmtd;
		})
		
		
		if((Object.keys(overseastempObj).length) > 0){		
			let mozamarr = _.filter(currencyres, { country_code: 'MZN' })
			_.filter(mozamarr, { currency_date: ftddate }).forEach(element => {
				mozamftd += element.INR_rate
			})
			

			if(mozamftd==0){	
				_.filter(currencylastres, { country_code: 'MZN', currency_date: lastdate }).forEach(element => {
						mozamftd = element.INR_rate;
						mozammtd = element.INR_rate;
						
				})
			}else{				
				mozamarr.forEach(element => {
				mozammtd += element.INR_rate;				
				})
				mozammtd = mozammtd/(mozamarr.length);
			}
			
			
			overseastempObj['MZQ']= {'ftd' : mozamftd,'mtd' :mozammtd};
			overseastempObj['BRA']= {'ftd' : mozamftd,'mtd' :mozammtd};
			overseastempObj['MZN']= {'ftd' : mozamftd,'mtd' :mozammtd};
			
			let mauritiusarr = _.filter(currencyres, { country_code: 'MUR' })
			_.filter(mauritiusarr, { currency_date: ftddate }).forEach(element => {
				mauritiusftd += element.INR_rate
			})
			

			if(mauritiusftd==0){	
				_.filter(currencylastres, { country_code: 'MUR', currency_date: lastdate }).forEach(element => {
						mauritiusftd = element.INR_rate;
						mauritiusmtd = element.INR_rate
				})
			}else{
				mauritiusarr.forEach(element => {
				mauritiusmtd += element.INR_rate;				
				})
				mauritiusmtd = mauritiusmtd/(mauritiusarr.length);
			}	
			overseastempObj['GDL']= {'ftd' : mauritiusftd,'mtd' :mauritiusmtd};
			overseastempObj['FLQ']= {'ftd' : mauritiusftd,'mtd' :mauritiusmtd};
			overseastempObj['EBN']= {'ftd' : mauritiusftd,'mtd' :mauritiusmtd};
			overseastempObj['MUR']= {'ftd' : mauritiusftd,'mtd' :mauritiusmtd};
		}
	}else if((currencyres.length==0) && (currencylastres.length>0) && (ftddate>='2019-11-01')){				
		overseasCountryCode.forEach(countrycode => {		
		   overseasftd=0,overseasmtd=0;
		   overseastempObj[countrycode] = {};		
			_.filter(currencylastres, { country_code: countrycode, currency_date: lastdate }).forEach(element => {
				overseasftd = element.INR_rate;
				overseasmtd = element.INR_rate;
			})			
			overseastempObj[countrycode].ftd = overseasftd;
			overseastempObj[countrycode].mtd = overseasmtd;
		})
		
		if((Object.keys(overseastempObj).length) > 0){		
				
			_.filter(currencylastres, { country_code: 'MZN', currency_date: lastdate }).forEach(element => {
					mozamftd = element.INR_rate;
					mozammtd = element.INR_rate;
					
			})			
			
			overseastempObj['MZQ']= {'ftd' : mozamftd,'mtd' :mozammtd};
			overseastempObj['BRA']= {'ftd' : mozamftd,'mtd' :mozammtd};
			overseastempObj['MZN']= {'ftd' : mozamftd,'mtd' :mozammtd};
			
				
			_.filter(currencylastres, { country_code: 'MUR', currency_date: lastdate }).forEach(element => {
					mauritiusftd = element.INR_rate;
					mauritiusmtd = element.INR_rate
			})
				
			overseastempObj['GDL']= {'ftd' : mauritiusftd,'mtd' :mauritiusmtd};
			overseastempObj['FLQ']= {'ftd' : mauritiusftd,'mtd' :mauritiusmtd};
			overseastempObj['EBN']= {'ftd' : mauritiusftd,'mtd' :mauritiusmtd};
			overseastempObj['MUR']= {'ftd' : mauritiusftd,'mtd' :mauritiusmtd};
		}
		
	}	
	
	
	return overseastempObj;

}




let filterEntity = async (dbres, dbres2, ftddate,overseasCurrency) => {
    let tempObj = {}, pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0, aeharr = [], aehrevarr = [], ahcrevarr = [], ahcarr = [], 
	ogharr = [], omaarr = [], omdarr = [], omzarr = [], orbarr = [], orwarr =[], otaarr = [], ougarr = [], ozaarr = [],
	oghrevarr = [], omarevarr = [], omdrevarr = [], omzrevarr = [], orbrevarr = [], orwrevarr =[], otarevarr = [], ougrevarr = [], ozarevarr = []
	
	alin = {},group = {}
	
	
	
	
    aeharr = _.filter(dbres, { entity: 'AEH' })
    _.filter(aeharr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    aehrevarr = _.filter(dbres2, { entity: 'AEH' })
    _.filter(aehrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.AEH = { branch: 'AEH', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    aeharr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    aehrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.AEH.mtdpha = pha, tempObj.AEH.mtdopt = opt, tempObj.AEH.mtdlab = lab, tempObj.AEH.mtdot = ot, tempObj.AEH.mtd = total, tempObj.AEH.mtdrev = rev, tempObj.AEH.mtd_cogs_percent = cogsPercent(total, rev)
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    ahcarr = _.filter(dbres, { entity: 'AHC' })
    _.filter(ahcarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    ahcrevarr = _.filter(dbres2, { entity: 'AHC' })
    _.filter(ahcrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.AHC = {
        branch: 'AHC', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev)
    }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    ahcarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    ahcrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.AHC.mtdpha = pha, tempObj.AHC.mtdopt = opt, tempObj.AHC.mtdlab = lab, tempObj.AHC.mtdot = ot, tempObj.AHC.mtd = total, tempObj.AHC.mtdrev = rev, tempObj.AHC.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	ogharr = _.filter(dbres, { entity: 'OGH' })
    _.filter(ogharr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    oghrevarr = _.filter(dbres2, { entity: 'OGH' })
    _.filter(oghrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.OGH = { branch: 'OGH', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    ogharr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    oghrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.OGH.mtdpha = pha, tempObj.OGH.mtdopt = opt, tempObj.OGH.mtdlab = lab, tempObj.OGH.mtdot = ot, tempObj.OGH.mtd = total, tempObj.OGH.mtdrev = rev, tempObj.OGH.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	omaarr = _.filter(dbres, { entity: 'OMA' })
    _.filter(omaarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    omarevarr = _.filter(dbres2, { entity: 'OMA' })
    _.filter(omarevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.OMA = { branch: 'OMA', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    omaarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    omarevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.OMA.mtdpha = pha, tempObj.OMA.mtdopt = opt, tempObj.OMA.mtdlab = lab, tempObj.OMA.mtdot = ot, tempObj.OMA.mtd = total, tempObj.OMA.mtdrev = rev, tempObj.OMA.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	omdarr = _.filter(dbres, { entity: 'OMD' })
    _.filter(omdarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    omdrevarr = _.filter(dbres2, { entity: 'OMD' })
    _.filter(omdrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.OMD = { branch: 'OMD', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    omdarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    omdrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.OMD.mtdpha = pha, tempObj.OMD.mtdopt = opt, tempObj.OMD.mtdlab = lab, tempObj.OMD.mtdot = ot, tempObj.OMD.mtd = total, tempObj.OMD.mtdrev = rev, tempObj.OMD.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	omzarr = _.filter(dbres, { entity: 'OMZ' })
    _.filter(omzarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    omzrevarr = _.filter(dbres2, { entity: 'OMZ' })
    _.filter(omzrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.OMZ = { branch: 'OMZ', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    omzarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    omzrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.OMZ.mtdpha = pha, tempObj.OMZ.mtdopt = opt, tempObj.OMZ.mtdlab = lab, tempObj.OMZ.mtdot = ot, tempObj.OMZ.mtd = total, tempObj.OMZ.mtdrev = rev, tempObj.OMZ.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	orbarr = _.filter(dbres, { entity: 'ORB' })
    _.filter(orbarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    orbrevarr = _.filter(dbres2, { entity: 'ORB' })
    _.filter(orbrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.ORB = { branch: 'ORB', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    orbarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    orbrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.ORB.mtdpha = pha, tempObj.ORB.mtdopt = opt, tempObj.ORB.mtdlab = lab, tempObj.ORB.mtdot = ot, tempObj.ORB.mtd = total, tempObj.ORB.mtdrev = rev, tempObj.ORB.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	let onaarr = _.filter(dbres, { entity: 'ONA' })
    _.filter(onaarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
	
    let onarevarr = _.filter(dbres2, { entity: 'ONA' })
    _.filter(onarevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
	
	
	
    tempObj.ONA = { branch: 'ONA', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    onaarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
	

	
    onarevarr.forEach(element => {
        rev += element.ftd
    })
	
	
    tempObj.ONA.mtdpha = pha, tempObj.ONA.mtdopt = opt, tempObj.ONA.mtdlab = lab, tempObj.ONA.mtdot = ot, tempObj.ONA.mtd = total, tempObj.ONA.mtdrev = rev, tempObj.ONA.mtd_cogs_percent = cogsPercent(total, rev)
	
	/* nirobi end */
	
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	orwarr = _.filter(dbres, { entity: 'ORW' })
    _.filter(orwarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    orwrevarr = _.filter(dbres2, { entity: 'ORW' })
    _.filter(orwrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.ORW = { branch: 'ORW', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    orwarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    orwrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.ORW.mtdpha = pha, tempObj.ORW.mtdopt = opt, tempObj.ORW.mtdlab = lab, tempObj.ORW.mtdot = ot, tempObj.ORW.mtd = total, tempObj.ORW.mtdrev = rev, tempObj.ORW.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	otaarr = _.filter(dbres, { entity: 'OTA' })
    _.filter(otaarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    otarevarr = _.filter(dbres2, { entity: 'OTA' })
    _.filter(otarevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.OTA = { branch: 'OTA', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    otaarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    otarevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.OTA.mtdpha = pha, tempObj.OTA.mtdopt = opt, tempObj.OTA.mtdlab = lab, tempObj.OTA.mtdot = ot, tempObj.OTA.mtd = total, tempObj.OTA.mtdrev = rev, tempObj.OTA.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	ougarr = _.filter(dbres, { entity: 'OUG' })
    _.filter(ougarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    ougrevarr = _.filter(dbres2, { entity: 'OUG' })
    _.filter(ougrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.OUG = { branch: 'OUG', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    ougarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    ougrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.OUG.mtdpha = pha, tempObj.OUG.mtdopt = opt, tempObj.OUG.mtdlab = lab, tempObj.OUG.mtdot = ot, tempObj.OUG.mtd = total, tempObj.OUG.mtdrev = rev, tempObj.OUG.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0	
	ozaarr = _.filter(dbres, { entity: 'OZA' })
    _.filter(ozaarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    ozarevarr = _.filter(dbres2, { entity: 'OZA' })
    _.filter(ozarevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.OZA = { branch: 'OZA', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    ozaarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    ozarevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.OZA.mtdpha = pha, tempObj.OZA.mtdopt = opt, tempObj.OZA.mtdlab = lab, tempObj.OZA.mtdot = ot, tempObj.OZA.mtd = total, tempObj.OZA.mtdrev = rev, tempObj.OZA.mtd_cogs_percent = cogsPercent(total, rev)
	
	
	
	
	let ohcftdpha = 0, ohcftdopt = 0, ohcftdlab = 0, ohcftdot = 0, ohcftdtotal = 0, ohcftdrev = 0
	
	
	
	ohcftdpha = tempObj.OGH['ftdpha'] + tempObj.OMA['ftdpha'] + tempObj.OMD['ftdpha'] + tempObj.OMZ['ftdpha'] + tempObj.ORB['ftdpha'] + tempObj.ONA['ftdpha'] + tempObj.ORW['ftdpha'] +  tempObj.OTA['ftdpha'] + tempObj.OUG['ftdpha'] + tempObj.OZA['ftdpha']; 
	
	
	if((Object.keys(overseasCurrency).length) > 0){
		ohcftdpha = (tempObj.OGH['ftdpha']*overseasCurrency.GHA.ftd) + 
		(tempObj.OMA['ftdpha']*overseasCurrency.MUR.ftd) + 
		(tempObj.OMD['ftdpha']*overseasCurrency.MDR.ftd) + 
		(tempObj.OMZ['ftdpha']*overseasCurrency.MZN.ftd) + 
		(tempObj.ORB['ftdpha']*overseasCurrency.NAB.ftd) + 
		(tempObj.ONA['ftdpha']*overseasCurrency.NAB.ftd) + 
		(tempObj.ORW['ftdpha']*overseasCurrency.RWD.ftd) +  
		(tempObj.OTA['ftdpha']*overseasCurrency.TZA.ftd) + 
		(tempObj.OUG['ftdpha']*overseasCurrency.UGD.ftd) + 
		(tempObj.OZA['ftdpha']*overseasCurrency.ZMB.ftd);
	}
	
	ohcftdopt = tempObj.OGH['ftdopt'] + tempObj.OMA['ftdopt'] + tempObj.OMD['ftdopt'] + tempObj.OMZ['ftdopt'] + tempObj.ORB['ftdopt'] + tempObj.ONA['ftdopt'] + tempObj.ORW['ftdopt'] +  tempObj.OTA['ftdopt'] +  tempObj.OUG['ftdopt'] + tempObj.OZA['ftdopt'];
	
	if((Object.keys(overseasCurrency).length) > 0){
		ohcftdopt = (tempObj.OGH['ftdopt']*overseasCurrency.GHA.ftd) + 
		(tempObj.OMA['ftdopt']*overseasCurrency.MUR.ftd) + 
		(tempObj.OMD['ftdopt']*overseasCurrency.MDR.ftd) + 
		(tempObj.OMZ['ftdopt']*overseasCurrency.MZN.ftd) + 
		(tempObj.ORB['ftdopt']*overseasCurrency.NAB.ftd) + 
		(tempObj.ONA['ftdopt']*overseasCurrency.NAB.ftd) + 
		(tempObj.ORW['ftdopt']*overseasCurrency.RWD.ftd) +  
		(tempObj.OTA['ftdopt']*overseasCurrency.TZA.ftd) +  
		(tempObj.OUG['ftdopt']*overseasCurrency.UGD.ftd) + 
		(tempObj.OZA['ftdopt']*overseasCurrency.ZMB.ftd);
	}
	
	 ohcftdlab = tempObj.OGH['ftdlab'] + tempObj.OMA['ftdlab'] + tempObj.OMD['ftdlab'] + tempObj.OMZ['ftdlab'] + tempObj.ORB['ftdlab'] + tempObj.ONA['ftdlab'] + tempObj.ORW['ftdlab'] +  tempObj.OTA['ftdlab'] +  tempObj.OUG['ftdlab'] + tempObj.OZA['ftdlab'];
	 
	 if((Object.keys(overseasCurrency).length) > 0){
		 ohcftdlab = (tempObj.OGH['ftdlab']*overseasCurrency.GHA.ftd) + 
		 (tempObj.OMA['ftdlab']*overseasCurrency.MUR.ftd) + 
		 (tempObj.OMD['ftdlab']*overseasCurrency.MDR.ftd) + 
		 (tempObj.OMZ['ftdlab']*overseasCurrency.MZN.ftd) + 
		 (tempObj.ORB['ftdlab']*overseasCurrency.NAB.ftd) + 
		 (tempObj.ONA['ftdlab']*overseasCurrency.NAB.ftd) + 
		 (tempObj.ORW['ftdlab']*overseasCurrency.RWD.ftd) +  
		 (tempObj.OTA['ftdlab']*overseasCurrency.TZA.ftd) +  
		 (tempObj.OUG['ftdlab']*overseasCurrency.UGD.ftd) + 
		 (tempObj.OZA['ftdlab']*overseasCurrency.ZMB.ftd);
	 }
	
	ohcftdot = tempObj.OGH['ftdot'] + tempObj.OMA['ftdot'] + tempObj.OMD['ftdot'] + tempObj.OMZ['ftdot'] + tempObj.ORB['ftdot'] + tempObj.ONA['ftdot'] + tempObj.ORW['ftdot'] +  tempObj.OTA['ftdot'] +  tempObj.OUG['ftdot'] + tempObj.OZA['ftdot']; 
	
	 if((Object.keys(overseasCurrency).length) > 0){
		 ohcftdot = (tempObj.OGH['ftdot']*overseasCurrency.GHA.ftd) + 
		 (tempObj.OMA['ftdot']*overseasCurrency.MUR.ftd) + 
		 (tempObj.OMD['ftdot']*overseasCurrency.MDR.ftd) + 
		 (tempObj.OMZ['ftdot']*overseasCurrency.MZN.ftd) + 
		 (tempObj.ORB['ftdot']*overseasCurrency.NAB.ftd) + 
		 (tempObj.ONA['ftdot']*overseasCurrency.NAB.ftd) + 
		 (tempObj.ORW['ftdot']*overseasCurrency.RWD.ftd) +  
		 (tempObj.OTA['ftdot']*overseasCurrency.TZA.ftd) +  
		 (tempObj.OUG['ftdot']*overseasCurrency.UGD.ftd) + 
		 (tempObj.OZA['ftdot']*overseasCurrency.ZMB.ftd); 
		 
	 }
	
	ohcftdtotal = tempObj.OGH['ftd'] + tempObj.OMA['ftd'] + tempObj.OMD['ftd'] + tempObj.OMZ['ftd'] + tempObj.ORB['ftd'] + tempObj.ONA['ftd'] + tempObj.ORW['ftd'] +  tempObj.OTA['ftd'] +  tempObj.OUG['ftd'] + tempObj.OZA['ftd'];
	
	if((Object.keys(overseasCurrency).length) > 0){
		ohcftdtotal = (tempObj.OGH['ftd']*overseasCurrency.GHA.ftd) + 
		(tempObj.OMA['ftd']*overseasCurrency.MUR.ftd) + 
		(tempObj.OMD['ftd']*overseasCurrency.MDR.ftd) + 
		(tempObj.OMZ['ftd']*overseasCurrency.MZN.ftd) + 
		(tempObj.ORB['ftd']*overseasCurrency.NAB.ftd) + 
		(tempObj.ONA['ftd']*overseasCurrency.NAB.ftd) + 
		(tempObj.ORW['ftd']*overseasCurrency.RWD.ftd) +  
		(tempObj.OTA['ftd']*overseasCurrency.TZA.ftd) +  
		(tempObj.OUG['ftd']*overseasCurrency.UGD.ftd) + 
		(tempObj.OZA['ftd']*overseasCurrency.ZMB.ftd);
	}
	
	ohcftdrev = tempObj.OGH['ftdrev'] + tempObj.OMA['ftdrev'] + tempObj.OMD['ftdrev'] + tempObj.OMZ['ftdrev'] + tempObj.ORB['ftdrev'] +  tempObj.ONA['ftdrev'] + tempObj.ORW['ftdrev'] +  tempObj.OTA['ftdrev'] +  tempObj.OUG['ftdrev'] + tempObj.OZA['ftdrev'];
	
	if((Object.keys(overseasCurrency).length) > 0){
		ohcftdrev = (tempObj.OGH['ftdrev']*overseasCurrency.GHA.ftd) + 
		(tempObj.OMA['ftdrev']*overseasCurrency.MUR.ftd) + 
		(tempObj.OMD['ftdrev']*overseasCurrency.MDR.ftd) + 
		(tempObj.OMZ['ftdrev']*overseasCurrency.MZN.ftd) + 
		(tempObj.ORB['ftdrev']*overseasCurrency.NAB.ftd) + 
		(tempObj.ONA['ftdrev']*overseasCurrency.NAB.ftd) + 
		(tempObj.ORW['ftdrev']*overseasCurrency.RWD.ftd) +  
		(tempObj.OTA['ftdrev']*overseasCurrency.TZA.ftd) +  
		(tempObj.OUG['ftdrev']*overseasCurrency.UGD.ftd) + 
		(tempObj.OZA['ftdrev']*overseasCurrency.ZMB.ftd);
	}
	
	 tempObj.OHC = { branch: 'OHC', ftdpha: ohcftdpha, ftdopt: ohcftdopt, ftdlab: ohcftdlab, ftdot: ohcftdot, ftd: ohcftdtotal, ftdrev: ohcftdrev, ftd_cogs_percent: cogsPercent(ohcftdtotal, ohcftdrev) }
	
	
	
	tempObj.OHC.mtdpha = tempObj.OGH['mtdpha'] + tempObj.OMA['mtdpha'] + tempObj.OMD['mtdpha'] + tempObj.OMZ['mtdpha'] + tempObj.ORB['mtdpha'] + tempObj.ONA['mtdpha'] + tempObj.ORW['mtdpha'] +  tempObj.OTA['mtdpha'] +  tempObj.OUG['mtdpha'] + tempObj.OZA['mtdpha']; 
	
	if((Object.keys(overseasCurrency).length) > 0){
		
		tempObj.OHC.mtdpha = (tempObj.OGH['mtdpha']*overseasCurrency.GHA.mtd) + 
		(tempObj.OMA['mtdpha']*overseasCurrency.MUR.mtd) + 
		(tempObj.OMD['mtdpha']*overseasCurrency.MDR.mtd) + 
		(tempObj.OMZ['mtdpha']*overseasCurrency.MZN.mtd) + 
		(tempObj.ORB['mtdpha']*overseasCurrency.NAB.mtd) + 
		(tempObj.ONA['mtdpha']*overseasCurrency.NAB.mtd) + 
		(tempObj.ORW['mtdpha']*overseasCurrency.RWD.mtd) +  
		(tempObj.OTA['mtdpha']*overseasCurrency.TZA.mtd) +  
		(tempObj.OUG['mtdpha']*overseasCurrency.UGD.mtd) + 
		(tempObj.OZA['mtdpha']*overseasCurrency.ZMB.mtd) ; 
	}
	
	tempObj.OHC.mtdopt = tempObj.OGH['mtdopt'] + tempObj.OMA['mtdopt'] + tempObj.OMD['mtdopt'] + tempObj.OMZ['mtdopt'] + tempObj.ORB['mtdopt'] + tempObj.ONA['mtdopt'] + tempObj.ORW['mtdopt'] +  tempObj.OTA['mtdopt'] +  tempObj.OUG['mtdopt'] + tempObj.OZA['mtdopt'];
	
	if((Object.keys(overseasCurrency).length) > 0){
		
		tempObj.OHC.mtdopt = (tempObj.OGH['mtdopt']*overseasCurrency.GHA.mtd) + 
		(tempObj.OMA['mtdopt']*overseasCurrency.MUR.mtd) + 
		(tempObj.OMD['mtdopt']*overseasCurrency.MDR.mtd) + 
		(tempObj.OMZ['mtdopt']*overseasCurrency.MZN.mtd) + 
		(tempObj.ORB['mtdopt']*overseasCurrency.NAB.mtd) +
		(tempObj.ONA['mtdopt']*overseasCurrency.NAB.mtd) +
		(tempObj.ORW['mtdopt']*overseasCurrency.RWD.mtd) +  
		(tempObj.OTA['mtdopt']*overseasCurrency.TZA.mtd) +  
		(tempObj.OUG['mtdopt']*overseasCurrency.UGD.mtd) + 
		(tempObj.OZA['mtdopt']*overseasCurrency.ZMB.mtd);
		
	}
	
	
	tempObj.OHC.mtdlab = tempObj.OGH['mtdlab'] + tempObj.OMA['mtdlab'] + tempObj.OMD['mtdlab'] + tempObj.OMZ['mtdlab'] + tempObj.ORB['mtdlab'] + tempObj.ONA['mtdlab'] + tempObj.ORW['mtdlab'] +  tempObj.OTA['mtdlab'] +  tempObj.OUG['mtdlab'] + tempObj.OZA['mtdlab'];
	
	if((Object.keys(overseasCurrency).length) > 0){
		tempObj.OHC.mtdlab = (tempObj.OGH['mtdlab']*overseasCurrency.GHA.mtd) +
		(tempObj.OMA['mtdlab']*overseasCurrency.MUR.mtd) + 
		(tempObj.OMD['mtdlab']*overseasCurrency.MDR.mtd) + 
		(tempObj.OMZ['mtdlab']*overseasCurrency.MZN.mtd) + 
		(tempObj.ORB['mtdlab']*overseasCurrency.NAB.mtd)  + 
		(tempObj.ONA['mtdlab']*overseasCurrency.NAB.mtd)  + 
		(tempObj.ORW['mtdlab']*overseasCurrency.RWD.mtd) +  
		(tempObj.OTA['mtdlab']*overseasCurrency.TZA.mtd) +  
		(tempObj.OUG['mtdlab']*overseasCurrency.UGD.mtd) + 
		(tempObj.OZA['mtdlab']*overseasCurrency.ZMB.mtd);
	}
	
	
	tempObj.OHC.mtdot = tempObj.OGH['mtdot'] + tempObj.OMA['mtdot'] + tempObj.OMD['mtdot'] + tempObj.OMZ['mtdot'] + tempObj.ORB['mtdot'] + tempObj.ONA['mtdot'] + tempObj.ORW['mtdot'] +  tempObj.OTA['mtdot'] +  tempObj.OUG['mtdot'] + tempObj.OZA['mtdot']; 
	
	if((Object.keys(overseasCurrency).length) > 0){
		tempObj.OHC.mtdot = (tempObj.OGH['mtdot']*overseasCurrency.GHA.mtd) + 
		(tempObj.OMA['mtdot']*overseasCurrency.MUR.mtd) + 
		(tempObj.OMD['mtdot']*overseasCurrency.MDR.mtd) + 
		(tempObj.OMZ['mtdot']*overseasCurrency.MZN.mtd) + 
		(tempObj.ORB['mtdot']*overseasCurrency.NAB.mtd) + 
		(tempObj.ONA['mtdot']*overseasCurrency.NAB.mtd) + 
		(tempObj.ORW['mtdot']*overseasCurrency.RWD.mtd) +  
		(tempObj.OTA['mtdot']*overseasCurrency.TZA.mtd) +  
		(tempObj.OUG['mtdot']*overseasCurrency.UGD.mtd) + 
		(tempObj.OZA['mtdot']*overseasCurrency.ZMB.mtd); 
	}
	
	
	tempObj.OHC.mtd = tempObj.OGH['mtd'] + tempObj.OMA['mtd'] + tempObj.OMD['mtd'] + tempObj.OMZ['mtd'] + tempObj.ORB['mtd'] + tempObj.ONA['mtd'] + tempObj.ORW['mtd'] +  tempObj.OTA['mtd'] +  tempObj.OUG['mtd'] + tempObj.OZA['mtd']; 
	
	if((Object.keys(overseasCurrency).length) > 0){
		
		tempObj.OHC.mtd = (tempObj.OGH['mtd']*overseasCurrency.GHA.mtd) + 
		(tempObj.OMA['mtd']*overseasCurrency.MUR.mtd) + 
		(tempObj.OMD['mtd']*overseasCurrency.MDR.mtd) + 
		(tempObj.OMZ['mtd']*overseasCurrency.MZN.mtd) + 
		(tempObj.ORB['mtd']*overseasCurrency.NAB.mtd) + 
		(tempObj.ONA['mtd']*overseasCurrency.NAB.mtd) + 
		(tempObj.ORW['mtd']*overseasCurrency.RWD.mtd) +  
		(tempObj.OTA['mtd']*overseasCurrency.TZA.mtd) +  
		(tempObj.OUG['mtd']*overseasCurrency.UGD.mtd) + 
		(tempObj.OZA['mtd']*overseasCurrency.ZMB.mtd); 
	}
	
	tempObj.OHC.mtdrev = tempObj.OGH['mtdrev'] + tempObj.OMA['mtdrev'] + tempObj.OMD['mtdrev'] + tempObj.OMZ['mtdrev'] + tempObj.ORB['mtdrev'] + tempObj.ONA['mtdrev'] + tempObj.ORW['mtdrev'] +  tempObj.OTA['mtdrev'] +  tempObj.OUG['mtdrev'] + tempObj.OZA['mtdrev'];
	
	if((Object.keys(overseasCurrency).length) > 0){
		tempObj.OHC.mtdrev = (tempObj.OGH['mtdrev']*overseasCurrency.GHA.mtd) + 
		(tempObj.OMA['mtdrev']*overseasCurrency.MUR.mtd) + 
		(tempObj.OMD['mtdrev']*overseasCurrency.MDR.mtd) + 
		(tempObj.OMZ['mtdrev']*overseasCurrency.MZN.mtd) + 
		(tempObj.ORB['mtdrev']*overseasCurrency.NAB.mtd) + 
		(tempObj.ONA['mtdrev']*overseasCurrency.NAB.mtd) + 
		(tempObj.ORW['mtdrev']*overseasCurrency.RWD.mtd) +  
		(tempObj.OTA['mtdrev']*overseasCurrency.TZA.mtd) +  
		(tempObj.OUG['mtdrev']*overseasCurrency.UGD.mtd) + 
		(tempObj.OZA['mtdrev']*overseasCurrency.ZMB.mtd);
	}
	
	tempObj.OHC.mtd_cogs_percent = cogsPercent(tempObj.OHC['mtd'], tempObj.OHC['mtdrev']);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
    for (let key in tempObj.AEH) {
        alin[key] = tempObj.AEH[key]
    }
    for (let key in tempObj.AHC) {
        if (key === 'ftd_cogs_percent') {
            alin[key] = cogsPercent(alin.ftd, alin.ftdrev)
        } else if (key === 'mtd_cogs_percent') {
            alin[key] = cogsPercent(alin.mtd, alin.mtdrev)
        }
        else {
            alin['branch'] = 'All India'
            alin[key] += tempObj.AHC[key]
        }
    }
	
	
  group["branch"] = "Group";  
  group['ftdpha'] =  alin['ftdpha']+tempObj.OHC['ftdpha']; 
  group['ftdopt'] =  alin['ftdopt']+tempObj.OHC['ftdopt']; 
  group['ftdlab'] =  alin['ftdlab']+tempObj.OHC['ftdlab'];
  group['ftdot'] = alin['ftdot']+tempObj.OHC['ftdot'];
  group["ftd"] =  alin['ftd']+tempObj.OHC['ftd'];  
  group['ftdrev'] =  alin['ftdrev']+tempObj.OHC['ftdrev']; 
  group['ftd_cogs_percent'] =  cogsPercent(group['ftd'], group['ftdrev']); 
  group['mtdpha'] =  alin['mtdpha']+tempObj.OHC['mtdpha'];
  group['mtdopt'] = alin['mtdopt']+tempObj.OHC['mtdopt'];
  
  group['mtdlab'] =  alin['mtdlab']+tempObj.OHC['mtdlab']; 
  group['mtdot'] =  alin['mtdot']+tempObj.OHC['mtdot']; 
  group['mtd'] =   alin['mtd']+tempObj.OHC['mtd'];
  group['mtdrev'] = alin['mtdrev']+tempObj.OHC['mtdrev'];
   group['mtd_cogs_percent'] = cogsPercent(group['mtd'], group['mtdrev']);
   let ohcarr = [];
   //ohcarr = _.filter(dbres, { entity: 'OGH',entity: 'OMA',entity: 'OMD',entity: 'OMZ',entity: 'ORB',entity: 'ORW',entity: 'OTA',entity: 'OUG',entity: 'OZA' })
   
  
     let ohcallarr  = ohcarr.concat(ogharr,omaarr,omdarr,omzarr,orbarr,orwarr,otaarr,ougarr,ozaarr,onaarr);
    return { 'group' : group,'alin': alin, 'aeharr': aeharr, 'ahcarr': ahcarr,'ohcarr': ohcallarr, 'aeh': tempObj.AEH, 'ahc': tempObj.AHC,'ohc': tempObj.OHC }
}

let filterGroupwise = async (aeh, ahc,ohc, dbres2, branches, ftddate, vobres, breakupres, breakupmtdres, overseasCurrency) => {
    let ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, aehtempObj = {}, ahctempObj = {}, branchObj = {}, ftdrev = 0, mtdrev = 0, branchName = null, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, aehftdbreakup = 0, aehmtdbreakup = 0, ahcftdbreakup = 0, ahcmtdbreakup = 0 ,ohctempObj = {} , ohcftdbreakup = 0, ohcmtdbreakup = 0
    let aehGroups = ['Chennai Main Hospital', 'Chennai Branches', 'Kanchi + Vellore', 'Kum + Ney + Vil', 'Dha + Salem + Krish', 'Erode + Hosur', 'Jaipur', 'Madurai KK Nagar']
    let ahcGroups = ['Chennai branches', 'Pondycherry','Tirunelveli', 'Coimbatore','Tuticorin + Madurai', 'Trichy', 'Thanjavur','Tiruppur' ,'Andaman', 'Karnataka', 'Banglore', 'Hubli + Mysore', 'Maharashtra', 'Telangana', 'Hyderabad', 'Andhra Pradesh', 'Rest of India(incl. Jaipur)', 'Kerala', 'Kolkata', 'Ahmedabad', 'Madhya Pradesh', 'Odisha']
    let aehgroupedBranches = {
        'Chennai Main Hospital': ["CMH"],
        'Chennai Branches': ["ANN", "ASN", "AVD", "NLR", "PMB", "PRR", "TLR", "TRC", "VLC"],
        'Kanchi + Vellore': ["KNP", "VLR"],
        'Kum + Ney + Vil': ["KBK", "NVL", "VPM"],
        'Dha + Salem + Krish': ["DHA", "SLM", "KSN"],
        'Erode + Hosur': ["ERD", "HSR"],
        'Jaipur': ["JPR"],
        'Madurai KK Nagar': ["MDU"]
    }
    let ahcgroupedBranches = {
        'Chennai branches': ["TBM", "ADY", "EGM", "MGP", "NWP", "AMB","TVT"],
        'Pondycherry': ["PDY"],
        'Tirunelveli': ["TVL"],
		'Coimbatore': ["CMB"],
        'Tuticorin + Madurai': ["TCN", "APM"],
        'Trichy': ["TRI"],
        'Thanjavur': ["TNJ"],
        'Tiruppur': ["TPR"],
        'Andaman': ["AMN"],
        'Karnataka': ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK", "SVR","BSK","RRN","HUB", "MCC", "MYS","RJN"],
        'Banglore': ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK","SVR","BSK","RRN","RJN"],
        'Hubli + Mysore': ["HUB", "MCC", "MYS"],
		'Maharashtra' :["VSH", "PUN", "HDP","CMR", "KTD"], 
        'Telangana': ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD","MPM","GCB"],
        'Hyderabad': ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD","MPM","GCB"],
        'Andhra Pradesh': ["VMH", "NEL", "GUN", "TPT", "RAJ"],
        'Rest of India(incl. Jaipur)': ["TVM","KTM","KOL", "KAS", "VSH", "PUN","HDP", "AHM", "JWS","APR","ATA","KWA", "CTK", "BHU", "JPR"],
        'Kerala': ["TVM","KTM"],
        'Kolkata': ["KOL", "KAS"],
        'Ahmedabad': ["AHM"],
        'Madhya Pradesh': ["JWS","APR","ATA","KWA"],
        'Odisha': ["CTK", "BHU"]
       // ,'Ambattur':['AMB']
    }
	
	
	
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
  
  
  
  
    let ftdvobot = 0, ftdvobopt = 0, ftdvobpha = 0, ftdvoblab = 0, ftdvobcons = 0, ftdvobothers = 0, ftdvob = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobpha = 0, mtdvobcons = 0, mtdvobothers = 0, mtdvob = 0
    aehGroups.forEach(group => {
        aehtempObj[group] = {}
        aehgroupedBranches[group].forEach(branch => {
            _.filter(aeh, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha += element.pharmacy;
                ftdopt += element.opticals;
                ftdlab += element.laboratory;
                ftdot += element.operation_theatre;
                ftd += element.ftd
            })
            aehtempObj[group].ftdpha = ftdpha, aehtempObj[group].ftdopt = ftdopt, aehtempObj[group].ftdlab = ftdlab, aehtempObj[group].ftdot = ftdot, aehtempObj[group].ftd = ftd
            _.filter(aeh, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
            aehtempObj[group].mtdpha = mtdpha, aehtempObj[group].mtdopt = mtdopt, aehtempObj[group].mtdlab = mtdlab, aehtempObj[group].mtdot = mtdot, aehtempObj[group].mtd = mtd
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev += element.ftd
            })
            aehtempObj[group].ftdrev = ftdrev, aehtempObj[group].ftd_cogs_percent = cogsPercent(ftd, ftdrev)
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd
            })
            aehtempObj[group].mtdrev = mtdrev, aehtempObj[group].mtd_cogs_percent = cogsPercent(mtd, mtdrev), aehtempObj[group].branch = group
        })
        ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0
    })
    for (let key in aehgroupedBranches) {
        branchObj[key] = []
        aehgroupedBranches[key].forEach(branch => {
            _.filter(branches, { code: branch }).forEach(element => { branchName = element.branch, code = element.code })
            _.filter(aeh, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha = element.pharmacy;
                ftdopt = element.opticals;
                ftdlab = element.laboratory;
                ftdot = element.operation_theatre;
                ftd = element.ftd
            })
            _.filter(aeh, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev = element.ftd,
                    ftdpharev = element.pharmacy,
                    ftdoptrev = element.opticals,
                    ftdotrev = element.surgery,
                    ftdlabrev = element.laboratory,
                    ftdconsultrev = element.consultation,
                    ftdothersrev = element.others
            })
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            _.filter(vobres, { billed: branch, trans_date: ftddate }).forEach(element => {
                ftdvob = element.ftd,
                    ftdvobpha = element.pharmacy,
                    ftdvobopt = element.opticals,
                    ftdvobot = element.surgery,
                    ftdvoblab = element.laboratory,
                    ftdvobcons = element.consultation,
                    ftdvobothers = element.others
            })
            _.filter(vobres, { billed: branch }).forEach(element => {
                mtdvob += element.ftd,
                    mtdvobpha += element.pharmacy,
                    mtdvobopt += element.opticals,
                    mtdvobot += element.surgery,
                    mtdvoblab += element.laboratory,
                    mtdvobcons += element.consultation,
                    mtdvobothers += element.others
            })
            let tempftdbreakup = _.filter(breakupres, { branch: branch })
            if (tempftdbreakup.length !== 0) {
                aehftdbreakup = tempftdbreakup
            }
            else {
                aehftdbreakup = 0
            }
            let tempmtdbreakup = _.filter(breakupmtdres, { branch: branch })
            if (tempmtdbreakup.length !== 0) {
                aehmtdbreakup = tempmtdbreakup
            }
            else {
                aehmtdbreakup = 0
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
            branchObj[key].push({ branch: branchName, code: code, ftdpha: ftdpha, ftdopt: ftdopt, ftdlab: ftdlab, ftdot: ftdot, ftd: ftd, ftdrev: ftdrev, ftdpharev: ftdpharev, ftdoptrev: ftdoptrev, ftdotrev: ftdotrev, ftdlabrev: ftdlabrev, ftdconsultrev: ftdconsultrev, ftdothersrev: ftdothersrev, ftd_cogs_percent: cogsPercent(ftd, ftdrev), mtdpha: mtdpha, mtdopt: mtdopt, mtdlab: mtdlab, mtdot: mtdot, mtd: mtd, mtdrev: mtdrev, mtdpharev: mtdpharev, mtdoptrev: mtdoptrev, mtdotrev: mtdotrev, mtdlabrev: mtdlabrev, mtdconsultrev: mtdconsultrev, mtdothersrev: mtdothersrev, mtd_cogs_percent: cogsPercent(mtd, mtdrev), ftdvobpha: ftdvobpha, ftdvobot: ftdvobot, ftdvobopt: ftdvobopt, ftdvoblab: ftdvoblab, ftdvobcons: ftdvobcons, ftdvobothers: ftdvobothers, ftdvob: ftdvob, ftd_vob_percent: cogsPercent(ftd, ftdvob), mtdvobpha: mtdvobpha, mtdvobopt: mtdvobopt, mtdvoblab: mtdvoblab, mtdvobot: mtdvobot, mtdvobcons: mtdvobcons, mtdvobothers: mtdvobothers, mtdvob: mtdvob, mtd_vob_percent: cogsPercent(mtd, mtdvob), ftdbreakup: aehftdbreakup, mtdbreakup: aehmtdbreakup })
            ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdvobot = 0, ftdvobopt = 0, ftdvobpha = 0, ftdvoblab = 0, ftdvobcons = 0, ftdvobothers = 0, ftdvob = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobpha = 0, mtdvobcons = 0, mtdvobothers = 0, mtdvob = 0, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, aehftdbreakup = 0, aehmtdbreakup = 0
        })
    }
    for (let key in ahcgroupedBranches) {
        branchObj[key] = []
        ahcgroupedBranches[key].forEach(branch => {
            _.filter(branches, { code: branch }).forEach(element => { branchName = element.branch, code = element.code })
            _.filter(ahc, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha = element.pharmacy;
                ftdopt = element.opticals;
                ftdlab = element.laboratory;
                ftdot = element.operation_theatre;
                ftd = element.ftd
            })
            _.filter(ahc, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev = element.ftd,
                    ftdpharev = element.pharmacy,
                    ftdoptrev = element.opticals,
                    ftdotrev = element.surgery,
                    ftdlabrev = element.laboratory,
                    ftdconsultrev = element.consultation,
                    ftdothersrev = element.others
            })
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            _.filter(vobres, { billed: branch, trans_date: ftddate }).forEach(element => {
                ftdvob = element.ftd,
                    ftdvobpha = element.pharmacy,
                    ftdvobopt = element.opticals,
                    ftdvobot = element.surgery,
                    ftdvoblab = element.laboratory,
                    ftdvobcons = element.consultation,
                    ftdvobothers = element.others
            })
            _.filter(vobres, { billed: branch }).forEach(element => {
                mtdvob += element.ftd,
                    mtdvobpha += element.pharmacy,
                    mtdvobopt += element.opticals,
                    mtdvobot += element.surgery,
                    mtdvoblab += element.laboratory,
                    mtdvobcons += element.consultation,
                    mtdvobothers += element.others
            })
            let tempfilterftdbreakup = _.filter(breakupres, { branch: branch })
            if (tempfilterftdbreakup.length !== 0) {
                ahcftdbreakup = tempfilterftdbreakup
            }
            else {
                ahcftdbreakup = 0
            }
            let tempfiltermtdbreakup = _.filter(breakupmtdres, { branch: branch })
            if (tempfiltermtdbreakup.length !== 0) {
                ahcmtdbreakup = tempfiltermtdbreakup
            }
            else {
                ahcmtdbreakup = 0
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
            branchObj[key].push({ branch: branchName, code: code, ftdpha: ftdpha, ftdopt: ftdopt, ftdlab: ftdlab, ftdot: ftdot, ftd: ftd, ftdrev: ftdrev, ftdpharev: ftdpharev, ftdoptrev: ftdoptrev, ftdotrev: ftdotrev, ftdlabrev: ftdlabrev, ftdconsultrev: ftdconsultrev, ftdothersrev: ftdothersrev, ftd_cogs_percent: cogsPercent(ftd, ftdrev), mtdpha: mtdpha, mtdopt: mtdopt, mtdlab: mtdlab, mtdot: mtdot, mtd: mtd, mtdrev: mtdrev, mtdpharev: mtdpharev, mtdoptrev: mtdoptrev, mtdotrev: mtdotrev, mtdlabrev: mtdlabrev, mtdconsultrev: mtdconsultrev, mtdothersrev: mtdothersrev, mtd_cogs_percent: cogsPercent(mtd, mtdrev), ftdvobpha: ftdvobpha, ftdvobot: ftdvobot, ftdvobopt: ftdvobopt, ftdvoblab: ftdvoblab, ftdvobcons: ftdvobcons, ftdvobothers: ftdvobothers, ftdvob: ftdvob, ftd_vob_percent: cogsPercent(ftd, ftdvob), mtdvobpha: mtdvobpha, mtdvobopt: mtdvobopt, mtdvoblab: mtdvoblab, mtdvobot: mtdvobot, mtdvobcons: mtdvobcons, mtdvobothers: mtdvobothers, mtdvob: mtdvob, mtd_vob_percent: cogsPercent(mtd, mtdvob), ftdbreakup: ahcftdbreakup, mtdbreakup: ahcmtdbreakup })
            ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdvobot = 0, ftdvobopt = 0, ftdvobpha = 0, ftdvoblab = 0, ftdvobcons = 0, ftdvobothers = 0, ftdvob = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobpha = 0, mtdvobcons = 0, mtdvobothers = 0, mtdvob = 0, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, ahcftdbreakup = 0, ahcmtdbreakup = 0
        })
    }

    ahcGroups.forEach(group => {
        ahctempObj[group] = {}
        ahcgroupedBranches[group].forEach(branch => {
            _.filter(ahc, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha += element.pharmacy;
                ftdopt += element.opticals;
                ftdlab += element.laboratory;
                ftdot += element.operation_theatre;
                ftd += element.ftd
            })
            ahctempObj[group].ftdpha = ftdpha, ahctempObj[group].ftdopt = ftdopt, ahctempObj[group].ftdlab = ftdlab, ahctempObj[group].ftdot = ftdot, ahctempObj[group].ftd = ftd
            _.filter(ahc, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
            ahctempObj[group].mtdpha = mtdpha, ahctempObj[group].mtdopt = mtdopt, ahctempObj[group].mtdlab = mtdlab, ahctempObj[group].mtdot = mtdot, ahctempObj[group].mtd = mtd
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev += element.ftd
            })
            ahctempObj[group].ftdrev = ftdrev, ahctempObj[group].ftd_cogs_percent = cogsPercent(ftd, ftdrev)
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd
            })
            ahctempObj[group].mtdrev = mtdrev, ahctempObj[group].mtd_cogs_percent = cogsPercent(mtd, mtdrev), ahctempObj[group].branch = group
        })
        ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0
    })
	for (let key in ohcgroupedBranches) {
        branchObj[key] = []
        ohcgroupedBranches[key].forEach(branch => {
            _.filter(branches, { code: branch }).forEach(element => { branchName = element.branch, code = element.code })
            _.filter(ohc, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha = element.pharmacy;
                ftdopt = element.opticals;
                ftdlab = element.laboratory;
                ftdot = element.operation_theatre;
                ftd = element.ftd
            })
			
			if((Object.keys(overseasCurrency).length) > 0){				
				ftdpha = ftdpha*overseasCurrency[branch].ftd;
                ftdopt = ftdopt*overseasCurrency[branch].ftd;
                ftdlab = ftdlab*overseasCurrency[branch].ftd;
                ftdot = ftdot*overseasCurrency[branch].ftd;
                ftd = ftd*overseasCurrency[branch].ftd;
			}
			    
			
			
			
            _.filter(ohc, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
			
			if((Object.keys(overseasCurrency).length) > 0){
				mtdpha = mtdpha*overseasCurrency[branch].mtd;
                mtdopt = mtdopt*overseasCurrency[branch].mtd;
                mtdlab = mtdlab*overseasCurrency[branch].mtd;
                mtdot = mtdot*overseasCurrency[branch].mtd;
                mtd = mtd*overseasCurrency[branch].mtd;
			}
			    
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev = element.ftd,
                    ftdpharev = element.pharmacy,
                    ftdoptrev = element.opticals,
                    ftdotrev = element.surgery,
                    ftdlabrev = element.laboratory,
                    ftdconsultrev = element.consultation,
                    ftdothersrev = element.others
            })
			
			if((Object.keys(overseasCurrency).length) > 0){
				ftdrev = ftdrev*overseasCurrency[branch].ftd;
				ftdpharev = ftdpharev*overseasCurrency[branch].ftd;
                ftdoptrev = ftdoptrev*overseasCurrency[branch].ftd;
                ftdotrev = ftdotrev*overseasCurrency[branch].ftd;
                ftdlabrev = ftdlabrev*overseasCurrency[branch].ftd;
                ftdconsultrev = ftdconsultrev*overseasCurrency[branch].ftd;
				ftdothersrev = ftdothersrev*overseasCurrency[branch].ftd;
			}
			
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
			
			
			if((Object.keys(overseasCurrency).length) > 0){
				mtdrev = mtdrev*overseasCurrency[branch].mtd;
				mtdpharev = mtdpharev*overseasCurrency[branch].mtd;
                mtdoptrev = mtdoptrev*overseasCurrency[branch].mtd;
                mtdotrev = mtdotrev*overseasCurrency[branch].mtd;
                mtdlabrev = mtdlabrev*overseasCurrency[branch].mtd;
                mtdconsultrev = mtdconsultrev*overseasCurrency[branch].mtd;
				mtdothersrev = mtdothersrev*overseasCurrency[branch].mtd;
			}
			
			
			
            _.filter(vobres, { billed: branch, trans_date: ftddate }).forEach(element => {
                ftdvob = element.ftd,
                    ftdvobpha = element.pharmacy,
                    ftdvobopt = element.opticals,
                    ftdvobot = element.surgery,
                    ftdvoblab = element.laboratory,
                    ftdvobcons = element.consultation,
                    ftdvobothers = element.others
            })
			
			
			if((Object.keys(overseasCurrency).length) > 0){
				ftdvob = ftdvob*overseasCurrency[branch].ftd;
				ftdvobpha = ftdvobpha*overseasCurrency[branch].ftd;
                ftdvobopt = ftdvobopt*overseasCurrency[branch].ftd;
                ftdvobot = ftdvobot*overseasCurrency[branch].ftd;
                ftdvoblab = ftdvoblab*overseasCurrency[branch].ftd;
                ftdvobcons = ftdvobcons*overseasCurrency[branch].ftd;
				ftdvobothers = ftdvobothers*overseasCurrency[branch].ftd;
			}
			
			
			
            _.filter(vobres, { billed: branch }).forEach(element => {
                mtdvob += element.ftd,
                    mtdvobpha += element.pharmacy,
                    mtdvobopt += element.opticals,
                    mtdvobot += element.surgery,
                    mtdvoblab += element.laboratory,
                    mtdvobcons += element.consultation,
                    mtdvobothers += element.others
            })
			
			if((Object.keys(overseasCurrency).length) > 0){
				mtdvob = mtdvob*overseasCurrency[branch].mtd;
				mtdvobpha = mtdvobpha*overseasCurrency[branch].mtd;
                mtdvobopt = mtdvobopt*overseasCurrency[branch].mtd;
                mtdvobot = mtdvobot*overseasCurrency[branch].mtd;
                mtdvoblab = mtdvoblab*overseasCurrency[branch].mtd;
                mtdvobcons = mtdvobcons*overseasCurrency[branch].mtd;
				mtdvobothers = mtdvobothers*overseasCurrency[branch].mtd;
			}
			
			
			
			
			
			
            let tempfilterftdbreakup = _.filter(breakupres, { branch: branch })
            if (tempfilterftdbreakup.length !== 0) {
                ohcftdbreakup = tempfilterftdbreakup
            }
            else {
                ohcftdbreakup = 0
            }
            let tempfiltermtdbreakup = _.filter(breakupmtdres, { branch: branch })
            if (tempfiltermtdbreakup.length !== 0) {
                ohcmtdbreakup = tempfiltermtdbreakup
            }
            else {
                ohcmtdbreakup = 0
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
            branchObj[key].push({ branch: branchName, code: code, ftdpha: ftdpha, ftdopt: ftdopt, ftdlab: ftdlab, ftdot: ftdot, ftd: ftd, ftdrev: ftdrev, ftdpharev: ftdpharev, ftdoptrev: ftdoptrev, ftdotrev: ftdotrev, ftdlabrev: ftdlabrev, ftdconsultrev: ftdconsultrev, ftdothersrev: ftdothersrev, ftd_cogs_percent: cogsPercent(ftd, ftdrev), mtdpha: mtdpha, mtdopt: mtdopt, mtdlab: mtdlab, mtdot: mtdot, mtd: mtd, mtdrev: mtdrev, mtdpharev: mtdpharev, mtdoptrev: mtdoptrev, mtdotrev: mtdotrev, mtdlabrev: mtdlabrev, mtdconsultrev: mtdconsultrev, mtdothersrev: mtdothersrev, mtd_cogs_percent: cogsPercent(mtd, mtdrev), ftdvobpha: ftdvobpha, ftdvobot: ftdvobot, ftdvobopt: ftdvobopt, ftdvoblab: ftdvoblab, ftdvobcons: ftdvobcons, ftdvobothers: ftdvobothers, ftdvob: ftdvob, ftd_vob_percent: cogsPercent(ftd, ftdvob), mtdvobpha: mtdvobpha, mtdvobopt: mtdvobopt, mtdvoblab: mtdvoblab, mtdvobot: mtdvobot, mtdvobcons: mtdvobcons, mtdvobothers: mtdvobothers, mtdvob: mtdvob, mtd_vob_percent: cogsPercent(mtd, mtdvob), ftdbreakup: ohcftdbreakup, mtdbreakup: ohcmtdbreakup })
            ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdvobot = 0, ftdvobopt = 0, ftdvobpha = 0, ftdvoblab = 0, ftdvobcons = 0, ftdvobothers = 0, ftdvob = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobpha = 0, mtdvobcons = 0, mtdvobothers = 0, mtdvob = 0, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, ohcftdbreakup = 0, ohcmtdbreakup = 0
        })
    }
	
    let ohcBranch={};
	
	
	//console.log(ohc);
	
	
    ohcGroups.forEach(group => {
        ohctempObj[group] = {}
        ohcgroupedBranches[group].forEach(branch => {
			ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0			
            _.filter(ohc, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha += element.pharmacy;
                ftdopt += element.opticals;
                ftdlab += element.laboratory;
                ftdot += element.operation_theatre;
                ftd += element.ftd
            })
			
			
			if((Object.keys(overseasCurrency).length) > 0){
				ftdpha = ftdpha*overseasCurrency[branch].ftd;
				ftdopt = ftdopt*overseasCurrency[branch].ftd;
                ftdlab = ftdlab*overseasCurrency[branch].ftd;
                ftdot = ftdot*overseasCurrency[branch].ftd;
                ftd = ftd*overseasCurrency[branch].ftd;
                
			}
			
            ohctempObj[group].ftdpha = ftdpha, ohctempObj[group].ftdopt = ftdopt, ohctempObj[group].ftdlab = ftdlab, ohctempObj[group].ftdot = ftdot, ohctempObj[group].ftd = ftd
            _.filter(ohc, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
			
			if((Object.keys(overseasCurrency).length) > 0){
				mtdpha = mtdpha*overseasCurrency[branch].mtd;
				mtdopt = mtdopt*overseasCurrency[branch].mtd;
                mtdlab = mtdlab*overseasCurrency[branch].mtd;
                mtdot = mtdot*overseasCurrency[branch].mtd;
                mtd = mtd*overseasCurrency[branch].mtd;
               
			}
			
			
			
			
            ohctempObj[group].mtdpha = mtdpha, ohctempObj[group].mtdopt = mtdopt, ohctempObj[group].mtdlab = mtdlab, ohctempObj[group].mtdot = mtdot, ohctempObj[group].mtd = mtd
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev += element.ftd
            })
			
			if((Object.keys(overseasCurrency).length) > 0){
				ftdrev = ftdrev*overseasCurrency[branch].ftd;
				
                
			}
			
            ohctempObj[group].ftdrev = ftdrev, ohctempObj[group].ftd_cogs_percent = cogsPercent(ftd, ftdrev)
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd
            })
			
			if((Object.keys(overseasCurrency).length) > 0){
				mtdrev = mtdrev*overseasCurrency[branch].mtd;
				
                
			}
            ohctempObj[group].mtdrev = mtdrev, ohctempObj[group].mtd_cogs_percent = cogsPercent(mtd, mtdrev), ohctempObj[group].branch = group
			
			ohcBranch[branch] = {'ftdpha':ftdpha,'ftdopt':ftdopt,'ftdlab':ftdlab,'ftdot':ftdot,'ftd':ftd,'ftdrev':ftdrev,'ftd_cogs_percent':cogsPercent(ftd, ftdrev),'mtdpha':mtdpha,'mtdopt':mtdopt,'ftdlab':mtdlab,'mtdot':mtdot,'mtd':mtd,'mtdrev':mtdrev,'mtd_cogs_percent':cogsPercent(mtd, mtdrev)}
			
			//ohcBranch[branch] = {'mtdrev':mtdrev,'mtd_cogs_percent':cogsPercent(mtd, mtdrev),'branch':group}
			
			
        })
        ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0
    })
	
	
	  
		let mozftdcogs = 0, mozmtdcogs = 0, mauritiusftdcogs=0, mauritiusmtdcogs=0;

		mozftdcogs = cogsPercent(ohcBranch['MZQ'].ftd+ohcBranch['BRA'].ftd,ohcBranch['MZQ'].ftdrev+ohcBranch['BRA'].ftdrev);
		mozmtdcogs = cogsPercent(ohcBranch['MZQ'].mtd+ohcBranch['BRA'].mtd,ohcBranch['MZQ'].mtdrev+ohcBranch['BRA'].mtdrev);	
		mauritiusftdcogs = cogsPercent(ohcBranch['EBN'].ftd+ohcBranch['FLQ'].ftd+ohcBranch['GDL'].ftd,ohcBranch['EBN'].ftdrev+ohcBranch['FLQ'].ftdrev+ohcBranch['GDL'].ftdrev);
		mauritiusmtdcogs = cogsPercent(ohcBranch['EBN'].mtd+ohcBranch['FLQ'].mtd+ohcBranch['GDL'].mtd,ohcBranch['EBN'].mtdrev+ohcBranch['FLQ'].mtdrev+ohcBranch['GDL'].mtdrev);
		
		ohctempObj['Mauritius'] =  { 'ftdpha': ohcBranch['EBN'].ftdpha+ohcBranch['FLQ'].ftdpha+ohcBranch['GDL'].ftdpha,
									   'ftdopt': ohcBranch['EBN'].ftdopt+ohcBranch['FLQ'].ftdopt+ohcBranch['GDL'].ftdopt,
										'ftdlab': ohcBranch['EBN'].ftdlab+ohcBranch['FLQ'].ftdlab+ohcBranch['GDL'].ftdlab,
										 'ftdot': ohcBranch['EBN'].ftdot+ohcBranch['FLQ'].ftdot+ohcBranch['GDL'].ftdot,
										 'ftd': ohcBranch['EBN'].ftd+ohcBranch['FLQ'].ftd+ohcBranch['GDL'].ftd,
										 'mtdpha': ohcBranch['EBN'].mtdpha+ohcBranch['FLQ'].mtdpha+ohcBranch['GDL'].mtdpha,
										 'mtdopt': ohcBranch['EBN'].mtdopt+ohcBranch['FLQ'].mtdopt+ohcBranch['GDL'].mtdopt,
										 'mtdlab': ohcBranch['EBN'].mtdlab+ohcBranch['FLQ'].mtdlab+ohcBranch['GDL'].mtdlab,
										 'mtdot': ohcBranch['EBN'].mtdot+ohcBranch['FLQ'].mtdot+ohcBranch['GDL'].mtdot,
										 'mtd': ohcBranch['EBN'].mtd+ohcBranch['FLQ'].mtd+ohcBranch['GDL'].mtd,
										 'ftdrev': ohcBranch['EBN'].ftdrev+ohcBranch['FLQ'].ftdrev+ohcBranch['GDL'].ftdrev,
										 'ftd_cogs_percent': mauritiusftdcogs,
										 'mtdrev': ohcBranch['EBN'].mtdrev+ohcBranch['FLQ'].mtdrev+ohcBranch['GDL'].mtdrev,
										 'mtd_cogs_percent': mauritiusmtdcogs,
										 'branch': 'Mauritius' }
		
		ohctempObj['Mozambique'] =  { 'ftdpha': ohcBranch['MZQ'].ftdpha+ohcBranch['BRA'].ftdpha,
									   'ftdopt': ohcBranch['MZQ'].ftdopt+ohcBranch['BRA'].ftdopt,
										'ftdlab': ohcBranch['MZQ'].ftdlab+ohcBranch['BRA'].ftdlab,
										 'ftdot': ohcBranch['MZQ'].ftdot+ohcBranch['BRA'].ftdot,
										 'ftd': ohcBranch['MZQ'].ftd+ohcBranch['BRA'].ftd,
										 'mtdpha': ohcBranch['MZQ'].mtdpha+ohcBranch['BRA'].mtdpha,
										 'mtdopt': ohcBranch['MZQ'].mtdopt+ohcBranch['BRA'].mtdopt,
										 'mtdlab': ohcBranch['MZQ'].mtdlab+ohcBranch['BRA'].mtdlab,
										 'mtdot': ohcBranch['MZQ'].mtdot+ohcBranch['BRA'].mtdot,
										 'mtd': ohcBranch['MZQ'].mtd+ohcBranch['BRA'].mtd,
										 'ftdrev': ohcBranch['MZQ'].ftdrev+ohcBranch['BRA'].ftdrev,
										 'ftd_cogs_percent': mozftdcogs,
										 'mtdrev': ohcBranch['MZQ'].mtdrev+ohcBranch['BRA'].mtdrev,
										 'mtd_cogs_percent': mozmtdcogs,
										 'branch': 'Mozambique' }
										 
										 
		
										 
							 
		
	

   
	//console.log("11111111");
	//console.log(ohctempObj)
	
    return {ohc: ohctempObj, aeh: aehtempObj, ahc: ahctempObj, branchwise: branchObj }
}

let cogsPercent = (cogs, revenue) => {
    if ((cogs !== 0 && revenue !== 0) || (cogs === 0 && revenue !== 0)) {
        return (cogs / revenue) * 100;
    }
    else if ((revenue === 0) || (cogs === 0 && revenue === 0)) {
        return 0;
    }
}
