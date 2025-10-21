import docgo from 'docgo-sdk';
import fetch from 'node-fetch';

export default async function analiseTexto(params: any): Promise<void> {
  try {
    if (Array.isArray(params) && params.length === 1 && typeof params[0] === 'object') {
      params = params[0];
    }
    const { texto } = params;
    if (!texto) {
      return console.log(docgo.result(false, null, 'Texto obrigatório'));
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
          { role: 'system', content: 'Analise o texto a seguir.' },
          { role: 'user', content: texto }
        ]
      })
    });
    const data = await response.json() as any;
    return console.log(docgo.result(true, { analise: data.choices?.[0]?.message?.content || '', apiResponse: data }));
  } catch (error: any) {
    return console.log(docgo.result(false, null, error.message));
  }
}
