import React from 'react';
import { StyleSheet, Text, View, TextInput, Platform, FlatList, Pressable, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
                    <View style={styles.featuresBox}>
                        <Pressable onPress={() => setTogglePicker((prev) => !prev)}>
                            <Text>{formatDate(date)}</Text>
                        </Pressable>
                        <View style={styles.featurePhotos}>
                            <Pressable onPress={getPhoto}>
                                <MaterialIcons name='add-a-photo' size={24} color='black' />
                            </Pressable>
                            <Pressable onPress={getGallery}>
                                <FontAwesome name='photo' size={24} color='black' />
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={styles.dateWrap}>
                    <LinearGradient
                        colors={['#E9DCDB', '#DFDDDD30']} // 시작색, 끝색
                        start={{ x: 0, y: 0 }} // 왼쪽 위
                        end={{ x: 1, y: 0 }} // 오른쪽 위 (약 70deg 느낌)
                        style={styles.dateWrap}
                    >
                        {togglePicker && (
                            <DateTimePicker
                                value={date}
                                mode='date'
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDate}
                            />
                        )}
                    </LinearGradient>
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
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        position: 'relative',
        left: 0,
        top: 0,
    },
    maintxt: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtxt: {
        fontSize: 18,
    },
    dateWrap: {
        width: '100%',
        height: 'auto',
        background: '#E9DCDB',
        borderRadius: 8,
        background: 'linear-gradient(70deg, rgba(233, 220, 219, 1) 0%, rgba(223, 221, 221, 1) 100%)',
    },
    featuresBox: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
        justifyContent: 'center',
    },
    featurePhotos: {
        flexDirection: 'row',
        gap: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    imagePreviewBox: {
        width: '96%',
        aspectRatio: '3/2',
    },
});
