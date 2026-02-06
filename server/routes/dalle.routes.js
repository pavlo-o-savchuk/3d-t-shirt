import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.route('/').get((req, res) => {
    res.status(200).json({ message: "Hello from DALL.E ROUTES API" })
})

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        console.log('Generating image with prompt:', prompt);

        const response = await openai.images.generate({
            model: 'dall-e-2',
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json'
        })

        console.log('OpenAI response:', JSON.stringify(response, null, 2));

        const image = response.data[0].b64_json;
        res.status(200).json({ photo: image })

    } catch (error) {
        console.error('Error generating image:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ 
            message: "Something went wrong",
            error: error.message 
        })
    }
})

export default router;