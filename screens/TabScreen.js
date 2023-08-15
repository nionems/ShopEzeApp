import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import IonIcons from '@expo/vector-icons/Ionicons'

//screens
import { HomeScreen } from "./HomeScreen";
import { RecipeScreen } from "./RecipeScreen"
import { MealPlanScreen } from './MealPlanScreen';
import { BarCodeScreen } from "./BarCodeScreen";
import { SettingScreen } from "./SettingScreen";

const Tab = createMaterialBottomTabNavigator();

export function TabScreen() {


    const HomeScreenOptions = {
        tabBarLabel: "List",
        tabBarIcon: ({ color }) => <IonIcons name="list-outline" color={color} size={28} />

    }
    const RecipeScreenOptions = {
        tabBarLabel: "Recipe",
        tabBarIcon: ({ color }) => <IonIcons name="restaurant-outline" color={color} size={28} />

    }
    const MealPlanScreenOptions = {
        tabBarLabel: "MealPlan",
        tabBarIcon: ({ color }) => <IonIcons name="calendar-outline" color={color} size={28} />
    }
    const BarCodeScreenOptions = {
        tabBarLabel: "Scan",
        tabBarIcon: ({ color }) => <IonIcons name="barcode-outline" color={color} size={28} />
    }
    const SettingScreenOptions = {
        tabBarLabel: "Setting",
        tabBarIcon: ({ color }) => <IonIcons name="person-outline" color={color} size={28} />
    }

    return (
        <Tab.Navigator initialRouteName="List" activeColor="tomato" >
            <Tab.Screen
                name="List"
                component={HomeScreen}
                options={HomeScreenOptions}
            >
            </Tab.Screen>
            <Tab.Screen
                name="RecipeScreen"
                component={RecipeScreen}
                options={RecipeScreenOptions}
            />
            <Tab.Screen
                name="MealPlanScreen"
                component={MealPlanScreen}
                options={MealPlanScreenOptions}
            />
            <Tab.Screen
                name="BarCodeScreen"
                component={BarCodeScreen}
                options={BarCodeScreenOptions}
            />
            <Tab.Screen
                name="Setting/Profile"
                component={SettingScreen}
                options={SettingScreenOptions}
            />
        </Tab.Navigator>
    )
}