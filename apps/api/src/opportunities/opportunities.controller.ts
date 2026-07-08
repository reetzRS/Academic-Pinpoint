import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { OpportunitiesService } from "./opportunities.service";
import { FindOpportunitiesQuery } from "./dto";
import {
  CurrentUser,
  JwtAuthGuard,
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
  findById(@Param("id") id: string, @CurrentUser() user: JwtPayload | null) {
    return this.opportunities.findById(id, user?.sub);
  }

  @Post(":id/save")
  @UseGuards(JwtAuthGuard)
  save(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.opportunities.save(user.sub, id);
  }

  @Delete(":id/save")
  @UseGuards(JwtAuthGuard)
  unsave(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.opportunities.unsave(user.sub, id);
  }
}
