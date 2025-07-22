import { Ionicons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../firebase';

export default function TodoScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(docs);
    });

    return unsubscribe;
  }, []);

  const handleAddTask = async () => {
    if (!task.trim()) return;
    
    try {
      await addDoc(collection(db, 'tasks'), {
        text: task,
        completed: false,
        userId: auth.currentUser?.uid,
        createdAt: new Date(),
      });
      setTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'tasks', id), { completed: !current });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Tasks</Text>

      <View style={styles.inputRow}>
        <TextInput
          value={task}
          onChangeText={setTask}
          placeholder="Add a new task..."
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAddTask}
          blurOnSubmit={false}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleComplete(item.id, item.completed)}>
              <Ionicons
                name={item.completed ? 'checkbox' : 'square-outline'}
                size={22}
                color="#333"
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.taskText,
                { textDecorationLine: item.completed ? 'line-through' : 'none' },
              ]}
            >
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash" size={20} color="#777" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#0a0a23',
    borderRadius: 8,
    padding: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  taskText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});
