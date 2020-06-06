import React, { useEffect, useState } from 'react'

import {View, Text, StyleSheet, Image, Alert} from 'react-native'
import styles from './styles'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler'
import {Feather as Icon} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, {Marker} from 'react-native-maps'
import {SvgUri} from 'react-native-svg'
import api from '../../service/api'
import * as Location from 'expo-location'

interface Item {
  id: number,
  title: string,
  image_url: string
}

interface Point{
  id: number,
  name: string,
  image: string,
  image_url: string,
  latitude: number,
  longitude: number
  
}

interface Params {
  uf: string, 
  city: string
}
const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([0, 0]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])
  const [points, setPoints] = useState<Point[]>([])

  const route = useRoute();

  const routeParams = route.params as Params







  useEffect(()=>{

  
      api.get('points', {
        params: {
          city: routeParams.city, 
          uf: routeParams.uf,
          items: selectedItems
        }
        }).then((pointsReturneds)=>{
        
        setPoints(pointsReturneds.data)
        
      })

      
      
  }, [selectedItems])


  useEffect(()=>{

    
      async function loadPosition(){
     
        const { status} = await Location.requestPermissionsAsync();
        
        if(status !== 'granted'){

          Alert.alert(
            'Oooops',
            'Precisamos de sua permissão para obter sua localização'
          )

         

        }


        const location = await Location.getCurrentPositionAsync(); 

        const { latitude, longitude } = location.coords;

     

        setInitialPosition([
          longitude, 
          latitude
        ])

        setInitialPosition([latitude, longitude])
      }
      loadPosition();
 
    
      
  }, [])



  useEffect(()=>{
    api.get('items').then((response)=>{
        setItems(response.data)
    })
}, [])
  
  const navigation = useNavigation();

  function handleNavigateToDetail(point_id: number){
      navigation.navigate('Detail', {
              point_id: point_id
      })
  }

  function handleNavigateBack(){
        navigation.navigate('Home');
  }

  function handleSelectItem(id: number){  

    const alreadySelect = selectedItems.findIndex(item=> item === id);

    if(alreadySelect >= 0){
       const filteredItems = selectedItems.filter(item => item !== id);
       setSelectedItems(filteredItems)
    } else {
       setSelectedItems([...selectedItems, id]);
    }
    
 }  

  
  return (
    <>
      <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={20} color="#34cb79"/>
            </TouchableOpacity>


            <Text style={styles.title}>Bem Vindo !</Text>
            <Text style={styles.description}>Encontre no Mapa um ponto de coleta</Text>

            <View style={styles.mapContainer}>

              {initialPosition[0] !== 0 && (
                    <MapView 
                    style={styles.map}
                    initialRegion={{
                        latitude: -28.4175831,
                        longitude: -54.9614638,
                        
                        latitudeDelta: 0.014,
                        longitudeDelta: 0.014
                      }}>
                        {points.map((point)=> (
                          <Marker key={String(point.id)} style={styles.mapMarker}
                          onPress={()=> handleNavigateToDetail(point.id)}
                          coordinate={{
     
                            latitude: point.latitude,
                            longitude: point.longitude,
                         }}>
                           <View style={styles.mapMarkerContainer}>
                           <Image source={{
                             uri: point.image_url
                           }} style={styles.mapMarkerImage}></Image>
                           <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                           </View> 
                         
                         </Marker>
                        ))}
    
                    </MapView>
              )}
            
            </View>
       </View>

       <View style={styles.itemsContainer}>
         <ScrollView 
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={{paddingHorizontal: 20}}
         >

           {items.map((item: Item)=>{
             return(
              <TouchableOpacity key={String(item.id)}
               style={[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : {}
               ]}
              onPress={()=>{handleSelectItem(item.id)}}>
                <SvgUri width={42} height={42} uri={item.image_url}></SvgUri>
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
             )
           })}
       
         

         </ScrollView>
         

       </View>
    </>
   
  )
}

export default Points
