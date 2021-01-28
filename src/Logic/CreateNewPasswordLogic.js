import baseUrl from '../globals';
import { updateAlert } from '../Alerts/alertsSlice';

const handleSubmit = (e, buttonEnabled, setButtonEnabled, location, setRedirect, dispatch) => {
  e.preventDefault();
  if (buttonEnabled === false) {
    return;
  }
  setButtonEnabled(false);

  const formData = new FormData(e.target);
  const password = formData.get('password');
  const params = new URLSearchParams(location.search);
  const verificationToken = params.get('verification_token');
  const username = params.get('username');

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, verification_token: verificationToken, password }),
    credentials: 'include',
  };

  fetch(`${baseUrl}/createnewpassword`, requestOptions).then(async (res) => {
    if (res.status === 200) {
      setRedirect('/');
      dispatch(updateAlert({ message: 'Your password has been updated. Please login below.', variant: 'success' }));
    } else {
      setButtonEnabled(true);
      const data = await res.json();
      dispatch(updateAlert({ message: data, variant: 'danger' }));
    }
  });
};

export default handleSubmit;
