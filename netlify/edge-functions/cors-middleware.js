export default async (request, context) => {
  const origin = request.headers.get("origin");
  const allowedOrigins = ["https://trucare-dermoesthetic.github.io"];

  if (!allowedOrigins.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  // Permitir que continúe hacia la función real
  const response = await context.next();

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key"
  );

  return response;
};
