import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useTasks } from '../contexts/TaskContext';

const ChaosCatcherScreen = () => {
  const [input, setInput] = useState('');
  const { addTask } = useTasks();

  const handleCapture = async () => {
    if (!input.trim()) return;
    await addTask(input.trim(), { notes: 'Captured via Chaos Catcher', state: 'Exploring' });
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chaos Catcher</Text>
      <TextInput
        placeholder="Type your thought..."
        value={input}
        onChangeText={setInput}
        style={styles.input}
      />
      <Pressable onPress={handleCapture} style={styles.button}>
        <Text style={styles.buttonText}>Capture</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#4c6fff', padding: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '700' },
});

export default ChaosCatcherScreen;
