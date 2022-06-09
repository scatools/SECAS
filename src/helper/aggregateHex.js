import area from "@turf/area";

/*
        hab1: Connectivity to Existing Protected Area -Max
        hab2: Connectivity of Natural Lands -Mean
        hab3: Threat of Urbanization -Max
        hab4: Composition of Priority Natural Lands -Mean
        wq1: 303(d): Impaired Watershed Area -Mean
        wq2: Hydrologic Response to Land-Use Change -Max
        wq3: Percent Irrigated Agriculture -Mean
        wq4: Lateral Connectivity to Floodplain -Mean
        wq5: Composition of Riparian Zone Lands -Mean
        wq6: Presence of Impoundments -Max
        lcmr1: Vulnerable Areas of Terrestrial Endemic Species -Max
        lcmr2: Threatened and Endangered Species - Critical Habitat Area -Mean
        lcmr3: Threatened and Endangered Species - Number of Species -Max
        lcmr4: Light Pollution Index -Max
        lcmr5: Terrestrial Vertebrate Biodiversity -Max
        lcmr6: Vulnerability to Invasive Plants -Mean
        cl1: National Register of Historic Places -Max
        cl2: National Heritage Area -Mean
        cl3: Proximity to Socially Vulnerable Communities -Max
        cl4: Community Threat Index -Max
        cl5: Social Vulnerability Index -Mean
        eco1: High Priority Working Lands -Mean
        eco2: Commercial Fishing Reliance -Max
        eco3: Recreational Fishing Engagement -Max
        eco4: Access & Recreation: Number of Access Points -Max
*/

export function calculateArea(input){
  let totalArea = 0;
  if(input.length>0){
    totalArea= input.reduce((a,b)=>{return a+area(b)},0)/1000000
  }
  return totalArea;
}

export function normalization(input){
  let scoreH1 = Math.round(parseFloat(input.site))==0?0:(
                  Math.round(parseFloat(input.site))==1?0.5:(
                    Math.round(parseFloat(input.site))==2?0.75:1
                  )
                );
  let scoreH2 = Math.round(parseFloat(input.species))==0?0:(
                  Math.round(parseFloat(input.species))==1?0.33:(
                    Math.round(parseFloat(input.species))==2?0.66:1
                  )
                );
  let scoreH3 = Math.round(parseFloat(input.fire))==0?0:(
                  Math.round(parseFloat(input.fire))<=3?0.33:(
                    Math.round(parseFloat(input.fire))<=6?0.66:1
                  )
                );
  let scoreH4 = Math.round(parseFloat(input.protected))==0?0:(
                  Math.round(parseFloat(input.protected))==3?0.5:1
                );
  let scoreF1 = parseFloat(input.carbon)<=1?0:(
                  parseFloat(input.carbon)<=5?0.33:(
                    parseFloat(input.carbon)<=10?0.66:1
                  )
                );
  let scoreF2 = parseFloat(input.forest)==0?0:(
                  parseFloat(input.forest)<=0.25?0.25:(
                    parseFloat(input.forest)<=0.5?0.5:(
                      parseFloat(input.forest)<=0.75?0.75:1
                    )
                  )
                );
  let scoreC1 = Math.round(parseFloat(input.landscape))==0?0:(
                  Math.round(parseFloat(input.landscape))==1?0.25:(
                    Math.round(parseFloat(input.landscape))==2?0.5:(
                      Math.round(parseFloat(input.landscape))==3?0.75:1
                    )
                  )
                );
  let scoreC2 = parseFloat(input.resilience)==0?0:(
                  parseFloat(input.resilience)<=0.25?0.25:(
                    parseFloat(input.resilience)<=0.5?0.5:(
                      parseFloat(input.resilience)<=0.75?0.75:1
                    )
                  )
                );
  let normalizationResult = {
    scoreH1: scoreH1,
    scoreH2: scoreH2,
    scoreH3: scoreH3,
    scoreH4: scoreH4,
    scoreF1: scoreF1,
    scoreF2: scoreF2,
    scoreC1: scoreC1,
    scoreC2: scoreC2
  };

  return normalizationResult;
}

