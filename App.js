
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import firebase from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import 'firebase/database';
import { HomeScreen } from './screens/HomeScreen';



// contexts
import { AuthContext } from './contexts/AuthContext';
import { FBAuthContext } from './contexts/FBAuthContext';

// screens
import { SignUpScreen } from './screens/SignUpScreen';
import { SignInScreen } from './screens/SignInScreen';
import { TabScreen } from './screens/TabScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
//import { HomeScreen } from './screens/HomeScreen';

// firebase modules
import { firebaseConfig } from './config/Config';
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
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
  const [error, setError] = useState("");

  onAuthStateChanged(FBauth, (user) => {
    if (user) {
      setAuth(user)
    }
    else {
      setAuth(null)
    }
  })
  const addList = (list) => {
    setLists((prevLists) => [
      ...prevLists,
      { ...list, id: prevLists.length + 1, tobuy: [] },
    ]);
  };
  const updateList = (list) => {
    setLists((prevLists) =>
      prevLists.map((item) => (item.id === list.id ? list : item))
    );
  };
  const renderList = (list) => {
    return <TobuyList list={list} updateList={this.updateList} />;
  };
  
  
  const handleSignUp = (email, password) => {
    const auth = FBauth // Replace with your Firebase auth instance
    
    // Check if the email is already in use
    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        if (signInMethods.length === 0) {
          // The email is not in use, proceed with sign up
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Sign up successful
              console.log('User signed up:', userCredential.user.email);
            <Text>sign up</Text>
            })
            .catch((error) => {
              console.log('Error creating user:', error);
            });
        } else {
          // The email is already in use
          console.log('Email is already in use');
          setError("email already in use sorry");
        
        }
      })
      .catch((error) => {
        console.log('Error checking email:', errorMsg);
        setErrorMsg("error checking email");
      });
  };
  // const handleSignUp = () => {
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Send email verification
  //       sendEmailVerification(userCredential.user)
  //         .then(() => {
  //           console.log('Email verification sent');
  //           // You can display a message to the user to check their email for verification
  //         })
  //         .catch((error) => {
  //           console.log('Error sending email verification:', error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.log('Error creating user:', error);
  //     });
  // };
  
  const handleSignIn = (email, password) => {
    signInWithEmailAndPassword(FBauth, email, password)
      .then((userCredential) => {
        // Handle successful sign in
        console.log('User signed in:', userCredential.user);
      })
      .catch((error) => {
        // Handle sign in error
        console.log('Error signing in:', error);
      });
  };
  return (
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name="Welcome" options={{ headerShown: false }}>
          {(props) => <WelcomeScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="Signup" options={{ headerShown: false }}>
          {(props) =>
            <AuthContext.Provider value={auth}>
              <SignUpScreen {...props} handler={handleSignUp} />
            </AuthContext.Provider>
          }
        </Stack.Screen>

        <Stack.Screen name="Signin" options={{ headerShown: false }}>
          {(props) =>
            <AuthContext.Provider value={auth}>
              <SignInScreen {...props} handler={handleSignIn} />
            </AuthContext.Provider>
          }
        </Stack.Screen>

        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) =>
          
            <FBAuthContext.Provider value={FBauth} >
              <AuthContext.Provider value={auth}>
                <TabScreen {...props} {...props} handler={addList} {...props} handler={updateList} 
                                                                    {...props} handler={renderList} />
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