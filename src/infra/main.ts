import { env } from "@/infra/config/env";
import { app } from "./http/app";

app
  .listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`📚 Docs: http://localhost:${env.PORT}/api-docs`);
  })
  .on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Porta ${env.PORT} já está em uso!`);
      console.error(`💡 Rode: netstat -ano | findstr :${env.PORT}`);
      console.error(`💡 Ou pare o Docker/outro processo`);
      process.exit(1);
    }
    throw err;
  });
