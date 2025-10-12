const {default: axios} = require('axios');
const fs = require('fs');
const path = require('path');
const {fileURLToPath} = require('url');
const {HUGGING_FACE_API_URL} = process.env;
const {HUGGING_FACE_API_KEY} = process.env;

const documentsPath = path.resolve(__dirname, '../../data/documents.json'); // No-undef
const documents = JSON.parse(fs.readFileSync(documentsPath, 'utf-8'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findRelevantDocs(question) {
	const lowerQuestion = question.toLowerCase();

	return documents
		.filter(doc =>
			doc.content.toLowerCase().includes(lowerQuestion.split(' ')[0]))
		.map(doc => doc.content)
		.join(' ');
}

async function trySpacesModel(question, context) {
	const prompt = `Context: ${context}\nQuestion: ${question}\nAnswer:`;

	try {
		// Use a model that's actually for text generation
		const response = await axios.post(
			'https://api-inference.huggingface.co/models/google/flan-t5-base', // Text generation model
			{
				inputs: prompt,
				parameters: {
					max_new_tokens: 100, // eslint-disable-line camelcase
					temperature: 0.7,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
				},
				timeout: 30000,
			},
		);

		console.log('Response:', response.data);
		return response.data;
	} catch (e) {
		console.log('Model error:', e.response?.status, e.message);
		throw e;
	}
}

async function getAnswerFromModel(question, context) {
	try {
		if (!context) {
			return {answer: 'No relevant information found.'};
		}

		const response = await axios.post(
			HUGGING_FACE_API_URL,
			{
				inputs: {
					question: 'what is procircle',
					context,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
					'Content-Type': 'application/json',
				},
			},
		);

		return {answer: response.data?.answer || 'No answer found.'};
	} catch (error) {
		console.error(
			'Error calling Hugging Face API:',
			error.response?.data || error.message,
		);
		throw new Error('Failed to get answer from Hugging Face model.');
	}
}

module.exports = {findRelevantDocs, getAnswerFromModel, trySpacesModel};
