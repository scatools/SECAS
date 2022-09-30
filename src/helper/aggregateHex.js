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
}

export function normalization(input) {
  let scoreH1 =
    Math.round(parseFloat(input.site)) == 0
      ? 0
      : Math.round(parseFloat(input.site)) == 1
      ? 0.5
      : Math.round(parseFloat(input.site)) == 2
      ? 0.75
      : 1;
  let scoreH2 =
    Math.round(parseFloat(input.species)) == 0
      ? 0
      : Math.round(parseFloat(input.species)) == 1
      ? 0.33
      : Math.round(parseFloat(input.species)) == 2
      ? 0.66
      : 1;
  let scoreH3 =
    Math.round(parseFloat(input.fire)) == 0
      ? 0
      : Math.round(parseFloat(input.fire)) <= 3
      ? 0.33
      : Math.round(parseFloat(input.fire)) <= 6
      ? 0.66
      : 1;
  let scoreH4 =
    Math.round(parseFloat(input.protected)) == 0
      ? 0
      : Math.round(parseFloat(input.protected)) == 3
      ? 0.5
      : 1;
  let scoreF1 =
    parseFloat(input.carbon) <= 1
      ? 0
      : parseFloat(input.carbon) <= 5
      ? 0.33
      : parseFloat(input.carbon) <= 10
      ? 0.66
      : 1;
  let scoreF2 =
    parseFloat(input.forest) == 0
      ? 0
      : parseFloat(input.forest) <= 0.25
      ? 0.25
      : parseFloat(input.forest) <= 0.5
      ? 0.5
      : parseFloat(input.forest) <= 0.75
      ? 0.75
      : 1;
  let scoreC1 =
    Math.round(parseFloat(input.landscape)) == 0
      ? 0
      : Math.round(parseFloat(input.landscape)) == 1
      ? 0.25
      : Math.round(parseFloat(input.landscape)) == 2
      ? 0.5
      : Math.round(parseFloat(input.landscape)) == 3
      ? 0.75
      : 1;
  let scoreC2 =
    parseFloat(input.resilience) == 0
      ? 0
      : parseFloat(input.resilience) <= 0.25
      ? 0.25
      : parseFloat(input.resilience) <= 0.5
      ? 0.5
      : parseFloat(input.resilience) <= 0.75
      ? 0.75
      : 1;
  let normalizationResult = {
    scoreH1: scoreH1,
    scoreH2: scoreH2,
    scoreH3: scoreH3,
    scoreH4: scoreH4,
    scoreF1: scoreF1,
    scoreF2: scoreF2,
    scoreC1: scoreC1,
    scoreC2: scoreC2,
  };

  return normalizationResult;
}

export function getRawValue(aoiList, timeFrame = "currentHexagons") {
  const rawValueList = aoiList[0][timeFrame].map((hex) => {
    return {
      valueH1: parseFloat(hex.site),
      valueH2: parseFloat(hex.species),
      valueH3: parseFloat(hex.fire),
      valueH4: parseFloat(hex.protected),
      valueF1: parseFloat(hex.carbon),
      valueF2: parseFloat(hex.forest),
      valueC1: parseFloat(hex.landscape),
      valueC2: parseFloat(hex.resilience),
    };
  });

  let rawValue = rawValueList.reduce(
    (a, b) => {
      return {
        valueH1: a.valueH1 + b.valueH1,
        valueH2: a.valueH2 + b.valueH2,
        valueH3: a.valueH3 + b.valueH3,
        valueH4: a.valueH4 + b.valueH4,
        valueF1: a.valueF1 + b.valueF1,
        valueF2: a.valueF2 + b.valueF2,
        valueC1: a.valueC1 + b.valueC1,
        valueC2: a.valueC2 + b.valueC2,
      };
    },
    {
      valueH1: 0,
      valueH2: 0,
      valueH3: 0,
      valueH4: 0,
      valueF1: 0,
      valueF2: 0,
      valueC1: 0,
      valueC2: 0,
    }
  );

  rawValue.valueH1 = Math.round(rawValue.valueH1 / rawValueList.length);
  rawValue.valueH2 = Math.round(rawValue.valueH2 / rawValueList.length);
  rawValue.valueH3 = Math.round(rawValue.valueH3 / rawValueList.length);
  rawValue.valueH4 = Math.round(rawValue.valueH4 / rawValueList.length);
  rawValue.valueF1 =
    Math.round((100 * rawValue.valueF1) / rawValueList.length) / 100;
  rawValue.valueF2 =
    Math.round((100 * rawValue.valueF2) / rawValueList.length) / 100;
  rawValue.valueC1 = Math.round(rawValue.valueC1 / rawValueList.length);
  rawValue.valueC2 =
    Math.round((100 * rawValue.valueC2) / rawValueList.length) / 100;

  return rawValue;
}

