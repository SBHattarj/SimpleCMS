import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	name: 'image upload',
	fields: [
		widgets.ImageUpload({
			label: 'image',
			path: 'media/images'
		}),
		widgets.Text({
			label: 'title',
			db_fieldName: 'title',
			translated: false
		})
	]
};
export default schema;