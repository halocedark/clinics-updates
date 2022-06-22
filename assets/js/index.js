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
	var patientPelvicCircumferenceInput = addForm.find('#patientPelvicCircumferenceInput');
	var patientWeightInput = addForm.find('#patientWeightInput');
	var patientBirthPlaceInput = addForm.find('#patientBirthPlaceInput');
	var patientBirthDateInput = addForm.find('#patientBirthDateInput');
	var patientChildrenInput = addForm.find('#patientChildrenInput');
	var patientStateInput = addForm.find('#patientStateInput');
	var patientWhatsappInput = addForm.find('#patientWhatsappInput');
	var patientFBInput = addForm.find('#patientFBInput');
	var patientNoteInput = addForm.find('#patientNoteInput');
	var patientDiabetesWeightInput = addForm.find('#patientDiabetesWeightInput');
	var patientBloodPressureInput = addForm.find('#patientBloodPressureInput');
	
	var PatientObject = {
		patientId: (options != null) ? options.patientId : null,
		patientHashId: null,
		patientName: null,
		patientPhone: null,
		patientPass: null,
		patientAge: null,
		patientGender: null,
		patientAddress: null,
		patientBarcode:null,
		patientNote: null,
		patientState: null,
		patientWhatsapp: null,
		patientFB: null,
		patientChildren: null,
		patientPelvicCircumference: null,
		patientWeight:null,
		patientBirthPlace:null,
		patientBirthDate: null,
		patientDiabetesWeight: null,
		patientBloodPressure: null
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
		PatientObject.patientBarcode = patientBarcodeInput.val();
		PatientObject.patientNote = patientNoteInput.val();
		PatientObject.patientState = patientStateInput.val();
		PatientObject.patientWhatsapp = patientWhatsappInput.val();
		PatientObject.patientFB = patientFBInput.val();
		PatientObject.patientChildren = patientChildrenInput.val();
		PatientObject.patientPelvicCircumference = patientPelvicCircumferenceInput.val();
		PatientObject.patientWeight = patientWeightInput.val();
		PatientObject.patientBirthPlace = patientBirthPlaceInput.val();
		PatientObject.patientBirthDate = patientBirthDateInput.val();
		PatientObject.patientDiabetesWeight = patientDiabetesWeightInput.val();
		PatientObject.patientBloodPressure = patientBloodPressureInput.val();
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
	// barcode
	listenForBarcodeScanner(barcode =>
	{
		if ( patientBarcodeInput.is(':focus') )
			patientBarcodeInput.val(barcode);
	});
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
			patientPelvicCircumferenceInput.val(data.patientPelvicCircumference);
			patientWeightInput.val(data.patientWeight);
			patientBirthPlaceInput.val(data.patientBirthPlace);
			patientBirthDateInput.val(data.patientBirthDate);
			patientChildrenInput.val(data.patientChildren);
			patientStateInput.val(data.patientState);
			patientWhatsappInput.val(data.patientWhatsapp);
			patientFBInput.val(data.patientFB);
			patientNoteInput.val(data.patientNote);
			patientDiabetesWeightInput.val(data.patientDiabetesWeight);
			patientBloodPressureInput.val(data.patientBloodPressure);
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
		searchPatients(searchInput.val()).then(response =>
		{
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
				var checkboxLabel = '';
				var updateBTN = '';
				var patientPass = (v.patientPass != null
								&& v.patientPass != '') ? v.patientPass : "لا يوجد";
				if ( FUI_DISPLAY_LANG.lang == 'ar' )
				{
					checkboxLabel = "أنقر للتحديد";
					updateBTN = "تحديث البيانات";
					html += `<div class="col-lg-6 col-md-6 col-sm-12">
								<div class="card-01 half-collapse">
									<div class="card-header">
										<div class="form-check border-bottom pb-3">
											<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" data-role="CHECK" data-patientid="${v.patientId}">
											<label class="form-check-label" for="flexCheckDefault">
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
													<li class="list-item">محيط الحوض: ${v.patientPelvicCircumference}</li>
												</div>
												<div class="col-md-6 col-sm-12">
													<li class="list-item">الوزن: ${v.patientWeight}</li>
													<li class="list-item">تاريخ ومكان الازدياد: ${v.patientBirthDate} ${v.patientBirthPlace}</li>
													<li class="list-item">عدد الأطفال: ${v.patientChildren}</li>
													<li class="list-item">الوضعية: ${v.patientState}</li>
													<li class="list-item">واتساب: ${v.patientWhatsapp}</li>
												</div>
											</div>
											<li class="list-item">فيسبوك: ${v.patientFB}</li>
											<li class="list-item">كودبار: ${v.patientBarcode}</li>
											<li class="list-item">تاريخ الاظافة: ${v.patientDate} | ${v.patientTime}</li>
										</ul>
										<a href="#" class="expand-btn" data-role="READMORE">توسيع | طي</a>
									</div>
									<div class="card-footer">
										<button class="btn btn-primary btn-sm" data-role="UPDATE" data-patientid="${v.patientId}">
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
					var patientPass = (v.patientPass != null
								&& v.patientPass != '') ? v.patientPass : "il n'y a pas";
					html += `<div class="col-lg-6 col-md-6 col-sm-12">
								<div class="card-01 half-collapse">
									<div class="card-header">
										<div class="form-check border-bottom pb-3">
											<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" data-role="CHECK" data-patientid="${v.patientId}">
											<label class="form-check-label" for="flexCheckDefault">
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
													<li class="list-item">circonférence pelvienne: ${v.patientPelvicCircumference}</li>
												</div>
												<div class="col-md-6 col-sm-12">
													<li class="list-item">le poids: ${v.patientWeight}</li>
														<li class="list-item">date et lieu de naissance: ${v.patientBirthDate} ${v.patientBirthPlace}</li>
													<li class="list-item">Nombre d'enfants: ${v.patientChildren}</li>
													<li class="list-item">posture: ${v.patientState}</li>
													<li class="list-item">WhatsApp: ${v.patientWhatsapp}</li>
												</div>
											</div>
											<li class="list-item">Facebook: ${v.patientFB}</li>
											<li class="list-item">Barre de code: ${v.patientBarcode}</li>
											<li class="list-item">Date ajoutée : ${v.patientDate} | ${v.patientTime}</li>
										</ul>
										<a href="#" class="expand-btn" data-role="READMORE">agrandir | plier</a>
									</div>
									<div class="card-footer">
										<button class="btn btn-primary btn-sm" data-role="UPDATE" data-patientid="${v.patientId}">
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
				list.push({ patientId: check.data('patientid') });
		}

		return list;
	}
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
	var presQRCodeIMG = addForm.find('#presQRCodeIMG');
	var patientsSearchInput = addForm.find('#patientsSearchInput');
	var patientSelect = addForm.find('#patientSelect');

	var PrescObject = {
		prescriptionId: (options) ? options.prescriptionId : null,
		prescriptionHashId: null,
		patientId: null,
		prescriptionQRCode: null,
		medicines: []
	};
	// add / update
	addForm.off('submit');
	addForm.on('submit', async e =>
	{
		e.preventDefault();
		var target = addForm;
		PrescObject.patientId = patientSelect.find(':selected').val();
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
			medHTML = `<div class="row gx-2 gy-2 mt-1" data-role="MED">
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline" data-role="MED_NAME" placeholder="اسم الدواء">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline" data-role="MED_DOSE" placeholder="الجرعة">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline" data-role="MED_DURATION" placeholder="المدة الزمنية">
								</div>	
							</div>`;	
		}
		else
		{
			medHTML = `<div class="row gx-2 gy-2 mt-3" data-role="MED">
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline" data-role="MED_NAME" placeholder="nom du médicament">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline" data-role="MED_DOSE" placeholder="Dosage">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline" data-role="MED_DURATION" placeholder="Durée">
								</div>	
							</div>`;	
		}
		medicinesDiv.append(medHTML);
	});
	// search patients
	patientsSearchInput.off('keyup');
	patientsSearchInput.on('keyup', e =>
	{
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");
		searchPatients( patientsSearchInput.val() ).then(response =>
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
					html += `<div class="row gx-2 gy-2 mt-1" data-role="MED">
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline" data-role="MED_NAME" value="${medicine.medName}">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline" data-role="MED_DOSE" value="${medicine.medDose}">
								</div>
								<div class="col-lg col-md col-sm-12">
									<input type="text" class="input-text input-text-outline" data-role="MED_DURATION" value="${medicine.medDuration}">
								</div>	
							</div>`;
				}
			}
			// add html
			medicinesDiv.html(html);
			presQRCodeIMG.attr('src', data.prescriptionQRCode);
			setOptionSelected(patientSelect, data.patientId);

			PrescObject = {
				prescriptionId: prescriptionId,
				prescriptionHashId: data.prescriptionHashId,
				patientId: data.patientId,
				prescriptionPatientWeight: data.prescriptionPatientWeight,
				prescriptionQRCode: data.prescriptionQRCode,
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
								<div class="card-01">
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
											<li class="list-item">الوزن: ${v.patientWeight}</li>
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
											<li class="list-item">le poids: ${v.patientWeight}</li>
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
// Rebind events
rebindEvents = () =>
{
	setupTopNavbar();
	setupNavbar();
	setupSettings();
	setupAddPatients();
	setupAllPatients();
	setupAddPrescriptions();
	setupAllPrescriptions();
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
	if ( USER_CONFIG.LOGIN_TYPE == 'PATIENT' )
	{
		window.location.href = 'PatientPanel/index.ejs';
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
});

})


