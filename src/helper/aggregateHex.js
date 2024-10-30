import area from "@turf/area";

export function calculateArea(input) {
  let totalArea = 0;
  if (input.length > 0) {
    totalArea =
      input.reduce((a, b) => {
        return a + area(b);
      }, 0) / 1000000;
  }
  return totalArea;
};

export function getStochasticValues(hex) {
  const indicators = {
    estcc: [0, 0.25, 0.5, 0.75, 1],
    firef: [0, 0.5, 1],
    gmgfc: [0, 1],
    gppgr: [0.2, 0.4, 0.6, 0.8, 1],
    grntr: [0, 0.25, 0.5, 0.75, 1],
    ihabc: [0, 0.75, 1],
    impas: [0, 0.5, 0.75, 1],
    isegr: [0, 0.25, 0.5, 0.75, 1],
    mavbp: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    mavbr: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    netcx: [0, 0.25, 0.5, 0.75, 1],
    nlcfp: [0, 0.25, 0.5, 0.75, 1],
    persu: [0.5, 0.7, 0.9, 1],
    playa: [0, 0.5, 1],
    rescs: [0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    rests: [0, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    safbb: [0, 0.2, 0.4, 0.6, 0.8, 1],
    saffb: [0, 0.5, 1],
    saluh: [0, 0.5, 1],
    urbps: [0, 0.25, 0.5, 0.75, 1],
    wcofw: [0, 0.2, 0.4, 0.6, 0.8, 1],
    wcopb: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    wgcmd: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    futv2: [0.25, 0.50, 0.75, 1.0]
  };

  const probabilities = {
    estcc: [hex.estcc_0, hex.estcc_0_25, hex.estcc_0_5, hex.estcc_0_75, hex.estcc_1],
    firef: [hex.firef_0, hex.firef_0_5, hex.firef_1],
    gmgfc: [hex.gmgfc_0, hex.gmgfc_1],
    gppgr: [hex.gppgr_0_2, hex.gppgr_0_4, hex.gppgr_0_6, hex.gppgr_0_8, hex.gppgr_1],
    grntr: [hex.grntr_0, hex.grntr_0_25, hex.grntr_0_5, hex.grntr_0_75, hex.grntr_1],
    ihabc: [hex.ihabc_0, hex.ihabc_0_75, hex.ihabc_1],
    impas: [hex.impas_0, hex.impas_0_5, hex.impas_0_75, hex.impas_1],
    isegr: [hex.isegr_0, hex.isegr_0_25, hex.isegr_0_5, hex.isegr_0_75, hex.isegr_1],
    mavbp: [hex.mavbp_0, hex.mavbp_0_1, hex.mavbp_0_2, hex.mavbp_0_3, hex.mavbp_0_4, hex.mavbp_0_5, hex.mavbp_0_6, hex.mavbp_0_7, hex.mavbp_0_8, hex.mavbp_0_9, hex.mavbp_1],
    mavbr: [hex.mavbr_0, hex.mavbr_0_1, hex.mavbr_0_2, hex.mavbr_0_3, hex.mavbr_0_4, hex.mavbr_0_5, hex.mavbr_0_6, hex.mavbr_0_7, hex.mavbr_0_8, hex.mavbr_0_9, hex.mavbr_1],
    netcx: [hex.netcx_0, hex.netcx_0_25, hex.netcx_0_5, hex.netcx_0_75, hex.netcx_1],
    nlcfp: [hex.nlcfp_0, hex.nlcfp_0_25, hex.nlcfp_0_5, hex.nlcfp_0_75, hex.nlcfp_1],
    persu: [hex.persu_0_5, hex.persu_0_7, hex.persu_0_9, hex.persu_1],
    playa: [hex.playa_0, hex.playa_0_5, hex.playa_1],
    rescs: [hex.rescs_0_1, hex.rescs_0_25, hex.rescs_0_4, hex.rescs_0_55, hex.rescs_0_7, hex.rescs_0_85, hex.rescs_1],
    rests: [hex.rests_0, hex.rests_0_25, hex.rests_0_4, hex.rests_0_55, hex.rests_0_7, hex.rests_0_85, hex.rests_1],
    safbb: [hex.safbb_0, hex.safbb_0_2, hex.safbb_0_4, hex.safbb_0_6, hex.safbb_0_8, hex.safbb_1],
    saffb: [hex.saffb_0, hex.saffb_0_5, hex.saffb_1],
    saluh: [hex.saluh_0, hex.saluh_0_5, hex.saluh_1],
    urbps: [hex.urbps_0, hex.urbps_0_25, hex.urbps_0_5, hex.urbps_0_75, hex.urbps_1],
    wcofw: [hex.wcofw_0, hex.wcofw_0_2, hex.wcofw_0_4, hex.wcofw_0_6, hex.wcofw_0_8, hex.wcofw_1],
    wcopb: [hex.wcopb_0, hex.wcopb_0_5, hex.wcopb_0_6, hex.wcopb_0_7, hex.wcopb_0_8, hex.wcopb_0_9, hex.wcopb_1],
    wgcmd: [hex.wgcmd_0, hex.wgcmd_0_1, hex.wgcmd_0_2, hex.wgcmd_0_3, hex.wgcmd_0_4, hex.wgcmd_0_5, hex.wgcmd_0_6, hex.wgcmd_0_7, hex.wgcmd_0_8, hex.wgcmd_0_9, hex.wgcmd_1],
    futv2: [hex.futv2_1, hex.futv2_2, hex.futv2_3, hex.futv2_4]
  };
  
  let estccSims = [],
  firefSims = [],
  gmgfcSims = [],
  gppgrSims = [],
  grntrSims = [],
  ihabcSims = [],
  impasSims = [],
  isegrSims = [],
  mavbpSims = [],
  mavbrSims = [],
  netcxSims = [],
  nlcfpSims = [],
  persuSims = [],
  playaSims = [],
  rescsSims = [],
  restsSims = [],
  safbbSims = [],
  saffbSims = [],
  saluhSims = [],
  urbpsSims = [],
  wcofwSims = [],
  wcopbSims = [],
  wgcmdSims = [],
  futv2Sims = [];
  
  const find = (input, array, weight) =>
	  array.find((e, i) => {
      let sum = array.slice(0, i + 1).reduce((accumulator, element, index) => {
        return accumulator + weight[index];
      }, 0);
      
      if (input < sum) {
          return true;
      } else {
        return false;
      }
    });

  // Remove null values (-1) before calculating the average
  for(let i=0; i<1000; i++){
    if (probabilities.estcc.filter((item) => item !== -1).length === probabilities.estcc.length) {
      estccSims.push(find(Math.random(), indicators.estcc, probabilities.estcc));
    };
    if (probabilities.firef.filter((item) => item !== -1).length === probabilities.firef.length) {
      firefSims.push(find(Math.random(), indicators.firef, probabilities.firef));
    };
    if (probabilities.gmgfc.filter((item) => item !== -1).length === probabilities.gmgfc.length) {
      gmgfcSims.push(find(Math.random(), indicators.gmgfc, probabilities.gmgfc));
    };
    if (probabilities.gppgr.filter((item) => item !== -1).length === probabilities.gppgr.length) {
      gppgrSims.push(find(Math.random(), indicators.gppgr, probabilities.gppgr));
    };
    if (probabilities.grntr.filter((item) => item !== -1).length === probabilities.grntr.length) {
      grntrSims.push(find(Math.random(), indicators.grntr, probabilities.grntr));
    };
    if (probabilities.ihabc.filter((item) => item !== -1).length === probabilities.ihabc.length) {
      ihabcSims.push(find(Math.random(), indicators.ihabc, probabilities.ihabc));
    };
    if (probabilities.impas.filter((item) => item !== -1).length === probabilities.impas.length) {
      impasSims.push(find(Math.random(), indicators.impas, probabilities.impas));
    };
    if (probabilities.isegr.filter((item) => item !== -1).length === probabilities.isegr.length) {
      isegrSims.push(find(Math.random(), indicators.isegr, probabilities.isegr));
    };
    if (probabilities.mavbp.filter((item) => item !== -1).length === probabilities.mavbp.length) {
      mavbpSims.push(find(Math.random(), indicators.mavbp, probabilities.mavbp));
    };
    if (probabilities.mavbr.filter((item) => item !== -1).length === probabilities.mavbr.length) {
      mavbrSims.push(find(Math.random(), indicators.mavbr, probabilities.mavbr));
    };
    if (probabilities.netcx.filter((item) => item !== -1).length === probabilities.netcx.length) {
      netcxSims.push(find(Math.random(), indicators.netcx, probabilities.netcx));
    };
    if (probabilities.nlcfp.filter((item) => item !== -1).length === probabilities.nlcfp.length) {
      nlcfpSims.push(find(Math.random(), indicators.nlcfp, probabilities.nlcfp));
    };
    if (probabilities.persu.filter((item) => item !== -1).length === probabilities.persu.length) {
      persuSims.push(find(Math.random(), indicators.persu, probabilities.persu));
    };
    if (probabilities.playa.filter((item) => item !== -1).length === probabilities.playa.length) {
      playaSims.push(find(Math.random(), indicators.playa, probabilities.playa));
    };
    if (probabilities.rescs.filter((item) => item !== -1).length === probabilities.rescs.length) {
      rescsSims.push(find(Math.random(), indicators.rescs, probabilities.rescs));
    };
    if (probabilities.rests.filter((item) => item !== -1).length === probabilities.rests.length) {
      restsSims.push(find(Math.random(), indicators.rests, probabilities.rests));
    };
    if (probabilities.safbb.filter((item) => item !== -1).length === probabilities.safbb.length) {
      safbbSims.push(find(Math.random(), indicators.safbb, probabilities.safbb));
    };
    if (probabilities.saffb.filter((item) => item !== -1).length === probabilities.saffb.length) {
      saffbSims.push(find(Math.random(), indicators.saffb, probabilities.saffb));
    };
    if (probabilities.saluh.filter((item) => item !== -1).length === probabilities.saluh.length) {
      saluhSims.push(find(Math.random(), indicators.saluh, probabilities.saluh));
    };
    if (probabilities.urbps.filter((item) => item !== -1).length === probabilities.urbps.length) {
      urbpsSims.push(find(Math.random(), indicators.urbps, probabilities.urbps));
    };
    if (probabilities.wcofw.filter((item) => item !== -1).length === probabilities.wcofw.length) {
      wcofwSims.push(find(Math.random(), indicators.wcofw, probabilities.wcofw));
    };
    if (probabilities.wcopb.filter((item) => item !== -1).length === probabilities.wcopb.length) {
      wcopbSims.push(find(Math.random(), indicators.wcopb, probabilities.wcopb));
    };
    if (probabilities.wgcmd.filter((item) => item !== -1).length === probabilities.wgcmd.length) {
      wgcmdSims.push(find(Math.random(), indicators.wgcmd, probabilities.wgcmd));
    };
    if (probabilities.futv2.filter((item) => item !== -1).length === probabilities.futv2.length) {
      futv2Sims.push(find(Math.random(), indicators.futv2, probabilities.futv2));
    };
  };
  
  const average = array => array.length === 0 ? 0 : array.reduce((a, b) => a + b) / array.length;
  const averageScores = {
    estcc: average(estccSims),
    firef: average(firefSims),
    gmgfc: average(gmgfcSims),
    gppgr: average(gppgrSims),
    grntr: average(grntrSims),
    ihabc: average(ihabcSims),
    impas: average(impasSims),
    isegr: average(isegrSims),
    mavbp: average(mavbpSims),
    mavbr: average(mavbrSims),
    netcx: average(netcxSims),
    nlcfp: average(nlcfpSims),
    persu: average(persuSims),
    playa: average(playaSims),
    rescs: average(rescsSims),
    rests: average(restsSims),
    safbb: average(safbbSims),
    saffb: average(saffbSims),
    saluh: average(saluhSims),
    urbps: average(urbpsSims),
    wcofw: average(wcofwSims),
    wcopb: average(wcopbSims),
    wgcmd: average(wgcmdSims),
    futurePenalty: hex.futv2_me
  };

  return averageScores;
};

export function getHexagonScore(score) {
  const hList = ["estcc", "firef", "gppgr", "impas", "isegr", "mavbp", "mavbr", "nlcfp", "persu", "playa", "rescs", "rests", "safbb", "saffb", "wcofw", "wcopb", "wgcmd"];
  const fList = ["grntr", "saluh", "urbps"];
  const cList = ["gmgfc", "ihabc", "netcx"];

  const hTotal = hList.reduce((total, current) => total + (score[current] !== -1 ? score[current] : 0), 0);
  const hLength = hList.filter((item) => score[item] !== -1).length;
  const hScore = hLength !== 0 ? hTotal/hLength : 0;
  
  const fTotal = fList.reduce((total, current) => total + (score[current] !== -1 ? score[current] : 0), 0);
  const fLength = fList.filter((item) => score[item] !== -1).length;
  const fScore = fLength !== 0 ? fTotal/fLength : 0;

  const cTotal = cList.reduce((total, current) => total + (score[current] !== -1 ? score[current] : 0), 0);
  const cLength = cList.filter((item) => score[item] !== -1).length;
  const cScore = cLength !== 0 ? cTotal/cLength : 0;

  const currentScore = (hScore + fScore + cScore)/3;
  const futureScore = currentScore*score.futurePenalty;
  
  return {
    estcc: score.estcc,
    firef: score.firef,
    gmgfc: score.gmgfc,
    gppgr: score.gppgr,
    grntr: score.grntr,
    ihabc: score.ihabc,
    impas: score.impas,
    isegr: score.isegr,
    mavbp: score.mavbp,
    mavbr: score.mavbr,
    netcx: score.netcx,
    nlcfp: score.nlcfp,
    persu: score.persu,
    playa: score.playa,
    rescs: score.rescs,
    rests: score.rests,
    safbb: score.safbb,
    saffb: score.saffb,
    saluh: score.saluh,
    urbps: score.urbps,
    wcofw: score.wcofw,
    wcopb: score.wcopb,
    wgcmd: score.wgcmd,
    hScore: hScore,
    fScore: fScore,
    cScore: cScore,
    currentScore: currentScore,
    futureScore: futureScore,
    futurePenalty: score.futurePenalty,
  };
};

export function getAoiScore(featureArray) {
  const getAverageScore = (features, property) => {
    const scoreList = features.map((feature) => feature.properties[property]).filter((score) => score !== -1);
    const aoiScore = scoreList.length ? Math.round(100*scoreList.reduce((a, b) => a + b, 0)/scoreList.length)/100 : -1;
    return aoiScore;
  };
  
  let aoiScore = {
    estcc: getAverageScore(featureArray, "estcc"),
    firef: getAverageScore(featureArray, "firef"),
    gmgfc: getAverageScore(featureArray, "gmgfc"),
    gppgr: getAverageScore(featureArray, "gppgr"),
    grntr: getAverageScore(featureArray, "grntr"),
    ihabc: getAverageScore(featureArray, "ihabc"),
    impas: getAverageScore(featureArray, "impas"),
    isegr: getAverageScore(featureArray, "isegr"),
    mavbp: getAverageScore(featureArray, "mavbp"),
    mavbr: getAverageScore(featureArray, "mavbr"),
    netcx: getAverageScore(featureArray, "netcx"),
    nlcfp: getAverageScore(featureArray, "nlcfp"),
    persu: getAverageScore(featureArray, "persu"),
    playa: getAverageScore(featureArray, "playa"),
    rescs: getAverageScore(featureArray, "rescs"),
    rests: getAverageScore(featureArray, "rests"),
    safbb: getAverageScore(featureArray, "safbb"),
    saffb: getAverageScore(featureArray, "saffb"),
    saluh: getAverageScore(featureArray, "saluh"),
    urbps: getAverageScore(featureArray, "urbps"),
    wcofw: getAverageScore(featureArray, "wcofw"),
    wcopb: getAverageScore(featureArray, "wcopb"),
    wgcmd: getAverageScore(featureArray, "wgcmd"),
    hScore: getAverageScore(featureArray, "hScore"),
    fScore: getAverageScore(featureArray, "fScore"),
    cScore: getAverageScore(featureArray, "cScore"),
    currentScore: getAverageScore(featureArray, "currentScore"),
    futureScore: getAverageScore(featureArray, "futureScore"),
    futurePenalty: getAverageScore(featureArray, "futurePenalty"),
  };
  
  return aoiScore;
};

export function sensitivityAnalysis(score, indicator, percentage) {
  const hList = ["estcc", "firef", "gppgr", "impas", "isegr", "mavbp", "mavbr", "nlcfp", "persu", "playa", "rescs", "rests", "safbb", "saffb", "wcofw", "wcopb", "wgcmd"];
  const fList = ["grntr", "saluh", "urbps"];
  const cList = ["gmgfc", "ihabc", "netcx"];

  const hTotal = hList.reduce((total, current) => total + (score[current] !== -1 ? (current === indicator? score[current]*(1+percentage) : score[current]) : 0), 0);
  const hLength = hList.filter((item) => score[item] !== -1).length;
  const hScore = hLength !== 0 ? hTotal/hLength : 0;
  
  const fTotal = fList.reduce((total, current) => total + (score[current] !== -1 ? (current === indicator? score[current]*(1+percentage) : score[current]) : 0), 0);
  const fLength = fList.filter((item) => score[item] !== -1).length;
  const fScore = fLength !== 0 ? fTotal/fLength : 0;

  const cTotal = cList.reduce((total, current) => total + (score[current] !== -1 ? (current === indicator? score[current]*(1+percentage) : score[current]) : 0), 0);
  const cLength = cList.filter((item) => score[item] !== -1).length;
  const cScore = cLength !== 0 ? cTotal/cLength : 0;

  const currentScore = (hScore + fScore + cScore)/3;
  const futureScore = currentScore*score.futurePenalty;
  
  return {
    estcc: score.estcc,
    firef: score.firef,
    gmgfc: score.gmgfc,
    gppgr: score.gppgr,
    grntr: score.grntr,
    ihabc: score.ihabc,
    impas: score.impas,
    isegr: score.isegr,
    mavbp: score.mavbp,
    mavbr: score.mavbr,
    netcx: score.netcx,
    nlcfp: score.nlcfp,
    persu: score.persu,
    playa: score.playa,
    rescs: score.rescs,
    rests: score.rests,
    safbb: score.safbb,
    saffb: score.saffb,
    saluh: score.saluh,
    urbps: score.urbps,
    wcofw: score.wcofw,
    wcopb: score.wcopb,
    wgcmd: score.wgcmd,
    hScore: hScore,
    fScore: fScore,
    cScore: cScore,
    currentScore: currentScore,
    futureScore: futureScore,
    futurePenalty: score.futurePenalty,
  };
};
