import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CurrentUser, JwtAuthGuard, JwtPayload } from "../auth/jwt.guard";
import { PreferencesDto } from "./dto";

@Controller("me")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  me(@CurrentUser() user: JwtPayload) {
    return this.users.getProfile(user.sub);
  }

  @Put("preferences")
  updatePreferences(
    @CurrentUser() user: JwtPayload,
    @Body() dto: PreferencesDto,
  ) {
    return this.users.updatePreferences(user.sub, dto);
  }
}
