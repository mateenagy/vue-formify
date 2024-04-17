import { 
	IonCheckbox as _IonCheckbox,
	IonRange as _IonRange,
	IonDatetime as _IonDatetime,
	IonInput as _IonInput,
	IonRadioGroup as _IonRadioGroup,
	IonSegment as _IonSegment,
	IonSelect as _IonSelect,
	IonToggle as _IonToggle,
} from '@ionic/vue';
import { ComponentProps } from '@/components';
import { createInput } from '@/composable/createInput';

const IonCheckbox = createInput<ComponentProps<typeof _IonCheckbox>>(_IonCheckbox, { defaultValueKey: 'value' });
const IonRange = createInput<ComponentProps<typeof _IonRange>>(_IonRange, { defaultValueKey: 'value' });
const IonDatetime = createInput<ComponentProps<typeof _IonDatetime>>(_IonDatetime, { defaultValueKey: 'value' });
const IonInput = createInput<ComponentProps<typeof _IonInput>>(_IonInput, { defaultValueKey: 'value' });
const IonRadioGroup = createInput<ComponentProps<typeof _IonRadioGroup>>(_IonRadioGroup, { defaultValueKey: 'value' });
const IonSegment = createInput<ComponentProps<typeof _IonSegment>>(_IonSegment, { defaultValueKey: 'value' });
const IonSelect = createInput<ComponentProps<typeof _IonSelect>>(_IonSelect, { defaultValueKey: 'value' });
const IonToggle = createInput<ComponentProps<typeof _IonToggle>>(_IonToggle, { defaultValueKey: 'value' });

export {
	IonCheckbox,
	IonRange,
	IonDatetime,
	IonInput,
	IonRadioGroup,
	IonSegment,
	IonSelect,
	IonToggle,
};
