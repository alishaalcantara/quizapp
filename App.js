import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from '@rneui/themed';
import Question from './src/Question';
import Summary from './src/Summary';

export { Question, Summary };

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
          <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            App Error:
          </Text>
          <Text style={{ color: '#333', fontSize: 13, textAlign: 'center' }}>
            {this.state.error.toString()}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const Stack = createStackNavigator();

const linking = {
  prefixes: [],
  config: {
    screens: {
      Question: 'question',
      Summary: 'summary',
    },
  },
};

/*
 * Sample Questions — Correct Answers:
 * Q1 (multiple-choice): 0 → "Red"          (Coca-Cola's logo is red)
 * Q2 (true-false):       0 → "True"         (the sky appears blue on a clear day)
 * Q3 (multiple-answer):  [0, 2] → "Red", "Green"  (colors in the Italian flag)
 * Q4 (multiple-choice):  1 → "Yellow"       (McDonald's Golden Arches are yellow)
 * Q5 (true-false):       0 → "True"         (UCF's school colors include gold)
 */
const QUESTIONS = [
  {
    prompt: "What is the primary color of Coca-Cola's logo?",
    type: 'multiple-choice',
    choices: ['Red', 'Blue', 'Green', 'Black'],
    correct: 0,
  },
  {
    prompt: 'The sky appears blue on a clear, sunny day.',
    type: 'true-false',
    choices: ['True', 'False'],
    correct: 0,
  },
  {
    prompt: 'Which of the following colors appear in the Italian flag?',
    type: 'multiple-answer',
    choices: ['Red', 'Blue', 'Green', 'Yellow'],
    correct: [0, 2],
  },
  {
    prompt: "What color are McDonald's famous Golden Arches?",
    type: 'multiple-choice',
    choices: ['Red', 'Yellow', 'Blue', 'Orange'],
    correct: 1,
  },
  {
    prompt: "Gold is one of UCF's official school colors.",
    type: 'true-false',
    choices: ['True', 'False'],
    correct: 0,
  },
];

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <ThemeProvider>
            <NavigationContainer linking={linking}>
              <Stack.Navigator
                initialRouteName="Question"
                screenOptions={{
                  headerLeft: () => null,
                  gestureEnabled: false,
                  cardStyle: { flex: 1, backgroundColor: '#f0f4f8' },
                }}
              >
                <Stack.Screen
                  name="Question"
                  component={Question}
                  initialParams={{ data: QUESTIONS, index: 0, answers: [] }}
                  options={{ title: 'Quiz' }}
                />
                <Stack.Screen
                  name="Summary"
                  component={Summary}
                  options={{ title: 'Results' }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
