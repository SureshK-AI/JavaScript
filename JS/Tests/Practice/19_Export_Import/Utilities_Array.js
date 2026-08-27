// use export keyword to export the function and variable from this file.
    export function findLargest(inpArr) {
        let retValue = 0;

        for (let i=0; i<inpArr.length; i++) {
            let eleValue=inpArr[i];

            if (retValue < eleValue) {
                retValue = eleValue;
            }
        }
        return retValue;
    }

    export default function  removeDupInArray(inpArr) {
        let retValue = [];

        for (let i=0; i<inpArr.length; i++) {
            let eleValue=inpArr[i];

            if (!retValue.includes(eleValue)) {
                retValue.push(eleValue);        }
        }
        return retValue;
    }
