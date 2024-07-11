import {Mixpanel} from 'mixpanel-react-native';
import Config from 'react-native-config';

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(
  `${Config.MIXPANEL_API_KEY}`,
  trackAutomaticEvents,
);

import {getLocales} from 'react-native-localize';

const getCurrentDeviceLanguage = () => {
  const locales = getLocales();
  return locales[0].languageCode; // id
};

export function setTrackUser() {
  mixpanel.init();
  mixpanel.setLoggingEnabled(true);

  mixpanel.identify('USER_ID');

  mixpanel.getPeople().set('language', getCurrentDeviceLanguage());
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
