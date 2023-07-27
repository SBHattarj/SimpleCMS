import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
import Text from './Text.svelte';
import { GuiSchema, type Params } from './types';
const widget = ({ label, db_fieldName, display, translated = false }: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGE] || 'NO entry';
		};
		display.default = true;
	}
	let widget: { type: any; key: 'Text' } = { type: Text, key: 'Text' };
	let field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated
	};
	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
