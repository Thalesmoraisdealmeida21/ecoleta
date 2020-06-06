import React, { useState, useEffect } from 'react'
import {RectButton} from 'react-native-gesture-handler'
import {Feather as Icon} from '@expo/vector-icons'
import {View, Image, ImageBackground, Text, TextInput, KeyboardAvoidingView, Platform} from 'react-native'
import {useNavigation}from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'

import styles from './styles'
const Home  = ()=>{



  const navigation = useNavigation();
  const [uf, setUf]= useState('') 
  const [city, setCity] = useState('');
  const [ufs, setUfs] = useState<UFSelect[]>([]);
  const [cities, setCities] = useState<UFSelect[]>([])


  function handleNavigatToPoints(){
    navigation.navigate('Points', {
      uf,
      city
    });
  }

  interface IBGEUf{
    sigla: string
  }


  interface IBGECity{
      nome: string
  }

  interface UFSelect {
    label: string,
    value: string
  }

  useEffect(()=>{
    
    async function getDataUfs(){
        await axios.get<IBGEUf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then((response)=>{
          
          const arrayUFs: UFSelect[] = [];
          response.data.map((uf) => {
              arrayUFs.push({label: uf.sigla, value: uf.sigla});
              
          });

          setUfs(arrayUFs)
              
        })  
    }
 
    getDataUfs();

  

  },[])


  useEffect(()=>{
  


    axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then((response)=>{
      const arrayCities: UFSelect[] = []
        response.data.map((city)=>{
              arrayCities.push({label: city.nome, value: city.nome})
        })
       
        setCities(arrayCities);
    })
      
    

  }, [uf])
  return(

    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding': undefined}>

  
 
        <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{width: 274, height: 368}} style={styles.container}>  
        <View style={styles.main}>
          <Image source={require('./../../assets/logo.png')}></Image>
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiênte</Text>
          </View>
         
        </View>
        
          

          <View style={styles.footer}>

            <View style={styles.input}>
                  <RNPickerSelect
                

              
                items={ufs}
            
                placeholder={{
                  label: 'Selecione a UF.',
                  value: null,
                  color: '#9EA0A4',
                }}

              
                value={uf}
            
                onValueChange={(text)=>{setUf(text)}}
              />

         
            </View>



            <View style={styles.input}>
                  <RNPickerSelect
                

              
                items={cities}
                placeholder={{
                  label: 'Selecione a cidade',
                  value: null,
                  color: '#000',
                }}

              
                value={city}
            
                onValueChange={(text)=>{setCity(text)}}
              />

         
            </View>
          
          
    
      



            <RectButton style={styles.button} onPress={handleNavigatToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color={"white"}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
            </RectButton>
          </View>
          

        </ImageBackground>
    </KeyboardAvoidingView>
      
  )
}
export default Home;