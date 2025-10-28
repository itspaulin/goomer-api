import { env } from "@/infra/config/env";
import { app } from "./http/app";

export const port = env.PORT;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
