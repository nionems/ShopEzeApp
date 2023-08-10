import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, Image, Linking, } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { requestCameraPermissionsAsync } from 'expo-camera';





const api_key = 'c34dc6d615da39a9b6bfb6ccafcfa1ee188699e0ec3ff2b12830db028a7f8c4b'; // Replace with your actual API key
const api_base_url = 'https://go-upc.com/api/v1/code/';

export function BarCodeScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    requestCameraPermissions();
  }, []);

  const requestCameraPermissions = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const fetchProductData = async (productCode) => {
    const url = `${api_base_url}${productCode}?key=${api_key}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setProductData(data.product);
    } catch (error) {
      console.log('Error fetching product data:', error);
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setBarcodeData(data);

    fetchProductData(data);
  };

  const scanAgain = () => {
    setScanned(false);
    setBarcodeData(null);
    setProductData(null);
  };


  const handleGoogleSearch = async ({ data }) => {
    setScanned(true);
    setBarcodeData(data);

    fetchProductData(data);

    // Open a Google search URL for the scanned product
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      productData?.name || 'Product'
    )}`;
    Linking.openURL(searchUrl);
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
          {productData ? (
            <View>
              <Text style={styles.dataText}> {productData.name}</Text>
              <Button title=" Scan Again? " onPress={scanAgain} color="#26ACA7"/>
              <Button title=" Where to Buy?" onPress={handleGoogleSearch} color="red"/>
              <Text style={styles.dataDescriptionText}> {productData.description}</Text>
              {productData.imageUrl && (
                <Image
                  style={styles.image}
                  source={{ uri: productData.imageUrl }}
                />
              )}
            </View>
          ) : (
            <Text>No product data available</Text>
          )}


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
    position: "relative",
    top: '8%',
    left: '1%',
    right: '1%',
    bottom: '5%',
    padding: 10,
    backgroundColor: 'rgba(255,255,255, 1)',
    borderRadius: 10,
  },
  scanDataText: {
    fontSize: 15,
    color: '#26ACA7',
    marginBottom: 10,
    textAlign: 'center', // Add this property to center-align the text
  },
  dataText: {
    fontSize: 20,
    color: '#26ACA7',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Add this property to center-align the text
  },
  dataDescriptionText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
    textAlign: 'center', // Add this property to center-align the text
  },
  image: {
    height: 180,
    width: 180,
    alignSelf: 'center', // Center the image horizontally within its container
    marginVertical: 10, // Add some vertical spacing
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  
});