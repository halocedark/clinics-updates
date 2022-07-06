let updateManager;
let addTreatmentClass;
let getTreatmentClass;
let updateTreatmentClass;
let deleteTreatmentClass;
// Overrided in index.js
let rebindEvents;

$(function()
{

// delete Treatment Class
deleteTreatmentClass = (list) =>
{
	var url = API_END_POINT+'TreatmentClasses/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// update Treatment Class
updateTreatmentClass = (ClassObject) =>
{
	var url = API_END_POINT+'TreatmentClasses/update';
	var data = {
		ClassObject: ClassObject
	}

	return sendAPIPostRequest(url, data);
}
// get Treatment Class
getTreatmentClass = (classId) =>
{
	var url = API_END_POINT+'TreatmentClasses/info';
	var data = {
		classId: classId
	}

	return sendAPIPostRequest(url, data);
}
// add Treatment Class
addTreatmentClass = (ClassObject) =>
{
	var url = API_END_POINT+'TreatmentClasses/add';
	var data = {
		ClassObject: ClassObject
	}

	return sendAPIPostRequest(url, data);
}
// update Manager
updateManager = (ManagerObject) =>
{
	var url = API_END_POINT+'Manager/update';
	var data = {
		ManagerObject: ManagerObject
	}

	return sendAPIPostRequest(url, data);
}

});




