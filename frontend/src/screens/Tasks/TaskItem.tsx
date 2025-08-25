import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import ConfettiReward from '../../components/animations/ConfettiReward';
import * as Haptics from 'expo-haptics';
import { useTasks } from '../../contexts/TaskContext';

type Task = {
  id: string;
  title: string;
  description?: string;
  state: 'Pending' | 'Complete' | 'Exploring';
};

type Props = {
  task: Task;
  onDelete?: (id: string) => void;
};

const TaskItem = ({ task, onDelete }: Props) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { updateTaskState } = useTasks();

  const handleComplete = async () => {
    await updateTaskState(task.id, 'Complete'); // Update task state in Firestore or context
    setShowConfetti(true);                      // Show confetti animation
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Trigger haptic feedback
    setTimeout(() => setShowConfetti(false), 3000); // Hide animation after 3 seconds
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      {task.description && <Text style={styles.description}>{task.description}</Text>}
      <Text style={styles.state}>Status: {task.state}</Text>

      <View style={styles.actions}>
        {task.state !== 'Complete' && (
          <Pressable onPress={handleComplete} style={styles.button}>
            <Text style={styles.buttonText}>Mark Complete</Text>
          </Pressable>
        )}
        {onDelete && (
          <Pressable onPress={() => onDelete(task.id)} style={[styles.button, styles.delete]}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        )}
      </View>

      {/* Dopamine reward animation overlay */}
      <ConfettiReward visible={showConfetti} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9ff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  state: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#4c6fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  delete: {
    backgroundColor: '#ff4c4c',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default TaskItem;
