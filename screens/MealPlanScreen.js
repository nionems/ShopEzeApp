import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet,ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

export  function MealPlanScreen(props) {
  const [meal, setMeal] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [ingredientsByDate, setIngredientsByDate] = useState({});

  const handleAddIngredient = () => {
    // Implement your logic to add the event to the meal plan
    // For example, you can update a state variable or make an API call
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

  const renderIngredientsForDate = () => {
    if (!selectedDate || !ingredientsByDate[selectedDate]) {
      return null;
    }

    return ingredientsByDate[selectedDate].map((item, index) => (
      <View key={index} style={styles.ingredientContainer}>
        <Text style={styles.mealText}>Meal: {item.meal}</Text>
        <Text style={styles.ingredientText}>Ingredient: {item.ingredient}</Text>
      </View>
    ));
  };

  return (
      <ScrollView>
    <View style={styles.container}>
        <View style={styles.page}>
             <View style={styles.header}>
                 <Text style={styles.headerTitle}>Meal Plan</Text>
             </View>
         </View>
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
      <Button  title="Add Event" onPress={handleAddIngredient} color="#26ACA7" />

      <Text style={styles.selectedDate}>
         {selectedDate ? new Date(selectedDate).toDateString() : ''}
      </Text>
      <View style={styles.ingredientContainer}>{renderIngredientsForDate()}</View>
    </View>
    </ScrollView>
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
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#26ACA7',
    marginTop:3,
    paddingHorizontal: 10,
    borderRadius:10,
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 18,
    color:"#26ACA7",
    fontStyle:"bold"
  },
//   ingredientsTitle: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
  
  ingredientContainer: {
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 16,
    marginBottom:0,
    color:"#FD8749",
},
mealText: {
    fontSize: 16,
    marginBottom:0,
    color:"#FD8749",
},
header: {
    backgroundColor: "#26ACA7",
    marginTop: 50,
    height: 70,
    minWidth: 400,
},
headerTitle: {
    fontSize: 40,
    marginTop: 25,
    textAlign: 'center',
    color: "#FD8749",
    fontStyle: "italic",
    fontWeight: "bold"
},
calendar: {
    marginBottom: 10,
    backgroundColor:"#26ACA7",
    marginTop:10,
    minWidth:400,
    
  },

  

})
    
    


