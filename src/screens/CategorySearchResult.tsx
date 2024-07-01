import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import MovieItem from "../components/movies/MovieItem";
import { API_ACCESS_TOKEN } from "@env";

const CategorySearchResult = () => {
  const route = useRoute();
  const { genre } = route.params;

  const [moviesByGenre, setMoviesByGenre] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMoviesByGenre();
  }, [genre.id]);

  const getMoviesByGenre = (): void => {
    const url = `https://api.themoviedb.org/3/discover/movie?page=1&with_genres=${genre.id}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMoviesByGenre(response.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch movies by genre:", error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8978A4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{genre?.name}</Text>
      </View>
      <View style={styles.searchMovieResultContainer}>
        <FlatList
          data={moviesByGenre}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.movieItemContainer}>
              <MovieItem movie={item} size={{ width: 95, height: 160 }} coverType="poster" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.movieList}
          numColumns={3}
          ItemSeparatorComponent={() => <View style={styles.gapY} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },

  header: {
    marginLeft: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8978A4",
    width: 160,
    height: 40,
    borderRadius: 20,
    marginStart: 18,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    margin: "auto",
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    position: "relative",
  },
  icon: {
    position: "absolute",
    right: 15, // Position the icon on the right inside the input container
  },
  searchMovieResultContainer: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: "auto",
  },
  movieList: {
    justifyContent: "space-between",
    flexDirection: "column",
  },
  movieItemContainer: {
    flexBasis: "30%",
  },
  gapY: {
    height: 8,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CategorySearchResult;
