/*
 * Helper Methods
 */


/**
 * Helper function getting page offset
 * 
 * @param {*} currentPage 
 * @param {*} listPerPage
 * @returns 
 */

function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}
  
/**
 * Helper function getting rows
 * 
 * @param {*} rows 
 * @returns 
 */
function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}
  

module.exports = {
    getOffset,
    emptyOrRows
}