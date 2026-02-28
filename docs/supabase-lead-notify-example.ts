// Supabase Edge Function example: lead-notify
// Deploy with: supabase functions deploy lead-notify

import { Resend } from 'https://esm.sh/resend@4.0.0';

Deno.serve(async (req) => {
  const body = await req.json();
  const notifyEmail = body?.notifyEmail;
  const lead = body?.lead;

  if (!notifyEmail || !lead) {
    return new Response(JSON.stringify({ error: 'invalid payload' }), { status: 400 });
  }

  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY missing' }), { status: 500 });
  }

  const resend = new Resend(resendKey);
  const subject = `Novo lead LuzzIA: ${lead.name} (${lead.planDays} dias)`;
  const html = `
    <h2>Novo lead cadastrado</h2>
    <p><b>Nome:</b> ${lead.name}</p>
    <p><b>Email:</b> ${lead.email}</p>
    <p><b>WhatsApp:</b> ${lead.whatsapp}</p>
    <p><b>Handle:</b> ${lead.handle || '-'}</p>
    <p><b>Objetivo:</b> ${lead.objective || '-'}</p>
    <p><b>Plano:</b> ${lead.planDays} dias</p>
    <p><b>ClientId:</b> ${lead.clientId || '-'}</p>
    <p><b>LeadToken:</b> ${lead.token}</p>
    <p><b>Consentimento:</b> ${lead.consent ? 'sim' : 'não'}</p>
    <p><b>Criado em:</b> ${lead.createdAt}</p>
  `;

  await resend.emails.send({
    from: 'LuzzIA <onboarding@resend.dev>',
    to: [notifyEmail],
    subject,
    html
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
