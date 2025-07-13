import { listing } from "@/entities/properties-sale-rent/libs/load-properties";

export default async function PropertiesPage() {
  const properties = await listing();
  console.log(properties);
  return <div>{JSON.stringify(properties)}</div>;
}
