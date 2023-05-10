import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import { HomeScreen } from './screens/HomeScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { SignInScreen } from './screens/SignInScreen';
import { MealPlanScreen } from './screens/MealPlanScreen';
import { RecipeScreen } from './screens/RecipeScreen';
import { BarCodeScreen } from './screens/BarCodeScreen';
import { SettingScreen } from './screens/SettingScreen';





const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Signup" component={SignUpScreen}/>
        <Stack.Screen name="Signin" component={SignInScreen}/>
        <Stack.Screen name="Mealplan" component={MealPlanScreen}/>
        <Stack.Screen name="Recipe" component={RecipeScreen}/>
        <Stack.Screen name="Barcode" component={BarCodeScreen}/>
        <Stack.Screen name="Setting" component={SettingScreen}/>



      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
