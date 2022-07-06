$(function()
{

// Setup app updates
function setupAppUpdates()
{
	var title = '';
	if ( FUI_DISPLAY_LANG.lang == 'ar' )
		title = 'تنزيل التحديثات...';
	else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		title = 'Télécharger les mises à jour...';
	var options =
	{
		title: title,
		version: '',
		progress: {
			percent: 0,
		}
	};
	// check for updates only
	ipcIndexRenderer.send('check-for-updates-only', '');
	//
	ipcIndexRenderer.on('update-about-to-download', (e, info) =>
	{
		console.log(info);
	});
	ipcIndexRenderer.on('checking-for-update', (e, info) =>
	{
		// Translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// Display loader
			TopLoader('البحث عن تحديثات...');
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// Display loader
			TopLoader("Vérification des mises à jour...");
		}
	});
	ipcIndexRenderer.on('update-available', (e, info) =>
	{
		// Hide loader
		TopLoader('', false);
		options.version = 'v'+info.version;
		console.log(info);
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			CreateToast("اشعار", `تم العثور على اصدار جديد: ${options.version}`, 'الآن', 20000);
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			CreateToast("Notification", `Nouvelle version trouvée: ${options.version}`, "à l'heure actuelle", 20000);
		}
	});
	ipcIndexRenderer.on('update-not-available', (e, info) =>
	{
		// Hide loader
		TopLoader('', false);
		console.log(info);
	});
	ipcIndexRenderer.on('update-error', (e, info) =>
	{
		// Hide loader
		TopLoader('', false);
		console.log(info);
	});
	ipcIndexRenderer.on('update-downloaded', (e, info) =>
	{
		// Translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			PromptConfirmDialog('تأكيد', 'تم تنزيل التحديثات ، هل تريد التثبيت؟')
			.then(confirmed =>
			{
				ipcIndexRenderer.send('quit-and-install-update', info);
			});
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			PromptConfirmDialog("Confirmer", "Mises à jour téléchargées, souhaitez-vous les installer ?")
			.then(confirmed =>
			{
				ipcIndexRenderer.send('quit-and-install-update', info);
			});
		}
		console.log(info);
	});
	ipcIndexRenderer.on('download-update-progress', (e, info) =>
	{
		// Display update dialog
		options.progress.percent = info.percent;
		//options.total = info.total;
		//options.transferred = info.transferred;
		//options.bytesPerSecond = info.bytesPerSecond;
		TopProgressBar(options);
	});
}
// setup Top Navbar
function setupTopNavbar()
{
	var toggleSideBarBTN = TOP_NAV_BAR.find('#toggleSideBarBTN');
	var topbarNavMenu = TOP_NAV_BAR.find('#topbarNavMenu');

	// toggle side bar
	toggleSideBarBTN.off('click');
	toggleSideBarBTN.on('click', e =>
	{
		SIDE_NAV_CONTAINER.toggleClass('hidden');
		MAIN_CONTENT_CONTAINER.toggleClass('maximized');
		TOP_NAV_BAR.toggleClass('maximized');
	});
	// Click on nav
	topbarNavMenu.off('click');
	topbarNavMenu.on('click', e =>
	{
		e.preventDefault();
		var target = $(e.target);
		if ( target.data('role') == 'NAV_LINK' )
		{
			var href = target.attr('href');

			var page = APP_DIR_NAME+href;
			if ( href.length == 0 || href == '#' )
				return;

			getPage(page).then(response =>
			{
				MAIN_CONTENT_CONTAINER.html(response);
				// Re assign events
				rebindEvents();
				// Set navlink active
				//nbNavMenu.find('[data-role="NAV_LINK"]').removeClass('active');
				//target.addClass('active');
				toggleSimilarNavbarsLinks(href);
			});
		}
		else if ( target.data('role') == 'LOGOUT_NAV_LINK' )
		{
			PromptConfirmDialog().then(c =>
			{
				deleteFile(APP_ROOT_PATH+'config.json', () =>
				{
					setupUserAuth();
				});	
			});
		}
		else if ( target.data('role') == 'CHECK_FOR_UPDATES_NAV_LINK' )
		{
			// translate
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				PromptConfirmDialog('تأكيد العمل', 'هل انت متأكد؟ سيبدأ التحميل مباشرة عند ايجاد اصدار جديد.').then(c =>
				{
					ipcIndexRenderer.send('check-for-updates', '');
				});
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				PromptConfirmDialog("Confirmer l'action", "Êtes-vous sûr? Le téléchargement commencera immédiatement lorsqu'une nouvelle version sera trouvée.").then(c =>
				{
					ipcIndexRenderer.send('check-for-updates', '');
				});
			}
		}
		else
			return;
	});
}
// Setup navbar
function setupNavbar()
{
	var nbNavMenu = SIDE_NAV_CONTAINER.find('#nbNavMenu');
	
	// Click on nav
	nbNavMenu.off('click');
	nbNavMenu.on('click', e =>
	{
		e.preventDefault();
		var target = $(e.target);
		if ( target.data('role') == 'NAV_LINK' )
		{
			var href = target.attr('href');

			var page = APP_DIR_NAME+href;
			if ( href.length == 0 || href == '#' )
				return;

			getPage(page).then(response =>
			{
				MAIN_CONTENT_CONTAINER.html(response);
				// Re assign events
				rebindEvents();
				// Set navlink active
				//nbNavMenu.find('[data-role="NAV_LINK"]').removeClass('active');
				//target.addClass('active');
				toggleSimilarNavbarsLinks(href);
			});
		}
		else if ( target.data('role') == 'LOGOUT_NAV_LINK' )
		{
			PromptConfirmDialog().then(c =>
			{
				deleteFile(APP_ROOT_PATH+'config.json', () =>
				{
					setupUserAuth();
				});	
			});
		}
		else if ( target.data('role') == 'CHECK_FOR_UPDATES_NAV_LINK' )
		{
			// translate
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				PromptConfirmDialog('تأكيد العمل', 'هل انت متأكد؟ سيبدأ التحميل مباشرة عند ايجاد اصدار جديد.').then(c =>
				{
					ipcIndexRenderer.send('check-for-updates', '');
				});
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				PromptConfirmDialog("Confirmer l'action", "Êtes-vous sûr? Le téléchargement commencera immédiatement lorsqu'une nouvelle version sera trouvée.").then(c =>
				{
					ipcIndexRenderer.send('check-for-updates', '');
				});
			}
		}
		else
			return;
	});
}
// setup stats
async function setupStatistics()
{
	var statisticsContainer = $('#statisticsContainer');
	if ( statisticsContainer[0] == undefined )
		return;

	var ERROR_BOX = statisticsContainer.find('#ERROR_BOX');

	var treasuryStat = statisticsContainer.find('#treasuryStat');
	var patientsStat = statisticsContainer.find('#patientsStat');

	// init calendar
	new Calendar({
	    id: '#calendarDiv',
	    calendarSize: 'small',
	    theme: 'basic',
	    disableMonthYearPickers: true,
	    disableDayClick: true,
	    disableMonthArrowClick: true
	});

	// display loaders
	SectionLoader(treasuryStat);
	SectionLoader(patientsStat);
	// treasury
	var treasury = await getTreasury( USER_CONFIG.clinicId );
	// hide loader
	SectionLoader(treasuryStat, '');
	if ( treasury.code == 200 )
	{
		var data = treasury.data;
		treasuryStat.find('#statAmount').text( trimNumber(parseFloat(data.treasury_amount)) );
		treasuryStat.find('#statAmountTooltip').text( data.treasury_amount );
		treasuryStat.find('#statInRate').text( parseFloat(data.expenses.currentMonth.in_rate).toFixed(1)+'%' );
		treasuryStat.find('#statOutRate').text( parseFloat(data.expenses.currentMonth.out_rate).toFixed(1)+'%' );	
	}

	// patients
	var patients = await listPatients(USER_CONFIG.clinicId);
	// hide loader
	SectionLoader(patientsStat, '');
	if ( patients.code == 200 )
	{
		var data = patients.data;
		var currentM = (data.currentMonth) ? data.currentMonth.length : 0;
		var priorM = (data.priorMonth) ? data.priorMonth.length : 0;
		var total = (data.all) ? data.all.length : 0;
		var inRate = (currentM / total) * 100;
		var outRate = ( (priorM - currentM) / total ) * 100;

		patientsStat.find('#statAmount').text( trimNumber(total) );
		patientsStat.find('#statAmountTooltip').text( total );
		patientsStat.find('#statInRate').text( inRate.toFixed(1)+'%' );
		patientsStat.find('#statOutRate').text( outRate.toFixed(1)+'%' );	
	}
}
// setup settings
function setupSettings()
{
	var settingsContainer = $('#settingsContainer');
	if ( settingsContainer[0] == undefined )
		return;

	var updateAccountForm = settingsContainer.find('#updateAccountForm');

	// update
	updateAccountForm.off('submit');
	updateAccountForm.on('submit', e =>
	{
		e.preventDefault();
		var target = $(e.target);
		var ProviderObject = {
			clinicId: USER_CONFIG.clinicId,
			clinicDoctorName: target.find('#uafDoctorNameInput').val(),
			clinicName: target.find('#uafNameInput').val(),
			clinicPhone: $.trim(target.find('#uafPhoneInput').val()),
			clinicPass: $.trim(target.find('#uafPassInput').val()),
			clinicState: target.find('#uafStateSelect :selected').val(),
			clinicBaladia: target.find('#uafCityInput').val(),
			clinicAddress: target.find('#uafAddressInput').val()
		};
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// check password match
			if ( target.find('#uafPassInput').val() != target.find('#uafConfirmPassInput').val() )
			{
				DialogBox('خطأ', "كلمة المرور غير مطابقة");
				return;
			}
			// display loader
			TopLoader("تحديث الحساب...");
			updateClinic(ProviderObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('خطأ', response.message);
					return;
				}

				DialogBox('ملحوظة', response.message);
				// save new data
				saveUserConfig(response.data, () => {});
			});	
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// check password match
			if ( target.find('#uafPassInput').val() != target.find('#uafConfirmPassInput').val() )
			{
				DialogBox('Erreur', "Les mots de passe ne correspondent pas");
				return;
			}
			// display loader
			TopLoader("Mise à jour du compte...");
			updateClinic(ProviderObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					DialogBox('Erreur', response.message);
					return;
				}

				DialogBox('N.-B.', response.message);
				// save new data
				saveUserConfig(response.data, () => {});
			});	
		}
	});
	// display states
	getAllStates().then(response =>
	{
		// clear html
		updateAccountForm.find('#uafStateSelect').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.wilaya_name}">${v.wilaya_name}</option>`;
		});
		// add html
		updateAccountForm.find('#uafStateSelect').html(html);
		// display provider info
		displayInfo();
	});
	function displayInfo()
	{
		updateAccountForm.find('#uafDoctorNameInput').val( USER_CONFIG.clinicDoctorName );
		updateAccountForm.find('#uafNameInput').val( USER_CONFIG.clinicName );
		setOptionSelected( updateAccountForm.find('#uafStateSelect'), USER_CONFIG.clinicState );
		updateAccountForm.find('#uafCityInput').val( USER_CONFIG.clinicBaladia );
		updateAccountForm.find('#uafAddressInput').val( USER_CONFIG.clinicAddress );
		updateAccountForm.find('#uafPhoneInput').val( USER_CONFIG.clinicPhone  );
		updateAccountForm.find('#uafPassInput').val( USER_CONFIG.clinicPass );
		updateAccountForm.find('#uafConfirmPassInput').val( USER_CONFIG.clinicPass );
	}
	// update ui settings
	var updateUISettingsForm = settingsContainer.find('#updateUISettingsForm');
	var uiLangSelect = settingsContainer.find('#uiLangSelect'); 

	updateUISettingsForm.off('submit');
	updateUISettingsForm.on('submit', e =>
	{
		e.preventDefault();
		setUIDisplayLang( uiLangSelect.find(':selected').val() ).then(changed =>
		{
			// translate
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				DialogBox('ملحوظة', "تم تغيير لغة العرض، اعد تشغيل البرنامج لملاحظة التغييرات.");
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				DialogBox('N.-B.', "La langue d'affichage a été modifiée, redémarrez le programme pour constater les changements.");
			}
		});
	});
	//
	setOptionSelected(uiLangSelect, FUI_DISPLAY_LANG.lang);
}
// setup patients
function setupAddPatients(options = null)
{
	var addPatientsContainer = $('#addPatientsContainer');
	if ( addPatientsContainer[0] == undefined )
		return;

	var ERROR_BOX = addPatientsContainer.find('#ERROR_BOX');

	var addForm = addPatientsContainer.find('#addForm');
	var patientNameInput = addForm.find('#patientNameInput');
	var patientPhoneInput = addForm.find('#patientPhoneInput');
	var patientPassInput = addForm.find('#patientPassInput');
	var patientAgeInput = addForm.find('#patientAgeInput');
	var patientGenderSelect = addForm.find('#patientGenderSelect');
	var patientAddressInput = addForm.find('#patientAddressInput');
	var patientBarcodeInput = addForm.find('#patientBarcodeInput');
	var patientBasinInput = addForm.find('#patientBasinInput');
	var patientWeightInput = addForm.find('#patientWeightInput');
	var patientBirthPlaceInput = addForm.find('#patientBirthPlaceInput');
	var patientBirthDateInput = addForm.find('#patientBirthDateInput');
	var patientChildrenInput = addForm.find('#patientChildrenInput');
	var patientStateInput = addForm.find('#patientStateInput');
	var patientWhatsappInput = addForm.find('#patientWhatsappInput');
	var patientFBInput = addForm.find('#patientFBInput');
	var patientDiabetesInput = addForm.find('#patientDiabetesInput');
	var patientBloodPressureInput = addForm.find('#patientBloodPressureInput');

	var qrcodePreviewIMG = addForm.find('#qrcodePreviewIMG');
	
	var PatientObject = {
		patientId: (options != null) ? options.patientId : null,
		clinicId: (USER_CONFIG) ? USER_CONFIG.clinicId : null,
		patientHashId: null,
		patientName: null,
		patientPhone: null,
		patientPass: null,
		patientAge: null,
		patientGender: null,
		patientAddress: null,
		patientBarcode:null,
		patientQRCode: null,
		patientState: null,
		patientWhatsapp: null,
		patientFB: null,
		patientChildren: null,
		patientBirthPlace:null,
		patientBirthDate: null,
		ChangedSettings: {
			patientBloodPressure: null,
			patientDiabetes: null,
			patientWeight: null,
			patientBasin: null
		}
	};
	// submit
	addForm.off('submit');
	addForm.on('submit', async e =>
	{
		e.preventDefault();
		var target = addForm;
		PatientObject.patientName = patientNameInput.val();
		PatientObject.patientPhone = patientPhoneInput.val();
		PatientObject.patientPass = patientPassInput.val();
		PatientObject.patientAge = patientAgeInput.val();
		PatientObject.patientGender = patientGenderSelect.find(':selected').val();
		PatientObject.patientAddress = patientAddressInput.val();
		PatientObject.patientHashId = uniqid();
		PatientObject.patientState = patientStateInput.val();
		PatientObject.patientWhatsapp = patientWhatsappInput.val();
		PatientObject.patientFB = patientFBInput.val();
		PatientObject.patientChildren = patientChildrenInput.val();
		PatientObject.patientBirthPlace = patientBirthPlaceInput.val();
		PatientObject.patientBirthDate = patientBirthDateInput.val();
		PatientObject.ChangedSettings.patientBloodPressure = patientBloodPressureInput.val();
		PatientObject.ChangedSettings.patientDiabetes = patientDiabetesInput.val();
		PatientObject.ChangedSettings.patientWeight = patientWeightInput.val();
		PatientObject.ChangedSettings.patientBasin = patientBasinInput.val();

		// update
		if ( PatientObject.patientId != null )
		{
			// translate
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				console.log(PatientObject);
				// display loader
				TopLoader("حفظ البيانات...");
				updatePatient(PatientObject).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0)
						.find('#text').text(response.message);
						return;
					}

					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					// reset
					target[0].reset();
					// clear id
					PatientObject.patientId = null;
					//
				});
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				// display loader
				TopLoader("Enregistrement des données...");
				updatePatient(PatientObject).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0)
						.find('#text').text(response.message);
						return;
					}

					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					// reset
					target[0].reset();
					// clear id
					PatientObject.patientId = null;
					//
				});
			}
			return;
		}
		//create qr code
		var page = `${PROJECT_URL}Patient/Dashboard/?patient_session=${PatientObject.patientHashId}`;
		var qrcode = await generateQRCode( page );
		PatientObject.patientQRCode = qrcode;
		qrcodePreviewIMG.attr('src', qrcode);
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("حفظ البيانات...");
			addPatient(PatientObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					return;
				}

				ERROR_BOX.show(0).delay(7*1000).hide(0)
				.find('#text').text(response.message);
				// reset
				target[0].reset();
				//
			});
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("Enregistrement des données...");
			addPatient(PatientObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					return;
				}

				ERROR_BOX.show(0).delay(7*1000).hide(0)
				.find('#text').text(response.message);
				// reset
				target[0].reset();
				//
			});
		}
	});
	/*
	// barcode
	listenForBarcodeScanner(barcode =>
	{
		if ( patientBarcodeInput.is(':focus') )
			patientBarcodeInput.val(barcode);
	});
	*/
	// display one
	displayOne(PatientObject.patientId);
	function displayOne(patientId)
	{
		if ( patientId == null )
			return;

		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("جلب بيانات المريض...");
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("Obtenir les données des patients...");
		}
		getPatient(patientId).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
				return;

			var data = response.data;
			// display on form
			patientNameInput.val(data.patientName);
			patientPhoneInput.val(data.patientPhone);
			patientPassInput.val( (data.patientPass != null && data.patientPass != '') ? data.patientPass : '' );
			patientAgeInput.val(data.patientAge);
			setOptionSelected(patientGenderSelect, data.patientGender);
			patientAddressInput.val(data.patientAddress);
			patientBarcodeInput.val(data.patientBarcode);
			patientBasinInput.val(data.patientBasin);
			patientWeightInput.val(data.patientWeight);
			patientBirthPlaceInput.val(data.patientBirthPlace);
			patientBirthDateInput.val(data.patientBirthDate);
			patientChildrenInput.val(data.patientChildren);
			patientStateInput.val(data.patientState);
			patientWhatsappInput.val(data.patientWhatsapp);
			patientFBInput.val(data.patientFB);
			patientDiabetesInput.val(data.patientDiabetes);
			patientBloodPressureInput.val(data.patientBloodPressure);

			PatientObject.patientQRCode = data.patientQRCode;
			qrcodePreviewIMG.attr('src', data.patientQRCode);
		});
	}
}
// setup all patients
function setupAllPatients()
{
	var allPatientsContainer = $('#allPatientsContainer');
	if ( allPatientsContainer[0] == undefined )
		return;

	var ERROR_BOX = allPatientsContainer.find('#ERROR_BOX');
	var deleteSelectedBTN = allPatientsContainer.find('#deleteSelectedBTN');
	var searchInput = allPatientsContainer.find('#searchInput');
	var pagination = allPatientsContainer.find('#pagination');
	var tableElement = allPatientsContainer.find('#tableElement');

	var contentsWrapper = allPatientsContainer.find('#contentsWrapper');
	var changedSettingsWrapper = allPatientsContainer.find('#changedSettingsWrapper');
	var backBTN = changedSettingsWrapper.find('#backBTN');

	var PatientObject = {
		patientId: null
	}

	// back to contentsWrapper
	backBTN.off('click');
	backBTN.on('click', e =>
	{
		contentsWrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// tableElement click
	tableElement.off('click');
	tableElement.on('click', async e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'UPDATE' )
		{
			var patientId = target.data('patientid');
			var pageHTML = await getPage('views/pages/add-patients.ejs');
			MAIN_CONTENT_CONTAINER.html(pageHTML);
			setupAddPatients({patientId: patientId});
			//rebindEvents();
		}
		else if ( target.data('role') == 'READMORE' )
		{
			var parent = target.closest('.card-01');
			parent.toggleClass('half-collapse');
		}
		else if ( target.data('role') == 'VIEW_MORE_SETTINGS' )
		{
			PatientObject.patientId = target.data('patientid');
			changedSettingsWrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
		}
	});
	// delete
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(c =>
		{
			// translate
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				TopLoader("حذف البيانات...");
				deletePatients( getSelectedRows() ).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0)
						.find('#text').text(response.message);
						return;
					}
					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					//
					displayAll();
				});
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				TopLoader("Suprimmer les données...");
				deletePatients( getSelectedRows() ).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0)
						.find('#text').text(response.message);
						return;
					}
					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					//
					displayAll();
				});
			}
		});
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', e =>
	{
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: searchInput.val()
		};
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("جاري البحث...");
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("En train de rechercher...");
		}
		searchPatientsLocal(SearchObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			// clear html
			tableElement.html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			var count = 0;
			$.each(data, (k,v) =>
			{
				count++;
				var checkboxLabel = '';
				var updateBTN = '';
				var patientPass = (v.patientPass != null
								&& v.patientPass != '') ? v.patientPass : "لا يوجد";
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
				{
					checkboxLabel = "أنقر للتحديد";
					updateBTN = "تحديث البيانات";
					html += `<div class="col-lg-4 col-md-6 col-sm-12">
								<div class="card-01 half-collapse">
									<div class="card-header">
										<div class="form-check border-bottom pb-3">
											<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault_${count}" data-role="CHECK" data-patientid="${v.patientId}">
											<label class="form-check-label" for="flexCheckDefault_${count}">
												${checkboxLabel}
											</label>
										</div>
										<div class="row gx-2 gy-2">
											<div class="col-md-6">
												<div class="title-medium">${v.patientName}</div>
												<div class="desc-medium">
													${v.patientPhone}
												</div>
											</div>
											<div class="col-md-6">
												<div class="inline-flex flex-center w-100 h-100">
													<img src="${v.patientQRCode}" class="img-03" alt="">	
												</div>
											</div>
										</div>
									</div>
									<div class="card-body">
										<ul class="card-list">
											<div class="row gx-2 gy-3">
												<div class="col-md-6 col-sm-12">
													<li class="list-item">كلمة المرور: ${patientPass}</li>
													<li class="list-item">العمر: ${v.patientAge}</li>
													<li class="list-item">جنس: ${v.patientGender}</li>
													<li class="list-item">العنوان: ${v.patientAddress}</li>
													<li class="list-item">محيط الحوض: ${v.patientBasin}</li>
													<li class="list-item">ضغط الدم: ${v.patientBloodPressure}</li>
												</div>
												<div class="col-md-6 col-sm-12">
													<li class="list-item">نسبة السكر: ${v.patientDiabetes}</li>
													<li class="list-item">الوزن: ${v.patientWeight}</li>
													<li class="list-item">تاريخ ومكان الازدياد: ${v.patientBirthDate} ${v.patientBirthPlace}</li>
													<li class="list-item">عدد الأطفال: ${v.patientChildren}</li>
													<li class="list-item">الوضعية: ${v.patientState}</li>
													<li class="list-item">واتساب: ${v.patientWhatsapp}</li>
												</div>
											</div>
											<li class="list-item">فيسبوك: ${v.patientFB}</li>
											<li class="list-item">تاريخ الاظافة: ${v.patientDate} | ${v.patientTime}</li>
										</ul>
										<a href="#" class="expand-btn" data-role="READMORE">توسيع | طي</a>
									</div>
									<div class="card-footer">
										<button class="btn btn-primary btn-sm" data-role="UPDATE" data-patientid="${v.patientId}">
											${updateBTN}
										</button>
										<a href="#" class="text-02" data-role="VIEW_MORE_SETTINGS" data-patientid="${v.patientId}">عرض المزيد</a>
									</div>
								</div>
							</div>PAG_SEP`;	
				}
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				{
					checkboxLabel = "Cliquez pour sélectionner";
					updateBTN = "Mise à jour des données";
					var patientPass = (v.patientPass != null
								&& v.patientPass != '') ? v.patientPass : "il n'y a pas";
					html += `<div class="col-lg-6 col-md-6 col-sm-12">
								<div class="card-01 half-collapse">
									<div class="card-header">
										<div class="form-check border-bottom pb-3">
											<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault_${count}" data-role="CHECK" data-patientid="${v.patientId}">
											<label class="form-check-label" for="flexCheckDefault_${count}">
												${checkboxLabel}
											</label>
										</div>
										<div class="row gx-2 gy-2">
											<div class="col-md-6">
												<div class="title-medium">${v.patientName}</div>
												<div class="desc-medium">
													${v.patientPhone}
												</div>
											</div>
											<div class="col-md-6">
												<div class="inline-flex flex-center w-100 h-100">
													<img src="${v.patientQRCode}" class="img-03" alt="">	
												</div>
											</div>
										</div>
									</div>
									<div class="card-body">
										<ul class="card-list">
											<div class="row gx-2 gy-3">
												<div class="col-md-6 col-sm-12">
													<li class="list-item">Mot de passe: ${patientPass}</li>
													<li class="list-item">l'âge: ${v.patientAge}</li>
													<li class="list-item">le genre: ${v.patientGender}</li>
													<li class="list-item">l'adresse: ${v.patientAddress}</li>
													<li class="list-item">circonférence pelvienne: ${v.patientBasin}</li>
													<li class="list-item">Pression artérielle: ${v.patientBloodPressure}</li>
												</div>
												<div class="col-md-6 col-sm-12">
													<li class="list-item">sucre pourcentage: ${v.patientDiabetes}</li>
													<li class="list-item">le poids: ${v.patientWeight}</li>
														<li class="list-item">date et lieu de naissance: ${v.patientBirthDate} ${v.patientBirthPlace}</li>
													<li class="list-item">Nombre d'enfants: ${v.patientChildren}</li>
													<li class="list-item">posture: ${v.patientState}</li>
													<li class="list-item">WhatsApp: ${v.patientWhatsapp}</li>
												</div>
											</div>
											<li class="list-item">Facebook: ${v.patientFB}</li>
											<li class="list-item">Date ajoutée : ${v.patientDate} | ${v.patientTime}</li>
										</ul>
										<a href="#" class="expand-btn" data-role="READMORE">agrandir | plier</a>
									</div>
									<div class="card-footer">
										<button class="btn btn-primary btn-sm" data-role="UPDATE" data-patientid="${v.patientId}">
											${updateBTN}
										</button>
										<a href="#" class="text-02" data-role="VIEW_MORE_SETTINGS" data-patientid="${v.patientId}">Afficher plus</a>
									</div>
								</div>
							</div>PAG_SEP`;	
				}	
			});
			// add html
			var options = {
				data: html.split('PAG_SEP'),
				resultsPerPage: 9
			};
			new SmoothPagination(pagination, tableElement, options);
		});
	});
	// display all
	displayAll();
	function displayAll()
	{
		searchInput.trigger('keyup');
	}
	// get selected
	function getSelectedRows()
	{
		var list = [];
		var checks = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < checks.length; i++) 
		{
			var check = $(checks[i]);
			if ( check.is(':checked') )
				list.push({ patientId: check.data('patientid') });
		}

		return list;
	}

	// blood pressure
	var collapseOne = allPatientsContainer.find('#collapseOne');
	var pagination0 = collapseOne.find('#pagination0');
	var tableElement0 = collapseOne.find('#tableElement0');

	// tableElement click
	tableElement0.off('click');
	tableElement0.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'DELETE' )
		{
			PromptConfirmDialog().then(c =>
			{
				// display loader
				SectionLoader(collapseOne.find('.accordion-body'));
				deleteChangedSetting(target.data('id')).then(response =>
				{
					// hide loader
					SectionLoader(collapseOne.find('.accordion-body'), '');
					if ( response.code == 404 )	
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
						return;
					}
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					// 
					displayBloodPressure();
				});
			});
		}
	});
	// collapseOne
	collapseOne.off('shown.bs.collapse');
	collapseOne.on('shown.bs.collapse', e =>
	{
		displayBloodPressure();
	});
	//collapseOne.trigger('shown.bs.collapse');

	// display blood pressure
	function displayBloodPressure()
	{
		// display blood pressure
		SectionLoader(collapseOne.find('.accordion-body'));
		listBloodPressure(PatientObject.patientId).then(response =>
		{
			// hide loader
			SectionLoader(collapseOne.find('.accordion-body'), '');
			// clear html
			tableElement0.find('.tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<div class="tr">
							<div class="td">${v.patientBloodPressure}</div>
							<div class="td">${v.infoDate}|${v.infoTime}</div>
							<div class="td pointer">
								<button class="btn btn-danger btn-sm" data-role="DELETE" data-id="${v.id}">
									<span class="no-pointer">
										<i class="fas fa-trash"></i>
									</span>
								</button>
							</div>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};
			new SmoothPagination(pagination, tableElement0.find('.tbody'), options);
		});
	}
	// diabetes
	var collapseTwo = allPatientsContainer.find('#collapseTwo');
	var pagination2 = collapseTwo.find('#pagination2');
	var tableElement2 = collapseTwo.find('#tableElement2');

	// tableElement click
	tableElement2.off('click');
	tableElement2.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'DELETE' )
		{
			PromptConfirmDialog().then(c =>
			{
				// display loader
				SectionLoader(collapseTwo.find('.accordion-body'));
				deleteChangedSetting(target.data('id')).then(response =>
				{
					// hide loader
					SectionLoader(collapseTwo.find('.accordion-body'), '');
					if ( response.code == 404 )	
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
						return;
					}
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					// 
					displayDiabetes();
				});
			});
		}
	});
	// collapseTwo
	collapseTwo.off('shown.bs.collapse');
	collapseTwo.on('shown.bs.collapse', e =>
	{
		displayDiabetes();
	});

	// display diabetes
	function displayDiabetes()
	{
		// display blood pressure
		SectionLoader(collapseTwo.find('.accordion-body'));
		listDiabetes(PatientObject.patientId).then(response =>
		{
			// hide loader
			SectionLoader(collapseTwo.find('.accordion-body'), '');
			// clear html
			tableElement2.find('.tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<div class="tr">
							<div class="td">${v.patientDiabetes}</div>
							<div class="td">${v.infoDate}|${v.infoTime}</div>
							<div class="td pointer">
								<button class="btn btn-danger btn-sm" data-role="DELETE" data-id="${v.id}">
									<span class="no-pointer">
										<i class="fas fa-trash"></i>
									</span>
								</button>
							</div>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};
			new SmoothPagination(pagination2, tableElement2.find('.tbody'), options);
		});
	}
	// weight
	var collapseThree = allPatientsContainer.find('#collapseThree');
	var pagination3 = collapseThree.find('#pagination3');
	var tableElement3 = collapseThree.find('#tableElement3');

	// tableElement click
	tableElement3.off('click');
	tableElement3.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'DELETE' )
		{
			PromptConfirmDialog().then(c =>
			{
				// display loader
				SectionLoader(collapseThree.find('.accordion-body'));
				deleteChangedSetting(target.data('id')).then(response =>
				{
					// hide loader
					SectionLoader(collapseThree.find('.accordion-body'), '');
					if ( response.code == 404 )	
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
						return;
					}
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					// 
					displayWeight();
				});
			});
		}
	});
	// collapseThree
	collapseThree.off('shown.bs.collapse');
	collapseThree.on('shown.bs.collapse', e =>
	{
		displayWeight();
	});

	// display weight
	function displayWeight()
	{
		// display blood pressure
		SectionLoader(collapseThree.find('.accordion-body'));
		listWeight(PatientObject.patientId).then(response =>
		{
			// hide loader
			SectionLoader(collapseThree.find('.accordion-body'), '');
			// clear html
			tableElement3.find('.tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<div class="tr">
							<div class="td">${v.patientWeight}</div>
							<div class="td">${v.infoDate}|${v.infoTime}</div>
							<div class="td pointer">
								<button class="btn btn-danger btn-sm" data-role="DELETE" data-id="${v.id}">
									<span class="no-pointer">
										<i class="fas fa-trash"></i>
									</span>
								</button>
							</div>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};
			new SmoothPagination(pagination3, tableElement3.find('.tbody'), options);
		});
	}
	// basin
	var collapseFour = allPatientsContainer.find('#collapseFour');
	var pagination4 = collapseFour.find('#pagination4');
	var tableElement4 = collapseFour.find('#tableElement4');

	// tableElement click
	tableElement4.off('click');
	tableElement4.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'DELETE' )
		{
			PromptConfirmDialog().then(c =>
			{
				// display loader
				SectionLoader(collapseFour.find('.accordion-body'));
				deleteChangedSetting(target.data('id')).then(response =>
				{
					// hide loader
					SectionLoader(collapseFour.find('.accordion-body'), '');
					if ( response.code == 404 )	
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
						return;
					}
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					// 
					displayBasin();
				});
			});
		}
	});
	// collapseFour
	collapseFour.off('shown.bs.collapse');
	collapseFour.on('shown.bs.collapse', e =>
	{
		displayBasin();
	});

	// display basin
	function displayBasin()
	{
		// 
		SectionLoader(collapseFour.find('.accordion-body'));
		listBasin(PatientObject.patientId).then(response =>
		{
			// hide loader
			SectionLoader(collapseFour.find('.accordion-body'), '');
			// clear html
			tableElement4.find('.tbody').html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<div class="tr">
							<div class="td">${v.patientBasin}</div>
							<div class="td">${v.infoDate}|${v.infoTime}</div>
							<div class="td pointer">
								<button class="btn btn-danger btn-sm" data-role="DELETE" data-id="${v.id}">
									<span class="no-pointer">
										<i class="fas fa-trash"></i>
									</span>
								</button>
							</div>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};
			new SmoothPagination(pagination4, tableElement4.find('.tbody'), options);
		});
	}

	// add changed settings
	// save more info
	var moreInfoForm = allPatientsContainer.find('#moreInfoForm');
	var bloodPressureInput = moreInfoForm.find('#bloodPressureInput');
	var diabetesInput = moreInfoForm.find('#diabetesInput');
	var weightInput = moreInfoForm.find('#weightInput');
	var basinInput = moreInfoForm.find('#basinInput');
	var infoDateInput = moreInfoForm.find('#infoDateInput');
	var infoTimeInput = moreInfoForm.find('#infoTimeInput');

	var now = new Date();
	// set current date/time in input
	infoDateInput.val(date_time.format(now, 'YYYY-MM-DD'));
	infoTimeInput.val(date_time.format(now, 'HH:mm:ss'));
	// moreInfoForm submt
	moreInfoForm.off('submit');
	moreInfoForm.on('submit', e =>
	{
		e.preventDefault();
		var target = moreInfoForm;
		PatientObject.patientBloodPressure = bloodPressureInput.val();
		PatientObject.patientDiabetes = diabetesInput.val();
		PatientObject.patientWeight = weightInput.val();
		PatientObject.patientBasin = basinInput.val();
		PatientObject.infoDate = infoDateInput.val();
		PatientObject.infoTime = infoTimeInput.val();
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("اظافة البيانات...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Ajouter des données...");

		addChangedSettings(PatientObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text')
				.text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text')
			.text(response.message);
			// reset
			target[0].reset();
			// set current date/time in input
			infoDateInput.val(date_time.format(now, 'YYYY-MM-DD'));
			infoTimeInput.val(date_time.format(now, 'HH:mm:ss'));
		});
	});
}
// setup add prescriptions
function setupAddPrescriptions(options = null)
{
	var addPrescriptionsContainer = $('#addPrescriptionsContainer');
	if ( addPrescriptionsContainer[0] == undefined )
		return;

	var ERROR_BOX = addPrescriptionsContainer.find('#ERROR_BOX');
	var addForm = addPrescriptionsContainer.find('#addForm');
	var addPresMedsBTN = addForm.find('#addPresMedsBTN');
	var medicinesDiv = addForm.find('#medicines');
	var prescNoteInput = addForm.find('#prescNoteInput');
	var presQRCodeIMG = addForm.find('#presQRCodeIMG');
	var patientsSearchInput = addForm.find('#patientsSearchInput');
	var patientSelect = addForm.find('#patientSelect');

	var PrescObject = {
		prescriptionId: (options) ? options.prescriptionId : null,
		prescriptionHashId: null,
		patientId: null,
		prescriptionQRCode: null,
		prescriptionNote: null,
		medicines: []
	};
	// add / update
	addForm.off('submit');
	addForm.on('submit', async e =>
	{
		e.preventDefault();
		var target = addForm;
		PrescObject.patientId = patientSelect.find(':selected').val();
		PrescObject.prescriptionNote = prescNoteInput.val();
		PrescObject.medicines = getMedicines();
		// update
		if ( PrescObject.prescriptionId != null )
		{
			// translate
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				TopLoader("جاري حفظ البيانات...");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				TopLoader("Enregistrement des données...");
			
			updatePrescription(PrescObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					return;
				}
				ERROR_BOX.show(0).delay(7*1000).hide(0)
				.find('#text').text(response.message);
				// reset
				target[0].reset();
				PrescObject.prescriptionId = null;
			});
			return;
		}
		// add
		// generate qrcode
		PrescObject.prescriptionHashId = uniqid();
		var page = `${PROJECT_URL}view/prescription/${FUI_DISPLAY_LANG.lang}/?phash=${PrescObject.prescriptionHashId}`;
		var qrcode = await generateQRCode( page );
		presQRCodeIMG.attr('src', qrcode);
		PrescObject.prescriptionQRCode = qrcode;
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري حفظ البيانات...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Enregistrement des données...");
		addPrescription(PrescObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0)
				.find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0)
			.find('#text').text(response.message);
			// reset
			target[0].reset();
		});
	});
	// add medicines
	addPresMedsBTN.off('click');
	addPresMedsBTN.on('click', e =>
	{
		e.preventDefault();
		var medHTML = '';
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			medHTML = `<div class="row gx-1 gy-2 mt-1" data-role="MED">
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline border-bottom-forced" data-role="MED_NAME" placeholder="اسم الدواء">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline border-bottom-forced" data-role="MED_DOSE" placeholder="الجرعة">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline border-bottom-forced" data-role="MED_DURATION" placeholder="المدة الزمنية">
								</div>	
							</div>`;	
		}
		else
		{
			medHTML = `<div class="row gx-1 gy-2 mt-3" data-role="MED">
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline border-bottom-forced" data-role="MED_NAME" placeholder="nom du médicament">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline border-bottom-forced" data-role="MED_DOSE" placeholder="Dosage">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline border-bottom-forced" data-role="MED_DURATION" placeholder="Durée">
								</div>	
							</div>`;	
		}
		medicinesDiv.append(medHTML);
	});
	// search patients
	patientsSearchInput.off('keyup');
	patientsSearchInput.on('keyup', e =>
	{
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: patientsSearchInput.val()
		};

		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");
		searchPatientsLocal( SearchObject ).then(response =>
		{
			// hide loader
			TopLoader('', false);
			patientSelect.html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<option value="${v.patientId}">${v.patientName}</option>`;
			});
			// add html
			patientSelect.html(html);
			displayOne(PrescObject.prescriptionId);
		});
	});
	patientsSearchInput.trigger('keyup');
	// get medicines
	function getMedicines()
	{
		var list = [];
		var items = medicinesDiv.find('[data-role="MED"]');
		for (var i = 0; i < items.length; i++) 
		{
			var item = $(items[i]);
			var name = item.find('[data-role="MED_NAME"]').val();
			var dose = item.find('[data-role="MED_DOSE"]').val();
			var duration = item.find('[data-role="MED_DURATION"]').val();
			list.push({
				medName: name,
				medDose: dose,
				medDuration: duration
			});
		}

		return list;
	}
	// display one
	function displayOne(prescriptionId)
	{
		if ( prescriptionId == null )
			return;

		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("جلب البيانات...");
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("Récupération des données...");
		}
		getPrescription(prescriptionId).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
				return;

			var data = response.data;
			// display on form
			// append medicines
			var html = '';
			if ( data.medicines )
			{
				for (var i = 0; i < data.medicines.length; i++) 
				{
					var medicine = data.medicines[i];
					html += `<div class="row gx-1 gy-2 mt-1" data-role="MED">
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline border-bottom-forced" data-role="MED_NAME" value="${medicine.medName}">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline border-bottom-forced" data-role="MED_DOSE" value="${medicine.medDose}">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline border-bottom-forced" data-role="MED_DURATION" value="${medicine.medDuration}">
								</div>	
							</div>`;
				}
			}
			// add html
			medicinesDiv.html(html);
			prescNoteInput.val(data.prescriptionNote);
			presQRCodeIMG.attr('src', data.prescriptionQRCode);
			setOptionSelected(patientSelect, data.patientId);

			PrescObject = {
				prescriptionId: prescriptionId,
				prescriptionHashId: data.prescriptionHashId,
				patientId: data.patientId,
				prescriptionpatientWeight: data.prescriptionpatientWeight,
				prescriptionQRCode: data.prescriptionQRCode,
				prescriptionNote: data.prescriptionNote,
				medicines: data.medicines
			};
		});
	}
}
// setup all perscriptions
function setupAllPrescriptions()
{
	var allPrescriptionsContainer = $('#allPrescriptionsContainer');
	if ( allPrescriptionsContainer[0] == undefined )
		return;

	var ERROR_BOX = allPrescriptionsContainer.find('#ERROR_BOX');
	var deleteSelectedBTN = allPrescriptionsContainer.find('#deleteSelectedBTN');
	var searchInput = allPrescriptionsContainer.find('#searchInput');
	var pagination = allPrescriptionsContainer.find('#pagination');
	var tableElement = allPrescriptionsContainer.find('#tableElement');

	// tableElement click
	tableElement.off('click');
	tableElement.on('click', async e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'UPDATE' )
		{
			var prescriptionId = target.data('prescriptionid');
			var pageHTML = await getPage('views/pages/add-prescriptions.ejs');
			MAIN_CONTENT_CONTAINER.html(pageHTML);
			setupAddPrescriptions({prescriptionId: prescriptionId});
			//rebindEvents();
		}
		else if ( target.data('role') == 'READMORE' )
		{
			var parent = target.closest('.card-01');
			parent.toggleClass('half-collapse');
		}
	});
	// delete
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(c =>
		{
			console.log(getSelectedRows());
			// translate
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				TopLoader("حذف البيانات...");
				deletePrescriptions( getSelectedRows() ).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0)
						.find('#text').text(response.message);
						return;
					}
					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					//
					displayAll();
				});
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				TopLoader("Suprimmer les données...");
				deletePrescriptions( getSelectedRows() ).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0)
						.find('#text').text(response.message);
						return;
					}
					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					//
					displayAll();
				});
			}
		});
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', e =>
	{
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("جاري البحث...");
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("En train de rechercher...");
		}
		searchPrescriptions(searchInput.val()).then(response =>
		{
			// hide loader
			TopLoader('', false);
			// clear html
			tableElement.html('');
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			var count = 0;
			$.each(data, (k,v) =>
			{
				var checkboxLabel = '';
				var updateBTN = '';
				// list medicines
				var medicines = '';
				count++;
				var flush_heading = 'heading_'+count;
				var flush_collapse = 'collapse_'+count;
				var accordionId = 'accordionExample_'+count;
				if ( v.medicines )
				{
					for (var j = 0; j < v.medicines.length; j++) 
					{
						var med = v.medicines[j];
						medicines += `<ul class="list-h mb-2">
										<li class="list-item">${med.medName}</li>
										<li class="list-item">${med.medDose}</li>
										<li class="list-item">${med.medDuration}</li>
									</ul>`;
					}
				}
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
				{
					checkboxLabel = "أنقر للتحديد";
					updateBTN = "تحديث البيانات";

					html += `<div class="col-lg-4 col-md-6 col-sm-12">
								<div class="card-01 half-collapse">
									<div class="card-header">
										<div class="form-check border-bottom pb-3">
											<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault_${v.prescriptionId}" data-role="CHECK" data-prescriptionid="${v.prescriptionId}">
											<label class="form-check-label" for="flexCheckDefault_${v.prescriptionId}">
												${checkboxLabel}
											</label>
										</div>
										<div class="row gx-2 gy-2">
											<div class="col-md-6">
												<div class="title-medium">${v.clinicDoctorName}</div>
												<div class="desc-medium">
													${v.clinicPhone}
												</div>
											</div>
											<div class="col-md-6">
												<div class="inline-flex flex-center w-100 h-100">
													<img src="${v.prescriptionQRCode}" class="img-03" alt="">	
												</div>
											</div>
										</div>
									</div>
									<div class="card-body">
										<ul class="card-list">
											<li class="list-item">المريض: ${v.patientName}</li>
											<li class="list-item">العمر: ${v.patientAge}</li>
											<li class="list-item">جنس: ${v.patientGender}</li>
											<li class="list-item">العنوان: ${v.patientAddress}</li>
											<li class="list-item">ملاحظة: 
												<div class="input-text py-2">
													${v.prescriptionNote}
												</div>
											</li>
											<div class="accordion accordion-flush" id="${accordionId}">
												<div class="accordion-item">
													<h2 class="accordion-header" id="${flush_heading}">
														<button style="color:#000000;font-weight:300;" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${flush_collapse}" aria-expanded="false" aria-controls="${flush_collapse}">
															الأدوية
														</button>
													</h2>
													<div id="${flush_collapse}" class="accordion-collapse collapse" aria-labelledby="${flush_heading}" data-bs-parent="#${accordionId}">
														${medicines}
													</div>
												</div>
											</div>
											<li class="list-item">تاريخ الاظافة: ${v.prescriptionDate} | ${v.prescriptionTime}</li>
										</ul>
										<a href="#" class="expand-btn" data-role="READMORE">توسيع | طي</a>
									</div>
									<div class="card-footer">
										<button class="btn btn-primary btn-sm" data-role="UPDATE" data-prescriptionid="${v.prescriptionId}">
											${updateBTN}
										</button>
									</div>
								</div>
							</div>PAG_SEP`;	
				}
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				{
					checkboxLabel = "Cliquez pour sélectionner";
					updateBTN = "Mise à jour des données";
					html += `<div class="col-lg-4 col-md-6 col-sm-12">
								<div class="card-01">
									<div class="card-header">
										<div class="form-check border-bottom pb-3">
											<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" data-role="CHECK" data-prescriptionid="${v.prescriptionId}">
											<label class="form-check-label" for="flexCheckDefault">
												${checkboxLabel}
											</label>
										</div>
										<div class="row gx-2 gy-2">
											<div class="col-md-6">
												<div class="title-medium">${v.clinicDoctorName}</div>
												<div class="desc-medium">
													${v.clinicPhone}
												</div>
											</div>
											<div class="col-md-6">
												<div class="inline-flex flex-center w-100 h-100">
													<img src="${v.prescriptionQRCode}" class="img-03" alt="">	
												</div>
											</div>
										</div>
									</div>
									<div class="card-body">
										<ul class="card-list">
											<li class="list-item">le patient: ${v.patientName}</li>
											<li class="list-item">l'âge: ${v.patientAge}</li>
											<li class="list-item">Le genre: ${v.patientGender}</li>
											<li class="list-item">l'adresse: ${v.patientAddress}</li>
											<li class="list-item">Observation: 
												<div class="input-text py-2">
													${v.prescriptionNote}
												</div>
											</li>
											<div class="accordion accordion-flush" id="${accordionId}">
												<div class="accordion-item">
													<h2 class="accordion-header" id="${flush_heading}">
														<button style="color:#000000;font-weight:300;" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${flush_collapse}" aria-expanded="false" aria-controls="${flush_collapse}">
															pharmaceutique
														</button>
													</h2>
													<div id="${flush_collapse}" class="accordion-collapse collapse" aria-labelledby="${flush_heading}" data-bs-parent="#${accordionId}">
														${medicines}
													</div>
												</div>
											</div>
											<li class="list-item">Date ajoutée: ${v.prescriptionDate} | ${v.prescriptionTime}</li>
										</ul>
										<a href="#" class="expand-btn" data-role="READMORE">agrandir | plier</a>
									</div>
									<div class="card-footer">
										<button class="btn btn-primary btn-sm" data-role="UPDATE" data-prescriptionid="${v.prescriptionId}">
											${updateBTN}
										</button>
									</div>
								</div>
							</div>PAG_SEP`;	
				}	
			});
			// add html
			var options = {
				data: html.split('PAG_SEP'),
				resultsPerPage: 9
			};
			new SmoothPagination(pagination, tableElement, options);
		});
	});
	// display all
	displayAll();
	function displayAll()
	{
		searchInput.trigger('keyup');
	}
	// get selected
	function getSelectedRows()
	{
		var list = [];
		var checks = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < checks.length; i++) 
		{
			var check = $(checks[i]);
			if ( check.is(':checked') )
				list.push({ prescriptionId: check.data('prescriptionid') });
		}

		return list;
	}
}
// setup send message
function setupSendMessage()
{
	var sendMessageContainer = $('#sendMessageContainer');
	if ( sendMessageContainer[0] == undefined )
		return;

	var ERROR_BOX = sendMessageContainer.find('#ERROR_BOX');
	var sendMSGForm = sendMessageContainer.find('#sendMSGForm');
	var searchPatientsLocalInput = sendMessageContainer.find('#searchPatientsLocalInput');
	var receiverSelect = sendMessageContainer.find('#receiverSelect');
	var subjectInput = sendMessageContainer.find('#subjectInput');
	var bodyInput = sendMessageContainer.find('#bodyInput');


	var sendToPatientsWrapper = sendMessageContainer.find('#sendToPatientsWrapper');
	var switchToManagerMessagingBTN = sendToPatientsWrapper.find('#switchToManagerMessagingBTN');
	var sendToManagerWrapper = sendMessageContainer.find('#sendToManagerWrapper');
	var switchBackToPatientsMessagingBTN = sendToManagerWrapper.find('#switchBackToPatientsMessagingBTN');

	var sendMSGToManagerForm = sendMessageContainer.find('#sendMSGToManagerForm');
	var managerPhoneInput = sendMessageContainer.find('#managerPhoneInput');
	var subject2Input = sendMessageContainer.find('#subject2Input');
	var body2Input = sendMessageContainer.find('#body2Input');

	// back to patients messaging
	switchBackToPatientsMessagingBTN.off('click');
	switchBackToPatientsMessagingBTN.on('click', e =>
	{
		sendToPatientsWrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// back to manager messaging
	switchToManagerMessagingBTN.off('click');
	switchToManagerMessagingBTN.on('click', e =>
	{
		sendToManagerWrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// send
	sendMSGForm.off('submit');
	sendMSGForm.on('submit', e =>
	{
		e.preventDefault();
		var target = sendMSGForm;
		var MessageObject = {
			sender: USER_CONFIG.clinicHash,
			receiver: receiverSelect.find(':selected').val(),
			subject: subjectInput.val(),
			body: bodyInput.val()
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("يتم ارسال الرسالة...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Le message est envoyé...");

		sendMessage(MessageObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0)
				.find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0)
			.find('#text').text(response.message);
			// reset
			target[0].reset();
		});
	});
	// search patients
	searchPatientsLocalInput.off('keyup');
	searchPatientsLocalInput.on('keyup', e =>
	{
		var target = searchPatientsLocalInput;
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: target.val()
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");
		searchPatientsLocal(SearchObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<option value="${v.patientHashId}">${v.patientName}</option>`;
			});
			// add html
			receiverSelect.html(html);
		});
	});
	searchPatientsLocalInput.trigger('keyup');
	// send to manager
	sendMSGToManagerForm.off('submit');
	sendMSGToManagerForm.on('submit', async e =>
	{
		e.preventDefault();
		var target = sendMSGToManagerForm;

		//display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري استرجاع الرمز التسلسلي للمدير...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Récupération du code de série de l'administrateur...");

		var response = await getManager( {managerPhone: $.trim(managerPhoneInput.val())} );
		// hide loader
		TopLoader("", false);
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}

		var MessageObject = {
			sender: USER_CONFIG.clinicHash,
			receiver: response.data.managerHash,
			subject: subject2Input.val(),
			body: body2Input.val()
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("يتم ارسال الرسالة...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Le message est envoyé...");

		sendMessage(MessageObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0)
				.find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0)
			.find('#text').text(response.message);
			// reset
			target[0].reset();
		});
	});
}
//setup sent messages
function setupSentMessages()
{
	var sentMessagesContainer = $('#sentMessagesContainer');
	if ( sentMessagesContainer[0] == undefined )
		return;

	var ERROR_BOX = sentMessagesContainer.find('#ERROR_BOX');
	var msgOptionsList = sentMessagesContainer.find('#msgOptionsList');
	var pagination = sentMessagesContainer.find('#pagination');
	var tableElement = sentMessagesContainer.find('#tableElement');

	var contentsWrapper = sentMessagesContainer.find('#contentsWrapper');
	var msgContentsWrapper = sentMessagesContainer.find('#msgContentsWrapper');
	var messageDiv = msgContentsWrapper.find('#messageDiv');
	var backBTN = msgContentsWrapper.find('#backBTN');
	var addReplyForm = msgContentsWrapper.find('#addReplyForm');
	var replyTextInput = addReplyForm.find('#replyTextInput');
	var repliesCount = addReplyForm.find('#repliesCount');
	var pagination2 = msgContentsWrapper.find('#pagination2');
	var repliesDiv = msgContentsWrapper.find('#repliesDiv');

	// msgOptionsList click
	msgOptionsList.off('click');
	msgOptionsList.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'MARK_AS_READ' )
		{
			var data = {
				list: getSelectedRows(),
				read: true,
				userHash: USER_CONFIG.clinicHash
			};
			setMessagesRead(data).then(response =>
			{
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					return;
				}
				// display messages
				displayMessages();
			});
		}
		else if ( target.data('role') == 'DELETE' )
		{
			PromptConfirmDialog().then(c =>
			{
				// display loader
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
					TopLoader("حذف الرسائل...");
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
					TopLoader("supprimer les messages...");

				removeMessages(getSelectedRows()).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
						return;
					}
					// display messages
					displayMessages();
				});
			});
		}
	});
	// add reply
	addReplyForm.off('submit');
	addReplyForm.on('submit', e =>
	{
		e.preventDefault();
		var target = addReplyForm;
		var msgId = target.data('msgid');
		var MessageObject = {
			msgId: msgId,
			userHash: USER_CONFIG.clinicHash,
			replyText: replyTextInput.val()
		};
		// display loader
		SectionLoader(addReplyForm);
		addMessageReply(MessageObject).then(response =>
		{
			// hide loader
			SectionLoader(addReplyForm, '');
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}

			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			// reset
			target[0].reset();
			//
			displayMsgReplies(msgId);
		});
	});
	// back to messages
	backBTN.off('click');
	backBTN.on('click', e =>
	{
		contentsWrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	//tableElement click
	tableElement.off('click');
	tableElement.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'CHECK' )
		{
			var parent = target.closest('[data-role="ROW"]');
			toggleCheck(target);
			if ( target.is(':checked') )
				parent.addClass('selected');
			else
				parent.removeClass('selected');
		}
		else if ( target.data('role') == 'ROW' )
		{
			var msgId = target.data('msgid');
			addReplyForm.data('msgid', msgId).attr('data-msgid', msgId);
			//
			msgContentsWrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
			displayMsgReplies(msgId);
		}
	});
	// display messages
	displayMessages();
	function displayMessages()
	{
		var MessageObject = {
			userHash: USER_CONFIG.clinicHash,
			part: []
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جلب جميع الرسائل...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Recevez tous les messages...");

		listMessagesSent(MessageObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			// clear html
			tableElement.html('');
			if ( response.code == 404 )
			{
				tableElement.html(`<div class="list-item text-03 mb-1">
										<div style="width:4%;">
											<input type="checkbox" class="form-check-input" data-role="CHECK" data-msgid="">
										</div>
										<div class="no-pointer" style="flex-grow:1;width:15%;">
											<span class="">${response.message}</span>
										</div>
										<div class="no-pointer" style="flex-grow:2;">
											<span class="d-inline-block">
												
											</span>
											<span class="d-inline-block text-muted">
												
											</span>
										</div>
									</div>`);
				return;
			}

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				var isReadText = (v.isRead == 1) ? 'opacity-5' : '';
				var bodySnippet = '';
				if ( v.msgBody.length > 40 )
					bodySnippet = v.msgBody.substr(10, 25)+'...';
				html += `<div class="list-item text-03 mb-1 ${isReadText}" data-role="ROW" data-msgid="${v.msgId}">
							<div style="width:4%;">
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-msgid="${v.msgId}">
							</div>
							<div class="no-pointer" style="flex-grow:1;width:15%;">
								<span class="">${v.msgSubject.substr(0,20)}...</span>
							</div>
							<div class="no-pointer" style="flex-grow:2;">
								<span class="d-inline-block">
									${v.msgBody.substr(0,50)} - 
								</span>
								<span class="d-inline-block text-muted">
									${bodySnippet}
								</span>
							</div>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};
			new SmoothPagination(pagination, tableElement, options);
		});
	}
	// display msg replies
	function displayMsgReplies(msgId)
	{
		var MessageObject = {
			msgId: msgId,
			folder: 'sent',
			part: ['replies'],
			read: true,
			userHash: USER_CONFIG.clinicHash
		};
		// display loader
		SectionLoader(msgContentsWrapper);
		openMessage(MessageObject).then(response =>
		{
			// hide loader
			SectionLoader(msgContentsWrapper, '');
			// clear html
			repliesDiv.html('');
			// add total replies
			var repliesTotal = 0;
			if ( response.data )
			{
				if ( response.data.replies )
					repliesTotal = response.data.replies.length
			}
			repliesCount.text('('+repliesTotal+')');
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}

			var data = response.data;
			var html = '';
			// display message
			messageDiv.html(`<div class="row gx-2 gy-1 mb-2">
								<div class="col-lg-12 col-md-12 col-sm-12">
									<span class="text-01">${data.senderName}</span>
								</div>
								<div class="col-lg-12 col-md-12">
									<div class="text-muted">${data.senderPhone}</div>
								</div>
								<div class="col-lg-12 col-md-12">
									<div class="text-muted">${data.msgDate} | ${data.msgTime}</div>
								</div>
							</div>
							<div class="title-medium">
								${data.msgSubject}
							</div>
							<div class="text-02">
								${data.msgBody}
							</div>`);
			// display replies
			if ( data.replies )
			{
				$.each(data.replies, (k,v) =>
				{
					html += `<div class="col-lg-12 col-md-12 col-sm-12 p-2 border rounded">
								<div class="row gx-2 gy-1 mb-2">
									<div class="col-lg-12 col-md-12 col-sm-12">
										<span class="text-01">${v.replier.replierName}</span>
									</div>
									<div class="col-lg-12 col-md-12">
										<div class="text-muted">${v.replier.replierPhone}</div>
									</div>
									<div class="col-lg-12 col-md-12">
										<div class="text-muted">${v.replyDate} | ${v.replyTime}</div>
									</div>
								</div>
								<div class="text-02">
									${v.replyText}
								</div>
							</div>PAG_SEP`;
				});	
			}
			// add html
			var options = {
				data: html.split('PAG_SEP'),
				resultsPerPage: 6
			};
			new SmoothPagination(pagination2, repliesDiv, options);
		});
	}
	// get select rows
	function getSelectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({msgId: check.data('msgid')});
		}

		return list;
	}
}
//setup inbox messages
function setupInboxMessages()
{
	var inboxMessagesContainer = $('#inboxMessagesContainer');
	if ( inboxMessagesContainer[0] == undefined )
		return;

	var ERROR_BOX = inboxMessagesContainer.find('#ERROR_BOX');
	var msgOptionsList = inboxMessagesContainer.find('#msgOptionsList');
	var pagination = inboxMessagesContainer.find('#pagination');
	var tableElement = inboxMessagesContainer.find('#tableElement');

	var contentsWrapper = inboxMessagesContainer.find('#contentsWrapper');
	var msgContentsWrapper = inboxMessagesContainer.find('#msgContentsWrapper');
	var messageDiv = msgContentsWrapper.find('#messageDiv');
	var backBTN = msgContentsWrapper.find('#backBTN');
	var addReplyForm = msgContentsWrapper.find('#addReplyForm');
	var replyTextInput = addReplyForm.find('#replyTextInput');
	var repliesCount = addReplyForm.find('#repliesCount');
	var pagination2 = msgContentsWrapper.find('#pagination2');
	var repliesDiv = msgContentsWrapper.find('#repliesDiv');

	// msgOptionsList click
	msgOptionsList.off('click');
	msgOptionsList.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'MARK_AS_READ' )
		{
			var data = {
				list: getSelectedRows(),
				read: true,
				userHash: USER_CONFIG.clinicHash
			};
			setMessagesRead(data).then(response =>
			{
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					return;
				}
				// display messages
				displayMessages();
			});
		}
		else if ( target.data('role') == 'DELETE' )
		{
			PromptConfirmDialog().then(c =>
			{
				// display loader
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
					TopLoader("حذف الرسائل...");
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
					TopLoader("supprimer les messages...");

				removeMessages(getSelectedRows()).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
						return;
					}
					// display messages
					displayMessages();
				});
			});
		}
	});
	// add reply
	addReplyForm.off('submit');
	addReplyForm.on('submit', e =>
	{
		e.preventDefault();
		var target = addReplyForm;
		var msgId = target.data('msgid');
		var MessageObject = {
			msgId: msgId,
			userHash: USER_CONFIG.clinicHash,
			replyText: replyTextInput.val()
		};
		// display loader
		SectionLoader(addReplyForm);
		addMessageReply(MessageObject).then(response =>
		{
			// hide loader
			SectionLoader(addReplyForm, '');
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}

			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			// reset
			target[0].reset();
			//
			displayMsgReplies(msgId);
		});
	});
	// back to messages
	backBTN.off('click');
	backBTN.on('click', e =>
	{
		contentsWrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	//tableElement click
	tableElement.off('click');
	tableElement.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'CHECK' )
		{
			var parent = target.closest('[data-role="ROW"]');
			toggleCheck(target);
			if ( target.is(':checked') )
				parent.addClass('selected');
			else
				parent.removeClass('selected');
		}
		else if ( target.data('role') == 'ROW' )
		{
			var msgId = target.data('msgid');
			addReplyForm.data('msgid', msgId).attr('data-msgid', msgId);
			//
			msgContentsWrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
			displayMsgReplies(msgId);
		}
	});
	// display messages
	displayMessages();
	function displayMessages()
	{
		var MessageObject = {
			userHash: USER_CONFIG.clinicHash,
			part: []
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جلب جميع الرسائل...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Recevez tous les messages...");

		listMessagesInbox(MessageObject).then(response =>
		{
			// hide loader
			TopLoader('', false);
			// clear html
			tableElement.html('');
			if ( response.code == 404 )
			{
				tableElement.html(`<div class="list-item text-03 mb-1">
										<div style="width:4%;">
											<input type="checkbox" class="form-check-input" data-role="CHECK" data-msgid="">
										</div>
										<div class="no-pointer" style="flex-grow:1;width:15%;">
											<span class="">${response.message}</span>
										</div>
										<div class="no-pointer" style="flex-grow:2;">
											<span class="d-inline-block">
												
											</span>
											<span class="d-inline-block text-muted">
												
											</span>
										</div>
									</div>`);
				return;
			}

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				var isReadText = (v.isRead == 1) ? 'opacity-5' : '';
				var bodySnippet = '';
				if ( v.msgBody.length > 40 )
					bodySnippet = v.msgBody.substr(10, 25)+'...';
				html += `<div class="list-item text-03 mb-1 ${isReadText}" data-role="ROW" data-msgid="${v.msgId}">
							<div style="width:4%;">
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-msgid="${v.msgId}">
							</div>
							<div class="no-pointer" style="flex-grow:1;width:15%;">
								<span class="">${v.msgSubject.substr(0,20)}...</span>
							</div>
							<div class="no-pointer" style="flex-grow:2;">
								<span class="d-inline-block">
									${v.msgBody.substr(0,50)} - 
								</span>
								<span class="d-inline-block text-muted">
									${bodySnippet}
								</span>
							</div>
						</div>PAG_SEP`;
			});
			// add html
			var options = {
				data: html.split('PAG_SEP')
			};
			new SmoothPagination(pagination, tableElement, options);
		});
	}
	// display msg replies
	function displayMsgReplies(msgId)
	{
		var MessageObject = {
			msgId: msgId,
			folder: 'inbox',
			part: ['replies'],
			read: true,
			userHash: USER_CONFIG.clinicHash
		};
		// display loader
		SectionLoader(msgContentsWrapper);
		openMessage(MessageObject).then(response =>
		{
			// hide loader
			SectionLoader(msgContentsWrapper, '');
			// clear html
			repliesDiv.html('');
			// add total replies
			var repliesTotal = 0;
			if ( response.data )
			{
				if ( response.data.replies )
					repliesTotal = response.data.replies.length
			}
			repliesCount.text('('+repliesTotal+')');
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}

			var data = response.data;
			var html = '';
			// display message
			messageDiv.html(`<div class="row gx-2 gy-1 mb-2">
								<div class="col-lg-12 col-md-12 col-sm-12">
									<span class="text-01">${data.senderName}</span>
								</div>
								<div class="col-lg-12 col-md-12">
									<div class="text-muted">${data.senderPhone}</div>
								</div>
								<div class="col-lg-12 col-md-12">
									<div class="text-muted">${data.msgDate} | ${data.msgTime}</div>
								</div>
							</div>
							<div class="title-medium">
								${data.msgSubject}
							</div>
							<div class="text-02">
								${data.msgBody}
							</div>`);
			// display replies
			if ( data.replies )
			{
				$.each(data.replies, (k,v) =>
				{
					html += `<div class="col-lg-12 col-md-12 col-sm-12 p-2 border rounded">
								<div class="row gx-2 gy-1 mb-2">
									<div class="col-lg-12 col-md-12 col-sm-12">
										<span class="text-01">${v.replier.replierName}</span>
									</div>
									<div class="col-lg-12 col-md-12">
										<div class="text-muted">${v.replier.replierPhone}</div>
									</div>
									<div class="col-lg-12 col-md-12">
										<div class="text-muted">${v.replyDate} | ${v.replyTime}</div>
									</div>
								</div>
								<div class="text-02">
									${v.replyText}
								</div>
							</div>PAG_SEP`;
				});	
			}
			// add html
			var options = {
				data: html.split('PAG_SEP'),
				resultsPerPage: 6
			};
			new SmoothPagination(pagination2, repliesDiv, options);
		});
	}
	// get select rows
	function getSelectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({msgId: check.data('msgid')});
		}

		return list;
	}
}
// setup add Appointements
function setupAddAppointements(options = null)
{
	var addAppointementsContainer = $('#addAppointementsContainer');
	if ( addAppointementsContainer[0] == undefined )
		return;

	var ERROR_BOX = addAppointementsContainer.find('#ERROR_BOX');
	var addForm = addAppointementsContainer.find('#addForm');
	var classSelect = addForm.find('#classSelect');
	var patientsSearchInput = addForm.find('#patientsSearchInput');
	var patientSelect = addForm.find('#patientSelect');
	var aptNoteInput = addForm.find('#aptNoteInput');
	var aptDateInput = addForm.find('#aptDateInput');
	var aptTimeInput = addForm.find('#aptTimeInput');

	var wrapper01 = addAppointementsContainer.find('#wrapper01');

	var promise02 = null;
	var promise03 = null;
	// set default date / time
	var now = new Date();
	aptDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	aptTimeInput.val( date_time.format(now, 'HH:mm:ss') );
	var AppointementObject = {
		aptId: (options) ? options.aptId : null,
		clinicId: USER_CONFIG.clinicId,
		classId: null,
		patientId: null,
		aptNote: null,
		aptDate: null,
		aptTime: null
	}
	// addForm submit
	addForm.off('submit');
	addForm.on('submit', e =>
	{
		e.preventDefault();
		var target = addForm;
		AppointementObject.classId = classSelect.find(':selected').val();
		AppointementObject.patientId = patientSelect.find(':selected').val();
		AppointementObject.aptNote = aptNoteInput.val();
		AppointementObject.aptDate = aptDateInput.val();
		AppointementObject.aptTime = aptTimeInput.val();

		// display loader
		SectionLoader(wrapper01);
		// update
		if ( AppointementObject.aptId != null )
		{
			updateAppointement(AppointementObject).then(response =>
			{
				// hide loader
				SectionLoader(wrapper01, '');
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					return;
				}
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				// reset
				target[0].reset();
				aptDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
				aptTimeInput.val( date_time.format(now, 'HH:mm:ss') );
				//
				AppointementObject.aptId = null;
			});
			return;
		}
		// add
		addAppointement(AppointementObject).then(response =>
		{
			// hide loader
			SectionLoader(wrapper01, '');
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			// reset
			target[0].reset();
			aptDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
			aptTimeInput.val( date_time.format(now, 'HH:mm:ss') );
		});
	});
	// search patients
	patientsSearchInput.off('keyup');
	patientsSearchInput.on('keyup', e =>
	{
		var val = patientsSearchInput.val();
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: val
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		promise02 = searchPatientsLocal(SearchObject);
		promise02.then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<option value="${v.patientId}">${v.patientName}</option>`;
			});
			// add html
			patientSelect.html(html);
		});
	});
	patientsSearchInput.trigger('keyup');
	// list clinic treatment classes
	var clinicId = USER_CONFIG.clinicId;
	// display loader
	if ( FUI_DISPLAY_LANG.lang == 'ar' )
		TopLoader("جاري البحث...");
	else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		TopLoader("En train de rechercher...");

	promise03 = listClinicTreatmentClasses(clinicId);
	promise03.then(response =>
	{
		// hide loader
		TopLoader('', false);
		// clear html
		classSelect.html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			classSelect.html(`<option value="" selected>حدد قسم العلاج</option>`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			classSelect.html(`<option value="" selected>Sélectionnez la section de traitement</option>`);
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.classId}">${v.className}</option>`;
		});
		// add html
		classSelect.append(html);
	});
	// display one
	displayOne();
	async function displayOne()
	{
		await Promise.allSettled([promise02, promise03]);
		if ( AppointementObject.aptId == null )
			return;

		// display loader
		SectionLoader(wrapper01);

		getAppointement(AppointementObject.aptId).then(response =>
		{
			// hide loader
			SectionLoader(wrapper01, '');
			if ( response.code == 404 )
				return;

			var data = response.data;

			setOptionSelected(classSelect, data.classId);
			setOptionSelected(patientSelect, data.patientId);
			aptNoteInput.val( data.aptNote );
			aptDateInput.val( data.aptDate );
			aptTimeInput.val( data.aptTime );
		});	
	}
}
// setup all registered appointements
function setupAllAppointements()
{
	var allAppointementsContainer = $('#allAppointementsContainer');
	if ( allAppointementsContainer[0] == undefined )
		return;

	var ERROR_BOX = allAppointementsContainer.find('#ERROR_BOX');
	var deleteSelectedBTN = allAppointementsContainer.find('#deleteSelectedBTN');
	var searchInput = allAppointementsContainer.find('#searchInput');
	var pagination = allAppointementsContainer.find('#pagination');
	var tableElement = allAppointementsContainer.find('#tableElement');

	// delete selected
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(async c =>
		{
			// display loader
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				TopLoader("حذف البيانات...");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				TopLoader("Suprimmer les données...");

			var response = await deleteAppointements(selectedRows());
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			//
			displayAll();
		});
	});
	// tableElement click
	tableElement.off('click');
	tableElement.on('click', async e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'UPDATE' )
		{
			var aptId = target.data('aptid');
			var response = await getPage('views/pages/add-appointements.ejs');
			MAIN_CONTENT_CONTAINER.html(response);
			setupAddAppointements({aptId: aptId});
		}
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', async e =>
	{
		var val = searchInput.val();
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: val
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		var response = await searchAppointementsLocal(SearchObject);
		// hide loader
		TopLoader('', false);
		// clear html
		tableElement.find('.tbody').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<div class="tr">
						<div class="td">
							<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-aptid="${v.aptId}">
						</div>
						<div class="td">${v.clinicName}</div>
						<div class="td">${v.className}</div>
						<div class="td">${v.patientName}</div>
						<div class="td">${v.aptNote}</div>
						<div class="td">${v.aptDate}|${v.aptTime}</div>
						<div class="td">
							<button class="btn btn-primary btn-sm pointer" data-role="UPDATE" data-aptid="${v.aptId}">
								<span class="no-pointer"><i class="fas fa-edit"></i></span>
							</button>		
						</div>
					</div>PAG_SEP`;
		});
		// add html
		var options = {
			data: html.split('PAG_SEP')
		};
		new SmoothPagination(pagination, tableElement.find('.tbody'), options);
	});
	// display all
	displayAll();
	function displayAll()
	{
		searchInput.trigger('keyup');
	}
	// selected rows
	function selectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({ aptId: check.data('aptid') });
		}

		return list;
	}
}
// setup products
function setupAddProducts(options = null)
{
	var addProductsContainer = $('#addProductsContainer');
	if ( addProductsContainer[0] == undefined )
		return;

	var ERROR_BOX = addProductsContainer.find('#ERROR_BOX');

	var addForm = addProductsContainer.find('#addForm');
	var productNameInput = addForm.find('#productNameInput');
	var productDescInput = addForm.find('#productDescInput');
	var productPriceInput = addForm.find('#productPriceInput');
	var productQuantityInput = addForm.find('#productQuantityInput');
	var productImageFile = addForm.find('#productImageFile');
	var pimgPreview = addForm.find('#pimgPreview');
	var productBarcodeInput = addForm.find('#productBarcodeInput');

	var wrapper01 = addProductsContainer.find('#wrapper01');

	var ProductObject = {
		productId: (options) ? options.productId : null
	};
	// submit
	addForm.off('submit');
	addForm.on('submit', async e =>
	{
		e.preventDefault();
		var target = addForm;
		ProductObject.productHash = uniqid();
		ProductObject.clinicId = USER_CONFIG.clinicId;
		ProductObject.productName = productNameInput.val();
		ProductObject.productDesc = productDescInput.val();
		ProductObject.productPrice = productPriceInput.val();
		ProductObject.productQuantity = productQuantityInput.val();
		ProductObject.productBarcode = productBarcodeInput.val();
		// update
		if ( ProductObject.productId != null )
		{
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				// display loader
				TopLoader("حفظ البيانات...");
				updateProduct(ProductObject).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0)
						.find('#text').text(response.message);
						return;
					}

					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					// reset
					target[0].reset();
					delete ProductObject.productImage;
					ProductObject.productId = null;
					pimgPreview.attr('src', 'assets/img/utils/placeholder.jpg');
					//
				});
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				// display loader
				TopLoader("Enregistrement des données...");
				updateProduct(ProductObject).then(response =>
				{
					// hide loader
					TopLoader('', false);
					if ( response.code == 404 )
					{
						ERROR_BOX.show(0).delay(7*1000).hide(0)
						.find('#text').text(response.message);
						return;
					}

					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					// reset
					target[0].reset();
					delete ProductObject.productImage;
					ProductObject.productId = null;
					pimgPreview.attr('src', 'assets/img/utils/placeholder.jpg');
					//
				});
			}
			return;
		}
		// add
		// translate
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
		{
			// display loader
			TopLoader("حفظ البيانات...");
			addProduct(ProductObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					return;
				}

				ERROR_BOX.show(0).delay(7*1000).hide(0)
				.find('#text').text(response.message);
				// reset
				target[0].reset();
				delete ProductObject.productImage;
				pimgPreview.attr('src', 'assets/img/utils/placeholder.jpg');
				//
			});
		}
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		{
			// display loader
			TopLoader("Enregistrement des données...");
			addProduct(ProductObject).then(response =>
			{
				// hide loader
				TopLoader('', false);
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0)
					.find('#text').text(response.message);
					return;
				}

				ERROR_BOX.show(0).delay(7*1000).hide(0)
				.find('#text').text(response.message);
				// reset
				target[0].reset();
				delete ProductObject.productImage;
				pimgPreview.attr('src', 'assets/img/utils/placeholder.jpg');
				//
			});
		}
	});
	// select image
	productImageFile.off('change');
	productImageFile.on('change', e =>
	{
		var target = productImageFile;
		if ( target[0].files.length == 0 )
			return;

		var file = target[0].files[0];
		pimgPreview.attr('src', file.path);
		ProductObject.productImage = file;

	});
	// barcode
	listenForBarcodeScanner(barcode =>
	{
		if ( productBarcodeInput.is(':focus') )
			productBarcodeInput.val(barcode);
	});
	// display one
	displayOne();
	function displayOne()
	{
		if ( ProductObject.productId == null )
			return;

		// display loader
		SectionLoader(wrapper01);
		getProduct(ProductObject.productId).then(response =>
		{
			// hide loader
			SectionLoader(wrapper01, '');
			if ( response.code == 404 )
				return;

			var data = response.data;
			// display on form
			var productImageUrl = (data.productImageData) ? JSON.parse(data.productImageData).url : 'assets/img/utils/placeholder.jpg';

			productNameInput.val(data.productName);
			productDescInput.val(data.productDesc);
			productPriceInput.val(data.productPrice);
			productQuantityInput.val(data.productQuantity);
			productBarcodeInput.val(data.productBarcode);
			pimgPreview.attr('src', productImageUrl);
		});
	}
}
// setup all products
function setupAllProducts()
{
	var allProductsContainer = $('#allProductsContainer');
	if ( allProductsContainer[0] == undefined )
		return;

	var ERROR_BOX = allProductsContainer.find('#ERROR_BOX');
	var deleteSelectedBTN = allProductsContainer.find('#deleteSelectedBTN');
	var searchInput = allProductsContainer.find('#searchInput');
	var pagination = allProductsContainer.find('#pagination');
	var tableElement = allProductsContainer.find('#tableElement');

	var currency = {
		ar: 'دج',
		fr: 'DA'
	};
	// delete selected
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(async c =>
		{
			// display loader
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				TopLoader("حذف البيانات...");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				TopLoader("Suprimmer les données...");

			var response = await deleteProducts(selectedRows());
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			//
			displayAll();
		});
	});
	// tableElement click
	tableElement.off('click');
	tableElement.on('click', async e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'UPDATE' )
		{
			var productId = target.data('productid');
			var response = await getPage('views/pages/add-products.ejs');
			MAIN_CONTENT_CONTAINER.html(response);
			setupAddProducts({productId: productId});
		}
		else if ( target.data('role') == 'DELETE' )
		{
			PromptConfirmDialog().then(async c =>
			{
				var parent = target.closest('[data-role="ROW"]');
				var productId = target.data('productid');
				// display loader
				SectionLoader(parent);
				var response = await deleteProduct(productId);
				// hide loader
				SectionLoader(parent, '');
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					return;
				}
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				//
				displayAll();
			});
		}
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', async e =>
	{
		var val = searchInput.val();
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: val
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		var response = await searchProducts(SearchObject);
		// hide loader
		TopLoader('', false);
		// clear html
		tableElement.html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			if ( v.clinicId == USER_CONFIG.clinicId )
			{
				var productImageUrl = (v.productImageData) ? JSON.parse(v.productImageData).url : 'assets/img/utils/placeholder.jpg';

				if ( FUI_DISPLAY_LANG.lang == 'ar' )
				{
					html += `<div class="col-lg-4 col-md-6 col-sm-12">
								<div class="card-02 hover-shadow h-100 w-100 inline-flex" data-role="ROW">
									<div class="form-check border-bottom p-1">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault_${v.productId}" data-role="CHECK" data-productid="${v.productId}">
										<label class="form-check-label" for="flexCheckDefault_${v.productId}">
											أنقر للتحديد
										</label>
									</div>
									<div class="card-header" data-role="CARD_HEADER" style="cursor:pointer;background-image: url('${productImageUrl}');">
										
									</div>
									<div class="text-03 py-2 px-2">${v.productName.substr(0,35)}...</div>
									<div class="card-body">
										<div class="list-04">
											<div class="list-item">
												<span class="text-04">
													${v.productDesc.substr(0,50)}...
												</span>
											</div>
											<div class="list-item">
												السعر: <span class="text-04">${v.productPrice} ${currency.ar}</span>
											</div>
											<div class="list-item">
												الكمية: <span class="text-04">(${v.productQuantity})</span>
											</div>
											<div class="list-item text-center">
												<div class="btn-group btn-group-sm shadow">
													<button class="btn btn-primary btn-sm rounded-0" data-role="UPDATE" data-productid="${v.productId}">
														تعديل
													</button>
													<button class="btn btn-danger btn-sm rounded-0" data-role="DELETE" data-productid="${v.productId}">
														حذف
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>PAG_SEP`;	
				}
				else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				{
					html += `<div class="col-lg-4 col-md-6 col-sm-12">
								<div class="card-02 hover-shadow h-100 w-100 inline-flex" data-role="ROW">
									<div class="form-check border-bottom p-1">
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault_${v.productId}" data-role="CHECK" data-productid="${v.productId}">
										<label class="form-check-label" for="flexCheckDefault_${v.productId}">
											Cliquez pour sélectionner
										</label>
									</div>
									<div class="card-header" data-role="CARD_HEADER" style="cursor:pointer;background-image: url('${productImageUrl}');">
										
									</div>
									<div class="text-03 py-2 px-2">${v.productName.substr(0,35)}...</div>
									<div class="card-body">
										<div class="list-04">
											<div class="list-item">
												<span class="text-04">
													${v.productDesc.substr(0,50)}...
												</span>
											</div>
											<div class="list-item">
												le prix: <span class="text-04">${v.productPrice} ${currency.fr}</span>
											</div>
											<div class="list-item">
												Quantité: <span class="text-04">(${v.productQuantity})</span>
											</div>
											<div class="list-item text-center">
												<div class="btn-group btn-group-sm shadow">
													<button class="btn btn-primary btn-sm rounded-0" data-role="UPDATE" data-productid="${v.productId}">
														Modifier
													</button>
													<button class="btn btn-danger btn-sm rounded-0" data-role="DELETE" data-productid="${v.productId}">
														Supprimez
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>PAG_SEP`;	
				}	
			}
		});
		// add html
		var options = {
			data: html.split('PAG_SEP')
		};
		new SmoothPagination(pagination, tableElement, options);
	});
	// display all
	displayAll();
	function displayAll()
	{
		searchInput.trigger('keyup');
	}
	// selected rows
	function selectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({ productId: check.data('productid') });
		}

		return list;
	}
}
// setup sell products products
async function setupSellProducts(options = null)
{
	var sellProductsContainer = $('#sellProductsContainer');
	if ( sellProductsContainer[0] == undefined )
		return;

	var ERROR_BOX = sellProductsContainer.find('#ERROR_BOX');

	var addForm = sellProductsContainer.find('#addForm');
	var patientsSearchInput = addForm.find('#patientsSearchInput');
	var patientSelect = addForm.find('#patientSelect');
	var productsSearchInput = addForm.find('#productsSearchInput');
	var productSelect = addForm.find('#productSelect');
	var quantityInput = addForm.find('#quantityInput');
	var sellPriceInput = addForm.find('#sellPriceInput');
	var finalAmountInput = addForm.find('#finalAmountInput');
	var noteInput = addForm.find('#noteInput');

	var wrapper01 = sellProductsContainer.find('#wrapper01');
	var promise01 = null;
	var promise02 = null;

	var OrderObject = {
		order_id: (options) ? options.order_id : null,
		isAccepted: 1
	};
	// submit form
	addForm.off('submit');
	addForm.on('submit', e =>
	{
		e.preventDefault();
		var target = $(e.target);
		OrderObject.clinicId = USER_CONFIG.clinicId;
		OrderObject.user_id = patientSelect.find(':selected').val();
		OrderObject.order_item_id = productSelect.find(':selected').val();
		OrderObject.order_item_id = productSelect.find(':selected').val();
		OrderObject.order_item_quantity = quantityInput.val();
		OrderObject.order_item_price = sellPriceInput.val();
		OrderObject.order_note = noteInput.val();
		// display loader
		SectionLoader(wrapper01);
		// update
		if ( OrderObject.order_id != null )
		{
			updateOrder(OrderObject).then(response =>
			{
				// hide loader
				SectionLoader(wrapper01, '');
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					return;
				}
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				// reset
				target[0].reset();
				OrderObject.order_id = null;
			});
			return;
		}
		//add
		addOrder(OrderObject).then(response =>
		{
			// hide loader
			SectionLoader(wrapper01, '');
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			// reset
			target[0].reset();
		});
	});
	// search patients
	patientsSearchInput.off('keyup');
	patientsSearchInput.on('keyup', async e =>
	{
		var val = patientsSearchInput.val();
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: val
		};
		promise01 = searchPatientsLocal(SearchObject);
		// display loader
		SectionLoader( patientSelect.closest('.section') );
		promise01.then(response =>
		{
			// hide loader
			SectionLoader( patientSelect.closest('.section'), '' );
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				patientSelect.html(`<option value="">حدد الزبون</option>`);
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				patientSelect.html(`<option value="">Sélectionnez le client</option>`);
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			
			$.each(data, (k,v) =>
			{
				html += `<option value="${v.patientId}">${v.patientName}</option>`;
			});
			// add html
			patientSelect.append(html);	
		});
	});
	patientsSearchInput.trigger('keyup');
	// search products
	productsSearchInput.off('keyup');
	productsSearchInput.on('keyup', async e =>
	{
		var val = productsSearchInput.val();
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: val
		};
		promise02 = searchProducts(SearchObject);
		// display loader
		SectionLoader( productSelect.closest('.section') );
		promise02.then(response =>
		{
			// hide loader
			SectionLoader( productSelect.closest('.section'), '' );
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				productSelect.html(`<option value="">حدد المنتج</option>`);
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				productSelect.html(`<option value="">Sélectionnez le produit</option>`);
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			
			$.each(data, (k,v) =>
			{
				html += `<option data-product-price="${v.productPrice}" value="${v.productId}">${v.productName}</option>`;
			});
			// add html
			productSelect.append(html);	
		});
	});
	productsSearchInput.trigger('keyup');
	// select product
	productSelect.off('change');
	productSelect.on('change', e =>
	{
		var selected = productSelect.find(':selected');
		var product_price = parseFloat(selected.data('product-price'));
		sellPriceInput.val( product_price.toFixed(2) );
		// calculate final amount
		calculateFinalAmount();
	});
	// calculate final amount
	quantityInput.off('input');
	quantityInput.on('input', calculateFinalAmount);
	sellPriceInput.off('input');
	sellPriceInput.on('input', calculateFinalAmount);
	function calculateFinalAmount()
	{
		var price = parseFloat(sellPriceInput.val());
		var quantity = parseFloat(quantityInput.val());
		var final_amount = price * quantity;
		finalAmountInput.val( final_amount.toFixed(2) );
	}
	// display order info
	displayOne();
	async function displayOne()
	{
		if ( OrderObject.order_id == null )
			return;

		// display loader
		SectionLoader(wrapper01);
		await Promise.allSettled([promise01, promise02]);

		var response = await getOrder(OrderObject.order_id);
		// hide loader
		SectionLoader(wrapper01, '');
		if ( response.code == 404 )
			return;

		var data = response.data;

		setOptionSelected(patientSelect, data.user_id);
		setOptionSelected(productSelect, data.order_items[0].order_item_id);
		sellPriceInput.val(data.order_items[0].order_item_price);
		quantityInput.val(data.order_items[0].order_item_quantity);
		finalAmountInput.val(data.order_amount_paid);
		noteInput.val(data.order_note);
	}
}
// setup all products billings
function setupAllProductsBillings()
{
	var allProductsBillingsContainer = $('#allProductsBillingsContainer');
	if ( allProductsBillingsContainer[0] == undefined )
		return;

	var ERROR_BOX = allProductsBillingsContainer.find('#ERROR_BOX');

	var deleteSelectedBTN = allProductsBillingsContainer.find('#deleteSelectedBTN');
	var searchInput = allProductsBillingsContainer.find('#searchInput');
	var searchBTN = allProductsBillingsContainer.find('#searchBTN');
	var fromDateInput = allProductsBillingsContainer.find('#fromDateInput');
	var toDateInput = allProductsBillingsContainer.find('#toDateInput');
	var pagination = allProductsBillingsContainer.find('#pagination');
	var tableElement = allProductsBillingsContainer.find('#tableElement');

	var currency = {
		ar: 'دج',
		fr: 'DA'
	};
	// set primary dates
	var now = new Date();
	fromDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	toDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	// tableElement click
	tableElement.off('click');
	tableElement.on('click', async e =>
	{
		var target = $(e.target);
		if ( target[0].nodeName == 'TD' )
		{
			var parent = target.closest('tr');
			var nextTR = parent.next();
			nextTR.slideToggle(200)
			parent.toggleClass('expanded');
		}

		if ( target.data('role') == 'UPDATE' )
		{
			var order_id = target.data('orderid');
			var response = await getPage('views/pages/sell-products.ejs');
			MAIN_CONTENT_CONTAINER.html(response);
			setupSellProducts({order_id:order_id});
		}
	});
	// delete selected
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', async e =>
	{
		PromptConfirmDialog().then(async c =>
		{
			// display loader
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				TopLoader("حذف البيانات...");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				TopLoader("Suprimmer les données...");

			var response = await deleteOrders(selectedRows());
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			//
			displayAll();
		});
	});
	// search between dates
	searchBTN.off('click');
	searchBTN.on('click', async e =>
	{
		var query = searchInput.val();
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: query,
			from: fromDateInput.val(),
			to: toDateInput.val(),
			isAccepted: 1
		};

		var response = await searchOrdersBetweenDates(SearchObject);
		// hide loader
		TopLoader('', false);
		// clear html
		tableElement.find('tbody').html('');
		if ( response.code == 404 )
			return;
		
		var data = response.data;
		var html = '';
		for (var i = 0; i < data.length; i++) 
		{
			var order = data[i];
			// loop items
			if ( order.order_items )
			{
				var itemsHTML = '<ul class="list-group list-group-flush list-group-numbered">';
				var itemsHTML2 = '';
				var productPrice = 0.00;
				var order_item_dept_rate = 0.00;
				var order_item_price = 0.00;
				for (var j = 0; j < order.order_items.length; j++) 
				{
					var item = order.order_items[j];
					productPrice += parseFloat(item.item_info.productPrice);
					order_item_dept_rate += parseFloat(item.item_dept.order_item_dept_rate);
					order_item_price += parseFloat(item.order_item_price);
					itemsHTML += `<li class="list-group-item text-04">${item.item_name}</li>`;
					itemsHTML2 += `<tr>
									<td>${item.item_name}</td>
									<td>${item.order_item_quantity}</td>
									<td>${item.order_item_price}</td>
									<td>${item.item_dept.order_item_dept}</td>
									<td>${parseFloat(item.item_dept.order_item_dept_rate).toFixed(2)}</td>
									<td>${item.order_item_final_amount}</td>
									</tr>`;
				}
				itemsHTML += '</ul>';
			}
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				html += `<tr class="expand-row">
							<td>
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-orderid="${order.order_id}">
							</td>
							<td>${order.order_hash}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_amount_paid}</td>
							<td>${order.order_receiver_name}</td>
							<td style="width:15px">
								<svg part="svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-labelledby="ic-caret-up" focusable="false" viewBox="0 0 24 24" class="expand-icon" dataV17f0a767=""><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"></path></g></svg>
							</td>
							<td>
								<button class="btn-02" data-role="UPDATE" data-orderid="${order.order_id}">
									<span class="no-pointer"><i class="fas fa-edit"></i></span>
								</button>
							</td>
						</tr>PAG_SEP
						<tr class="expand-row__row" style="display:none;">
							<td colspan="10">
								<table class="table-01">
									<thead>
										<tr>
											<th>المنتج</th>
											<th>الكمية</th>
											<th>سعر الوحدة</th>
											<th>الدين (${currency.ar})</th>
											<th>الدين (%)</th>
											<th>السعر الكلي</th>
										</tr>
									</thead>
									<tbody>
										${itemsHTML2}
									</tbody>
								</table>
								<div class="order-price-table">
									<div class="order-price-table-contents">
										${itemsHTML}	
									</div>
									<div class="order-price-table-contents">
										<div class="order-price-table-td">
											<strong>السعر الاصلي</strong>
											<span>${productPrice.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>نسبة الدين (%)</strong>
											<span>${order_item_dept_rate.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>سعر البيع</strong>
											<span>${order_item_price.toFixed(2)}</span>
										</div>
										<div class="border-top my-1"></div>
										<div class="order-price-table-td">
											<strong>مجمل المدفوع</strong>
											<span>${order.order_amount_paid}</span>
										</div>	
									</div>
								</div>
							</td>
						</tr>PAG_SEP`;	
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				html += `<tr class="expand-row">
							<td>
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-orderid="${order.order_id}">
							</td>
							<td>${order.order_hash}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_amount_paid}</td>
							<td>${order.order_receiver_name}</td>
							<td style="width:15px">
								<svg part="svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-labelledby="ic-caret-up" focusable="false" viewBox="0 0 24 24" class="expand-icon" dataV17f0a767=""><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"></path></g></svg>
							</td>
							<td>
								<button class="btn-02" data-role="UPDATE" data-orderid="${order.order_id}">
									<span class="no-pointer"><i class="fas fa-edit"></i></span>
								</button>
							</td>
						</tr>PAG_SEP
						<tr class="expand-row__row" style="display:none;">
							<td colspan="10">
								<table class="table-01">
									<thead>
										<tr>
											<th>le produit</th>
											<th>Quantité</th>
											<th>prix d'Unité</th>
											<th> (${currency.fr})</th>
											<th>la dette (%)</th>
											<th>prix total</th>
										</tr>
									</thead>
									<tbody>
										${itemsHTML2}
									</tbody>
								</table>
								<div class="order-price-table">
									<div class="order-price-table-contents">
										${itemsHTML}	
									</div>
									<div class="order-price-table-contents">
										<div class="order-price-table-td">
											<strong>Le prix d'origine</strong>
											<span>${productPrice.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>taux d'endettement (%)</strong>
											<span>${order_item_dept_rate.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>Prix ​​de vente</strong>
											<span>${order_item_price}</span>
										</div>
										<div class="border-top my-1"></div>
										<div class="order-price-table-td">
											<strong>total payé</strong>
											<span>${order.order_amount_paid}</span>
										</div>	
									</div>
								</div>
							</td>
						</tr>PAG_SEP`;	
			}	
		}
		// add html
		var options = {
			data: html.split('PAG_SEP'),
			resultsPerPage: 6
		};
		new SmoothPagination(pagination, tableElement.find('tbody'), options);
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', async e =>
	{
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: searchInput.val(),
			isAccepted: 1
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		var response = await searchOrders(SearchObject);
		// hide loader
		TopLoader('', false);
		// clear html
		tableElement.find('tbody').html('');
		if ( response.code == 404 )
			return;
		
		var data = response.data;
		var html = '';
		for (var i = 0; i < data.length; i++) 
		{
			var order = data[i];
			// loop items
			if ( order.order_items )
			{
				var itemsHTML = '<ul class="list-group list-group-flush list-group-numbered">';
				var itemsHTML2 = '';
				var productPrice = 0.00;
				var order_item_dept_rate = 0.00;
				var order_item_price = 0.00;
				for (var j = 0; j < order.order_items.length; j++) 
				{
					var item = order.order_items[j];
					productPrice += parseFloat(item.item_info.productPrice);
					order_item_dept_rate += parseFloat(item.item_dept.order_item_dept_rate);
					order_item_price += parseFloat(item.order_item_price);
					itemsHTML += `<li class="list-group-item text-04">${item.item_name}</li>`;
					itemsHTML2 += `<tr>
									<td>${item.item_name}</td>
									<td>${item.order_item_quantity}</td>
									<td>${item.order_item_price}</td>
									<td>${item.item_dept.order_item_dept}</td>
									<td>${parseFloat(item.item_dept.order_item_dept_rate).toFixed(2)}</td>
									<td>${item.order_item_final_amount}</td>
									</tr>`;
				}
				itemsHTML += '</ul>';
			}
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				html += `<tr class="expand-row">
							<td>
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-orderid="${order.order_id}">
							</td>
							<td>${order.order_hash}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_amount_paid}</td>
							<td>${order.order_receiver_name}</td>
							<td style="width:15px">
								<svg part="svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-labelledby="ic-caret-up" focusable="false" viewBox="0 0 24 24" class="expand-icon" dataV17f0a767=""><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"></path></g></svg>
							</td>
							<td>
								<button class="btn-02" data-role="UPDATE" data-orderid="${order.order_id}">
									<i class="fas fa-edit no-pointer"></i>
								</button>
							</td>
						</tr>PAG_SEP
						<tr class="expand-row__row" style="display:none;">
							<td colspan="10">
								<table class="table-01">
									<thead>
										<tr>
											<th>المنتج</th>
											<th>الكمية</th>
											<th>سعر الوحدة</th>
											<th>الدين (${currency.ar})</th>
											<th>الدين (%)</th>
											<th>السعر الكلي</th>
										</tr>
									</thead>
									<tbody>
										${itemsHTML2}
									</tbody>
								</table>
								<div class="order-price-table">
									<div class="order-price-table-contents">
										${itemsHTML}	
									</div>
									<div class="order-price-table-contents">
										<div class="order-price-table-td">
											<strong>السعر الاصلي</strong>
											<span>${productPrice.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>نسبة الدين (%)</strong>
											<span>${order_item_dept_rate.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>سعر البيع</strong>
											<span>${order_item_price.toFixed(2)}</span>
										</div>
										<div class="border-top my-1"></div>
										<div class="order-price-table-td">
											<strong>مجمل المدفوع</strong>
											<span>${order.order_amount_paid}</span>
										</div>	
									</div>
								</div>
							</td>
						</tr>PAG_SEP`;	
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				html += `<tr class="expand-row">
							<td>
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-orderid="${order.order_id}">
							</td>
							<td>${order.order_hash}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_amount_paid}</td>
							<td>${order.order_receiver_name}</td>
							<td style="width:15px">
								<svg part="svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-labelledby="ic-caret-up" focusable="false" viewBox="0 0 24 24" class="expand-icon" dataV17f0a767=""><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"></path></g></svg>
							</td>
							<td>
								<button class="btn-02" data-role="UPDATE" data-orderid="${order.order_id}">
									<i class="fas fa-edit no-pointer"></i>
								</button>
							</td>
						</tr>PAG_SEP
						<tr class="expand-row__row" style="display:none;">
							<td colspan="10">
								<table class="table-01">
									<thead>
										<tr>
											<th>le produit</th>
											<th>Quantité</th>
											<th>prix d'Unité</th>
											<th> (${currency.fr})</th>
											<th>la dette (%)</th>
											<th>prix total</th>
										</tr>
									</thead>
									<tbody>
										${itemsHTML2}
									</tbody>
								</table>
								<div class="order-price-table">
									<div class="order-price-table-contents">
										${itemsHTML}	
									</div>
									<div class="order-price-table-contents">
										<div class="order-price-table-td">
											<strong>Le prix d'origine</strong>
											<span>${productPrice.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>taux d'endettement (%)</strong>
											<span>${order_item_dept_rate.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>Prix ​​de vente</strong>
											<span>${order_item_price}</span>
										</div>
										<div class="border-top my-1"></div>
										<div class="order-price-table-td">
											<strong>total payé</strong>
											<span>${order.order_amount_paid}</span>
										</div>	
									</div>
								</div>
							</td>
						</tr>PAG_SEP`;	
			}	
		}
		// add html
		var options = {
			data: html.split('PAG_SEP'),
			resultsPerPage: 6
		};
		new SmoothPagination(pagination, tableElement.find('tbody'), options);
	});
	// display all
	displayAll();
	function displayAll()
	{
		searchInput.trigger('keyup');
	}
	// selected rows
	function selectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({ order_id: check.data('orderid') });
		}

		return list;
	}
}
// setup billings waiting approval
function setupBillingsWaitingApproval()
{
	var billingsWaitingApprovalContainer = $('#billingsWaitingApprovalContainer');
	if ( billingsWaitingApprovalContainer[0] == undefined )
		return;

	var ERROR_BOX = billingsWaitingApprovalContainer.find('#ERROR_BOX');

	var deleteSelectedBTN = billingsWaitingApprovalContainer.find('#deleteSelectedBTN');
	var searchInput = billingsWaitingApprovalContainer.find('#searchInput');
	var searchBTN = billingsWaitingApprovalContainer.find('#searchBTN');
	var fromDateInput = billingsWaitingApprovalContainer.find('#fromDateInput');
	var toDateInput = billingsWaitingApprovalContainer.find('#toDateInput');
	var pagination = billingsWaitingApprovalContainer.find('#pagination');
	var tableElement = billingsWaitingApprovalContainer.find('#tableElement');

	var currency = {
		ar: 'دج',
		fr: 'DA'
	};
	// set primary dates
	var now = new Date();
	fromDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	toDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	// tableElement click
	tableElement.off('click');
	tableElement.on('click', async e =>
	{
		var target = $(e.target);
		if ( target[0].nodeName == 'TD' )
		{
			var parent = target.closest('tr');
			var nextTR = parent.next();
			nextTR.slideToggle(200)
			parent.toggleClass('expanded');
		}

		if ( target.data('role') == 'UPDATE' )
		{
			var order_id = target.data('orderid');
			var response = await getPage('views/pages/sell-products.ejs');
			MAIN_CONTENT_CONTAINER.html(response);
			setupSellProducts({order_id:order_id});
		}
		else if ( target.data('role') == 'ACCEPT' )
		{
			var order_id = target.data('orderid');
			PromptConfirmDialog().then(async c =>
			{
				// display loader
				SectionLoader(tableElement);
				var response = await acceptOrder(order_id);
				// hide loader
				SectionLoader(tableElement, '');
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					return;
				}
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				//
				displayAll();
			});
		}
	});
	// delete selected
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', async e =>
	{
		PromptConfirmDialog().then(async c =>
		{
			// display loader
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				TopLoader("حذف البيانات...");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				TopLoader("Suprimmer les données...");

			var response = await deleteOrders(selectedRows());
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			//
			displayAll();
		});
	});
	// search between dates
	searchBTN.off('click');
	searchBTN.on('click', async e =>
	{
		var query = searchInput.val();
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: query,
			from: fromDateInput.val(),
			to: toDateInput.val(),
			isAccepted: 0
		};

		var response = await searchOrdersBetweenDates(SearchObject);
		// hide loader
		TopLoader('', false);
		// clear html
		tableElement.find('tbody').html('');
		if ( response.code == 404 )
			return;
		
		var data = response.data;
		var html = '';
		for (var i = 0; i < data.length; i++) 
		{
			var order = data[i];
			// loop items
			if ( order.order_items )
			{
				var itemsHTML = '<ul class="list-group list-group-flush list-group-numbered">';
				var itemsHTML2 = '';
				var productPrice = 0.00;
				var order_item_dept_rate = 0.00;
				var order_item_price = 0.00;
				for (var j = 0; j < order.order_items.length; j++) 
				{
					var item = order.order_items[j];
					productPrice += parseFloat(item.item_info.productPrice);
					order_item_dept_rate += parseFloat(item.item_dept.order_item_dept_rate);
					order_item_price += parseFloat(item.order_item_price);
					itemsHTML += `<li class="list-group-item text-04">${item.item_name}</li>`;
					itemsHTML2 += `<tr>
									<td>${item.item_name}</td>
									<td>${item.order_item_quantity}</td>
									<td>${item.order_item_price}</td>
									<td>${item.item_dept.order_item_dept}</td>
									<td>${parseFloat(item.item_dept.order_item_dept_rate).toFixed(2)}</td>
									<td>${item.order_item_final_amount}</td>
									</tr>`;
				}
				itemsHTML += '</ul>';
			}
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				html += `<tr class="expand-row">
							<td>
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-orderid="${order.order_id}">
							</td>
							<td>${order.order_hash}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_amount_paid}</td>
							<td>${order.order_receiver_name}</td>
							<td style="width:15px">
								<svg part="svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-labelledby="ic-caret-up" focusable="false" viewBox="0 0 24 24" class="expand-icon" dataV17f0a767=""><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"></path></g></svg>
							</td>
							<td>
								<button class="btn-02" data-role="UPDATE" data-orderid="${order.order_id}">
									<i class="fas fa-edit no-pointer"></i>
								</button>
							</td>
							<td>
								<button class="btn btn-outline-success btn-sm pointer" data-role="ACCEPT" data-orderid="${order.order_id}">
										<i class="fas fa-check no-pointer"></i>
								</button>
							</td>
						</tr>PAG_SEP
						<tr class="expand-row__row" style="display:none;">
							<td colspan="10">
								<table class="table-01">
									<thead>
										<tr>
											<th>المنتج</th>
											<th>الكمية</th>
											<th>سعر الوحدة</th>
											<th>الدين (${currency.ar})</th>
											<th>الدين (%)</th>
											<th>السعر الكلي</th>
										</tr>
									</thead>
									<tbody>
										${itemsHTML2}
									</tbody>
								</table>
								<div class="order-price-table">
									<div class="order-price-table-contents">
										${itemsHTML}	
									</div>
									<div class="order-price-table-contents">
										<div class="order-price-table-td">
											<strong>السعر الاصلي</strong>
											<span>${productPrice.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>نسبة الدين (%)</strong>
											<span>${order_item_dept_rate.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>سعر البيع</strong>
											<span>${order_item_price.toFixed(2)}</span>
										</div>
										<div class="border-top my-1"></div>
										<div class="order-price-table-td">
											<strong>مجمل المدفوع</strong>
											<span>${order.order_amount_paid}</span>
										</div>	
									</div>
								</div>
							</td>
						</tr>PAG_SEP`;	
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				html += `<tr class="expand-row">
							<td>
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-orderid="${order.order_id}">
							</td>
							<td>${order.order_hash}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_amount_paid}</td>
							<td>${order.order_receiver_name}</td>
							<td style="width:15px">
								<svg part="svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-labelledby="ic-caret-up" focusable="false" viewBox="0 0 24 24" class="expand-icon" dataV17f0a767=""><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"></path></g></svg>
							</td>
							<td>
								<button class="btn-02" data-role="UPDATE" data-orderid="${order.order_id}">
									<i class="fas fa-edit no-pointer"></i>
								</button>
							</td>
							<td>
								<button class="btn btn-outline-success btn-sm pointer" data-role="ACCEPT" data-orderid="${order.order_id}">
										<i class="fas fa-check no-pointer"></i>
								</button>
							</td>
						</tr>PAG_SEP
						<tr class="expand-row__row" style="display:none;">
							<td colspan="10">
								<table class="table-01">
									<thead>
										<tr>
											<th>le produit</th>
											<th>Quantité</th>
											<th>prix d'Unité</th>
											<th> (${currency.fr})</th>
											<th>la dette (%)</th>
											<th>prix total</th>
										</tr>
									</thead>
									<tbody>
										${itemsHTML2}
									</tbody>
								</table>
								<div class="order-price-table">
									<div class="order-price-table-contents">
										${itemsHTML}	
									</div>
									<div class="order-price-table-contents">
										<div class="order-price-table-td">
											<strong>Le prix d'origine</strong>
											<span>${productPrice.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>taux d'endettement (%)</strong>
											<span>${order_item_dept_rate.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>Prix ​​de vente</strong>
											<span>${order_item_price}</span>
										</div>
										<div class="border-top my-1"></div>
										<div class="order-price-table-td">
											<strong>total payé</strong>
											<span>${order.order_amount_paid}</span>
										</div>	
									</div>
								</div>
							</td>
						</tr>PAG_SEP`;	
			}	
		}
		// add html
		var options = {
			data: html.split('PAG_SEP'),
			resultsPerPage: 6
		};
		new SmoothPagination(pagination, tableElement.find('tbody'), options);
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', async e =>
	{
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: searchInput.val(),
			isAccepted: 0
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		var response = await searchOrders(SearchObject);
		// hide loader
		TopLoader('', false);
		// clear html
		tableElement.find('tbody').html('');
		if ( response.code == 404 )
			return;
		
		var data = response.data;
		var html = '';
		for (var i = 0; i < data.length; i++) 
		{
			var order = data[i];
			// loop items
			if ( order.order_items )
			{
				var itemsHTML = '<ul class="list-group list-group-flush list-group-numbered">';
				var itemsHTML2 = '';
				var productPrice = 0.00;
				var order_item_dept_rate = 0.00;
				var order_item_price = 0.00;
				for (var j = 0; j < order.order_items.length; j++) 
				{
					var item = order.order_items[j];
					productPrice += parseFloat(item.item_info.productPrice);
					order_item_dept_rate += parseFloat(item.item_dept.order_item_dept_rate);
					order_item_price += parseFloat(item.order_item_price);
					itemsHTML += `<li class="list-group-item text-04">${item.item_name}</li>`;
					itemsHTML2 += `<tr>
									<td>${item.item_name}</td>
									<td>${item.order_item_quantity}</td>
									<td>${item.order_item_price}</td>
									<td>${item.item_dept.order_item_dept}</td>
									<td>${parseFloat(item.item_dept.order_item_dept_rate).toFixed(2)}</td>
									<td>${item.order_item_final_amount}</td>
									</tr>`;
				}
				itemsHTML += '</ul>';
			}
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				html += `<tr class="expand-row">
							<td>
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-orderid="${order.order_id}">
							</td>
							<td>${order.order_hash}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_amount_paid}</td>
							<td>${order.order_receiver_name}</td>
							<td style="width:15px">
								<svg part="svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-labelledby="ic-caret-up" focusable="false" viewBox="0 0 24 24" class="expand-icon" dataV17f0a767=""><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"></path></g></svg>
							</td>
							<td>
								<button class="btn-02" data-role="UPDATE" data-orderid="${order.order_id}">
									<i class="fas fa-edit no-pointer"></i>
								</button>
							</td>
							<td>
								<button class="btn btn-outline-success btn-sm pointer" data-role="ACCEPT" data-orderid="${order.order_id}">
										<i class="fas fa-check no-pointer"></i>
								</button>
							</td>
						</tr>PAG_SEP
						<tr class="expand-row__row" style="display:none;">
							<td colspan="10">
								<table class="table-01">
									<thead>
										<tr>
											<th>المنتج</th>
											<th>الكمية</th>
											<th>سعر الوحدة</th>
											<th>الدين (${currency.ar})</th>
											<th>الدين (%)</th>
											<th>السعر الكلي</th>
										</tr>
									</thead>
									<tbody>
										${itemsHTML2}
									</tbody>
								</table>
								<div class="order-price-table">
									<div class="order-price-table-contents">
										${itemsHTML}	
									</div>
									<div class="order-price-table-contents">
										<div class="order-price-table-td">
											<strong>السعر الاصلي</strong>
											<span>${productPrice.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>نسبة الدين (%)</strong>
											<span>${order_item_dept_rate.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>سعر البيع</strong>
											<span>${order_item_price.toFixed(2)}</span>
										</div>
										<div class="border-top my-1"></div>
										<div class="order-price-table-td">
											<strong>مجمل المدفوع</strong>
											<span>${order.order_amount_paid}</span>
										</div>	
									</div>
								</div>
							</td>
						</tr>PAG_SEP`;	
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				html += `<tr class="expand-row">
							<td>
								<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-orderid="${order.order_id}">
							</td>
							<td>${order.order_hash}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_date}|${order.order_time}</td>
							<td>${order.order_amount_paid}</td>
							<td>${order.order_receiver_name}</td>
							<td style="width:15px">
								<svg part="svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-labelledby="ic-caret-up" focusable="false" viewBox="0 0 24 24" class="expand-icon" dataV17f0a767=""><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"></path></g></svg>
							</td>
							<td>
								<button class="btn-02" data-role="UPDATE" data-orderid="${order.order_id}">
									<i class="fas fa-edit no-pointer"></i>
								</button>
							</td>
							<td>
								<button class="btn btn-outline-success btn-sm pointer" data-role="ACCEPT" data-orderid="${order.order_id}">
										<i class="fas fa-check no-pointer"></i>
								</button>
							</td>
						</tr>PAG_SEP
						<tr class="expand-row__row" style="display:none;">
							<td colspan="10">
								<table class="table-01">
									<thead>
										<tr>
											<th>le produit</th>
											<th>Quantité</th>
											<th>prix d'Unité</th>
											<th> (${currency.fr})</th>
											<th>la dette (%)</th>
											<th>prix total</th>
										</tr>
									</thead>
									<tbody>
										${itemsHTML2}
									</tbody>
								</table>
								<div class="order-price-table">
									<div class="order-price-table-contents">
										${itemsHTML}	
									</div>
									<div class="order-price-table-contents">
										<div class="order-price-table-td">
											<strong>Le prix d'origine</strong>
											<span>${productPrice.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>taux d'endettement (%)</strong>
											<span>${order_item_dept_rate.toFixed(2)}</span>
										</div>
										<div class="order-price-table-td">
											<strong>Prix ​​de vente</strong>
											<span>${order_item_price}</span>
										</div>
										<div class="border-top my-1"></div>
										<div class="order-price-table-td">
											<strong>total payé</strong>
											<span>${order.order_amount_paid}</span>
										</div>	
									</div>
								</div>
							</td>
						</tr>PAG_SEP`;	
			}	
		}
		// add html
		var options = {
			data: html.split('PAG_SEP'),
			resultsPerPage: 6
		};
		new SmoothPagination(pagination, tableElement.find('tbody'), options);
	});
	// display all
	displayAll();
	function displayAll()
	{
		searchInput.trigger('keyup');
	}
	// selected rows
	function selectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({ order_id: check.data('orderid') });
		}

		return list;
	}
}
// setup add to treasury
function setupAddToTreasury()
{
	var addToTreasuryContainer = $('#addToTreasuryContainer');
	if ( addToTreasuryContainer[0] == undefined )
		return;

	var ERROR_BOX = addToTreasuryContainer.find('#ERROR_BOX');

	var addForm = addToTreasuryContainer.find('#addForm');
	var treasuryInAmountInput = addForm.find('#treasuryInAmountInput');
	var treasuryReasonInput = addForm.find('#treasuryReasonInput');
	var treasuryNoteInput = addForm.find('#treasuryNoteInput');
	var treasuryDateInput = addForm.find('#treasuryDateInput');
	var treasuryTimeInput = addForm.find('#treasuryTimeInput');

	var cashoutForm = addToTreasuryContainer.find('#cashoutForm');
	var cftreasuryOutAmountInput = cashoutForm.find('#cftreasuryOutAmountInput');
	var cftreasuryReasonInput = cashoutForm.find('#cftreasuryReasonInput');
	var cftreasuryNoteInput = cashoutForm.find('#cftreasuryNoteInput');
	var cftreasuryDateInput = cashoutForm.find('#cftreasuryDateInput');
	var cftreasuryTimeInput = cashoutForm.find('#cftreasuryTimeInput');

	var operationSelect = addToTreasuryContainer.find('#operationSelect');
	// set initial data and time
	var now = new Date();
	treasuryDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	treasuryTimeInput.val( date_time.format(now, 'HH:mm:ss') );

	cftreasuryDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	cftreasuryTimeInput.val( date_time.format(now, 'HH:mm:ss') );

	var wrapper01 = addToTreasuryContainer.find('#wrapper01');

	var TreasuryObject = {
		clinicId: USER_CONFIG.clinicId
	};
	// addForm submit
	addForm.off('submit');
	addForm.on('submit', async e =>
	{
		e.preventDefault();
		var target = addForm;
		TreasuryObject.in = treasuryInAmountInput.val();
		TreasuryObject.reason = treasuryReasonInput.val();
		TreasuryObject.note = treasuryNoteInput.val();
		TreasuryObject.date = treasuryDateInput.val();
		TreasuryObject.time = treasuryTimeInput.val();
		// display loader
		SectionLoader(wrapper01);
		var response = await addToTreasury(TreasuryObject);
		// hide loader
		SectionLoader(wrapper01, '');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
		//reset
		target[0].reset();	
		treasuryDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
		treasuryTimeInput.val( date_time.format(now, 'HH:mm:ss') );
	});
	// cashoutForm submit
	cashoutForm.off('submit');
	cashoutForm.on('submit', async e =>
	{
		e.preventDefault();
		var target = cashoutForm;
		TreasuryObject.out = cftreasuryOutAmountInput.val();
		TreasuryObject.reason = cftreasuryReasonInput.val();
		TreasuryObject.note = cftreasuryNoteInput.val();
		TreasuryObject.date = cftreasuryDateInput.val();
		TreasuryObject.time = cftreasuryTimeInput.val();
		// display loader
		SectionLoader(wrapper01);
		var response = await takeFromTreasury(TreasuryObject);
		// hide loader
		SectionLoader(wrapper01, '');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
		//reset
		target[0].reset();	
		cftreasuryDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
		cftreasuryTimeInput.val( date_time.format(now, 'HH:mm:ss') );
	});
	// switch forms
	operationSelect.off('change');
	operationSelect.on('change', e =>
	{
		var val = operationSelect.find(':selected').val();
		if ( val == 'IN' )
			addForm.slideDown(200).siblings('.FORM').slideUp(200);
		else if ( val == 'OUT' )
			cashoutForm.slideDown(200).siblings('.FORM').slideUp(200);
	});
}
// setup treasury cashouts
async function setupTreasuryCashouts()
{
	var treasuryCashoutsContainer = $('#treasuryCashoutsContainer');
	if ( treasuryCashoutsContainer[0] == undefined )
		return;

	var ERROR_BOX = treasuryCashoutsContainer.find('#ERROR_BOX');

	var deleteSelectedBTN = treasuryCashoutsContainer.find('#deleteSelectedBTN');
	var filterSelect = treasuryCashoutsContainer.find('#filterSelect');
	var pagination = treasuryCashoutsContainer.find('#pagination');
	var tableElement = treasuryCashoutsContainer.find('#tableElement');

	// delete selected
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		PromptConfirmDialog().then(async c =>
		{
			// disply loader
			SectionLoader(tableElement);
			var response = await deleteExpenses(selectedRows());
			// hide loader
			SectionLoader(tableElement, '');
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			//
			displayAll();
		});
	});
	// list teasury expenses
	// disply loader
	SectionLoader(tableElement);
	var expenses = await listTreasuryExpensesDates(USER_CONFIG.clinicId);
	// hide loader
	SectionLoader(tableElement, '');
	if ( expenses.code == 200 )
	{
		var data = expenses.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.expense_date}">${v.expense_date}</option>`;
		});
		filterSelect.html(html);
	}
	// filter
	filterSelect.off('change');
	filterSelect.on('change', async e =>
	{
		var val = filterSelect.find(':selected').val();
		var TreasuryObject = {
			clinicId: USER_CONFIG.clinicId,
			date: val
		};
		// disply loader
		SectionLoader(tableElement);
		var response = await filterExpensesByDate(TreasuryObject);
		// hide loader
		SectionLoader(tableElement, '');
		// clear html
		tableElement.find('.tbody').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<div class="tr">
						<div class="td">
							<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-id="${v.expense_id}">
						</div>
						<div class="td">${v.expense_in}</div>
						<div class="td">${v.expense_out}</div>
						<div class="td">${v.expense_reason}</div>
						<div class="td">${v.expense_note}</div>
						<div class="td">${v.expense_date} | ${v.expense_time}</div>
					</div>PAG_SEP`;
		});
		// add html
		var options = {
			data: html.split('PAG_SEP')
		};
		new SmoothPagination(pagination, tableElement.find('.tbody'), options);
	});
	displayAll();
	// display all
	function displayAll()
	{
		filterSelect.trigger('change');
	}
	// selected rows
	function selectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({ id: check.data('id') });
		}

		return list;
	}
}
// setup add employees
async function setupAddEmployees(options = null)
{
	var addEmployeesContainer = $('#addEmployeesContainer');
	if ( addEmployeesContainer[0] == undefined )
		return;

	var ERROR_BOX = addEmployeesContainer.find('#ERROR_BOX');

	var addForm = addEmployeesContainer.find('#addForm');
	var nameInput = addForm.find('#nameInput');
	var phoneInput = addForm.find('#phoneInput');
	var addressInput = addForm.find('#addressInput');
	var wilayaSelect = addForm.find('#wilayaSelect');
	var typeSelect = addForm.find('#typeSelect');
	var birthDateInput = addForm.find('#birthDateInput');
	var birthPlaceInput = addForm.find('#birthPlaceInput');
	var salaryInput = addForm.find('#salaryInput');
	var passInput = addForm.find('#passInput');

	var wrapper01 = addEmployeesContainer.find('#wrapper01');

	var EmployeeObject = {
		employee_id: (options) ? options.employee_id : null
	};

	// addForm submit
	addForm.off('submit');
	addForm.on('submit', e =>
	{
		e.preventDefault();
		var target = addForm;
		EmployeeObject.clinicId = USER_CONFIG.clinicId;
		EmployeeObject.employee_name = nameInput.val();
		EmployeeObject.employee_phone = phoneInput.val();
		EmployeeObject.employee_pass = passInput.val();
		EmployeeObject.employee_address = addressInput.val();
		EmployeeObject.employee_state = wilayaSelect.find(':selected').val();
		EmployeeObject.employee_type_id = typeSelect.find(':selected').val();
		EmployeeObject.employee_birthplace = birthPlaceInput.val();
		EmployeeObject.employee_birthdate = birthDateInput.val();
		EmployeeObject.employee_salary = salaryInput.val();
		// display loader
		SectionLoader(wrapper01);
		//update
		if ( EmployeeObject.employee_id != null )
		{
			updateEmployee(EmployeeObject).then(response =>
			{
				// hide loader
				SectionLoader(wrapper01, '');
				if ( response.code == 404 )
				{
					ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
					return;
				}
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				//
				target[0].reset();
				EmployeeObject.employee_id = null;

			});
			return;
		}
		// add
		addEmployee(EmployeeObject).then(response =>
		{
			// hide loader
			SectionLoader(wrapper01, '');
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			//
			 target[0].reset();
		});
	});
	// list states
	// display loader
	SectionLoader(wilayaSelect.closest('.section'));
	var response = await getAllStates();
	// hide loader
	SectionLoader(wilayaSelect.closest('.section'), '');
	if ( response.code == 200 )
	{
		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.wilaya_name}">${v.wilaya_name}</option>`;
		});
		wilayaSelect.html(html);
	}
	// list employees types
	// display loader
	SectionLoader(typeSelect.closest('.section'));
	var response = await listEmployeesTypes();
	// hide loader
	SectionLoader(typeSelect.closest('.section'), '');
	if ( response.code == 200 )
	{
		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				html += `<option value="${v.employee_type_id}">${v.employee_type_name_ar}</option>`;
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				html += `<option value="${v.employee_type_id}">${v.employee_type_name_fr}</option>`;
			}
		});
		typeSelect.html(html);
	}
	// employeed info
	displayOne();
	async function displayOne()
	{
		if ( EmployeeObject.employee_id == null )
			return;

		// display loader
		SectionLoader(wrapper01);
		var response = await getEmployee(EmployeeObject.employee_id);
		// hide loader
		SectionLoader(wrapper01, '');
		var data = response.data;
		nameInput.val(data.employee_name);
		phoneInput.val(data.employee_phone);
		passInput.val(data.employee_pass);
		addressInput.val(data.employee_address);
		setOptionSelected(wilayaSelect, data.employee_state);
		setOptionSelected(typeSelect, data.employee_type_id);
		birthPlaceInput.val(data.employee_birthplace);
		birthDateInput.val(data.employee_birthdate);
		salaryInput.val(data.employee_salary);
	}

}
// setup all employees
function setupAllEmployees()
{
	var allEmployeesContainer = $('#allEmployeesContainer');
	if ( allEmployeesContainer[0] == undefined )
		return;

	var ERROR_BOX = allEmployeesContainer.find('#ERROR_BOX');

	var deleteSelectedBTN = allEmployeesContainer.find('#deleteSelectedBTN');
	var searchInput = allEmployeesContainer.find('#searchInput');
	var pagination = allEmployeesContainer.find('#pagination');
	var tableElement = allEmployeesContainer.find('#tableElement');

	// tableElement click
	tableElement.off('click');
	tableElement.on('click', async e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'UPDATE' )
		{
			var employee_id = target.data('employeeid');
			var response = await getPage('views/pages/add-employees.ejs');
			MAIN_CONTENT_CONTAINER.html(response);
			setupAddEmployees({employee_id:employee_id});
		}
	});
	// delete selected
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', async e =>
	{
		PromptConfirmDialog().then(async c =>
		{
			// display loader
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				TopLoader("حذف البيانات...");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				TopLoader("Suprimmer les données...");

			var response = await deleteEmployees(selectedRows());
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			//
			displayAll();
		});
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', async e =>
	{
		var SearchObject = {
			query: searchInput.val(),
			clinicId: USER_CONFIG.clinicId
		};
		// display loader
		SectionLoader( tableElement.closest('.section') );
		var response = await searchClinicEmployees(SearchObject);
		// hide loader
		SectionLoader( tableElement.closest('.section'), '' );
		// clear html
		tableElement.find('.tbody').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			var type = '';
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				type = (v.type) ? v.type.employee_type_name_ar : '';
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				type = (v.type) ? v.type.employee_type_name_fr : '';
			}
			html += `<div class="tr">
						<div class="td">
							<input type="checkbox" class="form-check-input" data-role="CHECK" data-employeeid="${v.employee_id}">
						</div>
						<div class="td">${v.employee_name}</div>
						<div class="td">${v.employee_phone}</div>
						<div class="td">${v.employee_address}</div>
						<div class="td">${v.employee_state}</div>
						<div class="td">${v.employee_birthplace}</div>
						<div class="td">${v.employee_birthdate}</div>
						<div class="td">${v.employee_salary}</div>
						<div class="td">${v.employee_pass}</div>
						<div class="td">${type}</div>
						<div class="td">${v.employee_date} | ${v.employee_time}</div>
						<div class="td">
							<button class="btn btn-primary btn-sm pointer" data-role="UPDATE" data-employeeid="${v.employee_id}">
								<span class="no-pointer"><i class="fas fa-edit"></i></span>
							</button>
						</div>
					</div>PAG_SEP`;
		});
		// add html
		var options = {
			data: html.split('PAG_SEP')
		};
		new SmoothPagination(pagination, tableElement.find('.tbody'), options);
	});
	// display all 
	displayAll();
	function displayAll()
	{
		searchInput.trigger('keyup');
	}
	// selected rows
	function selectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({ employee_id: check.data('employeeid') });
		}

		return list;
	}
}
// setup employees attendance
function setupEmployeesAttendance()
{
	var employeesAttendanceContainer = $('#employeesAttendanceContainer');
	if ( employeesAttendanceContainer[0] == undefined )
		return;

	var ERROR_BOX = employeesAttendanceContainer.find('#ERROR_BOX');

	var deleteSelectedBTN = employeesAttendanceContainer.find('#deleteSelectedBTN');
	var searchInput = employeesAttendanceContainer.find('#searchInput');
	var searchBTN = employeesAttendanceContainer.find('#searchBTN');
	var fromDateInput = employeesAttendanceContainer.find('#fromDateInput');
	var toDateInput = employeesAttendanceContainer.find('#toDateInput');
	var pagination = employeesAttendanceContainer.find('#pagination');
	var tableElement = employeesAttendanceContainer.find('#tableElement');

	// set primary dates
	var now = new Date();
	fromDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	toDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	// tableElement click
	tableElement.off('click');
	tableElement.on('click', async e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'UPDATE' )
		{
			var parent = target.closest('[data-role="ROW"]');
			var EmployeeObject = {
				employee_id: target.data('employeeid'),
				att_status: parent.find('[data-role="ATT_SELECT"] :selected').val(),
				att_note: parent.find('[data-role="ATT_NOTE"]').val()
			};
			// display loader
			SectionLoader( tableElement.closest('.section') );
			var response = await updateEmployeeAtt(EmployeeObject);
			// hide loader
			SectionLoader( tableElement.closest('.section'), '' );
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			//
			displayAll();
		}
	});
	// delete selected
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', async e =>
	{
		PromptConfirmDialog().then(async c =>
		{
			// display loader
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				TopLoader("حذف البيانات...");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				TopLoader("Suprimmer les données...");

			var response = await deleteEmployees(selectedRows());
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
				return;
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			//
			displayAll();
		});
	});
	// search
	searchBTN.off('click');
	searchBTN.on('click', async e =>
	{
		var SearchObject = {
			clinicId: USER_CONFIG.clinicId,
			query: searchInput.val(),
			from: fromDateInput.val(),
			to: toDateInput.val()
		};
		// display loader
		SectionLoader( tableElement.closest('.section') );
		var response = await searchEmployeesAttBetweenDates(SearchObject);
		// hide loader
		SectionLoader( tableElement.closest('.section'), '' );
		// clear html
		tableElement.find('.tbody').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			var type = '';
			var ATT_SELECT = '';
			var ATT_NOTE_PH = '';
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				type = (v.type) ? v.type.employee_type_name_ar : '';
				ATT_SELECT = `<option ${ (v.attendance.att_status == ATT_ABSENT) ? 'selected' : '' } value="${ATT_ABSENT}">غائب</option>
							<option ${ (v.attendance.att_status == ATT_PRESENT) ? 'selected' : '' } value="${ATT_PRESENT}">حاضر</option>
							<option ${ (v.attendance.att_status == ATT_LATE) ? 'selected' : '' } value="${ATT_LATE}">متأخر</option>`;
				ATT_NOTE_PH = 'أكتب الملاحظة هنا...';
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				type = (v.type) ? v.type.employee_type_name_fr : '';
				ATT_SELECT = `<option ${ (v.attendance.att_status == ATT_ABSENT) ? 'selected' : '' } value="${ATT_ABSENT}">absent</option>
							<option ${ (v.attendance.att_status == ATT_PRESENT) ? 'selected' : '' } value="${ATT_PRESENT}">present</option>
							<option ${ (v.attendance.att_status == ATT_LATE) ? 'selected' : '' } value="${ATT_LATE}">en retard</option>`;
				ATT_NOTE_PH = 'Écrivez une note ici...';
			}
			html += `<div class="tr" data-role="ROW" data-employeeid="${v.employee_id}">
						<div class="td">
							<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-employeeid="${v.employee_id}" data-id="${v.attendance.id}">
						</div>
						<div class="td">${v.employee_name}</div>
						<div class="td pointer mx-1">
							<select name="" data-role="ATT_SELECT" class="input-text border-0">
								${ATT_SELECT}
							</select>
						</div>
						<div class="td pointer">
							<input type="text" class="input-text border-0" value="${v.attendance.att_note}" placeholder="${ATT_NOTE_PH}" data-role="ATT_NOTE">
						</div>
						<div class="td">${v.attendance.att_date} | ${v.attendance.att_time}</div>
						<div class="td">
							<div class="btn-group btn-group-sm">
								<button class="btn btn-primary btn-sm pointer rounded-0" data-role="UPDATE" data-employeeid="${v.employee_id}">
									<span class="no-pointer"><i class="fas fa-edit"></i></span>
								</button>
							</div>
						</div>
					</div>PAG_SEP`;
		});
		// add html
		var options = {
			data: html.split('PAG_SEP')
		};
		new SmoothPagination(pagination, tableElement.find('.tbody'), options);
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', async e =>
	{
		var SearchObject = {
			query: searchInput.val(),
			clinicId: USER_CONFIG.clinicId
		};
		// display loader
		SectionLoader( tableElement.closest('.section') );
		var response = await searchClinicEmployees(SearchObject);
		// hide loader
		SectionLoader( tableElement.closest('.section'), '' );
		// clear html
		tableElement.find('.tbody').html('');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			var type = '';
			var ATT_SELECT = '';
			var ATT_NOTE_PH = '';
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				type = (v.type) ? v.type.employee_type_name_ar : '';
				ATT_SELECT = `<option ${ (v.attendance.att_status == ATT_ABSENT) ? 'selected' : '' } value="${ATT_ABSENT}">غائب</option>
							<option ${ (v.attendance.att_status == ATT_PRESENT) ? 'selected' : '' } value="${ATT_PRESENT}">حاضر</option>
							<option ${ (v.attendance.att_status == ATT_LATE) ? 'selected' : '' } value="${ATT_LATE}">متأخر</option>`;
				ATT_NOTE_PH = 'أكتب الملاحظة هنا...';
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				type = (v.type) ? v.type.employee_type_name_fr : '';
				ATT_SELECT = `<option ${ (v.attendance.att_status == ATT_ABSENT) ? 'selected' : '' } value="${ATT_ABSENT}">absent</option>
							<option ${ (v.attendance.att_status == ATT_PRESENT) ? 'selected' : '' } value="${ATT_PRESENT}">present</option>
							<option ${ (v.attendance.att_status == ATT_LATE) ? 'selected' : '' } value="${ATT_LATE}">en retard</option>`;
				ATT_NOTE_PH = 'Écrivez une note ici...';
			}
			html += `<div class="tr" data-role="ROW" data-employeeid="${v.employee_id}">
						<div class="td">
							<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-employeeid="${v.employee_id}" data-id="${v.attendance.id}">
						</div>
						<div class="td">${v.employee_name}</div>
						<div class="td pointer mx-1">
							<select name="" data-role="ATT_SELECT" class="input-text border-0">
								${ATT_SELECT}
							</select>
						</div>
						<div class="td pointer">
							<input type="text" class="input-text border-0" value="${v.attendance.att_note}" placeholder="${ATT_NOTE_PH}" data-role="ATT_NOTE">
						</div>
						<div class="td">${v.attendance.att_date} | ${v.attendance.att_time}</div>
						<div class="td">
							<div class="btn-group btn-group-sm">
								<button class="btn btn-primary btn-sm pointer rounded-0" data-role="UPDATE" data-employeeid="${v.employee_id}">
									<span class="no-pointer"><i class="fas fa-edit"></i></span>
								</button>
							</div>
						</div>
					</div>PAG_SEP`;
		});
		// add html
		var options = {
			data: html.split('PAG_SEP')
		};
		new SmoothPagination(pagination, tableElement.find('.tbody'), options);
	});
	searchInput.off('focus');
	searchInput.on('focus', displayAll);
	// display all 
	displayAll();
	function displayAll()
	{
		searchInput.trigger('keyup');
	}
	// selected rows
	function selectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			var parent = check.closest('[data-role="ROW"]');
			var att_status = parent.find('[data-role="ATT_SELECT"] :selected').val();
			var att_note = parent.find('[data-role="ATT_NOTE"]').val();
			if ( check.is(':checked') )
			{
				list.push({ 
					employee_id: check.data('employeeid'),
					att_status: att_status,
					att_note: att_note
				});
			}	
		}

		return list;
	}
}
// Rebind events
rebindEvents = () =>
{
	setupTopNavbar();
	setupNavbar();
	setupStatistics();
	setupSettings();
	setupAddPatients();
	setupAllPatients();
	setupAddPrescriptions();
	setupAllPrescriptions();
	setupSendMessage();
	setupSentMessages();
	setupInboxMessages();
	setupAddAppointements();
	setupAllAppointements();
	setupAddProducts();
	setupAllProducts();
	setupSellProducts();
	setupAllProductsBillings();
	setupBillingsWaitingApproval();
	setupAddToTreasury();
	setupTreasuryCashouts();
	setupAddEmployees();
	setupAllEmployees();
	setupEmployeesAttendance();
}
// replace with files that has proper interface
if ( FUI_DISPLAY_LANG.lang == 'ar' )
{
	// change style sheet
	$('head').append('<link rel="stylesheet" type="text/css" class="MAIN_STYLESHEET" href="assets/css/main_ar.css">');
	setTimeout(() => {
		$($('.MAIN_STYLESHEET')[0]).remove();
	}, 0);
	// change pagination scripts
	$('#PAGINATION').remove();
	$('body').append('<script type="text/javascript" id="PAGINATION" src="assets/js/pagination_ar.js"></script>');
}
else if ( FUI_DISPLAY_LANG.lang == 'fr' )
{
	// change style sheet
	$('head').append('<link rel="stylesheet" type="text/css" class="MAIN_STYLESHEET" href="assets/css/main_fr.css">');
	setTimeout(() => {
		$($('.MAIN_STYLESHEET')[0]).remove();
	}, 0);
	// change pagination scripts
	$('#PAGINATION').remove();
	$('body').append('<script type="text/javascript" id="PAGINATION" src="assets/js/pagination_fr.js"></script>');
}
// check login
if ( !isConfigExists() )
{
	getPage(APP_DIR_NAME+'views/addons/user-auth.ejs').then(response =>
	{
		setupUserAuth();
	});
}
else
{
	if ( USER_CONFIG.LOGIN_TYPE == 'FOUNDATION_MANAGER' )
	{
		window.location.href = 'ManagerPanel/index.ejs';
	}
}
rebindEvents();
// setup auto updates
setupAppUpdates();
// First UI user will see
getPage(APP_DIR_NAME+'views/pages/add-patients.ejs').then(response =>
{
	MAIN_CONTENT_CONTAINER.html(response);
	// Re assign events
	rebindEvents();
	// hide loader
	PageLoader(false);
});

})


