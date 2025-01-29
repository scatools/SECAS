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

export function getStochasticScore(hex) {
  const indicators = {
    aefih: [0.25, 0.5, 1],
    amfih: [0.25, 0.5, 1],
    amrpa: [0, 1],
    cshcn: [0, 0.25, 0.5, 1],
    ecopb: [0.2, 0.4, 0.6, 0.8, 1],
    eqapk: [0.5, 0.75, 1],
    estcc: [0, 0.25, 0.5, 0.75, 1],
    firef: [0, 0.5, 1],
    gmgfc: [0, 1],
    gppgr: [0.2, 0.4, 0.6, 0.8, 1],
    grntr: [0, 0.25, 0.5, 0.75, 1],
    grsav: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
    ihabc: [0, 0.75, 1],
    impas: [0, 0.5, 0.75, 1],
    isegr: [0, 0.25, 0.5, 0.75, 1],
    lscdn: [0.1, 0.2, 0.4, 0.6, 0.8, 1],
    mavbp: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    mavbr: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    netcx: [0.25, 0.5, 0.75, 1],
    nlcfp: [0.25, 0.5, 0.75, 1],
    persu: [0.5, 0.7, 0.9, 1],
    playa: [0, 0.5, 1],
    rescs: [0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    rests: [0, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    safbb: [0, 0.2, 0.4, 0.6, 0.8, 1],
    saffb: [0, 0.5, 1],
    saluh: [0, 0.5, 1],
    samfs: [0, 1],
    scwet: [0, 0.5, 1],
    urbps: [0.2, 0.4, 0.6, 0.8, 1],
    wcofw: [0, 0.2, 0.4, 0.6, 0.8, 1],
    wcopb: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    wgcmd: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    futv2: [0.25, 0.50, 0.75, 1.0]
  };

  const probabilities = {
    aefih: [hex.aefih_0_25, hex.aefih_0_5, hex.aefih_1],
    amfih: [hex.amfih_0_25, hex.amfih_0_5, hex.amfih_1],
    amrpa: [hex.amrpa_0, hex.amrpa_1],
    cshcn: [hex.cshcn_0, hex.cshcn_0_25, hex.cshcn_0_5, hex.cshcn_1],
    ecopb: [hex.ecopb_0_2, hex.ecopb_0_4, hex.ecopb_0_6, hex.ecopb_0_8, hex.ecopb_1],
    eqapk: [hex.eqapk_0_5, hex.eqapk_0_75, hex.eqapk_1],
    estcc: [hex.estcc_0, hex.estcc_0_25, hex.estcc_0_5, hex.estcc_0_75, hex.estcc_1],
    firef: [hex.firef_0, hex.firef_0_5, hex.firef_1],
    gmgfc: [hex.gmgfc_0, hex.gmgfc_1],
    gppgr: [hex.gppgr_0_2, hex.gppgr_0_4, hex.gppgr_0_6, hex.gppgr_0_8, hex.gppgr_1],
    grntr: [hex.grntr_0, hex.grntr_0_25, hex.grntr_0_5, hex.grntr_0_75, hex.grntr_1],
    grsav: [hex.grsav_0, hex.grsav_0_15, hex.grsav_0_3, hex.grsav_0_45, hex.grsav_0_6, hex.grsav_0_75, hex.grsav_0_9, hex.grsav_1],
    ihabc: [hex.ihabc_0, hex.ihabc_0_75, hex.ihabc_1],
    impas: [hex.impas_0, hex.impas_0_5, hex.impas_0_75, hex.impas_1],
    isegr: [hex.isegr_0, hex.isegr_0_25, hex.isegr_0_5, hex.isegr_0_75, hex.isegr_1],
    lscdn: [hex.lscdn_0_1, hex.lscdn_0_2, hex.lscdn_0_4, hex.lscdn_0_6, hex.lscdn_0_8, hex.lscdn_1],
    mavbp: [hex.mavbp_0, hex.mavbp_0_1, hex.mavbp_0_2, hex.mavbp_0_3, hex.mavbp_0_4, hex.mavbp_0_5, hex.mavbp_0_6, hex.mavbp_0_7, hex.mavbp_0_8, hex.mavbp_0_9, hex.mavbp_1],
    mavbr: [hex.mavbr_0, hex.mavbr_0_1, hex.mavbr_0_2, hex.mavbr_0_3, hex.mavbr_0_4, hex.mavbr_0_5, hex.mavbr_0_6, hex.mavbr_0_7, hex.mavbr_0_8, hex.mavbr_0_9, hex.mavbr_1],
    netcx: [hex.netcx_0_25, hex.netcx_0_5, hex.netcx_0_75, hex.netcx_1],
    nlcfp: [hex.nlcfp_0_25, hex.nlcfp_0_5, hex.nlcfp_0_75, hex.nlcfp_1],
    persu: [hex.persu_0_5, hex.persu_0_7, hex.persu_0_9, hex.persu_1],
    playa: [hex.playa_0, hex.playa_0_5, hex.playa_1],
    rescs: [hex.rescs_0_1, hex.rescs_0_25, hex.rescs_0_4, hex.rescs_0_55, hex.rescs_0_7, hex.rescs_0_85, hex.rescs_1],
    rests: [hex.rests_0, hex.rests_0_25, hex.rests_0_4, hex.rests_0_55, hex.rests_0_7, hex.rests_0_85, hex.rests_1],
    safbb: [hex.safbb_0, hex.safbb_0_2, hex.safbb_0_4, hex.safbb_0_6, hex.safbb_0_8, hex.safbb_1],
    saffb: [hex.saffb_0, hex.saffb_0_5, hex.saffb_1],
    saluh: [hex.saluh_0, hex.saluh_0_5, hex.saluh_1],
    samfs: [hex.samfs_0, hex.samfs_1],
    scwet: [hex.scwet_0, hex.scwet_0_5, hex.scwet_1],
    urbps: [hex.urbps_0_2, hex.urbps_0_4, hex.urbps_0_6, hex.urbps_0_8, hex.urbps_1],
    wcofw: [hex.wcofw_0, hex.wcofw_0_2, hex.wcofw_0_4, hex.wcofw_0_6, hex.wcofw_0_8, hex.wcofw_1],
    wcopb: [hex.wcopb_0, hex.wcopb_0_5, hex.wcopb_0_6, hex.wcopb_0_7, hex.wcopb_0_8, hex.wcopb_0_9, hex.wcopb_1],
    wgcmd: [hex.wgcmd_0, hex.wgcmd_0_1, hex.wgcmd_0_2, hex.wgcmd_0_3, hex.wgcmd_0_4, hex.wgcmd_0_5, hex.wgcmd_0_6, hex.wgcmd_0_7, hex.wgcmd_0_8, hex.wgcmd_0_9, hex.wgcmd_1],
    futv2: [hex.futv2_1, hex.futv2_2, hex.futv2_3, hex.futv2_4]
  };
  
  let
  aefihSims = [],
  amfihSims = [],
  amrpaSims = [],
  cshcnSims = [],
  ecopbSims = [],
  eqapkSims = [],
  estccSims = [],
  firefSims = [],
  gmgfcSims = [],
  gppgrSims = [],
  grntrSims = [],
  grsavSims = [],
  ihabcSims = [],
  impasSims = [],
  isegrSims = [],
  lscdnSims = [],
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
  samfsSims = [],
  scwetSims = [],
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
  for (let i=0; i<1000; i++) {
    if (probabilities.aefih.filter((item) => item !== -1).length === probabilities.aefih.length) {
      aefihSims.push(find(Math.random(), indicators.aefih, probabilities.aefih));
    };
    if (probabilities.amfih.filter((item) => item !== -1).length === probabilities.amfih.length) {
      amfihSims.push(find(Math.random(), indicators.amfih, probabilities.amfih));
    };
    if (probabilities.amrpa.filter((item) => item !== -1).length === probabilities.amrpa.length) {
      amrpaSims.push(find(Math.random(), indicators.amrpa, probabilities.amrpa));
    };
    if (probabilities.cshcn.filter((item) => item !== -1).length === probabilities.cshcn.length) {
      cshcnSims.push(find(Math.random(), indicators.cshcn, probabilities.cshcn));
    };
    if (probabilities.ecopb.filter((item) => item !== -1).length === probabilities.ecopb.length) {
      ecopbSims.push(find(Math.random(), indicators.ecopb, probabilities.ecopb));
    };
    if (probabilities.eqapk.filter((item) => item !== -1).length === probabilities.eqapk.length) {
      eqapkSims.push(find(Math.random(), indicators.eqapk, probabilities.eqapk));
    };
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
    if (probabilities.grsav.filter((item) => item !== -1).length === probabilities.grsav.length) {
      grsavSims.push(find(Math.random(), indicators.grsav, probabilities.grsav));
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
    if (probabilities.lscdn.filter((item) => item !== -1).length === probabilities.lscdn.length) {
      lscdnSims.push(find(Math.random(), indicators.lscdn, probabilities.lscdn));
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
    if (probabilities.samfs.filter((item) => item !== -1).length === probabilities.samfs.length) {
      samfsSims.push(find(Math.random(), indicators.samfs, probabilities.samfs));
    };
    if (probabilities.scwet.filter((item) => item !== -1).length === probabilities.scwet.length) {
      scwetSims.push(find(Math.random(), indicators.scwet, probabilities.scwet));
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
  
  // Need to filter the undefined values
  const average = array => array.filter(item => item !== undefined).length === 0 ? 0 : array.filter(item => item !== undefined).reduce((a, b) => a + b) / array.length;

  const averageScores = {
    aefih: average(aefihSims),
    amfih: average(amfihSims),
    amrpa: average(amrpaSims),
    cshcn: average(cshcnSims),
    ecopb: average(ecopbSims),
    eqapk: average(eqapkSims),
    estcc: average(estccSims),
    firef: average(firefSims),
    gmgfc: average(gmgfcSims),
    gppgr: average(gppgrSims),
    grntr: average(grntrSims),
    grsav: average(grsavSims),
    ihabc: average(ihabcSims),
    impas: average(impasSims),
    isegr: average(isegrSims),
    lscdn: average(lscdnSims),
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
    samfs: average(samfsSims),
    scwet: average(scwetSims),
    urbps: average(urbpsSims),
    wcofw: average(wcofwSims),
    wcopb: average(wcopbSims),
    wgcmd: average(wgcmdSims),
    futurePenalty: hex.futv2_me
  };

  return averageScores;
};

export function getStochasticActionScore(hex) {
  const indicators = {
    aefih: [0.25, 0.5, 1],
    amfih: [0.25, 0.5, 1],
    amrpa: [0, 1],
    cshcn: [0, 0.25, 0.5, 1],
    ecopb: [0.2, 0.4, 0.6, 0.8, 1],
    eqapk: [0.5, 0.75, 1],
    estcc: [0, 0.25, 0.5, 0.75, 1],
    firef: [0, 0.5, 1],
    gmgfc: [0, 1],
    gppgr: [0.2, 0.4, 0.6, 0.8, 1],
    grntr: [0, 0.25, 0.5, 0.75, 1],
    grsav: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
    ihabc: [0, 0.75, 1],
    impas: [0, 0.5, 0.75, 1],
    isegr: [0, 0.25, 0.5, 0.75, 1],
    lscdn: [0.1, 0.2, 0.4, 0.6, 0.8, 1],
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
    samfs: [0, 1],
    scwet: [0, 0.5, 1],
    urbps: [0, 0.25, 0.5, 0.75, 1],
    wcofw: [0, 0.2, 0.4, 0.6, 0.8, 1],
    wcopb: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    wgcmd: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    futv2: [0.25, 0.50, 0.75, 1.0]
  };

  const currentLevels = {
    aefih: indicators.aefih.indexOf(hex.aefih_mi),
    amfih: indicators.amfih.indexOf(hex.amfih_mi),
    amrpa: indicators.amrpa.indexOf(hex.amrpa_mi),
    cshcn: indicators.cshcn.indexOf(hex.cshcn_mi),
    ecopb: indicators.ecopb.indexOf(hex.ecopb_mi),
    eqapk: indicators.eqapk.indexOf(hex.eqapk_mi),
    estcc: indicators.estcc.indexOf(hex.estcc_mi),
    firef: indicators.firef.indexOf(hex.firef_mi),
    gmgfc: indicators.gmgfc.indexOf(hex.gmgfc_mi),
    gppgr: indicators.gppgr.indexOf(hex.gppgr_mi),
    grntr: indicators.grntr.indexOf(hex.grntr_mi),
    grsav: indicators.grsav.indexOf(hex.grsav_mi),
    ihabc: indicators.ihabc.indexOf(hex.ihabc_mi),
    impas: indicators.impas.indexOf(hex.impas_mi),
    isegr: indicators.isegr.indexOf(hex.isegr_mi),
    lscdn: indicators.lscdn.indexOf(hex.lscdn_mi),
    mavbp: indicators.mavbp.indexOf(hex.mavbp_mi),
    mavbr: indicators.mavbr.indexOf(hex.mavbr_mi),
    netcx: indicators.netcx.indexOf(hex.netcx_mi),
    nlcfp: indicators.nlcfp.indexOf(hex.nlcfp_mi),
    persu: indicators.persu.indexOf(hex.persu_mi),
    playa: indicators.playa.indexOf(hex.playa_mi),
    rescs: indicators.rescs.indexOf(hex.rescs_mi),
    rests: indicators.rests.indexOf(hex.rests_mi),
    safbb: indicators.safbb.indexOf(hex.safbb_mi),
    saffb: indicators.saffb.indexOf(hex.saffb_mi),
    saluh: indicators.saluh.indexOf(hex.saluh_mi),
    samfs: indicators.samfs.indexOf(hex.samfs_mi),
    scwet: indicators.scwet.indexOf(hex.scwet_mi),
    urbps: indicators.urbps.indexOf(hex.urbps_mi),
    wcofw: indicators.wcofw.indexOf(hex.wcofw_mi),
    wcopb: indicators.wcopb.indexOf(hex.wcopb_mi),
    wgcmd: indicators.wgcmd.indexOf(hex.wgcmd_mi)
  };

  let
  aefihSims = [],
  amfihSims = [],
  amrpaSims = [],
  cshcnSims = [],
  ecopbSims = [],
  eqapkSims = [],
  estccSims = [],
  firefSims = [],
  gmgfcSims = [],
  gppgrSims = [],
  grntrSims = [],
  grsavSims = [],
  ihabcSims = [],
  impasSims = [],
  isegrSims = [],
  lscdnSims = [],
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
  samfsSims = [],
  scwetSims = [],
  urbpsSims = [],
  wcofwSims = [],
  wcopbSims = [],
  wgcmdSims = [],
  futv2Sims = [];

  const randomSelect = (indicator) => {
    const slicedScoreArray = indicators[indicator].slice(currentLevels[indicator]);
    const randomScore = slicedScoreArray[Math.floor(Math.random()*slicedScoreArray.length)];
    return randomScore;
  };
  
  for (let i=0; i<1000; i++) {
    if (currentLevels.aefih !== -1) {
      aefihSims.push(randomSelect("aefih"));
    };
    if (currentLevels.amfih !== -1) {
      amfihSims.push(randomSelect("amfih"));
    };
    if (currentLevels.amrpa !== -1) {
      amrpaSims.push(randomSelect("amrpa"));
    };
    if (currentLevels.cshcn !== -1) {
      cshcnSims.push(randomSelect("cshcn"));
    };
    if (currentLevels.ecopb !== -1) {
      ecopbSims.push(randomSelect("ecopb"));
    };
    if (currentLevels.eqapk !== -1) {
      eqapkSims.push(randomSelect("eqapk"));
    };
    if (currentLevels.estcc !== -1) {
      estccSims.push(randomSelect("estcc"));
    };
    if (currentLevels.firef !== -1) {
      firefSims.push(randomSelect("firef"));
    };
    if (currentLevels.gmgfc !== -1) {
      gmgfcSims.push(randomSelect("gmgfc"));
    };
    if (currentLevels.gppgr !== -1) {
      gppgrSims.push(randomSelect("gppgr"));
    };
    if (currentLevels.grntr !== -1) {
      grntrSims.push(randomSelect("grntr"));
    };
    if (currentLevels.grsav !== -1) {
      grsavSims.push(randomSelect("grsav"));
    };
    if (currentLevels.ihabc !== -1) {
      ihabcSims.push(randomSelect("ihabc"));
    };
    if (currentLevels.impas !== -1) {
      impasSims.push(randomSelect("impas"));
    };
    if (currentLevels.isegr !== -1) {
      isegrSims.push(randomSelect("isegr"));
    };
    if (currentLevels.lscdn !== -1) {
      lscdnSims.push(randomSelect("lscdn"));
    };
    if (currentLevels.mavbp !== -1) {
      mavbpSims.push(randomSelect("mavbp"));
    };
    if (currentLevels.mavbr !== -1) {
      mavbrSims.push(randomSelect("mavbr"));
    };
    if (currentLevels.netcx !== -1) {
      netcxSims.push(randomSelect("netcx"));
    };
    if (currentLevels.nlcfp !== -1) {
      nlcfpSims.push(randomSelect("nlcfp"));
    };
    if (currentLevels.persu !== -1) {
      persuSims.push(randomSelect("persu"));
    };
    if (currentLevels.playa !== -1) {
      playaSims.push(randomSelect("playa"));
    };
    if (currentLevels.rescs !== -1) {
      rescsSims.push(randomSelect("rescs"));
    };
    if (currentLevels.rests !== -1) {
      restsSims.push(randomSelect("rests"));
    };
    if (currentLevels.safbb !== -1) {
      safbbSims.push(randomSelect("safbb"));
    };
    if (currentLevels.saffb !== -1) {
      saffbSims.push(randomSelect("saffb"));
    };
    if (currentLevels.saluh !== -1) {
      saluhSims.push(randomSelect("saluh"));
    };
    if (currentLevels.samfs !== -1) {
      samfsSims.push(randomSelect("samfs"));
    };
    if (currentLevels.scwet !== -1) {
      scwetSims.push(randomSelect("scwet"));
    };
    if (currentLevels.urbps !== -1) {
      urbpsSims.push(randomSelect("urbps"));
    };
    if (currentLevels.wcofw !== -1) {
      wcofwSims.push(randomSelect("wcofw"));
    };
    if (currentLevels.wcopb !== -1) {
      wcopbSims.push(randomSelect("wcopb"));
    };
    if (currentLevels.wgcmd !== -1) {
      wgcmdSims.push(randomSelect("wgcmd"));
    };
  };

  const average = array => array.length === 0 ? 0 : array.reduce((a, b) => a + b) / array.length;

  const averageScores = {
    aefih: average(aefihSims),
    amfih: average(amfihSims),
    amrpa: average(amrpaSims),
    cshcn: average(cshcnSims),
    ecopb: average(ecopbSims),
    eqapk: average(eqapkSims),
    estcc: average(estccSims),
    firef: average(firefSims),
    gmgfc: average(gmgfcSims),
    gppgr: average(gppgrSims),
    grntr: average(grntrSims),
    grsav: average(grsavSims),
    ihabc: average(ihabcSims),
    impas: average(impasSims),
    isegr: average(isegrSims),
    lscdn: average(lscdnSims),
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
    samfs: average(samfsSims),
    scwet: average(scwetSims),
    urbps: average(urbpsSims),
    wcofw: average(wcofwSims),
    wcopb: average(wcopbSims),
    wgcmd: average(wgcmdSims),
    futurePenalty: hex.futv2_me
  };

  return averageScores;
};

export function getHexagonScore(score) {
  const hList = ["aefih", "amfih", "amrpa", "cshcn", "ecopb", "estcc", "firef", "grsav", "impas", "lscdn", "mavbp", "mavbr", "nlcfp", "persu", "playa", "rescs", "rests", "safbb", "saffb", "samfs", "scwet", "wcofw", "wcopb", "wgcmd"];
  const fList = ["eqapk", "grntr", "saluh", "urbps"];
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
    aefih: score.aefih,
    amfih: score.amfih,
    amrpa: score.amrpa,
    cshcn: score.cshcn,
    ecopb: score.ecopb,
    eqapk: score.eqapk,
    estcc: score.estcc,
    firef: score.firef,
    gmgfc: score.gmgfc,
    gppgr: score.gppgr,
    grntr: score.grntr,
    grsav: score.grsav,
    ihabc: score.ihabc,
    impas: score.impas,
    isegr: score.isegr,
    lscdn: score.lscdn,
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
    samfs: score.samfs,
    scwet: score.scwet,
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
    aefih: getAverageScore(featureArray, "aefih"),
    amfih: getAverageScore(featureArray, "amfih"),
    amrpa: getAverageScore(featureArray, "amrpa"),
    cshcn: getAverageScore(featureArray, "cshcn"),
    ecopb: getAverageScore(featureArray, "ecopb"),
    eqapk: getAverageScore(featureArray, "eqapk"),
    estcc: getAverageScore(featureArray, "estcc"),
    firef: getAverageScore(featureArray, "firef"),
    gmgfc: getAverageScore(featureArray, "gmgfc"),
    gppgr: getAverageScore(featureArray, "gppgr"),
    grntr: getAverageScore(featureArray, "grntr"),
    grsav: getAverageScore(featureArray, "grsav"),
    ihabc: getAverageScore(featureArray, "ihabc"),
    impas: getAverageScore(featureArray, "impas"),
    isegr: getAverageScore(featureArray, "isegr"),
    lscdn: getAverageScore(featureArray, "lscdn"),
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
    samfs: getAverageScore(featureArray, "samfs"),
    scwet: getAverageScore(featureArray, "scwet"),
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
  const hList = ["aefih", "amfih", "amrpa", "cshcn", "ecopb", "estcc", "firef", "grsav", "impas", "lscdn", "mavbp", "mavbr", "nlcfp", "persu", "playa", "rescs", "rests", "safbb", "saffb", "samfs", "scwet", "wcofw", "wcopb", "wgcmd"];
  const fList = ["eqapk", "grntr", "saluh", "urbps"];
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
    aefih: score.aefih,
    amfih: score.amfih,
    amrpa: score.amrpa,
    cshcn: score.cshcn,
    ecopb: score.ecopb,
    eqapk: score.eqapk,
    estcc: score.estcc,
    firef: score.firef,
    gmgfc: score.gmgfc,
    gppgr: score.gppgr,
    grntr: score.grntr,
    grsav: score.grsav,
    ihabc: score.ihabc,
    impas: score.impas,
    isegr: score.isegr,
    lscdn: score.lscdn,
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
    samfs: score.samfs,
    scwet: score.scwet,
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
