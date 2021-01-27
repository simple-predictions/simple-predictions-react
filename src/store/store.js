import LogRocket from 'logrocket';
import { configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import userReducer from '../User/userSlice';
import predictionsReducer from '../Predictions/predictionsSlice';
import minileaguesReducer from '../MiniLeagues/minileaguesSlice';
import scoringReducer from '../Scoring/scoringSlice';
import feedbackReducer from '../Feedback/feedbackSlice';
import alertsReducer from '../Alerts/alertsSlice';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
});

export default configureStore({
  reducer: {
    user: userReducer,
    predictions: predictionsReducer,
    minileagues: minileaguesReducer,
    scoring: scoringReducer,
    feedback: feedbackReducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(LogRocket.reduxMiddleware()),
  enhancers: (defaultEnhancers) => [...defaultEnhancers, sentryReduxEnhancer],
});
