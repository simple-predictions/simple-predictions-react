import baseUrl from '../globals';

const handleSubmit = (e, setSubmitEnabled, setSuccessMessage, successCount, setSuccessCount) => {
  e.preventDefault();
  setSubmitEnabled(false);

  const data = new FormData(e.target);

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
      predsData[predIndex].home_pred = predNum;
    }
    if (predType === 'away-pred') {
      predsData[predIndex].away_pred = predNum;
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

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ predictions: predsData }),
    credentials: 'include',
  };

  fetch(`${baseUrl}/updatemanypredictions`, requestOptions).then((res) => {
    if (res.status === 200) {
      setSuccessMessage('Your predictions have been updated');
      setSuccessCount(successCount + 1);
    }
    setSubmitEnabled(true);
  });
};

export default handleSubmit;
