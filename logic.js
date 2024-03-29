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




			overseastempObj['CGU'] = {'ftd' : overseastempObj.RWD.ftd,'mtd' :overseastempObj.RWD.mtd};
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


			overseastempObj['CGU'] = {'ftd' : overseastempObj.RWD.ftd,'mtd' :overseastempObj.RWD.mtd};
		}

	}


	return overseastempObj;

}




let filterEntity = async (dbres, dbres2, ftddate,overseasCurrency) => {
    let tempObj = {}, pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0, aeharr = [], aehrevarr = [], ahcrevarr = [], ahcarr = [],
	ogharr = [], omaarr = [], omdarr = [], omzarr = [], orbarr = [], orwarr =[], otaarr = [], ougarr = [], ozaarr = [],
	oghrevarr = [], omarevarr = [], omdrevarr = [], omzrevarr = [], orbrevarr = [], orwrevarr =[], otarevarr = [], ougrevarr = [], ozarevarr = [],oniarr = [],onirevarr = [],

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

	ahcarr = _.filter(dbres, (v) => _.includes(['AHC','AHI'], v.entity));

	//console.log(ahcarr);
    //ahcarr = _.filter(dbres, { entity: 'AHC' })
    _.filter(ahcarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
	ahcrevarr = _.filter(dbres2, (v) => _.includes(['AHC','AHI'], v.entity));
    //ahcrevarr = _.filter(dbres2, { entity: 'AHC' })
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
	oniarr = _.filter(dbres, { entity: 'ONI' })
    _.filter(oniarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    onirevarr = _.filter(dbres2, { entity: 'ONI' })
    _.filter(onirevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.ONI = { branch: 'ONI', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    oniarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    onirevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.ONI.mtdpha = pha, tempObj.ONI.mtdopt = opt, tempObj.ONI.mtdlab = lab, tempObj.ONI.mtdot = ot, tempObj.ONI.mtd = total, tempObj.ONI.mtdrev = rev, tempObj.ONI.mtd_cogs_percent = cogsPercent(total, rev)



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



	ohcftdpha = tempObj.OGH['ftdpha'] + tempObj.OMA['ftdpha'] + tempObj.OMD['ftdpha'] + tempObj.OMZ['ftdpha'] + tempObj.ORB['ftdpha'] + tempObj.ONA['ftdpha'] + tempObj.ORW['ftdpha'] +  tempObj.OTA['ftdpha'] + tempObj.OUG['ftdpha'] + tempObj.OZA['ftdpha'] + tempObj.ONI['ftdpha'];


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
		(tempObj.ONI['ftdpha']*overseasCurrency.NGA.ftd) +
		(tempObj.OZA['ftdpha']*overseasCurrency.ZMB.ftd);
	}

	ohcftdopt = tempObj.OGH['ftdopt'] + tempObj.OMA['ftdopt'] + tempObj.OMD['ftdopt'] + tempObj.OMZ['ftdopt'] + tempObj.ORB['ftdopt'] + tempObj.ONA['ftdopt'] + tempObj.ORW['ftdopt'] +  tempObj.OTA['ftdopt'] +  tempObj.OUG['ftdopt'] + tempObj.OZA['ftdopt']+ tempObj.ONI['ftdopt'];

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
		(tempObj.ONI['ftdopt']*overseasCurrency.NGA.ftd) +
		(tempObj.OZA['ftdopt']*overseasCurrency.ZMB.ftd);
	}

	 ohcftdlab = tempObj.OGH['ftdlab'] + tempObj.OMA['ftdlab'] + tempObj.OMD['ftdlab'] + tempObj.OMZ['ftdlab'] + tempObj.ORB['ftdlab'] + tempObj.ONA['ftdlab'] + tempObj.ORW['ftdlab'] +  tempObj.OTA['ftdlab'] +  tempObj.OUG['ftdlab'] + tempObj.OZA['ftdlab']+ tempObj.ONI['ftdlab'];

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
		 (tempObj.ONI['ftdlab']*overseasCurrency.NGA.ftd) +
		 (tempObj.OZA['ftdlab']*overseasCurrency.ZMB.ftd);
	 }

	ohcftdot = tempObj.OGH['ftdot'] + tempObj.OMA['ftdot'] + tempObj.OMD['ftdot'] + tempObj.OMZ['ftdot'] + tempObj.ORB['ftdot'] + tempObj.ONA['ftdot'] + tempObj.ORW['ftdot'] +  tempObj.OTA['ftdot'] +  tempObj.OUG['ftdot'] + tempObj.OZA['ftdot']+ tempObj.ONI['ftdot'];

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
		 (tempObj.ONI['ftdot']*overseasCurrency.NGA.ftd) +
		 (tempObj.OZA['ftdot']*overseasCurrency.ZMB.ftd);

	 }

	ohcftdtotal = tempObj.OGH['ftd'] + tempObj.OMA['ftd'] + tempObj.OMD['ftd'] + tempObj.OMZ['ftd'] + tempObj.ORB['ftd'] + tempObj.ONA['ftd'] + tempObj.ORW['ftd'] +  tempObj.OTA['ftd'] +  tempObj.OUG['ftd'] + tempObj.OZA['ftd']+ tempObj.ONI['ftd'];

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
		(tempObj.ONI['ftd']*overseasCurrency.NGA.ftd) +
		(tempObj.OZA['ftd']*overseasCurrency.ZMB.ftd);
	}

	ohcftdrev = tempObj.OGH['ftdrev'] + tempObj.OMA['ftdrev'] + tempObj.OMD['ftdrev'] + tempObj.OMZ['ftdrev'] + tempObj.ORB['ftdrev'] +  tempObj.ONA['ftdrev'] + tempObj.ORW['ftdrev'] +  tempObj.OTA['ftdrev'] +  tempObj.OUG['ftdrev'] + tempObj.OZA['ftdrev']+ tempObj.ONI['ftdrev'];

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
		(tempObj.ONI['ftdrev']*overseasCurrency.NGA.ftd) +
		(tempObj.OZA['ftdrev']*overseasCurrency.ZMB.ftd);
	}

	 tempObj.OHC = { branch: 'OHC', ftdpha: ohcftdpha, ftdopt: ohcftdopt, ftdlab: ohcftdlab, ftdot: ohcftdot, ftd: ohcftdtotal, ftdrev: ohcftdrev, ftd_cogs_percent: cogsPercent(ohcftdtotal, ohcftdrev) }



	tempObj.OHC.mtdpha = tempObj.OGH['mtdpha'] + tempObj.OMA['mtdpha'] + tempObj.OMD['mtdpha'] + tempObj.OMZ['mtdpha'] + tempObj.ORB['mtdpha'] + tempObj.ONA['mtdpha'] + tempObj.ORW['mtdpha'] +  tempObj.OTA['mtdpha'] +  tempObj.OUG['mtdpha'] + tempObj.OZA['mtdpha']+ tempObj.ONI['mtdpha'];

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
		(tempObj.ONI['mtdpha']*overseasCurrency.NGA.mtd) +
		(tempObj.OZA['mtdpha']*overseasCurrency.ZMB.mtd) ;
	}

	tempObj.OHC.mtdopt = tempObj.OGH['mtdopt'] + tempObj.OMA['mtdopt'] + tempObj.OMD['mtdopt'] + tempObj.OMZ['mtdopt'] + tempObj.ORB['mtdopt'] + tempObj.ONA['mtdopt'] + tempObj.ORW['mtdopt'] +  tempObj.OTA['mtdopt'] +  tempObj.OUG['mtdopt'] + tempObj.OZA['mtdopt']+ tempObj.ONI['mtdopt'];

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
		(tempObj.ONI['mtdopt']*overseasCurrency.NGA.mtd) +
		(tempObj.OZA['mtdopt']*overseasCurrency.ZMB.mtd);

	}


	tempObj.OHC.mtdlab = tempObj.OGH['mtdlab'] + tempObj.OMA['mtdlab'] + tempObj.OMD['mtdlab'] + tempObj.OMZ['mtdlab'] + tempObj.ORB['mtdlab'] + tempObj.ONA['mtdlab'] + tempObj.ORW['mtdlab'] +  tempObj.OTA['mtdlab'] +  tempObj.OUG['mtdlab'] + tempObj.OZA['mtdlab']+ tempObj.ONI['mtdlab'];

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
		(tempObj.ONI['mtdlab']*overseasCurrency.NGA.mtd) +
		(tempObj.OZA['mtdlab']*overseasCurrency.ZMB.mtd);
	}


	tempObj.OHC.mtdot = tempObj.OGH['mtdot'] + tempObj.OMA['mtdot'] + tempObj.OMD['mtdot'] + tempObj.OMZ['mtdot'] + tempObj.ORB['mtdot'] + tempObj.ONA['mtdot'] + tempObj.ORW['mtdot'] +  tempObj.OTA['mtdot'] +  tempObj.OUG['mtdot'] + tempObj.OZA['mtdot']+ tempObj.ONI['mtdot'];

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
		(tempObj.ONI['mtdot']*overseasCurrency.NGA.mtd) +
		(tempObj.OZA['mtdot']*overseasCurrency.ZMB.mtd);
	}


	tempObj.OHC.mtd = tempObj.OGH['mtd'] + tempObj.OMA['mtd'] + tempObj.OMD['mtd'] + tempObj.OMZ['mtd'] + tempObj.ORB['mtd'] + tempObj.ONA['mtd'] + tempObj.ORW['mtd'] +  tempObj.OTA['mtd'] +  tempObj.OUG['mtd'] + tempObj.OZA['mtd']+ tempObj.ONI['mtd'];

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
		(tempObj.ONI['mtd']*overseasCurrency.NGA.mtd) +
		(tempObj.OZA['mtd']*overseasCurrency.ZMB.mtd);
	}

	tempObj.OHC.mtdrev = tempObj.OGH['mtdrev'] + tempObj.OMA['mtdrev'] + tempObj.OMD['mtdrev'] + tempObj.OMZ['mtdrev'] + tempObj.ORB['mtdrev'] + tempObj.ONA['mtdrev'] + tempObj.ORW['mtdrev'] +  tempObj.OTA['mtdrev'] +  tempObj.OUG['mtdrev'] + tempObj.OZA['mtdrev']+ tempObj.ONI['mtdrev'];

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
		(tempObj.ONI['mtdrev']*overseasCurrency.NGA.mtd) +
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


     let ohcallarr  = ohcarr.concat(ogharr,omaarr,omdarr,omzarr,orbarr,orwarr,otaarr,ougarr,ozaarr,onaarr,oniarr);
    return { 'group' : group,'alin': alin, 'aeharr': aeharr, 'ahcarr': ahcarr,'ohcarr': ohcallarr, 'aeh': tempObj.AEH, 'ahc': tempObj.AHC,'ohc': tempObj.OHC }
}

let filterGroupwise = async (aeh, ahc,ohc, dbres2, branches, ftddate, vobres, breakupres, breakupmtdres, overseasCurrency) => {
    let ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, aehtempObj = {}, ahctempObj = {}, branchObj = {}, ftdrev = 0, mtdrev = 0, branchName = null, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, aehftdbreakup = 0, aehmtdbreakup = 0, ahcftdbreakup = 0, ahcmtdbreakup = 0 ,ohctempObj = {} , ohcftdbreakup = 0, ohcmtdbreakup = 0
    let aehGroups = ['Chennai Main Hospital', 'Chennai Branches', 'Kanchi + Vellore', 'Kum + Ney + Vil', 'Dha + Salem + Krish', 'Erode + Hosur', 'Jaipur', 'Madurai KK Nagar']
    let ahcGroups = ['Chennai branches', 'Pondycherry','Tirunelveli', 'Coimbatore','Tuticorin + Madurai', 'Trichy', 'Thanjavur','Tiruppur' ,'Port Blair', 'Karnataka', 'Banglore', 'Hubli + Mysore', 'Maharashtra', 'Telangana', 'Hyderabad', 'Andhra Pradesh', 'Rest of India(incl. Jaipur)', 'Kerala', 'Kolkata', 'Ahmedabad', 'Madhya Pradesh', 'Odisha']
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
        'Port Blair': ["AMN"],
        'Karnataka': ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK", "SVR","BSK","RRN","HUB","DWD", "MCC", "MYS","RJN"],
        'Banglore': ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK","SVR","BSK","RRN","RJN"],
        'Hubli + Mysore': ["HUB","DWD", "MCC", "MYS"],
		'Maharashtra' :["VSH", "PUN", "HDP","CMR"],
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
    "Rwanda":["RWD","CGU"],
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

		let rawftdcogs =0,rawmtdcogs =0;

		mozftdcogs = cogsPercent(ohcBranch['MZQ'].ftd+ohcBranch['BRA'].ftd,ohcBranch['MZQ'].ftdrev+ohcBranch['BRA'].ftdrev);
		mozmtdcogs = cogsPercent(ohcBranch['MZQ'].mtd+ohcBranch['BRA'].mtd,ohcBranch['MZQ'].mtdrev+ohcBranch['BRA'].mtdrev);
		mauritiusftdcogs = cogsPercent(ohcBranch['EBN'].ftd+ohcBranch['FLQ'].ftd+ohcBranch['GDL'].ftd,ohcBranch['EBN'].ftdrev+ohcBranch['FLQ'].ftdrev+ohcBranch['GDL'].ftdrev);
		mauritiusmtdcogs = cogsPercent(ohcBranch['EBN'].mtd+ohcBranch['FLQ'].mtd+ohcBranch['GDL'].mtd,ohcBranch['EBN'].mtdrev+ohcBranch['FLQ'].mtdrev+ohcBranch['GDL'].mtdrev);


		rawftdcogs = cogsPercent(ohcBranch['RWD'].ftd+ohcBranch['CGU'].ftd,ohcBranch['RWD'].ftdrev+ohcBranch['CGU'].ftdrev);
		rawmtdcogs = cogsPercent(ohcBranch['RWD'].mtd+ohcBranch['CGU'].mtd,ohcBranch['RWD'].mtdrev+ohcBranch['CGU'].mtdrev);

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



			ohctempObj['Rwanda'] =  { 'ftdpha': ohcBranch['RWD'].ftdpha+ohcBranch['CGU'].ftdpha,
									   'ftdopt': ohcBranch['RWD'].ftdopt+ohcBranch['CGU'].ftdopt,
										'ftdlab': ohcBranch['RWD'].ftdlab+ohcBranch['CGU'].ftdlab,
										 'ftdot': ohcBranch['RWD'].ftdot+ohcBranch['CGU'].ftdot,
										 'ftd': ohcBranch['RWD'].ftd+ohcBranch['CGU'].ftd,
										 'mtdpha': ohcBranch['RWD'].mtdpha+ohcBranch['CGU'].mtdpha,
										 'mtdopt': ohcBranch['RWD'].mtdopt+ohcBranch['CGU'].mtdopt,
										 'mtdlab': ohcBranch['RWD'].mtdlab+ohcBranch['CGU'].mtdlab,
										 'mtdot': ohcBranch['RWD'].mtdot+ohcBranch['CGU'].mtdot,
										 'mtd': ohcBranch['RWD'].mtd+ohcBranch['CGU'].mtd,
										 'ftdrev': ohcBranch['RWD'].ftdrev+ohcBranch['CGU'].ftdrev,
										 'ftd_cogs_percent': rawftdcogs,
										 'mtdrev': ohcBranch['RWD'].mtdrev+ohcBranch['CGU'].mtdrev,
										 'mtd_cogs_percent': rawmtdcogs,
										 'branch': 'Rwanda' }





	//console.log("11111111");
	//console.log(ohctempObj)

    return {ohc: ohctempObj, aeh: aehtempObj, ahc: ahctempObj, branchwise: branchObj }
}



exports.materialcogs = async (dbres, dbres2, branches, ftddate,  currencyres,currencylastres) => {




	let overseasCurrency = await overseasCurrencyConversion(ftddate,currencyres,currencylastres)
	let entityWise = await filterEntity(dbres, dbres2, ftddate,overseasCurrency)
    let groupWise = await filterGroupwiseMaterialCogs(entityWise.ohcarr, dbres2, branches, ftddate,  overseasCurrency)

	//console.log(groupWise.ohc);
	let ohcTotal = await totalOverseasCogs(groupWise.ohc1);

	//console.log(ohcTotal);

    return {  ohc: groupWise.ohc,ohc1: groupWise.ohc1,ohcgroup: groupWise.ohcgroup,total:ohcTotal }
}


let filterGroupwiseMaterialCogs = async (ohc, dbres2, branches, ftddate, overseasCurrency) => {
    let  branchName = null,  code = null ;

	//console.log(overseasCurrency);
	//process.exit(1)

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
    "Rwanda":["RWD","CGU"],
    "Mauritius":["EBN","FLQ","GDL"],
	"Zambia":["ZMB"],
    "Ghana":["GHA"],
    "Nairobi":["NAB"],
    "Uganda":["UGD"],
	"Tanzania":["TZA"]
  };


    let  mtdphacogs = 0, mtdoptcogs = 0, mtdlabcogs = 0, mtdotcogs = 0, mtdcogs = 0, mtdsurgerycogs=0,  mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdlabrev = 0, mtdotrev = 0,mtdconsurev=0,mtdothersrev=0,mtdsurgeryrev=0;



	let pharevperc=0,optrevperc=0,surrevperc=0,phacogsperc=0,optcogsperc=0,surcogsperc=0;

    let ohcBranch={},ohcBranch1={},ohctempObj={};


	//console.log(ohc);


    ohcGroups.forEach(group => {
        ohctempObj[group] = {}
        ohcgroupedBranches[group].forEach(branch => {
			mtdphacogs = 0, mtdoptcogs = 0, mtdlabcogs = 0, mtdotcogs = 0, mtdcogs = 0, mtdsurgerycogs=0,  mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdlabrev = 0, mtdotrev = 0,mtdconsurev=0,mtdothersrev=0,mtdsurgeryrev=0;

            /*_.filter(ohc, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha += element.pharmacy;
                ftdopt += element.opticals;
                ftdlab += element.laboratory;
                ftdot += element.operation_theatre;
                ftd += element.ftd
            })


			if((Object.keys(overseasCurrency).length) > 0){
				ftdpha = ftdpha*overseasCurrency[branch].mtd;
				ftdopt = ftdopt*overseasCurrency[branch].mtd;
                ftdlab = ftdlab*overseasCurrency[branch].mtd;
                ftdot = ftdot*overseasCurrency[branch].mtd;
                ftd = ftd*overseasCurrency[branch].mtd;

			}

            ohctempObj[group].ftdpha = ftdpha, ohctempObj[group].ftdopt = ftdopt, ohctempObj[group].ftdlab = ftdlab, ohctempObj[group].ftdot = ftdot, ohctempObj[group].ftd = ftd*/
            _.filter(ohc, { branch: branch }).forEach(element => {
                mtdphacogs += element.pharmacy;
                mtdoptcogs += element.opticals;
                mtdlabcogs += element.laboratory;
                mtdotcogs += element.operation_theatre;
                mtdcogs += element.ftd
            })



			if((Object.keys(overseasCurrency).length) > 0){


					mtdphacogs = mtdphacogs*overseasCurrency[branch].mtd;
					mtdoptcogs = mtdoptcogs*overseasCurrency[branch].mtd;
					mtdlabcogs = mtdlabcogs*overseasCurrency[branch].mtd;
					mtdotcogs = mtdotcogs*overseasCurrency[branch].mtd;
					mtdcogs = mtdcogs*overseasCurrency[branch].mtd;



			}
			mtdsurgerycogs = parseFloat(mtdlabcogs)+parseFloat(mtdotcogs);



            ohctempObj[group].mtdphacogs = mtdphacogs;
			ohctempObj[group].mtdoptcogs = mtdoptcogs;
			ohctempObj[group].mtdsurgerycogs = mtdsurgerycogs;
			ohctempObj[group].mtdcogs = mtdcogs;




			/*_.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpharev += element.pharmacy;
                ftdoptrev += element.opticals;
                ftdlabrev += element.laboratory;
                ftdotrev += element.surgery;
				ftdrev += element.ftd;

            })



			if((Object.keys(overseasCurrency).length) > 0){
				ftdpharev = ftdpharev*overseasCurrency[branch].mtd;
				ftdoptrev = ftdoptrev*overseasCurrency[branch].mtd;
				ftdlabrev = ftdlabrev*overseasCurrency[branch].mtd;
				ftdotrev = ftdotrev*overseasCurrency[branch].mtd;
				ftdrev = ftdrev*overseasCurrency[branch].mtd;
			}

            ohctempObj[group].ftdrev = ftdrev, ohctempObj[group].ftd_cogs_percent = cogsPercent(ftd, ftdrev)
            */


			_.filter(dbres2, { branch: branch }).forEach(element => {




                mtdpharev += element.pharmacy;
                mtdoptrev += element.opticals;
                mtdlabrev += element.laboratory;
                mtdotrev += element.surgery;
				mtdconsurev += element.consultation;
				mtdothersrev += element.others;
                mtdrev += element.ftd;
            })



			//mtdsurgeryrev = mtdotrev;


			if((Object.keys(overseasCurrency).length) > 0){

					mtdpharev = mtdpharev*overseasCurrency[branch].mtd;
					mtdoptrev = mtdoptrev*overseasCurrency[branch].mtd;
					mtdlabrev = mtdlabrev*overseasCurrency[branch].mtd;
					mtdotrev = mtdotrev*overseasCurrency[branch].mtd;
					mtdconsurev = mtdconsurev*overseasCurrency[branch].mtd;
					mtdothersrev = mtdothersrev*overseasCurrency[branch].mtd;
					mtdrev = mtdrev*overseasCurrency[branch].mtd;

			}
			mtdsurgeryrev = parseFloat(mtdotrev)+parseFloat(mtdconsurev)+parseFloat(mtdlabrev)+parseFloat(mtdothersrev);

            ohctempObj[group].mtdpharev = mtdpharev;
			ohctempObj[group].mtdoptrev = mtdoptrev;
			ohctempObj[group].mtdsurgeryrev = mtdsurgeryrev;
			ohctempObj[group].mtdrev = mtdrev;
			ohctempObj[group].mtd_cogs_percent = cogsPercent(mtdcogs, mtdrev);
			ohctempObj[group].branch = group;

			_.filter(branches, { code: branch }).forEach(element => { branchName = element.branch, code = element.code })

			ohcBranch[branch] = {
				'mtdphacogs':lakshFormatRevenue(mtdphacogs),
				'mtdoptcogs':lakshFormatRevenue(mtdoptcogs),
				'mtdsurgerycogs':lakshFormatRevenue(mtdsurgerycogs),
				'mtdcogs':lakshFormatRevenue(mtdcogs),
				'mtdpharev':lakshFormatRevenue(mtdpharev),
				'mtdoptrev':lakshFormatRevenue(mtdoptrev),
				'mtdsurgeryrev':lakshFormatRevenue(mtdsurgeryrev),
				'mtdrev':lakshFormatRevenue(mtdrev),
				'mtd_cogs_percent':(cogsPercent(mtdcogs, mtdrev)).toFixed(2),
				'branchname':branchName,
				'code' : branch,
				'entity' : 'OHC',
				'pharevperc':(cogsPercent(mtdpharev, mtdrev)).toFixed(2),
				'optrevperc':(cogsPercent(mtdoptrev, mtdrev)).toFixed(2),
				'surrevperc':(cogsPercent(mtdsurgeryrev, mtdrev)).toFixed(2),
				'phacogsperc':(cogsPercent(mtdphacogs, mtdpharev)).toFixed(2),
				'optcogsperc':(cogsPercent(mtdoptcogs, mtdoptrev)).toFixed(2),
				'surcogsperc':(cogsPercent(mtdsurgerycogs, mtdsurgeryrev)).toFixed(2)
			}

			ohcBranch1[branch] = {
				'mtdphacogs':mtdphacogs,
				'mtdoptcogs':mtdoptcogs,
				'mtdsurgerycogs':mtdsurgerycogs,
				'mtdcogs':mtdcogs,
				'mtdpharev':mtdpharev,
				'mtdoptrev':mtdoptrev,
				'mtdsurgeryrev':mtdsurgeryrev,
				'mtdrev':mtdrev,
				'mtd_cogs_percent':cogsPercent(mtdcogs, mtdrev),
				'branchname':branchName,
				'code' : branch,
				'entity' : 'OHC',
				'pharevperc':(cogsPercent(mtdpharev, mtdrev)).toFixed(2),
				'optrevperc':(cogsPercent(mtdoptrev, mtdrev)).toFixed(2),
				'surrevperc':(cogsPercent(mtdsurgeryrev, mtdrev)).toFixed(2),
				'phacogsperc':(cogsPercent(mtdphacogs, mtdpharev)).toFixed(2),
				'optcogsperc':(cogsPercent(mtdoptcogs, mtdoptrev)).toFixed(2),
				'surcogsperc':(cogsPercent(mtdsurgerycogs, mtdsurgeryrev)).toFixed(2)
			}

			//ohcBranch[branch] = {'mtdrev':mtdrev,'mtd_cogs_percent':cogsPercent(mtd, mtdrev),'branch':group}

        })
        mtdphacogs = 0, mtdoptcogs = 0, mtdlabcogs = 0, mtdotcogs = 0, mtdcogs = 0, mtdsurgerycogs=0,  mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdlabrev = 0, mtdotrev = 0,mtdconsurev=0,mtdothersrev=0,mtdsurgeryrev=0;
    })

    return {ohc: ohcBranch, ohc1: ohcBranch1,ohcgroup:ohctempObj  }
}


