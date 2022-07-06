window.$ = window.jQuery = require('jquery');
const fs = require('fs');
const ROOTPATH = require('electron-root-path');
const path = require('path');
const uuid = require('uuid');
const ipcIndexRenderer = require('electron').ipcRenderer;
const OS = require('os');
var QRCode = require('qrcode');
const date_time = require('date-and-time');
const Calendar = require(__dirname+'/assets/js/calendar');

var MAIN_CONTENT_CONTAINER =  $('#MainContentContainer');
var SIDE_NAV_CONTAINER = $('#sideNavbarContainer');
var TOP_NAV_BAR = $('#topNavbarContainer');

var APP_NAME = 'Clinics';
var API_END_POINT = 'http://promagdz.com/projects/ClinicsAPI/api/';
var PROJECT_URL = 'http://promagdz.com/projects/ClinicsAPI/';
//var API_END_POINT = 'http://localhost/holoolaz.com/projects/ClinicsAPI/api/';
//var PROJECT_URL = 'http://localhost/holoolaz.com/projects/ClinicsAPI/';
var APP_ICON = 'assets/img/logo/logo.png';
var APP_ROOT_PATH = ROOTPATH.rootPath+'/';
var APP_DIR_NAME = __dirname+'/';

const SETTINGS_FILE = 'settings';
const DISPLAY_LANG_FILE = APP_ROOT_PATH+'langs/display-lang.json';

var FUI_DISPLAY_LANG = undefined;

var AUTO_CHECKER = undefined;

var LOGIN_SESSION = undefined;
var LOGIN_SESSION_FILE = OS.tmpdir()+'/CustomerProvider/login/session.json';

var USER_CONFIG = {};

var GLOBALS_SCRIPT = null;

// Attendance
const ATT_ABSENT = 1;
const ATT_PRESENT = 2;
const ATT_LATE = 3;

let getAllStates;
let setupUserAuth;
let getPage;
let sendGetRequest;
let sendAPIPostRequest;
let sendAPIFormDataRequest;
let imageToDataURL;
let extractFileExtension;
let setOptionSelected;
let setupAPISettings;
let loadIniSettings;
let loadIniSettingsSync;
let setConnectionHostname;
let getConnectionHostname;
let testServerConnection;
let saveUserConfig;
let deleteFile;
let reloadUserConfig;
let getUserConfig;
let isConfigExists;
let setContainersDisabled;
let randomRange;
let loadFile;
let setUIDisplayLang;
let loadDisplayLanguage;
let CreateToast;
let parseCSV;
let parseXLSX;
let TopProgressBar;
let getLoginSession;
let setLoginSession;
let loadLoginSession;
let toggleCheck;
let TopLoader;
let toggleSimilarNavbarsLinks;
let globalLogin;
let clinicLogin;
let patientLogin;
let registerClinic;
let updateClinic;
let managerLogin;
let getManager;
let generateQRCode;
let getPatient;
let listPatients;
let listenForBarcodeScanner;
let downloadFile;
let copyLinkToClipboard;
let recursiveCopyDirFilesSync;
let SectionLoader;
let PageLoader;
let updatePatient;
let searchClinics;
let listClinicTreatmentClasses;
let searchPatientsLocal;
let searchPatients;
let sendMessage;
let listMessagesInbox;
let listMessagesSent;
let listMessageReplies;
let addMessageReply;
let removeMessages;
let setMessagesRead;
let setMessageRead;
let openMessage;
let searchTreatmentClasses;
let searchTreatmentClassesLocal;
let addAppointement;
let updateAppointement;
let getAppointement;
let searchAppointements;
let searchAppointementsLocal;
let deleteAppointements;
let trimNumber;
let addToTreasury;
let takeFromTreasury;
let addEmployee;
let updateEmployee;
let listEmployeesTypes;

