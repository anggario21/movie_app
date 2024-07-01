import { View, TextInput, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { API_ACCESS_TOKEN } from "@env";
import { Movie } from "../../types/app";
import { Feather } from "@expo/vector-icons";
import MovieItem from "../movies/MovieItem";

const KeywordSearch = () => {
  const [Keyword, setKeyword] = useState<string>("");
  const [searchMovie, setSearchMovie] = useState<Movie[]>([]);

  const handleOnChangeInput = (text: string) => {
    setKeyword(text);
  };

  const getSearchMovie = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${Keyword}&include_adult=false&language=en-US&page=1`;
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
        setSearchMovie(response.results);
      })
      .catch((error) => {
        console.error("Failed to search movie:", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.searchInput} placeholder="Input movie title here" value={Keyword} onChangeText={handleOnChangeInput} onSubmitEditing={getSearchMovie} />
        <Feather name="search" size={24} color="gray" style={styles.icon} />
      </View>
      <View style={styles.searchMovieResultContainer}>
        <FlatList
          data={searchMovie}
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
    paddingBottom: 180,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    position: "relative",
  },
  searchInput: {
    width: "100%",
    height: 60,
    backgroundColor: "#e6e6e6",
    borderRadius: 100,
    paddingLeft: 20,
  },
  icon: {
    position: "absolute",
    right: 15,
  },
  searchMovieResultContainer: {
    flex: 1,
    paddingHorizontal: 19,
    marginTop: 16,
  },
  movieList: {
    justifyContent: "space-between",
    flexDirection: "column",
  },
  movieItemContainer: {
    flexBasis: "35%",
  },
  gapY: {
    height: 8,
    width: "100%",
  },
});

export default KeywordSearch;
