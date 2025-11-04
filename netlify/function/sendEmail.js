export async function handler(event) {
  const { to, subject, text } = JSON.parse(event.body);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "TruCare", email: "no-reply@tudominio.com" },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });

  const data = await res.json();
  return {
    statusCode: res.ok ? 200 : 400,
    body: JSON.stringify(data),
  };
}
