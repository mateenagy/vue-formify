/**
 * https://github.com/unplugin/unplugin-vue-components/blob/main/src/core/resolvers/prime-vue.ts
 */

const components = [
	'Accordion',
	'AccordionTab',
	'AutoComplete',
	'Avatar',
	'AvatarGroup',
	'Badge',
	'BlockUI',
	'Breadcrumb',
	'Button',
	'Card',
	'Carousel',
	'Chart',
	'Chip',
	'Column',
	'ColumnGroup',
	// 'ConfirmDialog',
	// 'ConfirmPopup',
	// These must be registered globally in order for the confirm service to work properly
	'ContextMenu',
	'DataTable',
	'DataView',
	'DataViewLayoutOptions',
	'DeferredContent',
	'Dialog',
	'Divider',
	'Dock',
	'Editor',
	'Fieldset',
	'FileUpload',
	'FullCalendar',
	'Galleria',
	'Image',
	'InlineMessage',
	'Inplace',
	'MegaMenu',
	'Menu',
	'Menubar',
	'Message',
	'OrderList',
	'OrganizationChart',
	'OverlayPanel',
	'Paginator',
	'Panel',
	'PanelMenu',
	'PickList',
	'ProgressBar',
	'ProgressSpinner',
	'Row',
	'ScrollPanel',
	'ScrollTop',
	'Sidebar',
	'Skeleton',
	'SpeedDial',
	'SplitButton',
	'Splitter',
	'SplitterPanel',
	'Steps',
	'TabMenu',
	'TabPanel',
	'TabView',
	'Tag',
	'Terminal',
	'TerminalService',
	'TieredMenu',
	'Timeline',
	'Timelist',
	// 'Toast',
	// Toast must be registered globally in order for the toast service to work properly
	'Toolbar',
	// 'Tooltip',
	// Tooltip must be registered globally in order for the tooltip service to work properly
	'Tree',
	'TreeTable',
	'VirtualScroller',
];

const formComponents = [
	'Calendar',
	'CascadeSelect',
	'Checkbox',
	'Chips',
	'ColorPicker',
	'Dropdown',
	'InputMask',
	'InputNumber',
	'InputSwitch',
	'InputText',
	'Knob',
	'Listbox',
	'MultiSelect',
	'Password',
	'RadioButton',
	'Rating',
	'SelectButton',
	'Slider',
	'Textarea',
	'ToggleButton',
	'TreeSelect',
	'TriStateCheckbox',
];

export interface PrimeVueResolverOptions {
	/**
   * import style along with components
   *
   * @default true
   */
	importStyle?: boolean;
	/**
   * import `primeicons' icons
   *
   * requires package `primeicons`
   *
   * @default true
   */
	importIcons?: boolean;
	/**
   * imports a free theme - set theme name here (e.g. saga-blue)
   *
   * @default ''
   */
	importTheme?: string;
	/**
   * prefix for components (e.g. 'P' to resolve Menu from PMenu)
   *
   * @default ''
   */
	prefix?: string;
}

/**
 * Resolver for PrimeVue - If you're using a component with the same tag as an native HTML element (e.g. button) the component must be in uppercase
 *
 * @link https://github.com/primefaces/primevue
 */
export const PrimeVueResolver = (options: PrimeVueResolverOptions = {}) => {
	return {
		type: 'component',
		resolve: (name: string) => {
			const sideEffects = [];

			if (options.importStyle) {
				sideEffects.push('primevue/resources/primevue.min.css');
			}

			if (options.importIcons) {
				sideEffects.push('primeicons/primeicons.css');
			}

			if (options.importTheme) {
				sideEffects.push(
					`primevue/resources/themes/${options.importTheme}/theme.css`,
				);
			}

			if (options.prefix) {
				if (!name.startsWith(options.prefix)) {
					return;
				}

				name = name.substring(options.prefix.length);
			}

			if (components.includes(name)) {
				return {
					from: `primevue/${name.toLowerCase()}`,
					sideEffects,
				};
			}
			if (formComponents.includes(name)) {
				return {
					name,
					from: '@vue-formify/primevue',
					sideEffects,
				};
			}
		},
	};
};
