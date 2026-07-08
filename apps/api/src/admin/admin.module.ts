import { Module } from "@nestjs/common";
import { OpportunitiesModule } from "../opportunities/opportunities.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [OpportunitiesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