let totalOverseasCogs = async (overseasGroup) =>{
	 let totalOverseas = {};

	var totalphacogs = 0,totaloptcogs = 0,totalsurgerycogs=0,totalcogs=0,totalpharev=0,totaloptrev=0,totalsurgeryrev=0,totalrev=0,totalcogs_percent=0,totalpharevperc=0,totaloptrevperc=0,totalsurrevperc=0,totalphacogsperc=0,totaloptcogsperc=0,totalsurcogsperc=0;



		  for (let key in overseasGroup) {

			 totalphacogs = totalphacogs+overseasGroup[key].mtdphacogs;
			 totaloptcogs = totaloptcogs+overseasGroup[key].mtdoptcogs;
			 totalsurgerycogs = totalsurgerycogs+overseasGroup[key].mtdsurgerycogs;
			 totalcogs = totalcogs+overseasGroup[key].mtdcogs;
			 totalpharev = totalpharev+overseasGroup[key].mtdpharev;
			 totaloptrev = totaloptrev+overseasGroup[key].mtdoptrev;
			 totalsurgeryrev = totalsurgeryrev+overseasGroup[key].mtdsurgeryrev;
			 totalrev = totalrev+overseasGroup[key].mtdrev;

		  }

	totalOverseas['mtdphacogs'] = lakshFormatRevenue(totalphacogs);
	totalOverseas['mtdoptcogs'] = lakshFormatRevenue(totaloptcogs);
	totalOverseas['mtdsurgerycogs'] = lakshFormatRevenue(totalsurgerycogs);
	totalOverseas['mtdcogs'] = lakshFormatRevenue(totalcogs);
	totalOverseas['mtdpharev'] = lakshFormatRevenue(totalpharev);
	totalOverseas['mtdoptrev'] = lakshFormatRevenue(totaloptrev);
	totalOverseas['mtdsurgeryrev'] = lakshFormatRevenue(totalsurgeryrev);
	totalOverseas['mtdrev'] = lakshFormatRevenue(totalrev);
	totalOverseas['pharevperc']=(cogsPercent(totalpharev, totalrev)).toFixed(2);
	totalOverseas['optrevperc']=(cogsPercent(totaloptrev, totalrev)).toFixed(2);
	totalOverseas['surrevperc']=(cogsPercent(totalsurgeryrev, totalrev)).toFixed(2);
	totalOverseas['phacogsperc']=(cogsPercent(totalphacogs, totalpharev)).toFixed(2);
	totalOverseas['optcogsperc']=(cogsPercent(totaloptcogs, totaloptrev)).toFixed(2);
	totalOverseas['surcogsperc']=(cogsPercent(totalsurgerycogs, totalsurgeryrev)).toFixed(2);
	totalOverseas['mtd_cogs_percent']=(cogsPercent(totalcogs, totalrev)).toFixed(2);

	return totalOverseas;
}




exports.cogsOverseasEmail = async (finalResult,todatadate) => {
	//console.log("final template");
	let local_template_design_overseas = await cogsEmailTemplateOverseas(finalResult,todatadate);
	return local_template_design_overseas;

}
let cogsEmailTemplateOverseas = async (finalResult,todatadate) => {

	let  branchlist = finalResult.ohc;
	let  totalOhc = finalResult.total;


	//console.log(branchlist);
	//process.exit(1);


	let cogsTemplateOverseas = '<html><body><html><body><table border="0"><tr><th colspan="17">Revenue vs Cogs '+todatadate+' </th></tr><tr><th></th><th></th><th colspan ="4">Revenue</th><th colspan="3" style="background-color:#FFFF33">Revenue Contribution</th><th colspan="4">COGS</th><th colspan="3">COGS %</th><th>Material</th></tr><tr><th>Entity</th><th>Branch</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th><th>MTD</th> <th style="background-color:#FFFF33">Surgery</th> <th style="background-color:#FFFF33">Opticals</th> <th style="background-color:#FFFF33">Pharmacy</th><th>Surgery</th><th>Opticals</th><th>Pharmacy</th> <th>MTD</th> <th style="background-color:#FFFF33">Surgery</th><th style="background-color:#FFFF33">Opticals</th><th style="background-color:#FFFF33">Pharmacy</th><th style="background-color:#9ACD32">Consump %</th> </tr>';



	for (let key in branchlist) {

	    var sugCogsPer ='';
	   var optCogsPer ='';
	   var pharCogsPer ='';
	   var mcCogsPer ='';
	   var sugCogsPerColr ='';
	   var optCogsPerColr ='';
	   var pharCogsPerColr ='';
	   var mcCogsPerColr ='';
	   sugCogsPer = branchlist[key].surcogsperc;
	   optCogsPer = branchlist[key].optcogsperc;
	   pharCogsPer = branchlist[key].phacogsperc;
	   if(sugCogsPer >10){
			sugCogsPerColr = 'background-color:red';
		}

		if(pharCogsPer >50){
			pharCogsPerColr = 'background-color:red';
		}

		if(optCogsPer >35){
			optCogsPerColr = 'background-color:red';
		}
		cogsTemplateOverseas+= '<tr align="right"><td>'+ branchlist[key].entity  +'</td><td>'+ branchlist[key].code  +'</td><td>'+ branchlist[key].mtdsurgeryrev +'</td> <td>'+ branchlist[key].mtdoptrev +'</td> <td>'+ branchlist[key].mtdpharev +'</td> <td>'+ branchlist[key].mtdrev +'</td> <td style="background-color:#FFFF33">'+ branchlist[key].surrevperc +'%</td> <td style="background-color:#FFFF33"> '+ branchlist[key].optrevperc  +'%</td><td style="background-color:#FFFF33">'+ branchlist[key].pharevperc  +'%</td> <td>'+ branchlist[key].mtdsurgerycogs  +'</td> <td>'+ branchlist[key].mtdoptcogs +'</td><td>'+ branchlist[key].mtdphacogs +'</td><td>'+ branchlist[key].mtdcogs +'</td><td style="'+sugCogsPerColr+'">'+ branchlist[key].surcogsperc +'%</td><td style="'+optCogsPerColr+'">'+ branchlist[key].optcogsperc +'%</td><td style="'+pharCogsPerColr+'">'+ branchlist[key].phacogsperc +'%</td><td>'+ branchlist[key].mtd_cogs_percent +'%</td>  </tr>';
	//});
	}

	    var sugCogsPer ='';
	   var optCogsPer ='';
	   var pharCogsPer ='';
	   var mcCogsPer ='';
	   var sugCogsPerColr ='';
	   var optCogsPerColr ='';
	   var pharCogsPerColr ='';
	   var mcCogsPerColr ='';

	   sugCogsPer = totalOhc.surcogsperc;
	   optCogsPer = totalOhc.optcogsperc;
	   pharCogsPer = totalOhc.phacogsperc;

	   if(sugCogsPer >10){
			sugCogsPerColr = 'background-color:red';
		}

		if(pharCogsPer >50){
			pharCogsPerColr = 'background-color:red';
		}

		if(optCogsPer >35){
			optCogsPerColr = 'background-color:red';
		}

	cogsTemplateOverseas+='<tr align="right"><td>Total</td><td></td><td>'+ totalOhc.mtdsurgeryrev +'</td> <td>'+ totalOhc.mtdoptrev +'</td> <td>'+ totalOhc.mtdpharev +'</td> <td>'+ totalOhc.mtdrev +'</td> <td style="background-color:#FFFF33">'+ totalOhc.surrevperc +'%</td> <td style="background-color:#FFFF33"> '+ totalOhc.optrevperc  +'%</td><td style="background-color:#FFFF33">'+ totalOhc.pharevperc  +'%</td> <td>'+ totalOhc.mtdsurgerycogs  +'</td> <td>'+ totalOhc.mtdoptcogs +'</td><td>'+ totalOhc.mtdphacogs +'</td><td>'+ totalOhc.mtdcogs +'</td><td style="'+sugCogsPerColr+'">'+ totalOhc.surcogsperc +'%</td><td style="'+optCogsPerColr+'">'+ totalOhc.optcogsperc +'%</td><td style="'+pharCogsPerColr+'">'+ totalOhc.phacogsperc +'%</td><td>'+ totalOhc.mtd_cogs_percent +'%</td>  </tr>';

	cogsTemplateOverseas+='</table><br><b>Note: This report is auto generated, please do not reply.</b> <br><p>For any corrections, please drop a mail to  <a href="mailto:helpdesk@dragarwal.com">helpdesk@dragarwal.com</a>. </p> <br><p>Regards,</p><p>Dr.Agarwal IT Team</p></body></html>';
	return cogsTemplateOverseas;


}


exports.tpaBillPrint = async (
  rev_det_tpa_res,
  branchres,
  tpa_temp_res,
  ser_mapp_res,
tpaagencyname
) => {

	let finalTemplate = await templateDetailsBuild( rev_det_tpa_res,branchres,tpa_temp_res,ser_mapp_res,tpaagencyname);
	return finalTemplate;
};



let templateDetailsBuild = async ( rev_det_tpa_res,branchres,tpa_temp_res,ser_mapp_res,tpaagencyname) => {

	/*console.log("-----rev deta---");
	console.log(rev_det_res);
	console.log("length");
	console.log(Object.keys(rev_det_res).length);
	console.log("-----rev deta---");
	//process.exit(rev_det_res);
	console.log("-----service mapp---");
	console.log(ser_mapp_res);
	console.log("-----service mapp---");*/



	//let reveTotalRecords = Object.keys(rev_det_res).length;
	let revTpaTotalRecords = Object.keys(rev_det_tpa_res).length;
	let basicDetailsTemplate = '';
	let itemTemplate = '';
	let tpaTemplate = tpa_temp_res[0].tpa_template;

	//let tpaTemplate = '<html><body><table width="100%"><tr><td colspan="6" style="text-align:center;"></td></tr><br><br><br><br><br><br><br><br><br><br><br><tr><td colspan="6" style="text-align:center;">BILL</td></tr><tr><td width="15%"><b>GST NO</b></td><td width="2%">:</td><td width="20%">##GSTNO##</td><td width="15%"><b>PAN NO</b></td><td width="2%">:</td><td width="20%">##PANNO##</td></tr><tr><td width="15%"><b>Bill NO</b></td><td width="2%">:</td><td width="20%">##BILLNO##</td><td width="15%"><b>Bill Date</b></td><td width="2%">:</td><td width="20%">##BILLDATE##</td></tr><tr><td width="15%"><b>Patient Name</b></td><td width="2%">:</td><td width="20%">##PATIENTNAME##</td><td width="15%"><b>Patient MRN</b></td><td width="2%">:</td><td width="20%">##PATIENTMRN##</td></tr><tr><td width="15%"><b>Age/Gender</b></td><td width="2%">:</td><td width="20%">##AGE## / #GENDER#</td><td width="15%"></td><td width="2%"></td><td width="20%"></td></tr><tr><td width="15%"><b>Address</b></td><td width="2%">:</td><td width="20%">##PADDRESS##</td><td width="15%"><b>Procedure</b></td><td width="2%">:</td><td width="20%">##BASICPROCEDUER##</td></tr><tr><td width="15%"><b>Payer</b></td><td width="2%">:</td><td width="20%">##PAYER##</td><td width="15%"><b>Approval No</b></td><td width="2%">:</td><td width="20%">##APPRIVALNO##</td></tr><tr><td width="15%"><b>TPA Address</b></td><td width="2%">:</td><td width="20%"></td><td width="15%"></td><td width="2%">:</td><td width="20%"></td></tr><tr><td width="15%"><b>Admission Date</b></td><td width="2%">:</td><td width="20%">##ADMISSIONDATE##</td><td width="15%"><b>Discharge Date</b></td><td width="2%">:</td><td width="20%">##DISCHARGEDATE##</td></tr><tr><td colspan="6" ></td></tr><tr><td colspan="6" width="100%"><table width="100%"><tr><td width="100%" colspan="5">------------------------------------------------------------------------------------------------------------------------------</td></tr><tr><td width="20%"> SI NO</td><td width="20%"> Item Name</td><td width="20%"> Rate (Rs.)</td><td width="20%"> Discount (Rs.)</td><td width="20%"> Rate (Rs.)</td></tr><tr><td width="100%" colspan="5"> ------------------------------------------------------------------------------------------------------------------------------</td></tr><tr><td width="20%"> PROCEDURES</td><td width="20%"> </td><td width="20%"> </td><td width="20%"> </td><td width="20%"> </td></tr><tr>##ITEMS##<td width="100%" colspan="5"> ----------------------------------------------------------------------------------------------------------------------------</td></tr><tr><td width="20%"></td><td width="10%"></td><td width="40%" style="text-align:right;">Gross Amount(Rs.)</td><td width="10%" > </td><td width="20%" style="text-align:right;"> ##GROSSAMOUNT##</td></tr><tr><td width="20%"> </td><td width="10%"> </td><td width="40%" style="text-align:right;"> Net Total(Rs.)</td><td width="10%" > </td><td width="20%" style="text-align:right;"> ##NETTOTALAMOUNT##</td></tr><tr><td width="20%"></td><td width="10%"></td><td width="40%" style="text-align:right;"> Discount Amt(Rs.)</td><td width="10%" > </td><td width="20%" style="text-align:right;"> ##DISCOUNTAMOUNT##</td></tr><tr><td width="20%"></td><td width="10%"></td><td width="40%" style="text-align:right;">Net Patient Amt(Rs.) </td><td width="10%" > </td><td width="20%" style="text-align:right;"> ##PATIENTAMOUNT##</td></tr><tr><td width="20%"></td><td width="10%"></td><td width="40%" style="text-align:right;"> Net Payer Amt(Rs.)</td><td width="10%" > </td><td width="20%" style="text-align:right;"> ##PAYERAMOUNT##</td></tr></table></td><tr><td colspan="6" style="text-align:left;">##AMOUNTWORDS##</td></tr><tr><td colspan="6" style="text-align:right;"><b>##LABLE##<b></td></tr></tr></table></body></html>';



	let sno = 0;
	let grossamount=0;
	let discountamount = 0;
	let payeramount = 0;
	let patientamount = 0;
	let netamount= 0;
	let basicProcedure = '';
	let eyeValue = '';
	let genderValue = '';
	basicProcedure = rev_det_tpa_res[0].ITEMNAME;

	if((revTpaTotalRecords>0) && (rev_det_tpa_res[0].EYE)){
			eyeValue = rev_det_tpa_res[0].EYE;
	}if((revTpaTotalRecords>0) && (rev_det_tpa_res[0].GENDER)){
			genderValue = rev_det_tpa_res[0].GENDER;
	}


	let disDat = '';
	let AdmiDat = '';
	disDat = rev_det_tpa_res[0].TRANSACTION_DATE
	if(tpa_temp_res[0].discharge_days==0){
		AdmiDat = rev_det_tpa_res[0].TRANSACTION_DATE
	}else{

		var brforedate = new Date(rev_det_tpa_res[0].TRANSACTION_DATE);
		brforedate.setDate(brforedate.getDate() - 1);
		var dd = brforedate.getDate();
		var mm = brforedate.getMonth()+1; //January is 0!
		var yyyy = brforedate.getFullYear();
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
		brforedate = yyyy+'-'+mm+'-'+dd;
		AdmiDat = brforedate;
	}


	basicDetailsTemplate = tpaTemplate.replace("##GSTNO##", branchres[0].gst_no);
	basicDetailsTemplate = basicDetailsTemplate.replace("##PANNO##", branchres[0].pan_no);
	basicDetailsTemplate = basicDetailsTemplate.replace("##BILLNO##", rev_det_tpa_res[0].BILLNO);
	basicDetailsTemplate = basicDetailsTemplate.replace("##BILLDATE##", rev_det_tpa_res[0].TRANSACTION_DATE);
	basicDetailsTemplate = basicDetailsTemplate.replace("##PATIENTNAME##", rev_det_tpa_res[0].PATIENT_NAME);
	basicDetailsTemplate = basicDetailsTemplate.replace("##PATIENTMRN##", rev_det_tpa_res[0].MRN);
	basicDetailsTemplate = basicDetailsTemplate.replace("##AGE##", rev_det_tpa_res[0].PATIENT_AGE);
	basicDetailsTemplate = basicDetailsTemplate.replace(" #GENDER#", genderValue);
	basicDetailsTemplate = basicDetailsTemplate.replace("##PAYER##", tpaagencyname);
	basicDetailsTemplate = basicDetailsTemplate.replace("##PADDRESS##", rev_det_tpa_res[0].ADDRESS);
	basicDetailsTemplate = basicDetailsTemplate.replace("##LABLE##", "For Dr.Agarwal's Eye Hospital");

	for (let key in rev_det_tpa_res) {
		sno++;
		let procedure_name = rev_det_tpa_res[key].ITEMNAME;


		if(ser_mapp_res){
			_.filter(ser_mapp_res, { ideamed_name: rev_det_tpa_res[key].ITEMNAME }).forEach(element => {
				procedure_name = element.mapping_name;
				procedure_name  = eyeValue+' '+ procedure_name;
				basicProcedure = procedure_name;
			});

		}
		itemTemplate+='<tr><td width="10%"> '+sno+'</td><td width="30%"> '+procedure_name+'</td><td width="20%"> '+rev_det_tpa_res[key].NET_AMOUNT+'</td><td width="10%"> 0</td><td width="20%"> '+rev_det_tpa_res[key].NET_AMOUNT+'</td></tr>';

		grossamount+=rev_det_tpa_res[key].TOTAL_AMOUNT;
		netamount+=rev_det_tpa_res[key].NET_AMOUNT;
		discountamount+=rev_det_tpa_res[key].DISCOUNT_AMOUNT;
		payeramount+=rev_det_tpa_res[key].PAYOR_AMOUNT;
		patientamount+=rev_det_tpa_res[key].PATIENT_AMOUNT;
	}
	basicDetailsTemplate = basicDetailsTemplate.replace("##BASICPROCEDUER##", basicProcedure);
	//basicDetailsTemplate = basicDetailsTemplate.replace("##APPRIVALNO##", rev_det_tpa_res[0].acknowledge_id);
	basicDetailsTemplate = basicDetailsTemplate.replace("##APPRIVALNO##", rev_det_tpa_res[0].TPA_CLAIM);
	basicDetailsTemplate = basicDetailsTemplate.replace("##ADMISSIONDATE##", AdmiDat);
	basicDetailsTemplate = basicDetailsTemplate.replace("##DISCHARGEDATE##", disDat);
	basicDetailsTemplate = basicDetailsTemplate.replace("##ITEMS##", itemTemplate);
	let rupeeinwords = "Rupees "+inWords(payeramount)+' Only';
	basicDetailsTemplate = basicDetailsTemplate.replace("##AMOUNTWORDS##", rupeeinwords);
	basicDetailsTemplate = basicDetailsTemplate.replace("##GROSSAMOUNT##", grossamount);
	basicDetailsTemplate = basicDetailsTemplate.replace("##NETTOTALAMOUNT##", netamount);
	basicDetailsTemplate = basicDetailsTemplate.replace("##DISCOUNTAMOUNT##", discountamount);
	basicDetailsTemplate = basicDetailsTemplate.replace("##PATIENTAMOUNT##", patientamount);
	basicDetailsTemplate = basicDetailsTemplate.replace("##PAYERAMOUNT##", payeramount);
	return {"ResponseCode": 200,"ResponseMsg": basicDetailsTemplate};
};


let cogsPercent = (cogs, revenue) => {
    if ((cogs !== 0 && revenue !== 0) || (cogs === 0 && revenue !== 0)) {
        return (cogs / revenue) * 100;
    }
    else if ((revenue === 0) || (cogs === 0 && revenue === 0)) {
        return 0;
    }
}


let lakshFormatRevenue = (num)  => {
    let ftdmtdAmount =(Number(num) / 100000).toFixed(2);
	//console.log(ftdmtdAmount);
	if((parseFloat(ftdmtdAmount)===0.00)){
		return '-';
	}else{
		return ftdmtdAmount;
	}
}

let lakshFormatRevenue1 = (num)  => {
    let ftdmtdAmount =(Number(num) / 100000).toFixed(1);
	//console.log(ftdmtdAmount);
	if((parseFloat(ftdmtdAmount)===0.00)){
		return 0;
	}else{
		return ftdmtdAmount;
	}
}


function inWords (num) {

	var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];


    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' ' : '';
    return str;
}


