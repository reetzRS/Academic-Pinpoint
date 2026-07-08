import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { OpportunitiesModule } from "../opportunities/opportunities.module";

@Module({
  imports: [OpportunitiesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
