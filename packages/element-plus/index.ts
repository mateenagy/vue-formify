import {
	ElCheckbox as _ElCheckbox,
	ElCascader as _ElCascader,
	ElColorPicker as _ElColorPicker,
	ElDatePicker as _ElDatePicker,
	ElInput as _ElInput,
	ElInputNumber as _ElInputNumber,
	ElRadio as _ElRadio,
	ElRadioGroup as _ElRadioGroup,
	ElRate as _ElRate,
	ElSelect as _ElSelect,
	ElSelectV2 as _ElSelectV2,
	ElSlider as _ElSlider,
	ElSwitch as _ElSwitch,
	ElTimePicker as _ElTimePicker,
	ElTimeSelect as _ElTimeSelect,
	ElTransfer as _ElTransfer,
} from 'element-plus';

import { ComponentProps } from '@/components';
import { createInput } from '@/composable/createInput';

const ElCheckbox = createInput<ComponentProps<typeof _ElCheckbox>>(_ElCheckbox);
const ElCascader = createInput<ComponentProps<typeof _ElCascader>>(_ElCascader);
const ElColorPicker = createInput<ComponentProps<typeof _ElColorPicker>>(_ElColorPicker);
const ElDatePicker = createInput<ComponentProps<typeof _ElDatePicker>>(_ElDatePicker);
const ElInput = createInput<ComponentProps<typeof _ElInput>>(_ElInput);
const ElInputNumber = createInput<ComponentProps<typeof _ElInputNumber>>(_ElInputNumber);
const ElRadio = createInput<ComponentProps<typeof _ElRadio>>(_ElRadio);
const ElRadioGroup = createInput<ComponentProps<typeof _ElRadioGroup>>(_ElRadioGroup);
const ElRate = createInput<ComponentProps<typeof _ElRate>>(_ElRate);
const ElSelect = createInput<ComponentProps<typeof _ElSelect>>(_ElSelect);
const ElSelectV2 = createInput<ComponentProps<typeof _ElSelectV2>>(_ElSelectV2);
const ElSlider = createInput<ComponentProps<typeof _ElSlider>>(_ElSlider);
const ElSwitch = createInput<ComponentProps<typeof _ElSwitch>>(_ElSwitch);
const ElTimePicker = createInput<ComponentProps<typeof _ElTimePicker>>(_ElTimePicker);
const ElTimeSelect = createInput<ComponentProps<typeof _ElTimeSelect>>(_ElTimeSelect);
const ElTransfer = createInput<ComponentProps<typeof _ElTransfer>>(_ElTransfer);

export {
	ElCheckbox,
	ElCascader,
	ElColorPicker,
	ElDatePicker,
	ElInput,
	ElInputNumber,
	ElRadio,
	ElRadioGroup,
	ElRate,
	ElSelect,
	ElSelectV2,
	ElSlider,
	ElSwitch,
	ElTimePicker,
	ElTimeSelect,
	ElTransfer,
};
