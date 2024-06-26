import React from "react";
import { View, Text, Button } from "react-native";

export default function Home({ navigation }: any): JSX.Element {
  return (
    <View>
      <Text>Movie Page</Text>
      <Button title="Pergi Ke Movie Detail" onPress={() => navigation.navigate("MovieDetail")} />
    </View>
  );
}