export function calculateScore(aoiList){
  const hexScoreList = aoiList[0].hexagons.map((hex) => {
    let scoreList = normalization(hex);
    return scoreList;
  });
  
  let aoiScore = hexScoreList.reduce((a, b) => {
    return {
      scoreH1: a.scoreH1 + b.scoreH1,
      scoreH2: a.scoreH2 + b.scoreH2,
      scoreH3: a.scoreH3 + b.scoreH3,
      scoreH4: a.scoreH4 + b.scoreH4,
      scoreF1: a.scoreF1 + b.scoreF1,
      scoreF2: a.scoreF2 + b.scoreF2,
      scoreC1: a.scoreC1 + b.scoreC1,
      scoreC2: a.scoreC2 + b.scoreC2,
    }
  }, {
    scoreH1: 0,
    scoreH2: 0,
    scoreH3: 0,
    scoreH4: 0,
    scoreF1: 0,
    scoreF2: 0,
    scoreC1: 0,
    scoreC2: 0,
  });

  aoiScore.scoreH1 = Math.round(100*aoiScore.scoreH1/hexScoreList.length)/100;
  aoiScore.scoreH2 = Math.round(100*aoiScore.scoreH2/hexScoreList.length)/100;
  aoiScore.scoreH3 = Math.round(100*aoiScore.scoreH3/hexScoreList.length)/100;
  aoiScore.scoreH4 = Math.round(100*aoiScore.scoreH4/hexScoreList.length)/100;
  aoiScore.scoreF1 = Math.round(100*aoiScore.scoreF1/hexScoreList.length)/100;
  aoiScore.scoreF2 = Math.round(100*aoiScore.scoreF2/hexScoreList.length)/100;
  aoiScore.scoreC1 = Math.round(100*aoiScore.scoreC1/hexScoreList.length)/100;
  aoiScore.scoreC2 = Math.round(100*aoiScore.scoreC2/hexScoreList.length)/100;

  return aoiScore;
}

export function aggregate(input,area) {
    // console.log(input);
    const hexNumber = input.length===0? 1: input.length;
    let aggregatedResult = input.reduce((a,b)=>{return {
        hab1: parseFloat(a.hab1)>=parseFloat(b.hab1)?parseFloat(a.hab1):parseFloat(b.hab1),
        hab2: parseFloat(a.hab2)+parseFloat(b.hab2),
        hab3: parseFloat(a.hab3)>=parseFloat(b.hab3)?parseFloat(a.hab3):parseFloat(b.hab3),
        hab4: parseFloat(a.hab4)+parseFloat(b.hab4),
        wq1: parseFloat(a.wq1)+parseFloat(b.wq1),
        wq2: parseFloat(a.wq2)>=parseFloat(b.wq2)?parseFloat(a.wq2):parseFloat(b.wq2),
        wq3: parseFloat(a.wq3)+parseFloat(b.wq3),
        wq4: parseFloat(a.wq4)+parseFloat(b.wq4),
        wq5: parseFloat(a.wq5)+parseFloat(b.wq5),
        wq6: parseFloat(a.wq6)>=parseFloat(b.wq6)?parseFloat(a.wq6):parseFloat(b.wq6),
        lcmr1: parseFloat(a.lcmr1)>=parseFloat(b.lcmr1)?parseFloat(a.lcmr1):parseFloat(b.lcmr1),
        lcmr2: parseFloat(a.lcmr2)+parseFloat(b.lcmr2),
        lcmr3: parseFloat(a.lcmr3)>=parseFloat(b.lcmr3)?parseFloat(a.lcmr3):parseFloat(b.lcmr3),
        lcmr4: parseFloat(a.lcmr4)>=parseFloat(b.lcmr4)?parseFloat(b.lcmr4):parseFloat(a.lcmr4),
        lcmr5: parseFloat(a.lcmr5)>=parseFloat(b.lcmr5)?parseFloat(a.lcmr5):parseFloat(b.lcmr5),
        lcmr6: parseFloat(a.lcmr6)>=parseFloat(b.lcmr6)?parseFloat(a.lcmr6):parseFloat(b.lcmr6),
        cl1: parseFloat(a.cl1)>=parseFloat(b.cl1)?parseFloat(a.cl1):parseFloat(b.cl1),
        cl2: parseFloat(a.cl2)+parseFloat(b.cl2),
        cl3: parseFloat(a.cl3)>=parseFloat(b.cl3)?parseFloat(a.cl3):parseFloat(b.cl3),
        cl4: parseFloat(a.cl4)>=parseFloat(b.cl4)?parseFloat(a.cl4):parseFloat(b.cl4),
        cl5: parseFloat(a.cl5)>=parseFloat(b.cl5)?parseFloat(a.cl5):parseFloat(b.cl5),
        eco1: parseFloat(a.eco1)+parseFloat(b.eco1),
        eco2: parseFloat(a.eco2)>=parseFloat(b.eco2)?parseFloat(a.eco2):parseFloat(b.eco2),
        eco3: parseFloat(a.eco3)>=parseFloat(b.eco3)?parseFloat(a.eco3):parseFloat(b.eco3),
        eco4: parseFloat(a.eco4)>=parseFloat(b.eco4)?parseFloat(a.eco4):parseFloat(b.eco4),
      }},
      {
        hab1:0,hab2:0,hab3:0,hab4:0,
        wq1:0,wq2:0,wq3:0,wq4:0,wq5:0,wq6:0,
        lcmr1:0,lcmr2:0,lcmr3:0,lcmr4:1,lcmr5:0,lcmr6:0,
        cl1:0,cl2:0,cl3:0,cl4:0,cl5:0,
        eco1:0,eco2:0,eco3:0,eco4:0
    })
    
    aggregatedResult.hab0 = area;
    aggregatedResult.hab2 = aggregatedResult.hab2/hexNumber;
    aggregatedResult.hab3 = 1-aggregatedResult.hab3;
    aggregatedResult.hab4 = aggregatedResult.hab4/hexNumber;
    aggregatedResult.wq1 = aggregatedResult.wq1/hexNumber;
    aggregatedResult.wq3 = aggregatedResult.wq3/hexNumber;
    aggregatedResult.wq4 = aggregatedResult.wq4/hexNumber;
    aggregatedResult.wq5 = aggregatedResult.wq5/hexNumber;
    aggregatedResult.lcmr2 = aggregatedResult.lcmr2/hexNumber;
    aggregatedResult.cl2 = aggregatedResult.cl2/hexNumber;
    aggregatedResult.eco1 = aggregatedResult.eco1/hexNumber;

    return aggregatedResult;
}