$(async function()
{

GLOBALS_SCRIPT = $('#GLOBALS_SCRIPT');

// list Employees Types
listEmployeesTypes = () =>
{
	var url = API_END_POINT+'Employees/listTypes';
	var data = {

	}

	return sendAPIPostRequest(url, data);
}
// update Employee
updateEmployee = (EmployeeObject) =>
{
	var url = API_END_POINT+'Employees/update';
	var data = {
		EmployeeObject: EmployeeObject
	}

	return sendAPIPostRequest(url, data);
}
// add Employee
addEmployee = (EmployeeObject) =>
{
	var url = API_END_POINT+'Employees/add';
	var data = {
		EmployeeObject: EmployeeObject
	}

	return sendAPIPostRequest(url, data);
}
// take From Treasury
takeFromTreasury = (TreasuryObject) =>
{
	var url = API_END_POINT+'Treasury/take';
	var data = {
		TreasuryObject: TreasuryObject
	}

	return sendAPIPostRequest(url, data);
}
// add To Treasury
addToTreasury = (TreasuryObject) =>
{
	var url = API_END_POINT+'Treasury/add';
	var data = {
		TreasuryObject: TreasuryObject
	}

	return sendAPIPostRequest(url, data);
}
//trim Number
trimNumber = (num, prefix = '+') =>
{
	if ( num >= 10000 )
		num = (num / 10000).toFixed(2) + prefix;

	return num;
}
// delete Appointements
deleteAppointements = (list) =>
{
	var url = API_END_POINT+'Appointements/deleteList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// search Appointements Local
searchAppointementsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Appointements/searchLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// search Appointements
searchAppointements = (query) =>
{
	var url = API_END_POINT+'Appointements/search';
	var data = {
		query: query
	}

	return sendAPIPostRequest(url, data);
}
// get Appointement
getAppointement = (aptId) =>
{
	var url = API_END_POINT+'Appointements/info';
	var data = {
		aptId: aptId
	}

	return sendAPIPostRequest(url, data);
} 
// update Appointement
updateAppointement = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/update';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// add Appointement
addAppointement = (AppointementObject) =>
{
	var url = API_END_POINT+'Appointements/add';
	var data = {
		AppointementObject: AppointementObject
	}

	return sendAPIPostRequest(url, data);
}
// search Treatment Classes local
searchTreatmentClassesLocal = (SearchObject) =>
{
	var url = API_END_POINT+'TreatmentClasses/searchLocal';
	var data = {
		SearchObject: SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// search Treatment Classes
searchTreatmentClasses = (query) =>
{
	var url = API_END_POINT+'TreatmentClasses/search';
	var data = {
		query: query
	}

	return sendAPIPostRequest(url, data);
}
// open Message
openMessage = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/open';
	var data = {
		MessageObject: MessageObject
	}

	return sendAPIPostRequest(url, data);
}
// set Message Read
setMessageRead = (data) =>
{
	var url = API_END_POINT+'Messages/setRead';
	var data = {
		msgId: data.msgId,
		read: data.read,
		userHash: data.userHash
	}

	return sendAPIPostRequest(url, data);
}
// set Messages Read
setMessagesRead = (data) =>
{
	var url = API_END_POINT+'Messages/setReadList';
	var data = {
		list: data.list,
		read: data.read,
		userHash: data.userHash
	}

	return sendAPIPostRequest(url, data);
}
// remove Messages
removeMessages = (list) =>
{
	var url = API_END_POINT+'Messages/removeList';
	var data = {
		list: list
	}

	return sendAPIPostRequest(url, data);
}
// add Message Reply
addMessageReply = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/reply';
	var data = {
		MessageObject:MessageObject
	}

	return sendAPIPostRequest(url, data);
}
// list Message Replies
listMessageReplies = (msgId) =>
{
	var url = API_END_POINT+'Messages/replies';
	var data = {
		msgId:msgId
	}

	return sendAPIPostRequest(url, data);
}
// list Message sent
listMessagesSent = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/sent';
	var data = {
		MessageObject:MessageObject
	}

	return sendAPIPostRequest(url, data);
}
// list Message Inbox
listMessagesInbox = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/inbox';
	var data = {
		MessageObject:MessageObject
	}

	return sendAPIPostRequest(url, data);
}
// send Message
sendMessage = (MessageObject) =>
{
	var url = API_END_POINT+'Messages/send';
	var data = {
		MessageObject:MessageObject
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
// search Patients local
searchPatientsLocal = (SearchObject) =>
{
	var url = API_END_POINT+'Patients/searchLocal';
	var data = {
		SearchObject:SearchObject
	}

	return sendAPIPostRequest(url, data);
}
// list Clinic Treatment Classes
listClinicTreatmentClasses = (clinicId) =>
{
	var url = API_END_POINT+'Clinics/treatmentClasses';
	var data = {
		clinicId:clinicId
	}

	return sendAPIPostRequest(url, data);
}
// search Clinics
searchClinics = (query) =>
{
	var url = API_END_POINT+'Clinics/search';
	var data = {
		query:query
	}

	return sendAPIPostRequest(url, data);
}
// update Patient
updatePatient = (PatientObject) =>
{
	var url = API_END_POINT+'Patients/update';
	var data = {
		PatientObject:PatientObject
	}

	return sendAPIPostRequest(url, data);
}
// Page Loader
PageLoader = (visible = true) =>
{
	var PAGE_LOADER = $('#PAGE_LOADER');

	if ( visible )
		PAGE_LOADER.fadeIn(200);
	else
		PAGE_LOADER.fadeOut(200);
}
// Section Loader
SectionLoader = (parent,loader = 'loader-01') =>
{
	var loaderHTML = `<div class="loader-container" id="BlockLoaderqsdqsdqsd">
							<span class="${loader}"></span>
					</div>`;
	var loaderElement = parent.find('#BlockLoaderqsdqsdqsd');

	if ( loaderElement.length == 0 )
	{
		parent.addClass('position-relative');
		parent.append(loaderHTML);	
	}
	loaderElement = parent.find('#BlockLoaderqsdqsdqsd');
	if ( loader == '' )
		loaderElement.remove();
}
// recursive Copy Dir Files Sync
recursiveCopyDirFilesSync = (source, dest) =>
{
	var files = fs.readdirSync(source);
	//create dest dir
	if ( !fs.existsSync(dest) )
		fs.mkdirSync(dest, {recursive:true});

	files.forEach(file =>
	{
		var filename = source+file;
		var dest_filename = dest+file;
		if ( fs.lstatSync(filename).isFile() )
			fs.copyFileSync(filename, dest_filename);
	});
}
// Copy To Clipboard
copyLinkToClipboard = (element, val) =>
{
	var inputHTML = '<input type="text" id="copyToClipboardHiddenInput" style="display: none;">';
	var input = $(inputHTML).insertAfter(element);
	input = $('#copyToClipboardHiddenInput');
	input.val(val);
	input.focus();
	input.select();
	input[0].setSelectionRange(0, 99999);
	navigator.clipboard.writeText( input.val() );
	input.remove();
}
// download file
downloadFile = (url, filename, progressInfo, onComplete) =>
{
	var DOWNLOAD_START_TIME = undefined;
	var request = $.ajax({
		xhr: function() 
		{
		  var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.addEventListener('progress', (e) =>
			{
			    if (e.lengthComputable) 
		        {
		            var percentComplete = (e.loaded / e.total) * 100;
		            // Time Remaining
		            var seconds_elapsed = ( new Date().getTime() - DOWNLOAD_START_TIME ) / 1000;
		            bytes_per_second = e.loaded / seconds_elapsed;
		            //var bytes_per_second = seconds_elapsed ? e.loaded / seconds_elapsed : 0 ;
		            var timeleft = (new Date).getTime() - DOWNLOAD_START_TIME;
		            timeleft = e.total - e.loaded;
		            timeleft = timeleft / bytes_per_second;
		            // Upload speed
		            var Kbytes_per_second = bytes_per_second / 1024 ;
		            var transferSpeed = Math.floor(Kbytes_per_second);
		            progressInfo({e: e, timeleft: timeleft.toFixed(0), transferSpeed: transferSpeed, percent: percentComplete});
		        }
			}, false);
		   return xhr;
		},
		type: 'GET',
		url: url,
		async: true,
		cache: false,
		data: {},
		beforeSend: function(e)
		{
			// Set start time
			DOWNLOAD_START_TIME = new Date().getTime();
		},
		success: function(response)
		{
			var reader = new FileReader();
			reader.readAsArrayBuffer( response );
			reader.onload = () =>
		    {
		    	var buffer = Buffer.from(reader.result);
		    	fs.writeFile( filename, buffer, (err) => 
		    	{
		    		if ( err )
		    		{
		    			console.error(err);
		    			return;
		    		}

		    		if ( typeof onComplete == 'function' )
		    			onComplete(filename);
		    	});
		    };
		}
	});

	return request;
}
// Listen for barcode scanner
listenForBarcodeScanner = (CALLBACK) =>
{
	var scannedBarcode = '';
	var timer = undefined;
	$(window).off('keypress');
	$(window).on('keypress', e =>
	{
		scannedBarcode += e.key;
	    if (timer) 
	    {
	        clearTimeout(timer);
	    }

	    timer = setTimeout(() => 
	    {
	    	CALLBACK(scannedBarcode);
	        scannedBarcode = '';   
	    }, 500);
	});
}
// list Patients
listPatients = (clinicId) =>
{
	var url = API_END_POINT+'Patients/listAll';
	var data = {
		clinicId: clinicId
	}

	return sendAPIPostRequest(url, data);
}
// get Patient
getPatient = (patientId) =>
{
	var url = API_END_POINT+'Patients/info';
	var data = {
		patientId:patientId
	}

	return sendAPIPostRequest(url, data);
}
// generate QRCode
generateQRCode = (data) =>
{
	return new Promise((resolve, reject) =>
	{
		QRCode.toDataURL(data,{ errorCorrectionLevel: 'H' }, (err, url) =>
		{
			if ( err )
			{
				reject(err);
				return;
			}
			resolve(url);
		});	
	});
}
// get Manager
getManager = (ManagerObject) =>
{
	var url = API_END_POINT+'Manager/info';
	var data = {
		ManagerObject: ManagerObject
	};
	return sendAPIPostRequest(url, data);
}
// manager Login
managerLogin = (data) =>
{
	var url = API_END_POINT+'Manager/login';
	var data = {
		username: data.username,
		password: data.password
	};
	return sendAPIPostRequest(url, data);
}
// update Clinic
updateClinic = (ClinicObject) =>
{
	var url = API_END_POINT+'Clinics/update';
	var data = {
		ClinicObject: ClinicObject
	};

	return sendAPIPostRequest(url, data);
}
// register new clinic
registerClinic = (ClinicObject) =>
{
	var url = API_END_POINT+'Clinics/add';
	var data = {
		ClinicObject: ClinicObject
	};

	return sendAPIPostRequest(url, data);
}
// patient Login
patientLogin = (data) =>
{
	var url = API_END_POINT+'Patients/login';
	var data = {
		phone: data.phone,
		password: data.password
	};
	return sendAPIPostRequest(url, data);
}
// clinic Login
clinicLogin = (data) =>
{
	var url = API_END_POINT+'Clinics/login';
	var data = {
		username: data.username,
		password: data.password
	};
	return sendAPIPostRequest(url, data);
}
// global Login
globalLogin = (login) =>
{
	if ( login.loginType == 'CLINIC' )
	{
		return clinicLogin(login);
	}
	if ( login.loginType == 'PATIENT' )
	{
		return patientLogin(login);
	}
}
// toggle Similar Navbars Links
toggleSimilarNavbarsLinks = (href) =>
{
	var sbLinks = SIDE_NAV_CONTAINER.find('[data-role="NAV_LINK"]');
	var tbLinks = TOP_NAV_BAR.find('[data-role="NAV_LINK"]');

	// toggle side bar links
	sbLinks.removeClass('active');
	for (var i = 0; i < sbLinks.length; i++) 
	{
		var link = $(sbLinks[i]);
		if ( link.attr('href') == href )
		{
			link.addClass('active');
			break;
		}
	}
	// toggle top bar links
	tbLinks.removeClass('active');
	for (var i = 0; i < tbLinks.length; i++) 
	{
		var link = $(tbLinks[i]);
		if ( link.attr('href') == href )
		{
			link.addClass('active');
			break;
		}
	}
}
// Top loader
TopLoader = (text, visible = true) =>
{
	var sideNavLoader = $('#topLoader');

	sideNavLoader.find('#text').text(text);
	if ( visible )
	{
		sideNavLoader.css('display', 'block');
	}
	else
	{
		sideNavLoader.css('display', 'none');
	}
}
// toggle checkbox checked
toggleCheck = (checkbox, isChecked = null) =>
{
	if ( isChecked != null )
	{
		checkbox.attr('checked', isChecked);
		return;
	}
	checkbox.attr('checked', !checkbox.prop('checked') );
}
// load Login Session
loadLoginSession = () =>
{
	if ( !fs.existsSync(LOGIN_SESSION_FILE) )
		return;

	fs.readFile(LOGIN_SESSION_FILE, (err, data) =>
	{
		setLoginSession(JSON.parse(data));
	});
}
// set Login Session
setLoginSession = (sessionObject) =>
{
	LOGIN_SESSION = sessionObject;
}
// get login session
getLoginSession = () =>
{
	return LOGIN_SESSION;
}
// top progress bar
TopProgressBar = (options) => 
{
	var topProgressBarContainer = $('#topProgressBarContainer');
	var closeBTN = topProgressBarContainer.find('#closeBTN');
	var titleElement = topProgressBarContainer.find('#titleElement');
	var versionElement = topProgressBarContainer.find('#versionElement');
	var progressElement = topProgressBarContainer.find('#progressElement');

	// display
	show();
	// set title
	titleElement.text(options.title);
	// set version
	versionElement.text(options.version);
	// set progress
	progressElement.find('.progress-bar').css('width', options.progress.percent.toFixed(0)+'%')
	.text(options.progress.percent.toFixed(2)+'%');
	
	if ( options.hideOnComplete == true )
		hide();
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		forceHide();
	});
	// show
	function show()
	{
		if ( !topProgressBarContainer.hasClass('active') )
			topProgressBarContainer.addClass('active');
	}
	// hide
	function hide()
	{
		topProgressBarContainer.removeClass('active');
	}
	// Force Hide dialog
	function forceHide()
	{
		topProgressBarContainer.css('display', 'none');
	}
}
// parse xlsx
parseXLSX = (xlsxFile, CALLBACK) =>
{
	readXlsxFile(xlsxFile).then(data =>
	{
		CALLBACK(data);
	});
}
// parse csv
parseCSV = (csvFile, CALLBACK) =>
{
	var config = {
		download: false,
		encoding: 'utf-8',
		complete: function(results)
		{
			CALLBACK(results);
		},
		error: function(error)
		{
			if ( error )
			{
				console.log(error);
			}
		}
	};
	Papa.parse(csvFile, config);
}
// Unique id
uniqid = () =>
{
	return uuid.v4();
}
// Toast
CreateToast = (title = '', body = '', time = 'À présent', delay = 10000) =>
{
	var toastContainer = $('#toastContainer');

	// Create toast
	var tclass = uniqid();
	var toastHTML = `<div class="${tclass} toast" role="alert" aria-live="polite" aria-atomic="true" data-delay="${delay}">
						<div class="toast-header">
							<img src="assets/img/utils/notify.png" style="width: 15px; height:15px;" class="rounded me-2" alt="...">
							<strong class="me-auto">${title}</strong>
							<small class="text-muted">${time}</small>
							<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
						</div>
						<div class="toast-body" style="font-weight: 300;">
							${body}
						</div>
					</div>`;
	toastContainer.append(toastHTML);
	// Get list of toasts
	var toastEl = toastContainer.find('.'+tclass)[0];
	var toast = new bootstrap.Toast(toastEl, 'show');
	// Delete all toasts when finished hiding
	//for (var i = 0; i < toastList.length; i++) 
	//{
		//var toast = toastList[i];
		//toast._config.autohide = false;
		toast._config.delay = $(toast._element).data('delay');
		toast.show();
		toast._element.addEventListener('hidden.bs.toast', () =>
		{
			$(toast._element).remove();
		});
		setTimeout(() => { $(toast._element).remove(); }, toast._config.delay);
	//}
}
// set ui display lang
setUIDisplayLang = (lang) =>
{
	var fini = new IniFile(APP_ROOT_PATH);

	var UI_Settings = {
		DISPLAY_LANG: lang
	};

	return fini.write(SETTINGS_FILE, UI_Settings, 'UI_Settings');
}
// Load display language
loadDisplayLanguage = () =>
{
	/*
	if ( fs.existsSync(DISPLAY_LANG_FILE) )
	{
		var data = fs.readFileSync(DISPLAY_LANG_FILE).toString('utf-8');
		FUI_DISPLAY_LANG = JSON.parse(data);
	}
	*/
	return new Promise(resolve =>
	{
		ipcIndexRenderer.removeAllListeners('translation-file-created');
		ipcIndexRenderer.on('translation-file-created', (e,info) =>
		{
			FUI_DISPLAY_LANG = info;
			resolve(info);
		});	
	});	
}
// load file
loadFile = (filepath, CALLBACK) =>
{
	if ( !fs.existsSync(filepath) )
		return '';

	fs.readFile(filepath, 'utf8', (error, data) =>
	{
		if ( error )
		{
			console.log(error);
			return;
		}
		CALLBACK(data);
	});
}
// Print file to pdf
printFileToPdf = (filepath = '', textDir = 'rtr') =>
{
	loadFile(filepath, filedata =>
	{
		var printWindow = window.open('', '', `width=${ $(window).width() }, height=${ $(window).height() }`);
	    // open the window
	    printWindow.document.open();
	    var domHTML = document.head.outerHTML;
	    domHTML+= `<body style="padding: 1em 2em;" dir="${textDir}">${filedata}</body>`;
		printWindow.document.write( domHTML );
		var winDomElement = $(printWindow.document);
		printWindow.document.close();
		printWindow.focus();
		printWindow.onload = (event) => 
		{
		  	printWindow.print();
	        printWindow.close();
		};
		/*
		setTimeout(function() {
	        printWindow.print();
	        printWindow.close();
	    }, 2000);
	    */
	})
	
}
// Print to pdf
printHTMLToPdf = (printableElement = '', textDir = 'ltr') =>
{
	var printWindow = window.open('', '', `width=${ $(window).width() }, height=${ $(window).height() }`);
	// open the window
	printWindow.document.open();
	var domHTML = document.head.outerHTML;
	domHTML+= `<body style="padding: 1em 2em;" dir="${textDir}">${printableElement}</body>`;
	printWindow.document.write( domHTML );
	var winDomElement = $(printWindow.document);
	printWindow.document.close();
	printWindow.focus();
	printWindow.onload = (event) => 
	{
	  	printWindow.print();
        printWindow.close();
	};
	/*
	setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 2000);
    */
}
// Random range
randomRange = (min, max) => 
{ 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// Set containers disabled
setContainersDisabled = (disabled = false) =>
{
	if ( disabled )
	{
		MAIN_CONTENT_CONTAINER.addClass('disabled');
		SIDE_NAV_CONTAINER.addClass('disabled');
		TOP_NAV_BAR.addClass('disabled');
	}
	else
	{
		MAIN_CONTENT_CONTAINER.removeClass('disabled');
		SIDE_NAV_CONTAINER.removeClass('disabled');
		TOP_NAV_BAR.removeClass('disabled');
	}
}
//Save user data
saveUserConfig = (json, CALLBACK) =>
{
	data = JSON.stringify(json);
	fs.writeFile(ROOTPATH.rootPath+'/config.json', data, (error) => 
	{
		if ( typeof CALLBACK == 'function' )
			CALLBACK(error);

		// reload User Config
		reloadUserConfig();
	});
}
// Delete file
deleteFile = (file, CALLBACK) =>
{
	if (fs.existsSync(file)) 
	{
		fs.unlink(file, (error) =>
		{
			CALLBACK(error);
		});
  	}
}
// reload user config
reloadUserConfig = () =>
{
	USER_CONFIG = getUserConfig();
}
// Get user data
getUserConfig = () =>
{
	if ( !isConfigExists() )
		return null;
	config = fs.readFileSync(APP_ROOT_PATH+'config.json', 'utf-8');
	json = JSON.parse(config);
	return json;
}
// Check config file exists
isConfigExists = () =>
{
	exists = false;
	if ( fs.existsSync(APP_ROOT_PATH+'config.json') )
		exists = true;

	return exists;
}
// Test server connection
testServerConnection = () =>
{
	url = API_END_POINT+'ServerInfo';
	data = {};
	return new Promise((resolve, reject) =>
	{
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			success: function(response)
			{
				if ( response.code == 404 )
				{
					reject(response);
					return;
				}
				resolve(response);
			},
			error: function( jqXHR, textStatus, errorThrown)
			{
				if ( textStatus == 'error' )
				{
					reject(errorThrown);
				}
			}
		});
	});
}
// Get connection hostname
getConnectionHostname = () =>
{
	var settings = loadIniSettingsSync();

	if ( !settings )
		return 'localhost';

	if ( settings.Server_Settings == null )
		return 'localhost';

	return settings.Server_Settings.HOSTNAME;

}
// Set connection hostname
setConnectionHostname = (hostname) =>
{
	var fini = new IniFile(APP_ROOT_PATH);

	var Server_Settings = {
		HOSTNAME: $.trim(hostname)
	};

	fini.writeSync(SETTINGS_FILE, Server_Settings, 'Server_Settings');
	setupAPISettings();
}
// Setup API Settings
setupAPISettings = () =>
{
	if ( fs.existsSync(APP_ROOT_PATH+SETTINGS_FILE+'.ini') )
	{
		var settings = loadIniSettingsSync();
		if ( settings )
		{
			if ( settings.Server_Settings != null )
			{
				APP_URL = 'http://'+settings.Server_Settings.HOSTNAME+'/ParamedicalSchoolAPI/';
				API_END_POINT = APP_URL+'api/';
			}
		}
	}
}
// Load ini settings
loadIniSettings = (CALLBACK) =>
{
	var fini = new IniFile(APP_ROOT_PATH);
	fini.read(SETTINGS_FILE).then(data =>
	{
		CALLBACK(data);
	});
}
// Load ini settings sync
loadIniSettingsSync = () =>
{
	var fini = new IniFile(APP_ROOT_PATH);
	return fini.readSync(SETTINGS_FILE);
}
// Set setect option selected
setOptionSelected = (selectElement, val, triggerEvent = false) =>
{
	selectElement.find('option').each((k, v) =>
	{
		var option = $(v);
		// Remove selection
		option.removeAttr('selected', '');
		if ( val == option.val() )
		{
			option.attr('selected', 'selected');
			return;
		}
	});
	// Trigger event
	if (triggerEvent)
		selectElement.trigger('change');
}
// Extract file extension
extractFileExtension = (filename) =>
{
	return path.extname(filename).replace('.', '');
}
// Image to data url
imageToDataURL = (File) =>
{
	return new Promise((resolve, reject) =>
	{
		var reader = new FileReader();

		reader.onload = () =>
		{
			resolve( reader.result );
		};

		if ( File == null )
		{
			reject('Image File is not specified');
			return;
		}

		reader.readAsDataURL(File);
	});
}
// Get page
getPage = (page) =>
{
	var promise = new Promise((resolve, reject) =>
	{
		sendGetRequest(page, response =>
		{
			if ( response.length == 0 )
			{
				reject('Error empty response');
				return;
			}
			resolve(response);
		});
	});

	return promise;
}
// Send Get Request
sendGetRequest = (url, CALLBACK) =>
{
	$.ajax({
		url: url,
		type: 'GET',
		success: function(response)
		{
			CALLBACK(response);
		},
		error: function( jqXHR, textStatus, errorThrown)
		{
			if ( textStatus == 'error' )
			{
				TopLoader('', false);
			}
		}
	});
}
// Send Post Request
sendAPIPostRequest = (url, data) =>
{
	data['lang'] = FUI_DISPLAY_LANG.lang;
	var request = $.ajax({
		url: url,
		type: 'POST',
		data: data,
		success: function(response)
		{
			console.log(response);
		},
		error: function( jqXHR, textStatus, errorThrown)
		{
			if ( textStatus == 'error' )
			{
				TopLoader('', false);

				if ( FUI_DISPLAY_LANG.lang == 'ar' )
					DialogBox('خطأ', "حدث خطأ أثناء الاتصال بالسيرفر");
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
					DialogBox('Erreur', "Une erreur s'est produite lors de la connexion au serveur");
			}
		}
	});

	return request;
}
// Send formdata Post Request
sendAPIFormDataRequest = (url, formData) =>
{
	formData.append('lang', FUI_DISPLAY_LANG.lang);
	var request = $.ajax({
		url: url,
		type: 'POST',
		processData: false,
		contentType: false,
		data: formData,
		success: function(response)
		{
			console.log(response);
		},
		error: function( jqXHR, textStatus, errorThrown)
		{
			if ( textStatus == 'error' )
			{
				TopLoader('', false);
				
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
					DialogBox('خطأ', "حدث خطأ أثناء الاتصال بالسيرفر");
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
					DialogBox('Erreur', "Une erreur s'est produite lors de la connexion au serveur");
			}
		}
	});

	return request;
}
// setup user auth
setupUserAuth = () =>
{
	var userAuthContainer = $('#userAuthContainer');
	if ( userAuthContainer[0] == undefined )
		return;

	// hide main container
	MAIN_CONTENT_CONTAINER.hide(0);
	// hide side navbar
	SIDE_NAV_CONTAINER.hide(0);
	// hide top nav bar
	TOP_NAV_BAR.hide(0);
	userAuthContainer.addClass('active');

	var signupWrapper = userAuthContainer.find('#signupWrapper');
	var signupForm = signupWrapper.find('#signupForm');
	var switchToSigninForm = signupForm.find('#switchToSigninForm');

	var loginFormTypeSelect = userAuthContainer.find('#loginFormTypeSelect');

	var signinWrapper = userAuthContainer.find('#signinWrapper');
	var CLINIC_LOGIN_FORM = signinWrapper.find('#CLINIC_LOGIN_FORM');

	var PATIENT_LOGIN_FORM = signinWrapper.find('#PATIENT_LOGIN_FORM');

	var FOUNDATION_MANAGER_LOGIN_FORM = signinWrapper.find('#FOUNDATION_MANAGER_LOGIN_FORM');

	// go to signin
	switchToSigninForm.off('click');
	switchToSigninForm.on('click', e =>
	{
		e.preventDefault();
		signinWrapper.slideDown(200);
		signupWrapper.slideUp(200);
	});
	// go to signup
	CLINIC_LOGIN_FORM.find('#switchToSignupForm').off('click');
	CLINIC_LOGIN_FORM.find('#switchToSignupForm').on('click', e =>
	{
		e.preventDefault();
		signupWrapper.slideDown(200);
		signinWrapper.slideUp(200);
	});
	// go to signup
	FOUNDATION_MANAGER_LOGIN_FORM.find('#switchToSignupForm').off('click');
	FOUNDATION_MANAGER_LOGIN_FORM.find('#switchToSignupForm').on('click', e =>
	{
		e.preventDefault();
		signupWrapper.slideDown(200);
		signinWrapper.slideUp(200);
	});
	// sign up
	signupForm.off('submit');
	signupForm.on('submit', e =>
	{
		e.preventDefault();
		var target = signupForm;
		var ClinicObject = {
			clinicName: target.find('#sfName').val(),
			clinicPhone: $.trim(target.find('#sfPhone').val()),
			clinicUsername: $.trim(target.find('#sfUsername').val()),
			clinicPass: $.trim(target.find('#sfPassword').val()),
			clinicState: target.find('#sfState :selected').val(),
			clinicBaladia: target.find('#sfCity').val(),
			clinicAddress: target.find('#sfAddress').val()
		};
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("جاري إنشاء حسابك ، برجاء الانتظار ...");
			registerClinic(ClinicObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				DialogBox('ملحوظة', response.message);
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("Création de votre compte, veuillez patienter...");
			registerClinic(ClinicObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('Erreur', response.message);
					return;
				}

				DialogBox('N.-B.', response.message);
			});	
		}
		
	});
	// select login form
	loginFormTypeSelect.off('change');
	loginFormTypeSelect.on('change', async e =>
	{
		var form = $(loginFormTypeSelect.find(':selected').data('form'));
		form.fadeIn(200).siblings().fadeOut(200);
	});
	// CLINIC_LOGIN_FORM submit
	CLINIC_LOGIN_FORM.off('submit');
	CLINIC_LOGIN_FORM.on('submit', e =>
	{
		e.preventDefault();
		target = CLINIC_LOGIN_FORM;
		var loginType = loginFormTypeSelect.find(':selected').val();
		var login = {
			username: target.find('#sfUsername').val(),
			password: $.trim(target.find('#sfPassword').val())
		};
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("تسجيل الدخول ، برجاء الانتظار ...");
			clinicLogin( login )
			.then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				var data = response.data;
				data['LOGIN_TYPE'] = loginType;
				saveUserConfig(data, () => 
				{
					// display main container
					MAIN_CONTENT_CONTAINER.show(0);
					// display side navbar
					SIDE_NAV_CONTAINER.show(0);
					// display top nav bar
					TOP_NAV_BAR.show(0);
					// hide auth
					userAuthContainer.removeClass('active');
					// check login type
					// get page
					getPage(APP_DIR_NAME+'views/pages/add-patients.ejs').then(response =>
					{
						MAIN_CONTENT_CONTAINER.html(response);
						// Re assign events
						rebindEvents();
					});	
				});
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("Connectez-vous, veuillez patienter...");
			clinicLogin( login )
			.then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('Erreur', response.message);
					return;
				}

				var data = response.data;
				data['LOGIN_TYPE'] = loginType;
				saveUserConfig(data, () => 
				{
					// display main container
					MAIN_CONTENT_CONTAINER.show(0);
					// display side navbar
					SIDE_NAV_CONTAINER.show(0);
					// display top nav bar
					TOP_NAV_BAR.show(0);
					// hide auth
					userAuthContainer.removeClass('active');
					// get page
					getPage(APP_DIR_NAME+'views/pages/add-patients.ejs').then(response =>
					{
						MAIN_CONTENT_CONTAINER.html(response);
						// Re assign events
						rebindEvents();
					});	
				});
			});	
		}
	});
	// PATIENT_LOGIN_FORM submit
	PATIENT_LOGIN_FORM.off('submit');
	PATIENT_LOGIN_FORM.on('submit', e =>
	{
		e.preventDefault();
		var target = PATIENT_LOGIN_FORM;
		var loginType = loginFormTypeSelect.find(':selected').val();

		var login = {
			phone: target.find('#sfPhone').val(),
			password: $.trim(target.find('#sfPassword').val())
		};
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("تسجيل الدخول ، برجاء الانتظار ...");
			patientLogin( login )
			.then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				var data = response.data;
				data['LOGIN_TYPE'] = loginType;
				saveUserConfig(data, () => 
				{
					// display main container
					MAIN_CONTENT_CONTAINER.show(0);
					// display side navbar
					SIDE_NAV_CONTAINER.show(0);
					// display top nav bar
					TOP_NAV_BAR.show(0);
					// hide auth
					userAuthContainer.removeClass('active');
					window.location.href = 'PatientPanel/index.ejs';
				});
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("Connectez-vous, veuillez patienter...");
			patientLogin( login )
			.then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('Erreur', response.message);
					return;
				}

				var data = response.data;
				data['LOGIN_TYPE'] = loginType;
				saveUserConfig(data, () => 
				{
					// display main container
					MAIN_CONTENT_CONTAINER.show(0);
					// display side navbar
					SIDE_NAV_CONTAINER.show(0);
					// display top nav bar
					TOP_NAV_BAR.show(0);
					// hide auth
					userAuthContainer.removeClass('active');
					window.location.href = 'PatientPanel/index.ejs';
				});
			});	
		}
	});
	// FOUNDATION_MANAGER_LOGIN_FORM submit
	FOUNDATION_MANAGER_LOGIN_FORM.off('submit');
	FOUNDATION_MANAGER_LOGIN_FORM.on('submit', e =>
	{
		e.preventDefault();
		target = FOUNDATION_MANAGER_LOGIN_FORM;
		var loginType = loginFormTypeSelect.find(':selected').val();
		var login = {
			username: target.find('#sfUsername').val(),
			password: $.trim(target.find('#sfPassword').val())
		};
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("تسجيل الدخول ، برجاء الانتظار ...");
			managerLogin( login )
			.then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				var data = response.data;
				data['LOGIN_TYPE'] = loginType;
				saveUserConfig(data, () => 
				{
					// display main container
					MAIN_CONTENT_CONTAINER.show(0);
					// display side navbar
					SIDE_NAV_CONTAINER.show(0);
					// display top nav bar
					TOP_NAV_BAR.show(0);
					// hide auth
					userAuthContainer.removeClass('active');
					window.location.href = 'ManagerPanel/index.ejs';
				});
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("Connectez-vous, veuillez patienter...");
			managerLogin( login )
			.then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('Erreur', response.message);
					return;
				}

				var data = response.data;
				data['LOGIN_TYPE'] = loginType;
				saveUserConfig(data, () => 
				{
					// display main container
					MAIN_CONTENT_CONTAINER.show(0);
					// display side navbar
					SIDE_NAV_CONTAINER.show(0);
					// display top nav bar
					TOP_NAV_BAR.show(0);
					// hide auth
					userAuthContainer.removeClass('active');
					window.location.href = 'ManagerPanel/index.ejs';
				});
			});	
		}
	});
	// display all states
	getAllStates().then(response =>
	{
		// clear html
		signupForm.find('#sfState').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.wilaya_name}">${v.wilaya_name}</option>`;
		});
		// add html
		signupForm.find('#sfState').html(html);
	});
}
// get all states
getAllStates = () =>
{
	var url = API_END_POINT+'States/list';
	var data = {};
	return sendAPIPostRequest(url, data);
}
// display loader
PageLoader();
// Call globally
await loadDisplayLanguage();
//loadLoginSession();
reloadUserConfig();
// add dynamic scripts
var index_js = '<script type="text/javascript" src="assets/js/index.js"></script>';
var dialogs_js = '<script type="text/javascript" src="assets/js/include/Dialogs.js"></script>';
var functions_js = '<script type="text/javascript" src="assets/js/include/Functions.js">';
var classes_js = '<script type="text/javascript" src="assets/js/include/Classes.js"></script>';
var pagination_js = '<script type="text/javascript" id="PAGINATION" src="assets/js/pagination_ar.js"></script>';
var bootstrap_js = '<script type="text/javascript" src="assets/js/bootstrap.min.js"></script>';
var popper_js = '<script type="text/javascript" src="assets/js/popper.min.js"></script>';

$(index_js).insertAfter(GLOBALS_SCRIPT);
$(dialogs_js).insertAfter(GLOBALS_SCRIPT);
$(functions_js).insertAfter(GLOBALS_SCRIPT);
$(classes_js).insertAfter(GLOBALS_SCRIPT);
$(pagination_js).insertAfter(GLOBALS_SCRIPT);
$(bootstrap_js).insertAfter(GLOBALS_SCRIPT);
$(popper_js).insertAfter(GLOBALS_SCRIPT);

});




