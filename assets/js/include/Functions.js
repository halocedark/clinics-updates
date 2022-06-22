let addPatient;
let searchPatients;
let deletePatients;
let addPrescription;
let searchPrescriptions;
let getPrescription;
let deletePrescriptions;
let updatePrescription;
// Overrided in index.js
let rebindEvents;

$(function()
{

// update Prescription
updatePrescription = (PrescObject) =>
{
	var url = API_END_POINT+'Prescriptions/update';
	PrescObject['clinicId'] = USER_CONFIG.clinicId;
	var data = {
		PrescObject: PrescObject
	};
	return sendAPIPostRequest(url, data);
}
// delete Prescriptions
deletePrescriptions = (list) =>
{
	var url = API_END_POINT+'Prescriptions/deleteList';
	var data = {
		list: list
	};
	return sendAPIPostRequest(url, data);
}
// get Prescription
getPrescription = (prescriptionId) =>
{
	var url = API_END_POINT+'Prescriptions/info';
	var data = {
		prescriptionId: prescriptionId
	};
	return sendAPIPostRequest(url, data);
}
// search Prescriptions
searchPrescriptions = (query) =>
{
	var url = API_END_POINT+'Prescriptions/search';
	var data = {
		query: query
	};
	return sendAPIPostRequest(url, data);
}
// add Prescription
addPrescription = (PrescObject) =>
{
	var url = API_END_POINT+'Prescriptions/add';
	PrescObject['clinicId'] = USER_CONFIG.clinicId;
	var data = {
		PrescObject: PrescObject
	};
	return sendAPIPostRequest(url, data);
}
// delete Patients
deletePatients = (list) =>
{
	var url = API_END_POINT+'Patients/deleteList';
	var data = {
		list:list
	}

	return sendAPIPostRequest(url, data);
}
// search Patients
searchPatients = (query) =>
{
	var url = API_END_POINT+'Patients/search';
	var data = {
		query:query
	}

	return sendAPIPostRequest(url, data);
}
// add Patient
addPatient = (PatientObject) =>
{
	var url = API_END_POINT+'Patients/add';
	var data = {
		PatientObject:PatientObject
	}

	return sendAPIPostRequest(url, data);
}



});




