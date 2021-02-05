const headerItemHeight = 44;
export default {
    popUp: {
        modal: {
            justifyContent: 'flex-end',
        },
        header: {
            height: headerItemHeight,
            flexDirection: 'row',
            backgroundColor: '#081643',
        },
        headerItem: {
            flex: 1,
            height: headerItemHeight,
            borderBottomWidth: 0.5,
            borderBottomColor: '#00a6ff',
            justifyContent: 'center',
        },
        dismissText: {
            color: 'red',
            marginLeft: 10,
        },
        title: {
            color: 'white',
            textAlign: 'center',
        },
        okText: {
            color: '#00a6ff',
            textAlign: 'right',
            marginRight: 10,
        },
    },
};