// Cloudflare Pages Function — vérification TVA via VATcomply

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const country = url.searchParams.get('country');
  const number  = url.searchParams.get('number');

  if (!country || !number) {
    return new Response(JSON.stringify({ error: 'Paramètres country et number requis' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const vatNumber = `${country.toUpperCase()}${number.replace(/[^0-9A-Z]/gi, '')}`;

  try {
    const res  = await fetch(`https://api.vatcomply.com/vat?vat_number=${vatNumber}`);
    const data = await res.json();

    return new Response(JSON.stringify({
      valid:   data.valid,
      name:    data.name         || null,
      address: data.address      || null,
      country: data.country_code || country,
      number:  data.vat_number   || number,
    }), {
      status: 200,
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
