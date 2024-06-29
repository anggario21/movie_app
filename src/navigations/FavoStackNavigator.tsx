import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MovieDetail from "../screens/MovieDetail";
import Favorites from "../screens/Favorite";

const Stack = createNativeStackNavigator();
const FavoStackNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator initialRouteName="Favorites">
            <Stack.Screen name="Favorites" component={Favorites} />
            <Stack.Screen name="MovieDetail" component={MovieDetail} />
        </Stack.Navigator>
    );
};

export default FavoStackNavigator;
