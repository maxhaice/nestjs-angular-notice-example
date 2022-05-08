import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class NoteUpdateInput {
  @Field({ nullable: false })
  id: number;
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  text: string;
}
