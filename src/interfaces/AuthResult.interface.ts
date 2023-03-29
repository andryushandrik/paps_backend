import { User } from '@prisma/client';
import { Tokens } from './Tokens.interface';
export default interface AuthResult {
    user: Omit<User, 'password'>;
    tokens: Tokens;
}
