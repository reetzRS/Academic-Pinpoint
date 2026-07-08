import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? "dev-secret-nao-usar-em-producao",
      signOptions: { expiresIn: "7d" },
    }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