export function getStatus(input){
  // NEED TO DOUBLE CHECK
  let scaledResult = {
    hab0: Math.round((input.hab0*247.105)*100)/100 + " acres",
    hab1: input.hab1===1? "Yes" : "No",
    hab2: String((Math.round((input.hab2*10000))/100)) + "%",
    hab3: input.hab3>0.67? "Low" : input.hab3>0.33 ? "Medium": input.hab3>0 ? "High" : "No Threat",
    hab4: String(Math.round((input.hab4*10000))/100) + "%",
    wq1: String(Math.round((input.wq1*10000))/100) + "%",
    wq2: String(Math.round((input.wq2*10000))/100) + "%",
    wq3: String(Math.round((input.wq3*10000))/100) + "%",
    wq4: String(Math.round((input.wq4*10000))/100) + "%",
    wq5: Math.round((input.wq5*100))/100,
    wq6: input.wq6===1? "Yes" : "No",
    lcmr1: input.lcmr1 > 6 ? "High": input.lcmr1 > 3 ? "Medium" : input.lcmr1 > 0 ? "Low" : "NA",
    lcmr2: String(Math.round((input.lcmr2*10000))/100) + "%",
    lcmr3: Math.round(input.lcmr3),
    lcmr4: input.lcmr4 > 0.66 ? "High": input.lcmr4 > 0.33 ? "Medium" : input.lcmr4 > 0 ? "Low" : "No Light Pollution",
    lcmr5: Math.round((input.lcmr5*100))/100,
    lcmr6: Math.round((input.lcmr6*100))/100,
    cl1: Math.round(input.cl1),
    cl2: String(Math.round((input.cl2*10000))/100) + "%",
    cl3: input.cl3 >= 1 ? "High": input.cl3 >= 0.75 ? "Medium-High" : input.cl3 >= 0.5 ? "Medium" : input.cl3 >= 0.25 ? "Medium-Low" : input.cl3 > 0 ? "Low" : "No Threat",
    cl4: input.cl4 >= 1 ? "High": input.cl4 >= 0.75 ? "Medium-High" : input.cl4 >= 0.5 ? "Medium" : input.cl4 >= 0.25 ? "Medium-Low" : input.cl4 > 0 ? "Low" : "Insufficient data",
    cl5: input.cl5 == 1 ? "High": input.cl5 == 0.75 ? "Medium-High" : input.cl5 == 0.5 ? "Medium" : input.cl5 == 0.25 ? "Low" : "Insufficient data",
    eco1: String(Math.round((input.eco1*10000))/100) + "%",
    eco2: input.eco2 > 3 ? "High": input.eco2 > 2 ? "Medium-High" : input.eco2 > 1 ? "Medium" : input.eco2 > 0 ? "Low" : "Insufficient data",
    eco3: input.eco3 > 3 ? "High": input.eco3 > 2 ? "Medium-High" : input.eco3 > 1 ? "Medium" : input.eco3 > 0 ? "Low" : "Insufficient data",
    eco4: Math.round(input.eco4)
  }
  return scaledResult;
}

