/* jshint esversion:6 */

const context = require.context('.', false, /-spec.js$/);
context.keys().forEach(context);

export default context;
