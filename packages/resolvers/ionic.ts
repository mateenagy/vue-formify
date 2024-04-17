/**
 * Based on https://github.com/unplugin/unplugin-vue-components/blob/main/src/core/resolvers/ionic.ts
 */

/**
 * source: https://github.com/nuxt-modules/ionic/blob/main/src/imports.ts
 * @author @danielroe
 */

/**
 * Resolver for ionic framework
 *
 * @author @mathsgod @reslear
 * @link https://ionicframework.com/
 */

export const IonicInputComponents = [
	'IonCheckbox',
	'IonRange',
	'IonDatetime',
	'IonInput',
	'IonRadioGroup',
	'IonSegment',
	'IonSelect',
	'IonToggle',
];
export const IonicBuiltInComponents = [
	'IonAccordion',
	'IonAccordionGroup',
	'IonActionSheet',
	'IonAlert',
	'IonApp',
	'IonAvatar',
	'IonBackButton',
	'IonBackdrop',
	'IonBadge',
	'IonBreadcrumb',
	'IonBreadcrumbs',
	'IonButton',
	'IonButtons',
	'IonCard',
	'IonCardContent',
	'IonCardHeader',
	'IonCardSubtitle',
	'IonCardTitle',
	'IonChip',
	'IonCol',
	'IonContent',
	'IonDatetimeButton',
	'IonFab',
	'IonFabButton',
	'IonFabList',
	'IonFooter',
	'IonGrid',
	'IonHeader',
	'IonIcon',
	'IonImg',
	'IonInfiniteScroll',
	'IonInfiniteScrollContent',
	'IonItem',
	'IonItemDivider',
	'IonItemGroup',
	'IonItemOption',
	'IonItemOptions',
	'IonItemSliding',
	'IonLabel',
	'IonList',
	'IonListHeader',
	'IonLoading',
	'IonMenu',
	'IonMenuButton',
	'IonMenuToggle',
	'IonModal',
	'IonNav',
	'IonNavLink',
	'IonNote',
	'IonPage',
	'IonPicker',
	'IonPopover',
	'IonProgressBar',
	'IonRadio',
	'IonRefresher',
	'IonRefresherContent',
	'IonReorder',
	'IonReorderGroup',
	'IonRippleEffect',
	'IonRouterOutlet',
	'IonRow',
	'IonSearchbar',
	'IonSegmentButton',
	'IonSelectOption',
	'IonSkeletonText',
	'IonSpinner',
	'IonSplitPane',
	'IonTabBar',
	'IonTabButton',
	'IonTabs',
	'IonText',
	'IonTextarea',
	'IonThumbnail',
	'IonTitle',
	'IonToast',
	'IonToolbar',
];

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export const IonicResolver = () => {
	return {
		type: 'component',
		resolve: (name) => {
			if (IonicBuiltInComponents.includes(name)) {
				return {
					name,
					from: '@ionic/vue',
				};
			}
			if (IonicInputComponents.includes(name)) {
				return {
					name,
					from: '@vue-formify/ionic',
				};
			}
		},
	};
};
