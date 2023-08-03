

import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState} from 'react';
import { DarkTheme } from 'react-native-paper';

// contexts
import { AuthContext } from './contexts/AuthContext';
import { FBAuthContext } from './contexts/FBAuthContext';
import { FSContext } from './contexts/FSContext';

// screens
import { SignUpScreen } from './screens/SignUpScreen';
import { SignInScreen } from './screens/SignInScreen';
import { TabScreen } from './screens/TabScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

// firebase modules
import { firebaseConfig } from './config/Config';
import { initializeApp } from 'firebase/app'
import {getAuth,createUserWithEmailAndPassword,fetchSignInMethodsForEmail,onAuthStateChanged,signOut,signInWithEmailAndPassword} from "firebase/auth"
import {getFirestore,doc,setDoc,addDoc,collection,query,where,onSnapshot} from 'firebase/firestore'
import { AddListModal } from './component/AddListModal';

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

  // const addShoppingList = (list) => {
  //   setLists((prevLists) => [
  //     ...prevLists,
  //     { ...list, id: prevLists.length + 1, tobuy: [] },
  //   ]);
  // };
  const addList = (list) => {
    setLists((prevLists) => [
      ...prevLists,
      { ...list, id: prevLists.length + 1, tobuy: [] },
    ]);
  };

  const addRecipeList = (recipeList) => {
    setRecipeLists((prevLists) => [
      ...prevLists,
      { ...recipeList, id: prevLists.length + 1, tobuy: [] },
    ]);
  };


  const updateList = (list) => {
    setLists((prevLists) =>
      prevLists.map((item) => (item.id === list.id ? list : item))
    );
  };

  const handleUpdate = async () => {
    try {
      const updatedList = {
        name: listName,
        tobuy: listItems,
      };

      onUpdate(item.id, updatedList);
      closeModal();
    } catch (error) {
      console.error("Error updating shopping list:", error);
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      const newItemObj = {
        id: counter, // Use the counter as the ID
        name: newItem.trim(),
        completed: false,
      };
      setList((prevList) => {
        return { ...prevList, tobuy: [...prevList.tobuy, newItemObj] };
      });
      setNewItem("");
      setCounter((prevCounter) => prevCounter + 1); // Increment the counter
      Keyboard.dismiss();
    }
  };

  const renderList = (list) => {
    return <TobuyList list={list} updateList={this.updateList} />;
  };

  const renderRecipeList = ({ item }) => (
    <View style={styles.recipeItem}>
      <Text style={styles.recipeName}>{item.name}</Text>
      {/* <Text style={styles.recipeDescription}>{item.description}</Text> */}
    </View>
  );
  
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
            // JM -- NOT SURE WHY THIS IS HERE, BREAKING SIGN UP <Text>sign up</Text>
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
          <FBAuthContext.Provider value={FBauth}>
            <AuthContext.Provider value={auth}>
              <SignUpScreen {...props} handler={handleSignUp} />
            </AuthContext.Provider>
            </FBAuthContext.Provider>
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
                <FSContext.Provider value={FBdb}>
                <TabScreen {...props} {...props} handler={addList} {...props} handler={updateList} {...props} handler={renderList} {...props}/>
                </FSContext.Provider>
              </AuthContext.Provider>
            </FBAuthContext.Provider>
          }
        </Stack.Screen>
        {/* <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) =>
          
            <FBAuthContext.Provider value={FBauth} >
              <AuthContext.Provider value={auth}>
                <FSContext.Provider value={FBdb}>
                <TabScreen
                {...props} handler={addShoppingList} 
                {...props} handler={updateList} 
                {...props} handler={addRecipeList}
                {...props} handler={renderList} 
                {...props} handler={renderRecipeList}/>
                </FSContext.Provider>
              </AuthContext.Provider>
            </FBAuthContext.Provider>
          }
        </Stack.Screen> */}
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
// import { StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useState, useEffect } from 'react';

// // contexts
// import { AuthContext } from './contexts/AuthContext';
// import { FBAuthContext } from './contexts/FBAuthContext';
// import { FSContext } from './contexts/FSContext';

