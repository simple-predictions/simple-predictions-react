import publicIp from 'public-ip';
import baseUrl from '../globals';

const handleSubmit = async (
  e,
  buttonEnabled,
  setButtonEnabled,
  summary,
  description,
  username,
  email,
  ipAddress,
  setSummary,
  setDescription,
  updateAlert,
  closePopup,
  dispatch
) => {
  e.preventDefault();
  if (buttonEnabled === false) {
    return;
  }
  setButtonEnabled(false);
  const data = new FormData(e.target);
  const issuetype = data.get('issuetype');

  const reqBody = {
    fields: {
      project: {
        key: 'MAIN',
      },
      parent: {
        key: 'MAIN-2',
      },
      summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                text: description,
                type: 'text',
              },
            ],
          },
        ],
      },
      customfield_10031: username,
      customfield_10033: email,
      customfield_10029: window.location.pathname,
      customfield_10036: ipAddress,
      issuetype: {
        name: issuetype,
      },
    },
  };

  if (issuetype === 'Bug') {
    // Include some extra debugging info
    reqBody.fields.customfield_10032 = window.navigator.userAgent;
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqBody),
    credentials: 'include',
  };

  fetch(`${baseUrl}/create-jira-issue`, requestOptions).then(() => {
    setButtonEnabled(true);
    setSummary('');
    setDescription('');
  });
  dispatch(updateAlert({ message: 'Your feedback has been recorded. Thank you!' }));
  dispatch(closePopup());
};

const setIP = async (setipAddress) => {
  const ip = await publicIp.v4();
  setipAddress(ip);
};

export { handleSubmit, setIP };
