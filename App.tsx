import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  Image,
  Button,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AntDesign, Feather } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import { addTask, deleteAllTasks, deleteTask, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Estado do modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState('');
  const [modalText, setModalText] = useState('');
  const [modalCompleted, setModalCompleted] = useState(false);
  const [modalDueDate, setModalDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setModalText('');
    setModalCompleted(false);
    setModalDueDate(null);
    setShowDatePicker(false);
    setModalVisible(true);
  };

  const openEditModal = (id: string, text: string, dueDate: string | null) => {
    setModalMode('edit');
    setEditingId(id);
    setModalText(text);
    setModalCompleted(false);
    setModalDueDate(dueDate ? new Date(dueDate) : null);
    setShowDatePicker(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setShowDatePicker(false);
  };

  const handleModalConfirm = () => {
    if (!modalText.trim()) return;
    const isoDate = modalDueDate ? modalDueDate.toISOString() : null;
    if (modalMode === 'edit') {
      updateTask(editingId, modalText.trim(), modalCompleted, isoDate, setTasks, () => {}, () => {});
    } else {
      addTask(modalText.trim(), modalCompleted, isoDate, () => {}, setTasks);
    }
    closeModal();
  };

  const handleDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selected) setModalDueDate(selected);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleToggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require('./assets/task-app-banner.png')}
            style={styles.logo}
          />
          <Text style={styles.header}>Tarefas</Text>
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Total de Tarefas: {tasks.length}</Text>
        </View>

        <View style={styles.nativeButtonContainer}>
          <Button
            title="Excluir todas as tarefas"
            color="#d9534f"
            onPress={() => deleteAllTasks(tasks, setTasks)}
          />
        </View>

        <TaskList
          tasks={tasks}
          completedIds={completedIds}
          onUpdate={openEditModal}
          onDelete={(id) => deleteTask(id, setTasks)}
          onToggleComplete={handleToggleComplete}
        />

        <TouchableOpacity style={styles.fab} onPress={openAddModal}>
          <AntDesign name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal de adicionar / editar */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.modalTitle}>
                    {modalMode === 'edit' ? 'Editar Tarefa' : 'Nova Tarefa'}
                  </Text>
                  <TouchableOpacity onPress={closeModal}>
                    <AntDesign name="close" size={20} color="#888" />
                  </TouchableOpacity>
                </View>

                {/* Descrição */}
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="O que precisa ser feito?"
                  placeholderTextColor="#aaa"
                  value={modalText}
                  onChangeText={setModalText}
                  maxLength={80}
                  multiline
                />

                {/* Status */}
                <Text style={styles.label}>Status</Text>
                <TouchableOpacity
                  style={styles.checkRow}
                  onPress={() => setModalCompleted((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, modalCompleted && styles.checkboxChecked]}>
                    {modalCompleted && <AntDesign name="check" size={14} color="#fff" />}
                  </View>
                  <Text style={styles.checkLabel}>
                    {modalCompleted ? 'Concluída' : 'Pendente'}
                  </Text>
                </TouchableOpacity>

                {/* Data */}
                <Text style={styles.label}>Data de vencimento</Text>
                {Platform.OS === 'web' ? (
                  <View style={styles.dateRow}>
                    <Feather name="calendar" size={18} color="#888" style={styles.dateIcon} />
                    {/* @ts-ignore */}
                    <input
                      type="date"
                      value={modalDueDate ? modalDueDate.toISOString().split('T')[0] : ''}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e: any) => {
                        const val = e.target.value;
                        setModalDueDate(val ? new Date(val + 'T12:00:00') : null);
                      }}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: 15,
                        color: modalDueDate ? '#1a1a2e' : '#aaa',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    />
                    {modalDueDate && (
                      <TouchableOpacity onPress={() => setModalDueDate(null)}>
                        <AntDesign name="close" size={16} color="#aaa" />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.dateRow}
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.7}
                    >
                      <Feather name="calendar" size={18} color="#888" style={styles.dateIcon} />
                      <Text style={[styles.dateText, !modalDueDate && styles.datePlaceholder]}>
                        {modalDueDate ? formatDate(modalDueDate) : 'Selecionar data'}
                      </Text>
                      {modalDueDate && (
                        <TouchableOpacity onPress={() => setModalDueDate(null)}>
                          <AntDesign name="close" size={16} color="#aaa" />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={modalDueDate ?? new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                        locale="pt-BR"
                      />
                    )}
                  </>
                )}

                {/* Botões */}
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmButton, !modalText.trim() && styles.confirmDisabled]}
                    onPress={handleModalConfirm}
                    disabled={!modalText.trim()}
                  >
                    <Text style={styles.confirmText}>
                      {modalMode === 'edit' ? 'Salvar' : 'Adicionar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

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
  headerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counterContainer: {
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    color: '#666',
  },
  nativeButtonContainer: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1a1a2e',
    marginBottom: 20,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1a1a2e',
    borderColor: '#1a1a2e',
  },
  checkLabel: {
    fontSize: 15,
    color: '#1a1a2e',
    fontWeight: '500',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a2e',
  },
  datePlaceholder: {
    color: '#aaa',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
  },
  confirmDisabled: {
    backgroundColor: '#ccc',
  },
  confirmText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
  },
});
