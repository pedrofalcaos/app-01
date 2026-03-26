import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { TaskItem as TaskItemType } from '../utils/handle-api';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: TaskItemType[];
  updateMode: (_id: string, text: string) => void;
  deleteToDo: (_id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, updateMode, deleteToDo }) => {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={tasks}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TaskItem
          text={item.text}
          updateMode={() => updateMode(item._id, item.text)}
          deleteToDo={() => deleteToDo(item._id)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: 16,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default TaskList;
