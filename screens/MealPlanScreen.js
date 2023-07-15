import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

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

  const handleUpdateEvent = (index) => {
    const selectedEvent = ingredientsByDate[selectedDate][index];
    setMeal(selectedEvent.meal);
    setIngredient(selectedEvent.ingredient);

  };

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
              style={styles.button}
              onPress={handleUpdateEvent}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonDelete}
              onPress={handleDeleteEvent}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>

   
      </View>
    ));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Meal Plan</Text>
            </View>
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
            <Text style={styles.buttonText}>Add Event</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedDate: {
    marginTop: 1,
    fontSize: 18,
    color: "#26ACA7",
    fontWeight: "bold",
  },
  ingredientContainer: {
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 0,
    color: "#FD8749",
    fontWeight: "bold",
  },
  mealText: {
    fontSize: 16,
    marginBottom: 0,
    color: "#26ACA7",
    fontWeight: "bold",
  },
  header: {
    backgroundColor: "#26ACA7",
    marginTop: 50,
    height: 70,
    minWidth: 400,
  },
  headerTitle: {
    fontSize: 40,
    marginTop: 10,
    textAlign: 'center',
    color: "#FD8749",
    shadowOpacity:10,
    fontStyle: "italic",
    fontWeight: "bold"
  },
  calendar: {
    marginBottom: 10,
    backgroundColor: "#26ACA7",
    marginTop: 10,
    minWidth: 400,

  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#26ACA7',
    marginTop: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 20,
  },
  button: {
    backgroundColor: "#26ACA7",
    marginTop: 5,
    marginVertical: 15,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 10,
    padding: 10,
  },
  buttonDelete: {
    backgroundColor: "#FD8749",
    marginTop: 5,
    marginVertical: 15,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 10,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },


})




