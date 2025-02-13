import { graphql } from "@/lib/shopify.ts";

export async function handleShopifyGraphql(
  request: Request,
): Promise<Response> {
  const { query, variables } = await request.json();
  const data = await graphql(query, variables);
  return Response.json(data);
}
