import React from 'react'
import {FormGroup, Button, FormControl, FormLabel} from 'react-bootstrap'
import base_url from './globals'

class FeedbackPopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonEnabled: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateSummary = this.updateSummary.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
  }
  getUserDetails() {
    return new Promise(resolve => {
      fetch(base_url+'/userinfo', {credentials: 'include'}).then(res => {
        if (res.status === 200) {
          return res.json()
        } else {
          resolve('')
          return 
        }
      }).then(data => {
        if (data) {
          resolve({username: data.username, email: data.email})
          return
        }
      })
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    if (this.state.buttonEnabled === false) {
      return
    }
    this.setState({
      buttonEnabled: false
    })
    const data = new FormData(event.target)
    const summary = data.get('summary')
    const description = data.get('description')
    const issuetype = data.get('issuetype')
    const userdetails = await this.getUserDetails()
    const username = userdetails.username
    const email = userdetails.email

    var reqBody = {
      'fields': {
        'project': {
          'key': 'MAIN'
        },
        'parent': {
          'key': 'MAIN-2'
        },
        'summary': summary,
        "description": {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": description,
                  "type": "text"
                }
              ]
            }
          ]
        },
        'customfield_10031': username,
        'customfield_10033': email,
        'customfield_10029': window.location.pathname,
        'issuetype': {
          'name': issuetype
        }
      }
    }

    if (issuetype === 'Bug') {
      // Include some extra debugging info
      reqBody.fields.customfield_10032 = window.navigator.userAgent
    }

    var requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(reqBody),
      credentials: 'include'
    }

    fetch(base_url+'/create-jira-issue', requestOptions).then(() => {
      this.setState({
        buttonEnabled: true,
        summary: '',
        description: ''
      })
    })
    this.props.updateAlertMessage('Your feedback has been recorded. Thank you!')
    this.props.onTogglePopup()
  }

  updateSummary(event) {
    this.setState({summary: event.target.value});
  }

  updateDescription(event) {
    this.setState({description: event.target.value});
  }

  render() {
    return (
      <div className='feedback-popup' style={{display: this.props.display ? 'flex' : 'none'}}>
        <div className='feedback-popup-content'>
          <h1>Send feedback</h1>
          <img alt='close-button' src={require('./icons/cross.png')} className="feedback-popup-close" onClick={this.props.onTogglePopup} />
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId='issuetype' bssize='large'>
              <FormLabel>Issue Type</FormLabel>
              <select name='issuetype'>
                <option value='Bug'>Something's gone wrong</option>
                <option value='Feedback'>Feedback/Suggestion</option>
              </select>
            </FormGroup>
            <FormGroup controlId="summary" bssize="large">
              <FormLabel>Brief Summary</FormLabel>
              <FormControl
                className='form-field'
                autoFocus
                name="summary"
                value={this.state.summary}
                onChange={this.updateSummary}
              />
            </FormGroup>
            <FormGroup controlId="description" bssize="large">
              <FormLabel>Description</FormLabel>
              <FormControl
                as='textarea'
                className='form-field'
                name="description"
                value={this.state.description}
                onChange={this.updateDescription}
              />
            </FormGroup>
            <Button disabled={!this.state.buttonEnabled} size="lg" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    )
  }
}

export default FeedbackPopup