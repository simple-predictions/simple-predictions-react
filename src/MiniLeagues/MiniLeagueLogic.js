import baseUrl from '../globals';

const createMiniLeague = (
  e,
  createMiniLeagueEnabled,
  setCreateMiniLeagueEnabled,
  setResponseStatus,
  setResponseMessage,
) => {
  e.preventDefault();
  if (createMiniLeagueEnabled === false) {
    return;
  }
  setCreateMiniLeagueEnabled(false);
  const formData = new FormData(e.target);
  const minileagueName = formData.get('minileague-name');

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ league_name: minileagueName }),
    credentials: 'include',
  };

  fetch(`${baseUrl}/createminileague`, requestOptions).then((res) => {
    setResponseStatus(res.status);
    return res.json();
  }).then((data) => {
    setResponseMessage(data);
    setCreateMiniLeagueEnabled(true);
  });
};

const joinMiniLeague = (
  e,
  joinMiniLeagueEnabled,
  setJoinMiniLeagueEnabled,
  setResponseStatus,
  setResponseMessage,
) => {
  e.preventDefault();
  if (joinMiniLeagueEnabled === false) {
    return;
  }
  setJoinMiniLeagueEnabled(false);
  const formData = new FormData(e.target);
  const minileagueName = formData.get('minileague-name');

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ league_name: minileagueName }),
    credentials: 'include',
  };

  fetch(`${baseUrl}/joinminileague`, requestOptions).then((res) => {
    setResponseStatus(res.status);
    return res.json();
  }).then((data) => {
    setResponseMessage(data);
    setJoinMiniLeagueEnabled(true);
  });
};

export { createMiniLeague, joinMiniLeague };
