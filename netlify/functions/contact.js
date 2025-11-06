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

  const { name, email, phone, message } = JSON.parse(event.body);

  console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);

  const sendAt = new Date();

  const [resTrucare, resUser] = await Promise.all([
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
        subject: "Nuevo mensaje desde el formulario de contacto 💛",
        textContent: `Has recibido un nuevo mensaje a través de la web:
        Nombre: ${name}
        Email: ${email}
        Teléfono: ${phone}
        Mensaje: ${message}
        Fecha: ${sendAt.toLocaleString()}
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
        subject: "Hemos recibido tu mensaje 💛",
        textContent: ` Hola ${name},

          Gracias por ponerte en contacto conmigo. He recibido tu mensaje y te responderé lo antes posible.
          Mientras tanto, gracias por confiar en TruCare.
          Estoy aquí para ayudarte en lo que necesites.

          Un abrazo,
          TruCare
        `,
      }),
    }),
  ]);

  console.log("responses:", resTrucare.ok, resUser.ok );

  // const data = await resTrucare.json();
  // JSON.stringify(data)
  return {
    statusCode: resTrucare.ok ? 200 : 400,
    body: "ok",
  };
}
