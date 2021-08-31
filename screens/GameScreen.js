import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import BodyText from "../components/BodyText";

import Card from "../components/Card";
import MainButton from "../components/MainButton";
import NumberContainer from "../components/NumberContainer";
import DefaultStyles from "../constants/default-styles";

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum  = Math.floor(Math.random() * (max - min)) + min;
  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
};

const renderListItem = (listLength, itemData) => {
 return (
    <View style={styles.listItem}>
      <BodyText>#{listLength - itemData.index}</BodyText>
      <BodyText>{itemData.item}</BodyText>
    </View>
  )
};

const GameScreen = (props) => {
  const initialGuess = generateRandomBetween(1, 100, props.userChoise);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);

  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const {userChoise, onGameOver} = props;

  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceWidth(Dimensions.get('window').width)
      setAvailableDeviceHeight(Dimensions.get('window').height)
    };
    Dimensions.addEventListener('change', updateLayout);
    return () => {
      Dimensions.removeEventListener('change', updateLayout)
    }
  });

  useEffect(() => {
    if (currentGuess === userChoise) {
      onGameOver(pastGuesses.length);
    }
  }, [currentGuess, userChoise, onGameOver]);

  const nextGuessHandler = (direction) => {
    if ((direction === 'lower' && currentGuess < props.userChoise)
      || (direction === 'greater' && currentGuess > props.userChoise)) {
      Alert.alert('Don\'t lie!', 'You know that this is wrong...',
        [{text: 'Sorry!', style: 'cancel'}]);
      return;
    }

    if (direction === 'lower') {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }

    const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess)
    setCurrentGuess(nextNumber);
    setPastGuesses(currentPastGuesses => [nextNumber.toString(), ...currentPastGuesses])
  };

  let numberContainer = <NumberContainer>{currentGuess}</NumberContainer>

  let cardContainer =
      <Card style={styles.buttonContainer}>
        <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
          <Ionicons name='md-remove' size={24} color='white' />
        </MainButton>
        <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
          <Ionicons name='md-add' size={24} color='white' />
        </MainButton>
      </Card>

  if (availableDeviceHeight < 500) {
    numberContainer = null;
    cardContainer =
    <View style={styles.controls}>
      <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
        <Ionicons name='md-remove' size={24} color='white' />
      </MainButton>
      <NumberContainer>{currentGuess}</NumberContainer>
      <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
        <Ionicons name='md-add' size={24} color='white' />
      </MainButton>
    </View>
  }

  return (
    <View style={styles.screen}>
      <Text style={DefaultStyles.bodyText}>Opponent's Guess</Text>
      {numberContainer}
      {cardContainer}
      <View style={styles.listContainer}>
        {/*<ScrollView contentContainerStyle={styles.list}>*/}
          {/*{pastGuesses.map((guess, index) => renderListItem(guess, pastGuesses.length - index))}*/}
        {/*</ScrollView>*/}

        <FlatList
          keyExtractor={(item) => item}
          data={pastGuesses}
          renderItem={renderListItem.bind(this, pastGuesses.length)}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Dimensions.get('window').height > 600 ? 20 : 10,
    width: 400,
    maxWidth: '90%'
  },
  listContainer: {
    flex: 1,
    width: Dimensions.get('window') > 500 ? '60%' : '80%'
  },
  list: {
    flexGrow: 1,
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    alignItems: 'center'
  }
});

export default GameScreen;
