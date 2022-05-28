import { Context, HttpRequest } from "@azure/functions"

export default async function (context: Context, req: HttpRequest): Promise<void> {
  const authProvider = context.bindingData.authProvider
  const loginRedirect = getRedirectURI(req)

  context.res = {
    status: 307,
    headers: {
      "Location": buildAzureLoginURI(authProvider, loginRedirect)
    }
  }
}

function buildAzureLoginURI(provider: string, redirect: string | null): string {
  let uri = "/.auth/login/" + provider
  if (redirect) {
    uri += "?post_login_redirect_uri=" + redirect
  }

  return uri
}

function getRedirectURI(req: HttpRequest): string | null {
  const url = new URL(req.headers["x-ms-original-url"] as string)
  return url.searchParams.get("redirect")
}