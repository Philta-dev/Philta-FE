import {Mixpanel} from 'mixpanel-react-native';
import Config from 'react-native-config';
import {getLocales} from 'react-native-localize';

// initialize Mixpanel sdk
const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(
  `${Config.MIXPANEL_API_KEY}`,
  trackAutomaticEvents,
);

const getCurrentDeviceLanguage = () => {
  const locales = getLocales();
  return locales[0].languageCode; // id
};

export function setTrackUser(userId: number, name: string) {
  mixpanel.init();
  mixpanel.setLoggingEnabled(true);

  mixpanel.identify(userId.toString());
  mixpanel.getPeople().set('name', name);
  mixpanel.getPeople().set('prime-language', getCurrentDeviceLanguage());
  mixpanel.getPeople().set(
    'languages',
    getLocales().map(locale => locale.languageCode),
  );
  mixpanel.getPeople().set(
    'countries',
    getLocales().map(locale => locale.countryCode),
  );

  console.group('TRACK USER >>');
  console.debug('    userId:', userId);
  console.debug('    name:', name);
  console.debug('    prime-language:', getCurrentDeviceLanguage());
  console.debug(
    '    languages:',
    getLocales().map(locale => locale.languageCode),
  );
  console.debug(
    '    countries:',
    getLocales().map(locale => locale.countryCode),
  );
  console.groupEnd();
  mixpanel.track('Logged In');
}

export function resetTrackUser() {
  console.debug('    RESET TRACK USER');
  mixpanel.reset();
}

export function trackEvent(eventName: string, eventProps?: any) {
  console.group('TRACK EVENT >>');
  console.debug('    eventName:', eventName);
  console.debug('    eventProps:', eventProps);
  console.groupEnd();
  mixpanel.track(eventName, eventProps);
}
