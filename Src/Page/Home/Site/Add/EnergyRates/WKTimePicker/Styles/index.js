const headerItemHeight = 50;
export default {
    popUp: {
        modal: {
            justifyContent: 'flex-end',
        },
        header: {
            height: headerItemHeight,
            flexDirection: 'row',
            backgroundColor: 'rgb(28, 39, 58)',
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
            fontSize: 18
        },
        title: {
            color: 'white',
            textAlign: 'center',
            fontSize: 18
        },
        okText: {
            color: 'rgb(47, 111, 229)',
            textAlign: 'right',
            marginRight: 10,
            fontSize: 18
        },
    },
};