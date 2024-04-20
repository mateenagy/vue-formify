import type {
	ComboboxRootProps,
	PinInputRootProps,
	RadioGroupRootProps,
	SelectRootProps,
	SwitchRootProps,
	TagsInputRootProps, 
} from 'radix-vue';
import { 
	ToggleProps,
	CheckboxRoot as _CheckboxRoot,
	ComboboxRoot as _ComboboxRoot,
	PinInputRoot as _PinInputRoot,
	RadioGroupRoot as _RadioGroupRoot,
	SelectRoot as _SelectRoot,
	SwitchRoot as _SwitchRoot,
	TagsInputRoot as _TagsInputRoot,
	Toggle as _Toggle,
} from 'radix-vue';
import { Component } from 'vue';
import { ComponentProps, createInput } from 'vue-formify';

const CheckboxRoot = createInput<ComponentProps<typeof _CheckboxRoot>>(_CheckboxRoot, { modelKey: 'checked', defaultValueKey: 'defaultChecked' });
const ComboboxRoot = createInput<ComboboxRootProps>(_ComboboxRoot as Component, { defaultValueKey: 'defaultValue' });
const PinInputRoot = createInput<PinInputRootProps>(_PinInputRoot as Component, { defaultValueKey: 'defaultValue' });
const RadioGroupRoot = createInput<RadioGroupRootProps>(_RadioGroupRoot as Component, { defaultValueKey: 'defaultValue' });
const SelectRoot = createInput<SelectRootProps>(_SelectRoot as Component, { defaultValueKey: 'defaultValue' });
const SwitchRoot = createInput<SwitchRootProps>(_SwitchRoot as Component, { modelKey: 'checked', defaultValueKey: 'defaultChecked' });
const TagsInputRoot = createInput<TagsInputRootProps>(_TagsInputRoot as Component, { defaultValueKey: 'defaultValue' });
const Toggle = createInput<ToggleProps>(_Toggle as Component, { modelKey: 'pressed', defaultValueKey: 'defaultValue' });

export {
	CheckboxRoot,
	ComboboxRoot,
	PinInputRoot,
	RadioGroupRoot,
	SelectRoot,
	SwitchRoot,
	TagsInputRoot,
	Toggle,
};
