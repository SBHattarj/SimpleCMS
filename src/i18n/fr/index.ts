import type { BaseTranslation } from '../i18n-types';

const fr: Translation = {
	// SideBar left
	SBL_Search: 'Rechercher ...',
	SBL_Admin: 'Admin',
	SBL_Admin_User: 'Utilisateur Admin',
	SBL_SystemLanguage: 'Langue du système',
	SBL_User: 'Profil utilisateur',
	SBL_isDark: 'Passer à',
	SBL_Light: 'Clair',
	SBL_Dark: 'Sombre',
	SBL_Mode: 'Mode',
	SBL_Version: 'Ver.',
	SBL_Ver: 'Ver.',
	SBL_Save: 'Enregistrer',
	SBL_Save_message: 'Données enregistrées avec succès',
	SBL_SignOut: 'Déconnexion',

	// Collections
	CollectionCategory_Collection: 'Collection',
	CollectionCategory_Menu: 'Menu',
	CollectionCategory_Media: 'Média',

	// SideBar Right

	// ERROR
	ERROR_Pagenotfound: 'Page non trouvée',
	ERROR_Wrong: "Nous sommes désolés, quelque chose s'est mal passé.",
	ERROR_GoHome: "Aller à la page d'accueil",

	//LOADING
	LOADING_Wait: 'Veuillez patienter',
	LOADING_Loading: 'Chargement...',

	// USER
	USER_Setting: 'Paramètres utilisateur',
	USER_ID: 'ID utilisateur',
	USER_Username: "Nom d'utilisateur",
	USER_FirstName: 'Prénom',
	USER_LastName: 'Nom de famille',
	USER_Email: 'Email',
	USER_Password: 'Mot de passe',
	USER_NewPassword: 'Nouveau mot de passe:',
	USER_Edit: 'Modifier les paramètres utilisateur',
	USER_Fail: 'Email déjà utilisé',
	USER_Delete: "Supprimer l'utilisateur",
	USER_Profile: 'Profil utilisateur',
	USER_Edit_Avatar: "Modifier l'avatar",
	USER_Role: 'Rôle',
	USER_Generate: "Générer un jeton d'inscription utilisateur par email",
	USER_ListShow: 'Afficher la liste des utilisateurs',
	USER_ListCollapse: 'Réduire la liste des utilisateurs',
	USER_EmailToken: "Envoyer un jeton d'inscription utilisateur par email",
	USER_AdminArea: 'Zone Admin:',

	// Tanstack
	TANSTACK_UserList: 'Liste des utilisateurs:',
	TANSTACK_Column: 'Colonnes',
	TANSTACK_Toggle: 'Tout',
	TANSTACK_Filter: 'Filtres de facettes',
	TANSTACK_Export: 'Export XML',
	TANSTACK_Page: 'Page',
	TANSTACK_of: 'de',
	TANSTACK_Total: 'Total',
	TANSTACK_Row: 'Ligne',
	TANSTACK_Rows: 'Lignes',

	// Login
	LOGIN_SignIn: 'Se connecter',
	LOGIN_SignUp: "S'inscrire",
	LOGIN_Required: '* Obligatoire',
	LOGIN_Username: "Nom d'utilisateur",
	LOGIN_EmailAddress: 'Adresse e-mail',
	LOGIN_Password: 'Mot de passe',
	LOGIN_Token: "Jeton d'inscription",
	LOGIN_ConfirmPassword: 'Confirmer le mot de passe',
	LOGIN_ForgottenPassword: 'Mot de passe oublié',
	LOGIN_ForgottenPassword_text:
		'Ne vous inquiétez pas. Nous vous aiderons à récupérer votre mot de passe.',
	LOGIN_SendResetMail: 'Envoyer un e-mail de réinitialisation du mot de passe',
	LOGIN_ResetPassword: 'Réinitialiser le mot de passe',
	LOGIN_ResetPasswordSave: 'Enregistrer le nouveau mot de passe',
	LOGIN_SignInSuccess: 'Connecté avec succès',

	LOGIN_ZOD_Username_string: "Le nom d'utilisateur est requis",
	LOGIN_ZOD_Username_regex: 'Le nom ne peut contenir que des lettres, des chiffres et @$!%*#',
	LOGIN_ZOD_Username_min: 'Le nom doit comporter au moins 2 caractères',
	LOGIN_ZOD_Username_max: 'Le nom ne peut comporter que 24 caractères au maximum',
	LOGIN_ZOD_Email_string: "L'adresse e-mail est requise",
	LOGIN_ZOD_Email_email: "L'adresse e-mail doit être une adresse e-mail valide",
	LOGIN_ZOD_Password_string: 'Le mot de passe est requis',
	LOGIN_ZOD_Password_regex:
		'Le mot de passe doit comporter au moins 8 caractères et contenir au moins une lettre, un chiffre et un caractère spécial.',
	LOGIN_ZOD_Confirm_password_string: 'La confirmation du mot de passe est requise',
	LOGIN_ZOD_Confirm_password_regex:
		'Le mot de passe doit comporter au moins 8 caractères et contenir au moins une lettre, un chiffre et un caractère spécial.',
	LOGIN_ZOD_Token_string: "Un jeton d'authentification est requis",
	LOGIN_ZOD_Password_match:
		'Le mot de passe et la confirmation du mot de passe doivent correspondre',

	LOGIN_ZOD_General_Unknown: "Une erreur inconnue s'est produite",
	LOGIN_ZOD_General_Error: 'Entrée invalide',
	LOGIN_ZOD_Email_Error_inUse: "L'adresse e-mail est déjà utilisée",
	LOGIN_ZOD_Email_Error_send: "Erreur lors de l'envoi du courrier électronique.",
	LOGIN_ZOD_Email_Error_Signup: 'LOGIN_ZOD_Signup_unkown',
	LOGIN_ZOD_Email_Error_SignupKey: 'Incorrect email or password.',
	LOGIN_ZOD_Token_Error: 'Token is wrong!',
	LOGIN_ZOD_Token_Expired: 'Token has expired!',
	LOGIN_ZOD_Forgotten_Error: 'No account under this email',
	LOGIN_ZOD_Forgotten_email:
		'Hi there,<br><br>We received a request to reset your password. Your password reset token is:<br><br>{token:string}<br> <br>Please follow the link below to reset your password:<br>{link:string}<br><br>If you did not request this reset, please disregard this message.<br><br>Best regards,<br>The Support Team',

	// Entry List
	ENTRYLIST_Create: 'Créer',
	ENTRYLIST_Publish: 'Publier',
	ENTRYLIST_Unpublish: 'Unpublish',
	ENTRYLIST_Schedule: 'Schedule',
	ENTRYLIST_Clone: 'Clone',
	ENTRYLIST_Delete: 'Supprimer',
	ENTRYLIST_Delete_title: 'Veuillez confirmer la suppression !!',
	ENTRYLIST_Delete_body: 'Êtes-vous sûr de vouloir continuer ?',
	ENTRYLIST_Delete_cancel: 'Annuler',
	ENTRYLIST_Delete_confirm: 'Confirmer',
	ENTRYLIST_Search: 'Rechercher',
	ENTRYLIST_Loading: 'Loading...',
	ENTRYLIST_Modal_title_Create: 'Veuillez confirmer la création du contenu',
	ENTRYLIST_Modal_body_Create: 'Êtes-vous sûr de vouloir créer ce contenu ?',
	ENTRYLIST_Modal_title_Publish: 'Veuillez confirmer la publication du contenu',
	ENTRYLIST_Modal_body_Publish: 'Êtes-vous sûr de vouloir publier ce contenu ?',
	ENTRYLIST_Modal_title_Unpublish: 'Veuillez confirmer la dépublication du contenu',
	ENTRYLIST_Modal_body_Unpublish: 'Êtes-vous sûr de vouloir dépublier ce contenu ?',
	ENTRYLIST_Modal_title_Schedule: "Veuillez confirmer l'horaire du contenu",
	ENTRYLIST_Modal_body_Schedule: 'Êtes-vous sûr de vouloir programmer ce contenu ?',
	ENTRYLIST_Modal_title_Clone: 'Veuillez confirmer le clonage du contenu',
	ENTRYLIST_Modal_body_Clone: 'Êtes-vous sûr de vouloir cloner ce contenu ?',
	ENTRYLIST_Modal_title_Delete: 'Veuillez confirmer la suppression du contenu',
	ENTRYLIST_Modal_body_Delete: 'Êtes-vous sûr de vouloir supprimer ce contenu ?',
	ENTRYLIST_Modal_Cancel: 'Annuler',

	// Fields

	// Form
	FORM_Create: 'Create',
	FORM_CloseMenu: 'Close Menu',
	FORM_TT_Closes: 'Close without saving',
	FORM_Required: 'Required',

	// Alert

	// Collections
	COLLECTION_TEST_User: 'User',
	COLLECTION_TEST_Prefix: 'Prefix',
	COLLECTION_TEST_Prefix_data: ['Mr.', 'Ms.', 'Mrs.', 'Dr.'],
	COLLECTION_TEST_Prefix_placeholder: 'Enter Prefix',
	COLLECTION_TEST_First: 'First',
	COLLECTION_TEST_First_placeholder: 'Enter First Name',
	COLLECTION_TEST_Middle: 'Middle',
	COLLECTION_TEST_Middle_placeholder: 'Middle  (ReadOnly)',
	COLLECTION_TEST_Last: 'Last',
	COLLECTION_TEST_Last_placeholder: 'Enter Last Name',

	COLLECTION_TEST_Full_Text_Option: 'Full Text Option',
	COLLECTION_TEST_Full_Text_Option_Placeholder: 'Enter full text',

	// Widgets
	WIDGET_MegaMenu_title:
		"Veuillez saisir un nom pour votre menu avant d'ajouter des catégories de menu.",
	WIDGET_MegaMenu_Next: 'Suivant',

	WIDGET_Address_SearchMap: 'Search in Map ...',
	WIDGET_Address_GetAddress: 'Get from Address',
	WIDGET_Address_GetMap: 'Get from Address',
	WIDGET_Address_Geocoordinates: 'Geocoordinates',
	WIDGET_Address_Latitude: 'Latitude',
	WIDGET_Address_Longitude: 'Longitude',
	WIDGET_Address_Name: 'Name',
	WIDGET_Address_Street: 'Street address',
	WIDGET_Address_Zip: 'ZIP or Postal Code',
	WIDGET_Address_City: 'City',
	WIDGET_Address_SearchCountry: 'Search Country ...',

	WIDGET_Relation_ChoseExisting: 'Chose existing...',
	WIDGET_Relation_Edit: 'Edit',
	WIDGET_Relation_AddNew: 'Add New',

	WIDGET_Seo_Suggestion_TitlePerfect: 'Your title is more than 50 characters. Perfect!',
	WIDGET_Seo_Suggestion_TitleGood: 'Your title is more than 30 characters. Try 50+. Good!',
	WIDGET_Seo_Suggestion_TitleBad:
		'Your title is too short. Make sure your title is at least 50 characters. Bad!',
	WIDGET_Seo_Suggestion_DescriptionPerfect:
		'Your description is between 120 and 165 characters. Perfect!',
	WIDGET_Seo_Suggestion_DescriptionGood: 'Your description is more than 90 characters. Good!',
	WIDGET_Seo_Suggestion_DescriptionBad: 'Your description is less than 90 characters. Bad!',
	WIDGET_Seo_Suggestion_SentencePerfect: 'Your description is 2 to 4 sentences long. Perfect!',
	WIDGET_Seo_Suggestion_SentenceGood:
		"Votre description comporte 2 à 4 phrases mais toutes les phrases ne sont pas comprises entre 10 et 30 caractères. C'est bien",
	WIDGET_Seo_Suggestion_SentenceBad:
		'Your descripton is only 1 sentence long. Make sure your description is 2 to 4 sentences long.',

	WIDGET_Seo_Suggestion_NumberPerfect: 'Your title uses numbers. Perfect!',
	WIDGET_Seo_Suggestion_NumberBad:
		'Your title does not use numbers. The use of numbers in your title can increase your CTR.',
	WIDGET_Seo_Suggestion_PowerWordTitle: `Votre titre contient le mot-clé. Parfait!`,
	WIDGET_Seo_Suggestion_PowerWordTitleBad: `Votre titre ne contient pas de mot-clé. Mauvais!`,
	WIDGET_Seo_Suggestion_PowerWordDescription: `Votre description utilise le mot-clé. Parfait!`,
	WIDGET_Seo_Suggestion_PowerWordDescriptionBad: `Votre description n'utilise pas de Power Word. Mauvais`,
	WIDGET_Seo_Suggestion_ctaKeywordsTitle: `Votre titre contient le mot-clé CTA. Parfait!`,
	WIDGET_Seo_Suggestion_ctaKeywordsTitleBad: `Votre titre ne contient pas de mot-clé CTA. Mauvais!`,
	WIDGET_Seo_Suggestion_ctaKeywordsDescription: `Votre description utilise le mot-clé CTA. Parfait!`,
	WIDGET_Seo_Suggestion_ctaKeywordsDescriptionBad: `Votre description n'utilise pas de mot-clé CTA. Mauvais!`,
	WIDGET_Seo_Suggestion_Title: 'Title:',
	WIDGET_Seo_Suggestion_Character: 'Character:',
	WIDGET_Seo_Suggestion_WidthDesktop: '- Desktop:',
	WIDGET_Seo_Suggestion_WidthMobile: 'Mobile: ',
	WIDGET_Seo_Suggestion_SeoTitle: 'SEO Title: ',
	WIDGET_Seo_Suggestion_Description: 'Description:',
	WIDGET_Seo_Suggestion_SeoDescription: 'SEO Description',
	WIDGET_Seo_Suggestion_SeoPreview: 'SEO Preview',
	WIDGET_Seo_Suggestion_ListOfSuggestion: 'SEO Suggestions:',
	WIDGET_Seo_Suggestion_Text:
		'Optimize title & description for Google search results, to improve the visual appeal to brings more clicks to your website.',
	WIDGET_SEO_PowerWords: [
		'Améliorer',
		'Augmenter',
		'Avis d’expert',
		'Bonus',
		'Cadeau',
		'Chaud',
		'Confortable',
		'Confiance',
		'Diminuer',
		'Efficace',
		'Efficient',
		'Économiser',
		'Élever',
		'Éprouvé',
		'Exclusif',
		'Facile',
		'Flexible',
		'Gain de temps',
		'Garantie',
		'Garantie de remboursement',
		'Garanti',
		'Gagner',
		'Gratuit',
		'Immédiat',
		'Limité',
		'Maximiser',
		'Meilleure vente',
		'Minimiser',
		'Nouveau',
		'Offre spéciale',
		'Optimiser',
		'Populaire',
		'Praticité',
		'Preuve',
		'Premium',
		'Précieux',
		'Protéger',
		'Rapide',
		'Recommandation',
		'Réduire',
		'Résultats',
		'Satisfaction',
		'Sécurité',
		'Secret',
		'Simple',
		'Simplicité',
		'Sans engagement',
		'Sans obligation',
		'Sans risque',
		'Sans stress',
		'Sûr',
		'Surprise',
		'Succès',
		'Utile',
		'Vaut la peine'
	],
	WIDGET_SEO_ctaKeywords: [
		'Acheter',
		'Agir',
		'Appeler',
		'Apprendre',
		'Cliquer',
		'Contacter',
		'Découvrir',
		'Inscrire',
		'Joindre',
		'Obtenir',
		'Regarder',
		"S'abonner",
		"S'inscrire",
		'Télécharger',
		'Trouver',
		'Vendre',
		'Voir'
	]
};

export default fr;
