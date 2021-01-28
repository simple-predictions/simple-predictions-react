import baseUrl from './globals';

const handleSubmit = (
  event,
  buttonEnabled,
  setButtonEnabled,
  username,
  password,
  dispatch,
  getUserInfo,
  setErrorCount,
  errorCount,
  setErrorMessage,
) => {
  event.preventDefault();
  if (buttonEnabled === false) {
    return;
  }
  setButtonEnabled(false);

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  };

  fetch(`${baseUrl}/login`, requestOptions).then((res) => {
    if (res.status === 200) {
      dispatch(getUserInfo());
    } else {
      setButtonEnabled(true);
      setErrorCount(errorCount + 1);
      setErrorMessage('Your username or password is incorrect. Please try again');
    }
  });
};

export default handleSubmit;
