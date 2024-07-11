import {Mixpanel} from 'mixpanel-react-native';
import Config from 'react-native-config';

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(
  `${Config.MIXPANEL_API_KEY}`,
  trackAutomaticEvents,
);

export function setTrackUser() {
  mixpanel.init();
  mixpanel.setLoggingEnabled(true);

  mixpanel.identify('USER_ID');

  mixpanel.getPeople().set('$name', 'Jane Doe');
  mixpanel.getPeople().set('$email', 'jane.doe@example.com');
  mixpanel.getPeople().set('plan', 'Premium');

  mixpanel.track('App Launched');
}

export function resetTrackUser() {}

export function trackEvent(eventName: string, eventProps?: any) {
  mixpanel.track(eventName, eventProps);
  mixpanel.track(eventName, {
    'Signup Type': 'Referral',
  });
}
