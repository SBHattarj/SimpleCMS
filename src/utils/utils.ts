import fs from 'fs';
import schemas, { collection } from '../collections';
import { Blob } from 'buffer';
import type { Schema } from '@src/collections/types';
import { get } from 'svelte/store';
import { contentLanguage } from '@src/stores/store';
import { entryData, mode } from '@src/stores/store';
import type { Auth } from 'lucia-auth';
import type { User } from '@src/collections/Auth';

// Function to convert an object to form data
export const obj2formData = (obj: any) => {
	try {
		// Create a new FormData object
		const formData = new FormData();

		// Iterate over the keys of the input object
		for (const key in obj) {
			// Append each key-value pair to the FormData object as a string
			formData.append(
				key,
				JSON.stringify(obj[key], (key, val) => {
					// Handle special cases for certain keys
					if (!val && val !== false) return undefined;
					if (key == 'schema') return undefined;
					if (key == 'display' && val.default == true) return undefined;
					if (key == 'widget') return val.key;
					if (typeof val === 'function') {
						return val + '';
					}
					return val;
				})
			);
		}

		// Return the FormData object
		return formData;
	} catch (error) {
		// Handle any errors that might occur
		console.error(error);
		return null;
	}
};

// Converts data to FormData object
export const col2formData = async (getData: { [Key: string]: () => any }) => {
	const formData = new FormData();
	const data = {};
	for (const key in getData) {
		const value = await getData[key]();
		if (!value) continue;
		data[key] = value;
	}
	for (const key in data) {
		if (data[key] instanceof FileList) {
			for (const _key in data[key]) {
				// for multiple files
				//console.log(data[key]);
				formData.append(key, data[key][_key]);
			}
		} else if (typeof data[key] === 'object') {
			formData.append(key, JSON.stringify(data[key]));
		} else {
			formData.append(key, data[key]);
		}
	}
	if (!formData.entries().next().value) {
		return null;
	}
	return formData;
};

// Saves POSTS files to disk and returns file information

// TODO: not working s code runs on client
//import sharp from 'sharp';
//import { PUBLIC_MEDIA_OUTPUT_FORMAT } from '$env/static/public';

// Saves POSTS files to disk and returns file information
// export function saveFiles(data: FormData, collection: string) {
// 	let files: any = {};
// 	let _files: Array<any> = [];
// 	let schema = schemas.find((schema) => schema.name === collection);

// 	const maxUploadSize = 100 * 1024 * 1024; // 100MB
// 	const publicMediaOutputFormat: 'avif' | 'webp' | undefined = PUBLIC_MEDIA_OUTPUT_FORMAT as 'avif' | 'webp' | undefined;
// 	const supportedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// 	for (let [fieldname, fieldData] of data.entries()) {
// 		if (fieldData instanceof Blob) {
// 			// Check if the file size exceeds the maximum upload size
// 			if (fieldData.size > maxUploadSize) {
// 				throw new Error(`File size exceeds the maximum upload size of ${maxUploadSize} bytes`);
// 			}
// 			// Check if the file type is supported
// 			if (!supportedFileTypes.includes(fieldData.type)) {
// 				throw new Error(`Unsupported file type: ${fieldData.type}`);
// 			}
// 			_files.push({ blob: fieldData, fieldname });
// 		}
// 	}

// 	for (let file of _files) {
// 		let { blob, fieldname } = file;
// 		let path = _findFieldByTitle(schema, fieldname).path;
// 		let fileName = sanitizeFileName(blob.name, collection);
// 		let filePath = `${path}/${fileName}`;

// 		// Create folder if it doesn't exist
// 		if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
// 		// Check if the file already exists and throw an error if it does
// 		if (fs.existsSync(filePath)) {
// 			throw new Error(`File already exists: ${filePath}`);
// 		}

// 		files[fieldname as keyof typeof files] = { name: fileName, size: blob.size, type: blob.type, lastModified: blob.lastModified };

// 		(blob as Blob).arrayBuffer().then(async (arrayBuffer) => {
// 			// Optimize image files using sharp.js with a compression quality of 80% for webp and 50% for avif
// 			if (publicMediaOutputFormat && ['webp', 'avif'].includes(publicMediaOutputFormat)) {
// 				const compressionQuality = publicMediaOutputFormat === 'webp' ? 80 : 50;
// 				const optimizedImageBuffer = await sharp(Buffer.from(arrayBuffer))
// 					.rotate() // Rotate image according to EXIF data
// 					.toFormat(publicMediaOutputFormat, { quality: compressionQuality })
// 					.toBuffer();
// 				fs.writeFileSync(filePath, optimizedImageBuffer);