exports.snapshotR = async (
  rev_det_res,
  rev_target_res,
  threeyearsbef,
  twoyearsbef,
  currentFinYear,
  currentFinYearTo,
  opd_det_res,
  revdetail_res,
  opr_terget_query_res,
  inv_query_res,
  treat_query_res,
  contact_query_res,
  pha_query_res,
  consul_query_res

) => {

	//console.log(revdetail_res);

	let reveCalMonthRes = await reveCalMonthWise( rev_det_res,rev_target_res,threeyearsbef,twoyearsbef,currentFinYear,currentFinYearTo,opd_det_res,revdetail_res,opr_terget_query_res,inv_query_res,treat_query_res,contact_query_res,pha_query_res,consul_query_res);
	let reveCalQRes = await reveCalQWise(reveCalMonthRes,opd_det_res);

	//console.log(String(twoyearsbef));
	//console.log(threeyearsbef);

	let thrreyearbeforText = threeyearsbef.slice(-2)+'-'+String(twoyearsbef).slice(-2);
	let preyearText = String(twoyearsbef).slice(-2)+'-'+currentFinYear.slice(-2);
	let curyearText = currentFinYear.slice(-2)+'-'+currentFinYearTo.slice(-2);
	let goalText = 'GOLY % FY'+currentFinYear.slice(-2)+' vs FY'+currentFinYearTo.slice(-2);
	let goalText1 = 'GOLY % FY'+threeyearsbef.slice(-2)+' vs FY'+String(twoyearsbef).slice(-2);
	return {    'ThirdYearBefore' : thrreyearbeforText,
	            'preYear' : preyearText,
				'curYear' : curyearText,
				'goalText1' : goalText1,
				'goalText' : goalText,
				'monthWiseRevenue' :reveCalMonthRes,
				'QWiseRevenue' :reveCalQRes,
			}
};

