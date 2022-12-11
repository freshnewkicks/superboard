import type { Request } from "@remix-run/web-fetch";

export const redirectWithError = async(request: any, error?: string, fallbackUrl?: string) => {
    console.log('See!')
    console.log(request)
}