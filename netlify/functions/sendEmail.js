export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin":
          "https://trucare-dermoesthetic.github.io",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  console.log("Event Body:", event.body);

  const { to, subject, text } = JSON.parse(event.body);

  console.log("BREVO_API_KEY exists:", process.env.BREVO_API_KEY);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
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
