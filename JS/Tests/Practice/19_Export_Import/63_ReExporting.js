import {isPrimeNUmber} from './index.js';
import {countVowelsAliasDefinedDuringExport} from './index.js';
import removeDupInArray, {findLargest} from './index.js';
import {URL, apiKey} from './index.js';


console.log(removeDupInArray([1, 2, 2, 3, 4, 4, 5]));
console.log(findLargest([10, 25, 15, 30, 20]));
console.log(countVowelsAliasDefinedDuringExport("Hello World"));
console.log(isPrimeNUmber(7));
console.log("Base URL:", URL);
console.log("API Key:", apiKey);