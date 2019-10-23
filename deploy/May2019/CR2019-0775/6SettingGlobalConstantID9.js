/*$.when(
    $.ajax({
        url: GCDOCSWebAdminCommon.getLogsFolderFileName('CONSTANTS.txt'),
        async: false,
        dataType: "text"
    })
).then(function (aData) {
	iimSet("VAR1", "Node1")
	iimSet("VAR2", "Node2")
	iimSet("VAR3", "Node4")

})

})*/

function AddLicenceCallback(data) {
	iimSet("VAR1", data[0][1])
	iimSet("VAR2", data[1][1])
	iimSet("VAR3", data[2][1])
}

GCDOCSWebAdminCommon.loadCSV(GCDOCSWebAdminCommon.getLogsFolderFileName('CONSTANTS.txt'), AddLicenceCallback);
