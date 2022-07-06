let addPatient;
let deletePatients;
let addPrescription;
let searchPrescriptions;
let getPrescription;
let deletePrescriptions;
let updatePrescription;
let addChangedSettings;
let deleteChangedSetting;
let listBloodPressure;
let listDiabetes;
let listWeight;
let listBasin;
let addProduct;
let getProduct;
let searchProducts;
let deleteProducts;
let updateProduct;
let deleteProduct;
let addOrder;
let searchOrders;
let searchOrdersBetweenDates;
let getOrder;
let updateOrder;
let deleteOrders;
let getTreasury;
let listTreasuryExpensesDates;
let filterExpensesByDate;
let deleteExpenses;
let searchClinicEmployees;
let deleteEmployees;
let getEmployee;
let updateEmployeeAtt;
let searchEmployeesAttBetweenDates;
let acceptOrder;
// Overrided in index.js
let rebindEvents;

$(function()
{

// accept Order
acceptOrder = (order_id) =>
{
	var url = API_END_POINT+'Orders/accept';
	var data = {
		order_id: order_id
	};

	return sendAPIPostRequest(url, data);
}
// search Employees Att Between Dates
searchEmployeesAttBetweenDates = (SearchObject) =>
{
	var url = API_END_POINT+'Employees/searchAttBetweenDates';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// update Employee Att
updateEmployeeAtt = (EmployeeObject) =>
{
	var url = API_END_POINT+'Employees/updateAtt';
	var data = {
		EmployeeObject: EmployeeObject
	}

	return sendAPIPostRequest(url, data);
}
// get Employee
getEmployee = (employee_id) =>
{
	var url = API_END_POINT+'Employees/info';
	var data = {
		employee_id: employee_id
	}

	return sendAPIPostRequest(url, data);
}
// delete Employees
deleteEmployees = (list) =>
{
	var url = API_END_POINT+'Employees/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// search Clinic Employees
searchClinicEmployees = (SearchObject) =>
{
	var url = API_END_POINT+'Employees/searchLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// delete Expenses
deleteExpenses = (list) =>
{
	var url = API_END_POINT+'Treasury/deleteList';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// filter Expenses By Date
filterExpensesByDate = (TreasuryObject) =>
{
	var url = API_END_POINT+'Treasury/filterInExpensesByDate';
	var data = {
		TreasuryObject: TreasuryObject
	};

	return sendAPIPostRequest(url, data);
}
//list Treasury Expenses
listTreasuryExpensesDates = (clinicId) =>
{
	var url = API_END_POINT+'Treasury/listExpenses';
	var data = {
		clinicId: clinicId
	};

	return sendAPIPostRequest(url, data);
}
// get Treasury
getTreasury = (clinicId) =>
{
	var url = API_END_POINT+'Treasury/info';
	var data = {
		clinicId: clinicId
	};

	return sendAPIPostRequest(url, data);
}
// delete Orders
deleteOrders = (list) =>
{
	var url = API_END_POINT+'Orders/deleteList';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// update Order
updateOrder = (OrderObject) =>
{
	var url = API_END_POINT+'Orders/update';
	var data = {
		OrderObject: OrderObject
	};

	return sendAPIPostRequest(url, data);
}
// get Order
getOrder = (order_id) =>
{
	var url = API_END_POINT+'Orders/info';
	var data = {
		order_id: order_id
	};

	return sendAPIPostRequest(url, data);
}
// search Orders Between Dates
searchOrdersBetweenDates = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/searchBetweenDates';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// search Orders
searchOrders = (SearchObject) =>
{
	var url = API_END_POINT+'Orders/search';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// add Order
addOrder = (OrderObject) =>
{
	var url = API_END_POINT+'Orders/add';
	var data = {
		OrderObject: OrderObject
	};

	return sendAPIPostRequest(url, data);
}
// delete product
deleteProduct = (productId) =>
{
	var url = API_END_POINT+'Products/delete';
	var data = {
		productId: productId
	};

	return sendAPIPostRequest(url, data);
}
// update Product
updateProduct = (ProductObject) =>
{
	var url = API_END_POINT+'Products/update';
	var fd = new FormData();
	fd.append('ProductObject', JSON.stringify(ProductObject));
	if ( ProductObject.productImage )
		fd.append('productImage', ProductObject.productImage);

	return sendAPIFormDataRequest(url, fd);
}
// delete Products
deleteProducts = (list) =>
{
	var url = API_END_POINT+'Products/deleteList';
	var data = {
		list: list
	};

	return sendAPIPostRequest(url, data);
}
// search Products
searchProducts = (SearchObject) =>
{
	var url = API_END_POINT+'Products/search';
	var data = {
		SearchObject: SearchObject
	};

	return sendAPIPostRequest(url, data);
}
// get Product
getProduct = (productId) =>
{
	var url = API_END_POINT+'Products/info';
	var data = {
		productId: productId
	};

	return sendAPIPostRequest(url, data);
}
// add Product
addProduct = (ProductObject) =>
{
	var url = API_END_POINT+'Products/add';
	var fd = new FormData();
	fd.append('ProductObject', JSON.stringify(ProductObject));
	if ( ProductObject.productImage )
		fd.append('productImage', ProductObject.productImage);

	return sendAPIFormDataRequest(url, fd);
}
// list Basin
listBasin = (patientId) =>
{
	var url = API_END_POINT+'Patients/listBasin';

	var data = {
		patientId: patientId
	};

	return sendAPIPostRequest(url, data);
}
// list Weight
listWeight = (patientId) =>
{
	var url = API_END_POINT+'Patients/listWeight';

	var data = {
		patientId: patientId
	};

	return sendAPIPostRequest(url, data);
}
// list Diabetes
listDiabetes = (patientId) =>
{
	var url = API_END_POINT+'Patients/listDiabetes';

	var data = {
		patientId: patientId
	};

	return sendAPIPostRequest(url, data);
}
// list Blood Pressure
listBloodPressure = (patientId) =>
{
	var url = API_END_POINT+'Patients/listBloodPressure';

	var data = {
		patientId: patientId
	};

	return sendAPIPostRequest(url, data);
}
// delete Changed Setting
deleteChangedSetting = (id) =>
{
	var url = API_END_POINT+'Patients/deleteChangedSetting';

	var data = {
		id: id
	};

	return sendAPIPostRequest(url, data);
}
// add Changed Settings
addChangedSettings = (PatientObject) =>
{
	var url = API_END_POINT+'Patients/addChangedSettings';

	var data = {
		PatientObject: PatientObject
	};

	return sendAPIPostRequest(url, data);
}
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




