import { View, Text, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const SearchBar = () => {

    useEffect(() => {
        getData()
    }, [])

    const [data, setData] = useState()
    const [masterData, setmasterData] = useState([])
    const [search, setSearch] = useState('')

    const getData = async () => {
        await axios.get('https://jsonplaceholder.typicode.com/users/')
            .then((response) => {
                // console.log("RESPONSE", response.data);
                setData(response.data)
                setmasterData(response.data)
            }).catch((error) => {
                console.log("ERROR", error)
            })
    }

    const searchFilter = (text) => {
        // console.log("SEARCH FILTER 1ST LOG",text)
        if (text) {
            let newData = masterData.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            newData = newData.map(item => {
                return { ...item, search: text }
            })
            setData(newData)
            setSearch(text);
        }
        else {
            console.log("ELSE")
            setData(masterData);
            setSearch(text);
        }

    }

    const getHighlightedText = (text, tempSearch) => {
        // console.log("TEMPSEARCH", tempSearch);
        // console.log("TEXT  getHighlightedText", text);
        // let parts = findString('abc hello abcd jdhabc', 'h');
        let parts = findString(text, tempSearch)
        // console.log('>>> parts', parts);
        return <Text >
            {parts.map(part => part.toUpperCase() === "_"
                ? <Text style={{
                    color: 'blue', fontSize: 30, textDecorationColor: "grey",
                    textDecorationLine: "underline",
                }}>{tempSearch}</Text>
                : <Text style={{
                    fontSize: 30, textDecorationColor: "grey",
                    textDecorationLine: "underline",
                }}>{part}</Text>)}
        </Text>;
    }

    function findString(str1, str2) {
        console.log("str1", str1, "str2", str2)
        let result = [];
        let startIndex = 0;
        let index = str1.indexOf(str2, startIndex);
        while (index !== -1) {
            // check if the index is the first index, if not push a space
            if (startIndex !== 0) {
                result.push(" ", str1.substring(startIndex, index), "_");
            } else {
                result.push(" ", str1.substring(startIndex, index), "_");
            }
            startIndex = index + str2.length;
            index = str1.indexOf(str2, startIndex);
        }
        result.push(str1.substring(startIndex));
        // console.log("RESULTS",result)
        return result;
    }

    // const displayItem = (item) => {
    //     console.log("ITEM", item)
    //     return (
    // <View style={{ flex: 1, alignItems: "center", marginBottom: 15, borderWidth: 1, borderRadius: 15, margin: 10 }}>
    //     <Text
    //         style={{
    //             fontSize: 30, textDecorationColor: "grey",
    //             textDecorationLine: "underline",
    //         }}
    //     >{item}</Text>
    //     {getHighlightedText(item)}
    // </View>
    //     )
    // }

    return (
        <View style={{ flex: 1, alignItems: "center", marginTop: 75 }}>
            <Text
                style={{
                    fontSize: 50, fontWeight: "700",
                    textDecorationLine: "underline"
                }}
            >
                Api-Calling
            </Text>
            <TextInput
                style={{
                    marginTop: 10, marginRight: 15, marginLeft: 15,
                    borderWidth: 1, borderColor: "grey",
                    borderRadius: 10, width: 320, height: 45
                }}
                placeholder="  search here"
                value={search}
                onChangeText={(text) => searchFilter(text)}
            />
            <View
                style={{
                    width: "90%", height: "88%",
                    marginTop: 10, borderWidth: 1,
                    borderRadius: 15,
                }}
            >

                <FlatList
                    data={data}
                    keyExtractor={item => item.id}
                    extraData={data}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ flex: 1, alignItems: "center", marginBottom: 15, borderWidth: 1, borderRadius: 15, margin: 10 }}>
                                <Text
                                    style={{
                                        fontSize: 30, textDecorationColor: "grey",
                                        textDecorationLine: "underline",
                                    }}
                                >
                                    {item.id}
                                </Text>
                                {getHighlightedText(item.name, item.search)}
                            </View>
                        )
                        // displayItem(item.name)
                        // console.log("RENDERITEM", item.name)
                    }}
                // keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
}

export default SearchBar