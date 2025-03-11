const { client } = require('../config/openAI');

const checkForGrammaticalErrors = async (req, res) => {
    const { text } = req.body;

    try {
        let token_usage = 0;
        const prompt = `
            You are an expert in English grammar and spelling correction. I will provide you with a passage of text. Identify all grammar, spelling, or incorrect word usage errors.

            Return the original text with the same formatting (including line breaks) but wrap incorrect words or phrases with \`<span class="highlight-error">...</span>\`. If possible, provide the correct word next to it in parentheses and wrap correct words or phrases with \`<span class="highlight-success">...</span>\`.

            Here is an example:
                **Input:**
                    \`\`\`
                    This is a simple exampel.
                    It helps to demostrate the grammer check.
                    \`\`\`
                **Output:**
                    \`\`\`
                    This is a simple <span class="highlight-error">exampel</span> <span class="highlight-success">(example)</span>.
                    It helps to <span class="highlight-error">demostrate</span> <span class="highlight-success">(demonstrate)</span> the <span class="highlight-error">grammer</span> <span class="highlight-success">(grammar)</span> check.
                    \`\`\`

            Preserve the text structure and only highlight mistakes.

            The returned content is just the text content that has been checked. Does not contain Output and \`\`\` above and below the content.

            Here is the text to check:
            ${text}
        `
        const chatCompletion = await client.chat.completions.create({
            messages: [
                { role: 'user', content: prompt }
            ],
            model: 'gpt-4o-mini',
        });
        token_usage = chatCompletion.usage.prompt_tokens
        token_usage += chatCompletion.usage.completion_tokens

        let textContent = chatCompletion.choices[0].message.content.trim();
        if (textContent.startsWith('**Output:**')) {
            textContent = textContent.split('**Output:**')[1].trim();
            if (textContent.startsWith('\`\`\`')) {
                textContent = textContent.split('\`\`\`')[1].trim();
            }
            if (textContent.endsWith('\`\`\`')) {
                textContent = textContent.split('\`\`\`')[0].trim();
            }
        }
        res.status(200).json({
            message: 'Success',
            data: textContent,
            token_usage
        });
    } catch (error) {
        res.status(500).json({ message: 'Error server', error });
    }
}

module.exports = { checkForGrammaticalErrors };