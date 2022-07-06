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
// setup send message
function setupSendMessage()
{
	var sendMessageContainer = $('#sendMessageContainer');
	if ( sendMessageContainer[0] == undefined )
		return;

	var ERROR_BOX = sendMessageContainer.find('#ERROR_BOX');
	var sendMSGForm = sendMessageContainer.find('#sendMSGForm');
	var clinicsSearchInput = sendMessageContainer.find('#clinicsSearchInput');
	var receiverSelect = sendMessageContainer.find('#receiverSelect');
	var subjectInput = sendMessageContainer.find('#subjectInput');
	var bodyInput = sendMessageContainer.find('#bodyInput');

	// send
	sendMSGForm.off('submit');
	sendMSGForm.on('submit', e =>
	{
		e.preventDefault();
		var target = sendMSGForm;
		var MessageObject = {
			sender: USER_CONFIG.managerHash,
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
	// search clinics
	clinicsSearchInput.off('keyup');
	clinicsSearchInput.on('keyup', e =>
	{
		var target = clinicsSearchInput;
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");
		searchClinics(target.val()).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			$.each(data, (k,v) =>
			{
				html += `<option value="${v.clinicHash}">${v.clinicName}</option>`;
			});
			// add html
			receiverSelect.html(html);
		});
	});
	clinicsSearchInput.trigger('keyup');
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
				userHash: USER_CONFIG.managerHash
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
			userHash: USER_CONFIG.managerHash,
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
			userHash: USER_CONFIG.managerHash,
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
			userHash: USER_CONFIG.managerHash
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
				userHash: USER_CONFIG.managerHash
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
			userHash: USER_CONFIG.managerHash,
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
			userHash: USER_CONFIG.managerHash,
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
			userHash: USER_CONFIG.managerHash
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
// setup settings
async function setupSettings()
{
	var settingsContainer = $('#settingsContainer');
	if ( settingsContainer[0] == undefined )
		return;

	var ERROR_BOX = settingsContainer.find('#ERROR_BOX');

	var updateAccountForm = settingsContainer.find('#updateAccountForm');
	var nameInput = updateAccountForm.find('#nameInput');
	var foundationNameInput = updateAccountForm.find('#foundationNameInput');
	var phoneInput = updateAccountForm.find('#phoneInput');
	var addressInput = updateAccountForm.find('#addressInput');
	var stateSelect = updateAccountForm.find('#stateSelect');
	var baladiaInput = updateAccountForm.find('#baladiaInput');
	var usernameInput = updateAccountForm.find('#usernameInput');
	var passInput = updateAccountForm.find('#passInput');
	var confirmPassInput = updateAccountForm.find('#confirmPassInput');
	// update
	updateAccountForm.off('submit');
	updateAccountForm.on('submit', e =>
	{
		e.preventDefault();
		var target = $(e.target);
		// confirm pass
		if ( $.trim(passInput.val()) != $.trim(confirmPassInput.val()) )
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
		var ManagerObject = {
			managerId: USER_CONFIG.managerId,
			managerName: nameInput.val(),
			foundationName: foundationNameInput.val(),
			managerPhone: phoneInput.val(),
			managerUsername: $.trim(usernameInput.val()),
			managerPass: $.trim(passInput.val()),
			managerState: stateSelect.find(':selected').val(),
			managerBaladia: baladiaInput.val(),
			managerAddress: addressInput.val()
		};
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("تحديث البيانات...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("Mise à jour des données...");

		updateManager(ManagerObject).then(response =>
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
	// display states
	var response = await getAllStates();
	if ( response.code == 404 )
		return;

	var data = response.data;
	var html = '';
	$.each(data, (k,v) =>
	{
		html += `<option value="${v.wilaya_name}">${v.wilaya_name}</option>`;
	});
	// add html
	stateSelect.html(html);
	// display info
	displayInfo();
	function displayInfo()
	{
		nameInput.val(USER_CONFIG.managerName);
		foundationNameInput.val(USER_CONFIG.foundationName);
		usernameInput.val(USER_CONFIG.managerUsername);
		setOptionSelected(stateSelect, USER_CONFIG.managerState);
		phoneInput.val(USER_CONFIG.managerPhone);
		baladiaInput.val(USER_CONFIG.managerBaladia);
		addressInput.val(USER_CONFIG.managerAddress);
		passInput.val(USER_CONFIG.managerPass);
		confirmPassInput.val(USER_CONFIG.managerPass);
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
// setup add Treatment Class
function setupAddTreatmentClass(options = null)
{
	var addTreatmentClassContainer = $('#addTreatmentClassContainer');
	if ( addTreatmentClassContainer[0] == undefined )
		return;

	var ERROR_BOX = addTreatmentClassContainer.find('#ERROR_BOX');
	var addForm = addTreatmentClassContainer.find('#addForm');
	var clinicsSearchInput = addForm.find('#clinicsSearchInput');
	var clinicSelect = addForm.find('#clinicSelect');
	var classNameInput = addForm.find('#classNameInput');
	var classDescInput = addForm.find('#classDescInput');

	var wrapper01 = addTreatmentClassContainer.find('#wrapper01');

	var ClassObject = {
		classId: (options) ? options.classId : null,
		clinicId: null,
		className: null,
		classDesc: null
	};
	// submt
	addForm.off('submit');
	addForm.on('submit', e =>
	{
		e.preventDefault();
		var target = addForm;
		ClassObject.clinicId = clinicSelect.find(':selected').val();
		ClassObject.className = classNameInput.val();
		ClassObject.classDesc = classDescInput.val();
		// display loader
		SectionLoader(wrapper01);
		// update
		if ( ClassObject.classId != null )
		{
			updateTreatmentClass(ClassObject).then(response =>
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
				ClassObject.classId = null;
			});

			return;
		}
		// add
		addTreatmentClass(ClassObject).then(response =>
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
	// search clinics
	clinicsSearchInput.off('keyup');
	clinicsSearchInput.on('keyup', e =>
	{
		var val = clinicsSearchInput.val();
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		searchClinics(val).then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';

			$.each(data, (k,v) =>
			{
				html += `<option value="${v.clinicId}">${v.clinicName}</option>`;
			});
			// add html
			clinicSelect.html(html);
			displayOne();
		});
	});
	clinicsSearchInput.trigger('keyup');
	// display one
	async function displayOne()
	{
		if ( ClassObject.classId == null )
			return;

		// display loader
		SectionLoader(wrapper01);
		var response = await getTreatmentClass(ClassObject.classId);
		// hide loader
		SectionLoader(wrapper01, '');
		if ( response.code == 404 )
			return;

		var data = response.data;
		setOptionSelected(clinicSelect, data.clinicId);
		classNameInput.val(data.className);
		classDescInput.val(data.classDesc);
	}
}
// setup all registered treatment classes
function setupAllTreatmentClasses()
{
	var allTreatmentClassesContainer = $('#allTreatmentClassesContainer');
	if ( allTreatmentClassesContainer[0] == undefined )
		return;

	var ERROR_BOX = allTreatmentClassesContainer.find('#ERROR_BOX');
	var deleteSelectedBTN = allTreatmentClassesContainer.find('#deleteSelectedBTN');
	var searchInput = allTreatmentClassesContainer.find('#searchInput');
	var pagination = allTreatmentClassesContainer.find('#pagination');
	var tableElement = allTreatmentClassesContainer.find('#tableElement');

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

			var response = await deleteTreatmentClass(selectedRows());
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
			var classId = target.data('classid');
			var response = await getPage('views/pages/add-treatment-classes.ejs');
			MAIN_CONTENT_CONTAINER.html(response);
			setupAddTreatmentClass({classId: classId});
		}
	});
	// search
	searchInput.off('keyup');
	searchInput.on('keyup', async e =>
	{
		var val = searchInput.val();
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		var response = await searchTreatmentClasses(val);
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
			html += `<div class="tr" data-role="ROW">
						<div class="td">
							<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-classid="${v.classId}">
						</div>
						<div class="td">${v.clinic.clinicName}</div>
						<div class="td">${v.className}</div>
						<div class="td">${v.classDesc}</div>
						<div class="td">
							<button class="btn btn-primary btn-sm pointer" data-role="UPDATE" data-classid="${v.classId}">
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
				list.push({ classId: check.data('classid') });
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
	var clinicsSearchInput = addForm.find('#clinicsSearchInput');
	var clinicSelect = addForm.find('#clinicSelect');
	//var classesSearchInput = addForm.find('#classesSearchInput');
	var classSelect = addForm.find('#classSelect');
	var patientsSearchInput = addForm.find('#patientsSearchInput');
	var patientSelect = addForm.find('#patientSelect');
	var aptNoteInput = addForm.find('#aptNoteInput');
	var aptDateInput = addForm.find('#aptDateInput');
	var aptTimeInput = addForm.find('#aptTimeInput');

	var wrapper01 = addAppointementsContainer.find('#wrapper01');

	var promise01 = null;
	var promise02 = null;
	var promise03 = null;
	// set default date / time
	var now = new Date();
	aptDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	aptTimeInput.val( date_time.format(now, 'HH:mm:ss') );
	var AppointementObject = {
		aptId: (options) ? options.aptId : null,
		clinicId: null,
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
		AppointementObject.clinicId = clinicSelect.find(':selected').val();
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
	// search clinics
	clinicsSearchInput.off('keyup');
	clinicsSearchInput.on('keyup', e =>
	{
		var val = clinicsSearchInput.val();
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		promise01 = searchClinics(val);
		promise01.then(response =>
		{
			// hide loader
			TopLoader('', false);
			if ( response.code == 404 )
				return;

			var data = response.data;
			var html = '';
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				clinicSelect.html(`<option value="" >حدد العيادة</option>`);
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				clinicSelect.html(`<option value="" >Sélectionnez la clinique</option>`);

			var i = 0;
			$.each(data, (k,v) =>
			{
				if ( i == 0 )
					html += `<option value="${v.clinicId}" selected>${v.clinicName}</option>`;
				else
					html += `<option value="${v.clinicId}">${v.clinicName}</option>`;	
				
				i++;
			});
			// add html
			clinicSelect.append(html);
		});
	});
	clinicsSearchInput.trigger('keyup');
	// search patients
	patientsSearchInput.off('keyup');
	patientsSearchInput.on('keyup', e =>
	{
		var val = patientsSearchInput.val();
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		promise02 = searchPatients(val);
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
	clinicSelect.off('change');
	clinicSelect.on('change', async e =>
	{
		var clinicId = clinicSelect.find(':selected').val();
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
	});
	// display one
	displayOne();
	async function displayOne()
	{
		await Promise.allSettled([promise01, promise02]);
		await Promise.allSettled([promise03]);
		clinicSelect.trigger('change');
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

			setOptionSelected(clinicSelect, data.clinicId);
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
		// display loader
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			TopLoader("جاري البحث...");
		if ( FUI_DISPLAY_LANG.lang == 'fr' )
			TopLoader("En train de rechercher...");

		var response = await searchAppointements(val);
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
	var clinicsSearchInput = addToTreasuryContainer.find('#clinicsSearchInput');
	var clinicSelect = addToTreasuryContainer.find('#clinicSelect');
	// set initial data and time
	var now = new Date();
	treasuryDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	treasuryTimeInput.val( date_time.format(now, 'HH:mm:ss') );

	cftreasuryDateInput.val( date_time.format(now, 'YYYY-MM-DD') );
	cftreasuryTimeInput.val( date_time.format(now, 'HH:mm:ss') );

	var wrapper01 = addToTreasuryContainer.find('#wrapper01');

	var TreasuryObject = {
		clinicId: null
	};
	// addForm submit
	addForm.off('submit');
	addForm.on('submit', async e =>
	{
		e.preventDefault();
		var target = addForm;
		TreasuryObject.clinicId = clinicSelect.find(':selected').val();
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
		TreasuryObject.clinicId = clinicSelect.find(':selected').val();
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
	// search clinics
	clinicsSearchInput.off('keyup');
	clinicsSearchInput.on('keyup', async e =>
	{
		var query = clinicsSearchInput.val();
		// display loader
		SectionLoader(clinicsSearchInput.closest('.section'));
		var response = await searchClinics(query);
		// hide loader
		SectionLoader(clinicsSearchInput.closest('.section'), '');
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.clinicId}">${v.clinicName}</option>`;
		});
		clinicSelect.html(html);
	});
	clinicsSearchInput.trigger('keyup');
}
// Rebind events
rebindEvents = () =>
{
	setupTopNavbar();
	setupNavbar();
	setupSendMessage();
	setupSentMessages();
	setupInboxMessages();
	setupSettings();
	setupAddTreatmentClass();
	setupAllTreatmentClasses();
	setupAddAppointements();
	setupAllAppointements();
	setupAddToTreasury();
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
rebindEvents();
// setup auto updates
setupAppUpdates();
// First UI user will see
var href = 'views/pages/add-treatment-classes.ejs';
getPage(href).then(response =>
{
	MAIN_CONTENT_CONTAINER.html(response);
	// Re assign events
	rebindEvents();
	toggleSimilarNavbarsLinks(href);
	// hide loader
	PageLoader(false);
});


})


