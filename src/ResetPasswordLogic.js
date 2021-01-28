import baseUrl from './globals';
import { updateAlert } from './Alerts/alertsSlice';

const handleSubmit = (e, buttonEnabled, setButtonEnabled, dispatch, setRedirect) => {
  e.preventDefault();
  if (buttonEnabled === false) {
    return;
  }
  setButtonEnabled(false);
  const formData = new FormData(e.target);
  const username = formData.get('username');

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
    credentials: 'include',
  };

  fetch(`${baseUrl}/resetpassword`, requestOptions).then(async (res) => {
    if (res.status === 200) {
      dispatch(updateAlert({ message: 'Please check your email for a link.', variant: 'success' }));
      setRedirect('/');
    } else {
      setButtonEnabled(true);
      const data = await res.json();
      dispatch(updateAlert({ message: data, variant: 'danger' }));
    }
  });
};

export default handleSubmit;
