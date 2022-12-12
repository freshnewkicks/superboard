import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import React from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { TypedMetaFunction } from "remix-typedjson"

import { safeRedirect, validateEmail } from "~/utils/utils";
import { verifyLogin } from "~/models/user.server";
import { createUserSession } from "~/session.server";

export const loader = ({ request }: LoaderArgs) => {

    return typedjson({

    })
}

export const meta: TypedMetaFunction = () => {
    return {
        title: 'User Registration'
    }
}

export const action = async({ request }: ActionArgs) => {
    const FORM_DATA = await request.formData()
    const EMAIL = FORM_DATA.get("email")
    const PASSWORD = FORM_DATA.get("password")
    const REDIRECT_TO = safeRedirect(FORM_DATA.get("redirectTo"), "/")
    const REMEMBER = FORM_DATA.get("remember")

    if (!validateEmail(EMAIL)) {
        return typedjson(
            { errors: { email: "Email is invalid", password: null } },
            { status: 400 }
        )
    }

    if (typeof PASSWORD !== "string" || PASSWORD.length === 0) {
        return typedjson(
            { errors: { password: "Password is required", email: null } },
            { status: 400 }
        )
    }

    if (PASSWORD.length < 8) {
        return typedjson(
            { errors: { password: "Password is too short", email: null } },
            { status: 400 }
        )
    }

    const USER = await verifyLogin(EMAIL, PASSWORD)

    if (!USER) {
        return typedjson(
            { errors: { email: "Invalid email or password", password: null } },
            { status: 400}
        )
    }

    return createUserSession({
        request,
        userId: USER.id,
        remember: REMEMBER === "on" ? true : false,
        redirectTo: REDIRECT_TO
    })
}

export const UserForm = () => {
    const LOADER = useTypedLoaderData<typeof loader>()
    const ACTION_DATA = useActionData<typeof action>()

    const [SEARCH_PARAMS] = useSearchParams()
    const REDIRECT_TO = SEARCH_PARAMS.get("redirectTo") || "/"

    const emailRef = React.useRef<HTMLInputElement>(null)
    const passwordRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        console.log(ACTION_DATA)
    }, [ACTION_DATA])

    React.useEffect(() => {
        if (ACTION_DATA?.errors?.email) {
            emailRef.current?.focus()
        } else if (ACTION_DATA?.errors?.password) {
            passwordRef.current?.focus()
        }
    }, [])

    return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="border-2 border-black rounded-md space-y-6 p-2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={ACTION_DATA?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {ACTION_DATA?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {ACTION_DATA?.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={ACTION_DATA?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {ACTION_DATA?.errors?.password && (
                <div className="pt-1 text-red-700" id="password-error">
                  {ACTION_DATA?.errors.password}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={REDIRECT_TO} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/login",
                  search: REDIRECT_TO.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}