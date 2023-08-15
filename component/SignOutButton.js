import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useContext } from 'react'
import { FBAuthContext } from '../contexts/FBAuthContext'
import { signOut } from 'firebase/auth'
import { AntDesign } from "@expo/vector-icons";

export function SignOutButton(props) {
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
      <TouchableOpacity style={styles.button} onPress={() => SignOutHandler()}>
        <AntDesign name="logout" size={26} color="red" />
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  button: {
    marginLeft: 5,
    shadowOpacity: 10,
  }
})