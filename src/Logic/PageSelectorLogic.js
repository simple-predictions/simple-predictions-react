import baseUrl from '../globals';

const handleSubmit = (
  e,
  addFriendEnabled,
  setAddFriendEnabled,
  setResponseStatus,
  setResponseMessage,
) => {
  e.preventDefault();
  if (addFriendEnabled === false) {
    return;
  }
  setAddFriendEnabled(false);
  const data = new FormData(e.target);
  const friendUsername = data.get('friend-username');

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: friendUsername }),
    credentials: 'include',
  };

  fetch(`${baseUrl}/addfriend`, requestOptions).then((res) => {
    setResponseStatus(res.status);
    return res.json();
  }).then((res) => {
    setResponseMessage(res);
    setAddFriendEnabled(true);
  });
};

export default handleSubmit;
