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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTablesDto } from './dto/create-tables.dto';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  async createTable(@Res() response, @Body() createTablesDto: CreateTablesDto) {
    try {
      const newTable = await this.tablesService.createTable(createTablesDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Table has been created successfully',
        newTable,
      });
    } catch (err) {
      if (err && err.response?.statusCode === 403) {
        return response.status(HttpStatus.BAD_REQUEST).json({
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

  @Get('/:tableId')
  async getTable(@Res() response, @Param('tableId') tableId: string) {
    try {
      const existingTable = await this.tablesService.getTable(tableId);
      return response.status(HttpStatus.OK).json({
        message: 'Table found successfully',
        existingTable,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: Table not found!',
        error: `No table for id: ${tableId}`,
      });
    }
  }

  @Patch('/:tableId/add-user/:userId')
  async addTableUser(
    @Res() response,
    @Param('tableId') tableId: string,
    @Param('userId') userId: string,
  ) {
    try {
      const tableData = await this.tablesService.addTableUser(tableId, userId);
      return response.status(HttpStatus.OK).json({
        message: 'User has been successfully added',
        tableData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: User not found!',
        error: `No table for id: ${userId}`,
      });
    }
  }

  @Patch('/:tableId/clear-votes')
  async clearTableVotes(@Res() response, @Param('tableId') tableId: string) {
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
        error: `No table for id: ${tableId}`,
      });
    }
  }

  @Patch('/:tableId/change-vote/:userId/:value')
  async updateTableVote(
    @Res() response,
    @Param('tableId') tableId: string,
    @Param('userId') userId: string,
    @Param('value') value: number,
  ) {
    try {
      const tableData = await this.tablesService.updateTableVote(
        tableId,
        userId,
        value,
      );
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

  @Delete(':tableId/remove-user/:userId')
  async removeTableUser(
    @Res() response,
    @Param('tableId') tableId: string,
    @Param('userId') userId: string,
  ) {
    try {
      const tableData = await this.tablesService.removeTableUser(
        tableId,
        userId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Table user deleted successfully',
        tableData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: User in table not found!',
        error: `No user to be deleted for id: ${userId}`,
      });
    }
  }

  @Delete(':tableId')
  async deleteTable(@Res() response, @Param('tableId') tableId: string) {
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
        error: `No table to be deleted for id: ${tableId}`,
      });
    }
  }
}