let reveCalMonthWise = async ( rev_det_res,rev_target_res,threeyearsbef,twoyearsbef,currentFinYear,currentFinYearTo,opd_det_res,revdetail_res,opr_terget_query_res,inv_query_res,treat_query_res,contact_query_res,pha_query_res,consul_query_res) => {


	//console.log(opr_terget_query_res);
	let threeYearBeforevFinYearArr = [parseInt(threeyearsbef),parseInt(twoyearsbef)];
	let prevFinYearArr = [parseInt(twoyearsbef),parseInt(currentFinYear)];
	let currentFinYearArr = [parseInt(currentFinYear),parseInt(currentFinYearTo)];


	let mtdrev = 0 ,monthNumber ='',monthText ='',mtdrevtarget=0,totalrev=0,totaltarget=0;
	let mtdopd = 0 ,totalopd=0;
	let ctlowend = 0 ,cthighend=0,ctmidend=0,ctlowendtotal = 0 ,cthighendtotal=0,ctmidendtotal=0;
	let ctlowendcount = 0 ,cthighendcount=0,ctmidendcount=0,ctlowendcounttotal = 0 ,cthighendcounttotal=0,ctmidendcounttotal=0;


	let opdtarget=0,paidrevtarget=0,conschargestarget=0,catlenostarget=0,catmenostarget=0,cathenostarget=0,catlevaluestarget=0,catmevaluestarget=0,cathevaluestarget=0;

	let opdtargettotal=0,paidrevtargettotal=0,conschargestargettotal=0,catlenostargettotal=0,catmenostargettotal=0,cathenostargettotal=0,catlevaluestargettotal=0,catmevaluestargettotal=0,cathevaluestargettotal=0;

	let allcatmtd=0,allcatcount=0,allcatcounttotal=0,allcatmtdtotal=0;

	let mtdopt=0,totalopt=0,mtdoptcount=0,totaloptcount=0,mtdopttarget=0,totalopttarget=0,mtdoptcounttarget=0,totaloptcounttarget=0;

	let mtdpha=0,totalpha=0,mtdphacount=0,totalphacount=0,mtdphatarget=0,totalphatarget=0,mtdphacounttarget=0,totalphacounttarget=0;

	let mtdtreat=0,totaltreat=0,mtdtreatcount=0,totaltreatcount=0,mtdtreattarget=0,totaltreattarget=0,mtdtreatcounttarget=0,totaltreatcounttarget=0;

	let mtdinv=0,totalinv=0,mtdinvcount=0,totalinvcount=0,mtdinvtarget=0,totalinvtarget=0,mtdinvcounttarget=0,totalinvcounttarget=0;

	let mtdcor=0,totalcor=0,mtdcorcount=0,totalcorcount=0,mtdcortarget=0,totalcortarget=0,mtdcorcounttarget=0,totalcorcounttarget=0;

	let mtdref=0,totalref=0,mtdrefcount=0,totalrefcount=0,mtdreftarget=0,totalreftarget=0,mtdrefcounttarget=0,totalrefcounttarget=0;

	let mtdosu=0,totalosu=0,mtdosucount=0,totalosucount=0,mtdosutarget=0,totalosutarget=0,mtdosucounttarget=0,totalosucounttarget=0;

	let mtdconlens=0,totalconlens=0,mtdconlenscount=0,totalconlenscount=0,mtdconlenstarget=0,totalconlenstarget=0,mtdconlenscounttarget=0,totalconlenscounttarget=0;

	let mtdvrin=0,totalvrin=0,mtdvrincount=0,totalvrincount=0,mtdvrintarget=0,totalvrintarget=0,mtdvrincounttarget=0,totalvrincounttarget=0;

	let mtdtconsu=0,totaltconsu=0,mtdtconsucount=0,totaltconsucount=0,mtdtconsutarget=0,totaltconsutarget=0,mtdtconsucounttarget=0,totaltconsucounttarget=0;

	let mtdpopd=0,totalpopd=0,mtdpopdcount=0,totalpopdcount=0,mtdpopdtarget=0,totalpopdtarget=0,mtdpopdcounttarget=0,totalpopdcounttarget=0;

	let mtdvrsug=0,totalvrsug=0,mtdvrsugcount=0,totalvrsugcount=0,mtdvrsugtarget=0,totalvrsugtarget=0,mtdvrsugcounttarget=0,totalvrsugcounttarget=0;



    let branchObj = {}, monthWiseObj = {};

	let monthWiseRe=[];




	let monthMapping = {4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec',1:'Jan',2:'Feb',3:'Mar'};
	/*let prevFinyearSet = {
							preFinYearFrom,
							currentFinYear
						 }
	 console.log(prevFinyearSet);
*/

   //console.log(preFinYearFrom);


    let threeYearBeforFinYearMonthSet = {};
   threeYearBeforFinYearMonthSet[threeyearsbef] = [4,5,6,7,8,9,10,11,12];
   threeYearBeforFinYearMonthSet[twoyearsbef] = [1,2,3];

   let prevFinYearMonthSet = {};
   prevFinYearMonthSet[twoyearsbef] = [4,5,6,7,8,9,10,11,12];
   prevFinYearMonthSet[currentFinYear] = [1,2,3];

   let curFinYearMonthSet = {};
   curFinYearMonthSet[currentFinYear] = [4,5,6,7,8,9,10,11,12];
   curFinYearMonthSet[currentFinYearTo] = [1,2,3];

	/*let prevFinYearMonthSet = {
							preFinYearFrom:[4,5,6,7,8,9,10,11,12],
							currentFinYear:[1,2,3]
						 }*/




	monthWiseObj=[];
	let catlowarr = [],cathigharr = [],catmidarr = [],catarr=[];
	let optarr = [],phaarr=[],treatarr=[],invarr=[],corarr=[],refarr=[];

	catlowarr = _.filter(revdetail_res, {  UNIT:'SURGERY', GROUP: 'CATARACT',SUBGROUP: 'CATARACT LOW END'});
	cathigharr = _.filter(revdetail_res, {  UNIT:'SURGERY', GROUP: 'CATARACT',SUBGROUP: 'CATARACT HIGH END'});
	catmidarr = _.filter(revdetail_res, {   UNIT:'SURGERY', GROUP: 'CATARACT',SUBGROUP: 'CATARACT MID END'});
	catarr = catlowarr.concat(cathigharr,catmidarr);

	optarr = _.filter(pha_query_res, {  UNIT:'OPTICALS'});
	phaarr = _.filter(pha_query_res, {  UNIT:'PHARMACY'});

	treatarr = _.filter(treat_query_res, {  UNIT:'TREATMENT'});
	invarr = _.filter(inv_query_res, {  UNIT:'INVESTIGATION'});

	corarr = _.filter(revdetail_res, {  UNIT:'SURGERY', GROUP: 'CORNEA'});
	refarr = _.filter(revdetail_res, {  UNIT:'SURGERY', GROUP: 'REFRACTIVE'});


	/* other surgery*/
	let osurarr=[],osutarr1=[];
	let excludeOtherSurgery = ['REFRACTIVE','CORNEA','CATARACT'];

	osurarr = _.filter(revdetail_res, {  UNIT:'SURGERY'});

	osuarr1= _.filter(osurarr, (v) => !_.includes(excludeOtherSurgery, v.GROUP))

	/* other surgery*/


	let conlensarr=[];

	conlensarr = _.filter(contact_query_res, {   GROUP: 'CONTACT LENS'});

	let vrinarr1=[],vrinarr=[],tconsuarr=[],popdarr=[],vrsugarr=[];



	vrinarr1 = _.filter(revdetail_res, {  UNIT:'SURGERY', GROUP: 'VITREO RETINAL'});
	vrinarr = _.filter(vrinarr1, {   SUBGROUP: 'VR - INJECTION'});

	tconsuarr = _.filter(consul_query_res, {  GROUP: 'CONSULTATION'});
	popdarr = _.filter(consul_query_res, {  GROUP: 'CONSULTATION',VISIT_TYPE:'REVIEW',});

	vrsugarr = _.filter(vrinarr1, (v) => !_.includes(['VR - INJECTION'], v.SUBGROUP));

    let mtdoptypp=0,totaloptypp=0,mtdoptypptarget=0,totaloptypptarget=0;
	let mtdphaypp=0,totalphaypp=0,mtdphaypptarget=0,totalphaypptarget=0;
	let mtdopdypp=0,totalopdypp=0,mtdopdypptarget=0,totalopdypptarget=0;

	prevFinYearArr.forEach(year => {
			 prevFinYearMonthSet[year].forEach(month => {
				 mtdrevtarget=0;
				 mtdrev = 0;
				 mtdopd = 0;
				 ctlowend = 0 ,cthighend=0,ctmidend=0;
				 ctlowendcount = 0 ,cthighendcount=0,ctmidendcount=0;
				 allcatmtd=0,allcatcount=0;
				 opdtarget=0,paidrevtarget=0,conschargestarget=0,catlenostarget=0,catmenostarget=0,cathenostarget=0,catlevaluestarget=0,catmevaluestarget=0,cathevaluestarget=0;

				 mtdopt=0,mtdoptcount=0,mtdopttarget=0,mtdoptcounttarget=0;
				 mtdpha=0,mtdphacount=0,mtdphatarget=0,mtdphacounttarget=0;
				 mtdtreat=0,mtdtreatcount=0,mtdtreattarget=0,mtdtreatcounttarget=0;
				 mtdinv=0,mtdinvcount=0,mtdinvtarget=0,mtdinvcounttarget=0;
				 mtdcor=0,mtdcorcount=0,mtdcortarget=0,mtdcorcounttarget=0;
				 mtdref=0,mtdrefcount=0,mtdreftarget=0,mtdrefcounttarget=0;
				 mtdosu=0,mtdosucount=0,mtdosutarget=0,mtdosucounttarget=0;
				 mtdconlens=0,mtdconlenscount=0,mtdconlenstarget=0,mtdconlenscounttarget=0;
				 mtdvrin=0,mtdvrincount=0,mtdvrintarget=0,mtdvrincounttarget=0;
				 mtdtconsu=0,mtdtconsucount=0,mtdtconsutarget=0,mtdtconsucounttarget=0;
				 mtdpopd=0,mtdpopdcount=0,mtdpopdtarget=0,mtdpopdcounttarget=0;
				 mtdvrsug=0,mtdvrsugcount=0,mtdvrsugtarget=0,mtdvrsugcounttarget=0;

				 mtdoptypp=0,mtdoptypptarget=0;
				 mtdphaypp=0,mtdphaypptarget=0;
				 mtdphaypp=0,mtdphaypptarget=0;

				 monthText = monthMapping[month];


				_.filter(rev_det_res, {  'MONTH(trans_date)': month,'yr' : year}).forEach(
					element => {
						mtdrev+= element.mtd;
						//totalrev+= element.mtd;

				});

				totalrev+= parseFloat(mtdrev);
				//totaloptcount+= parseInt(mtdoptcount);


				_.filter(rev_target_res, {  'target_month': month,'target_year' : year}).forEach(
					element => {
						mtdrevtarget+= element.amount;
						//totaltarget+= element.amount;

				});
				totaltarget+= parseFloat(mtdrevtarget);
				//totaloptcount+= parseInt(mtdoptcount);

				_.filter(opd_det_res, {   'MONTH(trans_date)': month,'yr' : year}).forEach(
					element => {
						mtdopd+= element.mtd;
						//totalopd+= parseInt(element.mtd);


				});
				totalopd+= parseFloat(mtdopd);

				 mtdopdypp=parseInt((lakshFormatRevenue1(mtdrev)/mtdopd)*100000);
				 totalopdypp+=parseInt(mtdopdypp);






				_.filter(catlowarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {


						ctlowend+= element.net_amount;
						ctlowendcount+= element.ct;
						//ctlowendtotal+= parseFloat(element.net_amount);
						//ctlowendcounttotal+= parseInt(element.ct);

				});
				ctlowendtotal+= parseFloat(ctlowend);
				ctlowendcounttotal+= parseInt(ctlowendcount);


				_.filter(cathigharr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						cthighend+= element.net_amount;
						cthighendcount+= element.ct;
						//cthighendtotal+= parseFloat(element.net_amount);
						//cthighendcounttotal+= parseInt(element.ct);


				});
				cthighendtotal+= parseFloat(cthighend);
				cthighendcounttotal+= parseInt(cthighendcount);


				_.filter(catmidarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						ctmidend+= element.net_amount;
						ctmidendcount+= element.ct;
						//ctmidendtotal+= parseFloat(element.net_amount);
						//ctmidendcounttotal+= parseInt(element.ct);


				});
				ctmidendtotal+= parseFloat(ctmidend);
				ctmidendcounttotal+= parseInt(ctmidendcount);

				//allcatmtd=0,allcatcount=0,allcatcounttotal=0,allcatmtdtotal=0;

				_.filter(catarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						allcatmtd += element.net_amount;
						allcatcount+= element.ct;
				});




				_.filter(optarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdopt+= element.net_amount;
						mtdoptcount+= element.ct;




				});
				totalopt+= parseFloat(mtdopt);
				totaloptcount+= parseInt(mtdoptcount);



				 mtdoptypp=parseInt((lakshFormatRevenue1(mtdopt)/mtdoptcount)*100000);
				 totaloptypp+=parseInt(mtdoptypp);




				_.filter(phaarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdpha+= element.net_amount;
						mtdphacount+= element.ct;




				});
				totalpha+= parseFloat(mtdpha);
				totalphacount+= parseInt(mtdphacount);

				mtdphaypp=parseInt((lakshFormatRevenue1(mtdpha)/mtdphacount)*100000);
				totalphaypp+=parseInt(mtdphaypp);


				_.filter(treatarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdtreat+= element.net_amount;
						mtdtreatcount+= element.ct;




				});
				totaltreat+= parseFloat(mtdtreat);
				totaltreatcount+= parseInt(mtdtreatcount);


				_.filter(invarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdinv+= element.net_amount;
						mtdinvcount+= element.ct;




				});
				totalinv+= parseFloat(mtdinv);
				totalinvcount+= parseInt(mtdinvcount);



				_.filter(corarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdcor+= element.net_amount;
						mtdcorcount+= element.ct;




				});
				totalcor+= parseFloat(mtdcor);
				totalcorcount+= parseInt(mtdcorcount);


				_.filter(refarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdref+= element.net_amount;
						mtdrefcount+= element.ct;




				});
				totalref+= parseFloat(mtdref);
				totalrefcount+= parseInt(mtdrefcount);


				_.filter(osuarr1, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdosu+= element.net_amount;
						mtdosucount+= element.ct;




				});
				totalosu+= parseFloat(mtdosu);
				totalosucount+= parseInt(mtdosucount);


				_.filter(conlensarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdconlens+= element.net_amount;
						mtdconlenscount+= element.ct;




				});
				totalconlens+= parseFloat(mtdconlens);
				totalconlenscount+= parseInt(mtdconlenscount);



				_.filter(vrinarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdvrin+= element.net_amount;
						mtdvrincount+= element.ct;




				});
				totalvrin+= parseFloat(mtdvrin);
				totalvrincount+= parseInt(mtdvrincount);


				_.filter(tconsuarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdtconsu+= element.net_amount;
						mtdtconsucount+= element.ct;




				});
				totaltconsu+= parseFloat(mtdtconsu);
				totaltconsucount+= parseInt(mtdtconsucount);


				_.filter(popdarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdpopd+= element.ct;
						mtdpopdcount+= element.ct;




				});
				totalpopd+= parseFloat(mtdpopd);
				totalpopdcount+= parseInt(mtdpopdcount);



				_.filter(vrsugarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdvrsug+= element.net_amount;
						mtdvrsugcount+= element.ct;




				});
				totalvrsug+= parseFloat(mtdvrsug);
				totalvrsugcount+= parseInt(mtdvrsugcount);



				_.filter(opr_terget_query_res, {   'target_month': month,'target_year' : year}).forEach(
					element => {
						opdtarget+= element.target_opd;


						conschargestarget+= element.target_conscharges;

						catlenostarget+= element.target_catlenos;
						catmenostarget+= element.target_catmenos;
						cathenostarget+= element.target_cathenos;
						catlevaluestarget+= element.target_catlevalues;
						catmevaluestarget+= element.target_catmevalues;
						cathevaluestarget+= element.target_cathevalues;

						mtdopttarget+= element.target_opticalordervalues;
						mtdoptcounttarget+= element.target_opticalordernos;
						mtdoptypptarget+=parseInt((mtdopttarget/mtdoptcounttarget)*100000);

						mtdphatarget+= element.target_pharmacyvalues;
						mtdphacounttarget+= element.target_pharmacynos;


						mtdtreattarget+= element.target_investtreatvalues;
						mtdtreatcounttarget+= element.target_investtreatnos;

						mtdcortarget+= element.target_corneavalues;
						mtdcorcounttarget+= element.target_corneanos;
						mtdreftarget+= element.target_refractivevalues;
						mtdrefcounttarget+= element.target_refractivenos;

						mtdosutarget+= element.target_othersurgeryvalues;
						mtdosucounttarget+= element.target_othersurgerynos;

						mtdconlenstarget+= element.target_contactlensvalues;
						mtdconlenscounttarget+= element.target_contactlensnos;
						mtdvrintarget+= element.target_vrinjvalues;
						mtdvrincounttarget+= element.target_vrinjnos;

						mtdtconsutarget+= element.target_conscharges;


						mtdpopdtarget+= element.target_paidreview;

						mtdvrsugtarget+= element.target_vrvalues;
						mtdvrsugcounttarget+= element.target_vrnos;
				});

					    opdtargettotal+= parseInt(opdtarget);
						mtdopdypptarget=parseInt((mtdrevtarget/opdtarget)*100000);
						totalopdypptarget+=parseInt(mtdopdypptarget);

						conschargestargettotal+= parseInt(conschargestarget);
						catlenostargettotal+= parseInt(catlenostarget);
						catmenostargettotal+= parseInt(catmenostarget);
						cathenostargettotal+= parseInt(cathenostarget);
						catlevaluestargettotal+= parseFloat(catlevaluestarget);
						catmevaluestargettotal+= parseFloat(catmevaluestarget);
						cathevaluestargettotal+= parseFloat(cathevaluestarget);

						totalopttarget+= parseFloat(mtdopttarget);
						totaloptcounttarget+= parseInt(mtdoptcounttarget);
						mtdoptypptarget=parseInt((mtdopttarget/mtdoptcounttarget)*100000);
						totaloptypptarget+=parseInt(mtdoptypptarget);


						totalphatarget+= parseFloat(mtdphatarget);
						totalphacounttarget+= parseInt(mtdphacounttarget);
						mtdphaypptarget=parseInt((mtdphatarget/mtdphacounttarget)*100000);
						totalphaypptarget+=parseInt(mtdphaypptarget);

						totaltreattarget+= parseFloat(mtdtreattarget);
						totaltreatcounttarget+= parseInt(mtdtreatcounttarget);

						totalcortarget+= parseFloat(mtdcortarget);
						totalcorcounttarget+= parseInt(mtdcorcounttarget);
						totalreftarget+= parseFloat(mtdreftarget);
						totalrefcounttarget+= parseInt(mtdrefcounttarget);

						totalosutarget+= parseFloat(mtdosutarget);
						totalosucounttarget+= parseInt(mtdosucounttarget);

						totalconlenstarget+= parseFloat(mtdconlenstarget);
						totalconlenscounttarget+= parseInt(mtdconlenscounttarget);
						totalvrintarget+= parseFloat(mtdvrintarget);
						totalvrincounttarget+= parseInt(mtdvrincounttarget);
						totaltconsutarget+= parseFloat(mtdtconsutarget);
						totalpopdtarget+= parseInt(mtdpopdtarget);

						totalvrsugtarget+= parseFloat(mtdvrsugtarget);
						totalvrsugcounttarget+= parseInt(mtdvrsugcounttarget);


				 monthWiseObj.push({
					monthText : monthText,
					mtdrev: lakshFormatRevenue1(mtdrev),
					mtdrevtarget: mtdrevtarget.toFixed(1),

					mtdopd: mtdopd,
					mtdopdypp:mtdopdypp,

				    mtdctlowend:lakshFormatRevenue1(ctlowend),
					mtdcthighend:lakshFormatRevenue1(cthighend),
					mtdctmidend:lakshFormatRevenue1(ctmidend),
					mtdctlowendcount:ctlowendcount,
					mtdcthighendcount:cthighendcount,
					mtdctmidendcount:ctmidendcount,
					mtdallcat:lakshFormatRevenue1(allcatmtd),
					mtdallcatcount:allcatcount,

					mtdopt:lakshFormatRevenue1(mtdopt),
					mtdoptcount:parseInt(mtdoptcount),
					mtdoptypp:mtdoptypp,

					mtdpha:lakshFormatRevenue1(mtdpha),
					mtdphacount:parseInt(mtdphacount),
					mtdphaypp:mtdphaypp,

					mtdtreatinv:(parseFloat(lakshFormatRevenue1(mtdtreat))+parseFloat(lakshFormatRevenue1(mtdinv))).toFixed(1),
					mtdtreatcountinv:parseInt(mtdtreatcount)+parseInt(mtdinvcount),

					mtdcor:lakshFormatRevenue1(mtdcor),
					mtdcorcount:mtdcorcount,
					mtdref:lakshFormatRevenue1(mtdref),
					mtdrefcount:mtdrefcount,

					mtdosu:lakshFormatRevenue1(mtdosu),
					mtdosucount:mtdosucount,

					mtdconlens:lakshFormatRevenue1(mtdconlens),
					mtdconlenscount:mtdconlenscount,
					mtdvrin:lakshFormatRevenue1(mtdvrin),
					mtdvrincount:mtdvrincount,
					mtdtconsu:lakshFormatRevenue1(mtdtconsu),
					mtdtconsucount:mtdtconsucount,

					mtdpopd:mtdpopd,
					mtdpopdcount:mtdpopdcount,
					mtdvrsug:lakshFormatRevenue1(mtdvrsug),
					mtdvrsugcount:mtdvrsugcount,

					mtdopdtarget: opdtarget,
					mtdopdypptarget:mtdopdypptarget,

				    mtdctlowendtarget:catlevaluestarget.toFixed(1),
					mtdcthighendtarget:cathevaluestarget.toFixed(1),
					mtdctmidendtarget:catmevaluestarget.toFixed(1),
					mtdctlowendcounttarget:catlenostarget,
					mtdcthighendcounttarget:cathenostarget,
					mtdctmidendcounttarget:catmenostarget,

					mtdallcattarget:(parseFloat(catlevaluestarget)+parseFloat(catmevaluestarget)+parseFloat(cathevaluestarget)).toFixed(1),
					mtdallcatcounttarget:parseInt(catlenostarget)+parseInt(catmenostarget)+parseInt(cathenostarget),


					mtdopttarget: mtdopttarget.toFixed(1),
					mtdoptcounttarget: mtdoptcounttarget,
					mtdoptypptarget:mtdoptypptarget,

					mtdphatarget: mtdphatarget.toFixed(1),
					mtdphacounttarget: mtdphacounttarget,
					mtdphaypptarget:mtdphaypptarget,

					mtdtreatinvtarget: mtdtreattarget.toFixed(1),
					mtdtreatinvcounttarget: mtdtreatcounttarget,

					mtdcortarget: mtdcortarget.toFixed(1),
					mtdcorcounttarget: mtdcorcounttarget,
					mtdreftarget: mtdreftarget.toFixed(1),
					mtdrefcounttarget: mtdrefcounttarget,

					mtdosutarget: mtdosutarget.toFixed(1),
					mtdosucounttarget: mtdosucounttarget,
					mtdconlenstarget: mtdconlenstarget.toFixed(1),
					mtdconlenscounttarget: mtdconlenscounttarget,
					mtdvrintarget: mtdvrintarget.toFixed(1),
					mtdvrincounttarget: mtdvrincounttarget,
					mtdtconsutarget: mtdtconsutarget.toFixed(1),
					mtdtconsucounttarget: mtdtconsucounttarget,
					mtdpopdtarget: mtdpopdtarget,
					mtdvrsugtarget: mtdvrsugtarget.toFixed(1),
					mtdvrsugcounttarget: mtdvrsugcounttarget,




				});


			 });
	});

	branchObj['lastyearmonth'] = monthWiseObj;



	branchObj['lastyeartotal'] = {
					totalrev: lakshFormatRevenue1(totalrev),
					totaltarget: totaltarget.toFixed(1),

					totalopd: totalopd,
					totalopdypp:parseInt(totalopdypp),

					totalctlowend: lakshFormatRevenue1(ctlowendtotal),
					totalctmidend: lakshFormatRevenue1(ctmidendtotal),
					totalcthighend: lakshFormatRevenue1(cthighendtotal),
					totalctlowendcount: ctlowendcounttotal,
					totalctmidendcount: ctmidendcounttotal,
					totalcthighendcount: cthighendcounttotal,
					totalallcat: lakshFormatRevenue1(parseFloat(ctlowendtotal)+parseFloat(ctmidendtotal)+parseFloat(cthighendtotal)),
					totalallcatcount: parseInt(ctlowendcounttotal)+parseInt(ctmidendcounttotal)+parseInt(cthighendcounttotal),

					totalopt: lakshFormatRevenue1(totalopt),
					totaloptcount: totaloptcount,
					totaloptypp: parseInt(totaloptypp),


					totalpha: lakshFormatRevenue1(totalpha),
					totalphacount: totalphacount,
					totalphaypp: parseInt(totalphaypp),

					totaltreatinv: lakshFormatRevenue1(parseFloat(totaltreat)+parseFloat(totalinv)),
					totaltreatinvcount: parseInt(totaltreatcount)+parseInt(totalinvcount),

					totalcor: lakshFormatRevenue1(totalcor),
					totalcorcount: totalcorcount,
					totalref: lakshFormatRevenue1(totalref),
					totalrefcount: totalrefcount,
					totalosu: lakshFormatRevenue1(totalosu),
					totalosucount: totalosucount,
					totalconlens: lakshFormatRevenue1(totalconlens),
					totalconlenscount: totalconlenscount,
					totalvrin: lakshFormatRevenue1(totalvrin),
					totalvrincount: totalvrincount,

					totaltconsu: lakshFormatRevenue1(totaltconsu),
					totaltconsucount: totaltconsucount,
					totalpopd: totalpopd,
					totalpopdcount: totalpopdcount,
					totalvrsug: lakshFormatRevenue1(totalvrsug),
					totalvrsugcount: totalvrsugcount,

					totalopdtarget: opdtargettotal,
					totalopdypptarget:parseInt(totalopdypptarget),


				    totalctlowendtarget:catlevaluestargettotal.toFixed(1),
					totalcthighendtarget:cathevaluestargettotal.toFixed(1),
					totalctmidendtarget:catmevaluestargettotal.toFixed(1),
					totalctlowendcounttarget:catlenostargettotal,
					totalcthighendcounttarget:cathenostargettotal,
					totalctmidendcounttarget:catmenostargettotal,
					totalallcatcounttarget: parseInt(catlenostargettotal)+parseInt(catmenostargettotal)+parseInt(cathenostargettotal),
					totalallcattarget:(parseFloat(catlevaluestargettotal)+parseFloat(catmevaluestargettotal)+parseFloat(cathevaluestargettotal)).toFixed(1),

					totalopttarget:totalopttarget.toFixed(1),
					totaloptcounttarget:totaloptcounttarget,
					totaloptypptarget:parseInt(totaloptypptarget),



					totalphatarget:totalphatarget.toFixed(1),
					totalphacounttarget:totalphacounttarget,
					totalphaypptarget:parseInt(totalphaypptarget),

					totaltreatinvtarget:totaltreattarget.toFixed(1),
					totaltreatinvcounttarget:totaltreatcounttarget,

					totalcortarget:totalcortarget.toFixed(1),
					totalcorcounttarget:totalcorcounttarget,
					totalreftarget:totalreftarget.toFixed(1),
					totalrefcounttarget:totalrefcounttarget,

					totalosutarget:totalosutarget.toFixed(1),
					totalosucounttarget:totalosucounttarget,
					totalconlenstarget: totalconlenstarget.toFixed(1),
					totalconlenscounttarget: totalconlenscounttarget,
					totalvrintarget: totalvrintarget.toFixed(1),
					totalvrincounttarget: totalvrincounttarget,
					totaltconsutarget: totaltconsutarget.toFixed(1),
					totalpopdtarget: totalpopdtarget,
					totalvrsugtarget: totalvrsugtarget.toFixed(1),
					totalvrsugcounttarget: totalvrsugcounttarget

					};
	monthWiseObj=[];
	mtdrevtarget=0;
	mtdrev = 0;
	mtdopd = 0;
	totalrev=0;
	totaltarget=0;
	totalopd=0;
	ctlowend = 0 ,cthighend=0,ctmidend=0;
	ctlowendcount = 0 ,cthighendcount=0,ctmidendcount=0;
    ctlowendtotal = 0 ,cthighendtotal=0,ctmidendtotal=0;
    ctlowendcounttotal = 0 ,cthighendcounttotal=0,ctmidendcounttotal=0;
    allcatmtd=0,allcatcount=0,allcatcounttotal=0,allcatmtdtotal=0;
	opdtarget=0,paidrevtarget=0,conschargestarget=0,catlenostarget=0,catmenostarget=0,cathenostarget=0,catlevaluestarget=0,catmevaluestarget=0,cathevaluestarget=0;
    opdtargettotal=0,paidrevtargettotal=0,conschargestargettotal=0,catlenostargettotal=0,catmenostargettotal=0,cathenostargettotal=0,catlevaluestargettotal=0,catmevaluestargettotal=0,cathevaluestargettotal=0;
	mtdpha=0,totalpha=0,mtdphacount=0,totalphacount=0,mtdphatarget=0,totalphatarget=0,mtdphacounttarget=0,totalphacounttarget=0;
	mtdopt=0,totalopt=0,mtdoptcount=0,totaloptcount=0,mtdopttarget=0,totalopttarget=0,mtdoptcounttarget=0,totaloptcounttarget=0

    mtdtreat=0,totaltreat=0,mtdtreatcount=0,totaltreatcount=0,mtdtreattarget=0,totaltreattarget=0,mtdtreatcounttarget=0,totaltreatcounttarget=0;

	mtdinv=0,totalinv=0,mtdinvcount=0,totalinvcount=0,mtdinvtarget=0,totalinvtarget=0,mtdinvcounttarget=0,totalinvcounttarget=0;

    mtdcor=0,totalcor=0,mtdcorcount=0,totalcorcount=0,mtdcortarget=0,totalcortarget=0,mtdcorcounttarget=0,totalcorcounttarget=0;

	mtdref=0,totalref=0,mtdrefcount=0,totalrefcount=0,mtdreftarget=0,totalreftarget=0,mtdrefcounttarget=0,totalrefcounttarget=0;

    mtdosu=0,totalosu=0,mtdosucount=0,totalosucount=0,mtdosutarget=0,totalosutarget=0,mtdosucounttarget=0,totalosucounttarget=0;

    mtdconlens=0,totalconlens=0,mtdconlenscount=0,totalconlenscount=0,mtdconlenstarget=0,totalconlenstarget=0,mtdconlenscounttarget=0,totalconlenscounttarget=0;

    mtdvrin=0,totalvrin=0,mtdvrincount=0,totalvrincount=0,mtdvrintarget=0,totalvrintarget=0,mtdvrincounttarget=0,totalvrincounttarget=0;

	 mtdtconsu=0,totaltconsu=0,mtdtconsucount=0,totaltconsucount=0,mtdtconsutarget=0,totaltconsutarget=0,mtdtconsucounttarget=0,totaltconsucounttarget=0;
	 mtdpopd=0,totalpopd=0,mtdpopdcount=0,totalpopdcount=0,mtdpopdtarget=0,totalpopdtarget=0,mtdpopdcounttarget=0,totalpopdcounttarget=0;

	 mtdvrsug=0,totalvrsug=0,mtdvrsugcount=0,totalvrsugcount=0,mtdvrsugtarget=0,totalvrsugtarget=0,mtdvrsugcounttarget=0,totalvrsugcounttarget=0;

	 mtdoptypp=0,totaloptypp=0,mtdoptypptarget=0,totaloptypptarget=0;
	 mtdphaypp=0,totalphaypp=0,mtdphaypptarget=0,totalphaypptarget=0;
	 mtdopdypp=0,totalopdypp=0,mtdopdypptarget=0,totalopdypptarget=0;

	currentFinYearArr.forEach(year => {
			 curFinYearMonthSet[year].forEach(month => {
                 mtdrevtarget=0;
				 mtdrev = 0;
                 mtdopd = 0;
				 ctlowend = 0 ,cthighend=0,ctmidend=0;
				 ctlowendcount = 0 ,cthighendcount=0,ctmidendcount=0;
				 allcatmtd=0,allcatcount=0;
                 opdtarget=0,paidrevtarget=0,conschargestarget=0,catlenostarget=0,catmenostarget=0,cathenostarget=0,catlevaluestarget=0,catmevaluestarget=0,cathevaluestarget=0;

				  mtdopt=0,mtdoptcount=0,mtdopttarget=0,mtdoptcounttarget=0;
				  mtdpha=0,mtdphacount=0,mtdphatarget=0,mtdphacounttarget=0;
				  mtdtreat=0,mtdtreatcount=0,mtdtreattarget=0,mtdtreatcounttarget=0;
				  mtdinv=0,mtdinvcount=0,mtdinvtarget=0,mtdinvcounttarget=0;
				  mtdcor=0,mtdcorcount=0,mtdcortarget=0,mtdcorcounttarget=0;
				  mtdref=0,mtdrefcount=0,mtdreftarget=0,mtdrefcounttarget=0;
				  mtdosu=0,mtdosucount=0,mtdosutarget=0,mtdosucounttarget=0;
				  mtdconlens=0,mtdconlenscount=0,mtdconlenstarget=0,mtdconlenscounttarget=0;
				  mtdvrin=0,mtdvrincount=0,mtdvrintarget=0,mtdvrincounttarget=0;
				  mtdtconsu=0,mtdtconsucount=0,mtdtconsutarget=0,mtdtconsucounttarget=0;
				  mtdpopd=0,mtdpopdcount=0,mtdpopdtarget=0,mtdpopdcounttarget=0;
				  mtdvrsug=0,mtdvrsugcount=0,mtdvrsugtarget=0,mtdvrsugcounttarget=0;
				  mtdoptypp=0,mtdoptypptarget=0;
				  mtdphaypp=0,mtdphaypptarget=0;
				  mtdopdypp=0,mtdopdypptarget=0;

				 monthText = monthMapping[month];

                 _.filter(rev_det_res, {  'MONTH(trans_date)': month,'yr' : year}).forEach(
					element => {
						mtdrev+= element.mtd;
						//totalrev+= element.mtd;

				});

				totalrev+= parseFloat(mtdrev);
				//totaloptcount+= parseInt(mtdoptcount);


				_.filter(rev_target_res, {  'target_month': month,'target_year' : year}).forEach(
					element => {
						mtdrevtarget+= element.amount;
						//totaltarget+= element.amount;

				});
				totaltarget+= parseFloat(mtdrevtarget);
				//totaloptcount+= parseInt(mtdoptcount);

				_.filter(opd_det_res, {   'MONTH(trans_date)': month,'yr' : year}).forEach(
					element => {
						mtdopd+= element.mtd;
						//totalopd+= parseInt(element.mtd);


				});
				totalopd+= parseFloat(mtdopd);

				 mtdopdypp=parseInt((lakshFormatRevenue1(mtdrev)/mtdopd)*100000);
				 totalopdypp+=parseInt(mtdopdypp);






				_.filter(catlowarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {


						ctlowend+= element.net_amount;
						ctlowendcount+= element.ct;
						//ctlowendtotal+= parseFloat(element.net_amount);
						//ctlowendcounttotal+= parseInt(element.ct);

				});
				ctlowendtotal+= parseFloat(ctlowend);
				ctlowendcounttotal+= parseInt(ctlowendcount);


				_.filter(cathigharr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						cthighend+= element.net_amount;
						cthighendcount+= element.ct;
						//cthighendtotal+= parseFloat(element.net_amount);
						//cthighendcounttotal+= parseInt(element.ct);


				});
				cthighendtotal+= parseFloat(cthighend);
				cthighendcounttotal+= parseInt(cthighendcount);


				_.filter(catmidarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						ctmidend+= element.net_amount;
						ctmidendcount+= element.ct;
						//ctmidendtotal+= parseFloat(element.net_amount);
						//ctmidendcounttotal+= parseInt(element.ct);


				});
				ctmidendtotal+= parseFloat(ctmidend);
				ctmidendcounttotal+= parseInt(ctmidendcount);

				//allcatmtd=0,allcatcount=0,allcatcounttotal=0,allcatmtdtotal=0;

				_.filter(catarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						allcatmtd += element.net_amount;
						allcatcount+= element.ct;
				});

				_.filter(optarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdopt+= element.net_amount;
						mtdoptcount+= element.ct;



				});

				totalopt+= parseFloat(mtdopt);
				totaloptcount+= parseInt(mtdoptcount);

				mtdoptypp=parseInt((lakshFormatRevenue1(mtdopt)/mtdoptcount)*100000);
				totaloptypp+=parseInt(mtdoptypp);


				_.filter(phaarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdpha+= element.net_amount;
						mtdphacount+= element.ct;




				});
				totalpha+= parseFloat(mtdpha);
				totalphacount+= parseInt(mtdphacount);


				mtdphaypp=parseInt((lakshFormatRevenue1(mtdpha)/mtdphacount)*100000);
				totalphaypp+=parseInt(mtdphaypp);


				_.filter(treatarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdtreat+= element.net_amount;
						mtdtreatcount+= element.ct;




				});
				totaltreat+= parseFloat(mtdtreat);
				totaltreatcount+= parseInt(mtdtreatcount);


				_.filter(invarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdinv+= element.net_amount;
						mtdinvcount+= element.ct;




				});
				totalinv+= parseFloat(mtdinv);
				totalinvcount+= parseInt(mtdinvcount);


				_.filter(corarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdcor+= element.net_amount;
						mtdcorcount+= element.ct;




				});
				totalcor+= parseFloat(mtdcor);
				totalcorcount+= parseInt(mtdcorcount);


				_.filter(refarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdref+= element.net_amount;
						mtdrefcount+= element.ct;




				});
				totalref+= parseFloat(mtdref);
				totalrefcount+= parseInt(mtdrefcount);



				_.filter(osuarr1, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdosu+= element.net_amount;
						mtdosucount+= element.ct;




				});
				totalosu+= parseFloat(mtdosu);
				totalosucount+= parseInt(mtdosucount);


				_.filter(conlensarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdconlens+= element.net_amount;
						mtdconlenscount+= element.ct;




				});
				totalconlens+= parseFloat(mtdconlens);
				totalconlenscount+= parseInt(mtdconlenscount);


				_.filter(vrinarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdvrin+= element.net_amount;
						mtdvrincount+= element.ct;




				});
				totalvrin+= parseFloat(mtdvrin);
				totalvrincount+= parseInt(mtdvrincount);


				_.filter(tconsuarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdtconsu+= element.net_amount;
						mtdtconsucount+= element.ct;




				});
				totaltconsu+= parseFloat(mtdtconsu);
				totaltconsucount+= parseInt(mtdtconsucount);


				_.filter(popdarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdpopd+= element.ct;
						mtdpopdcount+= element.ct;




				});
				totalpopd+= parseFloat(mtdpopd);
				totalpopdcount+= parseInt(mtdpopdcount);


				_.filter(vrsugarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdvrsug+= element.net_amount;
						mtdvrsugcount+= element.ct;




				});
				totalvrsug+= parseFloat(mtdvrsug);
				totalvrsugcount+= parseInt(mtdvrsugcount);


				_.filter(opr_terget_query_res, { 'target_month': month,'target_year' : year}).forEach(
					element => {



						opdtarget+= element.target_opd;


						conschargestarget+= element.target_conscharges;

						catlenostarget+= element.target_catlenos;
						catmenostarget+= element.target_catmenos;
						cathenostarget+= element.target_cathenos;
						catlevaluestarget+= element.target_catlevalues;
						catmevaluestarget+= element.target_catmevalues;
						cathevaluestarget+= element.target_cathevalues;

						mtdopttarget+= element.target_opticalordervalues;
						mtdoptcounttarget+= element.target_opticalordernos;
						mtdoptypptarget+=parseInt((mtdopttarget/mtdoptcounttarget)*100000);

						mtdphatarget+= element.target_pharmacyvalues;
						mtdphacounttarget+= element.target_pharmacynos;


						mtdtreattarget+= element.target_investtreatvalues;
						mtdtreatcounttarget+= element.target_investtreatnos;

						mtdcortarget+= element.target_corneavalues;
						mtdcorcounttarget+= element.target_corneanos;
						mtdreftarget+= element.target_refractivevalues;
						mtdrefcounttarget+= element.target_refractivenos;

						mtdosutarget+= element.target_othersurgeryvalues;
						mtdosucounttarget+= element.target_othersurgerynos;

						mtdconlenstarget+= element.target_contactlensvalues;
						mtdconlenscounttarget+= element.target_contactlensnos;
						mtdvrintarget+= element.target_vrinjvalues;
						mtdvrincounttarget+= element.target_vrinjnos;

						mtdtconsutarget+= element.target_conscharges;


						mtdpopdtarget+= element.target_paidreview;

						mtdvrsugtarget+= element.target_vrvalues;
						mtdvrsugcounttarget+= element.target_vrnos;




				});
						opdtargettotal+= parseInt(opdtarget);
						mtdopdypptarget=parseInt((mtdrevtarget/opdtarget)*100000);
						totalopdypptarget+=parseInt(mtdopdypptarget);

						conschargestargettotal+= parseInt(conschargestarget);
						catlenostargettotal+= parseInt(catlenostarget);
						catmenostargettotal+= parseInt(catmenostarget);
						cathenostargettotal+= parseInt(cathenostarget);
						catlevaluestargettotal+= parseFloat(catlevaluestarget);
						catmevaluestargettotal+= parseFloat(catmevaluestarget);
						cathevaluestargettotal+= parseFloat(cathevaluestarget);

						totalopttarget+= parseFloat(mtdopttarget);
						totaloptcounttarget+= parseInt(mtdoptcounttarget);
						mtdoptypptarget=parseInt((mtdopttarget/mtdoptcounttarget)*100000);
						totaloptypptarget+=parseInt(mtdoptypptarget);


						totalphatarget+= parseFloat(mtdphatarget);
						totalphacounttarget+= parseInt(mtdphacounttarget);
						mtdphaypptarget=parseInt((mtdphatarget/mtdphacounttarget)*100000);
						totalphaypptarget+=parseInt(mtdphaypptarget);

						totaltreattarget+= parseFloat(mtdtreattarget);
						totaltreatcounttarget+= parseInt(mtdtreatcounttarget);

						totalcortarget+= parseFloat(mtdcortarget);
						totalcorcounttarget+= parseInt(mtdcorcounttarget);
						totalreftarget+= parseFloat(mtdreftarget);
						totalrefcounttarget+= parseInt(mtdrefcounttarget);

						totalosutarget+= parseFloat(mtdosutarget);
						totalosucounttarget+= parseInt(mtdosucounttarget);

						totalconlenstarget+= parseFloat(mtdconlenstarget);
						totalconlenscounttarget+= parseInt(mtdconlenscounttarget);
						totalvrintarget+= parseFloat(mtdvrintarget);
						totalvrincounttarget+= parseInt(mtdvrincounttarget);
						totaltconsutarget+= parseFloat(mtdtconsutarget);
						totalpopdtarget+= parseInt(mtdpopdtarget);

						totalvrsugtarget+= parseFloat(mtdvrsugtarget);
						totalvrsugcounttarget+= parseInt(mtdvrsugcounttarget);

				 monthWiseObj.push({
					monthText : monthText,
					mtdrev: lakshFormatRevenue1(mtdrev),
					mtdrevtarget: mtdrevtarget.toFixed(1),

					mtdopd: mtdopd,
					mtdopdypp:mtdopdypp,

					mtdctlowend:lakshFormatRevenue1(ctlowend),
					mtdcthighend:lakshFormatRevenue1(cthighend),
					mtdctmidend:lakshFormatRevenue1(ctmidend),
					mtdctlowendcount:ctlowendcount,
					mtdcthighendcount:cthighendcount,
					mtdctmidendcount:ctmidendcount,
					mtdallcat:lakshFormatRevenue1(allcatmtd),
					mtdallcatcount:allcatcount,

					mtdopt:lakshFormatRevenue1(mtdopt),
					mtdoptcount:parseInt(mtdoptcount),
					mtdoptypp:mtdoptypp,
					mtdpha:lakshFormatRevenue1(mtdpha),
					mtdphacount:parseInt(mtdphacount),
					mtdphaypp:mtdphaypp,
					mtdtreatinv:(parseFloat(lakshFormatRevenue1(mtdtreat))+parseFloat(lakshFormatRevenue1(mtdinv))).toFixed(1),
					mtdtreatcountinv:parseInt(mtdtreatcount)+parseInt(mtdinvcount),

					mtdcor:lakshFormatRevenue1(mtdcor),
					mtdcorcount:mtdcorcount,
					mtdref:lakshFormatRevenue1(mtdref),
					mtdrefcount:mtdrefcount,

					mtdosu:lakshFormatRevenue1(mtdosu),
					mtdosucount:mtdosucount,
					mtdconlens: lakshFormatRevenue1(mtdconlens),
					mtdconlenscount: mtdconlenscount,
					mtdvrin:lakshFormatRevenue1(mtdvrin),
					mtdvrincount:mtdvrincount,

					mtdtconsu:lakshFormatRevenue1(mtdtconsu),
					mtdtconsucount:mtdtconsucount,
					mtdpopd:mtdpopd,
					mtdpopdcount:mtdpopdcount,
					mtdvrsug:lakshFormatRevenue1(mtdvrsug),
					mtdvrsugcount:mtdvrsugcount,

					mtdopdtarget: opdtarget,
					mtdopdypptarget:mtdopdypptarget,


				    mtdctlowendtarget:catlevaluestarget.toFixed(1),
					mtdcthighendtarget:cathevaluestarget.toFixed(1),
					mtdctmidendtarget:catmevaluestarget.toFixed(1),
					mtdctlowendcounttarget:catlenostarget,
					mtdcthighendcounttarget:cathenostarget,
					mtdctmidendcounttarget:catmenostarget,

					mtdallcattarget:(parseFloat(catlevaluestarget)+parseFloat(catmevaluestarget)+parseFloat(cathevaluestarget)).toFixed(1),
					mtdallcatcounttarget:parseInt(catlenostarget)+parseInt(catmenostarget)+parseInt(cathenostarget),

					mtdopttarget: mtdopttarget.toFixed(1),
					mtdoptcounttarget: mtdoptcounttarget,
					mtdoptypptarget:mtdoptypptarget,

					mtdphatarget: mtdphatarget.toFixed(1),
					mtdphacounttarget: mtdphacounttarget,
					mtdphaypptarget:mtdphaypptarget,




					mtdtreatinvtarget: mtdtreattarget.toFixed(1),
					mtdtreatinvcounttarget: mtdtreatcounttarget,

					mtdcortarget: mtdcortarget.toFixed(1),
					mtdcorcounttarget: mtdcorcounttarget,
					mtdreftarget: mtdreftarget.toFixed(1),
					mtdrefcounttarget: mtdrefcounttarget,

					mtdosutarget: mtdosutarget.toFixed(1),
					mtdosucounttarget: mtdosucounttarget,
					mtdconlenstarget: mtdconlenstarget.toFixed(1),
					mtdconlenscounttarget: mtdconlenscounttarget,
					mtdvrintarget: mtdvrintarget.toFixed(1),
					mtdvrincounttarget: mtdvrincounttarget,
					mtdtconsutarget: mtdtconsutarget.toFixed(1),
					mtdtconsucounttarget: mtdtconsucounttarget,
					mtdpopdtarget: mtdpopdtarget,
					mtdvrsugtarget: mtdvrsugtarget.toFixed(1),
					mtdvrsugcounttarget: mtdvrsugcounttarget

				});


			 });
	});


	branchObj['currentyearmonth'] = monthWiseObj;
	branchObj['currentyeartotal'] = {
					totalrev: lakshFormatRevenue1(totalrev),
					totaltarget: totaltarget.toFixed(1),

					totalopd: totalopd,
					totalopdypp: parseInt(totalopdypp),

					totalctlowend: lakshFormatRevenue1(ctlowendtotal),
					totalctmidend: lakshFormatRevenue1(ctmidendtotal),
					totalcthighend: lakshFormatRevenue1(cthighendtotal),
					totalctlowendcount: ctlowendcounttotal,
					totalctmidendcount: ctmidendcounttotal,
					totalcthighendcount: cthighendcounttotal,
					totalallcat: lakshFormatRevenue1(parseFloat(ctlowendtotal)+parseFloat(ctmidendtotal)+parseFloat(cthighendtotal)),
					totalallcatcount: parseInt(ctlowendcounttotal)+parseInt(ctmidendcounttotal)+parseInt(cthighendcounttotal),

					totalopt: lakshFormatRevenue1(totalopt),
					totaloptcount: totaloptcount,
					totaloptypp: parseInt(totaloptypp),

					totalpha: lakshFormatRevenue1(totalpha),
					totalphacount: totalphacount,
					totalphaypp: parseInt(totalphaypp),

					totaltreatinv: lakshFormatRevenue1(parseFloat(totaltreat)+parseFloat(totalinv)),
					totaltreatinvcount: parseInt(totaltreatcount)+parseInt(totalinvcount),

					totalcor: lakshFormatRevenue1(totalcor),
					totalcorcount: totalcorcount,
					totalref: lakshFormatRevenue1(totalref),
					totalrefcount: totalrefcount,
					totalosu: lakshFormatRevenue1(totalosu),
					totalosucount: totalosucount,

					totalconlens: lakshFormatRevenue1(totalconlens),
					totalconlenscount: totalconlenscount,
					totalvrin: lakshFormatRevenue1(totalvrin),
					totalvrincount: totalvrincount,
					totaltconsu: lakshFormatRevenue1(totaltconsu),
					totaltconsucount: totaltconsucount,
					totalpopd: totalpopd,
					totalpopdcount: totalpopdcount,
					totalvrsug: lakshFormatRevenue1(totalvrsug),
					totalvrsugcount: totalvrsugcount,

					totalopdtarget: opdtargettotal,
					totalopdypptarget:parseInt(totalopdypptarget),

				    totalctlowendtarget:catlevaluestargettotal.toFixed(1),
					totalcthighendtarget:cathevaluestargettotal.toFixed(1),
					totalctmidendtarget:catmevaluestargettotal.toFixed(1),
					totalctlowendcounttarget:catlenostargettotal,
					totalcthighendcounttarget:cathenostargettotal,
					totalctmidendcounttarget:catmenostargettotal,
					totalallcatcounttarget: parseInt(catlenostargettotal)+parseInt(catmenostargettotal)+parseInt(cathenostargettotal),
					totalallcattarget:(parseFloat(catlevaluestargettotal)+parseFloat(catmevaluestargettotal)+parseFloat(cathevaluestargettotal)).toFixed(1),

					totalopttarget:totalopttarget.toFixed(1),
					totaloptcounttarget:totaloptcounttarget,
					totaloptypptarget:parseInt(totaloptypptarget),

					totalphatarget:totalphatarget.toFixed(1),
					totalphacounttarget:totalphacounttarget,
					totalphaypptarget:parseInt(totalphaypptarget),


					totaltreatinvtarget:totaltreattarget.toFixed(1),
					totaltreatinvcounttarget:totaltreatcounttarget,

					totalcortarget:totalcortarget.toFixed(1),
					totalcorcounttarget:totalcorcounttarget,
					totalreftarget:totalreftarget.toFixed(1),
					totalrefcounttarget:totalrefcounttarget,

					totalosutarget:totalosutarget.toFixed(1),
					totalosucounttarget:totalosucounttarget,
					totalconlenstarget: totalconlenstarget.toFixed(1),
					totalconlenscounttarget: totalconlenscounttarget,
					totalvrintarget: totalvrintarget.toFixed(1),
					totalvrincounttarget: totalvrincounttarget,
					totaltconsutarget: totaltconsutarget.toFixed(1),
					totalpopdtarget: totalpopdtarget,
					totalvrsugtarget: totalvrsugtarget.toFixed(1),
					totalvrsugcounttarget: totalvrsugcounttarget


					};

					/*console.log(branchObj.currentyeartotal.totalpopd);
					console.log(branchObj.lastyeartotal.totalpopd);

					console.log((parseFloat((branchObj.currentyeartotal.totalpopd/parseFloat(branchObj.lastyeartotal.totalpopd)-1))*100).toFixed(1));*/



	/* three year before*/


	monthWiseObj=[];
	mtdrevtarget=0;
	mtdrev = 0;
	mtdopd = 0;
	totalrev=0;
	totaltarget=0;
	totalopd=0;
	ctlowend = 0 ,cthighend=0,ctmidend=0;
	ctlowendcount = 0 ,cthighendcount=0,ctmidendcount=0;
    ctlowendtotal = 0 ,cthighendtotal=0,ctmidendtotal=0;
    ctlowendcounttotal = 0 ,cthighendcounttotal=0,ctmidendcounttotal=0;
    allcatmtd=0,allcatcount=0,allcatcounttotal=0,allcatmtdtotal=0;
	opdtarget=0,paidrevtarget=0,conschargestarget=0,catlenostarget=0,catmenostarget=0,cathenostarget=0,catlevaluestarget=0,catmevaluestarget=0,cathevaluestarget=0;
    opdtargettotal=0,paidrevtargettotal=0,conschargestargettotal=0,catlenostargettotal=0,catmenostargettotal=0,cathenostargettotal=0,catlevaluestargettotal=0,catmevaluestargettotal=0,cathevaluestargettotal=0;
	mtdpha=0,totalpha=0,mtdphacount=0,totalphacount=0,mtdphatarget=0,totalphatarget=0,mtdphacounttarget=0,totalphacounttarget=0;
	mtdopt=0,totalopt=0,mtdoptcount=0,totaloptcount=0,mtdopttarget=0,totalopttarget=0,mtdoptcounttarget=0,totaloptcounttarget=0

    mtdtreat=0,totaltreat=0,mtdtreatcount=0,totaltreatcount=0,mtdtreattarget=0,totaltreattarget=0,mtdtreatcounttarget=0,totaltreatcounttarget=0;

	mtdinv=0,totalinv=0,mtdinvcount=0,totalinvcount=0,mtdinvtarget=0,totalinvtarget=0,mtdinvcounttarget=0,totalinvcounttarget=0;

    mtdcor=0,totalcor=0,mtdcorcount=0,totalcorcount=0,mtdcortarget=0,totalcortarget=0,mtdcorcounttarget=0,totalcorcounttarget=0;

	mtdref=0,totalref=0,mtdrefcount=0,totalrefcount=0,mtdreftarget=0,totalreftarget=0,mtdrefcounttarget=0,totalrefcounttarget=0;

    mtdosu=0,totalosu=0,mtdosucount=0,totalosucount=0,mtdosutarget=0,totalosutarget=0,mtdosucounttarget=0,totalosucounttarget=0;

    mtdconlens=0,totalconlens=0,mtdconlenscount=0,totalconlenscount=0,mtdconlenstarget=0,totalconlenstarget=0,mtdconlenscounttarget=0,totalconlenscounttarget=0;

    mtdvrin=0,totalvrin=0,mtdvrincount=0,totalvrincount=0,mtdvrintarget=0,totalvrintarget=0,mtdvrincounttarget=0,totalvrincounttarget=0;

	 mtdtconsu=0,totaltconsu=0,mtdtconsucount=0,totaltconsucount=0,mtdtconsutarget=0,totaltconsutarget=0,mtdtconsucounttarget=0,totaltconsucounttarget=0;
	 mtdpopd=0,totalpopd=0,mtdpopdcount=0,totalpopdcount=0,mtdpopdtarget=0,totalpopdtarget=0,mtdpopdcounttarget=0,totalpopdcounttarget=0;

	 mtdvrsug=0,totalvrsug=0,mtdvrsugcount=0,totalvrsugcount=0,mtdvrsugtarget=0,totalvrsugtarget=0,mtdvrsugcounttarget=0,totalvrsugcounttarget=0;

	 mtdoptypp=0,totaloptypp=0,mtdoptypptarget=0,totaloptypptarget=0;
	 mtdphaypp=0,totalphaypp=0,mtdphaypptarget=0,totalphaypptarget=0;
	 mtdopdypp=0,totalopdypp=0,mtdopdypptarget=0,totalopdypptarget=0;

	threeYearBeforevFinYearArr.forEach(year => {
			 threeYearBeforFinYearMonthSet[year].forEach(month => {
                 mtdrevtarget=0;
				 mtdrev = 0;
                 mtdopd = 0;
				 ctlowend = 0 ,cthighend=0,ctmidend=0;
				 ctlowendcount = 0 ,cthighendcount=0,ctmidendcount=0;
				 allcatmtd=0,allcatcount=0;
                 opdtarget=0,paidrevtarget=0,conschargestarget=0,catlenostarget=0,catmenostarget=0,cathenostarget=0,catlevaluestarget=0,catmevaluestarget=0,cathevaluestarget=0;

				  mtdopt=0,mtdoptcount=0,mtdopttarget=0,mtdoptcounttarget=0;
				  mtdpha=0,mtdphacount=0,mtdphatarget=0,mtdphacounttarget=0;
				  mtdtreat=0,mtdtreatcount=0,mtdtreattarget=0,mtdtreatcounttarget=0;
				  mtdinv=0,mtdinvcount=0,mtdinvtarget=0,mtdinvcounttarget=0;
				  mtdcor=0,mtdcorcount=0,mtdcortarget=0,mtdcorcounttarget=0;
				  mtdref=0,mtdrefcount=0,mtdreftarget=0,mtdrefcounttarget=0;
				  mtdosu=0,mtdosucount=0,mtdosutarget=0,mtdosucounttarget=0;
				  mtdconlens=0,mtdconlenscount=0,mtdconlenstarget=0,mtdconlenscounttarget=0;
				  mtdvrin=0,mtdvrincount=0,mtdvrintarget=0,mtdvrincounttarget=0;
				  mtdtconsu=0,mtdtconsucount=0,mtdtconsutarget=0,mtdtconsucounttarget=0;
				  mtdpopd=0,mtdpopdcount=0,mtdpopdtarget=0,mtdpopdcounttarget=0;
				  mtdvrsug=0,mtdvrsugcount=0,mtdvrsugtarget=0,mtdvrsugcounttarget=0;
				  mtdoptypp=0,mtdoptypptarget=0;
				  mtdphaypp=0,mtdphaypptarget=0;
				  mtdopdypp=0,mtdopdypptarget=0;

				 monthText = monthMapping[month];

                 _.filter(rev_det_res, {  'MONTH(trans_date)': month,'yr' : year}).forEach(
					element => {
						mtdrev+= element.mtd;
						//totalrev+= element.mtd;

				});

				totalrev+= parseFloat(mtdrev);
				//totaloptcount+= parseInt(mtdoptcount);


				_.filter(rev_target_res, {  'target_month': month,'target_year' : year}).forEach(
					element => {
						mtdrevtarget+= element.amount;
						//totaltarget+= element.amount;

				});
				totaltarget+= parseFloat(mtdrevtarget);
				//totaloptcount+= parseInt(mtdoptcount);

				_.filter(opd_det_res, {   'MONTH(trans_date)': month,'yr' : year}).forEach(
					element => {
						mtdopd+= element.mtd;
						//totalopd+= parseInt(element.mtd);


				});
				totalopd+= parseFloat(mtdopd);

				 mtdopdypp=parseInt((lakshFormatRevenue1(mtdrev)/mtdopd)*100000);
				 totalopdypp+=parseInt(mtdopdypp);






				_.filter(catlowarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {


						ctlowend+= element.net_amount;
						ctlowendcount+= element.ct;
						//ctlowendtotal+= parseFloat(element.net_amount);
						//ctlowendcounttotal+= parseInt(element.ct);

				});
				ctlowendtotal+= parseFloat(ctlowend);
				ctlowendcounttotal+= parseInt(ctlowendcount);


				_.filter(cathigharr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						cthighend+= element.net_amount;
						cthighendcount+= element.ct;
						//cthighendtotal+= parseFloat(element.net_amount);
						//cthighendcounttotal+= parseInt(element.ct);


				});
				cthighendtotal+= parseFloat(cthighend);
				cthighendcounttotal+= parseInt(cthighendcount);


				_.filter(catmidarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						ctmidend+= element.net_amount;
						ctmidendcount+= element.ct;
						//ctmidendtotal+= parseFloat(element.net_amount);
						//ctmidendcounttotal+= parseInt(element.ct);


				});
				ctmidendtotal+= parseFloat(ctmidend);
				ctmidendcounttotal+= parseInt(ctmidendcount);

				//allcatmtd=0,allcatcount=0,allcatcounttotal=0,allcatmtdtotal=0;

				_.filter(catarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						allcatmtd += element.net_amount;
						allcatcount+= element.ct;
				});

				_.filter(optarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdopt+= element.net_amount;
						mtdoptcount+= element.ct;



				});

				totalopt+= parseFloat(mtdopt);
				totaloptcount+= parseInt(mtdoptcount);

				mtdoptypp=parseInt((lakshFormatRevenue1(mtdopt)/mtdoptcount)*100000);
				totaloptypp+=parseInt(mtdoptypp);


				_.filter(phaarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdpha+= element.net_amount;
						mtdphacount+= element.ct;




				});
				totalpha+= parseFloat(mtdpha);
				totalphacount+= parseInt(mtdphacount);


				mtdphaypp=parseInt((lakshFormatRevenue1(mtdpha)/mtdphacount)*100000);
				totalphaypp+=parseInt(mtdphaypp);


				_.filter(treatarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdtreat+= element.net_amount;
						mtdtreatcount+= element.ct;




				});
				totaltreat+= parseFloat(mtdtreat);
				totaltreatcount+= parseInt(mtdtreatcount);


				_.filter(invarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdinv+= element.net_amount;
						mtdinvcount+= element.ct;




				});
				totalinv+= parseFloat(mtdinv);
				totalinvcount+= parseInt(mtdinvcount);


				_.filter(corarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdcor+= element.net_amount;
						mtdcorcount+= element.ct;




				});
				totalcor+= parseFloat(mtdcor);
				totalcorcount+= parseInt(mtdcorcount);


				_.filter(refarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdref+= element.net_amount;
						mtdrefcount+= element.ct;




				});
				totalref+= parseFloat(mtdref);
				totalrefcount+= parseInt(mtdrefcount);



				_.filter(osuarr1, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdosu+= element.net_amount;
						mtdosucount+= element.ct;




				});
				totalosu+= parseFloat(mtdosu);
				totalosucount+= parseInt(mtdosucount);


				_.filter(conlensarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdconlens+= element.net_amount;
						mtdconlenscount+= element.ct;




				});
				totalconlens+= parseFloat(mtdconlens);
				totalconlenscount+= parseInt(mtdconlenscount);


				_.filter(vrinarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdvrin+= element.net_amount;
						mtdvrincount+= element.ct;




				});
				totalvrin+= parseFloat(mtdvrin);
				totalvrincount+= parseInt(mtdvrincount);


				_.filter(tconsuarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdtconsu+= element.net_amount;
						mtdtconsucount+= element.ct;




				});
				totaltconsu+= parseFloat(mtdtconsu);
				totaltconsucount+= parseInt(mtdtconsucount);


				_.filter(popdarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdpopd+= element.ct;
						mtdpopdcount+= element.ct;




				});
				totalpopd+= parseFloat(mtdpopd);
				totalpopdcount+= parseInt(mtdpopdcount);


				_.filter(vrsugarr, {   'MONTH(transaction_date)': month,'yr' : year}).forEach(
					element => {
						mtdvrsug+= element.net_amount;
						mtdvrsugcount+= element.ct;




				});
				totalvrsug+= parseFloat(mtdvrsug);
				totalvrsugcount+= parseInt(mtdvrsugcount);


				_.filter(opr_terget_query_res, { 'target_month': month,'target_year' : year}).forEach(
					element => {



						opdtarget+= element.target_opd;


						conschargestarget+= element.target_conscharges;

						catlenostarget+= element.target_catlenos;
						catmenostarget+= element.target_catmenos;
						cathenostarget+= element.target_cathenos;
						catlevaluestarget+= element.target_catlevalues;
						catmevaluestarget+= element.target_catmevalues;
						cathevaluestarget+= element.target_cathevalues;

						mtdopttarget+= element.target_opticalordervalues;
						mtdoptcounttarget+= element.target_opticalordernos;
						mtdoptypptarget+=parseInt((mtdopttarget/mtdoptcounttarget)*100000);

						mtdphatarget+= element.target_pharmacyvalues;
						mtdphacounttarget+= element.target_pharmacynos;


						mtdtreattarget+= element.target_investtreatvalues;
						mtdtreatcounttarget+= element.target_investtreatnos;

						mtdcortarget+= element.target_corneavalues;
						mtdcorcounttarget+= element.target_corneanos;
						mtdreftarget+= element.target_refractivevalues;
						mtdrefcounttarget+= element.target_refractivenos;

						mtdosutarget+= element.target_othersurgeryvalues;
						mtdosucounttarget+= element.target_othersurgerynos;

						mtdconlenstarget+= element.target_contactlensvalues;
						mtdconlenscounttarget+= element.target_contactlensnos;
						mtdvrintarget+= element.target_vrinjvalues;
						mtdvrincounttarget+= element.target_vrinjnos;

						mtdtconsutarget+= element.target_conscharges;


						mtdpopdtarget+= element.target_paidreview;

						mtdvrsugtarget+= element.target_vrvalues;
						mtdvrsugcounttarget+= element.target_vrnos;




				});
						opdtargettotal+= parseInt(opdtarget);
						mtdopdypptarget=parseInt((mtdrevtarget/opdtarget)*100000);
						totalopdypptarget+=parseInt(mtdopdypptarget);

						conschargestargettotal+= parseInt(conschargestarget);
						catlenostargettotal+= parseInt(catlenostarget);
						catmenostargettotal+= parseInt(catmenostarget);
						cathenostargettotal+= parseInt(cathenostarget);
						catlevaluestargettotal+= parseFloat(catlevaluestarget);
						catmevaluestargettotal+= parseFloat(catmevaluestarget);
						cathevaluestargettotal+= parseFloat(cathevaluestarget);

						totalopttarget+= parseFloat(mtdopttarget);
						totaloptcounttarget+= parseInt(mtdoptcounttarget);
						mtdoptypptarget=parseInt((mtdopttarget/mtdoptcounttarget)*100000);
						totaloptypptarget+=parseInt(mtdoptypptarget);


						totalphatarget+= parseFloat(mtdphatarget);
						totalphacounttarget+= parseInt(mtdphacounttarget);
						mtdphaypptarget=parseInt((mtdphatarget/mtdphacounttarget)*100000);
						totalphaypptarget+=parseInt(mtdphaypptarget);

						totaltreattarget+= parseFloat(mtdtreattarget);
						totaltreatcounttarget+= parseInt(mtdtreatcounttarget);

						totalcortarget+= parseFloat(mtdcortarget);
						totalcorcounttarget+= parseInt(mtdcorcounttarget);
						totalreftarget+= parseFloat(mtdreftarget);
						totalrefcounttarget+= parseInt(mtdrefcounttarget);

						totalosutarget+= parseFloat(mtdosutarget);
						totalosucounttarget+= parseInt(mtdosucounttarget);

						totalconlenstarget+= parseFloat(mtdconlenstarget);
						totalconlenscounttarget+= parseInt(mtdconlenscounttarget);
						totalvrintarget+= parseFloat(mtdvrintarget);
						totalvrincounttarget+= parseInt(mtdvrincounttarget);
						totaltconsutarget+= parseFloat(mtdtconsutarget);
						totalpopdtarget+= parseInt(mtdpopdtarget);

						totalvrsugtarget+= parseFloat(mtdvrsugtarget);
						totalvrsugcounttarget+= parseInt(mtdvrsugcounttarget);

				 monthWiseObj.push({
					monthText : monthText,
					mtdrev: lakshFormatRevenue1(mtdrev),
					mtdrevtarget: mtdrevtarget.toFixed(1),

					mtdopd: mtdopd,
					mtdopdypp:mtdopdypp,

					mtdctlowend:lakshFormatRevenue1(ctlowend),
					mtdcthighend:lakshFormatRevenue1(cthighend),
					mtdctmidend:lakshFormatRevenue1(ctmidend),
					mtdctlowendcount:ctlowendcount,
					mtdcthighendcount:cthighendcount,
					mtdctmidendcount:ctmidendcount,
					mtdallcat:lakshFormatRevenue1(allcatmtd),
					mtdallcatcount:allcatcount,

					mtdopt:lakshFormatRevenue1(mtdopt),
					mtdoptcount:parseInt(mtdoptcount),
					mtdoptypp:mtdoptypp,
					mtdpha:lakshFormatRevenue1(mtdpha),
					mtdphacount:parseInt(mtdphacount),
					mtdphaypp:mtdphaypp,
					mtdtreatinv:(parseFloat(lakshFormatRevenue1(mtdtreat))+parseFloat(lakshFormatRevenue1(mtdinv))).toFixed(1),
					mtdtreatcountinv:parseInt(mtdtreatcount)+parseInt(mtdinvcount),

					mtdcor:lakshFormatRevenue1(mtdcor),
					mtdcorcount:mtdcorcount,
					mtdref:lakshFormatRevenue1(mtdref),
					mtdrefcount:mtdrefcount,

					mtdosu:lakshFormatRevenue1(mtdosu),
					mtdosucount:mtdosucount,
					mtdconlens: lakshFormatRevenue1(mtdconlens),
					mtdconlenscount: mtdconlenscount,
					mtdvrin:lakshFormatRevenue1(mtdvrin),
					mtdvrincount:mtdvrincount,

					mtdtconsu:lakshFormatRevenue1(mtdtconsu),
					mtdtconsucount:mtdtconsucount,
					mtdpopd:mtdpopd,
					mtdpopdcount:mtdpopdcount,
					mtdvrsug:lakshFormatRevenue1(mtdvrsug),
					mtdvrsugcount:mtdvrsugcount,

					mtdopdtarget: opdtarget,
					mtdopdypptarget:mtdopdypptarget,


				    mtdctlowendtarget:catlevaluestarget.toFixed(1),
					mtdcthighendtarget:cathevaluestarget.toFixed(1),
					mtdctmidendtarget:catmevaluestarget.toFixed(1),
					mtdctlowendcounttarget:catlenostarget,
					mtdcthighendcounttarget:cathenostarget,
					mtdctmidendcounttarget:catmenostarget,

					mtdallcattarget:(parseFloat(catlevaluestarget)+parseFloat(catmevaluestarget)+parseFloat(cathevaluestarget)).toFixed(1),
					mtdallcatcounttarget:parseInt(catlenostarget)+parseInt(catmenostarget)+parseInt(cathenostarget),

					mtdopttarget: mtdopttarget.toFixed(1),
					mtdoptcounttarget: mtdoptcounttarget,
					mtdoptypptarget:mtdoptypptarget,

					mtdphatarget: mtdphatarget.toFixed(1),
					mtdphacounttarget: mtdphacounttarget,
					mtdphaypptarget:mtdphaypptarget,




					mtdtreatinvtarget: mtdtreattarget.toFixed(1),
					mtdtreatinvcounttarget: mtdtreatcounttarget,

					mtdcortarget: mtdcortarget.toFixed(1),
					mtdcorcounttarget: mtdcorcounttarget,
					mtdreftarget: mtdreftarget.toFixed(1),
					mtdrefcounttarget: mtdrefcounttarget,

					mtdosutarget: mtdosutarget.toFixed(1),
					mtdosucounttarget: mtdosucounttarget,
					mtdconlenstarget: mtdconlenstarget.toFixed(1),
					mtdconlenscounttarget: mtdconlenscounttarget,
					mtdvrintarget: mtdvrintarget.toFixed(1),
					mtdvrincounttarget: mtdvrincounttarget,
					mtdtconsutarget: mtdtconsutarget.toFixed(1),
					mtdtconsucounttarget: mtdtconsucounttarget,
					mtdpopdtarget: mtdpopdtarget,
					mtdvrsugtarget: mtdvrsugtarget.toFixed(1),
					mtdvrsugcounttarget: mtdvrsugcounttarget

				});


			 });
	});


	branchObj['thirdyearmonth'] = monthWiseObj;
	branchObj['thirdyeartotal'] = {
					totalrev: lakshFormatRevenue1(totalrev),
					totaltarget: totaltarget.toFixed(1),

					totalopd: totalopd,
					totalopdypp: parseInt(totalopdypp),

					totalctlowend: lakshFormatRevenue1(ctlowendtotal),
					totalctmidend: lakshFormatRevenue1(ctmidendtotal),
					totalcthighend: lakshFormatRevenue1(cthighendtotal),
					totalctlowendcount: ctlowendcounttotal,
					totalctmidendcount: ctmidendcounttotal,
					totalcthighendcount: cthighendcounttotal,
					totalallcat: lakshFormatRevenue1(parseFloat(ctlowendtotal)+parseFloat(ctmidendtotal)+parseFloat(cthighendtotal)),
					totalallcatcount: parseInt(ctlowendcounttotal)+parseInt(ctmidendcounttotal)+parseInt(cthighendcounttotal),

					totalopt: lakshFormatRevenue1(totalopt),
					totaloptcount: totaloptcount,
					totaloptypp: parseInt(totaloptypp),

					totalpha: lakshFormatRevenue1(totalpha),
					totalphacount: totalphacount,
					totalphaypp: parseInt(totalphaypp),

					totaltreatinv: lakshFormatRevenue1(parseFloat(totaltreat)+parseFloat(totalinv)),
					totaltreatinvcount: parseInt(totaltreatcount)+parseInt(totalinvcount),

					totalcor: lakshFormatRevenue1(totalcor),
					totalcorcount: totalcorcount,
					totalref: lakshFormatRevenue1(totalref),
					totalrefcount: totalrefcount,
					totalosu: lakshFormatRevenue1(totalosu),
					totalosucount: totalosucount,

					totalconlens: lakshFormatRevenue1(totalconlens),
					totalconlenscount: totalconlenscount,
					totalvrin: lakshFormatRevenue1(totalvrin),
					totalvrincount: totalvrincount,
					totaltconsu: lakshFormatRevenue1(totaltconsu),
					totaltconsucount: totaltconsucount,
					totalpopd: totalpopd,
					totalpopdcount: totalpopdcount,
					totalvrsug: lakshFormatRevenue1(totalvrsug),
					totalvrsugcount: totalvrsugcount,

					totalopdtarget: opdtargettotal,
					totalopdypptarget:parseInt(totalopdypptarget),

				    totalctlowendtarget:catlevaluestargettotal.toFixed(1),
					totalcthighendtarget:cathevaluestargettotal.toFixed(1),
					totalctmidendtarget:catmevaluestargettotal.toFixed(1),
					totalctlowendcounttarget:catlenostargettotal,
					totalcthighendcounttarget:cathenostargettotal,
					totalctmidendcounttarget:catmenostargettotal,
					totalallcatcounttarget: parseInt(catlenostargettotal)+parseInt(catmenostargettotal)+parseInt(cathenostargettotal),
					totalallcattarget:(parseFloat(catlevaluestargettotal)+parseFloat(catmevaluestargettotal)+parseFloat(cathevaluestargettotal)).toFixed(1),

					totalopttarget:totalopttarget.toFixed(1),
					totaloptcounttarget:totaloptcounttarget,
					totaloptypptarget:parseInt(totaloptypptarget),

					totalphatarget:totalphatarget.toFixed(1),
					totalphacounttarget:totalphacounttarget,
					totalphaypptarget:parseInt(totalphaypptarget),


					totaltreatinvtarget:totaltreattarget.toFixed(1),
					totaltreatinvcounttarget:totaltreatcounttarget,

					totalcortarget:totalcortarget.toFixed(1),
					totalcorcounttarget:totalcorcounttarget,
					totalreftarget:totalreftarget.toFixed(1),
					totalrefcounttarget:totalrefcounttarget,

					totalosutarget:totalosutarget.toFixed(1),
					totalosucounttarget:totalosucounttarget,
					totalconlenstarget: totalconlenstarget.toFixed(1),
					totalconlenscounttarget: totalconlenscounttarget,
					totalvrintarget: totalvrintarget.toFixed(1),
					totalvrincounttarget: totalvrincounttarget,
					totaltconsutarget: totaltconsutarget.toFixed(1),
					totalpopdtarget: totalpopdtarget,
					totalvrsugtarget: totalvrsugtarget.toFixed(1),
					totalvrsugcounttarget: totalvrsugcounttarget


					};


	branchObj['totalper'] = { mtdrevper : (parseFloat((branchObj.currentyeartotal.totalrev/parseFloat(branchObj.lastyeartotal.totalrev)-1))*100).toFixed(1),
							mtdtargetper : (parseFloat((branchObj.currentyeartotal.totaltarget/parseFloat(branchObj.lastyeartotal.totaltarget)-1))*100).toFixed(1),


							mtdopdper : (parseFloat((branchObj.currentyeartotal.totalopd/parseFloat(branchObj.lastyeartotal.totalopd)-1))*100).toFixed(1),
							opdyppper : (parseFloat((branchObj.currentyeartotal.totalopdypp/parseFloat(branchObj.lastyeartotal.totalopdypp)-1))*100).toFixed(1),

							ctlowendper : (parseFloat((branchObj.currentyeartotal.totalctlowend/parseFloat(branchObj.lastyeartotal.totalctlowend)-1))*100).toFixed(1),
							cthighendper : (parseFloat((branchObj.currentyeartotal.totalcthighend/parseFloat(branchObj.lastyeartotal.totalcthighend)-1))*100).toFixed(1),
							ctmidendper : (parseFloat((branchObj.currentyeartotal.totalctmidend/parseFloat(branchObj.lastyeartotal.totalctmidend)-1))*100).toFixed(1),
							ctlowendcountper : (parseFloat((branchObj.currentyeartotal.totalctlowendcount/parseFloat(branchObj.lastyeartotal.totalctlowendcount)-1))*100).toFixed(1),
							cthighendcountper : (parseFloat((branchObj.currentyeartotal.totalcthighendcount/parseFloat(branchObj.lastyeartotal.totalcthighendcount)-1))*100).toFixed(1),
							ctmidendcountper:(parseFloat((branchObj.currentyeartotal.totalctmidendcount/parseFloat(branchObj.lastyeartotal.totalctmidendcount)-1))*100).toFixed(1),


							ctallper : (parseFloat((branchObj.currentyeartotal.totalallcat/parseFloat(branchObj.lastyeartotal.totalallcat)-1))*100).toFixed(1),
							ctallcountper:(parseFloat((branchObj.currentyeartotal.totalallcatcount/parseFloat(branchObj.lastyeartotal.totalallcatcount)-1))*100).toFixed(1),

							optper : (parseFloat((branchObj.currentyeartotal.totalopt/parseFloat(branchObj.lastyeartotal.totalopt)-1))*100).toFixed(1),
							optcountper:(parseFloat((branchObj.currentyeartotal.totaloptcount/parseFloat(branchObj.lastyeartotal.totaloptcount)-1))*100).toFixed(1),
							optyppper : (parseFloat((branchObj.currentyeartotal.totalyppopt/parseFloat(branchObj.lastyeartotal.totalyppopt)-1))*100).toFixed(1),



							phaper : (parseFloat((branchObj.currentyeartotal.totalpha/parseFloat(branchObj.lastyeartotal.totalpha)-1))*100).toFixed(1),
							phacountper:(parseFloat((branchObj.currentyeartotal.totalphacount/parseFloat(branchObj.lastyeartotal.totalphacount)-1))*100).toFixed(1),
							phayppper : (parseFloat((branchObj.currentyeartotal.totalypppha/parseFloat(branchObj.lastyeartotal.totalypppha)-1))*100).toFixed(1),

							treatinvper : (parseFloat((branchObj.currentyeartotal.totaltreatinv/parseFloat(branchObj.lastyeartotal.totaltreatinv)-1))*100).toFixed(1),
							treatinvcountper:(parseFloat((branchObj.currentyeartotal.totaltreatinvcount/parseFloat(branchObj.lastyeartotal.totaltreatinvcount)-1))*100).toFixed(1),


							corper : (parseFloat((branchObj.currentyeartotal.totalcor/parseFloat(branchObj.lastyeartotal.totalcor)-1))*100).toFixed(1),
							corcountper:(parseFloat((branchObj.currentyeartotal.totalcorcount/parseFloat(branchObj.lastyeartotal.totalcorcount)-1))*100).toFixed(1),
							refper : (parseFloat((branchObj.currentyeartotal.totalref/parseFloat(branchObj.lastyeartotal.totalref)-1))*100).toFixed(1),
							refcountper:(parseFloat((branchObj.currentyeartotal.totalrefcount/parseFloat(branchObj.lastyeartotal.totalrefcount)-1))*100).toFixed(1),

							osuper : (parseFloat((branchObj.currentyeartotal.totalosu/parseFloat(branchObj.lastyeartotal.totalosu)-1))*100).toFixed(1),
							osucountper:(parseFloat((branchObj.currentyeartotal.totalosucount/parseFloat(branchObj.lastyeartotal.totalosucount)-1))*100).toFixed(1),

							conlensper : (parseFloat((branchObj.currentyeartotal.totalconlens/parseFloat(branchObj.lastyeartotal.totalconlens)-1))*100).toFixed(1),
							conlenscountper:(parseFloat((branchObj.currentyeartotal.totalconlenscount/parseFloat(branchObj.lastyeartotal.totalconlenscount)-1))*100).toFixed(1),

							vrinper : (parseFloat((branchObj.currentyeartotal.totalvrin/parseFloat(branchObj.lastyeartotal.totalvrin)-1))*100).toFixed(1),
							vrincountper:(parseFloat((branchObj.currentyeartotal.totalvrincount/parseFloat(branchObj.lastyeartotal.totalvrincount)-1))*100).toFixed(1),

							tconsuper : (parseFloat((branchObj.currentyeartotal.totaltconsu/parseFloat(branchObj.lastyeartotal.totaltconsu)-1))*100).toFixed(1),

							popdper : (parseFloat((branchObj.currentyeartotal.totalpopd/parseFloat(branchObj.lastyeartotal.totalpopd)-1))*100).toFixed(1),

							vrsugper : (parseFloat((branchObj.currentyeartotal.totalvrsug/parseFloat(branchObj.lastyeartotal.totalvrsug)-1))*100).toFixed(1),
							vrsugcountper:(parseFloat((branchObj.currentyeartotal.totalvrsugcount/parseFloat(branchObj.lastyeartotal.totalvrsugcount)-1))*100).toFixed(1)





							}



	monthWiseObj =[];
	let lastyearRevPer = 0,lastyearRevTargetPer = 0,lastyearRevVal = 0,lastyearRevTargetVal = 0;


	//console.log(branchObj.lastyearmonth[0].monthText);

	var k=0;
	branchObj.lastyearmonth.forEach(key => {

		//console.log(branchObj.lastyearmonth[k].monthText);
		monthWiseObj.push({
					monthText : key.monthText,
					mtdrevper : (parseFloat((branchObj.currentyearmonth[k].mtdrev/parseFloat(key.mtdrev)-1))*100).toFixed(1),
					mtdtargetper : (parseFloat((branchObj.currentyearmonth[k].mtdrevtarget/parseFloat(key.mtdrevtarget)-1))*100).toFixed(1),


					mtdopdper : (parseFloat((branchObj.currentyearmonth[k].mtdopd/parseFloat(key.mtdopd)-1))*100).toFixed(1),
					mtdopdyppper:(parseFloat((branchObj.currentyearmonth[k].mtdopdypp/parseFloat(key.mtdopdypp)-1))*100).toFixed(1),

					mtdctlowendper : (parseFloat((branchObj.currentyearmonth[k].mtdctlowend/parseFloat(key.mtdctlowend)-1))*100).toFixed(1),
					mtdcthighendper : (parseFloat((branchObj.currentyearmonth[k].mtdcthighend/parseFloat(key.mtdcthighend)-1))*100).toFixed(1),
					mtdctmidendper : (parseFloat((branchObj.currentyearmonth[k].mtdctmidend/parseFloat(key.mtdctmidend)-1))*100).toFixed(1),
					mtdctlowendcountper : (parseFloat((branchObj.currentyearmonth[k].mtdctlowendcount/parseFloat(key.mtdctlowendcount)-1))*100).toFixed(1),
					mtdcthighendcountper : (parseFloat((branchObj.currentyearmonth[k].mtdcthighendcount/parseFloat(key.mtdcthighendcount)-1))*100).toFixed(1),
					mtdctmidendcountper : (parseFloat((branchObj.currentyearmonth[k].mtdctmidendcount/parseFloat(key.mtdctmidendcount)-1))*100).toFixed(1),
					mtdallcatper:(parseFloat((branchObj.currentyearmonth[k].mtdallcat/parseFloat(key.mtdallcat)-1))*100).toFixed(1),
					mtdallcatcountper:(parseFloat((branchObj.currentyearmonth[k].mtdallcatcount/parseFloat(key.mtdallcatcount)-1))*100).toFixed(1),

					mtdoptper:(parseFloat((branchObj.currentyearmonth[k].mtdopt/parseFloat(key.mtdopt)-1))*100).toFixed(1),
					mtdoptcountper:(parseFloat((branchObj.currentyearmonth[k].mtdoptcount/parseFloat(key.mtdoptcount)-1))*100).toFixed(1),
					mtdoptyppper:(parseFloat((branchObj.currentyearmonth[k].mtdoptypp/parseFloat(key.mtdoptypp)-1))*100).toFixed(1),


					mtdphaper:(parseFloat((branchObj.currentyearmonth[k].mtdpha/parseFloat(key.mtdpha)-1))*100).toFixed(2),
					mtdphacountper:(parseFloat((branchObj.currentyearmonth[k].mtdphacount/parseFloat(key.mtdphacount)-1))*100).toFixed(1),
					mtdphayppper:(parseFloat((branchObj.currentyearmonth[k].mtdphaypp/parseFloat(key.mtdphaypp)-1))*100).toFixed(2),

					mtdtreatinvper:(parseFloat((branchObj.currentyearmonth[k].mtdtreatinv/parseFloat(key.mtdtreatinv)-1))*100).toFixed(1),
					mtdtreatinvcountper:(parseFloat((branchObj.currentyearmonth[k].mtdtreatinvcount/parseFloat(key.mtdtreatinvcount)-1))*100).toFixed(1),

					mtdcorper:(parseFloat((branchObj.currentyearmonth[k].mtdcor/parseFloat(key.mtdcor)-1))*100).toFixed(1),
					mtdcorcountper:(parseFloat((branchObj.currentyearmonth[k].mtdcorcount/parseFloat(key.mtdcorcount)-1))*100).toFixed(1),
					mtdrefper:(parseFloat((branchObj.currentyearmonth[k].mtdref/parseFloat(key.mtdref)-1))*100).toFixed(1),
					mtdrefcountper:(parseFloat((branchObj.currentyearmonth[k].mtdrefcount/parseFloat(key.mtdrefcount)-1))*100).toFixed(1),

					mtdosuper:(parseFloat((branchObj.currentyearmonth[k].mtdosu/parseFloat(key.mtdosu)-1))*100).toFixed(1),
					mtdosucountper:(parseFloat((branchObj.currentyearmonth[k].mtdosucount/parseFloat(key.mtdosucount)-1))*100).toFixed(1),

					mtdconlensper:(parseFloat((branchObj.currentyearmonth[k].mtdconlens/parseFloat(key.mtdconlens)-1))*100).toFixed(1),
					mtdconlenscountper:(parseFloat((branchObj.currentyearmonth[k].mtdconlenscount/parseFloat(key.mtdconlenscount)-1))*100).toFixed(1),

					mtdvrinper:(parseFloat((branchObj.currentyearmonth[k].mtdvrin/parseFloat(key.mtdvrin)-1))*100).toFixed(1),
					mtdvrincountper:(parseFloat((branchObj.currentyearmonth[k].mtdvrincount/parseFloat(key.mtdvrincount)-1))*100).toFixed(1),

					mtdtconsuper:(parseFloat((branchObj.currentyearmonth[k].mtdtconsu/parseFloat(key.mtdtconsu)-1))*100).toFixed(1),
					mtdpopdper:(parseFloat((branchObj.currentyearmonth[k].mtdpopd/parseFloat(key.mtdpopd)-1))*100).toFixed(1),

					mtdvrsugper:(parseFloat((branchObj.currentyearmonth[k].mtdvrsug/parseFloat(key.mtdvrsug)-1))*100).toFixed(1),
					mtdvrsugcountper:(parseFloat((branchObj.currentyearmonth[k].mtdvrsugcount/parseFloat(key.mtdvrsugcount)-1))*100).toFixed(1)


		});

		k++;

	});



	branchObj['monthper'] = monthWiseObj;


	return branchObj;


};

