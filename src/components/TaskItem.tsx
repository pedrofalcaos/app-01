import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { TaskItem as TaskData } from '../utils/handle-api';

interface Props {
  task: TaskData;
  isCompleted: boolean;
  onUpdate: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

const TaskItem: React.FC<Props> = ({ task, isCompleted, onUpdate, onDelete, onToggleComplete }) => {
  return (
    <View style={[styles.todo, isCompleted && styles.completedTodo]}>
      <TouchableOpacity onPress={onToggleComplete}>
        <AntDesign
          name={isCompleted ? 'checkcircle' : 'checkcircleo'}
          size={20}
          color="#fff"
          style={styles.icon}
        />
      </TouchableOpacity>
      <Text style={[styles.text, isCompleted && styles.completedText]}>{task.text}</Text>
      <View style={styles.icons}>
        {!isCompleted && (
          <TouchableOpacity onPress={onUpdate}>
            <Feather name="edit" size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDelete}>
          <AntDesign name="delete" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  todo: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedTodo: {
    backgroundColor: '#555',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginHorizontal: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    padding: 2,
  },
});

export default TaskItem;
