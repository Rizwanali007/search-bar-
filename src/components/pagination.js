import { View, Text, FlatList, ActivityIndicator, LogBox } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
LogBox.ignoreLogs(['Warning: ...'])

const Pagination = () => {
    LogBox.ignoreLogs(['Warning: ...'])
    useEffect(() => {
        getData();
        // pullToRefresh();
        // reduceArray();
    }, [offset])
    const [offset, setOffset] = useState(6)
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const reduceArray = () => {
        let temp = [
            { id: 1, name: "riz1" }, { id: 2, name: "riz2" }, { id: 3, name: "riz3" },
            { id: 4, name: "riz4" }, { id: 5, name: "riz5" }, { id: 6, name: "riz6" },
            { id: 7, name: "riz7" }, { id: 8, name: "riz8" }, { id: 9, name: "riz9" },
            { id: 10, name: "riz10" }, { id: 11, name: "riz11" }, { id: 12, name: "riz12" },
            { id: 13, name: "riz13" }, { id: 14, name: "riz14" }, { id: 15, name: "riz15" }
        ]
        console.log("temp BEFORe", temp.length, temp)
        const check = temp.slice(0, 3)
        temp.splice(0, 3)
        console.log("temp AAFTER", temp.length, temp)

    }

    const getData = async () => {
        // const loop = [1, 2, 3, 4, 5]
        let tempData = []
        for (let i = 1; i <= 5; i++) {

            setLoading(true);
            await axios.get(`https://abooutreactapis.000webhostapp.com/getpost.php?offset=${i}`)
                .then((response) => {
                    // console.log("RESPONSE>>>>>>>>>", i, "...............", response.data.results);
                    // setOffset(offset + 1)
                    tempData = [...tempData, ...response.data.results]
                    // setData([...data, ...response.data.results])
                    setLoading(false);
                }).catch((error) => console.log("ERROR", error))

        }
        console.log("AFTER LOOP....", tempData.length);
        setData(tempData)
        // setDataShow(data)
    };
    // console.log("offset....", offset)
    const onEnd = async () => {
        console.log("ON END")
        setLoading(true);
        await axios.get(`https://abooutreactapis.000webhostapp.com/getpost.php?offset=${offset}`)
            .then((response) => {
                // console.log("RESPONSE>>>>>>>>>", response.data.results);
                setOffset(offset + 1)
                data.splice(0, 10)
                setData([...data, ...response.data.results])
                setLoading(false);
            }).catch((error) => console.log("ERROR", error))
    }

    const pullToRefresh = async () => {
        let pageNo = offset - 5
        console.log("offset value pullToRefresh", pageNo)
        setLoading(true);
        await axios.get(`https://abooutreactapis.000webhostapp.com/getpost.php?offset=${pageNo}`)
            .then((response) => {
                console.log("RESPONSE pullToRefresh >>>>>>>>>", response.data.results);
                data.splice(data.length - 10, data.length)
                setData([...response.data.results, ...data])
                setOffset(offset - 1)
                setLoading(false);
            }).catch((error) => console.log("ERROR", error))
    }

    const onRefresh = () => {
        setRefreshing(true);
        pullToRefresh();
        setRefreshing(false)
    }

    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ marginTop: 50, fontSize: 40, fontWeight: "700" }}>Pagination  </Text>
            <FlatList
                data={data}
                onEndReachedThreshold={0.5}
                onEndReached={() => onEnd()}
                renderItem={({ item }) => {
                    return (
                        <View style={{ marginLeft: 15, margin: 10 }}>
                            <Text>{item.id}{") "}{item.title}</Text>
                        </View>
                    )
                }}
                refreshing={refreshing} // Added pull to refesh state
                onRefresh={onRefresh} // Added pull to refresh control
                ListFooterComponent={() => {
                    return (
                        <ActivityIndicator
                            color="grey"
                            loading={true}
                            size={50}
                            style={{ height: 50, marginBottom: 30 }}
                        />
                    )
                }}
            />
        </View>
    )
}

export default Pagination