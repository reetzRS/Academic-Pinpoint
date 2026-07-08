import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard, Roles } from "../auth/roles.guard";
import { AdminService } from "./admin.service";
import { CreateOpportunityDto, UpdateOpportunityDto } from "./dto";

@Controller("admin/opportunities")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
export class AdminController {
  constructor(private admin: AdminService) {}

  @Post()
  create(@Body() dto: CreateOpportunityDto) {
    return this.admin.create(dto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateOpportunityDto) {
    return this.admin.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.admin.remove(id);
  }
}