export function calculateScore(aoiList, timeFrame = "currentHexagons") {
  const hexScoreList = aoiList[0][timeFrame].map((hex) => {
    let scoreList = normalization(hex);
    return scoreList;
  });

  let aoiScore = hexScoreList.reduce(
    (a, b) => {
      return {
        scoreH1: a.scoreH1 + b.scoreH1,
        scoreH2: a.scoreH2 + b.scoreH2,
        scoreH3: a.scoreH3 + b.scoreH3,
        scoreH4: a.scoreH4 + b.scoreH4,
        scoreF1: a.scoreF1 + b.scoreF1,
        scoreF2: a.scoreF2 + b.scoreF2,
        scoreC1: a.scoreC1 + b.scoreC1,
        scoreC2: a.scoreC2 + b.scoreC2,
      };
    },
    {
      scoreH1: 0,
      scoreH2: 0,
      scoreH3: 0,
      scoreH4: 0,
      scoreF1: 0,
      scoreF2: 0,
      scoreC1: 0,
      scoreC2: 0,
    }
  );

  aoiScore.scoreH1 =
    Math.round((100 * aoiScore.scoreH1) / hexScoreList.length) / 100;
  aoiScore.scoreH2 =
    Math.round((100 * aoiScore.scoreH2) / hexScoreList.length) / 100;
  aoiScore.scoreH3 =
    Math.round((100 * aoiScore.scoreH3) / hexScoreList.length) / 100;
  aoiScore.scoreH4 =
    Math.round((100 * aoiScore.scoreH4) / hexScoreList.length) / 100;
  aoiScore.scoreF1 =
    Math.round((100 * aoiScore.scoreF1) / hexScoreList.length) / 100;
  aoiScore.scoreF2 =
    Math.round((100 * aoiScore.scoreF2) / hexScoreList.length) / 100;
  aoiScore.scoreC1 =
    Math.round((100 * aoiScore.scoreC1) / hexScoreList.length) / 100;
  aoiScore.scoreC2 =
    Math.round((100 * aoiScore.scoreC2) / hexScoreList.length) / 100;

  return aoiScore;
}

export function calculateRestore(currentScore) {
  return {
    scoreH1: 1,
    scoreH2: 1,
    scoreH3: 1,
    scoreH4: 1,
    scoreF1: 1,
    scoreF2: 1,
    scoreC1: 1,
    scoreC2: 1,
  };
}

export function calculateProtect(currentScore) {
  return {
    scoreH1: 0.5,
    scoreH2: 0.5,
    scoreH3: 0.5,
    scoreH4: 0.5,
    scoreF1: 0.5,
    scoreF2: 0.5,
    scoreC1: 0.5,
    scoreC2: 0.5,
  };
}

export function calculateMaintain(currentScore) {
  return currentScore;
}

export function calculateActionScore(aoi, restore, protect, maintain) {
  return {
    scoreH1: 0.5,
    scoreH2: 0.5,
    scoreH3: 0.5,
    scoreH4: 0.5,
    scoreF1: 0.5,
    scoreF2: 0.5,
    scoreC1: 0.5,
    scoreC2: 0.5,
  };
}
