import { View, Text, Alert, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import {useEffect, useState} from 'react'
import { useClerk, useUser } from '@clerk/clerk-expo';
import { API_URL } from '../../constants/api';
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import RecipeCard from '../../components/RecipeCard'
import NoFavoritesFound from '../../components/NoFavoritesFound';
import LoadingSpinner from '../../components/LoadingSpinner';

const FavoritesScreen = () => {
  const {signOut} = useClerk();
  const {user} = useUser();
  const [favoritesRecipes, setFavoritesRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites/${user.id}`)
        if (!response.ok) 
          throw new Error('Network response was not ok');

        const favorites = await response.json();

        //transform the data to match the recoipe card component's expected format

        const transformedFavorites = favorites.map(favorite => ({
          ...favorite,
          id: favorite.recipeId, // Assuming recipeId is the unique identifier
        }));

        setFavoritesRecipes(favorites);
        
      } catch (error) {
        Alert.alert('Error', 'Failed to load favorites. Please try again later.');
        console.log('Error fetching favorites:', error);  
      }finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user.id]);

  const handleSignout = async => {
    Alert.alert("Logout","Are you sure want to logout?",[
      {text:"Cancel",style:"cancel"},
      {text:"Logout",style:"destructive", onPress:signOut},
    ])
  }

  if(loading) return <LoadingSpinner message='Loading your favorites...'/>;

  return (

    <View styles={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>

            <Text style={favoritesStyles.title}>Favorites</Text>
            <TouchableOpacity style={favoritesStyles.logoutButton} onPress={handleSignout}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
        </View>

        <View styles={favoritesStyles.recipesSection}>
          <FlatList
          data={favoritesRecipes}
          renderItem={({item}) => <RecipeCard recipe={item}/>}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={favoritesStyles.row}
          contentContainerStyle={favoritesStyles.recipesGrid}
          scrollEnabled={false}
          ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default FavoritesScreen