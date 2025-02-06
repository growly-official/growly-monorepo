import { Resolver, ObjectType, Field, Query } from '@nestjs/graphql';

@ObjectType()
export class Ping {
  @Field()
  id: string;
}

@ObjectType()
export class Pong {
  @Field()
  pingId: string;
}

@Resolver(() => Ping)
export class PingPongResolver {
  @Query(() => Ping)
  async ping() {
    const pingId = Date.now();
    return { id: pingId };
  }
}
