import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ButtonGroup } from '@rneui/themed';

export default function Question({ route, navigation }) {
  const { data, index, answers = [] } = route.params;
  const question = data[index];
  const isMultipleAnswer = question.type === 'multiple-answer';

  const [selected, setSelected] = useState(isMultipleAnswer ? [] : null);

  const handlePress = (value) => setSelected(value);

  const isAnswered = isMultipleAnswer ? selected.length > 0 : selected !== null;
  const isLastQuestion = index === data.length - 1;

  const handleNext = () => {
    const updatedAnswers = [...answers, selected];
    if (isLastQuestion) {
      navigation.navigate('Summary', { data, answers: updatedAnswers });
    } else {
      navigation.push('Question', { data, index: index + 1, answers: updatedAnswers });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.counter}>{index + 1} / {data.length}</Text>

        {isMultipleAnswer && (
          <Text style={styles.hint}>Select all that apply</Text>
        )}

        <Text style={styles.prompt}>{question.prompt}</Text>

        <ButtonGroup
          testID="choices"
          buttons={question.choices}
          selectedIndex={isMultipleAnswer ? undefined : selected}
          selectedIndexes={isMultipleAnswer ? selected : undefined}
          selectMultiple={isMultipleAnswer}
          onPress={handlePress}
          vertical
          containerStyle={styles.buttonGroup}
          selectedButtonStyle={styles.selectedButton}
          selectedTextStyle={styles.selectedText}
          textStyle={styles.buttonText}
          buttonContainerStyle={styles.buttonContainer}
        />

        <TouchableOpacity
          testID="next-question"
          style={[styles.nextButton, !isAnswered && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isAnswered}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'See Results' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  counter: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  prompt: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 28,
  },
  buttonGroup: {
    borderRadius: 8,
    marginBottom: 28,
    borderColor: '#ddd',
  },
  buttonContainer: {
    height: 48,
  },
  selectedButton: {
    backgroundColor: '#111',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonText: {
    fontSize: 15,
    color: '#111',
  },
  nextButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ddd',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