export function getScaledForAssessment(input,id,name){
  // NEED TO DOUBLE CHECK
  let scaledResult = {
    id,
    name,
    hab0: input.hab0===0? 0: input.hab0<=0.4? 0.3: input.hab0<=0.8? 0.75: input.hab0<=2? 0.9 : 1,
    hab1: input.hab1,
    hab2: Math.round((input.hab2*100))/100,
    hab3: input.hab3,
    hab4: Math.round((input.hab4*100))/100,
    wq1: Math.round((input.wq1*100))/100,
    wq2: input.wq2,
    wq3: input.wq3,
    wq4: input.wq4,
    wq5: input.wq5,
    wq6: input.wq6,
    lcmr1: input.lcmr1/10,
    lcmr2: input.lcmr2<=0.01? 0 : input.lcmr2<=.2 ? 0.75 : input.lcmr2<=.6 ? 0.9 : 1,
    lcmr3: input.lcmr3===0? 0 : input.lcmr3<=1 ? 0.9 : input.lcmr3<=2 ? 0.95 : 1,
    lcmr4: input.lcmr4,
    lcmr5: input.lcmr5,
    lcmr6: input.lcmr6,
    cl1: input.cl1 ===0 ? 0: input.cl1 <= 1? 0.75 : input.cl1<= 2 ? 0.9 : 1,
    cl2: Math.round((input.cl2*100))/100,
    cl3: input.cl3,
    cl4: input.cl4,
    cl5: input.cl5,
    eco1: Math.round((input.eco1*100))/100,
    eco2: input.eco2/4,
    eco3: input.eco3/4,
    eco4: input.eco4===0 ? 0: input.eco4<=5? 0.25 : input.eco4<=10 ? 0.75 : input.eco4<=15 ? 0.9 : 1
  }
  return scaledResult;
}

export function mergeIntoArray(input){
  let result = {
    id:[],
    name:[],
    hab0: [],
    hab1: [],
    hab2: [],
    hab3:[],
    hab4: [],
    wq1: [],
    wq2: [],
    wq3: [],
    wq4: [],
    wq5: [],
    wq6: [],
    lcmr1: [],
    lcmr2: [],
    lcmr3: [],
    lcmr4: [],
    lcmr5: [],
    lcmr6: [],
    cl1: [],
    cl2: [],
    cl3: [],
    cl4: [],
    cl5: [],
    eco1: [],
    eco2: [],
    eco3: [],
    eco4: []
  }
  input.forEach(aoi=>{
    Object.entries(aoi).forEach(measure=>{result[measure[0]].push(measure[1])})
  })
  return result;
}

export function calculateMeasures(input,weights){
  const weightsList = {
    "low":0.34,
    "medium":0.67,
    "high":1
  }
  return input.map(aoi=>{
    let result = [];
    if(!weights.hab.selected || weights.hab.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.hab.selected.forEach(item=>
        { 
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.hab.selected.length
      result.push(goalScore);
    }
    if(!weights.wq.selected || weights.wq.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.wq.selected.forEach(item=>
        {
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.wq.selected.length
      result.push(goalScore);
    }
    if(!weights.lcmr.selected ||weights.lcmr.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.lcmr.selected.forEach(item=>
        {
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.lcmr.selected.length
      result.push(goalScore);
    }
    if(!weights.cl.selected ||weights.cl.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.cl.selected.forEach(item=>
        {
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.cl.selected.length
      result.push(goalScore);
    }
    if(!weights.eco.selected || weights.eco.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.eco.selected.forEach(item=>
        {
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.eco.selected.length
      result.push(goalScore);
    }
    return result;
  })
}