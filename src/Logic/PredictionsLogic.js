import { gql } from '@apollo/client';

const handleSubmit = (e, submitPredictions) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const MUTATION_ARR = [];
  const predsData = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of data.entries()) {
    const predType = key.split('[')[1].split(']')[0];
    let predNum = value;
    const gameID = key.split('[')[0];

    const exists = predsData.some((pred) => pred.game_id === gameID);
    if (!exists) {
      predsData.push({ game_id: gameID });
    }

    const predIndex = predsData.findIndex((pred) => pred.game_id === gameID);
    if (predType === 'home-pred') {
      predsData[predIndex].home_pred = parseInt(predNum, 10);
    }
    if (predType === 'away-pred') {
      predsData[predIndex].away_pred = parseInt(predNum, 10);
    }
    if (predType === 'banker') {
      if (predNum === 'true') {
        predNum = true;
      } else {
        predNum = false;
      }
      predsData[predIndex].banker = predNum;
    }
    if (predType === 'insurance') {
      if (predNum === 'true') {
        predNum = true;
      } else {
        predNum = false;
      }
      predsData[predIndex].insurance = predNum;
    }
  }
  for (let i = 0; i < predsData.length; i += 1) {
    const pred = predsData[i];
    const MUTATION = `
      pred${i}: updatePrediction(
        matchID: "${pred.game_id}",
        ${!Number.isNaN(pred.home_pred) ? `home_pred: ${pred.home_pred},` : ''}
        ${!Number.isNaN(pred.away_pred) ? `away_pred: ${pred.away_pred},` : ''}
        banker: ${pred.banker},
        insurance: ${pred.insurance}
      ) {
        _id
        home_pred
        away_pred
        banker
        insurance
      }
    `;

    MUTATION_ARR.push(MUTATION);
  }

  if (MUTATION_ARR.length > 0) {
    const BATCHED_MUTATION = `
      mutation {
        ${MUTATION_ARR.reduce((item, frag) => item + frag)}
      }
    `;
    submitPredictions({ mutation: gql`${BATCHED_MUTATION}` });
  }
};

export default handleSubmit;
