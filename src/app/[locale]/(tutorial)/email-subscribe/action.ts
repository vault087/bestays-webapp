"use server";

export async function subscribe(formData: FormData): Promise<void> {
  const email = formData.get("email");
  console.log(email);
}
