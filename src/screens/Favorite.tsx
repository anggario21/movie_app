import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from "../types/app";
import MovieItem from "../components/movies/MovieItem";
import { useNavigation, StackActions } from '@react-navigation/native';

const Favorites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const navigation = useNavigation();

  const getFavoriteFromLocalStorage = async () => {
    try {
      const initialData: string | null = await AsyncStorage.getItem("@FavoriteList");

      if (initialData !== null) {
        const parsedData: Movie[] = JSON.parse(initialData);
        setFavoriteMovies(parsedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFavoriteFromLocalStorage();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {favoriteMovies.map((movie) => (
        <TouchableOpacity
          key={movie.id}
          style={styles.movieItem}
          onPress={() => navigation.dispatch(StackActions.push('MovieDetail', { id: movie.id }))}
        >
          <MovieItem
            movie={movie}
            size={{ width: 100, height: 160 }}
            coverType="poster"
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  movieItem: {
    margin: 10,
  },
});

export default Favorites;
