import {Navigation} from 'react-native-navigation';

/**
 * Navigate from a page to another
 * @param fromComponent
 * @param toRoute
 * @param args
 */
export const navigate = (
  fromComponent: string,
  toRoute: string,
  args?: any,
) => {
  Navigation.push(fromComponent, {
    component: {
      name: toRoute,
      passProps: args,
    },
  });
};
