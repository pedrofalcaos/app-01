import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TaskList from './src/components/TaskList';
import { addTask, deleteTask, deleteAllTasks, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const updateMode = (_id: string, text: string) => {
    setIsUpdating(true);
    setText(text);
    setTaskId(_id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('./assets/task-app-banner.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerRow}>
          <Text style={styles.header}>Tarefas</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}</Text>
          </View>
        </View>

        <View style={styles.top}>
          <TextInput
            style={styles.input}
            placeholder="Adicione uma tarefa..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={(val) => setText(val)}
            maxLength={100}
            keyboardType="default"
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity
          style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
          disabled={!text.trim()}
          onPress={
            isUpdating
              ? () => updateTask(taskId, text, setTasks, setText, setIsUpdating)
              : () => addTask(text, setText, setTasks)
          }
        >
          <Text style={styles.addButtonText}>
            {isUpdating ? "Atualizar tarefa" : "Adicionar tarefa"}
          </Text>
        </TouchableOpacity>

        {tasks.length > 0 && (
          <View style={styles.deleteAll}>
            <Button
              title="Excluir todas as tarefas"
              color="#cc0000"
              onPress={() => deleteAllTasks(tasks, setTasks)}
            />
          </View>
        )}

        <TaskList
          tasks={tasks}
          completedIds={completedIds}
          onUpdate={(id, text) => updateMode(id, text)}
          onDelete={(id) => deleteTask(id, setTasks)}
          onToggleComplete={toggleComplete}
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    width: '100%',
    height: 120,
    marginTop: 16,
  },
  headerRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  badge: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  top: {
    marginTop: 16,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  deleteAll: {
    marginTop: 12,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#1a1a2e',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#aaa',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
