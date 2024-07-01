import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MovieDetail from "../screens/MovieDetail";
import Search from "../screens/Search";
import CategorySearchResult from "../screens/CategorySearchResult";

const Stack = createNativeStackNavigator();

const SearchStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchPage"
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CategorySearchResult"
        component={CategorySearchResult}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigation;
