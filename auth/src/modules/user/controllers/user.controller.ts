import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserService } from '@user/services/user.service';
import { CreateUserDto } from '@user/dtos/create-user.dto';
import {
  AllUsersQueryParams,
  UserRolesQueryParams,
  UserStatusesQueryParams,
} from '@user/dtos/query-params.dto';

import { USER_BASE_ROUTE } from '@user/constants/routes.const';
import { UpdateUserDto } from '@user/dtos/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@auth/models/roles.model';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(RolesGuard)
@Controller(USER_BASE_ROUTE)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/roles')
  public async getAllUserRoles(@Query() queryParams: UserRolesQueryParams) {
    return this.userService.getAllUserRoles(queryParams);
  }

  @Get('/statuses')
  public async getAllUserStatuses(
    @Query() queryParams: UserStatusesQueryParams,
  ) {
    return this.userService.getAllUserStatuses(queryParams);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  public async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Get()
  public async getAllUsers(@Query() queryParams: AllUsersQueryParams) {
    return this.userService.getAllUsers(queryParams);
  }

  @Get('/:id')
  public async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch('/:id')
  public async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, body);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete('/:id')
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
