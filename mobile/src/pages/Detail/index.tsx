import React, { useEffect, useState } from 'react'

import {View, Text, Image, Linking} from 'react-native'
import {Feather as Icon, FontAwesome as IconFA} from '@expo/vector-icons'


import styles from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation, useRoute } from '@react-navigation/native'
import {RectButton} from 'react-native-gesture-handler'
import api from './../../service/api'

import * as MailComposer from 'expo-mail-composer';

interface Params{
  point_id: number;
}

interface Data {
  serializedPoint:{
    image: string,
    name: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string,
    image_url: string
  }
  items: {
    title: string
  }[];
}
const Detail = () => {
 
  const navigator = useNavigation();
  const route = useRoute();
  const [dataPoint, setdataPoint] = useState<Data>({} as Data);
 


  const routeParams = route.params as Params;

  useEffect(()=>{

    console.log("Funionou")

    api.get(`points/${routeParams.point_id}`).then((response)=>{
          setdataPoint(response.data)
    })
    

  }, [])






  function handleNavigateToBack(){
    navigator.goBack();

  }


  function sendEmail(){
        MailComposer.composeAsync({
          subject: 'Interesse na Coleta de resíduos',
          recipients: [dataPoint.serializedPoint.email],
        })
  }

  function handleWhatsapp(){
        Linking.openURL(`whatsapp://send?phone=${dataPoint.serializedPoint.whatsapp}&text=Tenho intersse em coleta de resíduos`)
  }


  if(!dataPoint.serializedPoint){
    return null;
  }

 
  return (
    <>
    <View style={styles.container}>
      <TouchableOpacity style={{marginTop: 50}} onPress={handleNavigateToBack}>
           <Icon name="arrow-left" size={20} color={'#34cb79'}></Icon>
      </TouchableOpacity>

      
      <Image style={styles.pointImage} source={{ uri: dataPoint.serializedPoint.image_url}}></Image>
      <Text style={styles.pointName}>{dataPoint.serializedPoint.name}</Text>
      <Text style={styles.pointItems}>
        {dataPoint.items.map(item=> item.title).join(', ')}
      </Text>

      <View style={styles.address}>
            <Text style={styles.addressTitle}>Endereço: </Text>
            <Text style={styles.addressContent}>{dataPoint.serializedPoint.city} - {dataPoint.serializedPoint.uf}</Text>
      </View>
    </View>

    <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <IconFA name="whatsapp" size={20} color={'#FFF'}></IconFA>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={sendEmail}>
          <IconFA name="envelope-o" size={20} color={'#FFF'}></IconFA>
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
    </View>

    </>
  )
}

export default Detail
