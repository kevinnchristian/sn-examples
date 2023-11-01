/* Create dependency on widget:

    - JS Includes:
        https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.7/xlsx.full.min.js
*/

// Insert code in Client controller:
c.exportToExcel = function() {
    var tableID = "element_table_id";
    var fileName = "save_name";
    var fileType = ".xlsx";

    $timeout(function() {
        var elt = document.getElementById(tableID);
        var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
        
        return XLSX.writeFile(wb, fileName + fileType);
    }, 1000);
}