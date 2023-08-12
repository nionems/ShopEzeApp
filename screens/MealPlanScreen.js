import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import colors from "../component/Colors";

const { width } = Dimensions.get('window');

export function MealPlanScreen(props) {

  const [meal, setMeal] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [ingredientsByDate, setIngredientsByDate] = useState({});

  useEffect(() => {
    setMeal('');
    setIngredient('');
  }, [selectedDate]);

  const handleAddIngredient = () => {
    const updatedIngredients = { ...ingredientsByDate };

    if (updatedIngredients[selectedDate]) {
      updatedIngredients[selectedDate].push({ meal, ingredient });
    } else {
      updatedIngredients[selectedDate] = [{ meal, ingredient }];
    }

    setIngredientsByDate(updatedIngredients);
    console.log('Adding ingredient:', { meal, ingredient, selectedDate });
    setMeal('');
    setIngredient('');
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  // const handleUpdateEvent = (index) => {
  //   const selectedEvent = ingredientsByDate[selectedDate][index];
  //   setMeal(selectedEvent.meal);
  //   setIngredient(selectedEvent.ingredient);

  // };

  const handleDeleteEvent = (index) => {
    // Implement logic to handle event deletion
    const updatedIngredients = { ...ingredientsByDate };
    updatedIngredients[selectedDate].splice(index, 1);
    setIngredientsByDate(updatedIngredients);
    console.log('Deleting event:', ingredientsByDate[selectedDate][index]);
  };

  const renderIngredientsForDate = () => {
    if (!selectedDate || !ingredientsByDate[selectedDate]) {
      return null;
    }

    return ingredientsByDate[selectedDate].map((item, index) => (
      <View key={index} style={styles.ingredientContainer}>
        <Text style={styles.mealText}>Meal: {item.meal}</Text>
        <Text style={styles.ingredientText}>Ingredient: {item.ingredient}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={handleDeleteEvent}
          >
            <Text style={styles.buttonText}>DELETE</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <View style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Meal Plan</Text>
            </View>
            <Text style={styles.instruction}>
              Select a date, then enter a meal and ingredient
            </Text>
          </View>
          <Text style={styles.selectedDate}>
            {selectedDate ? new Date(selectedDate).toDateString() : ''}
          </Text>
          <Calendar
            style={styles.calendar}
            onDayPress={handleDateSelect}
            markedDates={{ [selectedDate]: { selected: true } }}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter a meal"
            value={meal}
            onChangeText={setMeal}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter ingredient"
            value={ingredient}
            onChangeText={setIngredient}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddIngredient}>
            <Text style={styles.buttonText}>ADD EVENT</Text>
          </TouchableOpacity>
          <View style={styles.ingredientContainer}>{renderIngredientsForDate()}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: width * 0.9, // Adjust the width to your preference
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 18,
    color: colors.green,
  },
  ingredientContainer: {
    marginBottom: 10,
   
  },
  ingredientText: {
    fontSize: 20,
    marginBottom: 0,
    color: colors.orange,
    textAlign: 'center'
    
  },
  mealText: {
    fontSize: 20,
    marginBottom: 0,
    color: colors.green,
    textAlign: 'center'
  },
  header: {
    backgroundColor: colors.green,
    height: 70,
    minWidth: 1400,
  },
  headerTitle: {
    fontSize: 40,
    marginTop: 10,
    textAlign: 'center',
    color: colors.orange,
    shadowOpacity: 10,
    fontStyle: "italic",
    fontWeight: "bold"
  },
  calendar: {
    marginBottom: 10,
    backgroundColor: colors.white,
    width: width * 0.9, // Adjust the width as needed
    aspectRatio: 1, // This will maintain a square aspect ratio for the calendar
    height: 350, // Adjust the height as needed
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: colors.green,
    marginTop: 3,
    marginBottom:3,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 20,
    textAlign:"center"
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    fontSize: 20,
  },
  button: {
    backgroundColor: colors.green,
    width: "80%",
    marginTop: "5%",
    marginBottom: "5%",
    borderRadius: 10,
    padding: 15,
  },
  buttonDelete: {
    backgroundColor: colors.orange,
    width: "80%",
    marginTop: "5%",
    marginBottom: "5%",
    borderRadius: 10,
    padding: 15,
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 30
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  instruction: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.black,
    padding: "1%"
  },


})




