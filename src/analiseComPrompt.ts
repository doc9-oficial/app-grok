import docgo from 'docgo-sdk';
import fetch from 'node-fetch';

export default async function analiseComPrompt(params: any): Promise<void> {
  try {
    if (Array.isArray(params) && params.length === 1 && typeof params[0] === 'object') {
      params = params[0];
    }
    const { texto, prompt } = params;
    if (!texto || !prompt) {
      return console.log(docgo.result(false, null, 'Texto e prompt obrigatórios'));
    }
    const token = docgo.getEnv('GROK_TOKEN') || docgo.getEnv('grokToken');
    if (!token) {
      return console.log(docgo.result(false, null, 'Token Grok não configurado'));
    }
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-1',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: texto }
        ]
      })
    });
    const data = await response.json() as any;
    return console.log(docgo.result(true, { resposta: data.choices?.[0]?.message?.content || '', apiResponse: data }));
  } catch (error: any) {
    return console.log(docgo.result(false, null, error.message));
  }
}
