import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { OpportunitiesService } from "./opportunities.service";
import { FindOpportunitiesQuery } from "./dto";
import {
  CurrentUser,
  JwtPayload,
  OptionalJwtGuard,
} from "../auth/jwt.guard";

@Controller("opportunities")
export class OpportunitiesController {
  constructor(private opportunities: OpportunitiesService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  find(
    @Query() query: FindOpportunitiesQuery,
    @CurrentUser() user: JwtPayload | null,
  ) {
    return this.opportunities.find(query, user?.sub);
  }

  @Get(":id")
  @UseGuards(OptionalJwtGuard)
  findById(@Param("id") id: string) {
    return this.opportunities.findById(id);
  }
}
