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

  //   await db.collection("registerNewsletter").add({
  //     name,
  //     email,
  //     phone,
  //     sentAt: sendAt,
  //   });

  //   // sendEmail to user
  //   const res = await fetch("https://api.brevo.com/v3/smtp/email", {
  //     method: "POST",
  //     headers: {
  //       accept: "application/json",
  //       "api-key": process.env.BREVO_API_KEY,
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       sender: { name: "TruCare", email: "trucare.carla@gmail.com" },
  //       to: [{ email: email }],
  //       subject: "¡Bienvenida/o a TruCare! 💛",
  //       textContent: `Hola ${name},

  //           Gracias por unirte a nuestra lista de promociones. A partir de ahora recibirás ofertas exclusivas, ventajas especiales y novedades pensadas para cuidar tu piel y tu bienestar.

  //           Estoy encantada de acompañarte en este camino.

  //           Un abrazo,
  //         TruCare
  //         `,
  //     }),
  //   });

  const [dbResponse, trucareResponse, emailResponse] = await Promise.all([
    db.collection("registerNewsletter").add({
      name,
      email,
      phone,
      sentAt: sendAt,
    }),
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "TruCare", email: "trucare.carla@gmail.com" },
        to: [{ email: "trucare.carla@gmail.com" }],
        subject: "Nuevo suscriptor a la newsletter 💛",
        textContent: `Has recibido un nuevo suscriptor a la newsletter:
        Nombre: ${name}
        Email: ${email}
        Teléfono: ${phone}
        Fecha: ${sendAt.toLocaleString()}.


        Puedes descargar la lista completa aqui: https://oscartrujillo.retool.com/apps/e9c56ca6-b9a0-11f0-99bf-079f41019ecf/Untitled/page1
        `,
      }),
    }),
    fetch("https://api.brevo.com/v3/smtp/email", {
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
          Carla
          TruCare
        `,
      }),
    }),
  ]);

  console.log("response", dbResponse, trucareResponse.ok, emailResponse.ok);

  // const data = await resTrucare.json();
  // JSON.stringify(data)
  return {
    statusCode: emailResponse.ok ? 200 : 400,
    body: "ok",
  };
}
