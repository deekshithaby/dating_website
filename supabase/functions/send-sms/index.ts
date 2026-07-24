const FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2";

function toIndian10Digit(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("91")) {
    return digits.slice(-10);
  }
  if (digits.length === 10) {
    return digits;
  }
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
}

function bearerToken(authorization: string | null): string | null {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }
  return authorization.slice(7).trim();
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const hookSecret = Deno.env.get("SEND_SMS_HOOK_SECRET");
  const apiKey = Deno.env.get("FAST2SMS_API_KEY");

  if (!hookSecret) {
    return new Response(
      JSON.stringify({ error: { message: "Missing SEND_SMS_HOOK_SECRET" } }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: { message: "Missing FAST2SMS_API_KEY" } }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const authHeader = req.headers.get("Authorization") ?? req.headers.get("authorization");
  const token = bearerToken(authHeader);
  if (!token || token !== hookSecret) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Hook requires authorization token",
        },
      }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: { user?: { phone?: string }; sms?: { otp?: string } };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: { message: "Invalid JSON body" } }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const otp = body.sms?.otp;
  const phone = body.user?.phone;

  if (!otp || !phone) {
    return new Response(
      JSON.stringify({ error: { message: "Missing user.phone or sms.otp" } }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const numbers = toIndian10Digit(phone);
  if (!/^[6-9]\d{9}$/.test(numbers)) {
    return new Response(
      JSON.stringify({
        error: { message: `Invalid Indian mobile for Fast2SMS: ${phone}` },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const res = await fetch(FAST2SMS_URL, {
    method: "POST",
    headers: {
      authorization: apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      route: "otp",
      numbers,
      variables_values: otp,
      flash: "0",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    return?: boolean;
    status_code?: number;
    message?: string | string[];
  };

  const failed =
    !res.ok ||
    data.return === false ||
    (typeof data.status_code === "number" && data.status_code >= 400);

  if (failed) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Fast2SMS request failed",
          details: data,
        },
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
