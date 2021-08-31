import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const TitleText = (props) => {
  return (
    <Text style={[styles.title, props.style]}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'open-sans-bold'
  }
});

export default TitleText;
