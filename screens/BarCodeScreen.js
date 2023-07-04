import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
//import axios from 'axios';

export function BarCodeScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setBarcodeData({ type, data });
  
    try {
      const response = await axios.get(`YOUR_API_ENDPOINT?barcode=${data}`);
      const productData = response.data; // Adjust this line based on the API response structure
  
      // Update the state or perform any additional logic with the productData
      // For example, you can set it to a productInfo state variable:
      setProductInfo(productData);
    } catch (error) {
      // Handle any errors that occur during the API request
      console.log('Error fetching product data:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     setBarcodeData({ type, data });
//   };

  const scanAgain = () => {
    setScanned(false);
    setBarcodeData(null);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <View style={styles.overlay}>
          <Text style={styles.scanDataText}>{barcodeData?.data}</Text>
          <Text style={styles.scanTypeText}>{barcodeData?.type}</Text>
          <Button title="Scan Again" onPress={scanAgain} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
  },
  scanDataText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  scanTypeText: {
    fontSize: 16,
    color: '#fff',
  },
});

// import { View, Text, StyleSheet } from "react-native";

// export function BarCodeScreen(props) {
//     return (
//         <View style={styles.page}>
//             <View style={styles.header}>
//                 <Text style={styles.headerTitle}>Scan</Text>
//             </View>
//         </View>
//     )
// }
// const styles = StyleSheet.create({
//     page: {
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     header: {
//         backgroundColor: "#26ACA7",
//         marginTop: 50,
//         height: 70,
//         minWidth: 400,
//     },
//     headerTitle: {
//         fontSize: 40,
//         marginTop: 25,
//         textAlign: 'center',
//         color: "#FD8749",
//         fontStyle: "italic",
//         fontWeight: "bold"
//     },
// })