import { Field, Float, ObjectType } from "@nestjs/graphql";
import { Config, Data } from "../interfaces/graficas";


@ObjectType()
export class GraficoDto implements Data {
    @Field(  type => [String], {nullable:true})
    labels: string[];
    @Field( type => [DataSets], {nullable: true} )
    datasets: DataSets[];  
}


@ObjectType()
export class DataSets implements Config  {
   
    @Field({nullable:true})
    label: string;

    @Field(type => [String],{nullable:true})
    backgroundColor: string[];
    
    @Field( type => [Float], { nullable:true } )
    data: number[];

} 
