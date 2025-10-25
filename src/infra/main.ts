import { env } from "@/infra/config/env";
import { app } from "./http/app";

const port = env.PORT;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
