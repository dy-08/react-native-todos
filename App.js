import React from 'react';
import { StyleSheet, Text, View, TextInput, Platform, FlatList, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import { useState } from 'react';

export default function App() {
    const [text, setText] = useState('');
    const [todos, setTodos] = useState([]);
    const myUniqueId = uuid.v4();

    const handleAdd = () => {
        if (!text.trim()) return;
        const todo = { id: myUniqueId, title: text.trim() };
        setTodos([...todos, todo]);
        setText('');
    };
    const handleDelete = (id) => setTodos(todos.filter((todo) => todo.id !== id));

    return (
        <View style={styles.container}>
            <View style={styles.containerInner}>
                <Text style={styles.title}>TodoApp</Text>
                <View style={styles.inputWrap}>
                    <TextInput style={styles.input} placeholder='todo' value={text} onChangeText={setText} />
                    <Pressable onPress={handleAdd}>
                        <Text style={styles.addButton}>추가</Text>
                    </Pressable>
                </View>
                {/* ListEmptyComponent: 비어있을 때 */}
                <FlatList
                    data={todos}
                    keyExtractor={(todo) => todo.id}
                    ListEmptyComponent={<Text>Empty</Text>}
                    renderItem={({ item, index }) => (
                        <Pressable style={styles.contents} onLongPress={() => handleDelete(item.id)}>
                            <View style={styles.contentBox}>
                                <Text>{index + 1}</Text>
                                <Text>{item.title}</Text>
                            </View>
                            <Text style={styles.deleteButton}>onLongPress시 삭제</Text>
                        </Pressable>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    containerInner: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
    },
    inputWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    input: {
        width: 200,
        borderWidth: 0.5,
        borderColor: '#2d2d2d',
        borderRadius: 4,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
    },
    addButton: {
        backgroundColor: 'transparent',
        fontSize: 16,
        borderWidth: 0.5,
        padding: 11,
        borderRadius: 4,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'green',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        fontSize: 10,
        borderWidth: 0.5,
        padding: 11,
        borderRadius: 4,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'crimson',
        textAlign: 'center',
    },
    contents: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    contentBox: {
        flexDirection: 'row',
        gap: 14,
    },
});
