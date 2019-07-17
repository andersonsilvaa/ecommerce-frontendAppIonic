import { EstadoDto } from "./estado.dto";

export interface CidadeDto {
    id: string;
    descricao: string;
    estado?: EstadoDto;
}