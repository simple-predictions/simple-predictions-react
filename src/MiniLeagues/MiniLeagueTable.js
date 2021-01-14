import React, {useState} from 'react'
import Cookies from 'js-cookie'
import {Table} from 'react-bootstrap'
import './MiniLeagueTable.css'
import base_url from '../globals'
import DropdownSelector from '../DropdownSelector'
import { useDispatch, useSelector } from 'react-redux'
import {getMinileaguePreds, selectSelectedMinileaguePreds, selectSelectedMinileagueGameweek, selectMinileaguesStatus} from './minileaguesSlice'

const MiniLeagueTable = () => {
  const gameweek = useSelector(selectSelectedMinileagueGameweek)
  const preds = useSelector(selectSelectedMinileaguePreds)
  const updatingStatus = useSelector(selectMinileaguesStatus)
  const [enabledStatus, setEnabledStatus] = useState(true)
  const dispatch = useDispatch()

  if ((updatingStatus === 'idle' || updatingStatus === 'success') && enabledStatus === false) {
    setEnabledStatus(true)
  }

  if (updatingStatus === 'pending' && enabledStatus === true) {
    setEnabledStatus(false)
  }

  return (
    <div className='minileague-prediction-container'>
      <DropdownSelector enabled={!enabledStatus} onValueUpdate={(e) => dispatch(getMinileaguePreds(e.target.value))} startingValue={gameweek} length={38} />
      <Table borderless className='minileague-prediction-table mini-table'>
        <thead>
          <tr>
            <th>Home Team vs Away Team</th>
            <th>Predictions</th>
        </tr>
        </thead>
        <tbody>
          {preds.matches.map((match) => (
            <React.Fragment key={match._id}>
              <tr className={`minileague-prediction-table-row-clickable minileague-prediction-table-row`}>
                  <td>
                    <div className='minileague-prediction-table-row-inner-container' style={{textAlign: 'center'}}>
                      {match.home_team} vs {match.away_team}
                      {(match.live_home_score || match.live_home_score === 0) && (match.live_away_score || match.live_away_score === 0) &&
                        <div>
                          {match.live_home_score} - {match.live_away_score}
                        </div>
                      }
                    </div>
                  </td>
                  <td>
                    <div className='minileague-prediction-table-row-inner-container'>
                      {Date.parse(match.kick_off_time) < Date.now() ?
                      <React.Fragment>
                        {preds.members.map((member) => {
                          var pred = match.predictions.find(obj => obj.username === member.username)
                          if (pred) {if (pred.home_pred === null) {pred = null}}
                          return (
                            pred ? 
                            <div className='minileague-prediction-row' key={member.username}>
                              <div className='col-md-6' style={{display: 'flex', alignItems: 'center'}}><b>{member.username}</b></div>
                              <div className='col-md-3'>{pred.error_message ? pred.error_message : pred.home_pred+'-'+pred.away_pred }</div>
                              <div className='col-md-3' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                                <span className='minileague-scoring-circle' style={{display: 'block', backgroundColor: pred.points > 0 ? 'green' : pred.points < 0 ? 'red' : 'gray'}} />
                                <span style={{fontSize: '0.8rem', position: 'absolute'}}>{pred.points}</span>
                              </div>
                            </div>
                            : 
                            <div className='minileague-prediction-row' key={member.username}>
                              <div className='col-md-6'><b>{member.username}</b></div>
                              <div className='col-md-6'>No prediction</div>
                            </div>
                          )  
                        })}
                      </React.Fragment>
                      : <div style={{textAlign: 'center'}}>Not kicked off</div>}
                    </div>
                  </td>
              </tr>
              <tr><th></th></tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default MiniLeagueTable