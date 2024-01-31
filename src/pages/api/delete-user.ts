import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabase-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.query;

  const { error: deleteError } = await supabase.functions.invoke(
    "delete-user",
    {
      body: { userId: userId },
    },
  );

  if (deleteError) {
    res.redirect(307, "/delete-account-error");
  } else {
    res.redirect("/delete-account-success");
  }
}
