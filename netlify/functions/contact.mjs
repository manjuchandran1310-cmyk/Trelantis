export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" },
    })
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const data = await request.text()
    const params = new URLSearchParams(data)
    const submission = {
      name: params.get("name"),
      firm: params.get("firm"),
      email: params.get("email"),
      message: params.get("message"),
      timestamp: new Date().toISOString(),
    }

    console.log("NEW CONTACT SUBMISSION:", JSON.stringify(submission, null, 2))

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
