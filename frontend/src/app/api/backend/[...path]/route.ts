import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ""
).replace(/\/$/, "");

function buildTargetUrl(request: Request, path: string[]) {
  const url = new URL(request.url);
  const target = `${API_BASE_URL}/${path.join("/")}`;
  return `${target}${url.search}`;
}

function copyResponseHeaders(headers: Headers) {
  const responseHeaders = new Headers();

  for (const [key, value] of headers.entries()) {
    if (key.toLowerCase() === "content-length") {
      continue;
    }
    responseHeaders.set(key, value);
  }

  return responseHeaders;
}

async function handleProxy(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "Missing API base URL configuration" },
      { status: 500 }
    );
  }

  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let token: string;
  try {
    const tokenResult = await auth0.getAccessToken({
      audience: process.env.AUTH0_AUDIENCE,
    });
    token = tokenResult.token;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to obtain access token",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 }
    );
  }

  const { path } = await params;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) {
    headers.set("content-type", contentType);
  }
  if (accept) {
    headers.set("accept", accept);
  }
  headers.set("authorization", `Bearer ${token}`);

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  const upstreamResponse = await fetch(buildTargetUrl(request, path), init);
  const body = await upstreamResponse.arrayBuffer();

  return new NextResponse(body, {
    status: upstreamResponse.status,
    headers: copyResponseHeaders(upstreamResponse.headers),
  });
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
