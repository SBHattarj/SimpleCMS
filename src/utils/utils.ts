import fs from 'fs';
import axios from 'axios';
import collections, { collection } from '../collections';
import { Blob } from 'buffer';
import type { Schema } from '@src/collections/types';
import { get } from 'svelte/store';
import { contentLanguage } from '@src/stores/store';
import { entryData, mode } from '@src/stores/store';

// lucia
import type { Auth } from 'lucia-auth';
import type { User } from '@src/collections/Auth';

import {
	PUBLIC_MEDIA_FOLDER,
	PUBLIC_IMAGE_SIZES,
	PUBLIC_MEDIA_OUTPUT_FORMAT
} from '$env/static/public';
import { browser } from '$app/environment';

export const config = {
	headers: {
		'Content-Type': 'multipart/form-data'
	}
};

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
					if (!val && val !== false) return undefined;
					else if (key == 'schema') return undefined;
					else if (key == 'display' && val.default == true) return undefined;
					else if (key == 'display') return '🗑️' + val + '🗑️';
					else if (key == 'widget') return { key: val.key };
					else if (key == 'relation') return '🗑️' + val + '🗑️';
					else if (typeof val === 'function') {
						return '🗑️' + val + '🗑️';
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
export async function saveFiles(data: FormData, collectionName: string) {
	if (browser) return;
	let sharp = (await import('sharp')).default;
	let files: any = {};
	let _files: Array<any> = [];
	//console.log('PUBLIC_IMAGE_SIZES:', PUBLIC_IMAGE_SIZES);

	let env_sizes = JSON.parse(PUBLIC_IMAGE_SIZES) as { [key: string]: number };
	const SIZES = { ...env_sizes, original: 0, thumbnail: 200 } as const;

	let collection = collections.find((collection) => collection.name === collectionName);
	//console.log('collection:', collection);

	for (let [fieldname, fieldData] of data.entries()) {
		if (fieldData instanceof Blob) {
			_files.push({ blob: fieldData, fieldname });
		}
	}

	for (let file of _files) {
		let { blob, fieldname } = file;
		let name = removeExtension(blob.name);
		let sanitizedFileName = sanitize(name);
		// TODO Define collection IDs
		let id = _findFieldByTitle(collection, fieldname).id;
		console.log('id', id);
		let path = _findFieldByTitle(collection, fieldname).path;
		console.log('path', path);
		let url = `/media/${path}/${collectionName}/${id}/original/${sanitizedFileName}`;
		console.log('url', url);

		let outputFormat = PUBLIC_MEDIA_OUTPUT_FORMAT || 'original';
		let mimeType =
			outputFormat === 'webp' ? 'image/webp' : outputFormat === 'avif' ? 'image/avif' : blob.type;

		// display more image data
		files[fieldname as keyof typeof files] = {
			original: {
				name: sanitizedFileName,
				url,
				size: blob.size,
				type: mimeType,
				lastModified: blob.lastModified
			}
		};

		if (!fs.existsSync(`${PUBLIC_MEDIA_FOLDER}/${path}/${collectionName}/${id}`)) {
			for (let size in SIZES) {
				fs.mkdirSync(`${PUBLIC_MEDIA_FOLDER}/${path}/${collectionName}/${id}/${size}`, {
					recursive: true
				});
			}
		}

		// Original, Thumbnail and responsive images as PUBLIC_IMAGE_SIZES
		// Image type according to PUBLIC_MEDIA_OUTPUT_FORMAT 'o'rignial, webp, avif'
		for (let size in SIZES) {
			if (size == 'original') continue;
			let fullName =
				outputFormat === 'original'
					? `${sanitizedFileName}.${blob.type.split('/')[1]}`
					: `${sanitizedFileName}.${outputFormat}`;
			let arrayBuffer = await blob.arrayBuffer();
			const thumbnailBuffer = await sharp(Buffer.from(arrayBuffer))
				.rotate() // Rotate image according to EXIF data
				.resize({ width: SIZES[size] })
				.toFormat(outputFormat === 'webp' ? 'webp' : 'avif', {
					quality: outputFormat === 'webp' ? 80 : 50
				})
				.toBuffer();

			fs.writeFileSync(
				`${PUBLIC_MEDIA_FOLDER}/${path}/${collectionName}/${id}/${size}/${fullName}`,
				thumbnailBuffer
			);
			let url = `/media/${path}/${collectionName}/${id}/${size}/${fullName}`;
			files[fieldname as keyof typeof files][size] = {
				name: fullName,
				url,
				size: blob.size,
				type: mimeType,
				lastModified: blob.lastModified
			};
		}

		if (outputFormat !== 'original') {
			const optimizedOriginalBuffer = await sharp(Buffer.from(await blob.arrayBuffer()))
				.rotate() // Rotate image according to EXIF data
				.toFormat(outputFormat === 'webp' ? 'webp' : 'avif', {
					quality: outputFormat === 'webp' ? 80 : 50
				})
				.toBuffer();

			fs.writeFileSync(
				`${PUBLIC_MEDIA_FOLDER}/${path}/${collectionName}/${id}/original/${sanitizedFileName}.${outputFormat}`,
				optimizedOriginalBuffer
			);
		} else {
			(blob as Blob).arrayBuffer().then((arrayBuffer) => {
				fs.writeFileSync(
					`${PUBLIC_MEDIA_FOLDER}/${path}/${collectionName}/${id}/original/${sanitizedFileName}.${
						blob.type.split('/')[1]
					}`,
					Buffer.from(arrayBuffer)
				);
			});
		}
	}
	return files;
}

function sanitize(str: string) {
	return str.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}

// finds field title that matches the fieldname and returns that field
function _findFieldByTitle(schema: any, fieldname: string): any {
	for (const field of schema.fields) {
		//console.log('field is ', field.db_fieldName, field.label);
		if (field.db_fieldName == fieldname || field.label == fieldname) {
			return field;
		} else if (field.fields && field.fields.length > 0) {
			let result = _findFieldByTitle(field, fieldname);
			if (result) {
				return result;
			}
		}
	}
	return null;
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
	let _query = JSON.stringify(query);
	return (await axios.get(`/api/find?collection=${collection.name}&query=${_query}`)).data;
}

// Finds document in collection with specified ID
export async function findById(id: string, collection: Schema) {
	if (!id || !collection) return;
	return (await axios.get(`/api/find?collection=${collection.name}&id=${id}`)).data;
}

// Returns field's database field name or label
export function getFieldName(field: any) {
	return (field?.db_fieldName || field?.label) as string;
}

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
	let $mode = _mode || get(mode);
	let $collection = _collection || get(collection);
	let $entryData = get(entryData);
	let formData = data instanceof FormData ? data : await col2formData(data);
	if (_mode === 'edit' && !id) {
		throw new Error('ID is required for edit mode.');
	}
	if (!formData) return;
	switch ($mode) {
		case 'create':
			return await axios.post(`/api/${$collection.name}`, formData, config).then((res) => res.data);
		case 'edit':
			formData.append('_id', id || $entryData._id);
			return await axios
				.patch(`/api/${$collection.name}`, formData, config)
				.then((res) => res.data);
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

function removeExtension(fileName) {
	const lastDotIndex = fileName.lastIndexOf('.');
	if (lastDotIndex === -1) {
		// If the file has no extension, return the original fileName
		return fileName;
	}
	return fileName.slice(0, lastDotIndex);
}

export let asAny = (value: any) => value;
