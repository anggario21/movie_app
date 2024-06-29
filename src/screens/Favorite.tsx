import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from "../types/app";
import MovieItem from "../components/movies/MovieItem";
import { useNavigation, StackActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import EmptyAnimation from '../../assets/empty.json'

const Favorites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getFavoriteFromLocalStorage = async () => {

    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const initialData: string | null = await AsyncStorage.getItem("@FavoriteList");

      if (initialData !== null) {
        const parsedData: Movie[] = JSON.parse(initialData);
        setFavoriteMovies(parsedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getFavoriteFromLocalStorage();
  }, [favoriteMovies]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {favoriteMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LottieView
            source={EmptyAnimation}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.emptyText}>You haven't favorited any movies yet</Text>
        </View>
      ) : (
        favoriteMovies.map((movie) => (
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
        ))
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  animation: {
    width: 250, 
    height: 250, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Favorites;
