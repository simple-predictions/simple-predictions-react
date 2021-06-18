import LogRocket from 'logrocket';
import { configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import userReducer from '../User/userSlice';
import minileaguesReducer from '../MiniLeagues/minileaguesSlice';
import feedbackReducer from '../Feedback/feedbackSlice';
import alertsReducer from '../Alerts/alertsSlice';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
});

export default configureStore({
  reducer: {
    user: userReducer,
    minileagues: minileaguesReducer,
    feedback: feedbackReducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(LogRocket.reduxMiddleware()),
  enhancers: (defaultEnhancers) => [...defaultEnhancers, sentryReduxEnhancer],
});
