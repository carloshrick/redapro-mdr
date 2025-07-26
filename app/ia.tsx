import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Keyboard, Text, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import styled from "styled-components/native";
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Link as ExpoRouterLink } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Animated, Easing } from 'react-native';
import { useRef } from 'react';
import apiConfig from '../api/axios';


const ArgumentScreen = () => {
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
const bounceAnim = useRef(new Animated.Value(1)).current;


useEffect(() => {
  if (loading) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2, // salto maior
          duration: 1000, // mais lento
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  } else {
    bounceAnim.setValue(1);
  }
}, [loading]);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
  const handleSendTopic = async () => {
    if (!topic) {
      alert('Por favor, insira um tema.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiConfig.post('/argumento', { tema: topic });
      setResponse(res.data.texto);
    } catch (error) {
      setResponse('Erro ao gerar argumentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
      <ContainerBody>
        <ScrollView contentContainerStyle={{alignItems: 'center'}} style={styles.container}>
        <Title>
        <TitleTextInserir>INSIRA O TEMA</TitleTextInserir>
        <TitleTextRedacoes>DA SUA REDAÇÃO</TitleTextRedacoes>
    </Title>
          <TextInput
            style={styles.input}
            placeholder="Digite o tema aqui..."
            value={topic}
            onChangeText={setTopic}
          />
          <StyledButton onPress={handleSendTopic} disabled={loading}>
            <ButtonText>Gerar Argumentos</ButtonText>
          </StyledButton>
          {loading && (
  <Animated.Image
    source={require('../assets/fundologin.png')} // troque pela sua logo
    style={{
      width: 300,
      height: 300,
      marginVertical: 20,
      transform: [{ scale: bounceAnim }],
    }}
  />
)}

          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        </ScrollView>


        {!keyboardVisible && (
        <Footer>

          <ButtonContainer1>
              <Pressable onPress={() => navigation.goBack()}><Icone source={require('../assets/back-button.png')} /></Pressable>
          </ButtonContainer1>

          <ButtonContainer href='/'>
            <Icone source={require('../assets/botao-de-inicio.png')} />
          </ButtonContainer>

          <ButtonContainer href='/sinonimos'>
                    <Icone source={require('../assets/editor-de-texto.png')} /> 
                </ButtonContainer>

        </Footer>
        )}
      </ContainerBody>
    </KeyboardAvoidingView>
  );
};

const ButtonContainer1 = styled.Pressable`
    height: 80px;
    width: 80px;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    margin-top: -22;

`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  input: {
    height: 60,
    width: 370,
    borderColor: '#ffffff',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 30,
    fontSize: 18,
    alignItems: 'center'
    
  },
  loading: {
    fontSize: 16,
    marginVertical: 10,
    color: 'blue',
  },
  responseContainer: {
    flex: 1, 
    marginTop: 20,
    marginBottom:90,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'justify',
  },
});

const Title = styled.View`
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 20px;
`;

const TitleText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #18206f;
`;

const TitleTextInserir = styled(TitleText)`
  margin-bottom: 5px; 
  margin-top: -5;
`;

const TitleTextRedacoes = styled(TitleText)``;

const ContainerBody = styled.View`
  flex: 1;
  background-color: #F5F5F5;
  align-items: center;
`;

const Footer = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0;
  flex-direction: row;
  justify-content: space-around;
  background-color: #18206f;
  align-items: center;
  height: 90px;
`;

const ButtonContainer = styled(ExpoRouterLink)`
  height: 80px;
  width: 80px;
  align-items: center;
  border-radius: 8px;
  justify-content: center;
  padding-left: 28px;
  margin-top: 28px;
`;


const StyledButton = styled(Pressable)`
  background-color: #18206f; 
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 10px; 
`;

const ButtonText = styled.Text`
  color: white; 
  font-size: 18px; 
  font-weight: bold;
`;

const Icone = styled.Image`
  width: 30px;  
  height: 30px;
`;

export default ArgumentScreen;
