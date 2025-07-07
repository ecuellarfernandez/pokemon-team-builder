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
import { PokemonHabilidad } from '../entities';

@ValidatorConstraint({ name: 'isPokemonAbilityValid', async: true })
@Injectable()
export class IsPokemonAbilityValidConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(PokemonHabilidad)
    private pokemonHabilidadRepository: Repository<PokemonHabilidad>,
  ) {}

  async validate(
    habilidadId: string,
    args: ValidationArguments,
  ): Promise<boolean> {
    if (!habilidadId) return true;

    const object = args.object as any;
    const pokemonId = object.pokemon_id;

    if (!pokemonId) return true; // Si no hay pokemon_id, no podemos validar

    const allowedHabilidades = await this.pokemonHabilidadRepository.find({
      where: { pokemon_id: pokemonId },
    });

    const allowedHabilidadIds = allowedHabilidades.map((ph) => ph.habilidad_id);

    return allowedHabilidadIds.includes(habilidadId);
  }

  defaultMessage(args: ValidationArguments): string {
    return 'La habilidad seleccionada no está permitida para este Pokémon';
  }
}

export function IsPokemonAbilityValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPokemonAbilityValidConstraint,
    });
  };
}
