import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import './PageSelector.css';
import { Link } from 'react-router-dom';
import { Form, InputGroup, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectUserUsername } from './User/userSlice';

const PageSelector = () => {
  const username = useSelector(selectUserUsername);
  const [responseMessage, setResponseMessage] = useState();
  const [responseStatus, setResponseStatus] = useState();

  const addFriendMutation = gql`
    mutation($friendUsername: String!) {
      addFriend(friendUsername: $friendUsername) {
        username
      }
    }
  `;

  const [addFriend, { loading: addFriendLoading }] = useMutation(addFriendMutation, {
    onError: (error) => {
      setResponseMessage(error.message);
      setResponseStatus(400);
    },
    onCompleted: () => {
      setResponseMessage('Success');
      setResponseStatus(200);
    },
  });

  return (
    <div className="m-0 row selector">
      <div className="col-lg-4 left-col">
        <div className="left-col-container">
          <h1 className="left-col-text">{`Hi ${username}`}</h1>
          <h4 className="left-col-follow-text">Follow someone</h4>
          <Form
            style={{ marginBottom: 10 }}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const friendUsername = formData.get('friend-username');
              addFriend({ variables: { friendUsername } });
            }}
          >
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>@</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control disabled={addFriendLoading} placeholder="Username" type="text" name="friend-username" />
            </InputGroup>
          </Form>
          {responseMessage && <Alert variant={responseStatus >= 400 ? 'danger' : 'success'}>{responseMessage}</Alert>}
        </div>
      </div>
      <div className="col-lg-8 selector-col">
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-2 selector-image-container">
            <span className="option-circle" />
            <Link to="/predictions" className="option-icon">
              <img alt="question mark icon" className="option-icon" height={50} src="/icons/question-mark.png" />
            </Link>
          </div>
          <div className="col-md-6">
            <div className="selector-option-container">
              <h4 className="option-title text-md-left text-center"><Link to="/predictions" className="option-title-link">Predictions</Link></h4>
              <h4 className="option-description text-md-left text-center">Predict the results of the Premier League games</h4>
            </div>
          </div>
          <div className="col-md-2 last-col" />
        </div>
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-2 selector-image-container">
            <span className="option-circle" />
            <Link to="/minileagues" className="option-icon">
              <img alt="trophy icon" className="option-icon" height={50} src="/icons/trophy.png" />
            </Link>
          </div>
          <div className="col-md-6">
            <div className="selector-option-container">
              <h4 className="option-title text-md-left text-center"><Link to="/minileagues" className="option-title-link">Mini-leagues</Link></h4>
              <h4 className="option-description text-md-left text-center">Compare your predictions against your competitors</h4>
            </div>
          </div>
          <div className="col-md-2 last-col" />
        </div>
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-2 selector-image-container">
            <span className="option-circle" />
            <Link to="/scores" className="option-icon">
              <img alt="correct icon" className="option-icon" height={50} src="/icons/correct.png" />
            </Link>
          </div>
          <div className="col-md-6">
            <div className="selector-option-container">
              <h4 className="option-title text-md-left text-center"><Link to="/scores" className="option-title-link">Scores</Link></h4>
              <h4 className="option-description text-md-left text-center">Watch your scores as the goals come in</h4>
            </div>
          </div>
          <div className="col-md-2 last-col" />
        </div>
      </div>
    </div>
  );
};

export default PageSelector;
