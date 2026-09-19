import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService){}

    @Get()
    findAll(){
        return this.usuariosService.findAll();
    }

    @Get(':/id')
    findOne(@Param('id', ParseIntPipe)id:number){
        return this.usuariosService.findOne(id);
    }

    @Post()
    create(@Body() createUsuarioDto: CreateUsuarioDto){
        return this.usuariosService.create(createUsuarioDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateUsuarioDto: UpdateUsuarioDto,
    ){
        return this.usuariosService.update(id, UpdateUsuarioDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id:number){
        return this.usuariosService.remove(id);
    }


}