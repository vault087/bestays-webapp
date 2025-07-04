import { getAdminSupabase } from "@cms-data/libs";

export async function config(): Promise<void> {
  try {
    const supabase = await getAdminSupabase();
    const { data, error } = await supabase.auth.getUser();
    if (data.user) {
      console.log("User is authenticated");
    } else {
      console.log("User is not authenticated", error);
    }
  } catch (error) {
    console.log("error", error);
  }
  // if (error) {
  //   throw new Error(error.message);
  // }
  // const user = data.user;
  // if (!user) {
  //   console.log("User not found");
  // } else {
  //   console.log("User found", user);
  // }
  // const
}