// 				// Create a reduced thumbnail using sharp.js with a compression quality of 80% for webp and 50% for avif
// 				const thumbnailBuffer = await sharp(Buffer.from(arrayBuffer))
// 					.rotate() // Rotate image according to EXIF data
// 					.resize(320, 320)
// 					.toFormat(publicMediaOutputFormat, { quality: compressionQuality })
// 					.toBuffer();
// 				const thumbnailPath = `${path}/thumbnail-${fileName}`;
// 				fs.writeFileSync(thumbnailPath, thumbnailBuffer);
// 				files[fieldname].thumbnail = thumbnailPath;
// 			} else {
// 				fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
// 			}
// 		});
// 	}
// 	return files;
// }

// function sanitizeFileName(fileName: string, collection: string) {
// 	// Sanitize the file name by adding the collection to it and replacing any characters that are not letters, numbers, periods or hyphens with underscores
// 	return `${collection}-${fileName.replace(/[^a-z0-9.-]/gi, '_').toLowerCase()}`;
// }
// -----------------------
export function saveFiles(data: FormData, collection: string) {
	const files: any = {};
	const _files: Array<any> = [];
	const schema = schemas.find((schema) => schema.name === collection);

	for (const [fieldname, fieldData] of data.entries()) {
		if (fieldData instanceof Blob) {
			_files.push({ blob: fieldData, fieldname });
		}
	}

	for (const file of _files) {
		const { blob, fieldname } = file;
		//console.log('save blob:', blob);
		//console.log('save fieldname:', fieldname);

		files[fieldname as keyof typeof files] = {
			name: blob.name,
			size: blob.size,
			type: blob.type,
			lastModified: blob.lastModified
		};
		const path = _findFieldByTitle(schema, fieldname).path;
		//console.log('save path:', path);

		if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
		(blob as Blob).arrayBuffer().then((arrayBuffer) => {
			fs.writeFileSync(path + '/' + blob.name, Buffer.from(arrayBuffer));

			console.log('save filePath:', path + '/' + blob.name);
		});
	}
	return files;
}

// finds field title that matches the fieldname and returns that field
function _findFieldByTitle(schema: any, fieldname: string, found = { val: false }): any {
	for (const field of schema.fields) {
		//console.log('field is ', field.db_fieldName, field.label);
		if (field.db_fieldName == fieldname || field.label == fieldname) {
			found.val = true;

			return field;
		} else if (field.fields && field.fields.length > 0) {
			return _findFieldByTitle(field, fieldname, found);
		}
	}
	if (!found) {
		throw new Error('FIELD NOT FOUND');
	}
}

// takes an object and recursively parses any values that can be converted to JSON
export function parse(obj: any) {
	for (const key in obj) {
		try {
			if (Array.isArray(obj[key])) {
				for (const index of obj[key]) {
					obj[key][index] = JSON.parse(obj[key][index]);
				}
			} else {
				obj[key] = JSON.parse(obj[key]);
			}
		} catch (e) {}

		if (typeof obj[key] != 'string') {
			parse(obj[key]);
		}
	}
	return obj;
}

// Converts fields to schema object
export let fieldsToSchema = (fields: Array<any>) => {
	// removes widget, so it does not set up in db
	let schema: any = {};
	for (const field of fields) {
		schema = { ...schema, ...field.schema };
	}
	delete schema.widget;
	return schema;
};

// Finds documents in collection that match query
export async function find(query: object, collection: Schema) {
	if (!collection) return;
	const _query = JSON.stringify(query);
	const response = await fetch(`/api/find?collection=${collection.name}&query=${_query}`);
	return response.json();
}

// Finds document in collection with specified ID
export async function findById(id: string, collection: Schema) {
	if (!id || !collection) return;
	const response = await fetch(`/api/find?collection=${collection.name}&id=${id}`);
	return response.json();
}

// Returns field's database field name or label
export function getFieldName(field: any) {
	return (field?.db_fieldName || field?.label) as string;
}

