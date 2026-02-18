const logger = require('../config/logger');
const i18n = require('../config/i18n');

// Map locale code to language name for the AI prompt
const langMap = {
    it: { name: 'italiano', crops: 'ortaggi', garden: 'orto urbano' },
    en: { name: 'English', crops: 'vegetables', garden: 'urban garden' },
    de: { name: 'Deutsch', crops: 'Gemüse', garden: 'Stadtgarten' }
};

exports.getConsigli = async (req, res) => {
    try {
        const { colture, weather } = req.body;

        if (!colture || !Array.isArray(colture) || colture.length === 0) {
            return res.status(400).json({ message: req.t('errors.missing_colture') });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            logger.error('GROQ_API_KEY not configured');
            return res.status(500).json({ message: req.t('errors.ai_api_key_missing') });
        }

        const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

        // Detect user language from i18n middleware
        const locale = i18n.getLocale(req) || 'it';
        const lang = langMap[locale] || langMap.it;

        // Build weather context
        let weatherContext = '';
        if (weather) {
            weatherContext = `\nCurrent weather: temperature ${weather.temperature}°C, humidity ${weather.humidity}%, wind ${weather.windSpeed} km/h, condition: ${weather.condition}.`;
        }

        const prompt = `You are an expert agronomist. Give exactly 4 practical tips for a citizen growing these ${lang.crops} in their ${lang.garden}: ${colture.join(', ')}.${weatherContext}

Rules:
- Reply ONLY in ${lang.name}
- Format as a numbered list (1. 2. 3. 4.)
- Each tip must be max 2 sentences
- Start each tip with a relevant emoji
- Consider the current season and weather conditions if provided
- Give specific advice for the listed ${lang.crops}
- Do NOT use markdown formatting, just plain text`;


        logger.debug('Generating AI tips', { colture, hasWeather: !!weather, model: modelName });

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            logger.error('Groq API error', { status: response.status, error: errData });

            if (response.status === 429) {
                return res.status(429).json({ message: req.t('errors.ai_rate_limit') });
            }
            throw new Error(errData.error?.message || `Groq API error ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || '';

        logger.info('AI tips generated successfully', { colture: colture.length });
        res.status(200).json({ consigli: text });

    } catch (error) {
        logger.error('Error generating AI tips', { error: error.message });
        res.status(500).json({ message: req.t('errors.generating_consigli'), error: error.message });
    }
};
