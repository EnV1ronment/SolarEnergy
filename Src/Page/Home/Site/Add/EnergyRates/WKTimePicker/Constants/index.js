/*************************** hour type ***************************/

export const hourType = [
    { 
        key: 'hour',
        data: [{ value: '00', label: '00' }, {value: '01', label: '01' }, {value: '02', label: '02' }, 
        {value: '03', label: '03' }, {value: '04', label: '04' }, {value: '05', label: '05' }, 
        {value: '06', label: '06' }, {value: '07', label: '07' }, {value: '08', label: '08' }, 
        {value: '09', label: '09' }, {value: '10', label: '10' }, {value: '11', label: '11' }, 
        {value: '12', label: '12' }, {value: '13', label: '13' }, {value: '14', label: '14' }, 
        {value: '15', label: '15' }, {value: '16', label: '16' }, {value: '17', label: '17' },
        {value: '18', label: '18' }, {value: '19', label: '19' }, {value: '20', label: '20' }, 
        {value: '21', label: '21' }, {value: '22', label: '22' }, {value: '23', label: '23' }]
    },
    { 
        key: 'minute',
        data: [{value: '00', label: '00' },{value: '30', label: '30' }]
    },
 ];

/*************************** locale ***************************/

export const locale_en_US = {
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    am: 'AM',
    pm: 'PM',
};

export const locale_zh_CN = {
    year: '',
    month: '',
    day: '',
    hour: '时',
    minute: '分',
    am: '上午',
    pm: '下午',
};

/*************************** date mode ***************************/

export const date_mode = {
    year: 'year',
    month: 'month',
    date: 'date',
};