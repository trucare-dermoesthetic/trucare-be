import { db } from "./firebaseAdmin";

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

  console.log("Event Body:", JSON.parse(event.body));

  const { name, email, phone } = JSON.parse(event.body);

  console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);

  const sendAt = new Date();

  await db.collection("registerNewsletter").add({
    name,
    email,
    phone,
    sentAt: sendAt,
  });

  // sendEmail to user
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "TruCare", email: "trucare.carla@gmail.com" },
      to: [{ email: email }],
      subject: "¡Bienvenida/o a TruCare! 💛",
      textContent: `Hola ${name},

          Gracias por unirte a nuestra lista de promociones. A partir de ahora recibirás ofertas exclusivas, ventajas especiales y novedades pensadas para cuidar tu piel y tu bienestar.

          Estoy encantada de acompañarte en este camino.

          Un abrazo,
        TruCare
        `,
    }),
  });

  console.log("response", res);

  // const data = await resTrucare.json();
  // JSON.stringify(data)
  return {
    statusCode: res.ok ? 200 : 400,
    body: "ok",
  };
}
