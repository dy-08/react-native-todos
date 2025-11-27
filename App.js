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
    const parseDay = (day) => {
        switch (day) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
        }
    };
    const parseMonth = (month) => {
        const list = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        return `${list[month]}`;
    };
    const formatDate = (date) => {
        const parsedMonth = parseMonth(date.getMonth());
        const parsedDate = String(date.getDate()).padStart(2, '0');
        const parsedDay = parseDay(date.getDay());
        return `${parsedDay}-${parsedDate}-${parsedMonth}`;
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
                </View>

                <LinearGradient
                    colors={['#8985F2', '#73D9B3']} // 시작색, 끝색
                    start={{ x: 0, y: 0 }} // 왼쪽 위
                    end={{ x: 1, y: 0 }} // 오른쪽 위 (약 70deg 느낌)
                    style={styles.gradientWrap}
                >
                    <Pressable style={styles.dateTextWrap} onPress={() => setTogglePicker((prev) => !prev)}>
                        <Text style={styles.dateText}>{formatDate(date)}</Text>
                    </Pressable>

                    <View style={styles.dateWrap}>
                        {togglePicker && (
                            <DateTimePicker
                                value={date}
                                mode='date'
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDate}
                            />
                        )}
                    </View>

                    <View style={styles.featurePhotos}>
                        <Pressable onPress={getPhoto} style={styles.btnRound}>
                            <MaterialIcons name='add-a-photo' size={20} color='black' />
                        </Pressable>
                        <Pressable onPress={getGallery} style={styles.btnRound}>
                            <FontAwesome name='photo' size={20} color='black' />
                        </Pressable>
                        <View style={styles.imagePreviewBox}>
                            {photo && <Image style={styles.image} source={{ uri: photo }} />}
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.inputWrap}>
                    <TextInput style={styles.input} placeholder='todo' value={text} onChangeText={setText} />
                    <Pressable onPress={handleAdd} style={styles.btnAdd}>
                        <Text style={styles.textAdd}>Add</Text>
                    </Pressable>
                </View>

                <View style={styles.contentBox}>
                    {/* ListEmptyComponent: 비어있을 때 */}
                    <FlatList
                        style={styles.contentboxList}
                        data={todos}
                        horizontal
                        keyExtractor={(todo) => todo.id}
                        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Empty</Text>}
                        renderItem={({ item, index }) => (
                            <Pressable style={styles.contents} onLongPress={() => handleDelete(item.id)}>
                                <View style={styles.itemBox}>
                                    <View style={styles.itemPreviewImageWrap}>
                                        <View style={styles.itemPreviewImageBox}>
                                            <Image style={styles.image} source={{ uri: item.image }} />
                                        </View>
                                    </View>
                                    {/* <Text>{index + 1}</Text> */}
                                    <Text style={styles.date}>{item.date}</Text>
                                    <Text style={styles.title}>{item.title}</Text>
                                </View>
                                {/* onLongPress시 삭제 */}
                                <Text style={styles.deleteButton}>삭제</Text>
                            </Pressable>
                        )}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    containerInner: {
        width: '100%',
        height: 'auto',
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
    //
    maintxt: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtxt: {
        fontSize: 18,
        color: 'grey',
    },
    gradientWrap: {
        width: '100%',
        height: '220',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
        padding: 14,
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    dateText: {
        color: '#f3f3f3',
        fontWeight: 'bold',
        fontSize: 19,
    },
    dateWrap: {
        position: 'absolute',
        transform: 'scale(0.8)',
        zIndex: 10,
        right: -50,
        top: 20,
    },

    featurePhotos: {
        gap: 4,
        flexDirection: 'row',
        boxShadow: '1 1 1 rega(0,0,0,0.5)',
    },
    btnRound: {
        width: 32,
        height: 32,
        borderRadius: 40,
        backgroundColor: '#f3f3f3',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
    },
    //
    inputWrap: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 4,
        marginBottom: 20,
    },
    input: {
        width: '76%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 4,
        paddingLeft: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnAdd: {
        width: '19%',
        height: 40,
        borderRadius: 4,
        backgroundColor: '#46a582ff',
    },
    textAdd: {
        width: '100%',
        height: 40,
        lineHeight: 40,
        fontSize: 20,
        textAlign: 'center',
        color: '#f3f3f3',
        fontWeight: 'bold',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
    },
    imagePreviewBox: {
        width: 32,
        height: 32,
        borderRadius: 4,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    //
    contentBox: {
        width: '100%',
        marginTop: 20,
    },
    itemBox: {
        width: '100%',
        height: 300,
        backgroundColor: '#fcfcfcff',
        borderRadius: 4,
        padding: 20,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
        marginRight: 40,
    },
    itemPreviewImageWrap: {
        width: 66,
        height: 66,
        borderRadius: '100%',
        overflow: 'hidden',
        backgroundColor: '#e7e7e7ff',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
    },
    itemPreviewImageBox: {
        width: 36,
        height: 36,
        borderRadius: 4,
        overflow: 'hidden',
    },
    date: {
        fontSize: 15,
    },
    title: {
        fontSize: 20,
    },
});
