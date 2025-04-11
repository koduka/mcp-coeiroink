import type { paths } from "@/api/v1/type.js"; // generated by openapi-typescript
import createClient from "openapi-fetch";

const BASE_URL = 'http://host.docker.internal:50032/'

export const client = createClient<paths>({ baseUrl: BASE_URL });