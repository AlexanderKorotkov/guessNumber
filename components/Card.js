import React from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';

const Card = (props) => {
  return (
    <View style={[styles.card, props.style]}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    backgroundColor: 'white',
    elevation: 5,
    padding: 10,
    borderRadius: 10,
  },
});

export default Card;
