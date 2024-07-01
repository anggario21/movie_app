import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { API_ACCESS_TOKEN } from "@env";
import { useNavigation, StackActions } from "@react-navigation/native";

interface GenreList {
  id: number;
  name: string;
}

const CategorySearch = () => {
  const [categoryList, setCategoryList] = useState<GenreList[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreList | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = () => {
    const url = "https://api.themoviedb.org/3/genre/movie/list";
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
        setCategoryList(response.genres);
      })
      .catch((error) => {
        console.error("Failed to fetch genres:", error);
      });
  };

  const handleSearch = () => {
    navigation.dispatch(
      StackActions.push("CategorySearchResult", {
        genre: selectedGenre,
      })
    );
  };

  // console.log(categoryList);
  // console.log(selectedGenre);

  return (
    <View style={styles.container}>
      <View style={styles.genreList}>
        {categoryList.map((genre) => (
          <TouchableOpacity key={genre.id} style={{ ...styles.genreItem, backgroundColor: genre.id === selectedGenre?.id ? "#8978A4" : "#e0d7ec" }} onPress={() => setSelectedGenre(genre)}>
            <Text style={styles.genreText}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.searchMovieByGenre} onPress={handleSearch}>
        <Text style={styles.textSearch}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  genreList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  genreItem: {
    width: "49%",
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
  },
  genreText: {
    color: "#000",
    textAlign: "center",
  },
  searchMovieByGenre: {
    width: "100%",
    paddingVertical: 15,
    marginVertical: 22,
    backgroundColor: "#8978A4",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 100,
    alignItems: "center",
  },
  textSearch: {
    fontSize: 20,
    color: "#fff",
  },
});

export default CategorySearch;
