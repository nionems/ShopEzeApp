
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';

// contexts
import { AuthContext } from './contexts/AuthContext';
import { FBAuthContext } from './contexts/FBAuthContext';

// screens
import { SignUpScreen } from './screens/SignUpScreen';
import { SignInScreen } from './screens/SignInScreen';
import { TabScreen } from './screens/TabScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';


// firebase modules
import { firebaseConfig } from './config/Config';
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth"
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore'

const Stack = createNativeStackNavigator();
const FBapp = initializeApp(firebaseConfig)
const FBauth = getAuth(FBapp)
const FBdb = getFirestore(FBapp)

export default function App() {
  const [auth, setAuth] = useState()
  const [errorMsg, setErrorMsg] = useState()

  onAuthStateChanged(FBauth, (user) => {
    if (user) {
      setAuth(user)
    }
    else {
      setAuth(null)
    }
  })

  const SignUp = (email, password) => {
    createUserWithEmailAndPassword(FBauth, email, password)
      .then((userCredential) => console.log(userCredential))
      .catch((error) => console.log(error))
  }

  const SignIn = (email, password) => {
    signInWithEmailAndPassword(FBauth, email, password)
      .then((userCredential) => console.log(userCredential))
      .catch((error) => console.log(error))
  }
  return (
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name="Welcome" options={{ headerShown: false }}>
          {(props) => <WelcomeScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="Signup" options={{ headerShown: false }}>
          {(props) =>
            <AuthContext.Provider value={auth}>
              <SignUpScreen {...props} handler={SignUp} />
            </AuthContext.Provider>
          }
        </Stack.Screen>

        <Stack.Screen name="Signin" options={{ headerShown: false }}>
          {(props) =>
            <AuthContext.Provider value={auth}>
              <SignInScreen {...props} handler={SignIn} />
            </AuthContext.Provider>
          }
        </Stack.Screen>

        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) =>
            <FBAuthContext.Provider value={FBauth} >
              <AuthContext.Provider value={auth}>
                <TabScreen {...props} />
              </AuthContext.Provider>
            </FBAuthContext.Provider>
          }
        </Stack.Screen>
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