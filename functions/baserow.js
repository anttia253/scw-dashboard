// Cloudflare Pages Function — proxy vers Baserow API
// Évite le CORS depuis le navigateur

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const TOKEN    = env.BASEROW_TOKEN || 'xo1fEgednlOaFVvU6tVSHDtzPwTErgg0';
  const BASE     = 'https://api.baserow.io';

  const table   = url.searchParams.get('table');
  const size    = url.searchParams.get('size')    || '20';
  const page    = url.searchParams.get('page')    || '1';
  const filters = url.searchParams.get('filters') || '';
  const orderBy = url.searchParams.get('order_by')|| '';

  if (!table) {
    return new Response(JSON.stringify({ error: 'Paramètre table manquant' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let apiUrl = `${BASE}/api/database/rows/table/${table}/?user_field_names=true&size=${size}&page=${page}`;
  if (filters) apiUrl += `&${filters}`;
  if (orderBy) apiUrl += `&order_by=${orderBy}`;

  try {
    const res  = await fetch(apiUrl, {
      headers: { Authorization: `Token ${TOKEN}` }
    });
    const data = await res.text();

    return new Response(data, {
      status: res.status,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
