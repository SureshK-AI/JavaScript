// ============================================================
// INDEX.JS - BARREL / CENTRAL EXPORT FILE
// ============================================================
//
// Re-export utilities from different modules so that other
// files can import them from one central location.
//
// ============================================================

export { findLargest, default } from './Utilities_Array.js';
// export {findLargest, default as removeDupInArray} from './Utilities_Array.js';

export { countVowelsAliasDefinedDuringExport } from './Utilities_String.js';

export { isPrimeNUmber } from './Utilities_Number.js';
export { URL, apiKey } from './Utilities_GlobalVariables.js';

    