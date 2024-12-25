import { default as _Calendar } from 'primevue/calendar';
import { default as _CascadeSelect } from 'primevue/cascadeselect';
import { default as _Checkbox } from 'primevue/checkbox';
import { default as _Chips } from 'primevue/chips';
import { default as _ColorPicker } from 'primevue/colorpicker';
import { default as _Dropdown } from 'primevue/dropdown';
import { default as _InputMask } from 'primevue/inputmask';
import { default as _InputNumber } from 'primevue/inputnumber';
import { default as _InputOtp } from 'primevue/inputotp';
import { default as _InputSwitch } from 'primevue/inputswitch';
import { default as _InputText } from 'primevue/inputtext';
import { default as _Knob } from 'primevue/knob';
import { default as _Listbox } from 'primevue/listbox';
import { default as _MultiSelect } from 'primevue/multiselect';
import { default as _Password } from 'primevue/password';
import { default as _RadioButton } from 'primevue/radiobutton';
import { default as _Rating } from 'primevue/rating';
import { default as _SelectButton } from 'primevue/selectbutton';
import { default as _Slider } from 'primevue/slider';
import { default as _Textarea } from 'primevue/textarea';
import { default as _ToggleButton } from 'primevue/togglebutton';
import { default as _TreeSelect } from 'primevue/treeselect';
import { ComponentProps, createInput } from 'vue-formify';

const InputText = createInput<ComponentProps<typeof _InputText>>(_InputText);
const Calendar = createInput<ComponentProps<typeof _Calendar>>(_Calendar);
const CascadeSelect = createInput<ComponentProps<typeof _CascadeSelect>>(_CascadeSelect);
const Checkbox = createInput<ComponentProps<typeof _Checkbox>>(_Checkbox);
const Chips = createInput<ComponentProps<typeof _Chips>>(_Chips);
const ColorPicker = createInput<ComponentProps<typeof _ColorPicker>>(_ColorPicker);
const Dropdown = createInput<ComponentProps<typeof _Dropdown>>(_Dropdown);
const InputMask = createInput<ComponentProps<typeof _InputMask>>(_InputMask);
const InputNumber = createInput<ComponentProps<typeof _InputNumber>>(_InputNumber);
const InputOtp = createInput<ComponentProps<typeof _InputOtp>>(_InputOtp);
const InputSwitch = createInput<ComponentProps<typeof _InputSwitch>>(_InputSwitch);
const Knob = createInput<ComponentProps<typeof _Knob>>(_Knob);
const Listbox = createInput<ComponentProps<typeof _Listbox>>(_Listbox);
const MultiSelect = createInput<ComponentProps<typeof _MultiSelect>>(_MultiSelect);
const Password = createInput<ComponentProps<typeof _Password>>(_Password);
const RadioButton = createInput<ComponentProps<typeof _RadioButton>>(_RadioButton);
const Rating = createInput<ComponentProps<typeof _Rating>>(_Rating);
const SelectButton = createInput<ComponentProps<typeof _SelectButton>>(_SelectButton);
const Slider = createInput<ComponentProps<typeof _Slider>>(_Slider);
const Textarea = createInput<ComponentProps<typeof _Textarea>>(_Textarea);
const ToggleButton = createInput<ComponentProps<typeof _ToggleButton>>(_ToggleButton);
const TreeSelect = createInput<ComponentProps<typeof _TreeSelect>>(_TreeSelect);

export {
	InputText,
	Calendar,
	CascadeSelect,
	Checkbox,
	Chips,
	ColorPicker,
	Dropdown,
	InputMask,
	InputNumber,
	InputOtp,
	InputSwitch,
	Knob,
	Listbox,
	MultiSelect,
	Password,
	RadioButton,
	Rating,
	SelectButton,
	Slider,
	Textarea,
	ToggleButton,
	TreeSelect,
};
