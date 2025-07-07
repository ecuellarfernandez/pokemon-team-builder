/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonMovimiento } from '../entities';

@ValidatorConstraint({ name: 'isPokemonMovesValid', async: true })
@Injectable()
export class IsPokemonMovesValidConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(PokemonMovimiento)
    private pokemonMovimientoRepository: Repository<PokemonMovimiento>,
  ) {}

  async validate(
    movimientoIds: string[],
    args: ValidationArguments,
  ): Promise<boolean> {
    if (!movimientoIds || movimientoIds.length === 0) return true;

    const object = args.object as any;
    const pokemonId = object.pokemon_id;

    if (!pokemonId) return true; // Si no hay pokemon_id, no podemos validar

    const allowedMovimientos = await this.pokemonMovimientoRepository.find({
      where: { pokemon_id: pokemonId },
    });

    const allowedMovimientoIds = allowedMovimientos.map(
      (pm) => pm.movimiento_id,
    );

    return movimientoIds.every((movId) => allowedMovimientoIds.includes(movId));
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Algunos movimientos no están permitidos para este Pokémon';
  }
}

export function IsPokemonMovesValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPokemonMovesValidConstraint,
    });
  };
}
