import React from 'react'
import {FormGroup, Button, FormControl, FormLabel} from 'react-bootstrap'
import base_url from './globals'

class FeedbackPopup extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  getUsername() {
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
          resolve(data.username)
          return
        }
      })
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.target)
    const summary = data.get('summary')
    const description = data.get('description')
    const issuetype = data.get('issuetype')
    const username = await this.getUsername()
    console.log(username)

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
        'issuetype': {
          'name': issuetype
        }
      }
    }

    if (issuetype === 'Bug') {
      // Include some extra debugging info
      reqBody.fields.customfield_10029 = window.location.pathname
      reqBody.fields.customfield_10032 = window.navigator.userAgent
    }

    var requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(reqBody),
      credentials: 'include'
    }

    fetch(base_url+'/create-jira-issue', requestOptions)
    this.props.updateAlertMessage('Your feedback has been recorded. Thank you!')
    this.props.onTogglePopup()
  }

  render() {
    return (
      <div className='feedback-popup' style={{display: this.props.display ? 'flex' : 'none'}}>
        <div className='feedback-popup-content'>
          <h1>Bug Report</h1>
          <img src={require('./icons/cross.png')} className="feedback-popup-close" onClick={this.props.onTogglePopup} />
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
              />
            </FormGroup>
            <FormGroup controlId="description" bssize="large">
              <FormLabel>Description</FormLabel>
              <FormControl
                as='textarea'
                className='form-field'
                name="description"
              />
            </FormGroup>
            <Button size="lg" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    )
  }
}

export default FeedbackPopup