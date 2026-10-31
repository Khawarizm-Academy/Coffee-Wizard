import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { parseOracleInput } from "./oracle";
import { runOracle } from "./ai/oracle.server";

export const askWizard = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => parseOracleInput(raw))
  .handler(async ({ data }) => runOracle(data, getRequest()?.signal));
