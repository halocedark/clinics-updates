var Presc = require(APP_DIR_NAME+'assets/js/include/Presc');

var SQLITE_DB = APP_ROOT_PATH+'data/clinics_db.db';

let sqliteDeletePrescList;
let createPrescPreviewFiles;
// Overrided in index.js
let rebindEvents;

$(function()
{

// create Presc Preview Files
createPrescPreviewFiles = (domHTML) =>
{
	return new Promise((resolve, reject) =>
	{
		var dir = APP_ROOT_PATH+'prescription/';
		if ( !fs.existsSync(dir) )
			fs.mkdirSync(dir, {recursive:true});

		var filename = dir+'index.html';
		fs.writeFileSync(filename, domHTML);

		// copy files
		recursiveCopyDirFilesSync(APP_DIR_NAME+'prescription/assets/css/', APP_ROOT_PATH+'prescription/assets/css/');
		recursiveCopyDirFilesSync(APP_DIR_NAME+'prescription/assets/font/', APP_ROOT_PATH+'prescription/assets/font/');
		recursiveCopyDirFilesSync(APP_DIR_NAME+'prescription/assets/ico/', APP_ROOT_PATH+'prescription/assets/ico/');
		recursiveCopyDirFilesSync(APP_DIR_NAME+'prescription/assets/img/logo/', APP_ROOT_PATH+'prescription/assets/img/logo/');
		recursiveCopyDirFilesSync(APP_DIR_NAME+'prescription/assets/img/utils/', APP_ROOT_PATH+'prescription/assets/img/utils/');
		recursiveCopyDirFilesSync(APP_DIR_NAME+'prescription/assets/js/', APP_ROOT_PATH+'prescription/assets/js/');
		recursiveCopyDirFilesSync(APP_DIR_NAME+'prescription/assets/js/include/', APP_ROOT_PATH+'prescription/assets/js/include/');

		resolve('Files have been created!');
	});
}
// sqlite Delete Presc List
sqliteDeletePrescList = (list) =>
{
	var url = API_END_POINT+'Prescriptions/sqliteDeleteList';

	var data = {
		list: list,
		patientId: USER_CONFIG.patientId
	}
	return sendAPIPostRequest(url, data);
}

});




