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
					billings_waiting_approval: {
						sectionTitle: "",
						ph01: "Recherche...",
						text01: "Sélectionner à partir de la date",
						text02: "Sélectionner jusqu'à la date",
						th01: "ID de facture",
						th02: "Créé en",
						th03: "payé en",
						th04: "Montant total",
						th05: "le client",
						btn01: "Supprimer la sélection"
					},
					employees_attendance: {
						sectionTitle: "",
						btn01: "Supprimer la sélection",
						ph01: "Entrez des mots-clés pour rechercher...",
						th01: "Nom de l'employé",
						th02: "Présence",
						th03: "Observation",
						th04: "date et l'heure",
						text01: "Enregistrement de la présence des employés de l'organisation",
						text02: "Sélectionner à partir de la date",
						text03: "Sélectionner à ce jour"
					},
					all_employees: {
						sectionTitle: "",
						btn01: "Supprimer la sélection",
						ph01: "Entrez des mots-clés pour rechercher...",
						th01: "Nom de l'employé",
						th02: "le téléphone",
						th03: "l'adresse",
						th04: "l'état",
						th05: "Lieu de naissance",
						th06: "Date de naissance",
						th07: "Un salaire",
						th08: "Mot de passe",
						th09: "date de l'inscription",
						th10: "type"
					},
					add_employees: {
						sectionTitle: "",
						form01: {
							label01: "Nom de l'employé",
							label02: "le téléphone",
							label03: "l'adresse",
							label04: "l'état",
							label05: "Date de naissance",
							label06: "Lieu de naissance",
							label07: "Mot de passe",
							label08: "salaire mensuel",
							label09: "Sélectionnez le type d'employé",
							submitBTN01: "Enregistrer les modifications"
						}
					},
					treasury_cashouts: {
						btn01: "Supprimer la sélection",
						label01: "Filtrer par dates",
						th01: "Montant d'entrée",
						th02: "Quantité de sortie",
						th03: "la raison",
						th04: "Observation",
						th05: "date et l'heure"
					},
					add_to_treasury: {
						sectionTitle: "",
						label01: "Le processus d'ajout ou de décaissement du Trésor ?",
						label02: "Sélectionnez la clinique de destination",
						ph01: "Tapez les mots-clés à rechercher...",
						select01: {
							option01: "Ajout au trésor",
							option02: "Sortir du trésor"
						},
						form01: {
							label01: "Montant d'entrée",
							label02: "la raison",
							label03: "Observation",
							label04: "Sélectionnez la date",
							label05: "régler le temps",
							submitBTN01: "Enregistrer les modifications"
						},
						form02: {
							label01: "Montant dépensé",
							label02: "la raison",
							label03: "Observation",
							label04: "Sélectionnez la date",
							label05: "régler le temps",
							submitBTN01: "Enregistrer les modifications"
						}
					},
					statistics: {
						text01: "Trésorerie",
						text02: "Au cours des 7 derniers jours",
						text03: "Les patients",
						text04: "le mois en cours",
						currency: 'DA'
					},
					all_products_billings: {
						sectionTitle: "Factures des produits vendus",
						ph01: "Recherche...",
						text01: "Sélectionner à partir de la date",
						text02: "Sélectionner jusqu'à la date",
						th01: "ID de facture",
						th02: "Créé en",
						th03: "payé en",
						th04: "Montant total",
						th05: "le client",
						btn01: "Supprimer la sélection"
					},
					sell_products: {
						sectionTitle: "Vente des produits de la pharmacie de la clinique",
						form01: {
							label01: "Sélectionnez le client",
							label02: "Sélectionnez le produit",
							label03: "Quantité",
							label04: "Prix de vente",
							label05: "Observation",
							label06: "le prix global",
							ph01: "Entrez des mots-clés pour rechercher...",
							submitBTN01: "Enregistrer les modifications"
						}
					},
					all_products: {
						sectionTitle: "Produits enregistrés",
						btn01: "Supprimer la sélection",
						ph01: "Entrez des mots-clés pour rechercher..."
					},
					add_products: {
						sectionTitle: "ajouter des produits",
						form01: {
							label01: "nom du produit",
							label02: "Brève description",
							label03: "le prix",
							label04: "Quantité",
							label05: "Choisissez une photo",
							label06: "Scannez le code-barres",
							submitBTN01: "Enregistrer les modifications"
						}
					},
					all_appointements: {
						sectionTitle: "Rendez-vous enregistrés",
						th01: "la clinique",
						th02: "service de traitement",
						th03: "le patient",
						th04: "Observation",
						th05: "date et l'heure",
						btn01: "Supprimer la sélection",
						ph01: "Entrez des mots-clés pour rechercher..."
					},
					add_appointement: {
						sectionTitle: "Ajouter des rendez-vous",
						form01: {
							label01: "Sélectionnez la section de traitement",
							label02: "Sélectionnez le patient",
							label03: "Observation",
							label04: "Date",
							label05: "le temps",
							label06: "Sélectionnez la clinique",
							ph01: "Entrez des mots-clés pour rechercher...",
							submitBTN01: "Enregistrer les modifications"
						}
					},
					all_treatment_classes: {
						sectionTitle: "Sections enregistrées",
						th01: "la clinique",
						th02: "Nom du département",
						th03: "Brève description",
						btn01: "Supprimer la sélection",
						ph01: "Entrez des mots-clés pour rechercher..."
					},
					add_treatment_classes: {
						sectionTitle: "Ajouter des sections de traitement",
						form01: {
							label01: "Cette section est pour la clinique",
							label02: "Nom du département",
							label03: "Brève description de la section",
							ph01: "Entrez des mots-clés pour rechercher...",
							submitBTN01: "Enregistrer les modifications"
						}
					},
					inbox: {
						sectionTitle: "boite de réception",
						form01: {
							label01: "Poster une réponse au message",
							ph01: "Rédigez une courte réponse ici...",
							text01: "total des réponses",
							submitBTN01: "ajouter une réponse"
						},
						ttip01: "supprimer les messages !",
						ttip02: "Marquer les messages comme lus"
					},
					sent: {
						sectionTitle: "envoyée",
						form01: {
							label01: "Poster une réponse au message",
							ph01: "Rédigez une courte réponse ici...",
							text01: "total des réponses",
							submitBTN01: "ajouter une réponse"
						},
						ttip01: "supprimer les messages !",
						ttip02: "Marquer les messages comme lus"
					},
					send_message: {
						sectionTitle: "envoyer un message",
						form01: {
							label01: "Sélectionnez le destinataire du message",
							label02: "le sujet",
							label03: "De quoi parle le message ?",
							label04: "Numéro de chef d'entreprise",
							label05: "Téléphone du chef d'entreprise",
							ph01: "Écrivez l'objet du message...",
							ph02: "Rédigez le contenu du message...",
							ph03: "Entrez des mots-clés pour rechercher...",
							submitBTN01: "envoyer le message"
						},
						link01: "Message au directeur de l'établissement",
						link02: "envoyer des messages aux patients"
					},
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
							label19: "Code QR",
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
						btn02: "Pression artérielle",
						btn03: "quantité de sucre",
						btn04: "le poids",
						btn05: "périmètre pelvien",
						btn06: "Enregistrement d'informations complémentaires (tension artérielle, volume de sucre, poids...)",
						link01: "Afficher plus",
						ph01: "Entrez des mots-clés pour rechercher...",
						th01: "la pression",
						th02: "date de l'inscription",
						th03: "quantité de sucre",
						th04: "le poids",
						th05: "circonférence pelvienne",
						form01: {
							label01: "Pression artérielle",
							label02: "quantité de sucre",
							label03: "le poids",
							label04: "circonférence pelvienne",
							label05: "La date à laquelle les informations ont été enregistrées",
							label06: "Temps d'enregistrement des informations",
							submitBTN01: "Enregistrer les modifications"
						}
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
							label20: "Nom de l'entreprise",
							label21: "Nom d'utilisateur",
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
							label05: "Observation",
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
						nav11: "messages",
						nav12: "Envoi d'un message",
						nav13: "boite de réception",
						nav14: "envoyée",
						nav15: "Sections de traitement",
						nav16: "Ajouter des sections de traitement",
						nav17: "Sections enregistrées",
						nav18: "Rendez-vous",
						nav19: "Ajouter des rendez-vous",
						nav20: "Rendez-vous enregistrés",
						nav21: "Des produits",
						nav22: "ajouter des produits",
						nav23: "Visualiser les produits",
						nav24: "Boutique de la clinique",
						nav25: "Vendez des produits",
						nav26: "Visualiser les produits vendus",
						nav27: "Statistiques",
						nav28: "Trésorerie",
						nav29: "Ajouter ou dépenser du trésor",
						nav30: "Enregistrer l'addition et l'échange du trésor",
						nav31: "des employés",
						nav32: "Ajouter des employés",
						nav33: "Employés inscrits",
						nav34: "Enregistrement des présences",
						nav35: "Factures en attente d'approbation",
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