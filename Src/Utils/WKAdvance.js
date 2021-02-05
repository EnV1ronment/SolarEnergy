import WKAdvance from "./WKAdvance"

/**
 * Change unit and value
 * @returns
 */

export default function (value, unit, isEnd = false) {
    if (value > 1000 && typeof value === 'number' && !isEnd) {
        switch (unit) {
            case 'Wh':
                unit = 'kWh';
                break;
            case 'kWh':
                unit = 'MWh';
                break;
            case 'MWh':
                unit = 'GWh';
                break;
            case 'kW':
                unit = 'MW';
                break;
            case 'MW':
                unit = 'GW';
                break;
            default: // If no unit found, return.
                isEnd = true;
        }
        if (!isEnd) {
            value /= 1000;
        }
        return WKAdvance(value, unit, isEnd);
    } else {
        value = value.toFixed(2);
        return {
            value,
            unit,
            formattedValue: `${value}${unit}`,
        };
    }
}