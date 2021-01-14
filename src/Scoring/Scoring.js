import React, {useState} from 'react'
import './Scoring.css'
import HomepageButton from '../HomepageButton'
import DropdownSelector from '../DropdownSelector'
import {useSelector, useDispatch} from 'react-redux'
import { getScoredPreds, selectScoredMatches, selectScoringStatus, selectSelectedGameweek } from './scoringSlice'
import { selectFriends } from '../User/userSlice'

const Scoring = () => {
  const dispatch = useDispatch()
  const [gameweekDropdownDisabled, setGameweekDropdownDisabled] = useState(true)
  const [friendDropdownDisabled, setFriendDropdownDisabled] = useState(false)
  const status = useSelector(selectScoringStatus)
  const gameweek = useSelector(selectSelectedGameweek)
  const matches = useSelector(selectScoredMatches)
  const friends = useSelector(selectFriends)

  if (status === 'pending' && (!gameweekDropdownDisabled || !friendDropdownDisabled)) {
    setGameweekDropdownDisabled(true)
    setFriendDropdownDisabled(true)
  }

  if ((status === 'success' || status === 'idle') && (gameweekDropdownDisabled || friendDropdownDisabled)) {
    setGameweekDropdownDisabled(false)
    setFriendDropdownDisabled(false)
  }

  return (
    <div className='m-0 row'>
      <div className='col-lg-4 left-col-scoring-outer-container'>
        <HomepageButton />
        <div className='left-col-scoring-container'>
          <h1 className='left-col-scoring-text'>Scores</h1>
          <DropdownSelector enabled={gameweekDropdownDisabled} length={38} onValueUpdate={(e) => dispatch(getScoredPreds([, e.target.value]))} startingValue={gameweek} />
        </div>
      </div>
      <div className='col-lg-8 right-col'>
        {matches.length > 0 ? 
        <div>
          <div className='scored-header-row' style={{marginBottom: 0}}>
            <div className='scored-header-row-inner-container' style={{paddingBottom: 0}}>
              <div className='home-team-container col-md-2' style={{opacity: 0}}>
                <img alt="home club badge" className='club-badge' height={70} src={require('../badges/Arsenal.png')}/>
                <span className='prediction-circle'/>
              </div>
              <div className='col-md-8 scored-match-data-container scored-match-data-header'>
                <div className='col-md-4'>
                  <DropdownSelector enabled={friendDropdownDisabled} style={{border: 'solid 1px #defc5f'}} onValueUpdate={(e) => dispatch(getScoredPreds([friends[e.target.value-1].name, ]))} length={friends.length} minileagueArr={friends} />
                </div>
                <div className='col-md-4'>
                </div>
                <div className='col-md-4'>
                </div>
              </div>
              <div className='away-team-container col-md-2' style={{opacity: 0}}>
                <img alt="away club badge" className='club-badge' height={70} src={require('../badges/Arsenal.png')}/>
                <span className='prediction-circle'/>
              </div>
            </div>
          </div>
          <div className='scored-header-row'>
            <div className='scored-header-row-inner-container' style={{paddingTop: 0}}>
              <div className='home-team-container col-md-2' style={{opacity: 0}}>
                <img alt="home club badge" className='club-badge' height={70} src={require('../badges/Arsenal.png')}/>
                <span className='prediction-circle'/>
              </div>
              <div className='col-md-8 scored-match-data-container scored-match-data-header'>
                <div className='col-md-4'>
                  Predicted Score
                </div>
                <div className='col-md-4'>
                  Live Score
                </div>
                <div className='col-md-4'>
                  Points
                </div>
              </div>
              <div className='away-team-container col-md-2' style={{opacity: 0}}>
                <img alt="away club badge" className='club-badge' height={70} src={require('../badges/Arsenal.png')}/>
                <span className='prediction-circle'/>
              </div>
            </div>
          </div>
        </div> : 
        <div className='no-kickoffs-container'>
          <div className='no-kickoffs-text'>
            This week's games have not kicked off yet.
          </div>
        </div>}
        {matches.map(match => (
          <div key={match.home_team} className='scored-match-container'>
            <div className='scored-match-inner-container'>
              <div className='home-team-container col-md-2'>
                <img alt="home club badge" className='club-badge' height={70} src={require('../badges/'+match.home_team+'.png')}/>
                <span className='prediction-circle'/>
              </div>
              <div className='scored-match-data-container col-md-8'>
                <div className='predicted-score-container col-md-4' style={{backgroundColor: '#defc5f'}}>
                  {match.user_predictions[0].home_pred} - {match.user_predictions[0].away_pred}
                </div>
                <div className='live-score-container col-md-4' style={{backgroundColor: '#defc5f'}}>
                  {match.status === 'IN_PLAY' ? <div style={{display: 'inline-block', width:25}}/> : <div />}
                  {match.live_home_score} - {match.live_away_score}
                  {match.status === 'IN_PLAY' ? <div className='pulsing-circle' /> : <div />}
                </div>
                <div className='scored-points-container col-md-4'>
                  <span style={{position: 'relative', zIndex: 999}}>{match.user_predictions[0].points || 0}</span>
                  <span className='points-circle prediction-circle' style={{backgroundColor: match.user_predictions[0].points > 0 ? 'green' : match.user_predictions[0].points < 0 ? 'red' : 'gray'}}/>
                </div>
              </div>
              <div className='away-team-container col-md-2'>
                <img alt="away club badge" className='club-badge' height={70} src={require('../badges/'+match.away_team+'.png')}/>
                <span className='prediction-circle'/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Scoring