import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

function checkCorrect(question, answer) {
  if (question.type === 'multiple-answer') {
    const sortedCorrect = [...question.correct].sort((a, b) => a - b);
    const sortedAnswer = [...(answer || [])].sort((a, b) => a - b);
    return (
      sortedCorrect.length === sortedAnswer.length &&
      sortedCorrect.every((v, i) => v === sortedAnswer[i])
    );
  }
  return answer === question.correct;
}

export default function Summary({ route }) {
  const { data, answers } = route.params;

  const score = data.reduce(
    (acc, question, i) => acc + (checkCorrect(question, answers[i]) ? 1 : 0),
    0
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text testID="total" style={styles.score}>
          {score} / {data.length}
        </Text>

        {data.map((question, qi) => {
          const answer = answers[qi];
          const questionCorrect = checkCorrect(question, answer);

          return (
            <View
              key={qi}
              style={[
                styles.questionBlock,
                questionCorrect ? styles.blockCorrect : styles.blockWrong,
              ]}
            >
              <Text style={styles.questionPrompt}>
                {qi + 1}. {question.prompt}
              </Text>

              {question.choices.map((choice, ci) => {
                const isCorrectChoice = Array.isArray(question.correct)
                  ? question.correct.includes(ci)
                  : question.correct === ci;

                const wasChosen = Array.isArray(answer)
                  ? answer.includes(ci)
                  : answer === ci;

                // Correct + chosen → bold green
                // Wrong + chosen → strikethrough red
                // Correct + not chosen → italic (show missed answer)
                // Other → muted
                let textStyle = styles.choiceDefault;
                if (isCorrectChoice && wasChosen) textStyle = styles.choiceCorrectChosen;
                else if (!isCorrectChoice && wasChosen) textStyle = styles.choiceWrongChosen;
                else if (isCorrectChoice && !wasChosen) textStyle = styles.choiceCorrectMissed;

                return (
                  <Text key={ci} style={[styles.choiceText, textStyle]}>
                    {isCorrectChoice ? '● ' : '○ '}{choice}
                  </Text>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  score: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111',
    marginBottom: 28,
    marginTop: 8,
  },
  questionBlock: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  blockCorrect: {
    backgroundColor: '#f0faf0',
    borderLeftColor: '#22c55e',
  },
  blockWrong: {
    backgroundColor: '#fff5f5',
    borderLeftColor: '#ef4444',
  },
  questionPrompt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 10,
    lineHeight: 20,
  },
  choiceText: {
    fontSize: 14,
    paddingVertical: 2,
  },
  choiceDefault: {
    color: '#aaa',
  },
  choiceCorrectChosen: {
    color: '#16a34a',
    fontWeight: '700',
  },
  choiceWrongChosen: {
    color: '#dc2626',
    textDecorationLine: 'line-through',
  },
  choiceCorrectMissed: {
    color: '#16a34a',
    fontStyle: 'italic',
  },
});
