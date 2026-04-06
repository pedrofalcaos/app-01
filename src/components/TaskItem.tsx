import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { TaskItem as TaskData } from '../utils/handle-api';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

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
        {isCompleted
          ? <AntDesign name="check-circle" size={20} color="#fff" style={styles.icon} />
          : <Feather name="circle" size={20} color="#fff" style={styles.icon} />
        }
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={[styles.text, isCompleted && styles.completedText]}>{task.text}</Text>
        {task.dueDate && (
          <Text style={styles.dateText}>Até: {formatDate(task.dueDate)}</Text>
        )}
      </View>
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
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  dateText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
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