// Saves FormData to database
export async function saveFormData({
	data,
	_collection,
	_mode,
	id
}: {
	data: any;
	_collection?: Schema;
	_mode?: 'edit' | 'create';
	id?: string;
}) {
	//console.log('saveFormData', data);

	const $mode = _mode || get(mode);
	const $collection = _collection || get(collection);
	const $entryData = get(entryData);
	const formData = data instanceof FormData ? data : await col2formData(data);
	if (_mode === 'edit' && !id) {
		throw new Error('ID is required for edit mode.');
	}
	if (!formData) return;
	switch ($mode) {
		case 'create': {
			const createResponse = await fetch(`/api/${$collection.name}`, {
				method: 'POST',
				body: formData
			});
			return createResponse.json();
		}
		case 'edit': {
			formData.append('_id', id || $entryData._id);
			const editResponse = await fetch(`/api/${$collection.name}`, {
				method: 'PATCH',
				body: formData
			});
			return editResponse.json();
		}
	}
}

// Clone FormData to database
export async function cloneData(data) {
	const $collection = get(collection);
	const formData = data instanceof FormData ? data : await col2formData(data);
	if (!formData) return;
	await fetch(`/api/${$collection.name}`, {
		method: 'POST',
		body: formData
	});
}

// Publish FormData to database
export async function publishData(id) {
	const $collection = get(collection);
	await fetch(`/api/${$collection.name}/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ published: true })
	});
}

// Unpublish FormData to database
export async function unpublishData(id) {
	const $collection = get(collection);
	await fetch(`/api/${$collection.name}/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ published: false })
	});
}

// Schedule FormData to database
export async function scheduleData(id, date) {
	const $collection = get(collection);
	await fetch(`/api/${$collection.name}/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ publishDate: date })
	});
}

// Delete FormData
// TODO: move images/files to trash folder see [collection]/+server.ts
export async function deleteData(id) {
	const $collection = get(collection);
	await fetch(`/api/${$collection.name}/${id}`, { method: 'DELETE' });
}

export async function extractData(fieldsData: any) {
	// extracts data from fieldsData because FieldsData is async
	const temp = {};
	for (const key in fieldsData) {
		temp[key] = await fieldsData[key]();
	}
	return temp;
}

export async function validate(auth: Auth, sessionID: string | null) {
	if (!sessionID) {
		return { user: {} as User, status: 404 };
	}
	const resp = await auth.validateSessionUser(sessionID).catch(() => null);
	if (!resp) return { user: {} as User, status: 404 };
	return { user: resp.user as User, status: 200 };
}

/**
 * Formats a file size in bytes to the appropriate unit (bytes, kilobytes, megabytes, or gigabytes).
 * @param sizeInBytes - The size of the file in bytes.
 * @returns The formatted file size as a string.
 */
export function formatSize(sizeInBytes) {
	if (sizeInBytes < 1024) {
		return `${sizeInBytes} bytes`;
	} else if (sizeInBytes < 1024 * 1024) {
		return `${(sizeInBytes / 1024).toFixed(2)} KB`;
	} else if (sizeInBytes < 1024 * 1024 * 1024) {
		return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
	} else {
		return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
	}
}

export async function getDates(collectionName: string) {
	// Send a GET request to the endpoint that retrieves the data from the MongoDB database
	const response = await fetch(`/api/${collectionName}`);
	const data = await response.json();
	// Check if the entryList array is empty
	if (data.entryList.length === 0) {
		// Return an object with '-' for each field
		return {
			created: '-',
			updated: '-',
			revision: '-'
		};
	} else {
		// Get the first entry from the entryList array
		const result = data.entryList[0];
		// Convert the timestamps to Date objects or '-' if null
		const options: Intl.DateTimeFormatOptions = {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		};
		const locale = get(contentLanguage);
		const createdDate = result.createdAt
			? new Date(result.createdAt).toLocaleString(locale, options)
			: '-';
		const updatedDate = result.updatedAt
			? new Date(result.updatedAt).toLocaleString(locale, options)
			: '-';

		// Return the result
		return {
			created: createdDate,
			updated: updatedDate,
			revision: result.revision || '-'
		};
	}
}

//TODO: is this actually required as all is done via DB?
// Replaces the locale slug in a URL.
//
// If the `full` argument is set to `true`, the full URL is returned as a string.
// e.g. https://mywebsite.com/en/blog/article-1 => https://mywebsite.com/de/blog/article-1
//
// Otherwise (default) the URL relative to the base is returned.
// e.g. https://mywebsite.com/en/blog/article-1 => /de/blog/article-1
export const replaceLocaleInUrl = (url: URL, locale: string, full = false): string => {
	const [, , ...rest] = url.pathname.split('/');
	const new_pathname = `/${[locale, ...rest].join('/')}`;
	if (!full) {
		return `${new_pathname}${url.search}`;
	}
	const newUrl = new URL(url.toString());
	newUrl.pathname = new_pathname;
	return newUrl.toString();
};
