import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useContext } from 'react'
import { FBAuthContext } from '../contexts/FBAuthContext'
import { signOut } from 'firebase/auth'

export function SignOutButton( props ) {
  const FBauth = useContext(FBAuthContext)
  
  const SignOutHandler = () => {
    signOut(FBauth).then( 
      () => {
        // signed out
      }
    )
  }
  return (
    <View>
      <Pressable style={styles.SignOutbutton} onPress={ () => SignOutHandler() }>
        <Text style={styles.buttonText}>{ props.text }</Text>
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  SignOutbutton: {
    backgroundColor: "red",
    borderRadius: 100,
    width: 100,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignContent:"flex-end",
  },
})