let reveCalQWise = async ( reveCalMonthRes) => {

	let QArr= ['Q1','Q2','Q3','Q4'];

	let QGroup  = {
		'Q1' :['Apr','May','Jun'],
		'Q2' : ['Jul','Aug','Sep'],
		'Q3' : ['Oct','Nov','Dec'],
		'Q4' : ['Jan','Feb','Mar']
	};
	let QObj = {};
	let Qrev = 0;
	let Qopd = 0;
	let Qrevtar = 0,Qctlowend=0,Qctlowendcount=0,Qcthighend=0,Qcthighendcount=0,Qctmidend=0,Qctmidendcount=0,Qctall=0,Qctallcount=0;
	let QRevenueObj = {};

	let Qopdtarget=0,Qpaidrevtarget=0,Qconschargestarget=0,Qcatlenostarget=0,Qcatmenostarget=0,Qcathenostarget=0,Qcatlevaluestarget=0,Qcatmevaluestarget=0,Qcathevaluestarget=0,Qallcattarget=0,Qallcatcounttarget=0;

	let Qopt=0,Qoptcount=0,Qopttarget=0,Qoptcounttarget=0;
	let Qpha=0,Qphacount=0,Qphatarget=0,Qphacounttarget=0;
	let Qtreatinv=0,Qtreatinvcount=0,Qtreatinvtarget=0,Qtreatinvcounttarget=0;
	let Qcor=0,Qcorcount=0,Qcortarget=0,Qcorcounttarget=0;
	let Qref=0,Qrefcount=0,Qreftarget=0,Qrefcounttarget=0;
	let Qosu=0,Qosucount=0,Qosutarget=0,Qosucounttarget=0;
	let Qconlens=0,Qconlenscount=0,Qconlenstarget=0,Qconlenscounttarget=0;
	let Qvrin=0,Qvrincount=0,Qvrintarget=0,Qvrincounttarget=0;
	let Qtconsu=0,Qtconsucount=0,Qtconsutarget=0,Qtconsucounttarget=0;
	let Qpopd=0,Qpopdcount=0,Qpopdtarget=0,Qpopdcounttarget=0;
	let Qvrsug=0,Qvrsugcount=0,Qvrsugtarget=0,Qvrsugcounttarget=0;

	let Qoptypp=0,Qoptypptarget=0;
	let Qphaypp=0,Qphaypptarget=0;
	let Qopdypp=0,Qopdypptarget=0;
	QArr.forEach(Q => {
        Qrev=0;	Qrevtar=0,Qopd=0,Qctlowend=0,Qctlowendcount=0,Qcthighend=0,Qcthighendcount=0,Qctmidend=0,Qctmidendcount=0,Qctall=0,Qctallcount=0;
		Qopdtarget=0,Qpaidrevtarget=0,Qconschargestarget=0,Qcatlenostarget=0,Qcatmenostarget=0,Qcathenostarget=0,Qcatlevaluestarget=0,Qcatmevaluestarget=0,Qcathevaluestarget=0,Qallcattarget=0,Qallcatcounttarget=0;
        Qopt=0,Qoptcount=0,Qopttarget=0,Qoptcounttarget=0;
		Qpha=0,Qphacount=0,Qphatarget=0,Qphacounttarget=0;
		Qtreatinv=0,Qtreatinvcount=0,Qtreatinvtarget=0,Qtreatinvcounttarget=0;
		Qcor=0,Qcorcount=0,Qcortarget=0,Qcorcounttarget=0;
        Qref=0,Qrefcount=0,Qreftarget=0,Qrefcounttarget=0;
		Qosu=0,Qosucount=0,Qosutarget=0,Qosucounttarget=0;
		Qconlens=0,Qconlenscount=0,Qconlenstarget=0,Qconlenscounttarget=0;
		Qvrin=0,Qvrincount=0,Qvrintarget=0,Qvrincounttarget=0;
		Qtconsu=0,Qtconsucount=0,Qtconsutarget=0,Qtconsucounttarget=0;
		Qpopd=0,Qpopdcount=0,Qpopdtarget=0,Qpopdcounttarget=0;
		Qvrsug=0,Qvrsugcount=0,Qvrsugtarget=0,Qvrsugcounttarget=0;
	    Qoptypp=0,Qoptypptarget=0;
		Qphaypp=0,Qphaypptarget=0;
		Qopdypp=0,Qopdypptarget=0;
		QRevenueObj[Q] = [];
		QGroup[Q].forEach(month => {
			_.filter(reveCalMonthRes.lastyearmonth, {  'monthText': month}).forEach(
						element => {
							Qrev+=parseFloat(element.mtdrev);
							Qrevtar+=parseFloat(element.mtdrevtarget);
							Qopd+=parseFloat(element.mtdopd);
							Qopdypp+=parseInt(element.mtdopdypp);
							Qctlowend+=parseFloat(element.mtdctlowend);
						    Qctlowendcount+=parseFloat(element.mtdctlowendcount);
							Qcthighend+=parseFloat(element.mtdcthighend);
						    Qcthighendcount+=parseFloat(element.mtdcthighendcount);
							Qctmidend+=parseFloat(element.mtdctmidend);
						    Qctmidendcount+=parseFloat(element.mtdctmidendcount);
							Qctall+=parseFloat(element.mtdallcat);
						    Qctallcount+=parseFloat(element.mtdallcatcount);
							Qopt+=parseFloat(element.mtdopt);
						    Qoptcount+=parseFloat(element.mtdoptcount);
							Qoptypp+=parseInt(element.mtdoptypp);
							Qpha+=parseFloat(element.mtdpha);
						    Qphacount+=parseFloat(element.mtdphacount);
							Qphaypp+=parseInt(element.mtdphaypp);

							Qtreatinv+=parseFloat(element.mtdtreatinv);
						    Qtreatinvcount+=parseFloat(element.mtdtreatinvcount);

							Qcor+=parseFloat(element.mtdcor);
						    Qcorcount+=parseFloat(element.mtdcorcount);
							Qref+=parseFloat(element.mtdref);
						    Qrefcount+=parseFloat(element.mtdrefcount);

							Qosu+=parseFloat(element.mtdosu);
						    Qosucount+=parseFloat(element.mtdosucount);
							Qconlens+=parseFloat(element.mtdconlens);
						    Qconlenscount+=parseFloat(element.mtdconlenscount);
							Qvrin+=parseFloat(element.mtdvrin);
						    Qvrincount+=parseFloat(element.mtdvrincount);
							Qtconsu+=parseFloat(element.mtdtconsu);
						    Qtconsucount+=parseFloat(element.mtdtconsucount);
							Qpopd+=element.mtdpopd;
						    Qpopdcount+=parseFloat(element.mtdpopdcount);
							Qvrsug+=parseFloat(element.mtdvrsug);
						    Qvrsugcount+=parseFloat(element.mtdvrsugcount);

							Qopdtarget+=parseFloat(element.mtdopdtarget);
							Qopdypptarget+=parseInt(element.mtdopdypptarget);
							Qcatlenostarget+=parseFloat(element.mtdctlowendcounttarget);
						    Qcatmenostarget+=parseFloat(element.mtdctmidendcounttarget);
							Qcathenostarget+=parseFloat(element.mtdcthighendcounttarget);
						    Qcatlevaluestarget+=parseFloat(element.mtdctlowendtarget);
							Qcatmevaluestarget+=parseFloat(element.mtdctmidendtarget);
						    Qcathevaluestarget+=parseFloat(element.mtdcthighendtarget);

							Qallcattarget+=parseFloat(element.mtdallcattarget);
							Qallcatcounttarget+=parseFloat(element.mtdallcatcounttarget);

							Qopttarget+=parseFloat(element.mtdopttarget);
							Qoptcounttarget+=parseFloat(element.mtdoptcounttarget);
							Qoptypptarget+=parseInt(element.mtdoptypptarget);
							Qphatarget+=parseFloat(element.mtdphatarget);
							Qphacounttarget+=parseFloat(element.mtdphacounttarget);
							Qphaypptarget+=parseInt(element.mtdphaypptarget);

							Qtreatinvtarget+=parseFloat(element.mtdtreatinvtarget);
							Qtreatinvcounttarget+=parseFloat(element.mtdtreatinvcounttarget);

							Qcortarget+=parseFloat(element.mtdcortarget);
							Qcorcounttarget+=parseFloat(element.mtdcorcounttarget);
							Qreftarget+=parseFloat(element.mtdreftarget);
							Qrefcounttarget+=parseFloat(element.mtdrefcounttarget);

							Qosutarget+=parseFloat(element.mtdosutarget);
							Qosucounttarget+=parseFloat(element.mtdosucounttarget);

							Qconlenstarget+=parseFloat(element.mtdconlenstarget);
						    Qconlenscounttarget+=parseFloat(element.mtdconlenscounttarget);

							Qvrintarget+=parseFloat(element.mtdvrintarget);
						    Qvrincounttarget+=parseFloat(element.mtdvrincounttarget);

							Qtconsutarget+=parseFloat(element.mtdtconsutarget);
						    Qpopdtarget+=element.mtdpopdtarget;
							Qvrsugtarget+=parseFloat(element.mtdvrsugtarget);
						    Qvrsugcounttarget+=parseFloat(element.mtdvrsugcounttarget);






			});




		});
		QRevenueObj[Q].push({
					mtdrev : Qrev.toFixed(1),
					mtdrevtarget: Qrevtar.toFixed(1),
					mtdopd : Qopd,
					mtdopdypp : Qopdypp,
					mtdctlowend : Qctlowend.toFixed(1),
					mtdctlowendcount : Qctlowendcount,
					mtdcthighend : Qcthighend.toFixed(1),
					mtdcthighendcount : Qcthighendcount,
					mtdctmidend : Qctmidend.toFixed(1),
					mtdctmidendcount : Qctmidendcount,
					mtdallcat : Qctall.toFixed(1),
					mtdallcatcount : Qctallcount,
					mtdopt : Qopt.toFixed(1),
					mtdoptcount : Qoptcount,
					mtdoptypp : parseFloat((Qopt/Qoptcount)*100000).toFixed(1),
					mtdpha : Qpha.toFixed(1),
					mtdphacount : Qphacount,
					mtdphaypp : parseFloat((Qpha/Qphacount)*100000).toFixed(1),
					mtdtreatinv : Qtreatinv.toFixed(1),
					mtdtreatinvcount : Qtreatinvcount,

					mtdcor : Qcor.toFixed(1),
					mtdcorcount : Qcorcount,
					mtdref : Qref.toFixed(1),
					mtdrefcount : Qrefcount,

					mtdosu : Qosu.toFixed(1),
					mtdosucount : Qosucount,
					mtdconlens : Qconlens.toFixed(1),
					mtdconlenscount : Qconlenscount,
					mtdvrin : Qvrin.toFixed(1),
					mtdvrincount : Qvrincount,
					mtdtconsu : Qtconsu.toFixed(1),
					mtdtconsucount : Qtconsucount,
					mtdpopd : Qpopd,
					mtdpopdcount : Qpopdcount,
					mtdvrsug : Qvrsug.toFixed(1),
					mtdvrsugcount : Qvrsugcount,

					mtdopdtarget: Qopdtarget,
					mtdopdypptarget:parseFloat((Qrevtar/Qopdtarget)*100000).toFixed(1),


				    mtdctlowendtarget:Qcatlevaluestarget.toFixed(1),
					mtdcthighendtarget:Qcathevaluestarget.toFixed(1),
					mtdctmidendtarget:Qcatmevaluestarget.toFixed(1),
					mtdctlowendcounttarget:Qcatlenostarget,
					mtdcthighendcounttarget:Qcathenostarget,
					mtdctmidendcounttarget:Qcatmenostarget,

					mtdallcattarget:Qallcattarget.toFixed(1),
					mtdallcatcounttarget:Qallcatcounttarget,

					mtdopttarget:Qopttarget.toFixed(1),
					mtdoptcounttarget:Qoptcounttarget,
					mtdoptypptarget:parseFloat((Qopttarget/Qoptcounttarget)*100000).toFixed(1),
					mtdphatarget:Qphatarget.toFixed(1),
					mtdphacounttarget:Qphacounttarget,
					mtdphaypptarget:parseFloat((Qphatarget/Qphacounttarget)*100000).toFixed(1),
					mtdtreatinvtarget:Qtreatinvtarget.toFixed(1),
					mtdtreatinvcounttarget:Qtreatinvcounttarget,

					mtdcortarget:Qcortarget.toFixed(1),
					mtdcorcounttarget:Qcorcounttarget,
					mtdreftarget:Qreftarget.toFixed(1),
					mtdrefcounttarget:Qrefcounttarget,

					mtdosutarget:Qosutarget.toFixed(1),
					mtdosucounttarget:Qosucounttarget,
					mtdconlenstarget : Qconlenstarget.toFixed(1),
					mtdconlenscounttarget : Qconlenscounttarget,
					mtdvrintarget : Qvrintarget.toFixed(1),
					mtdvrincounttarget : Qvrincounttarget,

					mtdtconsutarget : Qtconsutarget.toFixed(1),
					mtdpopdtarget : Qpopdtarget,
					mtdvrsugtarget : Qvrsugtarget.toFixed(1),
					mtdvrsugcounttarget : Qvrsugcounttarget

			});



	});
	QObj['lastyearQ'] = QRevenueObj;


	Qrev = 0;
	Qrevtar = 0;
	Qopd=0;
	Qctlowend=0;
	Qctlowendcount=0,Qcthighend=0,Qcthighendcount=0,Qctmidend=0,Qctmidendcount=0,Qctall=0,Qctallcount=0;
	Qopdtarget=0,Qpaidrevtarget=0,Qconschargestarget=0,Qcatlenostarget=0,Qcatmenostarget=0,Qcathenostarget=0,Qcatlevaluestarget=0,Qcatmevaluestarget=0,Qcathevaluestarget=0,Qallcattarget=0,Qallcatcounttarget=0;
	Qopt=0,Qoptcount=0,Qopttarget=0,Qoptcounttarget=0;
	Qpha=0,Qphacount=0,Qphatarget=0,Qphacounttarget=0;
	Qtreatinv=0,Qtreatinvcount=0,Qtreatinvtarget=0,Qtreatinvcounttarget=0;
	Qosu=0,Qosucount=0,Qosutarget=0,Qosucounttarget=0;
	Qconlens=0,Qconlenscount=0,Qconlenstarget=0,Qconlenscounttarget=0;
	Qvrin=0,Qvrincount=0,Qvrintarget=0,Qvrincounttarget=0;
	Qtconsu=0,Qtconsucount=0,Qtconsutarget=0,Qtconsucounttarget=0;
	Qpopd=0,Qpopdcount=0,Qpopdtarget=0,Qpopdcounttarget=0;
	Qvrsug=0,Qvrsugcount=0,Qvrsugtarget=0,Qvrsugcounttarget=0;
	Qoptypp=0,Qoptypptarget=0;
	Qphaypp=0,Qphaypptarget=0;
	Qopdypp=0,Qopdypptarget=0;
	QRevenueObj1 = {};
	QArr.forEach(Q => {
        Qrev=0;	Qrevtar=0,Qopd=0,Qctlowend=0,Qctlowendcount=0,Qcthighend=0,Qcthighendcount=0,Qctmidend=0,Qctmidendcount=0,Qctall=0,Qctallcount=0;

		Qopdtarget=0,Qpaidrevtarget=0,Qconschargestarget=0,Qcatlenostarget=0,Qcatmenostarget=0,Qcathenostarget=0,Qcatlevaluestarget=0,Qcatmevaluestarget=0,Qcathevaluestarget=0,Qallcattarget=0,Qallcatcounttarget=0;


		 Qopt=0,Qoptcount=0,Qopttarget=0,Qoptcounttarget=0;
		 Qpha=0,Qphacount=0,Qphatarget=0,Qphacounttarget=0;
		 Qtreatinv=0,Qtreatinvcount=0,Qtreatinvtarget=0,Qtreatinvcounttarget=0;
		 Qcor=0,Qcorcount=0,Qcortarget=0,Qcorcounttarget=0;
        Qref=0,Qrefcount=0,Qreftarget=0,Qrefcounttarget=0;
		Qosu=0,Qosucount=0,Qosutarget=0,Qosucounttarget=0;
		Qconlens=0,Qconlenscount=0,Qconlenstarget=0,Qconlenscounttarget=0;
		Qvrin=0,Qvrincount=0,Qvrintarget=0,Qvrincounttarget=0;
		Qtconsu=0,Qtconsucount=0,Qtconsutarget=0,Qtconsucounttarget=0;
		Qpopd=0,Qpopdcount=0,Qpopdtarget=0,Qpopdcounttarget=0;
		Qvrsug=0,Qvrsugcount=0,Qvrsugtarget=0,Qvrsugcounttarget=0;
		Qoptypp=0,Qoptypptarget=0;
		Qphaypp=0,Qphaypptarget=0;
		Qopdypp=0,Qopdypptarget=0;
        QRevenueObj1[Q] = [];
		QGroup[Q].forEach(month => {
			_.filter(reveCalMonthRes.currentyearmonth, {  'monthText': month}).forEach(
						element => {

							//console.log(element.monthText);
							//console.log(element.mtdrev);
							Qrev+=parseFloat(element.mtdrev);
							Qrevtar+=parseFloat(element.mtdrevtarget);
							Qopd+=parseFloat(element.mtdopd);
							Qopdypp+=parseInt(element.mtdopdypp);
							Qctlowend+=parseFloat(element.mtdctlowend);
						    Qctlowendcount+=parseFloat(element.mtdctlowendcount);
							Qcthighend+=parseFloat(element.mtdcthighend);
						    Qcthighendcount+=parseFloat(element.mtdcthighendcount);
							Qctmidend+=parseFloat(element.mtdctmidend);
						    Qctmidendcount+=parseFloat(element.mtdctmidendcount);
							Qctall+=parseFloat(element.mtdallcat);
						    Qctallcount+=parseFloat(element.mtdallcatcount);
							Qopt+=parseFloat(element.mtdopt);
						    Qoptcount+=parseFloat(element.mtdoptcount);
							Qoptypp+=parseInt(element.mtdoptypp);
							Qpha+=parseFloat(element.mtdpha);
						    Qphacount+=parseFloat(element.mtdphacount);
							Qphaypp+=parseInt(element.mtdphaypp);
							Qtreatinv+=parseFloat(element.mtdtreatinv);
						    Qtreatinvcount+=parseFloat(element.mtdtreatinvcount);

							Qcor+=parseFloat(element.mtdcor);
						    Qcorcount+=parseFloat(element.mtdcorcount);
							Qref+=parseFloat(element.mtdref);
						    Qrefcount+=parseFloat(element.mtdrefcount);

							Qosu+=parseFloat(element.mtdosu);
						    Qosucount+=parseFloat(element.mtdosucount);
							Qconlens+=parseFloat(element.mtdconlens);
						    Qconlenscount+=parseFloat(element.mtdconlenscount);
							Qvrin+=parseFloat(element.mtdvrin);
						    Qvrincount+=parseFloat(element.mtdvrincount);

							Qtconsu+=parseFloat(element.mtdtconsu);
						    Qtconsucount+=parseFloat(element.mtdtconsucount);

							Qpopd+=element.mtdpopd;
						    Qpopdcount+=parseFloat(element.mtdpopdcount);

							Qvrsug+=parseFloat(element.mtdvrsug);
						    Qvrsugcount+=parseFloat(element.mtdvrsugcount);

							Qopdtarget+=parseFloat(element.mtdopdtarget);
							Qopdypptarget+=parseInt(element.mtdopdypptarget);

							Qcatlenostarget+=parseFloat(element.mtdctlowendcounttarget);
						    Qcatmenostarget+=parseFloat(element.mtdctmidendcounttarget);
							Qcathenostarget+=parseFloat(element.mtdcthighendcounttarget);
						    Qcatlevaluestarget+=parseFloat(element.mtdctlowendtarget);
							Qcatmevaluestarget+=parseFloat(element.mtdctmidendtarget);
						    Qcathevaluestarget+=parseFloat(element.mtdcthighendtarget);

							Qallcattarget+=parseFloat(element.mtdallcattarget);
							Qallcatcounttarget+=parseFloat(element.mtdallcatcounttarget);
							Qopttarget+=parseFloat(element.mtdopttarget);
							Qoptcounttarget+=parseFloat(element.mtdoptcounttarget);
							Qoptypptarget+=parseInt(element.mtdoptypptarget);
							Qphatarget+=parseFloat(element.mtdphatarget);
							Qphacounttarget+=parseFloat(element.mtdphacounttarget);
							Qphaypptarget+=parseInt(element.mtdphaypptarget);
							Qtreatinvtarget+=parseFloat(element.mtdtreatinvtarget);
							Qtreatinvcounttarget+=parseFloat(element.mtdtreatinvcounttarget);

							Qcortarget+=parseFloat(element.mtdcortarget);
							Qcorcounttarget+=parseFloat(element.mtdcorcounttarget);
							Qreftarget+=parseFloat(element.mtdreftarget);
							Qrefcounttarget+=parseFloat(element.mtdrefcounttarget);

							Qosutarget+=parseFloat(element.mtdosutarget);
							Qosucounttarget+=parseFloat(element.mtdosucounttarget);

							Qconlenstarget+=parseFloat(element.mtdconlenstarget);
						    Qconlenscounttarget+=parseFloat(element.mtdconlenscounttarget);

							Qvrintarget+=parseFloat(element.mtdvrintarget);
						    Qvrincounttarget+=parseFloat(element.mtdvrincounttarget);
							Qtconsutarget+=parseFloat(element.mtdtconsutarget);
						    Qpopdtarget+=element.mtdpopdtarget;
							Qvrsugtarget+=parseFloat(element.mtdvrsugtarget);
						    Qvrsugcounttarget+=parseFloat(element.mtdvrsugcounttarget);
			});


		});
		QRevenueObj1[Q].push({
					mtdrev : Qrev.toFixed(1),
					mtdrevtarget: Qrevtar.toFixed(1),
					mtdopd : Qopd,
					mtdopdypp : parseFloat((Qrev/Qopd)*100000).toFixed(1),
					mtdctlowend : Qctlowend.toFixed(1),
					mtdctlowendcount : Qctlowendcount,
					mtdcthighend : Qcthighend.toFixed(1),
					mtdcthighendcount : Qcthighendcount,
					mtdctmidend : Qctmidend.toFixed(1),
					mtdctmidendcount : Qctmidendcount,
					mtdallcat : Qctall.toFixed(1),
					mtdallcatcount : Qctallcount,
					mtdopt : Qopt.toFixed(1),
					mtdoptcount : Qoptcount,
					mtdoptypp : parseFloat((Qopt/Qoptcount)*100000).toFixed(1),
					mtdpha : Qpha.toFixed(1),
					mtdphacount : Qphacount,
					mtdphaypp : parseFloat((Qpha/Qphacount)*100000).toFixed(1),
					mtdtreatinv : Qtreatinv.toFixed(1),
					mtdtreatinvcount : Qtreatinvcount,

					mtdcor : Qcor.toFixed(1),
					mtdcorcount : Qcorcount,
					mtdref : Qref.toFixed(1),
					mtdrefcount : Qrefcount,

					mtdosu : Qosu.toFixed(1),
					mtdosucount : Qosucount,
					mtdconlens : Qconlens.toFixed(1),
					mtdconlenscount : Qconlenscount,
					mtdvrin : Qvrin.toFixed(1),
					mtdvrincount : Qvrincount,
					mtdtconsu : Qtconsu.toFixed(1),
					mtdtconsucount : Qtconsucount,
					mtdpopd : Qpopd,
					mtdpopdcount : Qpopdcount,
					mtdvrsug : Qvrsug.toFixed(1),
					mtdvrsugcount : Qvrsugcount,


					mtdopdtarget: Qopdtarget,
					mtdopdypptarget:parseFloat((Qrevtar/Qopdtarget)*100000).toFixed(1),

				    mtdctlowendtarget:Qcatlevaluestarget.toFixed(1),
					mtdcthighendtarget:Qcathevaluestarget.toFixed(1),
					mtdctmidendtarget:Qcatmevaluestarget.toFixed(1),
					mtdctlowendcounttarget:Qcatlenostarget,
					mtdcthighendcounttarget:Qcathenostarget,
					mtdctmidendcounttarget:Qcatmenostarget,

					mtdallcattarget:Qallcattarget.toFixed(1),
					mtdallcatcounttarget:Qallcatcounttarget,

					mtdopttarget:Qopttarget.toFixed(1),
					mtdoptcounttarget:Qoptcounttarget,
					mtdoptypptarget:parseFloat((Qopttarget/Qoptcounttarget)*100000).toFixed(1),
					mtdphatarget:Qphatarget.toFixed(1),
					mtdphacounttarget:Qphacounttarget,
					mtdphaypptarget:parseFloat((Qphatarget/Qphacounttarget)*100000).toFixed(1),
					mtdtreatinvtarget:Qtreatinvtarget.toFixed(1),
					mtdtreatinvcounttarget:Qtreatinvcounttarget,

					mtdcortarget:Qcortarget.toFixed(1),
					mtdcorcounttarget:Qcorcounttarget,
					mtdreftarget:Qreftarget.toFixed(1),
					mtdrefcounttarget:Qrefcounttarget,
					mtdosutarget:Qosutarget.toFixed(1),
					mtdosucounttarget:Qosucounttarget,
				    mtdconlenstarget : Qconlenstarget.toFixed(1),
					mtdconlenscounttarget : Qconlenscounttarget,
					mtdvrintarget : Qvrintarget.toFixed(1),
					mtdvrincounttarget : Qvrincounttarget,
					mtdtconsutarget : Qtconsutarget.toFixed(1),
					mtdpopdtarget : Qpopdtarget,
					mtdvrsugtarget : Qvrsugtarget.toFixed(1),
					mtdvrsugcounttarget : Qvrsugcounttarget
			});



	});

	QObj['currentyearQ'] = QRevenueObj1;



	Qrev = 0;
	Qrevtar = 0;
	Qopd=0;
	Qctlowend=0;
	Qctlowendcount=0,Qcthighend=0,Qcthighendcount=0,Qctmidend=0,Qctmidendcount=0,Qctall=0,Qctallcount=0;
	Qopdtarget=0,Qpaidrevtarget=0,Qconschargestarget=0,Qcatlenostarget=0,Qcatmenostarget=0,Qcathenostarget=0,Qcatlevaluestarget=0,Qcatmevaluestarget=0,Qcathevaluestarget=0,Qallcattarget=0,Qallcatcounttarget=0;
	Qopt=0,Qoptcount=0,Qopttarget=0,Qoptcounttarget=0;
	Qpha=0,Qphacount=0,Qphatarget=0,Qphacounttarget=0;
	Qtreatinv=0,Qtreatinvcount=0,Qtreatinvtarget=0,Qtreatinvcounttarget=0;
	Qosu=0,Qosucount=0,Qosutarget=0,Qosucounttarget=0;
	Qconlens=0,Qconlenscount=0,Qconlenstarget=0,Qconlenscounttarget=0;
	Qvrin=0,Qvrincount=0,Qvrintarget=0,Qvrincounttarget=0;
	Qtconsu=0,Qtconsucount=0,Qtconsutarget=0,Qtconsucounttarget=0;
	Qpopd=0,Qpopdcount=0,Qpopdtarget=0,Qpopdcounttarget=0;
	Qvrsug=0,Qvrsugcount=0,Qvrsugtarget=0,Qvrsugcounttarget=0;
	Qoptypp=0,Qoptypptarget=0;
	Qphaypp=0,Qphaypptarget=0;
	Qopdypp=0,Qopdypptarget=0;
	QRevenueObj1 = {};
	QArr.forEach(Q => {
        Qrev=0;	Qrevtar=0,Qopd=0,Qctlowend=0,Qctlowendcount=0,Qcthighend=0,Qcthighendcount=0,Qctmidend=0,Qctmidendcount=0,Qctall=0,Qctallcount=0;

		Qopdtarget=0,Qpaidrevtarget=0,Qconschargestarget=0,Qcatlenostarget=0,Qcatmenostarget=0,Qcathenostarget=0,Qcatlevaluestarget=0,Qcatmevaluestarget=0,Qcathevaluestarget=0,Qallcattarget=0,Qallcatcounttarget=0;


		 Qopt=0,Qoptcount=0,Qopttarget=0,Qoptcounttarget=0;
		 Qpha=0,Qphacount=0,Qphatarget=0,Qphacounttarget=0;
		 Qtreatinv=0,Qtreatinvcount=0,Qtreatinvtarget=0,Qtreatinvcounttarget=0;
		 Qcor=0,Qcorcount=0,Qcortarget=0,Qcorcounttarget=0;
        Qref=0,Qrefcount=0,Qreftarget=0,Qrefcounttarget=0;
		Qosu=0,Qosucount=0,Qosutarget=0,Qosucounttarget=0;
		Qconlens=0,Qconlenscount=0,Qconlenstarget=0,Qconlenscounttarget=0;
		Qvrin=0,Qvrincount=0,Qvrintarget=0,Qvrincounttarget=0;
		Qtconsu=0,Qtconsucount=0,Qtconsutarget=0,Qtconsucounttarget=0;
		Qpopd=0,Qpopdcount=0,Qpopdtarget=0,Qpopdcounttarget=0;
		Qvrsug=0,Qvrsugcount=0,Qvrsugtarget=0,Qvrsugcounttarget=0;
		Qoptypp=0,Qoptypptarget=0;
		Qphaypp=0,Qphaypptarget=0;
		Qopdypp=0,Qopdypptarget=0;
        QRevenueObj1[Q] = [];
		QGroup[Q].forEach(month => {
			_.filter(reveCalMonthRes.thirdyearmonth, {  'monthText': month}).forEach(
						element => {

							//console.log(element.monthText);
							//console.log(element.mtdrev);
							Qrev+=parseFloat(element.mtdrev);
							Qrevtar+=parseFloat(element.mtdrevtarget);
							Qopd+=parseFloat(element.mtdopd);
							Qopdypp+=parseInt(element.mtdopdypp);
							Qctlowend+=parseFloat(element.mtdctlowend);
						    Qctlowendcount+=parseFloat(element.mtdctlowendcount);
							Qcthighend+=parseFloat(element.mtdcthighend);
						    Qcthighendcount+=parseFloat(element.mtdcthighendcount);
							Qctmidend+=parseFloat(element.mtdctmidend);
						    Qctmidendcount+=parseFloat(element.mtdctmidendcount);
							Qctall+=parseFloat(element.mtdallcat);
						    Qctallcount+=parseFloat(element.mtdallcatcount);
							Qopt+=parseFloat(element.mtdopt);
						    Qoptcount+=parseFloat(element.mtdoptcount);
							Qoptypp+=parseInt(element.mtdoptypp);
							Qpha+=parseFloat(element.mtdpha);
						    Qphacount+=parseFloat(element.mtdphacount);
							Qphaypp+=parseInt(element.mtdphaypp);
							Qtreatinv+=parseFloat(element.mtdtreatinv);
						    Qtreatinvcount+=parseFloat(element.mtdtreatinvcount);

							Qcor+=parseFloat(element.mtdcor);
						    Qcorcount+=parseFloat(element.mtdcorcount);
							Qref+=parseFloat(element.mtdref);
						    Qrefcount+=parseFloat(element.mtdrefcount);

							Qosu+=parseFloat(element.mtdosu);
						    Qosucount+=parseFloat(element.mtdosucount);
							Qconlens+=parseFloat(element.mtdconlens);
						    Qconlenscount+=parseFloat(element.mtdconlenscount);
							Qvrin+=parseFloat(element.mtdvrin);
						    Qvrincount+=parseFloat(element.mtdvrincount);

							Qtconsu+=parseFloat(element.mtdtconsu);
						    Qtconsucount+=parseFloat(element.mtdtconsucount);

							Qpopd+=element.mtdpopd;
						    Qpopdcount+=parseFloat(element.mtdpopdcount);

							Qvrsug+=parseFloat(element.mtdvrsug);
						    Qvrsugcount+=parseFloat(element.mtdvrsugcount);

							Qopdtarget+=parseFloat(element.mtdopdtarget);
							Qopdypptarget+=parseInt(element.mtdopdypptarget);

							Qcatlenostarget+=parseFloat(element.mtdctlowendcounttarget);
						    Qcatmenostarget+=parseFloat(element.mtdctmidendcounttarget);
							Qcathenostarget+=parseFloat(element.mtdcthighendcounttarget);
						    Qcatlevaluestarget+=parseFloat(element.mtdctlowendtarget);
							Qcatmevaluestarget+=parseFloat(element.mtdctmidendtarget);
						    Qcathevaluestarget+=parseFloat(element.mtdcthighendtarget);

							Qallcattarget+=parseFloat(element.mtdallcattarget);
							Qallcatcounttarget+=parseFloat(element.mtdallcatcounttarget);
							Qopttarget+=parseFloat(element.mtdopttarget);
							Qoptcounttarget+=parseFloat(element.mtdoptcounttarget);
							Qoptypptarget+=parseInt(element.mtdoptypptarget);
							Qphatarget+=parseFloat(element.mtdphatarget);
							Qphacounttarget+=parseFloat(element.mtdphacounttarget);
							Qphaypptarget+=parseInt(element.mtdphaypptarget);
							Qtreatinvtarget+=parseFloat(element.mtdtreatinvtarget);
							Qtreatinvcounttarget+=parseFloat(element.mtdtreatinvcounttarget);

							Qcortarget+=parseFloat(element.mtdcortarget);
							Qcorcounttarget+=parseFloat(element.mtdcorcounttarget);
							Qreftarget+=parseFloat(element.mtdreftarget);
							Qrefcounttarget+=parseFloat(element.mtdrefcounttarget);

							Qosutarget+=parseFloat(element.mtdosutarget);
							Qosucounttarget+=parseFloat(element.mtdosucounttarget);

							Qconlenstarget+=parseFloat(element.mtdconlenstarget);
						    Qconlenscounttarget+=parseFloat(element.mtdconlenscounttarget);

							Qvrintarget+=parseFloat(element.mtdvrintarget);
						    Qvrincounttarget+=parseFloat(element.mtdvrincounttarget);
							Qtconsutarget+=parseFloat(element.mtdtconsutarget);
						    Qpopdtarget+=element.mtdpopdtarget;
							Qvrsugtarget+=parseFloat(element.mtdvrsugtarget);
						    Qvrsugcounttarget+=parseFloat(element.mtdvrsugcounttarget);
			});


		});
		QRevenueObj1[Q].push({
					mtdrev : Qrev.toFixed(1),
					mtdrevtarget: Qrevtar.toFixed(1),
					mtdopd : Qopd,
					mtdopdypp : parseFloat((Qrev/Qopd)*100000).toFixed(1),
					mtdctlowend : Qctlowend.toFixed(1),
					mtdctlowendcount : Qctlowendcount,
					mtdcthighend : Qcthighend.toFixed(1),
					mtdcthighendcount : Qcthighendcount,
					mtdctmidend : Qctmidend.toFixed(1),
					mtdctmidendcount : Qctmidendcount,
					mtdallcat : Qctall.toFixed(1),
					mtdallcatcount : Qctallcount,
					mtdopt : Qopt.toFixed(1),
					mtdoptcount : Qoptcount,
					mtdoptypp : parseFloat((Qopt/Qoptcount)*100000).toFixed(1),
					mtdpha : Qpha.toFixed(1),
					mtdphacount : Qphacount,
					mtdphaypp : parseFloat((Qpha/Qphacount)*100000).toFixed(1),
					mtdtreatinv : Qtreatinv.toFixed(1),
					mtdtreatinvcount : Qtreatinvcount,

					mtdcor : Qcor.toFixed(1),
					mtdcorcount : Qcorcount,
					mtdref : Qref.toFixed(1),
					mtdrefcount : Qrefcount,

					mtdosu : Qosu.toFixed(1),
					mtdosucount : Qosucount,
					mtdconlens : Qconlens.toFixed(1),
					mtdconlenscount : Qconlenscount,
					mtdvrin : Qvrin.toFixed(1),
					mtdvrincount : Qvrincount,
					mtdtconsu : Qtconsu.toFixed(1),
					mtdtconsucount : Qtconsucount,
					mtdpopd : Qpopd,
					mtdpopdcount : Qpopdcount,
					mtdvrsug : Qvrsug.toFixed(1),
					mtdvrsugcount : Qvrsugcount,


					mtdopdtarget: Qopdtarget,
					mtdopdypptarget:parseFloat((Qrevtar/Qopdtarget)*100000).toFixed(1),

				    mtdctlowendtarget:Qcatlevaluestarget.toFixed(1),
					mtdcthighendtarget:Qcathevaluestarget.toFixed(1),
					mtdctmidendtarget:Qcatmevaluestarget.toFixed(1),
					mtdctlowendcounttarget:Qcatlenostarget,
					mtdcthighendcounttarget:Qcathenostarget,
					mtdctmidendcounttarget:Qcatmenostarget,

					mtdallcattarget:Qallcattarget.toFixed(1),
					mtdallcatcounttarget:Qallcatcounttarget,

					mtdopttarget:Qopttarget.toFixed(1),
					mtdoptcounttarget:Qoptcounttarget,
					mtdoptypptarget:parseFloat((Qopttarget/Qoptcounttarget)*100000).toFixed(1),
					mtdphatarget:Qphatarget.toFixed(1),
					mtdphacounttarget:Qphacounttarget,
					mtdphaypptarget:parseFloat((Qphatarget/Qphacounttarget)*100000).toFixed(1),
					mtdtreatinvtarget:Qtreatinvtarget.toFixed(1),
					mtdtreatinvcounttarget:Qtreatinvcounttarget,

					mtdcortarget:Qcortarget.toFixed(1),
					mtdcorcounttarget:Qcorcounttarget,
					mtdreftarget:Qreftarget.toFixed(1),
					mtdrefcounttarget:Qrefcounttarget,
					mtdosutarget:Qosutarget.toFixed(1),
					mtdosucounttarget:Qosucounttarget,
				    mtdconlenstarget : Qconlenstarget.toFixed(1),
					mtdconlenscounttarget : Qconlenscounttarget,
					mtdvrintarget : Qvrintarget.toFixed(1),
					mtdvrincounttarget : Qvrincounttarget,
					mtdtconsutarget : Qtconsutarget.toFixed(1),
					mtdpopdtarget : Qpopdtarget,
					mtdvrsugtarget : Qvrsugtarget.toFixed(1),
					mtdvrsugcounttarget : Qvrsugcounttarget
			});



	});

	QObj['thirdyearQ'] = QRevenueObj1;



	QRevenueObj3 = {};
	for (let key in QObj.lastyearQ) {
		QRevenueObj3[key] = [];
		//console.log(QObj.currentyearQ[key][0].mtdrev);


		QRevenueObj3[key].push({
					mtdrevper : (parseFloat((QObj.currentyearQ[key][0].mtdrev/parseFloat(QObj.lastyearQ[key][0].mtdrev)-1))*100).toFixed(1),
					mtdtargetper: (parseFloat((QObj.currentyearQ[key][0].mtdrevtarget/parseFloat(QObj.lastyearQ[key][0].mtdrevtarget)-1))*100).toFixed(1),


					mtdopdper : (parseFloat((QObj.currentyearQ[key][0].mtdopd/parseFloat(QObj.lastyearQ[key][0].mtdopd)-1))*100).toFixed(1),
					mtdopdyppper:(parseFloat((QObj.currentyearQ[key][0].mtdopdypp/parseFloat(QObj.lastyearQ[key][0].mtdopdypp)-1))*100).toFixed(1),

					mtdctlowendper : (parseFloat((QObj.currentyearQ[key][0].mtdctlowend/parseFloat(QObj.lastyearQ[key][0].mtdctlowend)-1))*100).toFixed(1),
					mtdcthighendper : (parseFloat((QObj.currentyearQ[key][0].mtdcthighend/parseFloat(QObj.lastyearQ[key][0].mtdcthighend)-1))*100).toFixed(1),
					mtdctmidendper : (parseFloat((QObj.currentyearQ[key][0].mtdctmidend/parseFloat(QObj.lastyearQ[key][0].mtdctmidend)-1))*100).toFixed(1),
					mtdctlowendcountper : (parseFloat((QObj.currentyearQ[key][0].mtdctlowendcount/parseFloat(QObj.lastyearQ[key][0].mtdctlowendcount)-1))*100).toFixed(1),
					mtdcthighendcountper : (parseFloat((QObj.currentyearQ[key][0].mtdcthighendcount/parseFloat(QObj.lastyearQ[key][0].mtdcthighendcount)-1))*100).toFixed(1),
					mtdctmidendcountper : (parseFloat((QObj.currentyearQ[key][0].mtdctmidendcount/parseFloat(QObj.lastyearQ[key][0].mtdctmidendcount)-1))*100).toFixed(1),

					mtdallcatper:(parseFloat((QObj.currentyearQ[key][0].mtdallcat/parseFloat(QObj.lastyearQ[key][0].mtdallcat)-1))*100).toFixed(1),
					mtdallcatcountper:(parseFloat((QObj.currentyearQ[key][0].mtdallcatcount/parseFloat(QObj.lastyearQ[key][0].mtdallcatcount)-1))*100).toFixed(1),

					mtdoptper:(parseFloat((QObj.currentyearQ[key][0].mtdopt/parseFloat(QObj.lastyearQ[key][0].mtdopt)-1))*100).toFixed(1),
					mtdoptcountper:(parseFloat((QObj.currentyearQ[key][0].mtdoptcount/parseFloat(QObj.lastyearQ[key][0].mtdoptcount)-1))*100).toFixed(1),
					mtdoptyppper:(parseFloat((QObj.currentyearQ[key][0].mtdoptypp/parseFloat(QObj.lastyearQ[key][0].mtdoptypp)-1))*100).toFixed(1),

					mtdphaper:(parseFloat((QObj.currentyearQ[key][0].mtdpha/parseFloat(QObj.lastyearQ[key][0].mtdpha)-1))*100).toFixed(1),
					mtdphacountper:(parseFloat((QObj.currentyearQ[key][0].mtdphacount/parseFloat(QObj.lastyearQ[key][0].mtdphacount)-1))*100).toFixed(1),
					mtdphayppper:(parseFloat((QObj.currentyearQ[key][0].mtdphaypp/parseFloat(QObj.lastyearQ[key][0].mtdphaypp)-1))*100).toFixed(1),

					mtdtreatinvper:(parseFloat((QObj.currentyearQ[key][0].mtdtreatinv/parseFloat(QObj.lastyearQ[key][0].mtdtreatinv)-1))*100).toFixed(1),
					mtdtreatinvcountper:(parseFloat((QObj.currentyearQ[key][0].mtdtreatinvcount/parseFloat(QObj.lastyearQ[key][0].mtdtreatinvcount)-1))*100).toFixed(1),


					mtdcorper:(parseFloat((QObj.currentyearQ[key][0].mtdcor/parseFloat(QObj.lastyearQ[key][0].mtdcor)-1))*100).toFixed(1),
					mtdcorcountper:(parseFloat((QObj.currentyearQ[key][0].mtdcorcount/parseFloat(QObj.lastyearQ[key][0].mtdcorcount)-1))*100).toFixed(1),

					mtdrefper:(parseFloat((QObj.currentyearQ[key][0].mtdref/parseFloat(QObj.lastyearQ[key][0].mtdref)-1))*100).toFixed(1),
					mtdrefcountper:(parseFloat((QObj.currentyearQ[key][0].mtdrefcount/parseFloat(QObj.lastyearQ[key][0].mtdrefcount)-1))*100).toFixed(1),

					mtdosuper:(parseFloat((QObj.currentyearQ[key][0].mtdosu/parseFloat(QObj.lastyearQ[key][0].mtdosu)-1))*100).toFixed(1),
					mtdosucountper:(parseFloat((QObj.currentyearQ[key][0].mtdosucount/parseFloat(QObj.lastyearQ[key][0].mtdosucount)-1))*100).toFixed(1),

					mtdconlensper:(parseFloat((QObj.currentyearQ[key][0].mtdconlens/parseFloat(QObj.lastyearQ[key][0].mtdconlens)-1))*100).toFixed(1),
					mtdconlenscountper:(parseFloat((QObj.currentyearQ[key][0].mtdconlenscount/parseFloat(QObj.lastyearQ[key][0].mtdconlenscount)-1))*100).toFixed(1),

					mtdvrinper:(parseFloat((QObj.currentyearQ[key][0].mtdvrin/parseFloat(QObj.lastyearQ[key][0].mtdvrin)-1))*100).toFixed(1),
					mtdvrincountper:(parseFloat((QObj.currentyearQ[key][0].mtdvrincount/parseFloat(QObj.lastyearQ[key][0].mtdvrincount)-1))*100).toFixed(1),

					mtdtconsuper:(parseFloat((QObj.currentyearQ[key][0].mtdtconsu/parseFloat(QObj.lastyearQ[key][0].mtdtconsu)-1))*100).toFixed(1),
					mtdpopdper:(parseFloat((QObj.currentyearQ[key][0].mtdpopd/parseFloat(QObj.lastyearQ[key][0].mtdpopd)-1))*100).toFixed(1),
					mtdvrsugper:(parseFloat((QObj.currentyearQ[key][0].mtdvrsug/parseFloat(QObj.lastyearQ[key][0].mtdvrsug)-1))*100).toFixed(1),
					mtdvrsugcountper:(parseFloat((QObj.currentyearQ[key][0].mtdvrsugcount/parseFloat(QObj.lastyearQ[key][0].mtdvrsugcount)-1))*100).toFixed(1)





			});



	}
	QObj['revenueQper'] = QRevenueObj3;

	return QObj;
}
