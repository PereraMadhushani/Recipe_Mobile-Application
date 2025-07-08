import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import {MealAPI} from '../../services/mealAPI';
import { homeStyles } from '../../assets/styles/home.styles';
import { Image } from 'expo-image';

const HomeScreen = () => {
  const router= useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe,setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try{
      setLoading(true);

      const [apiCategories,randomMeals,featuredMeals] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeals(),
      ]);

      const transformedCategories = apiCategories.map((cat,index) => ({
        id: index+1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);

      const transformedMeals = randomMeals
      .map((meal) => MealAPI.transformMealData(meal))
      .filter((meal) => meal !== null);

      setRecipes(transformedMeals);

      const transformedFeatured = MealAPI.transformMealData(featuredMeals);
      setFeaturedRecipe(transformedFeatured);
    } catch (error) {
      console.log('Error loading data:', error);

    }
    finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (category) => {
    try {
      const meals =await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.log('Error loading category data:', error);
      setRecipes([]);
    }
  };

  const hadnleCategorySelect = async (category) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

  useEffect(() => {
    loadData();
  }, []);



  return (
    <View style={homeStyles.container }>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={()=>{}}
        contentContainerStyle={homeStyles.scrollContent}
        >
          <View style={homeStyles.welcomeSection}>
            <Image
              source={require('../../assets/images/lamb.png')}
              style={{
                width:100,
                height:100,
              }}
              />
            <Image
              source={require('../../assets/images/chicken.png')}
              style={{
                width:100,
                height:100,
              }}
              />

            <Image
              source={require('../../assets/images/pork.png')}
              style={{
                width:100,
                height:100,
              }}
              />
          </View>

         
          
        
        </ScrollView>
      <Text>index</Text>
    </View>
  )
}

export default HomeScreen