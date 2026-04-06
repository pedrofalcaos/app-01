import React from 'react';
import { SectionList, Text, View, StyleSheet } from 'react-native';
import { TaskItem as TaskData } from '../utils/handle-api';
import TaskItem from './TaskItem';

interface Section {
  title: string;
  data: TaskData[];
}

interface Props {
  tasks: TaskData[];
  completedIds: Set<string>;
  onUpdate: (id: string, text: string, dueDate: string | null) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskList: React.FC<Props> = ({ tasks, completedIds, onUpdate, onDelete, onToggleComplete }) => {
  const pending = tasks.filter((t) => !completedIds.has(t._id));
  const completed = tasks.filter((t) => completedIds.has(t._id));

  const sections: Section[] = [
    { title: 'A Fazer', data: pending },
    { title: 'Concluídas', data: completed },
  ].filter((s) => s.data.length > 0);

  if (tasks.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Nenhuma tarefa ainda. Adicione uma acima!</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          isCompleted={completedIds.has(item._id)}
          onUpdate={() => onUpdate(item._id, item.text, item.dueDate ?? null)}
          onDelete={() => onDelete(item._id)}
          onToggleComplete={() => onToggleComplete(item._id)}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      style={styles.list}
      stickySectionHeadersEnabled={false}
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
  sectionHeader: {
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default TaskList;
