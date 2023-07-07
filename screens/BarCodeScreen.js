import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { requestCameraPermissionsAsync } from 'expo-camera';

const GOOGLE_VISION_API_KEY = 'AIzaSyDjAFCqQuYR7DWmyPcQ7FQs8q3yL8LUe-E';

export function BarCodeScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);

  useEffect(() => {
    requestCameraPermissions();
  }, []);

  const requestCameraPermissions = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setBarcodeData(data);

    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify({
            requests: [
              {
                image: { content: data },
                features: [{ type: 'BARCODE_DETECTION', maxResults: 1 }],
              },
            ],
          }),
        }
      );

      const result = await response.json();
      const barcodeInfo = result.responses[0]?.barcodeAnnotations[0];

      if (barcodeInfo) {
        console.log('Barcode value:', barcodeInfo?.description);
        console.log('Barcode format:', barcodeInfo?.format);
        console.log('Barcode bounds:', barcodeInfo?.boundingPoly);
        // Process the barcode information as needed
      } else {
        console.log('No barcode found.');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

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
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.overlay}>
          <Text style={styles.scanDataText}>{barcodeData}</Text>
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
});






// import React, { useState, useEffect } from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// //import axios from 'axios';

// export function BarCodeScreen(props) {
//   // const [hasPermission, setHasPermission] = useState(null);
//   // const [scanned, setScanned] = useState(false);
//   // const [barcodeData, setBarcodeData] = useState(null);

//   // const handleBarCodeScanned = async ({ type, data }) => {
//   //   setScanned(true);
//   //   setBarcodeData({ type, data });
  
//   //   try {
//   //     const response = await axios.get(`YOUR_API_ENDPOINT?barcode=${data}`);
//   //     const productData = response.data; // Adjust this line based on the API response structure
  
//   //     // Update the state or perform any additional logic with the productData
//   //     // For example, you can set it to a productInfo state variable:
//   //     setProductInfo(productData);
//   //   } catch (error) {
//   //     // Handle any errors that occur during the API request
//   //     console.log('Error fetching product data:', error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   (async () => {
//   //     const { status } = await BarCodeScanner.requestPermissionsAsync();
//   //     setHasPermission(status === 'granted');
//   //   })();
//   // }, []);


//   // const scanAgain = () => {
//   //   setScanned(false);
//   //   setBarcodeData(null);
//   // };

//   // if (hasPermission === null) {
//   //   return <Text>Requesting camera permission</Text>;
//   // }
//   // if (hasPermission === false) {
//   //   return <Text>No access to camera</Text>;
//   // }



// const vision = require('@google-cloud/vision');

// async function scanBarcode(imagePath) {
//   const client = new vision.ImageAnnotatorClient();

//   const [result] = await client.annotateImage({
//     image: { source: { filename: imagePath } },
//     features: [{ type: 'BARCODE_DETECTION' }],
//   });

//   const barcodes = result.barcodeAnnotations;

//   if (barcodes.length === 0) {
//     console.log('No barcodes found.');
//   } else {
//     console.log('Barcodes:');
//     barcodes.forEach((barcode) => {
//       console.log('Value:', barcode.description);
//       console.log('Format:', barcode.format);
//       console.log('Bounds:', barcode.boundingBox);
//       console.log('...');
//     });
//   }
// }
//   return (
//     <View style={styles.container}>
//       {/*  */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   overlay: {
//     position: 'absolute',
//     top: '50%',
//     left: '10%',
//     right: '10%',
//     padding: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     borderRadius: 10,
//   },
//   scanDataText: {
//     fontSize: 20,
//     color: '#fff',
//     marginBottom: 10,
//   },
//   scanTypeText: {
//     fontSize: 16,
//     color: '#fff',
//   },
// });

// // import { View, Text, StyleSheet } from "react-native";

// // export function BarCodeScreen(props) {
// //     return (
// //         <View style={styles.page}>
// //             <View style={styles.header}>
// //                 <Text style={styles.headerTitle}>Scan</Text>
// //             </View>
// //         </View>
// //     )
// // }
// // const styles = StyleSheet.create({
// //     page: {
// //         justifyContent: "center",
// //         alignItems: "center",
// //     },
// //     header: {
// //         backgroundColor: "#26ACA7",
// //         marginTop: 50,
// //         height: 70,
// //         minWidth: 400,
// //     },
// //     headerTitle: {
// //         fontSize: 40,
// //         marginTop: 25,
// //         textAlign: 'center',
// //         color: "#FD8749",
// //         fontStyle: "italic",
// //         fontWeight: "bold"
// //     },
// // })