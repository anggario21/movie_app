import React from "react";
import { View, Text, Button } from "react-native";

const MovieDetail = ({ navigation }: any): JSX.Element => {
  return (
    <View>
      <Text>Movie Detail</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default MovieDetail;
