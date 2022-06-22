Translation =  function ()
{
	this.get = () =>
	{
		var LANG = 
		{
			lang: "ar",
			views: 
			{
				pages: 
				{
					all_viewed_presc:
					{
						sectionTitle: "الوصفات الطبية المعروضة",
						th01: "#",
						th02: "رابط الصفحة",
						th03: "تاريخ الانشاء",
						th04: "عرض"
					},
					add_patients: 
					{
						sectionTitle: "تسجيل مريض",
						form01: {
							label01: "الاسم الكامل",
							label02: "رقم الهاتف",
							label03: "كودبار",
							label04: "العمر",
							label05: "جنس",
							label06: "العنوان",
							label07: "كلمة المرور لحساب المريض",
							label08: "الوضعية",
							label09: "واتساب",
							label10: "فيسبوك",
							label11: "عدد الأطفال",
							label12: "محيط الحوض",
							label13: "مكان الميلاد",
							label14: "الملاحظات",
							label15: "تاريخ الميلاد",
							label16: "الوزن",
							label17: "السكري",
							label18: "ضغط الدم",
							select01: {
								option01: "ذكر",
								option02: "أنثى"
							},
							submitBTN01: "حفظ البيانات"
						}
					},
					all_patients: 
					{
						sectionTitle: 'المرضى المسجلين',
						btn01: "حذف التحديد",
						ph01: "أكتب كلمات مفتاحية للبحث..."
					},
					settings:
					{
						sectionTitle: "إعدادات",
						btn01: "	إعدادت الحساب",
						form01: {
							label01: "اسم",
							label02: "الولاية",
							label03: "البلدية",
							label04: "العنوان",
							label05: "الهاتف",
							label06: "كلمة المرور",
							label07: "تأكيد كلمة المرور",
							label08: "اسم الطبيب",
							label09: "العمر",
							label10: "جنس",
							label11: "واتساب",
							label12: "فيسبوك",
							label13: "الاطفال",
							label14: "محيط الحوض",
							label15: "مكان الازدياد",
							label16: "تاريخ الازدياد",
							label17: "الوزن",
							label18: "السكري",
							label19: "ضغط الدم",
							select01: {
								option01: "ذكر",
								option02: "أنثى"
							},
							submitBTN01: "حفظ التغييرات"
						},
						form02:
						{
							label01: "حدد لغة العرض",
							submitBTN01: "تحديث الاعدادات"
						},
						btn02: "اعدادات العرض"
					},
					add_prescription:
					{
						sectionTitle: "اظافة وصفة طبية",
						form01: {
							label01: "وزن المريض",
							label02: "اظافة أدوية",
							label03: "رمز الاستجابة السريعة",
							label04: "حدد المريض",
							btn01: "أنقر هنا للاظافة",
							ph01: "اسم الدواء",
							ph02: "الجرعة",
							ph03: "المدة الزمنية",
							ph04: "بحث عن مرضى...",
							submitBTN01: "حفظ البيانات"
						}
					},
					all_prescriptions: 
					{
						sectionTitle: 'جميع الوصفات الطبية المسجلة',
						btn01: "حذف التحديد",
						ph01: "أكتب كلمات مفتاحية للبحث..."
					}
				},
				dialogs:
				{
					dialog_box:{
						btn01: "اغلاق"
					},
					promptConfirmDialog:
					{
						btn01: "حسنا",
						btn02: "اغلاق"
					},
					promptInputDialog:
					{
						btn01: "حسنا",
						btn02: "اغلاق"
					}
				},
				addons:{
					userAuth:
					{
						title01: "تسجيل حساب",
						form01: {
							label01: "اسم العيادة",
							label02: "هاتف",
							label03: "كلمة المرور",
							label04: "الولاية",
							label05: "البلدية",
							label06: "العنوان",
							label07: "اسم الطبيب",
							label08: "اسم المستخدم",
							submitBTN01: "تسجيل حساب",
							formText01: "تسجيل الدخول"
						},
						title02: "تسجيل الدخول",
						form02: {
							label01: "اسم المستخدم",
							label02: "كلمة المرور",
							label03: "رقم الهاتف",
							submitBTN01: "تسجيل الدخول",
							formText01: "انشاء حساب"
						},
						select01: {
							option01: "طبيب عيادة",
							option02: "مدير مؤسسة",
							option03: "مريض"
						},
						label01: "تسجيل الدخول ك",
						text01: "لتسجيل الدخول قم باتباع الخطوات التالية:",
						text02: "افتح التطبيق Clinics في هاتفك.",
						text03: "قم بفتح قائمة الاعدادات.",
						text04: "أختر 'تسجيل الدخول بواسطة رمز الاستجابة السريعة'.",
						text05: "قم بتوجيه هاتفك الى الشاشة لمسح رمز الاستجابة السريعة."
					}
				},
				partials:
				{
					sidebar: {
						nav01: "المرضى",
						nav02: "الوصفات الطبية",
						nav03: "الاعدادات",
						nav04: "تحقق من وجود تحديثات",
						nav05: "تسجيل الخروج",
						nav06: "اظافة وصفة",
						nav07: "المرضى المسجلين",
						nav08: "تسجيل مريض",
						nav09: "الوصفات المسجلة",
						nav10: "الوصفات الطبية المعروضة",
						text01: "جميع الحقوق محفوظة من طرف شركة Holoola-z © 2022",
						text02: "تواصل معنا عبر الهاتف:"
					},
					topNavbar: {
						btn01: "عرض | اخفاء القائمة"
					}
				}
			}
		}

		return LANG;
	}
};

module.exports = Translation;