// // screens
// import { SignUpScreen } from './screens/SignUpScreen';
// import { SignInScreen } from './screens/SignInScreen';
// import { TabScreen } from './screens/TabScreen';
// import { WelcomeScreen } from './screens/WelcomeScreen';

// // firebase modules
// import { firebaseConfig } from './config/Config';
// import { initializeApp } from 'firebase/app'
// import {getAuth,createUserWithEmailAndPassword,fetchSignInMethodsForEmail,onAuthStateChanged,signOut,signInWithEmailAndPassword} from "firebase/auth"
// import {getFirestore,doc,setDoc,addDoc,collection,query,where,onSnapshot} from 'firebase/firestore'

// const Stack = createNativeStackNavigator();
// const FBapp = initializeApp(firebaseConfig)
// const FBauth = getAuth(FBapp)
// const FBdb = getFirestore(FBapp)

// export default function App() {

//   const [auth, setAuth] = useState()
//   const [error, setError] = useState("");

//   onAuthStateChanged(FBauth, (user) => {
//     if (user) {
//       setAuth(user)
//     }
//     else {
//       setAuth(null)
//     }
//   })

//   const addList = (list) => {
//     setLists((prevLists) => [
//       ...prevLists,
//       { ...list, id: prevLists.length + 1, tobuy: [] },
//     ]);
//   };

//   const updateList = (list) => {
//     setLists((prevLists) =>
//       prevLists.map((item) => (item.id === list.id ? list : item))
//     );
//   };

//   const renderList = (list) => {
//     return <TobuyList list={list} updateList={this.updateList} />;
//   };
  
//   const handleSignUp = (email, password) => {
//     const auth = FBauth // Replace with your Firebase auth instance
    
//     // Check if the email is already in use
//     fetchSignInMethodsForEmail(auth, email)
//       .then((signInMethods) => {
//         if (signInMethods.length === 0) {
//           // The email is not in use, proceed with sign up
//           createUserWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//               // Sign up successful
//               console.log('User signed up:', userCredential.user.email);
//             <Text>sign up</Text>
//             })
//             .catch((error) => {
//               console.log('Error creating user:', error);
//             });
//         } else {
//           // The email is already in use
//           console.log('Email is already in use');
//           setError("email already in use sorry");
        
//         }
//       })
//       .catch((error) => {
//         console.log('Error checking email:', errorMsg);
//         setErrorMsg("error checking email");
//       });
//   };
 
//   const handleSignIn = (email, password) => {
//     signInWithEmailAndPassword(FBauth, email, password)
//       .then((userCredential) => {
//         // Handle successful sign in
//         console.log('User signed in:', userCredential.user);
//       })
//       .catch((error) => {
//         // Handle sign in error
//         console.log('Error signing in:', error);
//       });
//   };
//   return (
//     <NavigationContainer>

//       <Stack.Navigator>
//         <Stack.Screen name="Welcome" options={{ headerShown: false }}>
//           {(props) => <WelcomeScreen {...props} />}
//         </Stack.Screen>

//         <Stack.Screen name="Signup" options={{ headerShown: false }}>
//           {(props) =>
//             <AuthContext.Provider value={auth}>
//               <SignUpScreen {...props} handler={handleSignUp} />
//             </AuthContext.Provider>
//           }
//         </Stack.Screen>

//         <Stack.Screen name="Signin" options={{ headerShown: false }}>
//           {(props) =>
//             <AuthContext.Provider value={auth}>
//               <SignInScreen {...props} handler={handleSignIn} />
//             </AuthContext.Provider>
//           }
//         </Stack.Screen>

//         <Stack.Screen name="Home" options={{ headerShown: false }}>
//           {(props) =>
          
//             <FBAuthContext.Provider value={FBauth} >
//               <AuthContext.Provider value={auth}>
//                 <FSContext.Provider value={FBdb}>
//                 <TabScreen {...props} {...props} handler={addList} {...props} handler={updateList} {...props} handler={renderList} />
//                 </FSContext.Provider>
//               </AuthContext.Provider>
//             </FBAuthContext.Provider>
//           }
//         </Stack.Screen>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });