Deno.serve(async (req) => {
  const secret = req.headers.get('x-webhook-secret');
  if (secret !== Deno.env.get('WEBHOOK_SECRET')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const payload = await req.json();
  const record = payload.record as {
    invitation_id: string;
    response: 'accepted' | 'declined';
    created_at: string;
  };

  const isAccepted = record.response === 'accepted';
  const text = [
    `💌 *Новый ответ на приглашение*`,
    ``,
    isAccepted ? `✅ Согласилась\\!` : `❌ Отказала\\.`,
    `Приглашение: \`${record.invitation_id}\``,
    ``,
    `[Посмотреть статус](https://snecah.github.io/date-site/status)`,
  ].join('\n');

  const resp = await fetch(
    `https://api.telegram.org/bot${Deno.env.get('TELEGRAM_TOKEN')}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: Deno.env.get('TELEGRAM_CHAT_ID'),
        text,
        parse_mode: 'MarkdownV2',
      }),
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    console.error('Telegram error:', err);
    return new Response('Telegram error', { status: 500 });
  }

  return new Response('OK', { status: 200 });
});
