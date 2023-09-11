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
      const newUser = await this.tablesService.createTable(createTablesDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Table has been created successfully',
        newUser,
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

  @Get('/:id')
  async getTable(@Res() response, @Param('id') id: string) {
    try {
      const existingTable = await this.tablesService.getTable(id);
      return response.status(HttpStatus.OK).json({
        message: 'Table found successfully',
        existingTable,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: Table not found!',
        error: `No table for id: ${id}`,
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
      const existingTableVotes = await this.tablesService.addTableUser(
        tableId,
        userId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Table votes have been successfully cleared',
        existingTableVotes,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Patch('/:tableId/clear-votes')
  async clearTableVotes(@Res() response, @Param('tableId') tableId: string) {
    try {
      const existingTableVotes = await this.tablesService.clearTableVotes(
        tableId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Table votes have been successfully cleared',
        existingTableVotes,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
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
      const existingTableVotes = await this.tablesService.updateTableVote(
        tableId,
        userId,
        value,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Table vote has been successfully updated',
        existingTableVotes,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete(':id')
  async deleteTable(@Res() response, @Param('id') id: string) {
    try {
      const deletedTable = await this.tablesService.deleteTable(id);
      return response.status(HttpStatus.OK).json({
        message: 'Table deleted successfully',
        deletedTable,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 404,
        message: 'Error: Table not found!',
        error: `No table to be deleted for id: ${id}`,
      });
    }
  }
}
