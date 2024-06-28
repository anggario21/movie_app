import { View, Text, FlatList, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { API_ACCESS_TOKEN } from "@env";
import type { Movie, MovieDetailType } from "../types/app";
import MovieItem from "../components/movies/MovieItem";
import { coverImageSize } from "../components/movies/MovieList";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const MovieDetail = ({ route }: { route: RouteProp<any> }) => {
  const [movieDetail, setMovieDetail] = useState<MovieDetailType>({
    original_title: "-",
    overview: "-",
    backdrop_path: null,
    poster_path: null,
    vote_average: 0,
    original_language: "-",
    release_date: "-",
    popularity: 0,
    vote_count: 0,
    id: 0,
  });
  const [movieRecommendation, setMovieRecommendation] = useState<Movie[]>([]);
  const [isFavorite, setIsFavorite] = useState(false)

  const getMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${route.params?.id}`;
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
        setMovieDetail(response);
      })
      .catch((errorResponse) => {
        console.error(errorResponse);
      });
  };

  const getMovieRecommendation = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${route.params?.id}/recommendations`;
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
        setMovieRecommendation(response.results);
      })
      .catch((errorResponse) => {
        console.error(errorResponse);
      });
  };

  const addFavorite = async (movie: MovieDetailType): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem("@FavoriteList");
      let favMovieList: Movie | MovieDetailType[] = [];

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie];
      } else {
        favMovieList = [movie];
      }

      await AsyncStorage.setItem("@FavoriteList", JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem("@FavoriteList");
      if (initialData !== null) {
        let favMovieList: Movie[] = JSON.parse(initialData);
        favMovieList = favMovieList.filter((movie) => movie.id !== id);
        await AsyncStorage.setItem("@FavoriteList", JSON.stringify(favMovieList));
        setIsFavorite(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkIsFavorite = async (id: number) => {
    try {
      const initialData: string | null = await AsyncStorage.getItem("@FavoriteList");
      if (initialData !== null) {
        const parsedData: Movie[] = JSON.parse(initialData);
        const checkFavorite = parsedData.find((movie) => movie.id === id);
        if (checkFavorite) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovieDetail();
    getMovieRecommendation();
  }, []);

  useEffect(() => {
    checkIsFavorite(movieDetail?.id as number);
  }, [movieDetail]);

  return (
    <View style={{ flex: 1 }}>
      {movieDetail.backdrop_path ? (
        <ImageBackground
          source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetail.backdrop_path}` }}
          style={styles.imageBackground}
        >
          <LinearGradient
            colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
            style={styles.gradient}
          >
            <Text style={styles.title}>{movieDetail.original_title}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="yellow" />
              <Text style={styles.rating}>{movieDetail.vote_average.toFixed(1)}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{movieDetail.original_title}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            <Text style={styles.rating}>{movieDetail.vote_average.toFixed(1)}</Text>
          </View>
        </View>
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.overview}>{movieDetail.overview}</Text>
        <View style={styles.detailContainer}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailText}>Original Language</Text>
            <Text style={styles.detailValue}>{movieDetail.original_language}</Text>
            <Text style={styles.detailText}>Release Date</Text>
            <Text style={styles.detailValue}>{movieDetail.release_date}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailText}>Popularity</Text>
            <Text style={styles.detailValue}>{movieDetail.popularity.toFixed(1)}</Text>
            <Text style={styles.detailText}>Vote Count</Text>
            <Text style={styles.detailValue}>{movieDetail.vote_count}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => isFavorite ? removeFavorite(movieDetail.id) : addFavorite(movieDetail)}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text> 
        </TouchableOpacity>
        <Text style={styles.recommendationTitle}>Recommendations</Text>
        <FlatList
          style={styles.recommendationList}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={movieRecommendation}
          renderItem={({ item }) => (
            <MovieItem
              movie={item}
              size={coverImageSize["poster"]}
              coverType={"poster"}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  gradient: {
    width: '100%',
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    color: 'yellow',
    fontWeight: '700',
  },
  contentContainer: {
    padding: 10,
  },
  overview: {
    marginBottom: 20,
    fontSize: 16,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailColumn: {
    flex: 1,
  },
  detailText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
    marginTop: 4,
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationList: {
    paddingLeft: 10,
  },
  headerContainer: {
    padding: 10,
  },
  favoriteButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  favoriteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default MovieDetail;
