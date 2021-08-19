import {Navigation} from 'react-native-navigation';
import {registerScreens} from './src/app-navigation/routes';

Navigation.events().registerAppLaunchedListener(async () => {
  registerScreens();
  Navigation.setRoot({
    root: {
      stack: {
        id: 'AppStack',
        children: [
          {
            component: {
              name: 'pokemon-list',
            },
          },
        ],
      },
    },
  });
});
