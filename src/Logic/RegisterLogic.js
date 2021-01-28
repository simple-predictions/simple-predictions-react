import baseUrl from '../globals';

const handleSubmit = (
  e,
  buttonEnabled,
  setButtonEnabled,
  username,
  password,
  email,
  setErrorCount,
  errorCount,
  setErrorMessage,
) => {
  e.preventDefault();
  if (buttonEnabled === false) {
    return;
  }
  setButtonEnabled(false);

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
    credentials: 'include',
  };

  fetch(`${baseUrl}/register`, requestOptions).then((res) => {
    if (res.status === 200) {
      window.location.href = '/';
    }
    return res;
  }).then((res) => res.json()).then((data) => {
    setErrorCount(errorCount + 1);
    setErrorMessage(data.message);
    setButtonEnabled(true);
  });
};

export default handleSubmit;
