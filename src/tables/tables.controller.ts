import {
  Res,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTablesDto } from './dto/create-tables.dto';
import { ChangeUser, TableId, ChangeVote } from './dto/update-table.dto';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  async createTable(@Res() response, @Body() createTablesDto: CreateTablesDto) {
    try {
      const tableData = await this.tablesService.createTable(createTablesDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Table has been created successfully',
        tableData,
      });
    } catch (err) {
      if (err && err.response?.statusCode === 403) {
        return response.status(HttpStatus.FORBIDDEN).json({
          statusCode: err.response.statusCode,
          message: err.response.message,
          error: err.response.error,
        });
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Error: Table not created!',
          error: 'Bad Request',
        });
      }
    }
  }

  @Get()
  async getAllTables(@Res() response) {
    try {
      const tablesData = await this.tablesService.getAllTables();
      return response.status(HttpStatus.OK).json({
        message: 'All tables data found successfully',
        tablesData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: Tables not found!',
        error: 'No tables',
      });
    }
  }

  @Get(':tableId')
  async getTable(@Res() response, @Param('tableId') tableId: string) {
    try {
      const tableData = await this.tablesService.getTable(tableId);
      return response.status(HttpStatus.OK).json({
        message: 'Table found successfully',
        tableData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: Table not found!',
        error: `No table for id: ${tableId}`,
      });
    }
  }

  @Patch('/add-user')
  @UsePipes(ValidationPipe)
  async addTableUser(@Res() response, @Body() changeUser: ChangeUser) {
    try {
      const tableData = await this.tablesService.addTableUser(changeUser);
      return response.status(HttpStatus.OK).json({
        message: 'User has been successfully added',
        tableData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: User not found!',
        error: `No table for id: ${changeUser.userId}`,
      });
    }
  }

  @Patch('clear-votes')
  @UsePipes(ValidationPipe)
  async clearTableVotes(@Res() response, @Body() tableId: TableId) {
    try {
      const tableData = await this.tablesService.clearTableVotes(tableId);
      return response.status(HttpStatus.OK).json({
        message: 'Table votes have been successfully cleared',
        tableData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: Table not found!',
        error: `No table for id: ${tableId.tableId}`,
      });
    }
  }

  @Patch('/change-vote')
  @UsePipes(ValidationPipe)
  async updateTableVote(@Res() response, @Body() changeVote: ChangeVote) {
    try {
      const tableData = await this.tablesService.updateTableVote(changeVote);
      return response.status(HttpStatus.OK).json({
        message: 'Table vote has been successfully updated',
        tableData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: Table or user not found!',
        error: 'Check the data input',
      });
    }
  }

  @Delete('/remove-user')
  @UsePipes(ValidationPipe)
  async removeTableUser(@Res() response, @Body() changeUser: ChangeUser) {
    try {
      const tableData = await this.tablesService.removeTableUser(changeUser);
      return response.status(HttpStatus.OK).json({
        message: 'Table user deleted successfully',
        tableData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: User in table not found!',
        error: `No user to be deleted for id: ${changeUser.userId}`,
      });
    }
  }

  @Delete()
  @UsePipes(ValidationPipe)
  async deleteTable(@Res() response, @Body() tableId: TableId) {
    try {
      const deletedTable = await this.tablesService.deleteTable(tableId);
      return response.status(HttpStatus.OK).json({
        message: 'Table deleted successfully',
        deletedTable,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: Table not found!',
        error: `No table to be deleted for id: ${tableId.tableId}`,
      });
    }
  }
}
