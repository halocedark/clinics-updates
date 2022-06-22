Translation =  function ()
{
	this.get = () =>
	{
		var LANG = 
		{
			lang: "fr",
			views: 
			{
				pages: 
				{
					all_viewed_presc:
					{
						sectionTitle: "Prescriptions médicales affichées",
						th01: "#",
						th02: "lien de page",
						th03: "Date créée",
						th04: "Afficher"
					},
					add_patients: 
					{
						sectionTitle: 'enregistrement des patients',
						form01: {
							label01: "le nom complet",
							label02: "Numéro de téléphone",
							label03: "Codebar",
							label04: "l'âge",
							label05: "le genre",
							label06: "l'adresse",
							label07: "Mot de passe du compte patient",
							label08: "posture",
							label09: "WhatsApp",
							label10: "Facebook",
							label11: "Nombre d'enfants",
							label12: "circonférence pelvienne",
							label13: "Lieu de naissance",
							label14: "Remarques",
							label15: "Date de naissance",
							label16: "le poids",
							label17: "Diabète",
							label18: "Pression artérielle",
							select01: {
								option01: "le mâle",
								option02: "le femelle"
							},
							submitBTN01: "Enregistrement de données"
						}
					},
					all_patients: 
					{
						sectionTitle: "Malades enregistrés",
						btn01: "Supprimer la sélection",
						ph01: "Entrez des mots-clés pour rechercher..."
					},
					settings:
					{
						sectionTitle: "Réglages",
						btn01: "Paramètres du compte",
						form01: {
							label01: "Prenom",
							label02: "l'état",
							label03: "Municipal",
							label04: "l'adresse",
							label05: "le téléphone",
							label06: "Mot de passe",
							label07: "Confirmez le mot de passe",
							label08: "nom du docteur",
							label09: "l'âge",
							label10: "le genre",
							label11: "Whatsup",
							label12: "Facebook",
							label13: "les enfants",
							label14: "circonférence pelvienne",
							label15: "lieu de naissance",
							label16: "Date de naissance",
							label17: "le poids",
							label18: "Diabète",
							label19: "Pression artérielle",
							select01: {
								option01: "le male",
								option02: "le femelle"
							},
							submitBTN01: "Mettre à jour les paramètres"
						},
						form02:
						{
							label01: "Sélectionnez la langue d'affichage",
							submitBTN01: "Mettre à jour les paramètres"
						},
						btn02: "Paramètres d'affichage"
					},
					add_prescription:
					{
						sectionTitle: "Ajouter une ordonnance",
						form01: {
							label01: "poids du patient",
							label02: "Ajouter des médicaments",
							label03: "Code QR",
							label04: "Sélectionnez le patient",
							btn01: "Cliquez ici pour ajouter",
							ph01: "nom du médicament",
							ph02: "Dosage",
							ph03: "Durée",
							ph04: "A la recherche de malades...",
							submitBTN01: "La sauvegarde des données"
						}
					},
					all_prescriptions: 
					{
						sectionTitle: "Toutes les prescriptions médicales enregistrées",
						btn01: "Supprimer la sélection",
						ph01: "Entrez des mots-clés pour rechercher..."
					}
				},
				dialogs:
				{
					dialog_box:{
						btn01: "Fermer"
					},
					promptConfirmDialog:
					{
						btn01: "Bien",
						btn02: "Fermer"
					},
					promptInputDialog:
					{
						btn01: "Bien",
						btn02: "Fermer"
					}
				},
				addons:{
					userAuth:
					{
						title01: "Créer un compte",
						form01: {
							label01: "Nom de la clinique",
							label02: "Téléphone",
							label03: "Mot de passe",
							label04: "l'état",
							label05: "Municipal",
							label06: "l'adresse",
							label07: "nom du docteur",
							label08: "Nom d'utilisateur",
							submitBTN01: "Créer un compte",
							formText01: "Se connecter"
						},
						title02: "Se connecter",
						form02: {
							label01: "Nom d'utilisateur",
							label02: "Mot de passe",
							label03: "Numéro de téléphone",
							submitBTN01: "Se connecter",
							formText01: "création d'un compte"
						},
						select01: {
							option01: "médecin de la clinique",
							option02: "Gestionnaire de fondation",
							option03: "un patient"
						},
						label01: "Connectez-vous en tant que",
						text01: "Pour vous connecter, suivez ces étapes :",
						text02: "Ouvrez l'appli Clinics sur votre téléphone.",
						text03: "Ouvrez le menu des paramètres.",
						text04: "Choisissez 'Connexion avec QR Code'.",
						text05: "Pointez votre téléphone vers l'écran pour scanner le code QR."
					}
				},
				partials:
				{
					sidebar: {
						nav01: "Les patients",
						nav02: "prescriptions médicales",
						nav03: "Réglages",
						nav04: "Vérifier les mises à jour",
						nav05: "Se déconnecter",
						nav06: "Ajouter une ordonnance",
						nav07: "Malades enregistrés",
						nav08: "enregistrement des patients",
						nav09: "Ordonnances enregistrées",
						nav10: "Prescriptions médicales affichées",
						text01: "Tous droits réservés par Holoola-z © 2022",
						text02: "Contactez-nous par téléphone: "
					},
					topNavbar: {
						btn01: "Voir | masquer le menu"
					}
				}
			}
		}

		return LANG;
	}
};

module.exports = Translation;