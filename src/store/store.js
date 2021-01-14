import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../User/userSlice'
import predictionsReducer from '../Predictions/predictionsSlice'
import minileaguesReducer from '../MiniLeagues/minileaguesSlice'
import scoringReducer from '../Scoring/scoringSlice'
import feedbackReducer from '../Feedback/feedbackSlice'
import alertsReducer from '../Alerts/alertsSlice'

export default configureStore({
    reducer: {
        user: userReducer,
        predictions: predictionsReducer,
        minileagues: minileaguesReducer,
        scoring: scoringReducer,
        feedback: feedbackReducer,
        alerts: alertsReducer
    }
})