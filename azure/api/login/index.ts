import { Context, HttpRequest } from "@azure/functions"

export default async function (context: Context, req: HttpRequest): Promise<void> {
  context.res = {
    status: 307,
    headers: {
      "Location": buildAzureLoginURI(req)
    }
  }
}

function buildAzureLoginURI(req: HttpRequest): string {
  const loginRedirect = getRedirectURI(req)

  let uri = "/.auth/login" + req.url
  if (loginRedirect) {
    uri += "?post_login_redirect_uri=" + loginRedirect
  }

  return uri
}

function getRedirectURI(req: HttpRequest): string | null {
  const url = new URL(req.headers["x-ms-original-url"] as string)
  return url.searchParams.get("redirect")
}