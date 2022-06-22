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
	// remove listeners
	ipcIndexRenderer.removeAllListeners('update-about-to-download');
	ipcIndexRenderer.removeAllListeners('checking-for-update');
	ipcIndexRenderer.removeAllListeners('update-available');
	ipcIndexRenderer.removeAllListeners('update-not-available');
	ipcIndexRenderer.removeAllListeners('update-error');
	ipcIndexRenderer.removeAllListeners('update-downloaded');
	ipcIndexRenderer.removeAllListeners('download-update-progress');
	// check for updates only
	//ipcIndexRenderer.send('check-for-updates-only', '');
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
					window.location.href = target.attr('href');
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
// setup all Viewed Presc
function setupAllViewedPresc()
{
	var allViewedPrescriptionsContainer = $('#allViewedPrescriptionsContainer');
	if ( allViewedPrescriptionsContainer[0] == undefined )
		return;
	if ( !fs.existsSync(SQLITE_DB) )
	{
		MAIN_CONTENT_CONTAINER.append(`<div class="overlay-01 active"></div>`);
		return;
	}

	var ERROR_BOX = allViewedPrescriptionsContainer.find('#ERROR_BOX');
	var deleteSelectedBTN = allViewedPrescriptionsContainer.find('#deleteSelectedBTN');
	var pagination = allViewedPrescriptionsContainer.find('#pagination');
	var tableElement = allViewedPrescriptionsContainer.find('#tableElement');

	var contentsWrapper  = allViewedPrescriptionsContainer.find('#contentsWrapper');
	var pagePreviewWrapper  = allViewedPrescriptionsContainer.find('#pagePreviewWrapper');
	var IFRAME = pagePreviewWrapper.find('#IFRAME');

	var presc = new Presc(SQLITE_DB);
	// tableElement click
	tableElement.off('click');
	tableElement.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'COPY_LINK' )
		{
			e.preventDefault();
			copyLinkToClipboard(target, target.attr('href'));
			if ( FUI_DISPLAY_LANG.lang == 'ar' )	
				CreateToast("اشعار", "تم نسخ الرابط");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )	
				CreateToast("notification", "Lien copié");
		}
		else if ( target.data('role') == 'ROW' )
		{
			var check = target.find('[data-role="CHECK"]');
			toggleCheck(check);
		}
		else if ( target.data('role') == 'PREVIEW' )
		{
			var id = target.data('id');
			presc.info(id).then(async data =>
			{
				console.log(data);
				
				await createPrescPreviewFiles(data.prescHTML);

				var prescData = JSON.parse(data.prescData);
				// add page data
				pagePreviewWrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
				IFRAME.attr('src', APP_ROOT_PATH+'prescription/index.html');
				IFRAME.off('load');
				IFRAME.on('load', e =>
				{
					var ifrDom = IFRAME.contents();
					var PATIENT_NAME = ifrDom.find('#PATIENT_NAME');
					var PRESC_DESC = ifrDom.find('#PRESC_DESC');
					var MEDICINES_DIV = ifrDom.find('#MEDICINES_DIV');
					var DOCTOR_DIV = ifrDom.find('#DOCTOR_DIV');
					// translate
					if ( FUI_DISPLAY_LANG.lang == 'ar' )
					{
						PATIENT_NAME.html(`مرحبا ${prescData.patientName}`);
						PRESC_DESC.html(`يوجد لديك <span class="highlight-01">${prescData.medicines.length} أدوية</span> موصوفة من قبل الطبيب.`);
						// loop medicines
						var html = '';
						if ( prescData.medicines )
						{
							$.each(prescData.medicines, (k,v) =>
							{
								html += `<div class="col-lg-12 col-md-12 col-sm-12">
											<div class="app-block d-flex flex-align-center flex-space-between">
												<div class="text-01 font-roboto">${v.medName}</div>
												<div class="text-02">${v.medDose}</div>
												<div class="text-02">${v.medDuration}</div>
											</div>
										</div>`;
							});
						}
						MEDICINES_DIV.html(html);
						DOCTOR_DIV.html(`<div class="mb-0_5">
											<span class="badge-01 text-muted">الطبيب</span>
										</div>
										<div class="mb-0_5">
											<div class="text-01 mb-0_5">
												${prescData.clinicDoctorName} - ${prescData.clinicName}
											</div>
											<div class="text-muted-02" >
												تم الفحص في  ${prescData.prescriptionDate} ${prescData.prescriptionTime}
											</div>
										</div>
										<div class="border-top border-bottom py-2">
											<div class="row gx-1 gy-2">
												<div class="col-md-2 text-center">
													<div class="d-inline-flex flex-center w-100 h-100">
														<img src="assets/img/utils/doctor.png" class="img-01" alt="">
													</div>
												</div>
												<div class="col-md">
													<div class="text-02">${prescData.clinicDoctorName}</div>
													<div class="text-muted-03 text-dir-left">${prescData.clinicPhone}</div>
												</div>
											</div>
										</div>`);
					}
					else if ( FUI_DISPLAY_LANG.lang == 'fr' )
					{
						PATIENT_NAME.html(`Bienvenue ${prescData.patientName}`);
						PRESC_DESC.html(`Vous avez <span class="highlight-01">${prescData.medicines.length} Médicaments</span>prescrits par le médecin.`);
						// loop medicines
						var html = '';
						if ( prescData.medicines )
						{
							$.each(prescData.medicines, (k,v) =>
							{
								html += `<div class="col-lg-12 col-md-12 col-sm-12">
											<div class="app-block d-flex flex-align-center flex-space-between">
												<div class="text-01 font-roboto">${v.medName}</div>
												<div class="text-02">${v.medDose}</div>
												<div class="text-02">${v.medDuration}</div>
											</div>
										</div>`;
							});
						}
						MEDICINES_DIV.html(html);
						DOCTOR_DIV.html(`<div class="mb-0_5">
											<span class="badge-01 text-muted">le Docteur</span>
										</div>
										<div class="mb-0_5">
											<div class="text-01 mb-0_5">
												${prescData.clinicDoctorName} - ${prescData.clinicName}
											</div>
											<div class="text-muted-02" >
												Vérifié en ${prescData.prescriptionDate} ${prescData.prescriptionTime}
											</div>
										</div>
										<div class="border-top border-bottom py-2">
											<div class="row gx-1 gy-2">
												<div class="col-md-2 text-center">
													<div class="d-inline-flex flex-center w-100 h-100">
														<img src="assets/img/utils/doctor.png" class="img-01" alt="">
													</div>
												</div>
												<div class="col-md">
													<div class="text-02">${prescData.clinicDoctorName}</div>
													<div class="text-muted-03 text-dir-left">${prescData.clinicPhone}</div>
												</div>
											</div>
										</div>`);
					}
				});
			});
		}
	});
	// delete
	deleteSelectedBTN.off('click');
	deleteSelectedBTN.on('click', e =>
	{
		var items = getSelectedRows();
		PromptConfirmDialog().then(async c =>
		{
			// display loader
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				TopLoader("حذف البيانات...");
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				TopLoader("Suprimmer les données...");
			var response = await sqliteDeletePrescList( items );
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0)
				.find('#text').text(response.message);
				return;
			}
			for (var i = 0; i < items.length; i++) 
			{
				var id = items[i].id;
				response = await presc.deleteById(id);
			}
			ERROR_BOX.show(0).delay(7*1000).hide(0)
			.find('#text').text(response.message);
			//
			displayAll();
		});
	});
	// display all
	displayAll();
	async function displayAll()
	{
		var data = await presc.listAll();
		// clear html
		tableElement.find('.tbody').html();
		var html = '';
		for (var i = 0; i < data.length; i++) 
		{
			var row = data[i];
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				html += `<div class="tr" data-role="ROW">
							<div class="td">
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-id="${row.id}">
							</div>
							<div class="td pointer">
								<a href="${PROJECT_URL}view/prescription/${FUI_DISPLAY_LANG.lang}/?phash=${row.phash}" data-role="COPY_LINK">أنقر لنسخ الرابط</a>
							</div>
							<div class="td pointer">
								<button class="btn btn-info btn-sm text-white" data-role="PREVIEW" data-id="${row.id}">
									معاينة من ذاكرة التخزين المؤقت
								</button>
							</div>
							<div class="td">${row.prescDate} | ${row.prescTime}</div>
						</div>PAG_SEP`;	
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				html += `<div class="tr" data-role="ROW">
							<div class="td">
								<input type="checkbox" class="form-check-input" data-role="CHECK" data-id="${row.id}">
							</div>
							<div class="td pointer">
								<a href="${PROJECT_URL}view/prescription/${FUI_DISPLAY_LANG.lang}/?phash=${row.phash}" data-role="COPY_LINK">Cliquez pour copier le lien</a>
							</div>
							<div class="td pointer">
								<button class="btn btn-info btn-sm text-white" data-role="PREVIEW" data-id="${row.id}">
									Aperçu depuis le cache
								</button>
							</div>
							<div class="td">${row.prescDate} | ${row.prescTime}</div>
						</div>PAG_SEP`;	
			}
		}
		// add html
		var options = {
			data: html.split('PAG_SEP')
		};
		new SmoothPagination(pagination, tableElement.find('.tbody'),options);
	}
	// get Selected Rows
	function getSelectedRows()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({id:check.data('id')});
		}
		return list;
	}
}
// setup settings
function setupSettings()
{
	var settingsContainer = $('#settingsContainer');
	if ( settingsContainer[0] == undefined )
		return;

	var ERROR_BOX = settingsContainer.find('#ERROR_BOX');

	var updateAccountForm = settingsContainer.find('#updateAccountForm');
	var patientNameInput = updateAccountForm.find('#patientNameInput');
	var patientPhoneInput = updateAccountForm.find('#patientPhoneInput');
	var patientAgeInput = updateAccountForm.find('#patientAgeInput');
	var patientGenderSelect = updateAccountForm.find('#patientGenderSelect');
	var patientAddressInput = updateAccountForm.find('#patientAddressInput');
	var patientWhatsupInput = updateAccountForm.find('#patientWhatsupInput');
	var patientFBInput = updateAccountForm.find('#patientFBInput');
	var patientChildrenInput = updateAccountForm.find('#patientChildrenInput');
	var patientPelvicCircumferenceInput = updateAccountForm.find('#patientPelvicCircumferenceInput');
	var patientBirthPlaceInput = updateAccountForm.find('#patientBirthPlaceInput');
	var patientBirthDateInput = updateAccountForm.find('#patientBirthDateInput');
	var patientWeightInput = updateAccountForm.find('#patientWeightInput');
	var patientDiabetesWeightInput = updateAccountForm.find('#patientDiabetesWeightInput');
	var patientBloodPressureInput = updateAccountForm.find('#patientBloodPressureInput');
	var patientPassInput = updateAccountForm.find('#patientPassInput');
	var confirmPassInput = updateAccountForm.find('#confirmPassInput');
	// update
	updateAccountForm.off('submit');
	updateAccountForm.on('submit', e =>
	{
		e.preventDefault();
		var target = $(e.target);
		// confirm pass
		if ( $.trim(patientPassInput.val()) != $.trim(confirmPassInput.val()) )
		{
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text("كلمة المرور لا تتوافق");
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text("Le mot de passe ne correspond pas");
			}
			return;
		}
		var PatientObject = {
			patientId: USER_CONFIG.patientId,
			patientHashId: USER_CONFIG.patientHashId,
			patientNote: USER_CONFIG.patientNote,
			patientState: USER_CONFIG.patientState,
			patientName: patientNameInput.val(),
			patientPhone: patientPhoneInput.val(),
			patientAge: patientAgeInput.val(),
			patientGender: patientGenderSelect.find(':selected').val(),
			patientAddress: patientAddressInput.val(),
			patientWhatsapp: patientWhatsupInput.val(),
			patientFB: patientFBInput.val(),
			patientChildren: patientChildrenInput.val(),
			patientPelvicCircumference: patientPelvicCircumferenceInput.val(),
			patientBirthPlace: patientBirthPlaceInput.val(),
			patientBirthDate: patientBirthDateInput.val(),
			patientWeight: patientWeightInput.val(),
			patientDiabetesWeight: patientDiabetesWeightInput.val(),
			patientBloodPressure: patientBloodPressureInput.val(),
			patientPass: $.trim(patientPassInput.val()),
			patientBarcode: USER_CONFIG.patientBarcode
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("تحديث البيانات...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Mise à jour des données...");

		updatePatient(PatientObject).then(response =>
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
		});
	});
	// display provider info
	displayInfo();
	function displayInfo()
	{
		patientNameInput.val(USER_CONFIG.patientName);
		patientPhoneInput.val(USER_CONFIG.patientPhone);
		patientAgeInput.val(USER_CONFIG.patientAge);
		setOptionSelected(patientGenderSelect, USER_CONFIG.patientGender);
		patientAddressInput.val(USER_CONFIG.patientAddress);
		patientWhatsupInput.val(USER_CONFIG.patientWhatsapp);
		patientFBInput.val(USER_CONFIG.patientFB);
		patientChildrenInput.val(USER_CONFIG.patientChildren);
		patientPelvicCircumferenceInput.val(USER_CONFIG.patientPelvicCircumference);
		patientBirthPlaceInput.val(USER_CONFIG.patientBirthPlace);
		patientBirthDateInput.val(USER_CONFIG.patientBirthDate);
		patientWeightInput.val(USER_CONFIG.patientWeight);
		patientDiabetesWeightInput.val(USER_CONFIG.patientDiabetesWeight);
		patientBloodPressureInput.val(USER_CONFIG.patientBloodPressure);
		patientPassInput.val(USER_CONFIG.patientPass);
		confirmPassInput.val(USER_CONFIG.patientPass);
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
// Rebind events
rebindEvents = () =>
{
	setupTopNavbar();
	setupNavbar();
	setupAllViewedPresc();
	setupSettings();
}
// replace with files that has proper interface
if ( FUI_DISPLAY_LANG.lang == 'ar' )
{
	// change style sheet
	$('head').append('<link rel="stylesheet" type="text/css" class="MAIN_STYLESHEET" href="assets/css/main_ar.css">');
	setTimeout(() => {
		$($('.MAIN_STYLESHEET')[0]).remove();
	}, 2000);
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
	}, 2000);
	// change pagination scripts
	$('#PAGINATION').remove();
	$('body').append('<script type="text/javascript" id="PAGINATION" src="assets/js/pagination_fr.js"></script>');
}
rebindEvents();
// setup auto updates
setupAppUpdates();
// First UI user will see
var href = 'views/pages/all-viewed-prescriptions.ejs';
getPage(href).then(response =>
{
	MAIN_CONTENT_CONTAINER.html(response);
	// Re assign events
	rebindEvents();
	toggleSimilarNavbarsLinks(href);
	// download sqlite db
	var url = PROJECT_URL+'uploads/patients/'+USER_CONFIG.patientId+'/db/clinics_db.sqlite3';
	var dir = APP_ROOT_PATH+'data/';
	if ( !fs.existsSync(dir) )
		fs.mkdirSync(dir);

	var filename = dir+'clinics_db.db';
	downloadFile(url, filename, progress =>
	{
		var title = '';
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			title = "يتم الآن تحميل قاعدة البيانات البعيدة ...";
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			title = "La base de données distante est maintenant chargée...";
		TopProgressBar({
			title: title,
			version: "",
			hideOnComplete: true,
			progress: {
				percent: progress.percent
			}
		});
	}, async complete =>
	{
		// set db path
		SQLITE_DB = filename;
	});	
});


})


