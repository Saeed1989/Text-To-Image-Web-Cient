// app/api/generate/route.js
export async function POST(req) {
  const body = await req.json();
  const { prompt } = body;

  try {
    const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: 'blurry, low quality',
        steps: 20,
        cfg_scale: 7,
        width: 512,
        height: 512,
        sampler_name: 'Euler a',
      }),
    });

    const data = await response.json();
    const base64 = data.images[0];
    const imageUrl = `data:image/png;base64,${base64}`;
    return Response.json({ imageUrl });
  } catch (err) {
    console.error('Image generation error:', err);
    return new Response(JSON.stringify({ error: 'Generation failed' }), { status: 500 });
  }
}