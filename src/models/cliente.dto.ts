import { TelefoneDto } from './telefone.dto';
import { CidadeDto } from './cidade.dto';
import { EnderecoDto } from "./endereco.dto";

export interface ClienteDto {
    id: string;
    nome: string;
    email: string;
    imageUrl?: string;
    cpfOuCnpj?: string;
    senha?: string;
    tipo?: number;
    endereco?: EnderecoDto;
    cidade?: CidadeDto;
    telefones?: TelefoneDto[];
}