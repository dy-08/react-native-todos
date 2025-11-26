import React from 'react';
import { StyleSheet, Text, View, TextInput, Platform, FlatList, Pressable, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
    const [text, setText] = useState('');
    const [todos, setTodos] = useState([]);
    const myUniqueId = uuid.v4();
    const [date, setDate] = useState(new Date());
    const [togglePicker, setTogglePicker] = useState(false);
    const [photo, setPhoto] = useState(null);

    const handleDate = (e, changedDate) => {
        if (Platform.OS === 'android') {
            setTogglePicker(false);
        }
        if (changedDate) {
            setDate(changedDate);
        }
    };

    const formatDate = (date) => {
        const yy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yy}-${mm}-${dd}`;
    };

    const handleAdd = () => {
        if (!text.trim()) return;
        const todo = { id: myUniqueId, title: text.trim(), date: formatDate(date), image: photo };
        setTodos([...todos, todo]);
        setText('');
        setPhoto(null);
    };
    const handleDelete = (id) => setTodos(todos.filter((todo) => todo.id !== id));

    const getPhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('카메라 권한을 설정해주세요');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.9,
        });

        if (result.canceled) return;
        const uri = result.assets[0].uri;
        setPhoto(uri);
    };
    const getGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('갤러리 권한을 설정해주세요');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.9,
        });
        if (result.canceled) return;
        const uri = result.assets[0].uri;
        setPhoto(uri);
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerInner}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.maintxt}>Todo App</Text>
                        <Text style={styles.subtxt}>Check your todos</Text>
                    </View>
                    <View>
                        <Pressable>
                            <Text>다크모드</Text>
                        </Pressable>
                    </View>
                </View>
                <View>
                    <Pressable onPress={() => setTogglePicker((prev) => !prev)}>
                        <Text>{formatDate(date)}</Text>
                    </Pressable>
                    {togglePicker && (
                        <DateTimePicker
                            value={date}
                            mode='date'
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDate}
                        />
                    )}
                </View>
                <View>
                    <Pressable onPress={getPhoto}>
                        <Text>사진찍기</Text>
                    </Pressable>
                    <Pressable onPress={getGallery}>
                        <Text>갤러리</Text>
                    </Pressable>
                </View>
                <View style={styles.imagePreviewBox}>
                    {photo && <Image style={styles.image} source={{ uri: photo }} />}
                </View>

                <View style={styles.inputWrap}>
                    <TextInput style={styles.input} placeholder='todo' value={text} onChangeText={setText} />

                    <Pressable onPress={handleAdd}>
                        <Text style={styles.addButton}>추가</Text>
                    </Pressable>
                </View>
                {/* ListEmptyComponent: 비어있을 때 */}
                <FlatList
                    tList
                    data={todos}
                    keyExtractor={(todo) => todo.id}
                    ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Empty</Text>}
                    renderItem={({ item, index }) => (
                        <Pressable style={styles.contents} onLongPress={() => handleDelete(item.id)}>
                            <View style={styles.contentBox}>
                                <View style={styles.smallImage}>
                                    <Image style={styles.image} source={{ uri: item.image }} />
                                </View>
                                <Text>{index + 1}</Text>
                                <Text>{item.title}</Text>
                                <Text>{item.date}</Text>
                            </View>
                            {/* onLongPress시 삭제 */}
                            <Text style={styles.deleteButton}>삭제</Text>
                        </Pressable>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 'calc(100vw - 40)',
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    containerInner: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    maintxt: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtxt: {
        fontSize: 18,
    },

    // title: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    // },
    // inputWrap: {
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     gap: 10,
    //     padding: 20,
    //     marginTop: 10,
    //     marginBottom: 10,
    // },
    // input: {
    //     width: 200,
    //     borderWidth: 0.5,
    //     borderColor: '#2d2d2d',
    //     borderRadius: 4,
    //     paddingTop: 10,
    //     paddingBottom: 10,
    //     paddingLeft: 10,
    // },
    // addButton: {
    //     backgroundColor: 'transparent',
    //     fontSize: 16,
    //     borderWidth: 0.5,
    //     padding: 11,
    //     borderRadius: 4,
    //     color: 'white',
    //     fontWeight: 'bold',
    //     backgroundColor: 'green',
    // },
    // deleteButton: {
    //     backgroundColor: 'transparent',
    //     fontSize: 10,
    //     borderWidth: 0.5,
    //     padding: 11,
    //     borderRadius: 4,
    //     color: 'white',
    //     fontWeight: 'bold',
    //     backgroundColor: 'crimson',
    //     textAlign: 'center',
    // },
    // contents: {
    //     flexDirection: 'row',
    //     marginBottom: 20,
    //     gap: 10,
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     marginTop: 10,
    // },
    // contentBox: {
    //     flexDirection: 'row',
    //     gap: 14,
    // },
    // imagePreviewBox: {
    //     width: '380',
    //     aspectRatio: '16/9',
    // },
    // smallImage: {
    //     width: '40',
    //     height: '40',
    //     backgroundColor: 'blue',
    // },
    // image: {
    //     width: '100%',
    //     height: '100%',
    //     objectFit: 'cover',
    // },
});
