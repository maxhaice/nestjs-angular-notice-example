import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class NoteInput {
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  text: string;
}
